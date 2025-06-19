"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

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
  disabled?: boolean;
  onChange?: (value: string) => void;
  // New properties for search and lazy loading
  searchable?: boolean;
  lazyLoad?: boolean;
  onLoadMore?: (searchTerm: string, page: number) => Promise<FieldOption[]>;
  hasMore?: boolean;
  loading?: boolean;
}

interface SearchableSelectProps {
  field: Field;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  field,
  value,
  onChange,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<FieldOption[]>(field.options || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(field.hasMore ?? true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!field.searchable) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, field.searchable]);

  // Get selected option label
  const selectedLabel = useMemo(() => {
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.label : field.placeholder;
  }, [value, options, field.placeholder]);

  // Load more options for lazy loading
  const loadMoreOptions = async (resetOptions = false) => {
    if (!field.lazyLoad || !field.onLoadMore || loading) return;

    setLoading(true);
    try {
      const currentPage = resetOptions ? 1 : page;
      const newOptions = await field.onLoadMore(searchTerm, currentPage);

      setOptions(prev => resetOptions ? newOptions : [...prev, ...newOptions]);
      setPage(currentPage + 1);
      setHasMore(newOptions.length > 0);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (field.lazyLoad) {
      setPage(1);
      setHasMore(true);
      // Debounce search for lazy loading
      const timeoutId = setTimeout(() => {
        loadMoreOptions(true);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  };

  // Handle scroll for lazy loading
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!field.lazyLoad || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMoreOptions();
    }
  };

  // Handle option select
  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && field.searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, field.searchable]);

  // Initialize lazy loading
  useEffect(() => {
    if (field.lazyLoad && options.length === 0 && !loading) {
      loadMoreOptions(true);
    }
  }, [field.lazyLoad]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Select trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full p-3 border rounded-md text-sm text-left flex items-center justify-between ${disabled
            ? "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          } dark:border-gray-600 ${isOpen ? "border-blue-500 dark:border-blue-400" : ""
          }`}
        disabled={disabled}
      >
        <span className={value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
          {selectedLabel}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          {field.searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search..."
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          )}

          {/* Options list */}
          <div
            ref={listRef}
            className="overflow-y-auto max-h-48"
            onScroll={handleScroll}
          >
            {filteredOptions.length === 0 && !loading ? (
              <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                {searchTerm ? "No options found" : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full text-left p-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${value === option.value
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      : "text-gray-900 dark:text-white"
                    }`}
                >
                  {option.label}
                </button>
              ))
            )}

            {/* Loading indicator */}
            {loading && (
              <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span>Loading...</span>
                </div>
              </div>
            )}

            {/* Load more indicator */}
            {field.lazyLoad && hasMore && !loading && filteredOptions.length > 0 && (
              <div className="p-2 text-xs text-gray-400 dark:text-gray-500 text-center">
                Scroll down to load more...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

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
        // Use enhanced searchable select for select fields
        if (field.searchable || field.lazyLoad) {
          return (
            <SearchableSelect
              field={field}
              value={value}
              onChange={(newValue) => handleInputChange(field.id, newValue)}
              disabled={isDisabled || isReadonly}
            />
          );
        }

        // Fallback to regular select
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className={`w-full p-3 border rounded-md text-sm ${isDisabled || isReadonly
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
            className={`w-full p-3 border rounded-md text-sm resize-none ${isDisabled || isReadonly
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
            className={`w-full p-3 border rounded-md text-sm ${isReadonly || isDisabled
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