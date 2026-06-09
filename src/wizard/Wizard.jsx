// ═══════════════════════════════════════════════════════════════════════════
// Wizard — orchestrated multi-step flow for HubSpot UI Extensions.
//
// FormBuilder's multi-step mode is form-only: every step is a list of field
// configs. Wizard steps render ARBITRARY content (tables, pickers, review
// summaries, anything) through a render(ctx) escape hatch, while the Wizard
// owns the orchestration: a shared values bag, validate-gated Next, linear
// reachability (back always allowed, jump-ahead opt-in), a side step-nav
// (vertical) or native StepIndicator (horizontal), and a Back/Next/Finish
// footer with a renderFooter escape hatch.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Flex,
  Link,
  StepIndicator,
  Text,
} from "@hubspot/ui-extensions";
import { Icon } from "../common-components/Icon.js";
import { SectionHeader } from "../common-components/SectionHeader.js";
import {
  normalizeWizardSteps,
  findStepIndex,
  resolveStepIndex,
  isStepReachable,
  getStepStatus,
  completeStep,
  getNextIndex,
  getBackIndex,
  validateStep,
  getStepNames,
} from "./wizardState.js";

const DEFAULT_LABELS = {
  back: "Back",
  next: "Next",
  finish: "Finish",
  optional: "Optional",
  errorTitle: "Can't continue yet",
};

// Nav markers: done steps get the success check, the active step a filled
// circle, future steps a hollow one (consistent glyph widths — see the
// custom-timeline pattern in the UI standards KB).
const STATUS_ICONS = {
  complete: { name: "checkCircle", color: "success" },
  current: { name: "circleFilled", color: "inherit" },
  upcoming: { name: "circleHollow", color: "inherit" },
};

/**
 * Wizard — multi-step flow with gated navigation and a shared values bag.
 *
 * Props:
 * - steps: array of { id, title, description?, optional?, render?: (ctx) => node,
 *   validate?: (ctx) => true | string }. `render` receives the wizard context
 *   (below); `validate` runs when the user presses Next/Finish — returning a
 *   non-empty string blocks the transition and shows it as an inline error
 *   Alert. Optional steps never block jumping past them in the step nav.
 * - step / defaultStep / onStepChange: controlled / uncontrolled current step.
 *   `step` and `defaultStep` accept a step id or a zero-based index;
 *   `onStepChange(stepId, stepIndex)` fires on every transition.
 * - onComplete(values): called when Finish is pressed on the last step and its
 *   validate passes.
 * - defaultValues / onValuesChange: initial contents of the shared values bag
 *   and a change observer. The Wizard owns the bag via useState.
 * - orientation: "vertical" (default — side step-nav built from Flex/Icon/Text)
 *   or "horizontal" (native StepIndicator above the content).
 * - showStepNav: render the step nav (default true).
 * - allowJumpAhead: let users click any future step without completing the
 *   ones before it (default false — linear).
 * - showStepHeader: render the active step's title/description above its
 *   content (default true).
 * - labels: { back, next, finish, optional, errorTitle } overrides.
 * - renderFooter(ctx): replaces the Back/Next/Finish row. ctx additionally
 *   carries { isFirst, isLast, error, labels }.
 * - navFlex / contentFlex: flex ratios for the vertical layout's nav and
 *   content columns (default 1 / 3).
 * - stepIndicatorProps: extra props spread onto the native StepIndicator in
 *   horizontal orientation (e.g. variant="compact", circleSize).
 *
 * Context passed to render / validate / renderFooter:
 *   { stepId, stepIndex, goNext, goBack, goTo, values, setValues }
 * `setValues(patch)` shallow-merges an object into the bag, or replaces it
 * when given an updater function `(prev) => next`.
 */
