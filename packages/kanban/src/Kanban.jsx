import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { makeStyledTextDataUri } from "../../../src/common-components/StyledText.js";
import {
  Alert,
  AutoGrid,
  Box,
  Button,
  Checkbox,
  DateInput,
  DescriptionList,
  DescriptionListItem,
  Divider,
  Dropdown,
  EmptyState,
  Flex,
  Icon,
  Image,
  Inline,
  Link,
  LoadingSpinner,
  Modal,
  ModalBody,
  MultiSelect,
  SearchInput,
  Select,
  Statistics,
  StatisticsItem,
  StatisticsTrend,
  Tag,
  Text,
  Tile,
} from "@hubspot/ui-extensions";

// ---------------------------------------------------------------------------
// Kanban — drag-free board component for HubSpot UI Extensions.
// v0.2: DataTable-parity toolbar (debounced search, fuzzy matching,
// select/multiselect/dateRange filters, active-filter chips, overflow toggle,
// Clear all) plus DataTable-parity selection bar (icon-in-action-button,
// renderSelectionBar escape hatch). Otherwise unchanged from v0.1: card
// anatomy, per-column pagination, stage control, collapsed rail with rotated
// SVG labels.
// ---------------------------------------------------------------------------

const DEFAULT_DENSITY = "compact";
const DEFAULT_MAX_CARDS = 10;
const DEFAULT_MAX_EXPANDED = 50;
// 350px min — at narrower widths cards start truncating title/owner lines
// aggressively and the avatar row collides with the actions row.
const DEFAULT_COLUMN_WIDTH = 350;
const MIN_COLUMN_WIDTH = 350;
// 4 inline filters matches what fits on a typical board header before needing
// the Advanced-filters drawer (most filters are compact Select/MultiSelect).
const DEFAULT_FILTER_INLINE_LIMIT = 4;
// 250ms debounce on search — feels instant in the input, but collapses rapid
// keystrokes into one callback. Users who need synchronous search can pass 0.
const DEFAULT_SEARCH_DEBOUNCE = 250;
// HubSpot's native deal card truncates titles around two visible lines at
// ~280px card width — 60 characters is the empirical sweet spot that matches
// their "KDDI America] on call media converter replacement work…" example.
const DEFAULT_TITLE_TRUNCATE = 60;

// Apply char-count truncation to plain-string field values. React nodes
// (from a field's custom .render) pass through unchanged so callers retain
// full control over rendering.
const applyTruncate = (value, truncate, fallback) => {
  if (truncate === false) return value;
  if (typeof value !== "string") return value;
  const limit =
    typeof truncate === "number"
      ? truncate
      : truncate === true
        ? (fallback || DEFAULT_TITLE_TRUNCATE)
        : (fallback || DEFAULT_TITLE_TRUNCATE);
  if (value.length <= limit) return value;
  return value.slice(0, limit).trimEnd() + "…";
};

const DEFAULT_LABELS = {
  search: "Search cards...",
  // Only the total is surfaced — callers asked for a single headline number
  // rather than a "loaded / total" fraction. Fall back to the bare label when
  // no total is known.
  showMore: (_shown, total) => (total ? `Show more (${total})` : "Show more"),
  showLess: "Show less",
  loadMore: (_loaded, total) => (total ? `Load more (${total})` : "Load more"),
  loadingMore: "Loading...",
  retryLoadMore: "Retry",
  emptyColumn: "—",
  emptyTitle: "No cards",
  emptyMessage: "Nothing matches the current filters.",
  loading: "Loading board...",
  errorTitle: "Something went wrong.",
  errorMessage: "An error occurred while loading data.",
  cardCount: (n) => String(n),
  moveTo: "Move",
  clearAll: "Clear all",
  selectAll: (count, label) => `Select all ${count} ${label}`,
  deselectAll: "Deselect all",
  selected: (count, label) => `${count} ${label} selected`,
  filtersButton: "Filters",
  dateFrom: "From",
  dateTo: "To",
  sortButton: "Sort",
  sortAscending: "Ascending",
  sortDescending: "Descending",
  metricsButton: "Metrics",
};

// ---------------------------------------------------------------------------
// Rotated text for the collapsed-rail stage label and count tag is now
// handled by the shared `SvgText` primitive from common-components. Kept here
// as thin wrappers so the rail rendering stays readable.
// ---------------------------------------------------------------------------

const makeRotatedTagDataUri = (label) =>
  makeStyledTextDataUri(label, {
    variant: "microcopy",
    format: { fontWeight: "demibold" },
    orientation: "vertical-down",
    background: { preset: "tag" },
  });

const makeRotatedLabelDataUri = (label) =>
  makeStyledTextDataUri(label, {
    variant: "bodytext",
    format: { fontWeight: "demibold" },
    orientation: "vertical-down",
  });

// ---------------------------------------------------------------------------
// Filter helpers — ported from DataTable. These let the toolbar support three
// filter control types (Select / MultiSelect / DateRange) with per-type empty
// values, activeness checks, and human-readable chip labels.
// ---------------------------------------------------------------------------

const getEmptyFilterValue = (filter) => {
  const type = filter.type || "select";
  if (type === "multiselect") return [];
  if (type === "dateRange") return { from: null, to: null };
  return "";
};

const isFilterActive = (filter, value) => {
  const type = filter.type || "select";
  if (type === "multiselect") return Array.isArray(value) && value.length > 0;
  if (type === "dateRange") return value && (value.from || value.to);
  return !!value;
};

const formatDateChip = (dateObj) => {
  if (!dateObj) return "";
  const { year, month, date } = dateObj;
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
  }).format(new Date(year, month, date));
};

const dateToTimestamp = (dateObj) => {
  if (!dateObj) return null;
  return new Date(dateObj.year, dateObj.month, dateObj.date).getTime();
};

const toStableKey = (value) => {
  try {
    return JSON.stringify(value);
  } catch (_error) {
    return String(value);
  }
};

const canStageReceiveRow = (stage, row, canMove) => {
  if (!stage) return false;
  if (typeof canMove === "function" && !canMove(row, stage.value)) return false;
  if (typeof stage.canEnter === "function" && !stage.canEnter(row)) return false;
  return true;
};

const isFieldDirectionSortOption = (option) =>
  !!(
    option &&
    option.field &&
    (option.direction === "asc" || option.direction === "desc")
  );

// ---------------------------------------------------------------------------
// Card divider resolution
// ---------------------------------------------------------------------------

