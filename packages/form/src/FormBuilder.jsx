import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

import {
  Accordion,
  Form,
  Flex,
  Box,
  AutoGrid,
  Tile,
  Inline,
  Text,
  Link,
  Icon,
  Divider,
  Button,
  LoadingButton,
  Alert,
  Tooltip,
  StepIndicator,
  Input,
  TextArea,
  Select,
  MultiSelect,
  NumberInput,
  StepperInput,
  CurrencyInput,
  DateInput,
  TimeInput,
  Toggle,
  Checkbox,
  ToggleGroup,
} from "@hubspot/ui-extensions";

import {
  CrmPropertyList,
  CrmAssociationPropertyList,
} from "@hubspot/ui-extensions/crm";

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

const getEmptyValue = (field) => {
  switch (field.type) {
    case "toggle":
    case "checkbox":
      return false;
    case "multiselect":
    case "checkboxGroup":
      return [];
    case "number":
    case "stepper":
    case "currency":
      return undefined;
    case "date":
    case "time":
    case "datetime":
      return undefined;
    case "display":
    case "crmPropertyList":
    case "crmAssociationPropertyList":
      return undefined; // these field types have no form value
    case "repeater":
      return [];
    default:
      return "";
  }
};

const isValueEmpty = (value, field) => {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  // false is a valid value for toggles/checkboxes — not "empty" unless required means "must be checked"
  if ((field.type === "toggle" || field.type === "checkbox") && value === false) return true;
  return false;
};

const isPromise = (value) => value && typeof value.then === "function";
const isAsyncFunction = (fn) => fn && fn.constructor && fn.constructor.name === "AsyncFunction";

const normalizeValidatorResult = (result) => {
  if (result === true || result === undefined || result === null || result === false) return null;
  return String(result);
};

const isDateValueObject = (value) =>
  isPlainObject(value) &&
  Number.isInteger(value.year) &&
  Number.isInteger(value.month) &&
  Number.isInteger(value.date);

const isTimeValueObject = (value) =>
  isPlainObject(value) &&
  Number.isInteger(value.hours) &&
  Number.isInteger(value.minutes);

const compareDateValues = (a, b) => {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.date - b.date;
};

const compareTimeValues = (a, b) => {
  if (a.hours !== b.hours) return a.hours - b.hours;
  return a.minutes - b.minutes;
};

const runDefaultFieldValidator = (value, field, allValues) => {
  const errorPrefix = field.label || field.name;

  switch (field.type) {
    case "text":
    case "password":
    case "textarea":
      if (typeof value !== "string") return `${errorPrefix} must be text`;
      break;
    case "number":
    case "stepper":
    case "currency":
      if (typeof value !== "number" || Number.isNaN(value)) return `${errorPrefix} must be a number`;
      break;
    case "toggle":
    case "checkbox":
      if (typeof value !== "boolean") return `${errorPrefix} must be true or false`;
      break;
    case "select":
    case "radioGroup": {
      const options = resolveOptions(field, allValues);
      if (options.length > 0 && !options.some((o) => Object.is(o.value, value))) {
        return `${errorPrefix} has an invalid selection`;
      }
      break;
    }
    case "multiselect":
    case "checkboxGroup": {
      if (!Array.isArray(value)) return `${errorPrefix} must be a list`;
      const options = resolveOptions(field, allValues);
      if (options.length > 0) {
        const validValues = new Set(options.map((o) => o.value));
        const hasInvalid = value.some((item) => !validValues.has(item));
        if (hasInvalid) return `${errorPrefix} has an invalid selection`;
      }
      break;
    }
    case "date":
      if (!isDateValueObject(value)) return `${errorPrefix} has an invalid date`;
      break;
    case "time":
      if (!isTimeValueObject(value)) return `${errorPrefix} has an invalid time`;
      break;
    case "datetime": {
      if (!isPlainObject(value)) return `${errorPrefix} has an invalid date/time`;
      const hasDate = value.date !== undefined;
      const hasTime = value.time !== undefined;
      if (!hasDate && !hasTime) return `${errorPrefix} has an invalid date/time`;
      if (hasDate && !isDateValueObject(value.date)) return `${errorPrefix} has an invalid date`;
      if (hasTime && !isTimeValueObject(value.time)) return `${errorPrefix} has an invalid time`;
      break;
    }
    case "repeater":
      if (!Array.isArray(value)) return `${errorPrefix} has invalid rows`;
      break;
    default:
      break;
  }

  return null;
};

const runCustomSyncValidators = (value, field, allValues) => {
  const validators = Array.isArray(field.validators) ? field.validators : [];
  for (const validator of validators) {
    if (isAsyncFunction(validator)) continue;
    try {
      const result = validator(value, allValues);
      if (isPromise(result)) continue;
      const err = normalizeValidatorResult(result);
      if (err) return err;
    } catch (err) {
      return err?.message || "Validation failed";
    }
  }

  if (field.validate && !isAsyncFunction(field.validate)) {
    try {
      const result = field.validate(value, allValues);
      if (!isPromise(result)) {
        const err = normalizeValidatorResult(result);
        if (err) return err;
      }
    } catch (err) {
      return err?.message || "Validation failed";
    }
  }

  return null;
};

const collectAsyncValidatorPromises = (value, field, allValues, context) => {
  const promises = [];
  const validators = Array.isArray(field.validators) ? field.validators : [];
  for (const validator of validators) {
    try {
      const result = validator(value, allValues, context);
      if (isPromise(result)) promises.push(result);
    } catch (err) {
      promises.push(Promise.reject(err));
    }
  }

  if (field.validate) {
    try {
      const result = field.validate(value, allValues, context);
      if (isPromise(result)) promises.push(result);
    } catch (err) {
      promises.push(Promise.reject(err));
    }
  }

  return promises;
};

const runValidators = (value, field, allValues, fieldTypes, options = {}) => {
  const includeCustomValidators = options.includeCustomValidators !== false;
  const msg = options.messages || {};
  // Display, CRM data, and fieldGroup fields have no direct validation
  if (field.type === "display" || field.type === "crmPropertyList" || field.type === "crmAssociationPropertyList" || field.type === "fieldGroup") return null;

  // 1. Required (supports function form for conditional required)
  const isRequired = resolveRequired(field, allValues);
  // Check custom type isEmpty if available
  const plugin = fieldTypes && fieldTypes[field.type];
  const empty = plugin && plugin.isEmpty
    ? plugin.isEmpty(value)
    : isValueEmpty(value, field);
  if (isRequired && empty) {
    const fn = msg.required || ((label) => `${label} is required`);
    return typeof fn === "function" ? fn(field.label) : fn;
  }

  // Skip further validation if empty and not required
  if (empty) return null;

  // 2. Built-in type/shape validators
  if (field.useDefaultValidators !== false) {
    const typeError = runDefaultFieldValidator(value, field, allValues);
    if (typeError) return typeError;
  }

  // 3. Pattern (text/textarea/password only)
  if (field.pattern && typeof value === "string") {
    if (!field.pattern.test(value)) {
      return field.patternMessage || msg.invalidFormat || "Invalid format";
    }
  }

  // 4. Min/Max length (text/textarea)
  if (typeof value === "string") {
    if (field.minLength != null && value.length < field.minLength) {
      const fn = msg.minLength || ((min) => `Must be at least ${min} characters`);
      return typeof fn === "function" ? fn(field.minLength) : fn;
    }
    if (field.maxLength != null && value.length > field.maxLength) {
      const fn = msg.maxLength || ((max) => `Must be no more than ${max} characters`);
      return typeof fn === "function" ? fn(field.maxLength) : fn;
    }
  }

  // 5. Min/Max value (number/stepper/currency/date/time)
  if (typeof value === "number") {
    if (field.min != null && value < field.min) {
      const fn = msg.minValue || ((min) => `Must be at least ${min}`);
      return typeof fn === "function" ? fn(field.min) : fn;
    }
    if (field.max != null && value > field.max) {
      const fn = msg.maxValue || ((max) => `Must be no more than ${max}`);
      return typeof fn === "function" ? fn(field.max) : fn;
    }
  }

  if (field.type === "date" && isDateValueObject(value)) {
    if (field.min && isDateValueObject(field.min) && compareDateValues(value, field.min) < 0) {
      return field.minValidationMessage || "Date is too early";
    }
    if (field.max && isDateValueObject(field.max) && compareDateValues(value, field.max) > 0) {
      return field.maxValidationMessage || "Date is too late";
    }
  }

  if (field.type === "time" && isTimeValueObject(value)) {
    if (field.min && isTimeValueObject(field.min) && compareTimeValues(value, field.min) < 0) {
      return field.minValidationMessage || "Time is too early";
    }
    if (field.max && isTimeValueObject(field.max) && compareTimeValues(value, field.max) > 0) {
      return field.maxValidationMessage || "Time is too late";
    }
  }

  // 6. Custom validate (sync only — async handled separately)
  if (includeCustomValidators) {
    const customError = runCustomSyncValidators(value, field, allValues);
    if (customError) return customError;
  }

  return null;
};

const resolveRequired = (field, allValues) => {
  if (typeof field.required === "function") return field.required(allValues);
  return !!field.required;
};

const resolveOptions = (field, allValues) => {
  if (typeof field.options === "function") return field.options(allValues);
  return field.options || [];
};

const getDependsOnName = (field) =>
  field.dependsOnConfig && field.dependsOnConfig.field;

const getDependsOnDisplay = (field) =>
  (field.dependsOnConfig && field.dependsOnConfig.display) || "grouped";

const getDependsOnLabel = (field) =>
  field.dependsOnConfig && field.dependsOnConfig.label;

const getDependsOnMessage = (field) =>
  field.dependsOnConfig && field.dependsOnConfig.message;

const getRepeaterErrorKey = (fieldName, rowIdx, subFieldName) =>
  `${fieldName}[${rowIdx}].${subFieldName}`;

const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

const deepEqual = (a, b) => {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
};

const fieldSetHasErrors = (errors, fields) => {
  if (!errors || !fields || fields.length === 0) return false;
  const names = new Set(fields.map((field) => field.name));
  return Object.keys(errors).some((errorKey) => {
    const base = errorKey.split("[")[0];
    return names.has(base);
  });
};

const deepClone = (value) => {
  if (Array.isArray(value)) return value.map(deepClone);
  if (value instanceof Date) return new Date(value.getTime());
  if (isPlainObject(value)) {
    const next = {};
    for (const key of Object.keys(value)) {
      next[key] = deepClone(value[key]);
    }
    return next;
  }
  return value;
};

