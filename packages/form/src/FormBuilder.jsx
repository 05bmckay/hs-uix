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

const runValidators = (value, field, allValues, fieldTypes) => {
  // Display and CRM data fields have no validation
  if (field.type === "display" || field.type === "crmPropertyList" || field.type === "crmAssociationPropertyList") return null;

  // 1. Required (supports function form for conditional required)
  const isRequired = resolveRequired(field, allValues);
  // Check custom type isEmpty if available
  const plugin = fieldTypes && fieldTypes[field.type];
  const empty = plugin && plugin.isEmpty
    ? plugin.isEmpty(value)
    : isValueEmpty(value, field);
  if (isRequired && empty) {
    return `${field.label} is required`;
  }

  // Skip further validation if empty and not required
  if (empty) return null;

  // 2. Pattern (text/textarea/password only)
  if (field.pattern && typeof value === "string") {
    if (!field.pattern.test(value)) {
      return field.patternMessage || "Invalid format";
    }
  }

  // 3. Min/Max length (text/textarea)
  if (typeof value === "string") {
    if (field.minLength != null && value.length < field.minLength) {
      return `Must be at least ${field.minLength} characters`;
    }
    if (field.maxLength != null && value.length > field.maxLength) {
      return `Must be no more than ${field.maxLength} characters`;
    }
  }

  // 4. Min/Max value (number/stepper/currency)
  if (typeof value === "number") {
    if (field.min != null && value < field.min) {
      return `Must be at least ${field.min}`;
    }
    if (field.max != null && value > field.max) {
      return `Must be no more than ${field.max}`;
    }
  }

  // 5. Custom validate (sync only — async handled separately)
  if (field.validate) {
    const result = field.validate(value, allValues);
    // If result is a Promise, skip it here (async validation handles it)
    if (result && typeof result.then === "function") return null;
    if (result !== true && result) return result;
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

// ---------------------------------------------------------------------------
// CRM Integration utilities
// ---------------------------------------------------------------------------

/**
 * Maps CRM property values to form initial values.
 * `properties` is the flat { propertyName: value } object from useCrmProperties.
 * `mapping` is { formFieldName: "crmPropertyName" }.
 *
 * Usage:
 *   const { properties } = useCrmProperties(["firstname", "lastname"]);
 *   const initialValues = useFormPrefill(properties, {
 *     firstName: "firstname",
 *     lastName: "lastname",
 *   });
 */
export const useFormPrefill = (properties, mapping) => {
  return useMemo(() => {
    if (!properties || !mapping) return {};
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
    submitLabel = "Submit",        // submit button text
    submitVariant = "primary",     // submit button variant
    showCancel = false,            // show cancel button
    cancelLabel = "Cancel",        // cancel button text
    onCancel,                      // () => void
    submitPosition = "bottom",     // "bottom" | "none"
    loading: controlledLoading,    // controlled loading state
    disabled = false,              // disable entire form
  } = props;

  // Appearance / layout
  const {
    columns = 1,                   // number of grid columns (1 = full-width stack)
    columnWidth,                   // AutoGrid columnWidth — responsive layout (overrides columns)
    layout,                        // explicit row layout array (overrides columns + columnWidth)
    sections,                      // FormBuilderSection[] — accordion field grouping
    gap = "sm",                    // gap between fields
    showRequiredIndicator = true,  // show * on required fields
    noFormWrapper = false,         // skip HubSpot <Form> wrapper
    fieldTypes,                    // Record<string, FieldTypePlugin> — custom field type registry
  } = props;

  // States
  const {
    error: formError,   // string | boolean — form-level error alert
    success: formSuccess, // string — form-level success alert
    readOnly: formReadOnly = false, // boolean — lock all fields
    readOnlyMessage,    // string — warning alert when readOnly
  } = props;

  // Events
  const {
    onDirtyChange,  // (isDirty: boolean) => void
    autoSave,       // { debounce: number, onAutoSave: (values) => void }
  } = props;

  // -- Internal state -------------------------------------------------------

  const computeInitialValues = () => {
    const vals = {};
    for (const field of fields) {
      if (field.type === "display" || field.type === "crmPropertyList" || field.type === "crmAssociationPropertyList") continue;
      // Check custom field type for getEmptyValue
      const plugin = fieldTypes && fieldTypes[field.type];
      const emptyValue = plugin && plugin.getEmptyValue
        ? plugin.getEmptyValue()
        : getEmptyValue(field);
      const init = initialValues && initialValues[field.name] !== undefined
        ? initialValues[field.name]
        : field.defaultValue !== undefined
          ? field.defaultValue
          : emptyValue;
      vals[field.name] = init;
    }
    return vals;
  };

  const [internalValues, setInternalValues] = useState(computeInitialValues);
  const [internalErrors, setInternalErrors] = useState({});    // { fieldName: "message" }
  const [internalStep, setInternalStep] = useState(0);
  const [internalLoading, setInternalLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});      // { fieldName: true }
  const [validatingFields, setValidatingFields] = useState({}); // { fieldName: true } — async validation in-flight

  // Track pending async validations (Map<fieldName, Promise>)
  const asyncValidationRef = useRef(new Map());
  // Track debounce timers (Map<fieldName, timeoutId>)
  const debounceTimersRef = useRef(new Map());

  // Track initial snapshot for dirty detection
  const initialSnapshot = useRef(null);
  if (initialSnapshot.current === null) {
    initialSnapshot.current = JSON.stringify(computeInitialValues());
  }

  // -- State resolution (controlled vs uncontrolled) ------------------------

  const formValues = values != null ? values : internalValues;
  const currentStep = controlledStep != null ? controlledStep : internalStep;
  const isLoading = controlledLoading != null ? controlledLoading : internalLoading;
  const isMultiStep = Array.isArray(steps) && steps.length > 0;

  // Clean up debounce timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of debounceTimersRef.current.values()) clearTimeout(timer);
    };
  }, []);

  // -- Dirty tracking -------------------------------------------------------

  const isDirty = useMemo(() => {
    return JSON.stringify(formValues) !== initialSnapshot.current;
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
  useEffect(() => {
    if (!autoSave || !autoSave.onAutoSave || !isDirty) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      autoSaveTimerRef.current = null;
      autoSave.onAutoSave(formValues);
    }, autoSave.debounce || 1000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [formValues, isDirty, autoSave]);

  // -- Visible fields computation -------------------------------------------

  const visibleFields = useMemo(() => {
    let filtered = fields.filter((f) => {
      if (f.visible && !f.visible(formValues)) return false;
      return true;
    });

    // In multi-step mode, further filter to current step's fields
    if (isMultiStep && steps[currentStep] && steps[currentStep].fields) {
      const stepFieldNames = new Set(steps[currentStep].fields);
      filtered = filtered.filter((f) => stepFieldNames.has(f.name));
    }

    return filtered;
  }, [fields, formValues, isMultiStep, steps, currentStep]);

  // -- Validation engine ----------------------------------------------------

  const validateField = useCallback(
    (name, value) => {
      const field = fields.find((f) => f.name === name);
      if (!field) return null;
      // Only validate visible fields
      if (field.visible && !field.visible(formValues)) return null;
      return runValidators(value != null ? value : formValues[name], field, formValues, fieldTypes);
    },
    [fields, formValues, fieldTypes]
  );

  const validateVisibleFields = useCallback(
    (fieldSubset) => {
      const toValidate = fieldSubset || visibleFields;
      const errors = {};
      let hasErrors = false;
      for (const field of toValidate) {
        const err = runValidators(formValues[field.name], field, formValues, fieldTypes);
        if (err) {
          errors[field.name] = err;
          hasErrors = true;
        }
      }
      return { errors, hasErrors };
    },
    [visibleFields, formValues]
  );

  const updateErrors = useCallback(
    (newErrors) => {
      setInternalErrors((prev) => {
        const merged = { ...prev, ...newErrors };
        // Clear errors for fields that are now valid
        for (const key of Object.keys(merged)) {
          if (newErrors[key] === null || newErrors[key] === undefined) {
            delete merged[key];
          }
        }
        if (onValidationChange) onValidationChange(merged);
        return merged;
      });
    },
    [onValidationChange]
  );

  // -- Async validation engine ------------------------------------------------

  // Run async validation for a field (after sync validators pass)
  const runAsyncValidation = useCallback(
    (name, value) => {
      const field = fields.find((f) => f.name === name);
      if (!field || !field.validate) return;

      const val = value != null ? value : formValues[name];

      // Run sync validators first — if they fail, skip async
      const syncError = runValidators(val, field, formValues, fieldTypes);
      if (syncError) return;

      // Check if validate returns a Promise
      const result = field.validate(val, formValues);
      if (!result || typeof result.then !== "function") return; // sync result, already handled

      // Track the async validation
      const validationPromise = result.then(
        (asyncResult) => {
          // Only apply if this is still the latest validation for this field
          if (asyncValidationRef.current.get(name) !== validationPromise) return;
          asyncValidationRef.current.delete(name);
          setValidatingFields((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
          const err = asyncResult !== true && asyncResult ? asyncResult : null;
          updateErrors({ [name]: err });
        },
        (rejection) => {
          if (asyncValidationRef.current.get(name) !== validationPromise) return;
          asyncValidationRef.current.delete(name);
          setValidatingFields((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
          updateErrors({ [name]: rejection?.message || "Validation failed" });
        }
      );

      asyncValidationRef.current.set(name, validationPromise);
      setValidatingFields((prev) => ({ ...prev, [name]: true }));
    },
    [fields, formValues, updateErrors]
  );

  // Trigger async validation, with optional debounce
  const triggerAsyncValidation = useCallback(
    (name, value) => {
      const field = fields.find((f) => f.name === name);
      if (!field || !field.validate) return;

      const debounceMs = field.validateDebounce;
      if (debounceMs && debounceMs > 0) {
        // Clear existing debounce timer
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
    [fields, runAsyncValidation]
  );

  // -- Event handlers -------------------------------------------------------

  // Helper: set a field value without triggering validation (used by field-level side effects)
  const setFieldValueSilent = useCallback(
    (name, value) => {
      if (values != null) {
        if (onChange) onChange({ ...formValues, [name]: value });
      } else {
        setInternalValues((prev) => ({ ...prev, [name]: value }));
      }
    },
    [values, onChange, formValues]
  );

  const handleFieldChange = useCallback(
    (name, value) => {
      const newValues = { ...formValues, [name]: value };

      if (values != null) {
        // Controlled mode — notify parent
        if (onChange) onChange(newValues);
      } else {
        // Uncontrolled mode — update internal state
        setInternalValues(newValues);
      }

      if (onFieldChange) onFieldChange(name, value, newValues);

      // Clear error on change if field was touched
      if (internalErrors[name]) {
        updateErrors({ [name]: null });
      }

      // Field-level side effects (cross-field updates)
      const field = fields.find((f) => f.name === name);
      if (field && field.onFieldChange) {
        field.onFieldChange(value, newValues, {
          setFieldValue: setFieldValueSilent,
          setFieldError: (fieldName, message) => updateErrors({ [fieldName]: message }),
        });
      }
    },
    [formValues, values, onChange, onFieldChange, internalErrors, updateErrors, fields, setFieldValueSilent]
  );

  // Debounced field change — delays onFieldChange/onChange for fields with `debounce` prop
  const inputDebounceRef = useRef(new Map());
  const handleDebouncedFieldChange = useCallback(
    (name, value) => {
      const field = fields.find((f) => f.name === name);
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
    [fields, handleFieldChange]
  );

  const handleFieldInput = useCallback(
    (name, value) => {
      if (validateOnChange) {
        const err = validateField(name, value);
        updateErrors({ [name]: err });
      }
    },
    [validateOnChange, validateField, updateErrors]
  );

  const handleFieldBlur = useCallback(
    (name, value) => {
      setTouchedFields((prev) => ({ ...prev, [name]: true }));
      if (validateOnBlur) {
        const err = validateField(name, value != null ? value : formValues[name]);
        updateErrors({ [name]: err });

        // Trigger async validation if sync passed
        if (!err) {
          triggerAsyncValidation(name, value != null ? value : formValues[name]);
        }
      }
    },
    [validateOnBlur, validateField, updateErrors, formValues, triggerAsyncValidation]
  );

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      // Validate all visible fields (sync)
      if (validateOnSubmit) {
        // In multi-step mode at submit, validate ALL fields (not just current step)
        const allVisible = fields.filter((f) => !f.visible || f.visible(formValues));
        const { errors, hasErrors } = validateVisibleFields(allVisible);
        if (hasErrors) {
          setInternalErrors(errors);
          if (onValidationChange) onValidationChange(errors);
          return;
        }

        // Wait for any pending async validations
        if (asyncValidationRef.current.size > 0) {
          await Promise.all(asyncValidationRef.current.values());
          // Re-check errors after async validations complete
          const currentErrors = { ...internalErrors };
          const hasAsyncErrors = Object.keys(currentErrors).length > 0;
          if (hasAsyncErrors) return;
        }
      }

      const reset = () => {
        const fresh = computeInitialValues();
        if (values == null) setInternalValues(fresh);
        setInternalErrors({});
        setTouchedFields({});
        initialSnapshot.current = JSON.stringify(fresh);
      };

      // Exclude display fields from submitted values
      const rawValues = {};
      for (const key of Object.keys(formValues)) {
        const f = fields.find((fd) => fd.name === key);
        if (f && (f.type === "display" || f.type === "crmPropertyList" || f.type === "crmAssociationPropertyList")) continue;
        rawValues[key] = formValues[key];
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
    [validateOnSubmit, fields, formValues, validateVisibleFields, onValidationChange, onSubmit, values, controlledLoading, internalErrors, transformValues, onBeforeSubmit, onSubmitSuccess, onSubmitError, resetOnSuccess]
  );

  // Multi-step navigation
  const handleNext = useCallback(() => {
    if (!isMultiStep) return;

    if (validateStepOnNext && steps[currentStep] && steps[currentStep].fields) {
      const stepFields = fields.filter(
        (f) => steps[currentStep].fields.includes(f.name) && (!f.visible || f.visible(formValues))
      );
      const { errors, hasErrors } = validateVisibleFields(stepFields);
      if (hasErrors) {
        setInternalErrors((prev) => ({ ...prev, ...errors }));
        if (onValidationChange) onValidationChange({ ...internalErrors, ...errors });
        return;
      }
    }

    // Also run step-level validate if provided
    if (steps[currentStep] && steps[currentStep].validate) {
      const result = steps[currentStep].validate(formValues);
      if (result !== true && result) {
        setInternalErrors((prev) => ({ ...prev, ...result }));
        return;
      }
    }

    const nextStep = Math.min(currentStep + 1, steps.length - 1);
    if (controlledStep != null) {
      if (onStepChange) onStepChange(nextStep);
    } else {
      setInternalStep(nextStep);
    }
  }, [isMultiStep, validateStepOnNext, steps, currentStep, fields, formValues, validateVisibleFields, onValidationChange, internalErrors, controlledStep, onStepChange]);

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
      const allVisible = fields.filter((f) => !f.visible || f.visible(formValues));
      const { errors, hasErrors } = validateVisibleFields(allVisible);
      setInternalErrors(errors);
      return { valid: !hasErrors, errors };
    },
    reset: () => {
      const fresh = computeInitialValues();
      if (values == null) setInternalValues(fresh);
      setInternalErrors({});
      setTouchedFields({});
      initialSnapshot.current = JSON.stringify(fresh);
    },
    getValues: () => formValues,
    isDirty: () => isDirty,
    setFieldValue: (name, value) => handleFieldChange(name, value),
    setFieldError: (name, message) => updateErrors({ [name]: message }),
    setErrors: (errors) => {
      setInternalErrors(errors);
      if (onValidationChange) onValidationChange(errors);
    },
  }));

  // -- Field rendering ------------------------------------------------------

  const renderField = (field) => {
    const fieldValue = formValues[field.name];
    const fieldError = internalErrors[field.name] || null;
    const hasError = !!fieldError;
    const isRequired = showRequiredIndicator && resolveRequired(field, formValues);
    const isReadOnly = field.readOnly || disabled || formReadOnly;

    // Route onChange through debounce if field has debounce prop
    const fieldOnChange = field.debounce
      ? (v) => handleDebouncedFieldChange(field.name, v)
      : (v) => handleFieldChange(field.name, v);

    // Display fields — render-only, no form value
    if (field.type === "display") {
      if (field.render) {
        return field.render({ allValues: formValues });
      }
      return null;
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
        allValues: formValues,
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
        allValues: formValues,
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
      error: hasError,
      validationMessage: fieldError || undefined,
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
            currency={field.currency || "USD"}
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
              />
            </Box>
            <Box flex={1}>
              <TimeInput
                name={`${field.name}-time`}
                label="Time"
                description={field.description}
                tooltip={field.tooltip}
                readOnly={isReadOnly}
                error={hasError}
                value={timeVal}
                interval={field.interval}
                timezone={field.timezone}
                onChange={(v) => {
                  handleFieldChange(field.name, { ...fieldValue, date: dateVal, time: v });
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
        const minRows = field.min || 0;
        const maxRows = field.max || Infinity;
        const canAdd = rows.length < maxRows && !isReadOnly;
        const canRemove = rows.length > minRows && !isReadOnly;

        const addRow = () => {
          const emptyRow = {};
          for (const sf of subFields) {
            emptyRow[sf.name] = sf.defaultValue !== undefined ? sf.defaultValue : getEmptyValue(sf);
          }
          handleFieldChange(field.name, [...rows, emptyRow]);
        };

        const removeRow = (idx) => {
          handleFieldChange(field.name, rows.filter((_, i) => i !== idx));
        };

        const updateRow = (idx, subName, subValue) => {
          const updated = rows.map((row, i) =>
            i === idx ? { ...row, [subName]: subValue } : row
          );
          handleFieldChange(field.name, updated);
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
              <Flex key={rowIdx} direction="row" gap="xs" align="end">
                {subFields.map((sf) => {
                  const sfValue = row[sf.name];
                  const sfLabel = rowIdx === 0 ? sf.label : undefined;
                  const sfOptions = resolveOptions(sf, formValues);
                  const sfProps = {
                    name: `${field.name}-${rowIdx}-${sf.name}`,
                    label: sfLabel,
                    placeholder: sf.placeholder,
                    readOnly: isReadOnly,
                    ...(sf.fieldProps || {}),
                  };

                  let sfElement;
                  switch (sf.type) {
                    case "select":
                      sfElement = <Select {...sfProps} value={sfValue} options={sfOptions} onChange={(v) => updateRow(rowIdx, sf.name, v)} />;
                      break;
                    case "number":
                      sfElement = <NumberInput {...sfProps} value={sfValue} onChange={(v) => updateRow(rowIdx, sf.name, v)} />;
                      break;
                    case "checkbox":
                      sfElement = <Checkbox {...sfProps} checked={!!sfValue} onChange={(v) => updateRow(rowIdx, sf.name, v)}>{sf.label}</Checkbox>;
                      break;
                    default:
                      sfElement = <Input {...sfProps} value={sfValue || ""} onChange={(v) => updateRow(rowIdx, sf.name, v)} />;
                  }

                  return <Box key={sf.name} flex={1}>{sfElement}</Box>;
                })}
                {canRemove && (
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => removeRow(rowIdx)}
                  >
                    Remove
                  </Button>
                )}
              </Flex>
            ))}
            {canAdd && (
              <Button variant="secondary" size="sm" onClick={addRow}>
                + Add
              </Button>
            )}
            {hasError && (
              <Text variant="microcopy">{fieldError}</Text>
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

  // Helper: find visible dependents for a parent field
  const getDependents = (parentField) =>
    visibleFields.filter((f) => f.dependsOn === parentField.name && f.name !== parentField.name);

  // Helper: check if a field is a dependent of another visible field
  const isDependent = (field) =>
    field.dependsOn && visibleFields.some((f) => f.name === field.dependsOn && f.name !== field.name);

  // Helper: render dependent properties Tile group
  const renderDependentGroup = (parentField, dependents) => {
    const firstWithLabel = dependents.find((f) => f.dependsOnLabel) || dependents[0];
    const firstWithMessage = dependents.find((f) => f.dependsOnMessage) || dependents[0];
    const groupLabel = firstWithLabel.dependsOnLabel || "Dependent properties";
    const rawMessage = firstWithMessage.dependsOnMessage;
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
          {dependents.map((dep) => (
            <React.Fragment key={dep.name}>{renderField(dep)}</React.Fragment>
          ))}
        </Flex>
      </Tile>
    );
  };

  // Grid layout: chunk fields into rows based on columns and colSpan
  const renderGridLayout = (fieldSubset) => {
    const fieldList = fieldSubset || visibleFields;
    const elements = [];
    let currentRow = [];
    let currentRowSpan = 0;

    const flushRow = () => {
      if (currentRow.length === 0) return;
      const totalSpan = currentRow.reduce((s, f) => s + getFieldColSpan(f), 0);
      const remainder = columns - totalSpan;
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

  // Legacy layout: pair consecutive half-width fields (columns=1 default)
  const renderLegacyLayout = (fieldSubset) => {
    const fieldList = fieldSubset || visibleFields;
    const rows = [];
    let i = 0;

    while (i < fieldList.length) {
      const field = fieldList[i];
      if (
        field.width === "half" &&
        i + 1 < fieldList.length &&
        fieldList[i + 1].width === "half" &&
        !field.dependsOn
      ) {
        rows.push({ type: "pair", fields: [fieldList[i], fieldList[i + 1]] });
        i += 2;
      } else {
        rows.push({ type: "single", field });
        i++;
      }
    }

    const elements = [];
    const processedDeps = new Set();

    for (const row of rows) {
      if (row.type === "pair") {
        elements.push(
          <Flex key={`pair-${row.fields[0].name}`} direction="row" gap="sm">
            <Box flex={1}>{renderField(row.fields[0])}</Box>
            <Box flex={1}>{renderField(row.fields[1])}</Box>
          </Flex>
        );
      } else {
        const field = row.field;
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
      elements.push(
        <AutoGrid key={`ag-${batch[0].name}`} columnWidth={columnWidth} flexible gap={gap}>
          {batch.map((f) => (
            <React.Fragment key={f.name}>{renderField(f)}</React.Fragment>
          ))}
        </AutoGrid>
      );
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
    return renderLegacyLayout(fieldSubset);
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

      const accordionContent = (
        <Flex direction="column" gap={gap}>
          {renderFieldSubset(sectionFields)}
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
          <Flex key={sec.id} direction="row" align="start" gap="flush">
            <Box flex={1}>{accordion}</Box>
            <Link overlay={<Tooltip>{sec.info}</Tooltip>}>
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

    if (isMultiStep) {
      return (
        <Flex direction="row" justify="between" align="center">
          {!isFirstStep ? (
            <Button variant="secondary" onClick={handleBack} disabled={disabled}>
              Back
            </Button>
          ) : (
            showCancel ? (
              <Button variant="secondary" onClick={onCancel} disabled={disabled}>
                {cancelLabel}
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
                {submitLabel}
              </LoadingButton>
            ) : (
              <Button variant="primary" onClick={handleNext} disabled={disabled}>
                Next
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
            {cancelLabel}
          </Button>
        )}
        <LoadingButton
          variant={submitVariant}
          type={noFormWrapper ? "button" : "submit"}
          loading={isLoading}
          onClick={noFormWrapper ? handleSubmit : undefined}
          disabled={disabled}
        >
          {submitLabel}
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
      {formReadOnly && readOnlyMessage && (
        <Alert title="Read Only" variant="warning">
          {readOnlyMessage}
        </Alert>
      )}

      {/* Form-level alerts */}
      {formError && (
        <Alert title="Error" variant="danger">
          {typeof formError === "string" ? formError : undefined}
        </Alert>
      )}
      {formSuccess && (
        <Alert title="Success" variant="success">
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
    <Form onSubmit={handleSubmit} autoComplete={props.autoComplete}>
      {formContent}
    </Form>
  );
});