const resolveDividers = (cardDividers, density) => {
  if (cardDividers === true) {
    return { afterTitle: true, afterSubtitle: true, afterBody: true, afterFooter: true };
  }
  if (cardDividers === false) {
    return { afterTitle: false, afterSubtitle: false, afterBody: false, afterFooter: false };
  }
  if (cardDividers && typeof cardDividers === "object") {
    return {
      afterTitle: cardDividers.afterTitle ?? false,
      afterSubtitle: cardDividers.afterSubtitle ?? false,
      afterBody: cardDividers.afterBody ?? false,
      afterFooter: cardDividers.afterFooter ?? false,
    };
  }
  // Default: comfortable density gets dividers between every region (matches
  // the prototype lead board); compact density gets a single `afterBody`
  // divider (the native HubSpot deal card pattern — separator between the
  // body content and the footer action row, nothing else).
  if (density === "comfortable") {
    return { afterTitle: true, afterSubtitle: true, afterBody: true, afterFooter: true };
  }
  return { afterTitle: false, afterSubtitle: false, afterBody: true, afterFooter: false };
};

// ---------------------------------------------------------------------------
// Card field partitioning
// ---------------------------------------------------------------------------

const partitionFields = (cardFields) => {
  const buckets = { title: null, subtitle: null, meta: [], body: [], footer: [] };
  for (const field of cardFields || []) {
    const placement = field.placement || "body";
    if (placement === "title" && !buckets.title) buckets.title = field;
    else if (placement === "subtitle" && !buckets.subtitle) buckets.subtitle = field;
    else if (placement === "meta") buckets.meta.push(field);
    else if (placement === "footer") buckets.footer.push(field);
    else buckets.body.push(field);
  }
  return buckets;
};

const resolveFieldValue = (field, row) => {
  if (!field) return undefined;
  if (field.field && row && Object.prototype.hasOwnProperty.call(row, field.field)) {
    return row[field.field];
  }
  return undefined;
};

const resolveHref = (href, row) => {
  if (!href) return null;
  if (typeof href === "function") return href(row);
  return href;
};

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

const KanbanCard = ({
  row,
  rowId,
  stage,
  stages,
  fields,
  density,
  dividers,
  bodyAs,
  maxBodyLines,
  stageControl,
  stageControlPlacement,
  canMove,
  onStageChangeRequest,
  isChanging,
  selectable,
  selected,
  onToggleSelect,
  labels,
}) => {
  const titleHref = fields.title ? resolveHref(fields.title.href, row) : null;
  const rawTitleValue = fields.title
    ? fields.title.render
      ? fields.title.render(resolveFieldValue(fields.title, row), row)
      : resolveFieldValue(fields.title, row)
    : null;

  // Titles truncate by default (60 chars + ellipsis) to prevent wildly long
  // deal names from stretching cards. Opt out with `truncate: false` or
  // tune the limit with `truncate: 40`. Non-string renders pass through.
  const titleValue =
    fields.title && typeof rawTitleValue === "string"
      ? applyTruncate(rawTitleValue, fields.title.truncate, DEFAULT_TITLE_TRUNCATE)
      : rawTitleValue;

  const titleNode = titleHref ? (
    <Link href={titleHref}>{titleValue}</Link>
  ) : (
    <Text format={{ fontWeight: "demibold" }}>{titleValue}</Text>
  );

  const metaNodes = fields.meta
    .filter((f) => !f.visible || f.visible(row))
    .map((f) => {
      const val = resolveFieldValue(f, row);
      return (
        <Text key={f.field || f.label} variant="microcopy">
          {f.render ? f.render(val, row) : val}
        </Text>
      );
    });

  const showSubtitle = density === "comfortable" && fields.subtitle;
  const subtitleNode = showSubtitle
    ? (fields.subtitle.render
      ? fields.subtitle.render(resolveFieldValue(fields.subtitle, row), row)
      : resolveFieldValue(fields.subtitle, row))
    : null;

  const bodyFields = fields.body
    .filter((f) => !f.visible || f.visible(row))
    .slice(0, maxBodyLines);

  const footerFields = fields.footer.filter((f) => !f.visible || f.visible(row));
  // Convention: the LAST footer field is the "actions" row (shares a row with
  // the move control, right-anchored). Everything before it is treated as an
  // "alert" — stacked full-width above, so a priority tag or similar callout
  // sits visually above the [move | actions] row.
  const footerAlerts = footerFields.slice(0, -1);
  const footerActionsField = footerFields.length > 0 ? footerFields[footerFields.length - 1] : null;

  const renderFooterField = (f, idx) => {
    const val = resolveFieldValue(f, row);
    const rendered = f.render ? f.render(val, row) : val;
    const key = f.key || f.field || f.label || `footer-${idx}`;
    return <React.Fragment key={key}>{rendered}</React.Fragment>;
  };

  const stageControlNode = stageControl === "none" ? null : (
    <StageControl
      row={row}
      rowId={rowId}
      currentStage={stage}
      stages={stages}
      canMove={canMove}
      isChanging={isChanging}
      mode={stageControl}
      onStageChangeRequest={onStageChangeRequest}
      labels={labels}
    />
  );

  const titleRow = (
    <Flex direction="row" justify="between" align="center" gap="sm">
      <Box flex={1}>{titleNode}</Box>
      {selectable ? (
        <Checkbox
          name={`kanban-select-${rowId}`}
          checked={selected}
          onChange={() => onToggleSelect(rowId)}
        />
      ) : null}
    </Flex>
  );

  const metaRow =
    metaNodes.length === 0 ? null : (
      <Flex direction="row" justify="end" align="center" gap="xs">
        {metaNodes}
      </Flex>
    );

  const bodyRow =
    bodyFields.length === 0 ? null : (
      bodyAs === "descriptionList" ? (
        <DescriptionList direction="row">
          {bodyFields.map((f, idx) => {
            const val = resolveFieldValue(f, row);
            const rendered = f.render ? f.render(val, row) : val ?? "—";
            const key = f.key || f.field || f.label || `body-${idx}`;
            return (
              <DescriptionListItem key={key} label={f.label || ""}>
                {rendered}
              </DescriptionListItem>
            );
          })}
        </DescriptionList>
      ) : (
        <Flex direction="column" gap="flush">
          {bodyFields.map((f, idx) => {
            const val = resolveFieldValue(f, row);
            const rendered = f.render ? f.render(val, row) : val ?? "—";
            const key = f.key || f.field || f.label || `body-${idx}`;
            return (
              <Text key={key} variant="microcopy">
                {f.label ? (
                  <Text inline variant="microcopy">{`${f.label}: `}</Text>
                ) : null}
                {rendered}
              </Text>
            );
          })}
        </Flex>
      )
    );

  const footerAlertsNode = footerAlerts.length === 0 ? null : (
    <Flex direction="column" gap="xs">
      {footerAlerts.map((f, idx) => renderFooterField(f, idx))}
    </Flex>
  );

  const footerActionsNode = footerActionsField
    ? renderFooterField(footerActionsField, footerFields.length - 1)
    : null;

  const inlineStageControl = stageControlPlacement === "inline" ? stageControlNode : null;
  const separateRowStageControl = stageControlPlacement === "separateRow" ? stageControlNode : null;

  // The "main" footer row hosts the move control (LEFT) + actions (RIGHT).
  // - inline mode: move control renders here; actions get pushed to the far
  //   right via Box flex=1 + inner justify="end".
  // - separateRow mode: inlineStageControl is null, so an empty <Box /> holds
  //   the left slot and actions still right-align on their own row above the
  //   separate-row stage control.
  // align="start" keeps the Dropdown button / Select and the action icons on
  // a clean top baseline.
  const footerMainRow = (inlineStageControl || footerActionsNode) ? (
    <Flex direction="row" justify="between" align="start" gap="sm">
      {inlineStageControl ? (
        <Box alignSelf="center">{inlineStageControl}</Box>
      ) : (
        <Box />
      )}
      {footerActionsNode ? (
        <Box flex={1}>
          <Flex direction="row" justify="end" align="start">
            {footerActionsNode}
          </Flex>
        </Box>
      ) : null}
    </Flex>
  ) : null;

  const footerRow = (!footerAlertsNode && !footerMainRow) ? null : (
    <Flex direction="column" gap="xs">
      {footerAlertsNode}
      {footerMainRow}
    </Flex>
  );

  return (
    <Tile compact={density === "compact"}>
      <Flex direction="column" gap={density === "compact" ? "xs" : "sm"}>
        {titleRow}
        {dividers.afterTitle && (metaRow || bodyRow || footerRow || separateRowStageControl) ? <Divider /> : null}

        {subtitleNode ? (
          <Text variant="microcopy">{subtitleNode}</Text>
        ) : null}
        {dividers.afterSubtitle && subtitleNode && (metaRow || bodyRow || footerRow || separateRowStageControl) ? (
          <Divider />
        ) : null}

        {metaRow}

        {bodyRow}
        {dividers.afterBody && bodyRow && (footerRow || separateRowStageControl) ? <Divider /> : null}

        {footerRow}
        {dividers.afterFooter && footerRow && separateRowStageControl ? <Divider /> : null}

        {separateRowStageControl}
      </Flex>
    </Tile>
  );
};

