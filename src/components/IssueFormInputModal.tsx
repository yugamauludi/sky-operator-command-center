"use client";

import React, { useState, useEffect } from "react";

interface FieldOption {
  value: string;
  label: string;
}

export interface Field {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  value: string;
  placeholder: string;
  options?: FieldOption[];
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean; // Add disabled property
  onChange?: (value: string) => void; // Add onChange callback
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

  // Initialize form values when modal opens or fields change
  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, string> = {};
      fields.forEach((field) => {
        initialValues[field.id] = field.value;
      });
      setFormValues(initialValues);
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
  }, [fields, isOpen]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Call the field's onChange callback if provided
    const field = fields.find(f => f.id === fieldId);
    if (field?.onChange) {
      field.onChange(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formValues[field.id] || formValues[field.id].trim() === "");
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map(f => f.label).join(", ")}`);
      return;
    }

    onSubmit(formValues);
    onClose();
  };

  const renderField = (field: Field) => {
    const value = formValues[field.id] || "";
    const isReadonly = field.readonly || false;
    const isDisabled = field.disabled || false;

    switch (field.type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-3 border rounded-md text-sm ${
              isDisabled || isReadonly
                ? "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-gray-700"
            } dark:border-gray-600`}
            disabled={isReadonly || isDisabled}
            required={field.required}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full p-3 border rounded-md text-sm resize-none ${
              isDisabled || isReadonly
                ? "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-white dark:bg-gray-700"
            } dark:border-gray-600`}
            rows={3}
            readOnly={isReadonly}
            disabled={isDisabled}
            required={field.required}
          />
        );
      
      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full p-3 border rounded-md text-sm ${
              isReadonly || isDisabled
                ? "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed" 
                : "bg-white dark:bg-gray-700"
            } dark:border-gray-600`}
            readOnly={isReadonly}
            disabled={isDisabled}
            required={field.required}
          />
        );
    }
  };

  if (!isOpen) return null;

  // Arrange fields in left-right layout (2 columns)
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
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {rightColumnFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Section Placeholder */}
            {/* <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                Photos
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-600 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-white text-sm">Foto In</span>
                </div>
                <div className="bg-gray-600 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-white text-sm">Foto Out</span>
                </div>
                <div className="bg-gray-600 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-white text-sm">Foto Capture</span>
                </div>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
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