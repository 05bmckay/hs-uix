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
  Form,
  Flex,
  Box,
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

const runValidators = (value, field, allValues) => {
  // 1. Required
  if (field.required && isValueEmpty(value, field)) {
    return `${field.label} is required`;
  }

  // Skip further validation if empty and not required
  if (isValueEmpty(value, field)) return null;

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

  // 5. Custom validate
  if (field.validate) {
    const result = field.validate(value, allValues);
    if (result !== true && result) return result;
  }

  return null;
};

const resolveOptions = (field, allValues) => {
  if (typeof field.options === "function") return field.options(allValues);
  return field.options || [];
};

// ---------------------------------------------------------------------------
// FormBuilder component
// ---------------------------------------------------------------------------

export const FormBuilder = forwardRef(function FormBuilder(props, ref) {
  // -- Props destructuring --------------------------------------------------

  // Core
  const {
    fields,       // FormBuilderField[] — field definitions
    onSubmit,     // (values, { reset }) => void | Promise
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

  // Appearance
  const {
    gap = "sm",                    // gap between fields
    showRequiredIndicator = true,  // show * on required fields
    noFormWrapper = false,         // skip HubSpot <Form> wrapper
  } = props;

  // States
  const {
    error: formError,   // string | boolean — form-level error alert
    success: formSuccess, // string — form-level success alert
  } = props;

  // Events
  const {
    onDirtyChange,  // (isDirty: boolean) => void
  } = props;

  // -- Internal state -------------------------------------------------------

  const computeInitialValues = () => {
    const vals = {};
    for (const field of fields) {
      const init = initialValues && initialValues[field.name] !== undefined
        ? initialValues[field.name]
        : field.defaultValue !== undefined
          ? field.defaultValue
          : getEmptyValue(field);
      vals[field.name] = init;
    }
    return vals;
  };

  const [internalValues, setInternalValues] = useState(computeInitialValues);
  const [internalErrors, setInternalErrors] = useState({});    // { fieldName: "message" }
  const [internalStep, setInternalStep] = useState(0);
  const [internalLoading, setInternalLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});      // { fieldName: true }

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
      return runValidators(value != null ? value : formValues[name], field, formValues);
    },
    [fields, formValues]
  );

  const validateVisibleFields = useCallback(
    (fieldSubset) => {
      const toValidate = fieldSubset || visibleFields;
      const errors = {};
      let hasErrors = false;
      for (const field of toValidate) {
        const err = runValidators(formValues[field.name], field, formValues);
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

  // -- Event handlers -------------------------------------------------------

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
    },
    [formValues, values, onChange, onFieldChange, internalErrors, updateErrors]
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
      }
    },
    [validateOnBlur, validateField, updateErrors, formValues]
  );

  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      // Validate all visible fields
      if (validateOnSubmit) {
        // In multi-step mode at submit, validate ALL fields (not just current step)
        const allVisible = fields.filter((f) => !f.visible || f.visible(formValues));
        const { errors, hasErrors } = validateVisibleFields(allVisible);
        if (hasErrors) {
          setInternalErrors(errors);
          if (onValidationChange) onValidationChange(errors);
          return;
        }
      }

      const reset = () => {
        const fresh = computeInitialValues();
        if (values == null) setInternalValues(fresh);
        setInternalErrors({});
        setTouchedFields({});
        initialSnapshot.current = JSON.stringify(fresh);
      };

      if (controlledLoading == null) setInternalLoading(true);
      try {
        await onSubmit(formValues, { reset });
      } finally {
        if (controlledLoading == null) setInternalLoading(false);
      }
    },
    [validateOnSubmit, fields, formValues, validateVisibleFields, onValidationChange, onSubmit, values, controlledLoading]
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
  }));

  // -- Field rendering ------------------------------------------------------

  const renderField = (field) => {
    const fieldValue = formValues[field.name];
    const fieldError = internalErrors[field.name] || null;
    const hasError = !!fieldError;
    const isRequired = showRequiredIndicator && field.required;
    const isReadOnly = field.readOnly || disabled;

    // Custom render escape hatch
    if (field.render) {
      return field.render({
        value: fieldValue,
        onChange: (v) => handleFieldChange(field.name, v),
        error: hasError,
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
            onChange={(v) => handleFieldChange(field.name, v)}
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
            resize={field.resize}
            maxLength={field.maxLength}
            onChange={(v) => handleFieldChange(field.name, v)}
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
            onChange={(v) => handleFieldChange(field.name, v)}
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
            onChange={(v) => handleFieldChange(field.name, v)}
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
            onChange={(v) => handleFieldChange(field.name, v)}
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
            onChange={(v) => handleFieldChange(field.name, v)}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );

      case "time":
        return (
          <TimeInput
            {...commonProps}
            value={fieldValue}
            onChange={(v) => handleFieldChange(field.name, v)}
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
                onChange={(v) => {
                  handleFieldChange(field.name, { ...fieldValue, date: v, time: timeVal });
                }}
              />
            </Box>
            <Box flex={1}>
              <TimeInput
                name={`${field.name}-time`}
                label="Time"
                value={timeVal}
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
            onChange={(v) => handleFieldChange(field.name, v)}
          />
        );

      case "multiselect":
        return (
          <MultiSelect
            {...commonProps}
            value={fieldValue || []}
            options={options}
            onChange={(v) => handleFieldChange(field.name, v)}
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
            readonly={isReadOnly}
            onChange={(v) => handleFieldChange(field.name, v)}
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
            onChange={(checked) => handleFieldChange(field.name, checked)}
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
            inline={field.fieldProps?.inline}
            variant={field.fieldProps?.variant}
            onChange={(v) => handleFieldChange(field.name, v)}
          />
        );

      case "radioGroup":
        return (
          <ToggleGroup
            {...commonProps}
            toggleType="radioButtonList"
            value={fieldValue}
            options={options}
            inline={field.fieldProps?.inline}
            variant={field.fieldProps?.variant}
            onChange={(v) => handleFieldChange(field.name, v)}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            value={fieldValue || ""}
            onChange={(v) => handleFieldChange(field.name, v)}
            onInput={(v) => handleFieldInput(field.name, v)}
            onBlur={(v) => handleFieldBlur(field.name, v)}
          />
        );
    }
  };

  // -- Dependent properties grouping ----------------------------------------

  const renderFieldsWithGroups = (fieldList) => {
    const rendered = [];
    const processedDeps = new Set(); // track dependsOn groups already rendered

    for (let i = 0; i < fieldList.length; i++) {
      const field = fieldList[i];

      // Skip fields that are part of a dependsOn group (rendered after parent)
      if (field.dependsOn && processedDeps.has(field.dependsOn + ":" + field.name)) {
        continue;
      }

      // Render the field itself
      rendered.push(
        <React.Fragment key={field.name}>{renderField(field)}</React.Fragment>
      );

      // Check if any visible fields depend on this field
      const dependents = fieldList.filter(
        (f) => f.dependsOn === field.name && f.name !== field.name
      );

      if (dependents.length > 0) {
        // Find the dependsOnLabel and dependsOnMessage from first dependent that has them
        const firstWithLabel = dependents.find((f) => f.dependsOnLabel) || dependents[0];
        const firstWithMessage = dependents.find((f) => f.dependsOnMessage) || dependents[0];
        const groupLabel = firstWithLabel.dependsOnLabel || "Dependent properties";
        const rawMessage = firstWithMessage.dependsOnMessage;
        const tooltipMessage = typeof rawMessage === "function"
          ? rawMessage(field.label)
          : rawMessage || "";

        rendered.push(
          <Tile key={`dep-${field.name}`}>
            <Flex direction="column" gap={gap}>
              <Flex direction="row" align="center" gap="xs">
                <Text format={{ fontWeight: "demibold" }}>{groupLabel}</Text>
                {tooltipMessage && (

                  <Icon name="add" size="xs" />

                )}
              </Flex>
              {dependents.map((dep) => {
                processedDeps.add(dep.dependsOn + ":" + dep.name);
                return (
                  <React.Fragment key={dep.name}>{renderField(dep)}</React.Fragment>
                );
              })}
            </Flex>
          </Tile>
        );
      }
    }

    return rendered;
  };

  // -- Layout rendering (half-width support) --------------------------------

  const renderFieldLayout = () => {
    // Group consecutive half-width fields into rows
    const rows = [];
    let i = 0;

    while (i < visibleFields.length) {
      const field = visibleFields[i];

      // Check if this field and the next are both "half"
      if (
        field.width === "half" &&
        i + 1 < visibleFields.length &&
        visibleFields[i + 1].width === "half" &&
        !field.dependsOn // don't pair dependsOn fields in half-width
      ) {
        rows.push({
          type: "pair",
          fields: [visibleFields[i], visibleFields[i + 1]],
        });
        i += 2;
      } else {
        rows.push({ type: "single", field });
        i++;
      }
    }

    // Render using the dependent properties grouping logic
    // For simplicity, we handle half-width inline here and dependsOn in the full list
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

        // Skip if already rendered as part of a dependsOn group
        if (processedDeps.has(field.name)) continue;

        elements.push(
          <React.Fragment key={field.name}>{renderField(field)}</React.Fragment>
        );

        // Check for dependent fields
        const dependents = visibleFields.filter(
          (f) => f.dependsOn === field.name && f.name !== field.name
        );

        if (dependents.length > 0) {
          const firstWithLabel = dependents.find((f) => f.dependsOnLabel) || dependents[0];
          const firstWithMessage = dependents.find((f) => f.dependsOnMessage) || dependents[0];
          const groupLabel = firstWithLabel.dependsOnLabel || "Dependent properties";
          const rawMessage = firstWithMessage.dependsOnMessage;
          const tooltipMessage = typeof rawMessage === "function"
            ? rawMessage(field.label)
            : rawMessage || "";

          for (const dep of dependents) processedDeps.add(dep.name);

          elements.push(
            <Tile key={`dep-${field.name}`} compact={true}>
              <Flex direction="column" gap={gap}>
                <Flex direction="row" align="center" gap="xs">
                  <Text format={{ fontWeight: "demibold" }}>
                    {groupLabel}{" "}
                    {tooltipMessage && (
                      <Link inline={true} variant="dark" overlay={<Tooltip>{tooltipMessage}</Tooltip>} >
                        <Icon name="info" />
                      </Link>
                    )}
                  </Text>

                </Flex>
                {dependents.map((dep) => (
                  <React.Fragment key={dep.name}>{renderField(dep)}</React.Fragment>
                ))}
              </Flex>
            </Tile >
          );
        }
      }
    }

    return elements;
  };

  // -- Buttons rendering ----------------------------------------------------

  const renderButtons = () => {
    if (submitPosition === "none") return null;

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
