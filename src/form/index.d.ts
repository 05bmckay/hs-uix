import type { ReactElement, ReactNode, Ref } from "react";

// ---------------------------------------------------------------------------
// Field types
// ---------------------------------------------------------------------------

export type FormBuilderFieldType =
  | "text"
  | "password"
  | "textarea"
  | "number"
  | "stepper"
  | "currency"
  | "date"
  | "time"
  | "datetime"
  | "select"
  | "multiselect"
  | "toggle"
  | "checkbox"
  | "checkboxGroup"
  | "radioGroup"
  | "display"
  | "slot"
  | "repeater"
  | "fieldGroup"
  | "crmPropertyList"
  | "crmAssociationPropertyList"
  | (string & {}); // custom field types via fieldTypes plugin

export interface FormBuilderOption {
  label: string;
  value: string | number | boolean;
  description?: string;
  initialIsChecked?: boolean;
  readonly?: boolean;
}

export interface FormBuilderDateValue {
  year: number;
  month: number;
  date: number;
}

export interface FormBuilderTimeValue {
  hours: number;
  minutes: number;
}

export interface FormBuilderDateTimeValue {
  date?: FormBuilderDateValue;
  time?: FormBuilderTimeValue;
}

export interface FormBuilderValidationContext {
  signal?: AbortSignal;
}

export type FormBuilderValidatorResult = true | string;

export type FormBuilderValidator = (
  value: unknown,
  allValues: Record<string, unknown>,
  context?: FormBuilderValidationContext
) => FormBuilderValidatorResult | Promise<FormBuilderValidatorResult>;

export interface FormBuilderDependsOnConfig {
  field: string;
  display?: "grouped" | "inline";
  label?: string;
  message?: string | ((parentLabel: string) => string);
}

export interface FormBuilderRepeaterProps {
  addLabel?: string;
  removeLabel?: string;
  renderAdd?: (props: { onClick: () => void; count: number }) => ReactNode;
  renderRemove?: (props: { index: number; onClick: () => void }) => ReactNode;
  reorderable?: boolean;
  moveUpLabel?: string;
  moveDownLabel?: string;
  renderMoveUp?: (props: { index: number; disabled: boolean; onClick: () => void }) => ReactNode;
  renderMoveDown?: (props: { index: number; disabled: boolean; onClick: () => void }) => ReactNode;
}

export interface FormBuilderLabels {
  submit?: string;
  cancel?: string;
  back?: string;
  next?: string;
  required?: string | ((fieldLabel: string) => string); // validation: "{label} is required"
  invalidFormat?: string; // validation: "Invalid format"
  minLength?: string | ((min: number) => string); // validation: "Must be at least {n} characters"
  maxLength?: string | ((max: number) => string); // validation: "Must be no more than {n} characters"
  minValue?: string | ((min: number) => string); // validation: "Must be at least {n}"
  maxValue?: string | ((max: number) => string); // validation: "Must be no more than {n}"
  dependentProperties?: string; // heading for dependent field groups (default "Dependent properties")
  repeaterAdd?: string; // default add button label for repeater fields (default "Add")
  repeaterRemove?: string; // default remove button label for repeater fields (default "Remove")
}

export interface FormBuilderAlertConfig {
  addAlert?: (alert: { type: string; title?: string; message?: string }) => void;
  readOnlyTitle?: string;
  errorTitle?: string;
  successTitle?: string;
}

export interface FormBuilderConfirmDiscardConfig {
  /** Modal title. Default "Discard changes?". */
  title?: string;
  /** Modal body text. Default "You have unsaved changes. If you discard now, they will be lost.". */
  message?: string;
  /** Destructive confirm button label. Default "Discard changes". */
  confirmLabel?: string;
  /** Keep-editing button label. Default "Keep editing". */
  cancelLabel?: string;
}