// ---------------------------------------------------------------------------
// Stage control
// ---------------------------------------------------------------------------

const StageControl = ({
  row,
  rowId,
  currentStage,
  stages,
  canMove,
  isChanging,
  mode,
  onStageChangeRequest,
  labels,
}) => {
  if (isChanging) {
    return <LoadingSpinner size="xs" />;
  }

  const availableStages = (stages || []).filter(
    (stage) => stage.value === currentStage.value || canStageReceiveRow(stage, row, canMove)
  );

  if (mode === "menu") {
    const targetStages = availableStages.filter((stage) => stage.value !== currentStage.value);
    if (targetStages.length === 0) {
      return (
        <Button variant="transparent" size="extra-small" disabled={true}>
          {labels.moveTo}
        </Button>
      );
    }

    return (
      <Dropdown
        variant="transparent"
        buttonText={labels.moveTo}
        buttonSize="xs"
      >
        {targetStages.map((stage) => (
          <Dropdown.ButtonItem
            key={stage.value}
            onClick={() => onStageChangeRequest(row, stage.value, currentStage.value)}
          >
            {stage.shortLabel || stage.label}
          </Dropdown.ButtonItem>
        ))}
      </Dropdown>
    );
  }

  return (
    <Select
      name={`stage-${rowId}`}
      label=""
      value={currentStage.value}
      onChange={(val) => {
        if (val !== currentStage.value) onStageChangeRequest(row, val, currentStage.value);
      }}
      options={availableStages.map((stage) => ({
        label: stage.shortLabel || stage.label,
        value: stage.value,
      }))}
    />
  );
};

// ---------------------------------------------------------------------------
// Column
// ---------------------------------------------------------------------------

const KanbanColumn = ({
  stage,
  rows,
  bucketCount,
  totalCount,
  hasMore,
  loading,
  error,
  onLoadMore,
  expanded,
  onToggleExpanded,
  collapsed,
  onToggleCollapsed,
  columnFooter,
  countDisplay,
  labels,
  children,
}) => {
  // Prefer server-side totalCount (the true stage total) over bucketCount
  // (what's currently loaded). Falls back to bucketCount when no meta is set.
  const countLabel = labels.cardCount(totalCount != null ? totalCount : bucketCount);
  const countNode =
    countDisplay === "text" ? (
      <Text format={{ fontWeight: "demibold" }}>{countLabel}</Text>
    ) : countDisplay === "none" ? null : (
      <Tag variant="subtle">{countLabel}</Tag>
    );

  if (collapsed) {
    const rotated = makeRotatedLabelDataUri(stage.label);
    const rotatedCount =
      countDisplay === "none" ? null : makeRotatedTagDataUri(countLabel);

    const stageIdentifier = stage.icon ? (
      <Icon name={stage.icon} size="sm" screenReaderText={stage.label} />
    ) : (
      <Image
        src={rotated.src}
        width={rotated.width}
        height={rotated.height}
        alt={stage.label}
      />
    );

    return (
      <Tile compact>
        <Flex direction="column" gap="xs" align="center">
          <Button
            variant="transparent"
            size="sm"
            onClick={onToggleCollapsed}
            tooltip={`Expand ${stage.label}`}
          >
            <Icon name="right" size="sm" screenReaderText={`Expand ${stage.label}`} />
          </Button>
          {stageIdentifier}
          {rotatedCount ? (
            <Image
              src={rotatedCount.src}
              width={rotatedCount.width}
              height={rotatedCount.height}
              alt={`${bucketCount} items`}
            />
          ) : null}
        </Flex>
      </Tile>
    );
  }

  const footerContent = stage.footer ? stage.footer(rows) : columnFooter ? columnFooter(rows, stage) : null;

  return (
    <Tile compact>
      <Flex direction="column" gap="xs">
        <Flex direction="row" align="center" justify="between" gap="xs">
          <Flex direction="row" align="center" gap="xs">
            <Text format={{ fontWeight: "demibold" }}>{stage.shortLabel || stage.label}</Text>
            {countNode}
            {loading ? <LoadingSpinner size="xs" /> : null}
          </Flex>
          <Button variant="transparent" size="sm" onClick={onToggleCollapsed} tooltip="Collapse">
            <Icon name="left" size="sm" screenReaderText={`Collapse ${stage.label}`} />
          </Button>
        </Flex>

        {footerContent ? <Text variant="microcopy">{footerContent}</Text> : null}
        <Divider />

        {children}

        {error ? (
          <Alert variant="danger" title={labels.errorTitle}>
            <Flex direction="row" gap="xs" align="center">
              <Text variant="microcopy">{error}</Text>
              {onLoadMore ? (
                <Button variant="transparent" size="xs" onClick={() => onLoadMore(stage.value)}>
                  {labels.retryLoadMore}
                </Button>
              ) : null}
            </Flex>
          </Alert>
        ) : null}

        {!error && hasMore && onLoadMore && !loading && bucketCount > 0 ? (
          <Flex direction="row" justify="center">
            <Link onClick={() => onLoadMore(stage.value)}>
              {labels.loadMore(bucketCount, totalCount)}
            </Link>
          </Flex>
        ) : null}

        {!error && loading && hasMore ? (
          <LoadingSpinner size="sm" layout="centered" label={labels.loadingMore} />
        ) : null}

        {!error && !hasMore && bucketCount > rows.length ? (
          <Flex direction="row" justify="center">
            <Link onClick={onToggleExpanded}>
              {expanded ? labels.showLess : labels.showMore(rows.length, bucketCount)}
            </Link>
          </Flex>
        ) : null}

        {rows.length === 0 && bucketCount === 0 && !loading ? (
          <Text variant="microcopy" format={{ italic: true }}>
            {labels.emptyColumn}
          </Text>
        ) : null}
      </Flex>
    </Tile>
  );
};