// ---------------------------------------------------------------------------
// CRM Integration utilities
// ---------------------------------------------------------------------------

/**
 * Maps CRM property values to form initial values.
 * `properties` is the flat { propertyName: value } object from useCrmProperties.
 *
 * Without mapping (direct pass-through — field names match CRM property names):
 *   const initialValues = useFormPrefill(properties);
 *
 * With mapping (field names differ from CRM property names):
 *   const initialValues = useFormPrefill(properties, {
 *     firstName: "firstname",
 *     lastName: "lastname",
 *   });
 */
export const useFormPrefill = (properties, mapping) => {
  return useMemo(() => {
    if (!properties) return {};

    // No mapping — direct pass-through (field names === CRM property names)
    if (!mapping) {
      const result = {};
      for (const [key, value] of Object.entries(properties)) {
        if (value !== undefined) result[key] = value;
      }
      return result;
    }

    // Explicit mapping — { formFieldName: "crmPropertyName" }
    const result = {};
    for (const [formField, crmProp] of Object.entries(mapping)) {
      if (properties[crmProp] !== undefined) {
        result[formField] = properties[crmProp];
      }
    }
    return result;
  }, [properties, mapping]);
};

// ---------------------------------------------------------------------------
// FormBuilder component
// ---------------------------------------------------------------------------

