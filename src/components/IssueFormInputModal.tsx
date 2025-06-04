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

  // Initialize form values when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialValues: Record<string, string> = {};
      fields.forEach((field) => {
        initialValues[field.id] = field.value;
      });
      setFormValues(initialValues);
    }
  }, [isOpen, fields]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
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

    switch (field.type) {
      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-sm"
            disabled={isReadonly}
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
            className="w-full p-3 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-sm resize-none"
            rows={3}
            readOnly={isReadonly}
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
              isReadonly 
                ? "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed" 
                : "bg-white dark:bg-gray-700"
            } dark:border-gray-600`}
            readOnly={isReadonly}
            required={field.required}
          />
        );
    }
  };

  if (!isOpen) return null;

  // Separate fields into Information and Input Issue sections
  const informationFields = fields.filter(field => 
    ["no_transaction", "number_plate", "date", "in_time", "out_time", "payment_time", "tariff"].includes(field.id)
  );
  
  const inputIssueFields = fields.filter(field => 
    ["idCategory", "description", "action"].includes(field.id)
  );

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                  Information
                </h3>
                <div className="space-y-4">
                  {informationFields.map((field) => (
                    <div key={field.id} className="flex items-center">
                      <label className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                        {field.label}
                      </label>
                      <span className="mx-2">:</span>
                      <div className="flex-1">
                        {renderField(field)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input Issue Section */}
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">
                  Input Issue
                </h3>
                <div className="space-y-4">
                  {inputIssueFields.map((field) => (
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
            </div>

            {/* Photo Section Placeholder */}
            <div className="mt-8">
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
            </div>

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