// ---------------------------------------------------------------------------
// Sort modal body — renders either:
//   a) HubSpot-native "Select field + direction toggle" on one row (when every
//      sortOption carries `field` + `direction` + `fieldLabel`)
//   b) Flat vertical button list (legacy fallback)
// ---------------------------------------------------------------------------
const SortModalBody = ({ sortOptions, sortValue, onSortChange, labels }) => {
  const hasFieldDirection =
    Array.isArray(sortOptions) &&
    sortOptions.length > 0 &&
    sortOptions.every(isFieldDirectionSortOption);

  if (!hasFieldDirection) {
    return (
      <Flex direction="column" gap="xs">
        {sortOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={sortValue === opt.value ? "primary" : "secondary"}
            onClick={() => onSortChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </Flex>
    );
  }

  const currentOption = sortOptions.find((o) => o.value === sortValue) || sortOptions[0];
  const currentField = currentOption.field;
  const currentDirection = currentOption.direction;

  const uniqueFields = [];
  const seen = new Set();
  for (const opt of sortOptions) {
    if (!seen.has(opt.field)) {
      seen.add(opt.field);
      uniqueFields.push({ value: opt.field, label: opt.fieldLabel || opt.field });
    }
  }

  const fieldOpts = sortOptions.filter((o) => o.field === currentField);
  const ascOption = fieldOpts.find((o) => o.direction === "asc");
  const descOption = fieldOpts.find((o) => o.direction === "desc");

  const handleFieldChange = (newField) => {
    const next =
      sortOptions.find((o) => o.field === newField && o.direction === currentDirection) ||
      sortOptions.find((o) => o.field === newField && o.direction === "desc") ||
      sortOptions.find((o) => o.field === newField);
    if (next) onSortChange(next.value);
  };

  return (
    <Inline align="center" gap="small">
      <Select
        name="kanban-sort-field"
        label=""
        value={currentField}
        onChange={handleFieldChange}
        options={uniqueFields}
      />
      <Inline align="center" gap="flush">
        {descOption ? (
          <Button
            variant={currentDirection === "desc" ? "primary" : "secondary"}
            onClick={() => onSortChange(descOption.value)}
          >
            {labels.sortDescending}
          </Button>
        ) : null}
        {ascOption ? (
          <Button
            variant={currentDirection === "asc" ? "primary" : "secondary"}
            onClick={() => onSortChange(ascOption.value)}
          >
            {labels.sortAscending}
          </Button>
        ) : null}
      </Inline>
    </Inline>
  );
};

// ---------------------------------------------------------------------------
// Toolbar — ported from DataTable.
//   * SearchInput with optional debounce
//   * Inline filter controls up to `filterInlineLimit`
//   * "Filters" overflow button (Icon + label) exposing the rest
//   * Active filter chips with onDelete to clear individual filters
//   * "Clear all" button to reset every filter at once
//   * Three filter types: select (default), multiselect, dateRange
// ---------------------------------------------------------------------------

const renderFilterControl = ({ filter, value, onChange, labels }) => {
  const type = filter.type || "select";

  if (type === "multiselect") {
    return (
      <MultiSelect
        key={filter.name}
        name={`kanban-filter-${filter.name}`}
        label=""
        placeholder={filter.placeholder || "All"}
        value={value || []}
        onChange={(val) => onChange(filter.name, val)}
        options={filter.options}
      />
    );
  }

  if (type === "dateRange") {
    // Dual DateInputs inline, DataTable-style. Note: for the common "quick
    // date filter" pattern (Today / Yesterday / Last 30 days presets),
    // prefer `type: "select"` with preset options — that matches HubSpot's
    // native quick-filter dropdown behavior. Use `dateRange` only when you
    // genuinely need custom from/to pickers.
    const rangeVal = value || { from: null, to: null };
    return (
      <Flex key={filter.name} direction="row" align="center" gap="xs">
        <DateInput
          size="sm"
          name={`kanban-filter-${filter.name}-from`}
          label=""
          placeholder={labels.dateFrom}
          format="medium"
          value={rangeVal.from}
          onChange={(val) => onChange(filter.name, { ...rangeVal, from: val })}
        />
        <Icon name="dataSync" size="sm" />
        <DateInput
          size="sm"
          name={`kanban-filter-${filter.name}-to`}
          label=""
          placeholder={labels.dateTo}
          format="medium"
          value={rangeVal.to}
          onChange={(val) => onChange(filter.name, { ...rangeVal, to: val })}
        />
      </Flex>
    );
  }

  return (
    <Select
      key={filter.name}
      name={`kanban-filter-${filter.name}`}
      variant="transparent"
      placeholder={filter.placeholder || "All"}
      value={value}
      onChange={(val) => onChange(filter.name, val)}
      options={[
        { label: filter.placeholder || "All", value: "" },
        ...filter.options,
      ]}
    />
  );
};

// Renders the metrics panel content. Accepts either an array of stat items
// (shorthand that maps to <Statistics>/<StatisticsItem>/<StatisticsTrend>)
// or a ReactNode for a full render override.
const renderMetricsPanel = (metrics) => {
  if (!metrics) return null;
  if (!Array.isArray(metrics)) return metrics;
  if (metrics.length === 0) return null;
  return (
    <Statistics>
      {metrics.map((m, i) => (
        <StatisticsItem
          key={m.id || m.label || i}
          label={m.label}
          number={m.number != null ? String(m.number) : ""}
        >
          {m.trend ? (
            <StatisticsTrend
              direction={m.trend.direction || "increase"}
              value={m.trend.value}
              color={m.trend.color}
            />
          ) : null}
        </StatisticsItem>
      ))}
    </Statistics>
  );
};

// Toolbar — three-row layout matching HubSpot's native deal board:
//   Row 1: SearchInput (flex=1) | Sort Dropdown | Metrics toggle Button
//   Row 2: Quick filters (inline) + Advanced filters toggle + Show closed
//   Row 2a: Overflow filters when "Advanced filters" is toggled open
//   Row 3: Active filter chips + Clear all
//   Row 4: Metrics panel (<Statistics>) when Metrics is toggled open
const KanbanToolbar = ({
  showSearch,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filters,
  filterValues,
  onFilterChange,
  filterInlineLimit,
  showFilterBadges,
  showClearFiltersButton,
  activeChips,
  onFilterRemove,
  sortOptions,
  sortValue,
  onSortChange,
  metrics,
  showMetrics,
  onToggleMetrics,
  labels,
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const inlineFilters = (filters || []).slice(0, filterInlineLimit);
  const overflowFilters = (filters || []).slice(filterInlineLimit);
  // Button always reads "Sort" — the active option is instead highlighted
  // inside the modal menu so the trigger stays compact and legible.

  return (
    <Flex direction="column" gap="xs">
      {/* Toolbar row — mirrors DataTable: left group (Box flex=3) stacks
          search/filters/chips; right group (Box flex=1) pins Sort + Metrics
          to the far edge, aligned to the top of the left stack. */}
      <Flex direction="row" gap="sm">
        <Box flex={3}>
          <Flex direction="column" gap="sm">
            {/* Row 1a: Search + inline quick filters + Advanced filters toggle */}
            <Flex direction="row" align="center" gap="sm" wrap="wrap">
              {showSearch ? (
                <SearchInput
                  name="kanban-search"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={onSearchChange}
                />
              ) : null}
              {inlineFilters.map((filter) =>
                renderFilterControl({
                  filter,
                  value: filterValues[filter.name],
                  onChange: onFilterChange,
                  labels,
                })
              )}
              {overflowFilters.length > 0 ? (
                <Button
                  variant="transparent"
                  size="small"
                  onClick={() => setShowMoreFilters((prev) => !prev)}
                >
                  <Icon name="filter" size="sm" /> {labels.filtersButton}
                </Button>
              ) : null}
            </Flex>

            {/* Row 1b: Overflow filters (toggled open by Advanced filters button) */}
            {showMoreFilters && overflowFilters.length > 0 ? (
              <Flex direction="row" align="center" gap="sm" wrap="wrap">
                {overflowFilters.map((filter) =>
                  renderFilterControl({
                    filter,
                    value: filterValues[filter.name],
                    onChange: onFilterChange,
                    labels,
                  })
                )}
              </Flex>
            ) : null}

            {/* Row 1c: Active filter chips + Clear all */}
            {activeChips.length > 0 && (showFilterBadges || showClearFiltersButton) ? (
              <Flex direction="row" align="center" gap="sm" wrap="wrap">
                {showFilterBadges
                  ? activeChips.map((chip) => (
                    <Tag
                      key={chip.key}
                      variant="default"
                      onDelete={() => onFilterRemove(chip.key)}
                    >
                      {chip.label}
                    </Tag>
                  ))
                  : null}
                {showClearFiltersButton ? (
                  <Button
                    variant="transparent"
                    size="extra-small"
                    onClick={() => onFilterRemove("all")}
                  >
                    {labels.clearAll}
                  </Button>
                ) : null}
              </Flex>
            ) : null}
          </Flex>
        </Box>

        {/* Right group: Sort + Metrics, pinned far-right. alignSelf="start"
            keeps them level with the top of the left column even when that
            column grows via overflow filters / chips rows. */}
        {(sortOptions?.length > 0 || metrics) ? (
          <Box flex={1} alignSelf="start">
            <Flex direction="row" align="center" gap="sm" justify="end">
              {sortOptions && sortOptions.length > 0 ? (
                <Button
                  variant="secondary"
                  size="small"
                  overlay={
                    <Modal id="kanban-sort-modal" title={labels.sortButton}>
                      <ModalBody>
                        <SortModalBody
                          sortOptions={sortOptions}
                          sortValue={sortValue}
                          onSortChange={onSortChange}
                          labels={labels}
                        />
                      </ModalBody>
                    </Modal>
                  }
                >
                  <Icon name="sortAmtDesc" size="sm" /> {labels.sortButton}
                </Button>
              ) : null}
              {metrics ? (
                <Button variant="secondary" size="small" onClick={onToggleMetrics}>
                  <Icon name="reports" size="sm" /> {labels.metricsButton}
                </Button>
              ) : null}
            </Flex>
          </Box>
        ) : null}
      </Flex>

      {/* Metrics panel below the toolbar */}
      {showMetrics && metrics ? renderMetricsPanel(metrics) : null}
    </Flex>
  );
};

// ---------------------------------------------------------------------------
// Selection bar — ported from DataTable with the renderSelectionBar escape
// hatch. Supports icon-in-button for each action, Select-all-displayed, and
// Deselect-all.
// ---------------------------------------------------------------------------

const DefaultSelectionBar = ({
  selectedIds,
  selectedCount,
  displayCount,
  countLabel,
  allSelected,
  onSelectAll,
  onDeselectAll,
  selectionActions,
  labels,
}) => {
  const pluralForCount = (n) => countLabel(n);
  return (
    <Tile compact>
      {/* Outer Inline with justify="between" splits the bar into two
          clusters: count + Select/Deselect all on the left, selectionActions
          on the right. Inline is HubSpot's primitive specifically for
          horizontal rows of components (per the layout docs). */}
      <Inline align="center" justify="between" gap="small">
        <Inline align="center" gap="small">
          <Text inline format={{ fontWeight: "demibold" }}>
            {typeof labels.selected === "function"
              ? labels.selected(selectedCount, pluralForCount(selectedCount))
              : `${selectedCount} selected`}
          </Text>
          {!allSelected ? (
            <Button variant="transparent" size="extra-small" onClick={onSelectAll}>
              {typeof labels.selectAll === "function"
                ? labels.selectAll(displayCount, pluralForCount(displayCount))
                : labels.selectAll}
            </Button>
          ) : null}
          <Button variant="transparent" size="extra-small" onClick={onDeselectAll}>
            {labels.deselectAll}
          </Button>
        </Inline>
        {(selectionActions || []).length > 0 ? (
          <Inline align="center" gap="extra-small">
            {selectionActions.map((action, i) => (
              <Button
                key={action.key || action.label || i}
                variant={action.variant || "transparent"}
                size="extra-small"
                onClick={() => action.onClick([...selectedIds])}
              >
                {action.icon ? <Icon name={action.icon} size="sm" /> : null} {action.label}
              </Button>
            ))}
          </Inline>
        ) : null}
      </Inline>
    </Tile>
  );
};

// ---------------------------------------------------------------------------
// Kanban — main component
// ---------------------------------------------------------------------------

export const Kanban = ({
  // --- Data ---
  data = [],
  stages = [],
  groupBy = "status",
  rowIdField = "id",

  // --- Card rendering ---
  renderCard,
  cardFields,
  cardDensity = DEFAULT_DENSITY,
  cardDividers,
  cardBodyAs = "descriptionList",
  maxBodyLines,
  maxCardsPerColumn = DEFAULT_MAX_CARDS,
  maxCardsExpanded = DEFAULT_MAX_EXPANDED,
  expandedStages,
  onExpandedStagesChange,

  // --- Per-stage pagination ---
  stageMeta,
  onLoadMore,

  // --- Selection ---
  selectable = false,
  selectedIds,
  onSelectionChange,
  selectionActions,
  recordLabel,
  selectionResetKey,
  resetSelectionOnQueryChange = true,
  showSelectionBar = true,
  renderSelectionBar,

  // --- Stage transitions ---
  stageControl,
  stageControlPlacement,
  onStageChange,
  isStageChanging,
  canMove,

  // --- Toolbar ---
  showSearch = true,
  searchFields,
  searchPlaceholder,
  searchDebounce = DEFAULT_SEARCH_DEBOUNCE,
  fuzzySearch = false,
  fuzzyOptions,
  filters,
  filterInlineLimit = DEFAULT_FILTER_INLINE_LIMIT,
  showFilterBadges = true,
  showClearFiltersButton = true,
  sortOptions,
  defaultSort,
  sort,
  onSortChange,

  // --- Column level ---
  columnFooter,
  columnWidth = DEFAULT_COLUMN_WIDTH,
  countDisplay = "tag",
  collapsedStages,
  onCollapsedStagesChange,

  // --- Metrics panel ---
  metrics,                 // Array of stat items or a ReactNode for full override
  showMetrics: controlledShowMetrics,
  onMetricsToggle,

  // --- State (controlled) ---
  searchValue,
  onSearchChange,
  filterValues,
  onFilterChange,
  onParamsChange,
  loading = false,
  error,

  // --- Labels ---
  labels: labelsProp,
  renderEmptyState,
  renderLoadingState,
  renderErrorState,
}) => {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...(labelsProp || {}) }), [labelsProp]);

  // --- Uncontrolled state fallbacks ---
  const [internalSearch, setInternalSearch] = useState(searchValue != null ? searchValue : "");
  const [internalFilters, setInternalFilters] = useState(() => {
    const init = {};
    (filters || []).forEach((f) => { init[f.name] = getEmptyFilterValue(f); });
    return init;
  });
  const [internalSort, setInternalSort] = useState(defaultSort || (sortOptions?.[0]?.value ?? ""));
  const [internalCollapsed, setInternalCollapsed] = useState([]);
  const [internalExpanded, setInternalExpanded] = useState([]);
  const [internalSelection, setInternalSelection] = useState([]);
  const [internalShowMetrics, setInternalShowMetrics] = useState(false);
  const [transitionPrompts, setTransitionPrompts] = useState({});
  const selectionResetRef = useRef("");

  const resolvedShowMetrics =
    controlledShowMetrics != null ? controlledShowMetrics : internalShowMetrics;

  const toggleMetrics = useCallback(() => {
    const next = !resolvedShowMetrics;
    if (onMetricsToggle) onMetricsToggle(next);
    if (controlledShowMetrics == null) setInternalShowMetrics(next);
  }, [resolvedShowMetrics, onMetricsToggle, controlledShowMetrics]);

  const effectiveColumnWidth = Math.max(MIN_COLUMN_WIDTH, columnWidth || DEFAULT_COLUMN_WIDTH);

  const resolvedSearch = searchValue != null ? searchValue : internalSearch;
  const resolvedFilters = filterValues != null ? filterValues : internalFilters;
  const resolvedSort = sort != null ? sort : internalSort;
  const resolvedCollapsed = collapsedStages != null ? collapsedStages : internalCollapsed;
  const resolvedExpanded = expandedStages != null ? expandedStages : internalExpanded;
  const resolvedSelection = selectedIds != null ? selectedIds : internalSelection;
  const searchEnabled = showSearch && Array.isArray(searchFields) && searchFields.length > 0;
  const stagesByValue = useMemo(() => {
    const map = {};
    for (const stage of stages || []) {
      map[stage.value] = stage;
    }
    return map;
  }, [stages]);

  const fireParamsChange = useCallback((overrides = {}) => {
    if (!onParamsChange) return;
    onParamsChange({
      search: overrides.search != null ? overrides.search : resolvedSearch,
      filters: overrides.filters != null ? overrides.filters : resolvedFilters,
      sort: overrides.sort != null ? overrides.sort : resolvedSort || null,
      collapsedStages:
        overrides.collapsedStages != null ? overrides.collapsedStages : resolvedCollapsed,
    });
  }, [onParamsChange, resolvedCollapsed, resolvedFilters, resolvedSearch, resolvedSort]);

  // --- Search debounce ---
  const debounceRef = useRef(null);
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  const handleSearch = useCallback(
    (val) => {
      if (searchValue == null) setInternalSearch(val);
      const dispatch = () => {
        if (onSearchChange) onSearchChange(val);
        fireParamsChange({ search: val });
      };
      if (searchDebounce > 0) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(dispatch, searchDebounce);
      } else {
        dispatch();
      }
    },
    [fireParamsChange, onSearchChange, searchValue, searchDebounce]
  );

  const handleFilter = useCallback(
    (name, val) => {
      const next = { ...resolvedFilters, [name]: val };
      if (filterValues == null) setInternalFilters(next);
      if (onFilterChange) onFilterChange(next);
      fireParamsChange({ filters: next });
    },
    [fireParamsChange, onFilterChange, filterValues, resolvedFilters]
  );

  const handleFilterRemove = useCallback(
    (key) => {
      if (key === "all") {
        const cleared = {};
        (filters || []).forEach((f) => { cleared[f.name] = getEmptyFilterValue(f); });
        if (filterValues == null) setInternalFilters(cleared);
        if (onFilterChange) onFilterChange(cleared);
        fireParamsChange({ filters: cleared });
        return;
      }
      const filter = (filters || []).find((f) => f.name === key);
      const emptyVal = filter ? getEmptyFilterValue(filter) : "";
      const next = { ...resolvedFilters, [key]: emptyVal };
      if (filterValues == null) setInternalFilters(next);
      if (onFilterChange) onFilterChange(next);
      fireParamsChange({ filters: next });
    },
    [filters, filterValues, fireParamsChange, onFilterChange, resolvedFilters]
  );

  const handleSort = useCallback(
    (val) => {
      if (onSortChange) onSortChange(val);
      if (sort == null) setInternalSort(val);
      fireParamsChange({ sort: val });
    },
    [fireParamsChange, onSortChange, sort]
  );

  const handleCollapsed = useCallback(
    (stageValue) => {
      const next = resolvedCollapsed.includes(stageValue)
        ? resolvedCollapsed.filter((v) => v !== stageValue)
        : [...resolvedCollapsed, stageValue];
      if (onCollapsedStagesChange) onCollapsedStagesChange(next);
      if (collapsedStages == null) setInternalCollapsed(next);
      fireParamsChange({ collapsedStages: next });
    },
    [fireParamsChange, resolvedCollapsed, collapsedStages, onCollapsedStagesChange]
  );

  const handleExpanded = useCallback(
    (stageValue) => {
      const next = resolvedExpanded.includes(stageValue)
        ? resolvedExpanded.filter((v) => v !== stageValue)
        : [...resolvedExpanded, stageValue];
      if (onExpandedStagesChange) onExpandedStagesChange(next);
      if (expandedStages == null) setInternalExpanded(next);
    },
    [resolvedExpanded, expandedStages, onExpandedStagesChange]
  );

  const handleToggleSelect = useCallback(
    (rowId) => {
      const next = resolvedSelection.includes(rowId)
        ? resolvedSelection.filter((id) => id !== rowId)
        : [...resolvedSelection, rowId];
      if (onSelectionChange) onSelectionChange(next);
      if (selectedIds == null) setInternalSelection(next);
    },
    [resolvedSelection, selectedIds, onSelectionChange]
  );

  const clearTransitionPrompt = useCallback((rowId) => {
    setTransitionPrompts((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, rowId)) return prev;
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  }, []);

  const commitStageChange = useCallback(
    (row, newStage, oldStage, result) => {
      clearTransitionPrompt(row[rowIdField]);
      if (onStageChange) onStageChange(row, newStage, oldStage, result);
    },
    [clearTransitionPrompt, onStageChange, rowIdField]
  );

  const selectionQueryKey = useMemo(() => {
    if (!resetSelectionOnQueryChange) return "";
    return toStableKey({
      search: resolvedSearch,
      filters: resolvedFilters,
      sort: resolvedSort || null,
    });
  }, [resetSelectionOnQueryChange, resolvedFilters, resolvedSearch, resolvedSort]);

  const combinedSelectionResetKey = useMemo(
    () => `${selectionQueryKey}::${selectionResetKey == null ? "" : toStableKey(selectionResetKey)}`,
    [selectionQueryKey, selectionResetKey]
  );

  useEffect(() => {
    if (!selectable || selectedIds != null) {
      selectionResetRef.current = combinedSelectionResetKey;
      return;
    }
    if (selectionResetRef.current && selectionResetRef.current !== combinedSelectionResetKey) {
      setInternalSelection([]);
    }
    selectionResetRef.current = combinedSelectionResetKey;
  }, [combinedSelectionResetKey, selectable, selectedIds]);

  // --- Data pipeline ---
  const getStageFor = useCallback(
    (row) => {
      if (typeof groupBy === "function") return groupBy(row);
      return row[groupBy];
    },
    [groupBy]
  );

  // Filter → apply search → bucket → sort → clamp
  const filteredData = useMemo(() => {
    let result = data;

    for (const filter of filters || []) {
      const val = resolvedFilters[filter.name];
      if (!isFilterActive(filter, val)) continue;

      const type = filter.type || "select";
      if (filter.filterFn) {
        result = result.filter((row) => filter.filterFn(row, val));
      } else if (type === "multiselect") {
        result = result.filter((row) => val.includes(row[filter.name]));
      } else if (type === "dateRange") {
        const fromTs = dateToTimestamp(val.from);
        const toTs = val.to ? dateToTimestamp(val.to) + 86400000 - 1 : null;
        result = result.filter((row) => {
          const rowTs = new Date(row[filter.name]).getTime();
          if (Number.isNaN(rowTs)) return false;
          if (fromTs && rowTs < fromTs) return false;
          if (toTs && rowTs > toTs) return false;
          return true;
        });
      } else {
        result = result.filter((row) => row[filter.name] === val);
      }
    }

    const searchLower = (resolvedSearch || "").toLowerCase().trim();
    if (searchEnabled && searchLower) {
      if (fuzzySearch) {
        const fuse = new Fuse(result, {
          keys: searchFields,
          threshold: 0.4,
          distance: 100,
          ignoreLocation: true,
          ...fuzzyOptions,
        });
        result = fuse.search(searchLower).map((r) => r.item);
      } else {
        result = result.filter((row) =>
          searchFields.some((f) =>
            String(row[f] || "").toLowerCase().includes(searchLower)
          )
        );
      }
    }

    return result;
  }, [data, resolvedSearch, resolvedFilters, filters, searchEnabled, searchFields, fuzzySearch, fuzzyOptions]);

  const buckets = useMemo(() => {
    const map = {};
    for (const stage of stages) map[stage.value] = [];
    for (const row of filteredData) {
      const key = getStageFor(row);
      if (map[key]) {
        map[key].push(row);
      } else if (stages.length > 0) {
        if (!map.__unknown) map.__unknown = [];
        map.__unknown.push(row);
      }
    }
    return map;
  }, [filteredData, stages, getStageFor]);

  const sortComparator = useMemo(() => {
    if (!sortOptions || !resolvedSort) return null;
    const opt = sortOptions.find((s) => s.value === resolvedSort);
    return opt?.comparator || null;
  }, [sortOptions, resolvedSort]);

  const sortedBuckets = useMemo(() => {
    if (!sortComparator) return buckets;
    const out = {};
    for (const key of Object.keys(buckets)) {
      out[key] = [...buckets[key]].sort(sortComparator);
    }
    return out;
  }, [buckets, sortComparator]);

  // --- Filter chips ---
  const activeChips = useMemo(() => {
    const chips = [];
    for (const filter of filters || []) {
      const val = resolvedFilters[filter.name];
      if (!isFilterActive(filter, val)) continue;

      const type = filter.type || "select";
      const prefix = filter.chipLabel || filter.placeholder || filter.name;

      if (type === "multiselect") {
        const labelList = val
          .map((v) => filter.options.find((o) => o.value === v)?.label || v)
          .join(", ");
        chips.push({ key: filter.name, label: `${prefix}: ${labelList}` });
      } else if (type === "dateRange") {
        const parts = [];
        if (val.from) parts.push(`from ${formatDateChip(val.from)}`);
        if (val.to) parts.push(`to ${formatDateChip(val.to)}`);
        chips.push({ key: filter.name, label: `${prefix}: ${parts.join(" ")}` });
      } else {
        const opt = filter.options.find((o) => o.value === val);
        chips.push({ key: filter.name, label: `${prefix}: ${opt?.label || val}` });
      }
    }
    return chips;
  }, [filters, resolvedFilters]);

  // --- Card rendering helpers ---
  const partitioned = useMemo(() => partitionFields(cardFields || []), [cardFields]);
  const dividers = useMemo(() => resolveDividers(cardDividers, cardDensity), [cardDividers, cardDensity]);
  const resolvedMaxBody = maxBodyLines || (cardDensity === "comfortable" ? 5 : 3);
  const resolvedStageControl = stageControl || (cardDensity === "comfortable" ? "select" : "menu");
  const resolvedStageControlPlacement =
    stageControlPlacement || (resolvedStageControl === "menu" ? "inline" : "separateRow");

  const handleStageChangeRequest = useCallback(
    (row, newStage, oldStage) => {
      if (!newStage || newStage === oldStage) return;

      const targetStage = stagesByValue[newStage];
      if (!targetStage || !canStageReceiveRow(targetStage, row, canMove)) return;

      const rowId = row[rowIdField];
      if (targetStage.onEnterRequired?.render) {
        setTransitionPrompts((prev) => ({
          ...prev,
          [rowId]: {
            row,
            fromStage: oldStage,
            toStage: newStage,
          },
        }));
        return;
      }

      commitStageChange(row, newStage, oldStage);
    },
    [canMove, commitStageChange, rowIdField, stagesByValue]
  );

  const renderCardNode = useCallback(
    (row, stage) => {
      const rowId = row[rowIdField];
      const activePrompt = transitionPrompts[rowId];
      const promptStage = activePrompt ? stagesByValue[activePrompt.toStage] : null;

      if (promptStage?.onEnterRequired?.render) {
        return (
          <Tile key={rowId} compact={cardDensity === "compact"}>
            {promptStage.onEnterRequired.render({
              row: activePrompt.row,
              fromStage: activePrompt.fromStage,
              toStage: activePrompt.toStage,
              onConfirm: (result) =>
                commitStageChange(activePrompt.row, activePrompt.toStage, activePrompt.fromStage, result),
              onCancel: () => clearTransitionPrompt(rowId),
            })}
          </Tile>
        );
      }

      if (renderCard) {
        return renderCard(row, {
          stage,
          isChanging: isStageChanging ? isStageChanging(row) : false,
          density: cardDensity,
          onStageChange: (newStage) => handleStageChangeRequest(row, newStage, stage.value),
        });
      }
      return (
        <KanbanCard
          key={rowId}
          row={row}
          rowId={rowId}
          stage={stage}
          stages={stages}
          fields={partitioned}
          density={cardDensity}
          dividers={dividers}
          bodyAs={cardBodyAs}
          maxBodyLines={resolvedMaxBody}
          stageControl={resolvedStageControl}
          stageControlPlacement={resolvedStageControlPlacement}
          canMove={canMove}
          onStageChangeRequest={handleStageChangeRequest}
          isChanging={isStageChanging ? isStageChanging(row) : false}
          selectable={selectable}
          selected={resolvedSelection.includes(rowId)}
          onToggleSelect={handleToggleSelect}
          labels={labels}
        />
      );
    },
    [
      clearTransitionPrompt,
      commitStageChange,
      renderCard,
      rowIdField,
      partitioned,
      cardDensity,
      dividers,
      resolvedMaxBody,
      resolvedStageControl,
      resolvedStageControlPlacement,
      canMove,
      isStageChanging,
      selectable,
      resolvedSelection,
      handleStageChangeRequest,
      handleToggleSelect,
      labels,
      stages,
      stagesByValue,
      transitionPrompts,
    ]
  );

  const totalMatching = filteredData.length;
  const selectedCount = resolvedSelection.length;
  const singular = (recordLabel?.singular || "card").toLowerCase();
  const plural = (recordLabel?.plural || "cards").toLowerCase();
  const countLabel = (n) => (n === 1 ? singular : plural);
  // Default search placeholder derives from recordLabel when the caller
  // doesn't pass one — "Search deals" / "Search tickets" / etc. Fall back to
  // labels.search (the raw "Search cards..." string) when no recordLabel.
  const resolvedSearchPlaceholder =
    searchPlaceholder ?? (recordLabel?.plural ? `Search ${plural}...` : labels.search);

  const selectionBarProps = {
    selectedIds: resolvedSelection,
    selectedCount,
    displayCount: totalMatching,
    countLabel,
    allSelected: selectedCount >= totalMatching && totalMatching > 0,
    onSelectAll: () => {
      const allIds = filteredData.map((r) => r[rowIdField]);
      if (onSelectionChange) onSelectionChange(allIds);
      if (selectedIds == null) setInternalSelection(allIds);
    },
    onDeselectAll: () => {
      if (onSelectionChange) onSelectionChange([]);
      if (selectedIds == null) setInternalSelection([]);
    },
    selectionActions: selectionActions || [],
    labels,
  };

  const mainContent = error ? (
    renderErrorState ? renderErrorState({
      error,
      title: labels.errorTitle,
      message: typeof error === "string" ? error : labels.errorMessage,
    }) : (
      <Alert variant="danger" title={labels.errorTitle}>
        {typeof error === "string" ? error : labels.errorMessage}
      </Alert>
    )
  ) : loading && data.length === 0 ? (
    renderLoadingState ? renderLoadingState({ label: labels.loading }) : (
      <LoadingSpinner size="md" layout="centered" label={labels.loading} />
    )
  ) : filteredData.length === 0 ? (
    renderEmptyState ? renderEmptyState({
      title: labels.emptyTitle,
      message: labels.emptyMessage,
    }) : (
      <Tile>
        <EmptyState title={labels.emptyTitle} layout="vertical" reverseOrder={true}>
          <Text>{labels.emptyMessage}</Text>
        </EmptyState>
      </Tile>
    )
  ) : (
    <Flex direction="row" gap="sm" wrap="nowrap">
      {stages.map((stage) => {
        const stageRows = sortedBuckets[stage.value] || [];
        const meta = stageMeta?.[stage.value];
        const isExpanded = resolvedExpanded.includes(stage.value);
        const clamp = isExpanded ? maxCardsExpanded : maxCardsPerColumn;
        const visibleRows = stageRows.slice(0, clamp);
        const isCollapsed = resolvedCollapsed.includes(stage.value);

        return (
          <AutoGrid key={stage.value} columnWidth={isCollapsed ? 72 : effectiveColumnWidth}>
            <KanbanColumn
              stage={stage}
              rows={visibleRows}
              bucketCount={stageRows.length}
              totalCount={meta?.totalCount}
              hasMore={meta?.hasMore}
              loading={meta?.loading}
              error={meta?.error}
              onLoadMore={onLoadMore}
              expanded={isExpanded}
              onToggleExpanded={() => handleExpanded(stage.value)}
              collapsed={isCollapsed}
              onToggleCollapsed={() => handleCollapsed(stage.value)}
              columnFooter={columnFooter}
              countDisplay={countDisplay}
              labels={labels}
            >
              {visibleRows.map((row) => renderCardNode(row, stage))}
            </KanbanColumn>
          </AutoGrid>
        );
      })}
    </Flex>
  );

  return (
    <Flex direction="column" gap="sm">
      <KanbanToolbar
        showSearch={searchEnabled}
        searchValue={resolvedSearch}
        searchPlaceholder={resolvedSearchPlaceholder}
        onSearchChange={handleSearch}
        filters={filters}
        filterValues={resolvedFilters}
        onFilterChange={handleFilter}
        filterInlineLimit={filterInlineLimit}
        showFilterBadges={showFilterBadges}
        showClearFiltersButton={showClearFiltersButton}
        activeChips={activeChips}
        onFilterRemove={handleFilterRemove}
        sortOptions={sortOptions}
        sortValue={resolvedSort}
        onSortChange={handleSort}
        metrics={metrics}
        showMetrics={resolvedShowMetrics}
        onToggleMetrics={toggleMetrics}
        labels={labels}
      />

      {showSelectionBar && selectable && selectedCount > 0 ? (
        renderSelectionBar
          ? renderSelectionBar(selectionBarProps)
          : <DefaultSelectionBar {...selectionBarProps} />
      ) : null}

      {mainContent}
    </Flex>
  );
};