export const Wizard = ({
  steps: rawSteps = [],
  step,
  defaultStep = 0,
  onStepChange,
  onComplete,
  defaultValues = {},
  onValuesChange,
  orientation = "vertical",
  showStepNav = true,
  allowJumpAhead = false,
  showStepHeader = true,
  labels: labelOverrides,
  renderFooter,
  navFlex = 1,
  contentFlex = 3,
  stepIndicatorProps,
}) => {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const steps = useMemo(() => normalizeWizardSteps(rawSteps), [rawSteps]);

  const [internalIndex, setInternalIndex] = useState(() =>
    resolveStepIndex(steps, defaultStep, 0)
  );
  const [completedIds, setCompletedIds] = useState([]);
  const [error, setError] = useState(null);
  const [values, setValuesState] = useState(defaultValues);
  // Mirror of `values` so setValues can compute the next bag OUTSIDE the
  // state updater (updaters must stay pure — React may replay them under
  // StrictMode/concurrent interruptions, which would double-fire
  // onValuesChange) while still composing correctly across batched calls.
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const isControlled = step !== undefined;
  // Keep internal state in sync while controlled so dropping the `step` prop
  // doesn't snap back to a stale index (same pattern as Feed's tabValue).
  useEffect(() => {
    if (!isControlled) return;
    const controlledIndex = findStepIndex(steps, step);
    if (controlledIndex >= 0) setInternalIndex(controlledIndex);
  }, [isControlled, step, steps]);

  const rawIndex = isControlled ? resolveStepIndex(steps, step, internalIndex) : internalIndex;
  // Clamp against the live steps array — steps can shrink between renders.
  const currentIndex = steps.length === 0 ? -1 : Math.min(Math.max(rawIndex, 0), steps.length - 1);
  const currentStep = currentIndex === -1 ? null : steps[currentIndex];

  const setValues = (patch) => {
    const prev = valuesRef.current;
    const next =
      typeof patch === "function" ? patch(prev) : { ...prev, ...(patch || {}) };
    valuesRef.current = next;
    setValuesState(next);
    if (onValuesChange) onValuesChange(next);
  };

  const moveTo = (index) => {
    setError(null);
    if (!isControlled) setInternalIndex(index);
    if (onStepChange) onStepChange(steps[index].id, index);
  };

  function goTo(target) {
    const targetIndex = findStepIndex(steps, target);
    if (targetIndex === -1) return;
    if (!isStepReachable(steps, targetIndex, { currentIndex, completedIds, allowJumpAhead })) {
      return;
    }
    if (targetIndex !== currentIndex) moveTo(targetIndex);
  }

  function goBack() {
    const backIndex = getBackIndex(currentIndex);
    if (backIndex !== -1) moveTo(backIndex);
  }

  function goNext() {
    if (!currentStep) return;
    const validationError = validateStep(currentStep, ctx);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    const nextCompleted = completeStep(completedIds, currentStep.id);
    setCompletedIds(nextCompleted);
    const nextIndex = getNextIndex(steps, currentIndex);
    if (nextIndex === -1) {
      if (onComplete) onComplete(values);
    } else {
      moveTo(nextIndex);
    }
  }

  const ctx = {
    stepId: currentStep ? currentStep.id : null,
    stepIndex: currentIndex,
    goNext,
    goBack,
    goTo,
    values,
    setValues,
  };

  if (!currentStep) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

  // ── Step nav ──────────────────────────────────────────────────────────────
  const verticalNav = (
    <Flex direction="column" gap="sm">
      {steps.map((s, i) => {
        const status = getStepStatus(steps, i, { currentIndex, completedIds });
        const marker = STATUS_ICONS[i === currentIndex ? "current" : status];
        const reachable = isStepReachable(steps, i, {
          currentIndex,
          completedIds,
          allowJumpAhead,
        });
        const isCurrent = i === currentIndex;
        return (
          <Flex key={s.id} direction="row" align="center" gap="xs" wrap="nowrap">
            <Icon name={marker.name} color={marker.color} size="sm" />
            <Flex direction="column" gap="flush">
              {reachable && !isCurrent ? (
                <Link onClick={() => goTo(i)}>{s.title ?? s.id}</Link>
              ) : (
                <Text format={isCurrent ? { fontWeight: "demibold" } : undefined}>
                  {s.title ?? s.id}
                </Text>
              )}
              {s.optional ? <Text variant="microcopy">{labels.optional}</Text> : null}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );

  const horizontalNav = (
    <StepIndicator
      currentStep={currentIndex}
      stepNames={getStepNames(steps)}
      direction="horizontal"
      onClick={(i) => goTo(i)}
      {...stepIndicatorProps}
    />
  );

  // ── Footer ────────────────────────────────────────────────────────────────
  const footer = renderFooter ? (
    renderFooter({ ...ctx, isFirst, isLast, error, labels })
  ) : (
    <Flex direction="row" justify="between">
      <Button variant="secondary" onClick={goBack} disabled={isFirst}>
        {labels.back}
      </Button>
      <Button variant="primary" onClick={goNext}>
        {isLast ? labels.finish : labels.next}
      </Button>
    </Flex>
  );

  // ── Step content ──────────────────────────────────────────────────────────
  const content = (
    <Flex direction="column" gap="sm">
      {showStepHeader && (currentStep.title != null || currentStep.description != null) ? (
        <SectionHeader title={currentStep.title} description={currentStep.description} />
      ) : null}
      {error ? (
        <Alert title={labels.errorTitle} variant="error">
          {error}
        </Alert>
      ) : null}
      {typeof currentStep.render === "function" ? currentStep.render(ctx) : null}
      {footer}
    </Flex>
  );

  if (orientation === "vertical" && showStepNav) {
    return (
      <Flex direction="row" gap="lg" align="start">
        <Box flex={navFlex}>{verticalNav}</Box>
        <Box flex={contentFlex}>{content}</Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="md">
      {orientation === "horizontal" && showStepNav ? horizontalNav : null}
      {content}
    </Flex>
  );
};