export interface FormBuilderButtonsRenderContext {
  isMultiStep: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
  disabled: boolean;
  loading: boolean;
  /** True when current values deep-differ from the initial snapshot. */
  isDirty: boolean;
  labels: Required<Pick<FormBuilderLabels, "submit" | "cancel" | "back" | "next">>;
  onBack: () => void;
  onNext: () => void;
  onCancel?: () => void;
  onSubmit: (e?: unknown) => Promise<void>;
}

export type FormBuilderSubmitAlign = "start" | "end" | "between";

// ---------------------------------------------------------------------------
// Layout types
// ---------------------------------------------------------------------------

export type FormBuilderLayoutEntry = string | { field: string; flex?: number };
export type FormBuilderLayout = FormBuilderLayoutEntry[][];

// ---------------------------------------------------------------------------
// Field definition
// ---------------------------------------------------------------------------

export interface FormBuilderField {
  name: string;
  type: FormBuilderFieldType;
  label: string;

  // Common optional props (passed to most HubSpot components)
  description?: string;
  placeholder?: string;
  tooltip?: string;
  required?: boolean | ((values: Record<string, unknown>) => boolean);
  readOnly?: boolean;
  /** Escape hatch: when true, this field stays editable even if FormBuilder-level `readOnly` is set. */
  alwaysEditable?: boolean;
  disabled?: boolean | ((values: Record<string, unknown>) => boolean);
  defaultValue?: unknown;

  // Validation (validate may return a Promise for async validation)
  validate?: FormBuilderValidator;
  validators?: FormBuilderValidator[];
  useDefaultValidators?: boolean;
  validateDebounce?: number;
  pattern?: RegExp;
  patternMessage?: string;
  minLength?: number;
  maxLength?: number;
  min?: number | FormBuilderDateValue | FormBuilderTimeValue;
  max?: number | FormBuilderDateValue | FormBuilderTimeValue;
  minValidationMessage?: string;
  maxValidationMessage?: string;

  /**
   * Field-level loading indicator. While true the input is disabled and
   * select/multiselect fields render an inline LoadingSpinner beside the
   * control — `makeCrmSearchSelectField` / `makeCrmSearchMultiSelectField`
   * (hs-uix/utils) set this automatically while CRM search options load.
   */
  loading?: boolean;

  // Conditional visibility
  visible?: (values: Record<string, unknown>) => boolean;

  // Dependent properties grouping
  dependsOnConfig?: FormBuilderDependsOnConfig;

  // Layout
  colSpan?: number;
  width?: "full";

  // Field grouping (non-collapsible divider groups)
  group?: string;

  // Value transforms (storage ↔ display)
  transformIn?: (rawValue: unknown) => unknown;   // storage → display (on load)
  transformOut?: (displayValue: unknown) => unknown; // display → storage (on save)

  // Debounce onChange callback (ms) — useful for search-as-you-type fields
  debounce?: number;

  // Pass-through to underlying HubSpot component
  fieldProps?: Record<string, unknown>;

  // CrmPropertyList props (type: "crmPropertyList")
  properties?: string[];
  direction?: "column" | "row";
  objectId?: string;
  objectTypeId?: string;

  // CrmAssociationPropertyList props (type: "crmAssociationPropertyList")
  associationLabels?: string[];
  filters?: Array<{ operator: string; property: string; value: string }>;
  sort?: Array<{ columnName: string; direction: 1 | -1 }>;

  // Select / MultiSelect / ToggleGroup
  options?:
    | FormBuilderOption[]
    | ((values: Record<string, unknown>) => FormBuilderOption[]);

  // Select / Checkbox / ToggleGroup
  variant?: "input" | "transparent" | "default" | "small" | "sm";

  // Currency
  currency?: string;

  // TextArea
  rows?: number;
  cols?: number;
  resize?: "vertical" | "horizontal" | "both" | "none";

  // Number / Stepper / Currency
  precision?: number;
  formatStyle?: "decimal" | "percentage";

  // Stepper
  stepSize?: number;
  minValueReachedTooltip?: string;
  maxValueReachedTooltip?: string;

