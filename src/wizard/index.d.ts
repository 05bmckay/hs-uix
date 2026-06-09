import type { ReactNode } from "react";

export type WizardOrientation = "vertical" | "horizontal";

export type WizardValues = Record<string, unknown>;

export interface WizardStepContext {
  /** Id of the active step. */
  stepId: string | null;
  /** Zero-based index of the active step. */
  stepIndex: number;
  /** Validate the active step; on pass, advance (or fire onComplete on the last step). */
  goNext: () => void;
  /** Move to the previous step (never gated). */
  goBack: () => void;
  /** Jump to a step by id or index. No-op when the target isn't reachable. */
  goTo: (stepOrId: string | number) => void;
  /** Shared values bag owned by the Wizard. */
  values: WizardValues;
  /**
   * Shallow-merge an object patch into the values bag, or replace it via an
   * updater function `(prev) => next`.
   */
  setValues: (
    patch: Partial<WizardValues> | ((prev: WizardValues) => WizardValues)
  ) => void;
}

export interface WizardLabels {
  back?: string;
  next?: string;
  finish?: string;
  optional?: string;
  errorTitle?: string;
}

export interface WizardFooterContext extends WizardStepContext {
  isFirst: boolean;
  isLast: boolean;
  /** Current validation error (string) or null. */
  error: string | null;
  labels: Required<WizardLabels>;
}

export interface WizardStep {
  /** Stable identifier. Falls back to `step-<index>` when omitted. */
  id?: string | number;
  title?: ReactNode;
  description?: ReactNode;
  /** Optional steps never block jump-ahead reachability in linear mode. */
  optional?: boolean;
  /** Renders the step's arbitrary content. */
  render?: (ctx: WizardStepContext) => ReactNode;
  /**
   * Gate for Next/Finish: return a non-empty string to block the transition
   * (shown as an inline error Alert); anything else passes.
   */
  validate?: (ctx: WizardStepContext) => true | string | boolean | null | undefined;
}

export interface WizardStepIndicatorProps {
  circleSize?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "compact" | "flush";
  [key: string]: unknown;
}

export interface WizardProps {
  steps?: WizardStep[];
  /** Controlled current step (id or zero-based index). */
  step?: string | number;
  /** Initial step (id or zero-based index) when uncontrolled. */
  defaultStep?: string | number;
  onStepChange?: (stepId: string, stepIndex: number) => void;
  /** Fires when Finish passes validation on the last step. */
  onComplete?: (values: WizardValues) => void;
  /** Initial contents of the shared values bag. */
  defaultValues?: WizardValues;
  onValuesChange?: (values: WizardValues) => void;
  orientation?: WizardOrientation;
  showStepNav?: boolean;
  /** Allow clicking any future step without completing the ones before it. */
  allowJumpAhead?: boolean;
  /** Render the active step's title/description above its content. */
  showStepHeader?: boolean;
  labels?: WizardLabels;
  /** Replaces the Back / Next / Finish footer row. */
  renderFooter?: (ctx: WizardFooterContext) => ReactNode;
  /** Flex ratio of the vertical step-nav column. */
  navFlex?: number;
  /** Flex ratio of the vertical content column. */
  contentFlex?: number;
  /** Extra props for the native StepIndicator (horizontal orientation). */
  stepIndicatorProps?: WizardStepIndicatorProps;
}

export declare function Wizard(props: WizardProps): ReactNode;

export interface OnboardingChecklistAction {
  label: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "destructive" | "transparent";
  disabled?: boolean;
}

export interface OnboardingChecklistItem {
  id?: string | number;
  title?: ReactNode;
  description?: ReactNode;
  /** Drives the success marker and the progress bar. */
  done?: boolean;
  /** Inline CTA shown on incomplete rows (and done rows with showCompletedActions). */
  action?: OnboardingChecklistAction;
  [key: string]: unknown;
}

export interface OnboardingChecklistLabels {
  progress?: (done: number, total: number) => string;
}

export interface OnboardingChecklistProps {
  items?: OnboardingChecklistItem[];
  title?: ReactNode;
  description?: ReactNode;
  /** Show the ProgressBar headline. */
  progress?: boolean;
  /** When provided, item titles render as Links invoking this with the item. */
  onItemClick?: (item: OnboardingChecklistItem) => void;
  /** Wrap the checklist in an Accordion (open while incomplete by default). */
  collapsible?: boolean;
  /** Initial open state for collapsible mode. */
  defaultOpen?: boolean;
  /** Keep action buttons visible on completed rows. */
  showCompletedActions?: boolean;
  labels?: OnboardingChecklistLabels;
}

export declare function OnboardingChecklist(props: OnboardingChecklistProps): ReactNode;
