import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getEmptyFilterValues,
  resetFilterValues,
  buildActiveFilterChips,
  toStableKey,
  filterRows,
  searchRows,
} from "../utils/query.js";
import { useDebouncedDispatch, useSelectionReset } from "../utils/interactionHooks.js";
import {
  bucketRowsByStage,
  sortBuckets,
  partitionLanes,
  resolveLaneLabel,
  computeStageCounts,
  evaluateWip,
  findNewlyExceededWip,
} from "./kanbanLanes.js";
import { CollectionSortSelect } from "../common-components/CollectionSortSelect.js";
import { CollectionToolbar } from "../common-components/CollectionToolbar.js";
import { makeStyledTextDataUri } from "../common-components/StyledText.js";
import { Icon } from "../common-components/Icon.js";
import {
  Alert,
  AutoGrid,
  Box,
  Button,
  Checkbox,
  DescriptionList,
  DescriptionListItem,
  Divider,
  Dropdown,
  EmptyState,
  Flex,
  Image,
  Inline,
  Link,
  LoadingSpinner,
  Select,
  Statistics,
  StatisticsItem,
  StatisticsTrend,
  StatusTag,
  Tag,
  Text,
  Tile,
} from "@hubspot/ui-extensions";

// ---------------------------------------------------------------------------
// Kanban — drag-free board component for HubSpot UI Extensions.
// v0.3: WIP limits (per-stage `wipLimit` / top-level `wipLimits` override,
// "count / limit" headers, Over WIP StatusTag, onWipExceeded transition
// callback) and swimlanes (`swimlaneBy` vertical grouping into stacked lane
// sections, each with its own stage-column row; collapsible lanes; optional
// per-lane metrics). Pure lane/WIP logic lives in kanbanLanes.js.
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
// the shared toolbar's overflow filter row (most filters are compact Select/MultiSelect).
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
  loadingMessage: "This should only take a moment.",
  errorTitle: "Something went wrong.",
  errorMessage: "An error occurred while loading data.",
  cardCount: (n) => String(n),
  // "5 / 4" — count vs WIP limit in the stage header. The slash format is the
  // standard kanban convention; override for tighter ("5/4") or verbose forms.
  wipCount: (count, limit) => `${count} / ${limit}`,
  overWip: "Over WIP",
  laneCount: (n) => String(n),
  unassignedLane: "Unassigned",
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
// Filter helpers, chip builders, reset helpers, and the filter/search pipeline
// are shared with DataTable via src/utils/query.js (imported above).
// ---------------------------------------------------------------------------