  // Toggle
  size?: "xs" | "sm" | "md";
  labelDisplay?: "inline" | "top" | "hidden";
  textChecked?: string;
  textUnchecked?: string;

  // Checkbox
  inline?: boolean;

  // Date / Time
  format?: "short" | "long" | "medium" | "standard" | "YYYY-MM-DD" | "L" | "LL" | "ll";
  timezone?: "userTz" | "portalTz";
  clearButtonLabel?: string;
  todayButtonLabel?: string;

  // Time
  interval?: number;

  // Field-level side effects (cross-field updates)
  onFieldChange?: (
    value: unknown,
    allValues: Record<string, unknown>,
    helpers: {
      setFieldValue: (name: string, value: unknown) => void;
      setFieldError: (name: string, message: string) => void;
    }
  ) => void;

  // Repeater field / fieldGroup field factory
  fields?: FormBuilderField[] | ((item: { key: string; label?: string; [k: string]: unknown }) => FormBuilderField[]);
  repeaterProps?: FormBuilderRepeaterProps;

  // fieldGroup props (type: "fieldGroup") — fixed structured groups
  items?: Array<{ key: string; label?: string; [k: string]: unknown }>;
  showItemLabel?: boolean;

  // Custom render escape hatch
  render?: (props: {
    value?: unknown;
    onChange?: (v: unknown) => void;
    error?: boolean;
    values: Record<string, unknown>;
    /** @deprecated Use `values` instead */
    allValues: Record<string, unknown>;
    setFieldValue?: (name: string, value: unknown) => void;
    setFieldError?: (name: string, message: string) => void;
  }) => ReactNode;
}

// ---------------------------------------------------------------------------
// Custom field type plugin
// ---------------------------------------------------------------------------

export interface FieldTypePlugin {
  render: (props: {
    value: unknown;
    onChange: (v: unknown) => void;
    error: boolean;
    field: FormBuilderField;
    values: Record<string, unknown>;
    /** @deprecated Use `values` instead */
    allValues: Record<string, unknown>;
  }) => ReactNode;
  getEmptyValue?: () => unknown;
  isEmpty?: (value: unknown) => boolean;
}

// ---------------------------------------------------------------------------
// Section definition (accordion grouping)
// ---------------------------------------------------------------------------

export interface FormBuilderSectionContext {
  values: Record<string, unknown>;
  errors: Record<string, string>;
}

export interface FormBuilderSection {
  id: string;
  label: string;
  fields: string[];
  defaultOpen?: boolean;
  info?: string;
  columns?: number;
  renderBefore?: (context: FormBuilderSectionContext) => ReactNode;
  renderAfter?: (context: FormBuilderSectionContext) => ReactNode;
}

export interface FormBuilderGroupOptions {
  /** Override the displayed group label (defaults to a start-cased group key). */
  label?: string;
  /** Show the group header label. Defaults to true. */
  showLabel?: boolean;
  /** Optional microcopy rendered underneath the group label. Ignored when `renderHeader` is provided or `showLabel` is false. */
  description?: string;
  /** Show the divider that separates this group from the previous one. Defaults to true. */
  showDivider?: boolean;
  /** Custom header renderer. Receives group name, fields in the group, and current form values. */
  renderHeader?: (
    group: string,
    fields: FormBuilderField[],
    values: Record<string, unknown>
  ) => ReactNode;
}

// ---------------------------------------------------------------------------
// Multi-step definition
// ---------------------------------------------------------------------------

export interface FormBuilderStep {
  title: string;
  fields?: string[];
  description?: string;
  render?: (props: {
    values: Record<string, unknown>;
    goNext: () => void;
    goBack: () => void;
    goTo: (step: number) => void;
  }) => ReactNode;
  validate?: (values: Record<string, unknown>) => true | Record<string, string>;
}

// ---------------------------------------------------------------------------
// Ref API
// ---------------------------------------------------------------------------

