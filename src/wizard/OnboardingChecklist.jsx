// ═══════════════════════════════════════════════════════════════════════════
// OnboardingChecklist — the "getting started" progress checklist card.
//
// A native-feeling setup tracker: ProgressBar headline (done / total), then
// one row per task with success markers (checkCircle / circleHollow), an
// optional clickable title, and an inline action button for incomplete
// tasks. Completion is data-driven — the host marks items done; the
// checklist never owns task state, so it stays honest about what's actually
// configured. Collapsible mode wraps everything in an Accordion that
// defaults open while work remains and closed once everything is done.
// ═══════════════════════════════════════════════════════════════════════════

import React from "react";
import {
  Accordion,
  Button,
  Flex,
  Link,
  ProgressBar,
  Text,
} from "@hubspot/ui-extensions";
import { Icon } from "../common-components/Icon.js";
import { SectionHeader } from "../common-components/SectionHeader.js";
import { getChecklistProgress } from "./wizardState.js";

const DEFAULT_LABELS = {
  progress: (done, total) => `${done} of ${total} complete`,
};

/**
 * OnboardingChecklist — progress checklist card for setup / onboarding flows.
 *
 * Props:
 * - items: array of { id, title, description?, done, action?: { label,
 *   onClick, variant?, disabled? } }. `done` drives the success marker and
 *   the progress bar; `action` renders an inline button on incomplete rows.
 * - title / description: card heading (rendered via SectionHeader, or as the
 *   Accordion title when collapsible).
 * - progress: show the ProgressBar headline (default true).
 * - onItemClick(item): when provided, item titles render as Links that invoke
 *   it with the full item.
 * - collapsible: wrap the checklist in an Accordion (default false). Defaults
 *   open while items remain incomplete and closed when everything is done;
 *   override with defaultOpen.
 * - defaultOpen: initial open state for collapsible mode.
 * - showCompletedActions: keep action buttons visible on done rows
 *   (default false — completed tasks drop their CTA).
 * - labels: { progress: (done, total) => string } overrides.
 */
export const OnboardingChecklist = ({
  items = [],
  title,
  description,
  progress = true,
  onItemClick,
  collapsible = false,
  defaultOpen,
  showCompletedActions = false,
  labels: labelOverrides,
}) => {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const validItems = Array.isArray(items) ? items.filter((item) => item != null) : [];
  const { done, total } = getChecklistProgress(validItems);
  const allDone = total > 0 && done === total;

  const rows = validItems.map((item, index) => {
    const key = item.id != null ? String(item.id) : `item-${index}`;
    const showAction = item.action && (!item.done || showCompletedActions);
    return (
      <Flex key={key} direction="row" justify="between" align="center" gap="sm" wrap="nowrap">
        <Flex direction="row" align="center" gap="xs" wrap="nowrap">
          <Icon
            name={item.done ? "checkCircle" : "circleHollow"}
            color={item.done ? "success" : "inherit"}
            size="sm"
          />
          <Flex direction="column" gap="flush">
            {onItemClick ? (
              <Link onClick={() => onItemClick(item)}>{item.title}</Link>
            ) : (
              <Text>{item.title}</Text>
            )}
            {item.description != null ? (
              <Text variant="microcopy">{item.description}</Text>
            ) : null}
          </Flex>
        </Flex>
        {showAction ? (
          <Button
            size="xs"
            variant={item.action.variant || "secondary"}
            onClick={item.action.onClick}
            disabled={item.action.disabled}
          >
            {item.action.label}
          </Button>
        ) : null}
      </Flex>
    );
  });

  const body = (
    <Flex direction="column" gap="sm">
      {progress && total > 0 ? (
        <ProgressBar
          value={done}
          maxValue={total}
          variant="success"
          valueDescription={labels.progress(done, total)}
          aria-label={typeof title === "string" ? title : "Onboarding progress"}
        />
      ) : null}
      <Flex direction="column" gap="sm">{rows}</Flex>
    </Flex>
  );

  if (collapsible) {
    return (
      <Accordion
        title={typeof title === "string" ? title : "Getting started"}
        defaultOpen={defaultOpen !== undefined ? defaultOpen : !allDone}
        size="sm"
      >
        {body}
      </Accordion>
    );
  }

  if (title == null && description == null) return body;

  return (
    <Flex direction="column" gap="sm">
      <SectionHeader title={title} description={description} />
      {body}
    </Flex>
  );
};
