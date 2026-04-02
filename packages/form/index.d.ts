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
  | "radioGroup";

export interface FormBuilderOption {
  label: string;
  value: string | number | boolean;
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

// ---------------------------------------------------------------------------
// Field definition
// ---------------------------------------------------------------------------

export interface FormBuilderField {
  name: string;
  type: FormBuilderFieldType;
  label: string;

  // Common optional props
  description?: string;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  readOnly?: boolean;
  defaultValue?: unknown;

  // Validation
  validate?: (value: unknown, allValues: Record<string, unknown>) => true | string;
  pattern?: RegExp;
  patternMessage?: string;
  minLength?: number;
  maxLength?: number;
  min?: number | FormBuilderDateValue;
  max?: number | FormBuilderDateValue;

  // Conditional visibility
  visible?: (values: Record<string, unknown>) => boolean;

  // Dependent properties grouping
  dependsOn?: string;
  dependsOnLabel?: string;
  dependsOnMessage?: string | ((parentLabel: string) => string);

  // Layout
  width?: "full" | "half";

  // Pass-through to underlying HubSpot component
  fieldProps?: Record<string, unknown>;

  // Select / MultiSelect / ToggleGroup
  options?:
    | FormBuilderOption[]
    | ((values: Record<string, unknown>) => FormBuilderOption[]);

  // Currency
  currency?: string;

  // TextArea
  rows?: number;
  resize?: "vertical" | "horizontal" | "both" | "none";

  // Number / Stepper / Currency
  precision?: number;
  formatStyle?: "decimal" | "percentage";
  stepSize?: number;

  // Toggle
  size?: "xs" | "sm" | "md";
  labelDisplay?: "inline" | "top" | "hidden";

  // Date
  format?: string;

  // Custom render escape hatch
  render?: (props: {
    value: unknown;
    onChange: (v: unknown) => void;
    error: boolean;
    allValues: Record<string, unknown>;
  }) => ReactNode;
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
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface FormBuilderProps {
  // Core
  fields: FormBuilderField[];
  onSubmit: (
    values: Record<string, unknown>,
    helpers: { reset: () => void }
  ) => void | Promise<void>;

  // Initial / controlled values
  initialValues?: Record<string, unknown>;
  values?: Record<string, unknown>;
  onChange?: (values: Record<string, unknown>) => void;
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
  submitLabel?: string;
  submitVariant?: "primary" | "secondary";
  showCancel?: boolean;
  cancelLabel?: string;
  onCancel?: () => void;
  submitPosition?: "bottom" | "none";
  loading?: boolean;
  disabled?: boolean;

  // Appearance
  gap?: string;
  showRequiredIndicator?: boolean;
  noFormWrapper?: boolean;
  autoComplete?: string;

  // States
  error?: string | boolean;
  success?: string;

  // Events
  onDirtyChange?: (isDirty: boolean) => void;

  // Ref
  ref?: Ref<FormBuilderRef>;
}

export declare function FormBuilder(props: FormBuilderProps): ReactElement | null;