export interface FormBuilderRef {
  submit: () => Promise<void>;
  validate: () => { valid: boolean; errors: Record<string, string> };
  reset: () => void;
  getValues: () => Record<string, unknown>;
  isDirty: () => boolean;
  /** Names of fields whose current value deep-differs from the initial snapshot. */
  getDirtyFields: () => string[];
  setFieldValue: (name: string, value: unknown) => void;
  setFieldError: (name: string, message: string) => void;
  setErrors: (errors: Record<string, string>) => void;
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface FormBuilderProps {
  // Core
  fields: FormBuilderField[];
  onSubmit: (
    values: Record<string, unknown>,
    helpers: { reset: () => void; rawValues: Record<string, unknown> }
  ) => void | Promise<unknown>;

  // Value transforms
  transformValues?: (values: Record<string, unknown>) => Record<string, unknown>;
  transformInitialValues?: (rawValues: Record<string, unknown>) => Record<string, unknown>;
  onBeforeSubmit?: (values: Record<string, unknown>) => boolean | Promise<boolean>;
  onSubmitSuccess?: (
    result: unknown,
    helpers: { reset: () => void; values: Record<string, unknown> }
  ) => void;
  onSubmitError?: (
    error: unknown,
    helpers: { values: Record<string, unknown> }
  ) => void;
  resetOnSuccess?: boolean;

  // Initial / controlled values
  initialValues?: Record<string, unknown>;
  values?: Record<string, unknown>;
  onChange?: (values: Record<string, unknown>) => void;
  errors?: Record<string, string>;
  onFieldChange?: (
    name: string,
    value: unknown,
    allValues: Record<string, unknown>
  ) => void;

  // Validation
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  onValidationChange?: (errors: Record<string, string>) => void;
  /** Called when submit-time validation blocks submission. Lets callers surface their own toast/alert and inspect which field/section is invalid. */
  onValidationFail?: (info: {
    errors: Record<string, string>;
    fields: { name: string; label?: string; sectionId?: string }[];
    firstInvalidField?: { name: string; label?: string; sectionId?: string };
  }) => void;
  /** When true, FormBuilder auto-opens the accordion section containing the first invalid field on submit-time validation failure. */
  openSectionOnValidationFail?: boolean;

  // Multi-step
  steps?: FormBuilderStep[];
  step?: number;
  onStepChange?: (step: number) => void;
  showStepIndicator?: boolean;
  validateStepOnNext?: boolean;

  // Buttons / actions
  submitVariant?: "primary" | "secondary";
  showCancel?: boolean;
  onCancel?: () => void;
  /**
   * Guard the built-in Cancel button while the form is dirty: clicking it
   * opens a native Modal confirmation ("Keep editing" / destructive confirm)
   * before onCancel fires. Pass `true` for default copy or an object to
   * customize it. Note: extensions cannot intercept the host panel/modal
   * close (the X button) — pair this with onDirtyChange for those cases.
   */
  confirmDiscard?: boolean | FormBuilderConfirmDiscardConfig;
  submitPosition?: "bottom" | "none";
  /**
   * Controls the default single-step action-row alignment.
   * Defaults to `"between"` when `showCancel` is true, otherwise `"start"`.
   * Ignored when `steps` are provided; use `renderButtons` for custom multi-step layouts.
   */
  submitAlign?: FormBuilderSubmitAlign;
  loading?: boolean;
  disabled?: boolean;
  labels?: FormBuilderLabels;
  renderButtons?: (context: FormBuilderButtonsRenderContext) => ReactNode;

  // Appearance / layout
  columns?: number;
  columnWidth?: number;
  maxColumns?: number;
  layout?: FormBuilderLayout;
  sections?: FormBuilderSection[];
  groups?: Record<string, FormBuilderGroupOptions>;
  /**
   * Gap between fields (and between rows in grid layouts).
   * HubSpot spacing token: `"flush" | "extra-small" | "small" | "medium" | "large" | "extra-large"`
   * or shorthand: `"xs" | "sm" | "md" | "lg" | "xl"`. Defaults to `"sm"`.
   */
  gap?: string;
  showRequiredIndicator?: boolean;
  noFormWrapper?: boolean;
  autoComplete?: string;
  formProps?: Record<string, unknown>;
  fieldTypes?: Record<string, FieldTypePlugin>;

  // States
  error?: string | boolean;
  success?: string;
  readOnly?: boolean;
  readOnlyMessage?: string;
  alerts?: FormBuilderAlertConfig;
  showReadOnlyAlert?: boolean;
  showInlineAlerts?: boolean;
  renderReadOnlyAlert?: (context: { title: string; message: string }) => ReactNode; // custom readOnly alert renderer
  renderFieldError?: (error: string, field: FormBuilderField) => ReactNode; // custom field error renderer
  defaultCurrency?: string; // form-level default ISO 4217 currency code (default "USD")

  // Auto-save
  autoSave?: {
    debounce?: number;
    onAutoSave: (values: Record<string, unknown>) => void;
  };

  // Events
  onDirtyChange?: (isDirty: boolean) => void;

  // Ref
  ref?: Ref<FormBuilderRef>;
}

export declare function FormBuilder(props: FormBuilderProps): ReactElement | null;

// ---------------------------------------------------------------------------
// CRM Integration utilities
// ---------------------------------------------------------------------------

/**
 * Maps CRM property values (from useCrmProperties) to form initial values.
 * `properties` is the flat { propertyName: value } object.
 * Without `mapping`: direct pass-through (field names === CRM property names).
 * With `mapping`: maps { formFieldName: "crmPropertyName" }.
 */
export declare function useFormPrefill(
  properties: Record<string, unknown> | undefined,
  mapping?: Record<string, string>
): Record<string, unknown>;

// ---------------------------------------------------------------------------
// HubSpot property schema mapping
// ---------------------------------------------------------------------------

/** One enumeration option on a HubSpot property definition. */
export interface FormBuilderHubSpotPropertyOption {
  label?: string;
  value: string | number | boolean;
  description?: string;
  displayOrder?: number;
  hidden?: boolean;
}

/** A HubSpot property definition (GET /crm/v3/properties/{objectType}). Extra API fields are tolerated. */
export interface FormBuilderHubSpotProperty {
  name: string;
  label?: string;
  type?: string; // "string" | "number" | "date" | "datetime" | "enumeration" | "bool" | ...
  fieldType?: string; // "text" | "textarea" | "select" | "radio" | "checkbox" | "booleancheckbox" | "number" | "date" | "phonenumber" | ...
  description?: string;
  options?: FormBuilderHubSpotPropertyOption[];
  hidden?: boolean;
  calculated?: boolean;
  modificationMetadata?: { readOnlyValue?: boolean; [k: string]: unknown };
  [k: string]: unknown;
}

export interface FormBuilderHubSpotSchemaOptions {
  /** Property names to keep. Also sets the output field order. */
  include?: string[];
  /** Property names to drop. */
  exclude?: string[];
  /** Per-property partial field configs merged over the generated config. */
  overrides?: Record<string, Partial<FormBuilderField>>;
  /** Property names to mark required — an array of names or a name → required map. */
  requiredOverrides?: string[] | Record<string, boolean>;
  /** Copy property descriptions into field `description` help text. Default false. */
  includeDescriptions?: boolean;
}

/**
 * Maps HubSpot property definitions to FormBuilder field configs.
 * select → select · radio → radioGroup · checkbox → multiselect ·
 * booleancheckbox → toggle (with "true"/"false" string normalization) ·
 * date → date · datetime → datetime · number → number (string parsing) ·
 * textarea → textarea · text/phonenumber → text. Hidden enumeration options
 * are filtered; calculated / readOnlyValue properties come back readOnly.
 */
export declare function fieldsFromHubSpotProperties(
  properties: FormBuilderHubSpotProperty[] | null | undefined,
  options?: FormBuilderHubSpotSchemaOptions
): FormBuilderField[];
