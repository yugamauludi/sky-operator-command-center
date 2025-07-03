"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import SearchableSelect from "@/components/input/SearchableSelect"; // Tambahkan import ini

interface FieldOption {
  value: string;
  label: string;
}

export interface Field {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "radio";
  value: string;
  placeholder?: string;
  options?: FieldOption[];
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  searchable?: boolean;
  lazyLoad?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  validation?: (value: string) => { isValid: boolean; message: string };
}

interface IssueInputFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
  title: string;
  fields: Field[];
  confirmText?: string;
  cancelText?: string;
}

const IsseFormInputModal: React.FC<IssueInputFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields,
  confirmText = "Submit",
  cancelText = "Cancel",
}) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [, setFieldValidationStates] = useState<
    Record<
      string,
      {
        isValid: boolean;
        message: string;
      }
    >
  >({});

  const [licenseValidationTimeout, setLicenseValidationTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Memoize validation function untuk menghindari re-creation
  const validateLicensePlate = useCallback(
    (value: string, fieldId: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (field?.validation) {
        const result = field.validation(value);
        setValidationErrors((prev) => ({
          ...prev,
          [fieldId]: result.isValid ? "" : result.message,
        }));
      }
    },
    [fields]
  );

  const debouncedLicenseValidation = useCallback(
    (value: string, fieldId: string) => {
      if (licenseValidationTimeout) {
        clearTimeout(licenseValidationTimeout);
      }

      const timeout = setTimeout(() => {
        validateLicensePlate(value, fieldId);
      }, 300); // 300ms delay

      setLicenseValidationTimeout(timeout);
    },
    [licenseValidationTimeout, validateLicensePlate]
  );

  useEffect(() => {
    return () => {
      if (licenseValidationTimeout) {
        clearTimeout(licenseValidationTimeout);
      }
    };
  }, [licenseValidationTimeout]);

  // Initialize form values when modal opens or fields change
  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, string> = {};
      fields.forEach((field) => {
        initialValues[field.id] = field.value;
      });
      setFormValues(initialValues);
      setValidationErrors({});
    }
  }, [isOpen, fields]);

  // Update form values when field values change externally
  useEffect(() => {
    if (isOpen) {
      const updatedValues: Record<string, string> = { ...formValues };
      let hasChanges = false;

      fields.forEach((field) => {
        if (updatedValues[field.id] !== field.value) {
          updatedValues[field.id] = field.value;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setFormValues(updatedValues);
      }
    }
  }, [fields, isOpen, formValues]);

  const handleLoadMore = useCallback(
    (fieldId: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (field?.onLoadMore) {
        field.onLoadMore();
      }
    },
    [fields]
  );

  const renderField = (field: Field) => {
    const value = formValues[field.id] || "";
    const isReadonly = field.readonly || false;
    const isDisabled = field.disabled || false;
    const hasError = !!validationErrors[field.id];
    const inputClassName = getInputClassName(hasError, isDisabled, isReadonly);

    switch (field.type) {
      case "select":
        return (
          <div>
            <SearchableSelect
              options={field.options || []}
              value={value}
              onChange={(newValue) => handleInputChange(field.id, newValue)}
              placeholder={field.placeholder}
              disabled={isDisabled || isReadonly}
              error={validationErrors[field.id]}
              onLoadMore={field.onLoadMore ? () => handleLoadMore(field.id) : undefined} // Ubah ini
              hasMoreData={field.hasMore || false}
              isLoadingMore={field.loading || false}
              showLoadMoreInfo={true}
              loadMoreText={`Memuat lebih banyak... (${
                field.options?.length || 0
              }${field.hasMore ? "+" : ""})`}
            />
          </div>
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`${inputClassName} resize-none`}
            rows={3}
            readOnly={isReadonly}
            disabled={isDisabled}
            required={field.required}
          />
        );

      case "text":
        return (
          <div>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                let newValue = e.target.value;

                // Handle license plate specific logic
                if (field.id === "number_plate") {
                  newValue = newValue.toUpperCase();
                  // Limit length immediately in UI
                  if (newValue.length > 11) {
                    newValue = newValue.substring(0, 11);
                  }
                }

                handleInputChange(field.id, newValue);
              }}
              onBlur={() => {
                // Only validate on blur for non-license plate fields
                if (field.id !== "number_plate") {
                  validateLicensePlate(value, field.id);
                }
              }}
              placeholder={field.placeholder}
              className={inputClassName}
              readOnly={isReadonly}
              disabled={isDisabled}
              required={field.required}
              // Remove pattern and maxLength from here - handle in onChange
              autoComplete="off"
              spellCheck="false"
            />
            {/* {hasError && (
            <div className="mt-1 text-sm text-red-600 dark:text-red-400 transition-opacity duration-200">
              {validationErrors[field.id]}
            </div>
          )} */}
          </div>
        );

      case "radio":
        return (
          <div className="flex gap-4">
            {field.options?.map((option) => (
              <label
                key={option.value}
                className="flex space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={isDisabled || isReadonly}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <div>
            <input
              type={field.type}
              value={value}
              onChange={(e) => {
                let newValue = e.target.value;

                if (field.id === "number_plate") {
                  newValue = newValue.toUpperCase();
                  if (newValue.length > 11) {
                    newValue = newValue.substring(0, 11);
                  }
                }

                handleInputChange(field.id, newValue);
              }}
              onBlur={() => {
                if (field.id !== "number_plate" && field.validation) {
                  const result = field.validation(value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    [field.id]: result.isValid ? "" : result.message,
                  }));
                }
              }}
              placeholder={field.placeholder}
              className={inputClassName}
              readOnly={isReadonly}
              disabled={isDisabled}
              required={field.required}
              autoComplete="off"
              spellCheck="false"
            />
            {hasError && (
              <div className="mt-1 text-sm text-red-600 dark:text-red-400 transition-opacity duration-200">
                {validationErrors[field.id]}
              </div>
            )}
          </div>
        );
    }
  };

  const handleInputChange = useCallback(
    (fieldId: string, value: string) => {
      // Update form values immediately for smooth typing
      setFormValues((prev) => ({
        ...prev,
        [fieldId]: value,
      }));

      // Call field onChange immediately
      const field = fields.find((f) => f.id === fieldId);
      field?.onChange?.(value);

      // For license plate, use debounced validation
      if (fieldId === "number_plate") {
        debouncedLicenseValidation(value, fieldId);
      } else {
        // For other fields, validate immediately
        if (field?.validation) {
          const result = field.validation(value);
          setValidationErrors((prev) => ({
            ...prev,
            [fieldId]: result.isValid ? "" : result.message,
          }));
        }
      }
    },
    [fields, debouncedLicenseValidation]
  );

  const getInputClassName = useMemo(
    () => (hasError: boolean, isDisabled: boolean, isReadonly: boolean) => {
      let classes =
        "w-full p-3 border rounded-md text-sm transition-all duration-200 shadow-sm focus:outline-none";

      if (isDisabled || isReadonly) {
        classes +=
          " bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600";
      } else if (hasError) {
        classes +=
          " bg-white dark:bg-gray-700 border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";
      } else {
        classes +=
          " bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
      }
      return classes;
    },
    []
  );

  const validateForm = (): boolean => {
    const newValidationStates: Record<
      string,
      { isValid: boolean; message: string }
    > = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formValues[field.id] || "";

      if (field.required && (!value || value.trim() === "")) {
        newValidationStates[field.id] = {
          isValid: false,
          message: `${field.label} wajib diisi`,
        };
        isValid = false;
      }

      // Custom field validation
      else if (field.validation) {
        const validationResult = field.validation(value);
        newValidationStates[field.id] = validationResult;
        if (!validationResult.isValid) {
          isValid = false;
        }
      }
    });

    setFieldValidationStates(newValidationStates);
    setValidationErrors(
      Object.entries(newValidationStates).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value.isValid ? "" : value.message,
        }),
        {}
      )
    );

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast?.error("Harap perbaiki error yang ada sebelum submit");
      return;
    }

    onSubmit(formValues);
    onClose();
  };

  if (!isOpen) return null;

  const leftColumnFields: Field[] = [];
  const rightColumnFields: Field[] = [];

  fields.forEach((field, index) => {
    if (index % 2 === 0) {
      leftColumnFields.push(field);
    } else {
      rightColumnFields.push(field);
    }
  });

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

            {/* Input Fields in Left-Right Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                {leftColumnFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {renderField(field)}
                    {validationErrors[field.id] && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {validationErrors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {rightColumnFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    {renderField(field)}
                    {validationErrors[field.id] && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {validationErrors[field.id]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IsseFormInputModal;