export const FormBuilder = forwardRef(function FormBuilder(props, ref) {
  // -- Props destructuring --------------------------------------------------

  // Core
  const {
    fields,       // FormBuilderField[] — field definitions
    onSubmit,     // (values, { reset, rawValues }) => void | Promise
    transformValues, // (values) => values — reshape before submit
    transformInitialValues, // (rawInitialValues) => values — reshape raw data on load
    onBeforeSubmit,  // (values) => boolean | Promise<boolean> — intercept submit
    onSubmitSuccess, // (result, { reset, values }) => void
    onSubmitError,   // (error, { values }) => void
    resetOnSuccess = false, // auto-reset after successful submit
  } = props;

  // Initial / controlled values
  const {
    initialValues,  // Record<string, unknown> — starting values (uncontrolled)
    values,         // Record<string, unknown> — controlled values
    onChange,       // (values) => void — called on any field change (controlled)
    onFieldChange,  // (name, value, allValues) => void — per-field change callback
  } = props;

  // Validation
  const {
    validateOnChange = false,  // validate on keystroke (onInput)
    validateOnBlur = true,     // validate on blur
    validateOnSubmit = true,   // validate all before onSubmit
    onValidationChange,        // (errors) => void
  } = props;

  // Multi-step
  const {
    steps,                     // FormBuilderStep[] — enables multi-step mode
    step: controlledStep,      // number — controlled current step (0-based)
    onStepChange,              // (step) => void
    showStepIndicator = true,  // show StepIndicator component
    validateStepOnNext = true, // validate current step fields before Next
  } = props;

  // Buttons / actions
  const {
    labels,                        // { submit, cancel, back, next } — i18n label object
    submitVariant = "primary",     // submit button variant
    showCancel = false,            // show cancel button
    onCancel,                      // () => void
    submitPosition = "bottom",     // "bottom" | "none"
    loading: controlledLoading,    // controlled loading state
    disabled = false,              // disable entire form
    renderButtons: renderButtonsProp, // custom action row renderer
  } = props;

  // Appearance / layout
  const {
    columns = 1,                   // number of grid columns (1 = full-width stack)
    columnWidth,                   // AutoGrid columnWidth — responsive layout (overrides columns)
    maxColumns,                    // cap number of columns per row in AutoGrid mode
    layout,                        // explicit row layout array (overrides columns + columnWidth)
    sections,                      // FormBuilderSection[] — accordion field grouping
    gap = "sm",                    // gap between fields
    showRequiredIndicator = true,  // show * on required fields
    noFormWrapper = false,         // skip HubSpot <Form> wrapper
    autoComplete,                  // form autoComplete attribute
    formProps,                     // pass-through props for Form wrapper
    fieldTypes,                    // Record<string, FieldTypePlugin> — custom field type registry
  } = props;

  // States
  const {
    error: formError,   // string | boolean — form-level error alert
    success: formSuccess, // string — form-level success alert
    readOnly: formReadOnly = false, // boolean — lock all fields
    readOnlyMessage,    // string — warning alert when readOnly
    alerts,           // { addAlert, readOnlyTitle, errorTitle, successTitle }
    errors: controlledErrors, // controlled validation errors
    showReadOnlyAlert = true,  // show warning Alert when readOnly is true
    showInlineAlerts = true,   // show inline form-level error/success Alerts
    renderReadOnlyAlert,       // (context: { title, message }) => ReactNode — custom readOnly alert renderer
    renderFieldError,          // (error: string, field: object) => ReactNode — custom field error renderer
    defaultCurrency = "USD",   // form-level default ISO 4217 currency code for currency fields
  } = props;

  // Events
  const {
    onDirtyChange,  // (isDirty: boolean) => void
    autoSave,       // { debounce: number, onAutoSave: (values) => void }
  } = props;

   const submitButtonLabel = labels?.submit || "Submit";
  const cancelButtonLabel = labels?.cancel || "Cancel";
  const backButtonLabel = labels?.back || "Back";
  const nextButtonLabel = labels?.next || "Next";

  // Validation message overrides
  const requiredMessage = labels?.required || ((label) => `${label} is required`);
  const invalidFormatMessage = labels?.invalidFormat || "Invalid format";
  const minLengthMessage = labels?.minLength || ((min) => `Must be at least ${min} characters`);
  const maxLengthMessage = labels?.maxLength || ((max) => `Must be no more than ${max} characters`);
  const minValueMessage = labels?.minValue || ((min) => `Must be at least ${min}`);
  const maxValueMessage = labels?.maxValue || ((max) => `Must be no more than ${max}`);

  // Dependent properties / repeater label overrides
  const dependentPropertiesLabel = labels?.dependentProperties || "Dependent properties";
  const repeaterAddLabel = labels?.repeaterAdd || "Add";
  const repeaterRemoveLabel = labels?.repeaterRemove || "Remove";

  const validationMessages = labels ? {
    required: requiredMessage,
    invalidFormat: invalidFormatMessage,
    minLength: minLengthMessage,
    maxLength: maxLengthMessage,
    minValue: minValueMessage,
    maxValue: maxValueMessage,
  } : undefined;

  const addAlert = alerts?.addAlert;
  const readOnlyTitle = alerts?.readOnlyTitle || "Read Only";
  const errorTitle = alerts?.errorTitle || "Error";
  const successTitle = alerts?.successTitle || "Success";

  // -- Popup alerts via addAlert --------------------------------------------

  const prevErrorRef = useRef(formError);
  const prevSuccessRef = useRef(formSuccess);

  useEffect(() => {
    if (!addAlert) return;
    if (formError && formError !== prevErrorRef.current) {
      addAlert({
        type: "danger",
        title: errorTitle,
        message: typeof formError === "string" ? formError : undefined,
      });
    }
    prevErrorRef.current = formError;
  }, [addAlert, formError, errorTitle]);

  useEffect(() => {
    if (!addAlert) return;
    if (formSuccess && formSuccess !== prevSuccessRef.current) {
      addAlert({
        type: "success",
        title: successTitle,
        message: formSuccess,
      });
    }
    prevSuccessRef.current = formSuccess;
  }, [addAlert, formSuccess, successTitle]);

  // -- Dev warnings for common prop mistakes --------------------------------

  if (process.env.NODE_ENV !== "production") {
    const KNOWN_FIELD_PROPS = new Set([
      "name", "type", "label", "description", "placeholder", "tooltip", "required",
      "readOnly", "disabled", "defaultValue", "fieldProps", "colSpan", "width",
      "visible", "dependsOn", "dependsOnConfig", "group", "debounce",
      "pattern", "patternMessage", "minLength", "maxLength", "min", "max",
      "validate", "validators", "validateDebounce", "useDefaultValidators",
      "transformIn", "transformOut", "onFieldChange", "onInput", "onBlur",
      "options", "variant", "inline", "render", "fields", "items", "showItemLabel",
      "columns", "repeaterProps", "size", "labelDisplay", "textChecked", "textUnchecked",
      "rows", "cols", "resize", "stepSize", "precision", "formatStyle",
      "minValueReachedTooltip", "maxValueReachedTooltip", "currency",
      "format", "timezone", "clearButtonLabel", "todayButtonLabel",
      "minValidationMessage", "maxValidationMessage", "interval",
      "properties", "direction", "objectId", "objectTypeId", "associationLabels",
      "filters", "sort",
    ]);
    const FIELD_SUGGESTIONS = {
      fullWidth: 'Use width: "full" or colSpan instead',
      title: "Use label instead",
      maxColumns: "maxColumns is a FormBuilder prop, not a field prop",
    };
    const KNOWN_SECTION_PROPS = new Set([
      "id", "label", "fields", "defaultOpen", "info", "renderBefore", "renderAfter",
    ]);
    const SECTION_SUGGESTIONS = {
      title: "Use label instead",
      name: "Use id instead",
      open: "Use defaultOpen instead",
    };
    for (const field of fields) {
      for (const key of Object.keys(field)) {
        if (!KNOWN_FIELD_PROPS.has(key)) {
          const suggestion = FIELD_SUGGESTIONS[key];
          const hint = suggestion ? ` ${suggestion}.` : "";
          console.warn(`[hs-uix] Warning: Field "${field.name}" has unknown prop "${key}".${hint}`);
        }
      }
    }
    if (Array.isArray(sections)) {
      for (const sec of sections) {
        for (const key of Object.keys(sec)) {
          if (!KNOWN_SECTION_PROPS.has(key)) {
            const suggestion = SECTION_SUGGESTIONS[key];
            const hint = suggestion ? ` ${suggestion}.` : "";
            console.warn(`[hs-uix] Warning: Section "${sec.id || "(unnamed)"}" has unknown prop "${key}".${hint}`);
          }
        }
      }
    }
  }

  // -- Internal state -------------------------------------------------------

  const computeInitialValues = () => {
    // Apply form-level initial values transform (reshape raw API data)
    const resolved = transformInitialValues && initialValues
      ? transformInitialValues(initialValues)
      : initialValues;
    const vals = {};
    for (const field of fields) {
      if (field.type === "display" || field.type === "crmPropertyList" || field.type === "crmAssociationPropertyList") continue;

      // fieldGroup: initialize all generated sub-fields
      if (field.type === "fieldGroup" && field.items && field.fields) {
        for (const item of field.items) {
          const subFields = field.fields(item);
          for (const sf of subFields) {
            const plugin = fieldTypes && fieldTypes[sf.type];
            const emptyValue = plugin && plugin.getEmptyValue ? plugin.getEmptyValue() : getEmptyValue(sf);
            let init = resolved && resolved[sf.name] !== undefined
              ? resolved[sf.name]
              : sf.defaultValue !== undefined
                ? sf.defaultValue
                : emptyValue;
            if (sf.transformIn) init = sf.transformIn(init);
            vals[sf.name] = init;
          }
        }
        continue;
      }

      // Check custom field type for getEmptyValue
      const plugin = fieldTypes && fieldTypes[field.type];
      const emptyValue = plugin && plugin.getEmptyValue
        ? plugin.getEmptyValue()
        : getEmptyValue(field);
      let init = resolved && resolved[field.name] !== undefined
        ? resolved[field.name]
        : field.defaultValue !== undefined
          ? field.defaultValue
          : emptyValue;
      // Apply per-field transformIn (storage → display)
      if (field.transformIn) init = field.transformIn(init);
      vals[field.name] = init;
    }
    return vals;
  };

  const [internalValues, setInternalValues] = useState(computeInitialValues);
  const [internalErrors, setInternalErrors] = useState({});    // { fieldName: "message" }
  const [internalStep, setInternalStep] = useState(0);
  const [internalLoading, setInternalLoading] = useState(false);
  const [validatingFields, setValidatingFields] = useState({}); // { fieldName: true } — async validation in-flight

  // Track pending async validations (Map<fieldName, Promise>)
  const asyncValidationRef = useRef(new Map());
  const asyncAbortRef = useRef(new Map());
  const asyncValidationVersionRef = useRef(new Map());
  // Track debounce timers (Map<fieldName, timeoutId>)
  const debounceTimersRef = useRef(new Map());
  const inputDebounceRef = useRef(new Map());
  const rowKeyRef = useRef(new WeakMap());
  const rowKeyCounterRef = useRef(0);

  // Track initial snapshot for dirty detection
  const initialSnapshot = useRef(null);
  if (initialSnapshot.current === null) {
    initialSnapshot.current = deepClone(computeInitialValues());
  }

  // -- State resolution (controlled vs uncontrolled) ------------------------

  const formValues = values != null ? values : internalValues;
  const formErrors = controlledErrors != null ? controlledErrors : internalErrors;
  const currentStep = controlledStep != null ? controlledStep : internalStep;
  const isLoading = controlledLoading != null ? controlledLoading : internalLoading;
  const isMultiStep = Array.isArray(steps) && steps.length > 0;
  const formValuesRef = useRef(formValues);
  const formErrorsRef = useRef(formErrors);
  const draftValuesRef = useRef(null);
  formValuesRef.current = formValues;
  formErrorsRef.current = formErrors;

  const fieldByName = useMemo(() => {
    const map = new Map();
    for (const field of fields) {
      map.set(field.name, field);
      // Register fieldGroup sub-fields so validation/change handlers can find them
      if (field.type === "fieldGroup" && field.items && field.fields) {
        for (const item of field.items) {
          for (const sf of field.fields(item)) map.set(sf.name, sf);
        }
      }
    }
    return map;
  }, [fields]);

  const isDev =
    typeof process === "undefined" ||
    !process.env ||
    process.env.NODE_ENV !== "production";
  const configWarningsRef = useRef(new Set());

  const warnConfig = useCallback((message) => {
    if (!isDev) return;
    if (configWarningsRef.current.has(message)) return;
    configWarningsRef.current.add(message);
    if (typeof console !== "undefined" && console.warn) {
      console.warn(`[FormBuilder] ${message}`);
    }
  }, [isDev]);

  const replaceErrors = useCallback(
    (nextErrors) => {
      if (controlledErrors == null) setInternalErrors(nextErrors);
      if (onValidationChange) onValidationChange(nextErrors);
    },
    [controlledErrors, onValidationChange]
  );

  const updateErrors = useCallback(
    (newErrors) => {
      const mergeErrors = (base) => {
        const merged = { ...base, ...newErrors };
        for (const key of Object.keys(newErrors)) {
          if (newErrors[key] === null || newErrors[key] === undefined) {
            delete merged[key];
          }
        }
        return merged;
      };

      if (controlledErrors != null) {
        const merged = mergeErrors(formErrorsRef.current || {});
        if (onValidationChange) onValidationChange(merged);
        return;
      }

      setInternalErrors((prev) => {
        const merged = mergeErrors(prev);
        if (onValidationChange) onValidationChange(merged);
        return merged;
      });
    },
    [controlledErrors, onValidationChange]
  );

  const getFieldEmptyValue = useCallback(
    (field) => {
      const plugin = fieldTypes && fieldTypes[field.type];
      return plugin && plugin.getEmptyValue ? plugin.getEmptyValue() : getEmptyValue(field);
    },
    [fieldTypes]
  );

  const getRowKey = useCallback((fieldName, row, index) => {
    if (!row || typeof row !== "object") return `${fieldName}-idx-${index}`;
    if (!rowKeyRef.current.has(row)) {
      rowKeyCounterRef.current += 1;
      rowKeyRef.current.set(row, `${fieldName}-row-${rowKeyCounterRef.current}`);
    }
    return rowKeyRef.current.get(row);
  }, []);

  // Clean up debounce timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of debounceTimersRef.current.values()) clearTimeout(timer);
      for (const timer of inputDebounceRef.current.values()) clearTimeout(timer);
      for (const controller of asyncAbortRef.current.values()) controller.abort();
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  // -- Dirty tracking -------------------------------------------------------

  const isDirty = useMemo(() => {
    return !deepEqual(formValues, initialSnapshot.current);
  }, [formValues]);

  const prevDirtyRef = useRef(false);
  useEffect(() => {
    if (isDirty !== prevDirtyRef.current) {
      prevDirtyRef.current = isDirty;
      if (onDirtyChange) onDirtyChange(isDirty);
    }
  }, [isDirty, onDirtyChange]);

  // -- Auto-save --------------------------------------------------------------

  const autoSaveTimerRef = useRef(null);
  const autoSaveRef = useRef(autoSave);
  autoSaveRef.current = autoSave;
  const prevAutoSaveValues = useRef(deepClone(formValues));
  useEffect(() => {
    const cfg = autoSaveRef.current;
    if (!cfg || !cfg.onAutoSave || !isDirty) return;
    // Skip if values haven't actually changed
    if (deepEqual(prevAutoSaveValues.current, formValues)) return;
    prevAutoSaveValues.current = deepClone(formValues);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      autoSaveTimerRef.current = null;
      autoSaveRef.current.onAutoSave(formValues);
    }, cfg.debounce || 1000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [formValues, isDirty]);

  // -- Visible fields computation -------------------------------------------

  const allVisibleFields = useMemo(() => {
    return fields.filter((f) => {
      if (f.visible && !f.visible(formValues)) return false;
      return true;
    });
  }, [fields, formValues]);

  const visibleFields = useMemo(() => {
    let filtered = allVisibleFields;

    // In multi-step mode, further filter to current step's fields
    if (isMultiStep && steps[currentStep] && steps[currentStep].fields) {
      const stepFieldNames = new Set(steps[currentStep].fields);
      filtered = filtered.filter((f) => stepFieldNames.has(f.name));
    }

    return filtered;
  }, [allVisibleFields, isMultiStep, steps, currentStep]);

  useEffect(() => {
    const nameSet = new Set(fields.map((f) => f.name));
    if (nameSet.size !== fields.length) {
      warnConfig("Duplicate field names detected. Field names must be unique.");
    }

    for (const field of fields) {
      const parentName = getDependsOnName(field);
      if (parentName && !nameSet.has(parentName)) {
        warnConfig(`Field "${field.name}" depends on missing field "${parentName}".`);
      }
    }

    if (steps) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (!step.fields) continue;
        for (const fieldName of step.fields) {
          if (!nameSet.has(fieldName)) {
            warnConfig(`Step ${i + 1} references missing field "${fieldName}".`);
          }
        }
      }
    }

    if (layout) {
      for (const row of layout) {
        for (const entry of row) {
          const fieldName = typeof entry === "string" ? entry : entry.field;
          if (!nameSet.has(fieldName)) {
            warnConfig(`Layout references missing field "${fieldName}".`);
          }
        }
      }
    }

    if (sections) {
      for (const section of sections) {
        for (const fieldName of section.fields || []) {
          if (!nameSet.has(fieldName)) {
            warnConfig(`Section "${section.id}" references missing field "${fieldName}".`);
          }
        }
      }
    }
  }, [fields, steps, layout, sections, warnConfig]);

  // -- Validation engine ----------------------------------------------------

  const validateRepeaterField = useCallback(
    (field, value, allValues) => {
      const errors = {};
      const rows = Array.isArray(value) ? value : [];
      const subFields = field.fields || [];
      let firstSubError = null;

      if (resolveRequired(field, allValues) && rows.length === 0) {
        const requiredError = `${field.label} is required`;
        errors[field.name] = requiredError;
        return { errors, hasErrors: true };
      }

      if (typeof field.min === "number" && rows.length < field.min) {
        errors[field.name] = `Must have at least ${field.min} ${field.min === 1 ? "row" : "rows"}`;
      } else if (typeof field.max === "number" && rows.length > field.max) {
        errors[field.name] = `Must have no more than ${field.max} ${field.max === 1 ? "row" : "rows"}`;
      }

      rows.forEach((row, rowIdx) => {
        const rowValues = { ...allValues, [field.name]: rows };
        subFields.forEach((subField) => {
          if (subField.visible && !subField.visible(rowValues)) return;
          const err = runValidators(row?.[subField.name], subField, rowValues, fieldTypes, { messages: validationMessages });
          if (!err) return;
          const key = getRepeaterErrorKey(field.name, rowIdx, subField.name);
          errors[key] = err;
          if (!firstSubError) firstSubError = { row: rowIdx + 1, message: err };
        });
      });

      if (!errors[field.name] && firstSubError) {
        errors[field.name] = `Row ${firstSubError.row}: ${firstSubError.message}`;
      }

      return { errors, hasErrors: Object.keys(errors).length > 0 };
    },
    [fieldTypes]
  );

  const validateField = useCallback(
    (name, value) => {
      const field = fieldByName.get(name);
      if (!field) return null;
      if (field.visible && !field.visible(formValues)) return null;

      if (field.type === "repeater") {
        const repeaterResult = validateRepeaterField(
          field,
          value != null ? value : formValues[name],
          formValues
        );
        return repeaterResult.errors[name] || null;
      }

      return runValidators(value != null ? value : formValues[name], field, formValues, fieldTypes, { messages: validationMessages });
    },
    [fieldByName, formValues, validateRepeaterField, fieldTypes, validationMessages]
  );

  const validateVisibleFields = useCallback(
    (fieldSubset) => {
      const toValidate = fieldSubset || visibleFields;
      const errors = {};
      let hasErrors = false;

      for (const field of toValidate) {
        if (field.type === "repeater") {
          const repeaterResult = validateRepeaterField(field, formValues[field.name], formValues);
          if (repeaterResult.hasErrors) {
            Object.assign(errors, repeaterResult.errors);
            hasErrors = true;
          }
          continue;
        }

        const err = runValidators(formValues[field.name], field, formValues, fieldTypes, { messages: validationMessages });
        if (err) {
          errors[field.name] = err;
          hasErrors = true;
        }
      }

      return { errors, hasErrors };
    },
    [visibleFields, formValues, validateRepeaterField, fieldTypes, validationMessages]
  );

  // -- Async validation engine ------------------------------------------------

  const runAsyncValidation = useCallback(
    (name, value) => {
      const field = fieldByName.get(name);
      if (!field || field.type === "repeater") return null;

      const val = value != null ? value : formValues[name];
      const syncError = runValidators(val, field, formValues, fieldTypes, { includeCustomValidators: false, messages: validationMessages });

      const prevController = asyncAbortRef.current.get(name);
      if (prevController) prevController.abort();
      asyncAbortRef.current.delete(name);

      setValidatingFields((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });

      if (syncError) return null;

      const version = (asyncValidationVersionRef.current.get(name) || 0) + 1;
      asyncValidationVersionRef.current.set(name, version);
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      if (controller) asyncAbortRef.current.set(name, controller);

      let asyncPromises;
      try {
        asyncPromises = collectAsyncValidatorPromises(
          val,
          field,
          formValues,
          controller ? { signal: controller.signal } : undefined
        );
      } catch (err) {
        updateErrors({ [name]: err?.message || "Validation failed" });
        return null;
      }

      if (asyncPromises.length === 0) {
        asyncAbortRef.current.delete(name);
        return null;
      }

      const validationPromise = Promise.all(asyncPromises).then(
        (results) => {
          if (asyncValidationVersionRef.current.get(name) !== version) return;
          asyncValidationRef.current.delete(name);
          asyncAbortRef.current.delete(name);
          setValidatingFields((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
          let err = null;
          for (const result of results) {
            const normalized = normalizeValidatorResult(result);
            if (normalized) {
              err = normalized;
              break;
            }
          }
          updateErrors({ [name]: err });
        },
        (rejection) => {
          if (asyncValidationVersionRef.current.get(name) !== version) return;
          asyncValidationRef.current.delete(name);
          asyncAbortRef.current.delete(name);
          setValidatingFields((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
          if (rejection && rejection.name === "AbortError") return;
          updateErrors({ [name]: rejection?.message || "Validation failed" });
        }
      );

      asyncValidationRef.current.set(name, validationPromise);
      setValidatingFields((prev) => ({ ...prev, [name]: true }));
      return validationPromise;
    },
    [fieldByName, formValues, fieldTypes, updateErrors]
  );

  const triggerAsyncValidation = useCallback(
    (name, value) => {
      const field = fieldByName.get(name);
      if (!field || field.type === "repeater") return;

      const debounceMs = field.validateDebounce;
      if (debounceMs && debounceMs > 0) {
        const existing = debounceTimersRef.current.get(name);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(() => {
          debounceTimersRef.current.delete(name);
          runAsyncValidation(name, value);
        }, debounceMs);
        debounceTimersRef.current.set(name, timer);
      } else {
        runAsyncValidation(name, value);
      }
    },
    [fieldByName, runAsyncValidation]
  );

  // -- Event handlers -------------------------------------------------------

  const commitValues = useCallback(
    (nextValues) => {
      formValuesRef.current = nextValues;
      if (values != null) {
        if (onChange) onChange(nextValues);
      } else {
        setInternalValues(nextValues);
      }
    },
    [values, onChange]
  );

  const setFieldValueSilent = useCallback(
    (name, value) => {
      const base = draftValuesRef.current || formValuesRef.current || {};
      const nextValues = { ...base, [name]: value };
      draftValuesRef.current = nextValues;
      commitValues(nextValues);
    },
    [commitValues]
  );

  const handleFieldChange = useCallback(
    (name, value) => {
      const newValues = { ...formValuesRef.current, [name]: value };
      const queue = [name];
      const visited = new Set();
      const clearedErrors = {};

      while (queue.length > 0) {
        const current = queue.shift();
        if (!current || visited.has(current)) continue;
        visited.add(current);

        fields.forEach((dep) => {
          const parentName = getDependsOnName(dep);
          if (parentName !== current || dep.name === current) return;
          if (!dep.options) return;

          const depOptions = resolveOptions(dep, newValues);
          const depValue = newValues[dep.name];
          if (depValue == null || depValue === "") return;
          const validValues = new Set(depOptions.map((o) => o.value));

          let nextDepValue = depValue;
          let changed = false;
          if (Array.isArray(depValue)) {
            const filtered = depValue.filter((v) => validValues.has(v));
            if (filtered.length !== depValue.length) {
              nextDepValue = filtered;
              changed = true;
            }
          } else if (!validValues.has(depValue)) {
            nextDepValue = getFieldEmptyValue(dep);
            changed = true;
          }

          if (changed) {
            newValues[dep.name] = nextDepValue;
            queue.push(dep.name);
            if (formErrorsRef.current[dep.name] != null) {
              clearedErrors[dep.name] = null;
            }
          }
        });
      }

      if (formErrorsRef.current[name] != null) {
        clearedErrors[name] = null;
      }
      for (const key of Object.keys(formErrorsRef.current)) {
        if (key.startsWith(`${name}[`)) {
          clearedErrors[key] = null;
        }
      }

      draftValuesRef.current = newValues;
      commitValues(newValues);

      if (onFieldChange) onFieldChange(name, value, newValues);
      if (Object.keys(clearedErrors).length > 0) updateErrors(clearedErrors);

      const field = fieldByName.get(name);
      if (field && field.onFieldChange) {
        field.onFieldChange(value, newValues, {
          setFieldValue: setFieldValueSilent,
          setFieldError: (fieldName, message) => updateErrors({ [fieldName]: message }),
        });
      }

      draftValuesRef.current = null;
    },
    [fields, getFieldEmptyValue, commitValues, onFieldChange, updateErrors, fieldByName, setFieldValueSilent]
  );

  // Debounced field change — delays onFieldChange/onChange for fields with `debounce` prop
  const handleDebouncedFieldChange = useCallback(
    (name, value) => {
      const field = fieldByName.get(name);
      const debounceMs = field && field.debounce;

      if (debounceMs && debounceMs > 0) {
        const existing = inputDebounceRef.current.get(name);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(() => {
          inputDebounceRef.current.delete(name);
          handleFieldChange(name, value);
        }, debounceMs);
        inputDebounceRef.current.set(name, timer);
      } else {
        handleFieldChange(name, value);
      }
    },
    [fieldByName, handleFieldChange]
  );

  const handleFieldInput = useCallback(
    (name, value) => {
      handleFieldChange(name, value);
      if (!validateOnChange) return;
      const err = validateField(name, value);
      updateErrors({ [name]: err });
    },
    [validateOnChange, validateField, updateErrors, handleFieldChange]
  );

  const handleFieldBlur = useCallback(
    (name, value) => {
      const resolvedValue = value != null ? value : formValuesRef.current[name];
      // Sync value to form state if browser autofill populated the field without
      // triggering onChange/onInput (e.g. browser autocomplete on non-first fields).
      if (value != null && value !== formValuesRef.current[name]) {
        handleFieldChange(name, value);
      }
      if (!validateOnBlur) return;
      const err = validateField(name, resolvedValue);
      updateErrors({ [name]: err });
      if (!err) {
        triggerAsyncValidation(name, resolvedValue);
      }
    },
    [validateOnBlur, validateField, updateErrors, triggerAsyncValidation, handleFieldChange]
  );

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      // Validate all visible fields (sync)
      if (validateOnSubmit) {
        const { errors, hasErrors } = validateVisibleFields(allVisibleFields);
        if (hasErrors) {
          replaceErrors(errors);
          return;
        }

        // Run async validators for visible fields, then wait for all pending validations.
        const asyncSubmitValidations = allVisibleFields
          .map((field) => runAsyncValidation(field.name, formValues[field.name]))
          .filter(Boolean);

        if (asyncSubmitValidations.length > 0 || asyncValidationRef.current.size > 0) {
          const pendingValidations = [
            ...new Set([
              ...asyncSubmitValidations,
              ...Array.from(asyncValidationRef.current.values()),
            ]),
          ];
          await Promise.all(pendingValidations);
          if (fieldSetHasErrors(formErrorsRef.current, allVisibleFields)) return;
        }
      }

      const reset = () => {
        const fresh = computeInitialValues();
        if (values == null) setInternalValues(fresh);
        replaceErrors({});
        initialSnapshot.current = deepClone(fresh);
        prevAutoSaveValues.current = deepClone(fresh);
      };

      // Exclude display fields from submitted values and apply per-field transformOut
      const rawValues = {};
      for (const key of Object.keys(formValues)) {
        const f = fieldByName.get(key);
        if (f && (f.type === "display" || f.type === "crmPropertyList" || f.type === "crmAssociationPropertyList" || f.type === "fieldGroup")) continue;
        rawValues[key] = f && f.transformOut ? f.transformOut(formValues[key]) : formValues[key];
      }
      // Also apply transformOut for fieldGroup sub-fields
      for (const f of fields) {
        if (f.type !== "fieldGroup" || !f.items || !f.fields) continue;
        for (const item of f.items) {
          for (const sf of f.fields(item)) {
            if (formValues[sf.name] === undefined) continue;
            rawValues[sf.name] = sf.transformOut ? sf.transformOut(formValues[sf.name]) : formValues[sf.name];
          }
        }
      }

      // Transform values if transformer provided
      const submitValues = transformValues ? transformValues(rawValues) : rawValues;

      // Confirmation gate
      if (onBeforeSubmit) {
        const proceed = await onBeforeSubmit(submitValues);
        if (proceed === false) return;
      }

      if (controlledLoading == null) setInternalLoading(true);
      try {
        const result = await onSubmit(submitValues, { reset, rawValues });

        // Post-submit success
        if (resetOnSuccess) reset();
        if (onSubmitSuccess) onSubmitSuccess(result, { reset, values: submitValues });
      } catch (err) {
        if (onSubmitError) {
          onSubmitError(err, { values: submitValues });
        } else {
          throw err; // re-throw if no error handler
        }
      } finally {
        if (controlledLoading == null) setInternalLoading(false);
      }
    },
    [validateOnSubmit, allVisibleFields, validateVisibleFields, replaceErrors, onSubmit, values, controlledLoading, transformValues, onBeforeSubmit, onSubmitSuccess, onSubmitError, resetOnSuccess, formValues, fieldByName, runAsyncValidation]
  );

  // Multi-step navigation
  const handleNext = useCallback(async () => {
    if (!isMultiStep) return;

    if (validateStepOnNext && steps[currentStep] && steps[currentStep].fields) {
      const stepFieldNames = new Set(steps[currentStep].fields);
      const stepFields = allVisibleFields.filter((f) => stepFieldNames.has(f.name));
      const { errors, hasErrors } = validateVisibleFields(stepFields);
      if (hasErrors) {
        replaceErrors({ ...formErrorsRef.current, ...errors });
        return;
      }

      const asyncStepValidations = stepFields
        .map((field) => runAsyncValidation(field.name, formValues[field.name]))
        .filter(Boolean);

      if (asyncStepValidations.length > 0 || asyncValidationRef.current.size > 0) {
        const pendingValidations = [
          ...new Set([
            ...asyncStepValidations,
            ...Array.from(asyncValidationRef.current.values()),
          ]),
        ];
        await Promise.all(pendingValidations);
        if (fieldSetHasErrors(formErrorsRef.current, stepFields)) return;
      }
    }

    // Also run step-level validate if provided
    if (steps[currentStep] && steps[currentStep].validate) {
      const result = steps[currentStep].validate(formValues);
      if (result !== true && result) {
        replaceErrors({ ...formErrorsRef.current, ...result });
        return;
      }
    }

    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    if (controlledStep != null) {
      if (onStepChange) onStepChange(nextStep);
    } else {
      setInternalStep(nextStep);
    }
  }, [isMultiStep, validateStepOnNext, steps, currentStep, formValues, validateVisibleFields, controlledStep, onStepChange, replaceErrors, allVisibleFields, runAsyncValidation]);

  const handleBack = useCallback(() => {
    if (!isMultiStep) return;
    const prevStep = Math.max(currentStep - 1, 0);
    if (controlledStep != null) {
      if (onStepChange) onStepChange(prevStep);
    } else {
      setInternalStep(prevStep);
    }
  }, [isMultiStep, currentStep, controlledStep, onStepChange]);

  const handleGoTo = useCallback(
    (stepIndex) => {
      if (!isMultiStep) return;
      const clamped = Math.max(0, Math.min(stepIndex, steps.length - 1));
      if (controlledStep != null) {
        if (onStepChange) onStepChange(clamped);
      } else {
        setInternalStep(clamped);
      }
    },
    [isMultiStep, steps, controlledStep, onStepChange]
  );

  // -- Ref API --------------------------------------------------------------

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    validate: () => {
      const { errors, hasErrors } = validateVisibleFields(allVisibleFields);
      replaceErrors(errors);
      return { valid: !hasErrors, errors };
    },
    reset: () => {
      const fresh = computeInitialValues();
      if (values == null) setInternalValues(fresh);
      replaceErrors({});
      initialSnapshot.current = deepClone(fresh);
      prevAutoSaveValues.current = deepClone(fresh);
    },
    getValues: () => formValues,
    isDirty: () => isDirty,
    setFieldValue: (name, value) => handleFieldChange(name, value),
    setFieldError: (name, message) => updateErrors({ [name]: message }),
    setErrors: (errors) => {
      replaceErrors(errors);
    },
  }));

  // -- Field rendering ------------------------------------------------------

  const setRepeaterSubFieldError = useCallback(
    (fieldName, rowIdx, subFieldName, errorMessage) => {
      const key = getRepeaterErrorKey(fieldName, rowIdx, subFieldName);
      const merged = { ...formErrorsRef.current };
      if (errorMessage) {
        merged[key] = errorMessage;
      } else {
        delete merged[key];
      }

      const subErrors = Object.keys(merged)
        .filter((k) => k.startsWith(`${fieldName}[`))
        .map((k) => {
          const match = k.match(/\[(\d+)\]\./);
          const row = match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
          return { key: k, row };
        })
        .sort((a, b) => a.row - b.row);

      if (subErrors.length > 0) {
        const first = subErrors[0];
        merged[fieldName] = `Row ${first.row + 1}: ${merged[first.key]}`;
      } else if (!merged[fieldName] || merged[fieldName].startsWith("Row ")) {
        delete merged[fieldName];
      }

      replaceErrors(merged);
    },
    [replaceErrors]
  );

  const renderField = (field) => {
    const fieldError = formErrors[field.name] || null;
    const rendered = renderFieldInner(field);
    if (!renderFieldError || !fieldError) return rendered;
    return (
      <>
        {rendered}
        {renderFieldError(fieldError, field)}
      </>
    );
  };

  const renderFieldInner = (field) => {
    const fieldValue = formValues[field.name];
    const fieldError = formErrors[field.name] || null;
    const hasError = !!fieldError;
    const isRequired = showRequiredIndicator && resolveRequired(field, formValues);
    const isReadOnly = field.readOnly || formReadOnly;
    const isDisabled = disabled || field.disabled || formReadOnly;

    // Route onChange through debounce if field has debounce prop
    const fieldOnChange = field.debounce
      ? (v) => handleDebouncedFieldChange(field.name, v)
      : (v) => handleFieldChange(field.name, v);

    // Display fields — render-only, no form value
    if (field.type === "display") {
      if (field.render) {
        return field.render({
          values: formValues,
          allValues: formValues, // deprecated — use `values`
          setFieldValue: (name, value) => handleFieldChange(name, value),
          setFieldError: (name, message) => updateErrors({ [name]: message }),
        });
      }
      return null;
    }

    // fieldGroup — fixed structured groups (e.g. weekly schedules)
    if (field.type === "fieldGroup") {
      const items = field.items || [];
      const fieldsFn = field.fields;
      if (!fieldsFn) return null;
      const groupColumns = field.columns || 1;
      const showItemLabel = field.showItemLabel !== false;

      return (
        <Flex direction="column" gap="xs">
          {field.label && (
            <Text format={{ fontWeight: "demibold" }}>
              {field.label}
            </Text>
          )}
          {field.description && (
            <Text variant="microcopy">{field.description}</Text>
          )}
          {items.map((item, itemIdx) => {
            const subFields = fieldsFn(item);
            return (
              <Flex key={item.key || itemIdx} direction="row" gap="xs" align="end">
                {showItemLabel && item.label && (
                  <Box flex={1}>
                    {itemIdx === 0 ? (
                      <Input
                        name={`_fieldGroup-label-${field.name}-${itemIdx}`}
                        label="&nbsp;"
                        value={item.label}
                        readOnly={true}
                        disabled={true}
                      />
                    ) : (
                      <Input
                        name={`_fieldGroup-label-${field.name}-${itemIdx}`}
                        value={item.label}
                        readOnly={true}
                        disabled={true}
                      />
                    )}
                  </Box>
                )}
                {subFields.map((sf) => {
                  const sfValue = formValues[sf.name];
                  const sfError = formErrors[sf.name] || null;
                  const sfLabel = itemIdx === 0 ? sf.label : undefined;
                  const sfReadOnly = sf.readOnly || formReadOnly;
                  const sfDisabled = disabled || sf.disabled || formReadOnly;
                  const sfOnChange = sf.debounce
                    ? (v) => handleDebouncedFieldChange(sf.name, v)
                    : (v) => handleFieldChange(sf.name, v);
                  const sfProps = {
                    name: sf.name,
                    label: sfLabel,
                    placeholder: sf.placeholder,
                    description: itemIdx === 0 ? sf.description : undefined,
                    readOnly: sfReadOnly,
                    disabled: sfDisabled,
                    error: !!sfError,
                    validationMessage: sfError || undefined,
                    ...(sf.fieldProps || {}),
                  };

                  let sfElement;
                  switch (sf.type) {
                    case "select":
                      sfElement = (
                        <Select
                          {...sfProps}
                          value={sfValue}
                          options={resolveOptions(sf, formValues)}
                          onChange={sfOnChange}
                        />
                      );
                      break;
                    case "number":
                      sfElement = (
                        <NumberInput
                          {...sfProps}
                          value={sfValue}
                          onChange={sfOnChange}
                          onBlur={(v) => handleFieldBlur(sf.name, v)}
                        />
                      );
                      break;
                    case "toggle":
                      sfElement = (
                        <Toggle
                          name={sf.name}
                          label={sfLabel || sf.label}
                          checked={!!sfValue}
                          size={sf.size || "md"}
                          labelDisplay={sf.labelDisplay || "top"}
                          readonly={sfReadOnly}
                          disabled={sfDisabled}
                          onChange={sfOnChange}
                          {...(sf.fieldProps || {})}
                        />
                      );
                      break;
                    case "time":
                      sfElement = (
                        <TimeInput
                          {...sfProps}
                          value={sfValue}
                          interval={sf.interval}
                          onChange={sfOnChange}
                          onBlur={(v) => handleFieldBlur(sf.name, v)}
                        />
                      );
                      break;
                    default:
                      sfElement = (
                        <Input
                          {...sfProps}
                          value={sfValue || ""}
                          onChange={sfOnChange}
                          onInput={(v) => handleFieldInput(sf.name, v)}
                          onBlur={(v) => handleFieldBlur(sf.name, v)}
                        />
                      );
                  }

                  return <Box key={sf.name} flex={1}>{sfElement}</Box>;
                })}
              </Flex>
            );
          })}
        </Flex>
      );
    }

    // CRM data components — hands-off, HubSpot handles editing and saving
    if (field.type === "crmPropertyList") {
      return (
        <CrmPropertyList
          properties={field.properties}
          direction={field.direction}
          {...(field.objectId ? { objectId: field.objectId } : {})}
          {...(field.objectTypeId ? { objectTypeId: field.objectTypeId } : {})}
          {...(field.fieldProps || {})}
        />
      );
    }

    if (field.type === "crmAssociationPropertyList") {
      return (
        <CrmAssociationPropertyList
          objectTypeId={field.objectTypeId}
          properties={field.properties}
          {...(field.associationLabels ? { associationLabels: field.associationLabels } : {})}
          {...(field.filters ? { filters: field.filters } : {})}
          {...(field.sort ? { sort: field.sort } : {})}
          {...(field.fieldProps || {})}
        />
      );
    }

    // Custom render escape hatch
    if (field.render) {
      return field.render({
        value: fieldValue,
        onChange: fieldOnChange,
        error: hasError,
        values: formValues,
        allValues: formValues, // deprecated — use `values`
      });
    }

    // Custom field type plugin
    const plugin = fieldTypes && fieldTypes[field.type];
    if (plugin && plugin.render) {
      return plugin.render({
        value: fieldValue,
        onChange: fieldOnChange,
        error: hasError,
        field,
        values: formValues,
        allValues: formValues, // deprecated — use `values`
      });
    }

    // Common props shared by most input components
    const commonProps = {
      name: field.name,
      label: field.label,
      description: field.description,
      placeholder: field.placeholder,
      tooltip: field.tooltip,
      required: isRequired,
      readOnly: isReadOnly,
      disabled: isDisabled,
      error: hasError,
      validationMessage: renderFieldError ? undefined : (fieldError || undefined),
      ...(field.loading || validatingFields[field.name] ? { loading: true } : {}),
      ...(field.fieldProps || {}),
    };

    const options = resolveOptions(field, formValues);

    switch (field.type) {
      case "text":
      case "password":
        return (
          <Input
            {...commonProps}
            type={field.type === "password" ? "password" : "text"}
            value={fieldValue || ""}
            onChange={fieldOnChange}
            onInput={(v) => handleFieldInput(field.name, v)}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );

      case "textarea":
        return (
          <TextArea
            {...commonProps}
            value={fieldValue || ""}
            rows={field.rows}
            cols={field.cols}
            resize={field.resize}
            maxLength={field.maxLength}
            onChange={fieldOnChange}
            onInput={(v) => handleFieldInput(field.name, v)}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );

      case "number":
        return (
          <NumberInput
            {...commonProps}
            value={fieldValue}
            min={field.min}
            max={field.max}
            precision={field.precision}
            formatStyle={field.formatStyle}
            onChange={fieldOnChange}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );

      case "stepper":
        return (
          <StepperInput
            {...commonProps}
            value={fieldValue}
            min={field.min}
            max={field.max}
            precision={field.precision}
            formatStyle={field.formatStyle}
            stepSize={field.stepSize}
            minValueReachedTooltip={field.minValueReachedTooltip}
            maxValueReachedTooltip={field.maxValueReachedTooltip}
            onChange={fieldOnChange}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );

      case "currency":
        return (
          <CurrencyInput
            {...commonProps}
            currency={field.currency || defaultCurrency}
            value={fieldValue}
            min={field.min}
            max={field.max}
            precision={field.precision}
            onChange={fieldOnChange}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );

      case "date":
        return (
          <DateInput
            {...commonProps}
            value={fieldValue}
            format={field.format}
            min={field.min}
            max={field.max}
            timezone={field.timezone}
            clearButtonLabel={field.clearButtonLabel}
            todayButtonLabel={field.todayButtonLabel}
            minValidationMessage={field.minValidationMessage}
            maxValidationMessage={field.maxValidationMessage}
            onChange={fieldOnChange}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );

      case "time":
        return (
          <TimeInput
            {...commonProps}
            value={fieldValue}
            interval={field.interval}
            min={field.min}
            max={field.max}
            timezone={field.timezone}
            onChange={fieldOnChange}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );

      case "datetime": {
        const dateVal = fieldValue ? fieldValue.date || fieldValue : undefined;
        const timeVal = fieldValue ? fieldValue.time || undefined : undefined;
        return (
          <Flex direction="row" gap="sm">
            <Box flex={1}>
              <DateInput
                {...commonProps}
                name={`${field.name}-date`}
                label={field.label}
                format={field.format}
                value={dateVal}
                min={field.min}
                max={field.max}
                timezone={field.timezone}
                clearButtonLabel={field.clearButtonLabel}
                todayButtonLabel={field.todayButtonLabel}
                minValidationMessage={field.minValidationMessage}
                maxValidationMessage={field.maxValidationMessage}
                onChange={(v) => {
                  handleFieldChange(field.name, { ...fieldValue, date: v, time: timeVal });
                }}
                onBlur={(v) => {
                  handleFieldBlur(field.name, { ...fieldValue, date: v, time: timeVal });
                }}
              />
            </Box>
            <Box flex={1}>
              <TimeInput
                name={`${field.name}-time`}
                label="Time"
                description={field.description}
                tooltip={field.tooltip}
                readOnly={isReadOnly}
                disabled={isDisabled}
                error={hasError}
                value={timeVal}
                interval={field.interval}
                timezone={field.timezone}
                onChange={(v) => {
                  handleFieldChange(field.name, { ...fieldValue, date: dateVal, time: v });
                }}
                onBlur={(v) => {
                  handleFieldBlur(field.name, { ...fieldValue, date: dateVal, time: v });
                }}
              />
            </Box>
          </Flex>
        );
      }

      case "select":
        return (
          <Select
            {...commonProps}
            value={fieldValue}
            options={options}
            variant={field.variant}
            onChange={fieldOnChange}
          />
        );

      case "multiselect":
        return (
          <MultiSelect
            {...commonProps}
            value={fieldValue || []}
            options={options}
            onChange={fieldOnChange}
          />
        );

      case "toggle":
        return (
          <Toggle
            name={field.name}
            label={field.label}
            checked={!!fieldValue}
            size={field.size || "md"}
            labelDisplay={field.labelDisplay || "top"}
            textChecked={field.textChecked}
            textUnchecked={field.textUnchecked}
            readonly={isReadOnly}
            disabled={isDisabled}
            onChange={fieldOnChange}
            {...(field.fieldProps || {})}
          />
        );

      case "checkbox":
        return (
          <Checkbox
            name={field.name}
            checked={!!fieldValue}
            description={field.description}
            readOnly={isReadOnly}
            disabled={isDisabled}
            inline={field.inline}
            variant={field.variant}
            onChange={fieldOnChange}
            {...(field.fieldProps || {})}
          >
            {field.label}
          </Checkbox>
        );

      case "checkboxGroup":
        return (
          <ToggleGroup
            {...commonProps}
            toggleType="checkboxList"
            value={fieldValue || []}
            options={options}
            inline={field.inline}
            variant={field.variant}
            onChange={fieldOnChange}
          />
        );

      case "radioGroup":
        return (
          <ToggleGroup
            {...commonProps}
            toggleType="radioButtonList"
            value={fieldValue}
            options={options}
            inline={field.inline}
            variant={field.variant}
            onChange={fieldOnChange}
          />
        );

      case "repeater": {
        const rows = Array.isArray(fieldValue) ? fieldValue : [];
        const subFields = field.fields || [];
        const minRows = typeof field.min === "number" ? field.min : 0;
        const maxRows = typeof field.max === "number" ? field.max : Infinity;
        const repeaterProps = field.repeaterProps || {};
        const renderAddControl = repeaterProps.renderAdd;
        const renderRemoveControl = repeaterProps.renderRemove;
        const renderMoveUpControl = repeaterProps.renderMoveUp;
        const renderMoveDownControl = repeaterProps.renderMoveDown;
        const addLabel = repeaterProps.addLabel || repeaterAddLabel;
        const removeLabel = repeaterProps.removeLabel || repeaterRemoveLabel;
        const moveUpLabel = repeaterProps.moveUpLabel || "Up";
        const moveDownLabel = repeaterProps.moveDownLabel || "Down";
        const canEditRows = !isReadOnly && !isDisabled;
        const canAdd = rows.length < maxRows && canEditRows;
        const canRemove = rows.length > minRows && canEditRows;
        const canReorder = !!repeaterProps.reorderable && canEditRows;
        const repeaterHasNestedErrors = Object.keys(formErrors).some((k) =>
          k.startsWith(`${field.name}[`)
        );
        const firstNestedErrorKey = Object.keys(formErrors).find((k) =>
          k.startsWith(`${field.name}[`)
        );
        const repeaterErrorMessage = fieldError || (firstNestedErrorKey ? formErrors[firstNestedErrorKey] : null);
        const repeaterHasError = !!fieldError || repeaterHasNestedErrors;

        const addRow = () => {
          const emptyRow = {};
          for (const sf of subFields) {
            emptyRow[sf.name] = sf.defaultValue !== undefined ? sf.defaultValue : getFieldEmptyValue(sf);
          }
          handleFieldChange(field.name, [...rows, emptyRow]);
        };

        const removeRow = (idx) => {
          handleFieldChange(field.name, rows.filter((_, i) => i !== idx));
        };

        const moveRow = (fromIndex, toIndex) => {
          if (toIndex < 0 || toIndex >= rows.length || toIndex === fromIndex) return;
          const updated = [...rows];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          handleFieldChange(field.name, updated);
        };

        const validateSubField = (rowIdx, subField, subValue, nextRows) => {
          const rowValues = { ...formValues, [field.name]: nextRows };
          const err = runValidators(subValue, subField, rowValues, fieldTypes, { messages: validationMessages });
          setRepeaterSubFieldError(field.name, rowIdx, subField.name, err);
        };

        const handleSubFieldChange = (rowIdx, subField, subValue) => {
          const updated = rows.map((row, i) =>
            i === rowIdx ? { ...row, [subField.name]: subValue } : row
          );
          handleFieldChange(field.name, updated);
          if (validateOnChange) {
            validateSubField(rowIdx, subField, subValue, updated);
          }
        };

        const handleSubFieldBlur = (rowIdx, subField, subValue) => {
          if (!validateOnBlur) return;
          const nextRows = rows.map((row, i) =>
            i === rowIdx ? { ...row, [subField.name]: subValue } : row
          );
          validateSubField(rowIdx, subField, subValue, nextRows);
        };

        return (
          <Flex direction="column" gap="xs">
            {field.label && (
              <Text format={{ fontWeight: "demibold" }}>
                {field.label}{isRequired ? " *" : ""}
              </Text>
            )}
            {field.description && (
              <Text variant="microcopy">{field.description}</Text>
            )}
            {rows.map((row, rowIdx) => (
              <Flex key={getRowKey(field.name, row, rowIdx)} direction="row" gap="xs" align="end">
                {subFields.map((sf) => {
                  const sfValue = row[sf.name];
                  const sfLabel = rowIdx === 0 ? sf.label : undefined;
                  const sfOptions = resolveOptions(sf, { ...formValues, [field.name]: rows });
                  const sfError = formErrors[getRepeaterErrorKey(field.name, rowIdx, sf.name)] || null;
                  const sfProps = {
                    name: `${field.name}-${rowIdx}-${sf.name}`,
                    label: sfLabel,
                    placeholder: sf.placeholder,
                    readOnly: sf.readOnly || isReadOnly,
                    disabled: sf.disabled || isDisabled,
                    error: !!sfError,
                    validationMessage: sfError || undefined,
                    ...(sf.fieldProps || {}),
                  };

                  let sfElement;
                  switch (sf.type) {
                    case "select":
                      sfElement = (
                        <Select
                          {...sfProps}
                          value={sfValue}
                          options={sfOptions}
                          onChange={(v) => handleSubFieldChange(rowIdx, sf, v)}
                          onBlur={(v) => handleSubFieldBlur(rowIdx, sf, v)}
                        />
                      );
                      break;
                    case "number":
                      sfElement = (
                        <NumberInput
                          {...sfProps}
                          value={sfValue}
                          onChange={(v) => handleSubFieldChange(rowIdx, sf, v)}
                          onBlur={(v) => handleSubFieldBlur(rowIdx, sf, v)}
                        />
                      );
                      break;
                    case "checkbox":
                      sfElement = (
                        <Checkbox
                          {...sfProps}
                          checked={!!sfValue}
                          onChange={(v) => handleSubFieldChange(rowIdx, sf, v)}
                          onBlur={(v) => handleSubFieldBlur(rowIdx, sf, v)}
                        >
                          {sf.label}
                        </Checkbox>
                      );
                      break;
                    default:
                      sfElement = (
                        <Input
                          {...sfProps}
                          value={sfValue || ""}
                          onChange={(v) => handleSubFieldChange(rowIdx, sf, v)}
                          onBlur={(v) => handleSubFieldBlur(rowIdx, sf, v)}
                        />
                      );
                  }

                  return <Box key={sf.name} flex={1}>{sfElement}</Box>;
                })}
                <Inline gap="xs">
                  {canReorder && rowIdx > 0 && (
                    renderMoveUpControl
                      ? renderMoveUpControl({ index: rowIdx, onClick: () => moveRow(rowIdx, rowIdx - 1) })
                      : <Button variant="secondary" size="sm" onClick={() => moveRow(rowIdx, rowIdx - 1)}>
                        {moveUpLabel}
                      </Button>
                  )}
                  {canReorder && rowIdx < rows.length - 1 && (
                    renderMoveDownControl
                      ? renderMoveDownControl({ index: rowIdx, onClick: () => moveRow(rowIdx, rowIdx + 1) })
                      : <Button variant="secondary" size="sm" onClick={() => moveRow(rowIdx, rowIdx + 1)}>
                        {moveDownLabel}
                      </Button>
                  )}
                  {canRemove && (
                    renderRemoveControl
                      ? renderRemoveControl({ index: rowIdx, onClick: () => removeRow(rowIdx) })
                      : <Button
                        variant="secondary"
                        size="md"
                        onClick={() => removeRow(rowIdx)}
                      >
                        {removeLabel}
                      </Button>
                  )}
                </Inline>
              </Flex>
            ))}
            {canAdd && (
              renderAddControl
                ? renderAddControl({ onClick: addRow, count: rows.length })
                : <Link onClick={addRow}>
                  <Flex direction="row" align="center" gap="flush">
                    <Icon name="add" />
                    <Text format={{ fontWeight: "demibold" }}>{addLabel}</Text>
                  </Flex>
                </Link>
            )}
            {repeaterHasError && repeaterErrorMessage && (
              <Text variant="microcopy">{repeaterErrorMessage}</Text>
            )}
          </Flex>
        );
      }

      default:
        return (
          <Input
            {...commonProps}
            value={fieldValue || ""}
            onChange={fieldOnChange}
            onInput={(v) => handleFieldInput(field.name, v)}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );
    }
  };

  // -- Layout rendering -------------------------------------------------------

  // Helper: effective column span for a field
  const getFieldColSpan = (field) => {
    if (field.colSpan != null) return Math.min(field.colSpan, columns);
    if (field.width === "full" && columns > 1) return columns;
    return 1;
  };

  // Helper: find visible dependents for a parent field (only grouped, not inline)
  const getDependents = (parentField) =>
    visibleFields.filter(
      (f) =>
        getDependsOnName(f) === parentField.name &&
        f.name !== parentField.name &&
        getDependsOnDisplay(f) === "grouped"
    );

  // Helper: check if a field is a grouped dependent of another visible field
  const isDependent = (field) =>
    getDependsOnName(field) &&
    getDependsOnDisplay(field) === "grouped" &&
    visibleFields.some((f) => f.name === getDependsOnName(field) && f.name !== field.name);

  // Helper: render dependent properties Tile group
  const renderDependentGroup = (parentField, dependents) => {
    const firstWithLabel = dependents.find((f) => getDependsOnLabel(f)) || dependents[0];
    const firstWithMessage = dependents.find((f) => getDependsOnMessage(f)) || dependents[0];
    const groupLabel = getDependsOnLabel(firstWithLabel) || dependentPropertiesLabel;
    const rawMessage = getDependsOnMessage(firstWithMessage);
    const tooltipMessage = typeof rawMessage === "function"
      ? rawMessage(parentField.label)
      : rawMessage || "";

    return (
      <Tile key={`dep-${parentField.name}`} compact={true}>
        <Flex direction="column" gap={gap}>
          <Flex direction="row" align="center" gap="xs">
            <Text format={{ fontWeight: "demibold" }}>
              {groupLabel}{" "}
              {tooltipMessage && (
                <Link inline={true} variant="dark" overlay={<Tooltip>{tooltipMessage}</Tooltip>}>
                  <Icon name="info" />
                </Link>
              )}
            </Text>
          </Flex>
          {renderFieldSubset(dependents)}
        </Flex>
      </Tile>
    );
  };

  // Grid layout: chunk fields into rows based on columns and colSpan.
  // Uses AutoGrid per row so columns collapse responsively on narrow viewports.
  const renderGridLayout = (fieldSubset) => {
    const fieldList = fieldSubset || visibleFields;
    const elements = [];
    let currentRow = [];
    let currentRowSpan = 0;
    // Minimum column width (px) before AutoGrid collapses to fewer columns.
    // 200px is a sensible floor — fields stay readable, and a 2-column form
    // collapses to 1 column at ~400px container width (typical card/sidebar).
    const gridColumnWidth = 200;

    const flushRow = () => {
      if (currentRow.length === 0) return;
      const allUniform = currentRow.every((f) => getFieldColSpan(f) === 1);
      const totalSpan = currentRow.reduce((s, f) => s + getFieldColSpan(f), 0);
      const remainder = columns - totalSpan;

      if (allUniform) {
        // Uniform colSpan — use AutoGrid for responsive collapse
        elements.push(
          <AutoGrid key={`row-${currentRow[0].name}`} columnWidth={gridColumnWidth} flexible gap={gap}>
            {currentRow.map((f) => (
              <React.Fragment key={f.name}>{renderField(f)}</React.Fragment>
            ))}
            {remainder > 0 && Array.from({ length: remainder }, (_, i) => (
              <Box key={`spacer-${i}`} />
            ))}
          </AutoGrid>
        );
      } else {
        // Mixed colSpan — keep Flex+Box for weighted layout
        elements.push(
          <Flex key={`row-${currentRow[0].name}`} direction="row" gap={gap}>
            {currentRow.map((f) => (
              <Box key={f.name} flex={getFieldColSpan(f)}>
                {renderField(f)}
              </Box>
            ))}
            {remainder > 0 && <Box flex={remainder} />}
          </Flex>
        );
      }
      currentRow = [];
      currentRowSpan = 0;
    };

    for (const field of fieldList) {
      if (isDependent(field)) continue;

      const span = getFieldColSpan(field);

      if (span >= columns) {
        flushRow();
        elements.push(
          <React.Fragment key={field.name}>{renderField(field)}</React.Fragment>
        );
      } else {
        if (currentRowSpan + span > columns) flushRow();
        currentRow.push(field);
        currentRowSpan += span;
        if (currentRowSpan >= columns) flushRow();
      }

      // Dependent group renders full-width after parent's row
      const dependents = getDependents(field);
      if (dependents.length > 0) {
        flushRow();
        elements.push(renderDependentGroup(field, dependents));
      }
    }

    flushRow();
    return elements;
  };

  // Explicit layout: user-defined rows
  const renderExplicitLayout = () => {
    const elements = [];
    const renderedNames = new Set();

    for (let rowIdx = 0; rowIdx < layout.length; rowIdx++) {
      const row = layout[rowIdx];
      const rowFields = [];

      for (const entry of row) {
        const fieldName = typeof entry === "string" ? entry : entry.field;
        const flexValue = typeof entry === "string" ? 1 : (entry.flex || 1);
        const field = visibleFields.find((f) => f.name === fieldName);
        if (!field) continue;
        rowFields.push({ field, flex: flexValue });
        renderedNames.add(fieldName);
      }

      if (rowFields.length === 0) continue;

      if (rowFields.length === 1) {
        elements.push(
          <React.Fragment key={rowFields[0].field.name}>
            {renderField(rowFields[0].field)}
          </React.Fragment>
        );
      } else {
        elements.push(
          <Flex key={`layout-row-${rowIdx}`} direction="row" gap={gap}>
            {rowFields.map(({ field, flex }) => (
              <Box key={field.name} flex={flex}>
                {renderField(field)}
              </Box>
            ))}
          </Flex>
        );
      }

      // Dependent groups for fields in this row
      for (const { field } of rowFields) {
        const dependents = getDependents(field).filter((d) => !renderedNames.has(d.name));
        if (dependents.length > 0) {
          elements.push(renderDependentGroup(field, dependents));
          for (const dep of dependents) renderedNames.add(dep.name);
        }
      }
    }

    // Append any visible fields not placed in layout (full-width)
    for (const field of visibleFields) {
      if (renderedNames.has(field.name)) continue;
      if (isDependent(field)) continue;
      elements.push(
        <React.Fragment key={field.name}>{renderField(field)}</React.Fragment>
      );
      renderedNames.add(field.name);

      const dependents = getDependents(field).filter((d) => !renderedNames.has(d.name));
      if (dependents.length > 0) {
        elements.push(renderDependentGroup(field, dependents));
        for (const dep of dependents) renderedNames.add(dep.name);
      }
    }

    return elements;
  };

  // Single-column layout: render each field full-width (columns=1 default)
  const renderSingleColumnLayout = (fieldSubset) => {
    const fieldList = fieldSubset || visibleFields;
    const elements = [];
    const processedDeps = new Set();

    for (const field of fieldList) {
      if (processedDeps.has(field.name)) continue;

      elements.push(
        <React.Fragment key={field.name}>{renderField(field)}</React.Fragment>
      );

      const dependents = getDependents(field);
      if (dependents.length > 0) {
        for (const dep of dependents) processedDeps.add(dep.name);
        elements.push(renderDependentGroup(field, dependents));
      }
    }

    return elements;
  };

  // AutoGrid layout: responsive columns based on columnWidth
  const renderAutoGridLayout = (fieldSubset) => {
    const fieldList = fieldSubset || visibleFields;
    const elements = [];
    let batch = [];

    const flushBatch = () => {
      if (batch.length === 0) return;
      if (maxColumns) {
        // Cap columns using Flex rows so fields align across rows
        const chunks = Array.from(
          { length: Math.ceil(batch.length / maxColumns) },
          (_, i) => batch.slice(i * maxColumns, i * maxColumns + maxColumns)
        );
        for (const chunk of chunks) {
          const remainder = maxColumns - chunk.length;
          elements.push(
            <Flex key={`ag-${chunk[0].name}`} direction="row" gap={gap}>
              {chunk.map((f) => (
                <Box key={f.name} flex={1}>
                  {renderField(f)}
                </Box>
              ))}
              {remainder > 0 && <Box flex={remainder} />}
            </Flex>
          );
        }
      } else {
        elements.push(
          <AutoGrid key={`ag-${batch[0].name}`} columnWidth={columnWidth} flexible gap={gap}>
            {batch.map((f) => (
              <React.Fragment key={f.name}>{renderField(f)}</React.Fragment>
            ))}
          </AutoGrid>
        );
      }
      batch = [];
    };

    for (const field of fieldList) {
      if (isDependent(field)) continue;

      batch.push(field);

      // Dependent group breaks out of AutoGrid as full-width
      const dependents = getDependents(field);
      if (dependents.length > 0) {
        flushBatch();
        elements.push(renderDependentGroup(field, dependents));
      }
    }

    flushBatch();
    return elements;
  };

  // -- Field group dividers --------------------------------------------------

  // Wraps rendered field elements with Divider + optional group label between groups.
  // Groups are determined by the `group` prop on fields.
  const wrapWithGroups = (fieldList, renderFn) => {
    // Check if any field has a group prop
    const hasGroups = fieldList.some((f) => f.group);
    if (!hasGroups) return renderFn(fieldList);

    // Split fields into consecutive group chunks
    const chunks = [];
    let currentGroup = undefined;
    let currentChunk = [];

    for (const field of fieldList) {
      const fieldGroup = field.group || undefined;
      if (fieldGroup !== currentGroup && currentChunk.length > 0) {
        chunks.push({ group: currentGroup, fields: [...currentChunk] });
        currentChunk = [];
      }
      currentGroup = fieldGroup;
      currentChunk.push(field);
    }
    if (currentChunk.length > 0) {
      chunks.push({ group: currentGroup, fields: currentChunk });
    }

    // Render each chunk through the layout renderer with dividers between
    const elements = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      if (i > 0) {
        elements.push(<Divider key={`group-div-${i}`} />);
      }

      if (chunk.group) {
        elements.push(
          <Text key={`group-label-${i}`} format={{ fontWeight: "demibold" }}>
            {chunk.group}
          </Text>
        );
      }

      // Render the chunk's fields using the layout renderer
      const chunkElements = renderFn(chunk.fields);
      if (Array.isArray(chunkElements)) {
        elements.push(...chunkElements);
      } else {
        elements.push(chunkElements);
      }
    }

    return elements;
  };

  // Render a subset of fields through the active layout mode
  const renderFieldSubset = (fieldSubset) => {
    // Explicit layout doesn't support subsetting — only use for full field list
    if (layout && fieldSubset === visibleFields) return renderExplicitLayout();
    if (columnWidth) return renderAutoGridLayout(fieldSubset);
    if (columns > 1) return renderGridLayout(fieldSubset);
    return renderSingleColumnLayout(fieldSubset);
  };

  // -- Sections rendering (Accordion grouping) --------------------------------

  const renderSections = () => {
    const hasSections = Array.isArray(sections) && sections.length > 0;
    if (!hasSections) return null;

    const sectionFieldNames = new Set();
    for (const sec of sections) {
      if (sec.fields) for (const name of sec.fields) sectionFieldNames.add(name);
    }

    const elements = [];

    for (const sec of sections) {
      const sectionFields = sec.fields
        ? visibleFields.filter((f) => sec.fields.includes(f.name))
        : [];

      if (sectionFields.length === 0) continue;

      const sectionContext = { values: formValues, errors: formErrors };

      const accordionContent = (
        <Flex direction="column" gap={gap}>
          {sec.renderBefore && sec.renderBefore(sectionContext)}
          {renderFieldSubset(sectionFields)}
          {sec.renderAfter && sec.renderAfter(sectionContext)}
        </Flex>
      );

      const accordion = (
        <Accordion
          key={sec.id}
          title={sec.label}
          size="sm"
          defaultOpen={sec.defaultOpen !== false}
        >
          {accordionContent}
        </Accordion>
      );

      // If section has info tooltip, wrap with icon
      if (sec.info) {
        elements.push(
          <Flex key={sec.id} direction="row" align="start" justify="start" gap="flush">
            <Box flex={1}>{accordion}</Box>
            <Link variant="dark" overlay={<Tooltip>{sec.info}</Tooltip>}>
              <Icon name="info" size="sm" screenReaderText={sec.info} />
            </Link>
          </Flex>
        );
      } else {
        elements.push(accordion);
      }
    }

    // Fields not in any section render after all sections
    const unsectionedFields = visibleFields.filter(
      (f) => !sectionFieldNames.has(f.name)
    );
    if (unsectionedFields.length > 0) {
      elements.push(...renderFieldSubset(unsectionedFields));
    }

    return elements;
  };

  // Dispatch to the right layout mode
  const renderFieldLayout = () => {
    // If sections are defined, use section-based rendering
    const hasSections = Array.isArray(sections) && sections.length > 0;
    if (hasSections) return renderSections();

    // Check for field group dividers
    const hasGroups = visibleFields.some((f) => f.group);
    if (hasGroups && !layout) {
      return wrapWithGroups(visibleFields, renderFieldSubset);
    }

    // Direct rendering (no sections, no groups)
    if (layout) return renderExplicitLayout();
    return renderFieldSubset(visibleFields);
  };

  // -- Buttons rendering ----------------------------------------------------

  const renderButtons = () => {
    if (submitPosition === "none" || formReadOnly) return null;

    const isLastStep = !isMultiStep || currentStep === steps.length - 1;
    const isFirstStep = !isMultiStep || currentStep === 0;
    const buttonContext = {
      isMultiStep,
      isFirstStep,
      isLastStep,
      currentStep,
      totalSteps: isMultiStep ? steps.length : 1,
      disabled,
      loading: isLoading,
      labels: {
        submit: submitButtonLabel,
        cancel: cancelButtonLabel,
        back: backButtonLabel,
        next: nextButtonLabel,
      },
      onBack: handleBack,
      onNext: handleNext,
      onCancel,
      onSubmit: handleSubmit,
    };

    if (renderButtonsProp) {
      return renderButtonsProp(buttonContext);
    }

    if (isMultiStep) {
      return (
        <Flex direction="row" justify="between" align="center">
          {!isFirstStep ? (
            <Button variant="secondary" onClick={handleBack} disabled={disabled}>
              {backButtonLabel}
            </Button>
          ) : (
            showCancel ? (
              <Button variant="secondary" onClick={onCancel} disabled={disabled}>
                {cancelButtonLabel}
              </Button>
            ) : (
              <Text>{" "}</Text>
            )
          )}
          <Inline gap="small">
            <Text variant="microcopy">
              Step {currentStep + 1} of {steps.length}
            </Text>
            {isLastStep ? (
              <LoadingButton
                variant={submitVariant}
                loading={isLoading}
                onClick={handleSubmit}
                disabled={disabled}
              >
                {submitButtonLabel}
              </LoadingButton>
            ) : (
              <Button variant="primary" onClick={handleNext} disabled={disabled}>
                {nextButtonLabel}
              </Button>
            )}
          </Inline>
        </Flex>
      );
    }

    // Single-step form buttons
    return (
      <Flex direction="row" justify={showCancel ? "between" : "start"} gap="sm">
        {showCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={disabled}>
            {cancelButtonLabel}
          </Button>
        )}
        <LoadingButton
          variant={submitVariant}
          type={noFormWrapper ? "button" : "submit"}
          loading={isLoading}
          onClick={noFormWrapper ? handleSubmit : undefined}
          disabled={disabled}
        >
          {submitButtonLabel}
        </LoadingButton>
      </Flex>
    );
  };

  // -- Main render ----------------------------------------------------------

  const formContent = (
    <Flex direction="column" gap={gap}>
      {/* Step indicator */}
      {isMultiStep && showStepIndicator && (
        <StepIndicator
          currentStep={currentStep}
          stepNames={steps.map((s) => s.title)}
        />
      )}

      {/* Read-only warning */}
      {showReadOnlyAlert && formReadOnly && readOnlyMessage && (
        renderReadOnlyAlert
          ? renderReadOnlyAlert({ title: readOnlyTitle, message: readOnlyMessage })
          : <Alert title={readOnlyTitle} variant="warning">
              {readOnlyMessage}
            </Alert>
      )}

      {/* Form-level alerts (inline only when addAlert is not provided) */}
      {showInlineAlerts && !addAlert && formError && (
        <Alert title={errorTitle} variant="danger">
          {typeof formError === "string" ? formError : undefined}
        </Alert>
      )}
      {showInlineAlerts && !addAlert && formSuccess && (
        <Alert title={successTitle} variant="success">
          {formSuccess}
        </Alert>
      )}

      {/* Custom step render */}
      {isMultiStep && steps[currentStep] && steps[currentStep].render ? (
        steps[currentStep].render({
          values: formValues,
          goNext: handleNext,
          goBack: handleBack,
          goTo: handleGoTo,
        })
      ) : (
        /* Field layout */
        renderFieldLayout()
      )}

      {/* Buttons */}
      {renderButtons()}
    </Flex>
  );

  if (noFormWrapper) {
    return formContent;
  }

  return (
    <Form
      {...(formProps || {})}
      onSubmit={handleSubmit}
      autoComplete={autoComplete}
    >
      {formContent}
    </Form>
  );
});