const canStageReceiveRow = (stage, row, canMove) => {
  if (!stage) return false;
  if (typeof canMove === "function" && !canMove(row, stage.value)) return false;
  if (typeof stage.canEnter === "function" && !stage.canEnter(row)) return false;
  return true;
};

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
  wip,
  compactEmpty,
  labels,
  children,
}) => {
  // Prefer server-side totalCount (the true stage total) over bucketCount
  // (what's currently loaded). Falls back to bucketCount when no meta is set.
  // When the stage has a WIP limit, the count renders as "count / limit"
  // (wip.count is the same totalCount-else-loaded number, computed upstream).
  const hasWipLimit = wip != null && wip.limit != null;
  const countLabel = hasWipLimit
    ? labels.wipCount(wip.count, wip.limit)
    : labels.cardCount(totalCount != null ? totalCount : bucketCount);
  const overWipNode =
    wip && wip.exceeded ? <StatusTag variant="warning">{labels.overWip}</StatusTag> : null;
  const countNode =
    countDisplay === "text" ? (
      <Text format={{ fontWeight: "demibold" }}>{countLabel}</Text>
    ) : countDisplay === "none" ? null : (
      <Tag variant="default">{countLabel}</Tag>
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

  // Compact rendering for empty lane×stage cells: a swimlane board multiplies
  // columns by lanes, so empty cells render as a single header row (label +
  // emptyColumn placeholder) instead of the full header/divider/body stack.
  if (compactEmpty && !loading && rows.length === 0 && bucketCount === 0) {
    return (
      <Tile compact>
        <Flex direction="row" align="center" justify="between" gap="xs">
          <Text variant="microcopy" format={{ fontWeight: "demibold" }}>
            {stage.shortLabel || stage.label}
          </Text>
          <Text variant="microcopy" format={{ italic: true }}>
            {labels.emptyColumn}
          </Text>
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
            {overWipNode}
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
// Toolbar helpers
// ---------------------------------------------------------------------------

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

// Toolbar — shared collection controls with Kanban-specific right-side actions:
// Sort Select, Metrics toggle, and optional metrics footer.
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
  showMetricsButton,
  metricsPanel,
  onToggleMetrics,
  labels,
  toolbarLeftFlex,
  toolbarRightFlex,
}) => {
  const rightControls = (sortOptions?.length > 0 || showMetricsButton) ? (
    <>
      {sortOptions && sortOptions.length > 0 ? (
        <CollectionSortSelect
          name="kanban-sort"
          value={sortValue}
          placeholder={labels.sortButton}
          options={sortOptions}
          onChange={onSortChange}
        />
      ) : null}
      {showMetricsButton ? (
        <Button variant="secondary" size="small" onClick={onToggleMetrics}>
          <Icon name="gauge" size="sm" /> {labels.metricsButton}
        </Button>
      ) : null}
    </>
  ) : null;

  return (
    <CollectionToolbar
      search={{
        visible: showSearch,
        name: "kanban-search",
        placeholder: searchPlaceholder,
        value: searchValue,
        onChange: onSearchChange,
      }}
      filters={{
        items: filters,
        values: filterValues,
        inlineLimit: filterInlineLimit,
        namePrefix: "kanban-filter",
        onChange: onFilterChange,
        labels,
      }}
      chips={{
        items: activeChips,
        showBadges: showFilterBadges,
        showClearAll: showClearFiltersButton,
        clearAllLabel: labels.clearAll,
        onRemove: onFilterRemove,
      }}
      right={rightControls}
      footer={metricsPanel}
      labels={labels}
      leftFlex={toolbarLeftFlex}
      rightFlex={toolbarRightFlex}
    />
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

  // --- WIP limits ---
  wipLimits,
  onWipExceeded,

  // --- Swimlanes ---
  swimlaneBy,
  swimlaneLabels,
  swimlaneOrder,
  collapseLanes = true,
  collapsedLanes,
  defaultCollapsedLanes,
  onCollapsedLanesChange,
  metricsPerLane = false,

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
  showClearFiltersButton,
  toolbarLeftFlex = 3,
  toolbarRightFlex = 1,
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
  const [internalFilters, setInternalFilters] = useState(() => getEmptyFilterValues(filters));
  const [internalSort, setInternalSort] = useState(defaultSort || (sortOptions?.[0]?.value ?? ""));
  const [internalCollapsed, setInternalCollapsed] = useState([]);
  const [internalCollapsedLanes, setInternalCollapsedLanes] = useState(
    () => defaultCollapsedLanes || []
  );
  const [internalExpanded, setInternalExpanded] = useState([]);
  const [internalSelection, setInternalSelection] = useState([]);
  const [internalShowMetrics, setInternalShowMetrics] = useState(false);
  const [transitionPrompts, setTransitionPrompts] = useState({});

  const resolvedShowMetrics =
    controlledShowMetrics != null ? controlledShowMetrics : internalShowMetrics;

  const toggleMetrics = useCallback(() => {
    const next = !resolvedShowMetrics;
    if (onMetricsToggle) onMetricsToggle(next);
    if (controlledShowMetrics == null) setInternalShowMetrics(next);
  }, [resolvedShowMetrics, onMetricsToggle, controlledShowMetrics]);

  const effectiveColumnWidth = Math.max(MIN_COLUMN_WIDTH, columnWidth || DEFAULT_COLUMN_WIDTH);

  const resolvedSearch = searchValue != null ? searchValue : internalSearch;
  const searchInputValue = searchDebounce > 0 ? internalSearch : resolvedSearch;
  const resolvedFilters = filterValues != null ? filterValues : internalFilters;
  const resolvedSort = sort != null ? sort : internalSort;
  const resolvedCollapsed = collapsedStages != null ? collapsedStages : internalCollapsed;
  const resolvedCollapsedLanes = collapsedLanes != null ? collapsedLanes : internalCollapsedLanes;
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
      collapsedLanes:
        overrides.collapsedLanes != null ? overrides.collapsedLanes : resolvedCollapsedLanes,
    });
  }, [onParamsChange, resolvedCollapsed, resolvedCollapsedLanes, resolvedFilters, resolvedSearch, resolvedSort]);

  // --- Search debounce ---
  const lastAppliedSearchRef = useRef(searchValue != null ? searchValue : "");

  useEffect(() => {
    if (searchValue == null) return;
    if (searchValue === lastAppliedSearchRef.current) return;
    lastAppliedSearchRef.current = searchValue;
    setInternalSearch(searchValue);
  }, [searchValue]);

  const dispatchSearch = useCallback(
    (val) => {
      lastAppliedSearchRef.current = val;
      if (onSearchChange) onSearchChange(val);
      fireParamsChange({ search: val });
    },
    [fireParamsChange, onSearchChange]
  );

  const dispatchSearchDebounced = useDebouncedDispatch(internalSearch, searchDebounce, dispatchSearch);

  const handleSearch = useCallback(
    (val) => {
      setInternalSearch(val);
      dispatchSearchDebounced(val);
    },
    [dispatchSearchDebounced]
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
      const next = resetFilterValues(filters, resolvedFilters, key);
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

  const handleLaneCollapsed = useCallback(
    (laneKey) => {
      const next = resolvedCollapsedLanes.includes(laneKey)
        ? resolvedCollapsedLanes.filter((k) => k !== laneKey)
        : [...resolvedCollapsedLanes, laneKey];
      if (onCollapsedLanesChange) onCollapsedLanesChange(next);
      if (collapsedLanes == null) setInternalCollapsedLanes(next);
      fireParamsChange({ collapsedLanes: next });
    },
    [fireParamsChange, resolvedCollapsedLanes, collapsedLanes, onCollapsedLanesChange]
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

  const clearSelection = useCallback(() => setInternalSelection([]), []);
  useSelectionReset({
    resetKey: combinedSelectionResetKey,
    enabled: selectable,
    isControlled: selectedIds != null,
    clearSelection,
  });

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
    let result = filterRows(data, filters, resolvedFilters);

    const searchLower = (resolvedSearch || "").toLowerCase().trim();
    if (searchEnabled && searchLower) {
      result = searchRows(result, searchLower, searchFields, {
        fuzzy: fuzzySearch,
        fuzzyOptions,
      });
    }

    return result;
  }, [data, resolvedSearch, resolvedFilters, filters, searchEnabled, searchFields, fuzzySearch, fuzzyOptions]);

  // Global per-stage buckets. Computed across ALL lanes even in swimlane mode
  // because WIP limits are per stage (a limit of 5 on "In progress" applies to
  // the stage total, not to each lane's slice).
  const buckets = useMemo(
    () => bucketRowsByStage(filteredData, stages, getStageFor),
    [filteredData, stages, getStageFor]
  );

  const sortComparator = useMemo(() => {
    if (!sortOptions || !resolvedSort) return null;
    const opt = sortOptions.find((s) => s.value === resolvedSort);
    return opt?.comparator || null;
  }, [sortOptions, resolvedSort]);

  const sortedBuckets = useMemo(() => sortBuckets(buckets, sortComparator), [buckets, sortComparator]);

  // --- Swimlanes ---
  const hasLanes = swimlaneBy != null;

  const laneData = useMemo(() => {
    if (!hasLanes) return null;
    return partitionLanes(filteredData, { swimlaneBy, swimlaneOrder });
  }, [hasLanes, filteredData, swimlaneBy, swimlaneOrder]);

  // Per-lane sorted stage buckets — same bucket/sort pipeline as the flat
  // board, applied to each lane's slice of the filtered data.
  const laneBuckets = useMemo(() => {
    if (!laneData) return null;
    const out = {};
    for (const laneKey of laneData.laneKeys) {
      out[laneKey] = sortBuckets(
        bucketRowsByStage(laneData.rowsByLane[laneKey] || [], stages, getStageFor),
        sortComparator
      );
    }
    return out;
  }, [laneData, stages, getStageFor, sortComparator]);

  // --- WIP limits ---
  // Evaluated against the same number the column header shows: server-truth
  // stageMeta.totalCount when present, else the loaded (filtered) bucket size.
  const wipByStage = useMemo(
    () => evaluateWip(stages, computeStageCounts(stages, buckets, stageMeta), wipLimits),
    [stages, buckets, stageMeta, wipLimits]
  );

  // onWipExceeded fires only on the TRANSITION into the exceeded state (incl.
  // a board that mounts already over a limit — that reports once on mount),
  // never on every render. Transitions that would exceed a limit still
  // complete: the component is stateless on the write path and the caller's
  // server is the source of truth, so blocking client-side would only desync
  // the board from reality and prevent legitimate over-limit moves
  // (expedites, reassignment churn). WIP limits here are a signal, not a gate.
  const prevWipRef = useRef({});
  useEffect(() => {
    const newlyExceeded = findNewlyExceededWip(prevWipRef.current, wipByStage);
    prevWipRef.current = wipByStage;
    if (!onWipExceeded) return;
    for (const event of newlyExceeded) {
      onWipExceeded(event.stageId, event.count, event.limit);
    }
  }, [wipByStage, onWipExceeded]);

  // --- Filter chips ---
  const activeChips = useMemo(
    () => buildActiveFilterChips(filters, resolvedFilters),
    [filters, resolvedFilters]
  );

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

  // --- Metrics resolution (global vs per-lane) ---
  // `metrics` accepts a function `(rows, laneKey) => items | node` so per-lane
  // metrics can recompute from each lane's rows. With metricsPerLane off (or
  // no lanes) a metrics function is called once with all filtered rows.
  const metricsProvided = metrics != null && (!Array.isArray(metrics) || metrics.length > 0);
  const perLaneMetricsActive = hasLanes && metricsPerLane && typeof metrics === "function";
  const globalMetricsContent =
    metricsProvided && !perLaneMetricsActive
      ? typeof metrics === "function"
        ? metrics(filteredData, null)
        : metrics
      : null;

  // --- Stage-column row ---
  // One row of stage columns: the whole board in flat mode, one lane's row in
  // swimlane mode. In a lane, per-stage pagination meta is omitted (stageMeta
  // counts/load-more describe the flat stage, not a lane slice), empty cells
  // render compactly, and the WIP fraction is replaced by the Over WIP badge
  // alone (cell counts are lane-local; the limit applies to the stage total).
  const renderStageColumns = (bucketMap, laneKey) => {
    const inLane = laneKey != null;
    return (
      <Flex direction="row" gap="sm" wrap="nowrap">
        {stages.map((stage) => {
          const stageRows = bucketMap[stage.value] || [];
          const meta = inLane ? undefined : stageMeta?.[stage.value];
          const isExpanded = resolvedExpanded.includes(stage.value);
          const clamp = isExpanded ? maxCardsExpanded : maxCardsPerColumn;
          const visibleRows = stageRows.slice(0, clamp);
          const isCollapsed = resolvedCollapsed.includes(stage.value);
          const stageWip = wipByStage[stage.value];
          const wip = inLane
            ? stageWip?.exceeded
              ? { count: stageWip.count, limit: null, exceeded: true }
              : null
            : stageWip;

          return (
            <AutoGrid
              key={inLane ? `${laneKey}::${stage.value}` : stage.value}
              columnWidth={isCollapsed ? 72 : effectiveColumnWidth}
            >
              <KanbanColumn
                stage={stage}
                rows={visibleRows}
                bucketCount={stageRows.length}
                totalCount={meta?.totalCount}
                hasMore={meta?.hasMore}
                loading={meta?.loading}
                error={meta?.error}
                onLoadMore={inLane ? undefined : onLoadMore}
                expanded={isExpanded}
                onToggleExpanded={() => handleExpanded(stage.value)}
                collapsed={isCollapsed}
                onToggleCollapsed={() => handleCollapsed(stage.value)}
                columnFooter={columnFooter}
                countDisplay={countDisplay}
                wip={wip}
                compactEmpty={inLane}
                labels={labels}
              >
                {visibleRows.map((row) => renderCardNode(row, stage))}
              </KanbanColumn>
            </AutoGrid>
          );
        })}
      </Flex>
    );
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
      // Same EmptyState layout as the empty state (just the "building" image +
      // a loading message) so loading and empty match with no layout shift.
      <Tile>
        <Flex direction="column" align="center" justify="center">
          <EmptyState title={labels.loading} imageName="building" layout="vertical">
            <Text>{labels.loadingMessage}</Text>
          </EmptyState>
        </Flex>
      </Tile>
    )
  ) : filteredData.length === 0 ? (
    renderEmptyState ? renderEmptyState({
      title: labels.emptyTitle,
      message: labels.emptyMessage,
    }) : (
      <Tile>
        <Flex direction="column" align="center" justify="center">
          <EmptyState title={labels.emptyTitle} layout="vertical">
            <Text>{labels.emptyMessage}</Text>
          </EmptyState>
        </Flex>
      </Tile>
    )
  ) : hasLanes ? (
    <Flex direction="column" gap="md">
      {(laneData?.laneKeys || []).map((laneKey, laneIndex) => {
        const laneRows = laneData.rowsByLane[laneKey] || [];
        const laneLabel = resolveLaneLabel(laneKey, swimlaneLabels, laneRows, labels.unassignedLane);
        // Tooltips need plain strings; custom label functions may return nodes.
        const laneLabelText = typeof laneLabel === "string" ? laneLabel : String(laneKey);
        const isLaneCollapsed = collapseLanes && resolvedCollapsedLanes.includes(laneKey);
        const laneCountLabel = labels.laneCount(laneRows.length);
        const laneCountNode =
          countDisplay === "none" ? null : countDisplay === "text" ? (
            <Text format={{ fontWeight: "demibold" }}>{laneCountLabel}</Text>
          ) : (
            <Tag variant="default">{laneCountLabel}</Tag>
          );
        const laneMetricsNode =
          !isLaneCollapsed && perLaneMetricsActive && resolvedShowMetrics
            ? renderMetricsPanel(metrics(laneRows, laneKey))
            : null;

        return (
          <Flex key={laneKey} direction="column" gap="xs">
            {laneIndex > 0 ? <Divider /> : null}
            <Flex direction="row" align="center" gap="xs">
              {collapseLanes ? (
                <Button
                  variant="transparent"
                  size="sm"
                  onClick={() => handleLaneCollapsed(laneKey)}
                  tooltip={isLaneCollapsed ? `Expand ${laneLabelText}` : `Collapse ${laneLabelText}`}
                >
                  <Icon
                    name={isLaneCollapsed ? "right" : "down"}
                    size="sm"
                    screenReaderText={
                      isLaneCollapsed ? `Expand ${laneLabelText}` : `Collapse ${laneLabelText}`
                    }
                  />
                </Button>
              ) : null}
              <Text format={{ fontWeight: "demibold" }}>{laneLabel}</Text>
              {laneCountNode}
            </Flex>
            {laneMetricsNode}
            {!isLaneCollapsed ? renderStageColumns(laneBuckets?.[laneKey] || {}, laneKey) : null}
          </Flex>
        );
      })}
    </Flex>
  ) : (
    renderStageColumns(sortedBuckets, null)
  );

  // "Clear all" follows the chips unless explicitly set: hiding the filter
  // badges hides the clear-all reset button by default too.
  const resolvedShowClearFiltersButton = showClearFiltersButton ?? showFilterBadges;

  return (
    <Flex direction="column" gap="sm">
      <KanbanToolbar
        showSearch={searchEnabled}
        searchValue={searchInputValue}
        searchPlaceholder={resolvedSearchPlaceholder}
        onSearchChange={handleSearch}
        filters={filters}
        filterValues={resolvedFilters}
        onFilterChange={handleFilter}
        filterInlineLimit={filterInlineLimit}
        showFilterBadges={showFilterBadges}
        showClearFiltersButton={resolvedShowClearFiltersButton}
        activeChips={activeChips}
        onFilterRemove={handleFilterRemove}
        sortOptions={sortOptions}
        sortValue={resolvedSort}
        onSortChange={handleSort}
        showMetricsButton={metricsProvided}
        metricsPanel={
          resolvedShowMetrics && globalMetricsContent
            ? renderMetricsPanel(globalMetricsContent)
            : null
        }
        onToggleMetrics={toggleMetrics}
        labels={labels}
        toolbarLeftFlex={toolbarLeftFlex}
        toolbarRightFlex={toolbarRightFlex}
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

Kanban.displayName = "Kanban";
