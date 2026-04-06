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
  | "repeater"
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
  renderMoveUp?: (props: { index: number; onClick: () => void }) => ReactNode;
  renderMoveDown?: (props: { index: number; onClick: () => void }) => ReactNode;
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

export interface FormBuilderButtonsRenderContext {
  isMultiStep: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
  disabled: boolean;
  loading: boolean;
  labels: Required<Pick<FormBuilderLabels, "submit" | "cancel" | "back" | "next">>;
  onBack: () => void;
  onNext: () => void;
  onCancel?: () => void;
  onSubmit: (e?: unknown) => Promise<void>;
}

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
  disabled?: boolean;
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

  // Field-level loading indicator
  loading?: boolean;

  // Conditional visibility
  visible?: (values: Record<string, unknown>) => boolean;

  // Dependent properties grouping
  dependsOnConfig?: FormBuilderDependsOnConfig;

  // Layout
  colSpan?: number;

  // Field grouping (non-collapsible divider groups)
  group?: string;

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

  // Repeater field
  fields?: FormBuilderField[];
  repeaterProps?: FormBuilderRepeaterProps;

  // Custom render escape hatch (for display fields, only allValues is provided)
  render?: (props: {
    value?: unknown;
    onChange?: (v: unknown) => void;
    error?: boolean;
    allValues: Record<string, unknown>;
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
    allValues: Record<string, unknown>;
  }) => ReactNode;
  getEmptyValue?: () => unknown;
  isEmpty?: (value: unknown) => boolean;
}

// ---------------------------------------------------------------------------
// Section definition (accordion grouping)
// ---------------------------------------------------------------------------

export interface FormBuilderSection {
  id: string;
  label: string;
  fields: string[];
  defaultOpen?: boolean;
  info?: string;
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

  // Submit lifecycle
  transformValues?: (values: Record<string, unknown>) => Record<string, unknown>;
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
  submitPosition?: "bottom" | "none";
  loading?: boolean;
  disabled?: boolean;
  labels?: FormBuilderLabels;
  renderButtons?: (context: FormBuilderButtonsRenderContext) => ReactNode;

  // Appearance / layout
  columns?: number;
  columnWidth?: number;
  /** @deprecated No longer enforced — HubSpot AutoGrid requires all fields in one grid instance for responsive reflow. */
  maxColumns?: number;
  layout?: FormBuilderLayout;
  sections?: FormBuilderSection[];
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
