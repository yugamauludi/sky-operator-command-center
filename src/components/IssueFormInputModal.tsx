"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";

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
  searchable?: boolean;
  lazyLoad?: boolean;
  onLoadMore?: (searchTerm: string, page: number) => Promise<FieldOption[]>;
  hasMore?: boolean;
  loading?: boolean;
  validation?: (value: string) => { isValid: boolean; message: string };
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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(field.hasMore ?? true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const options = field.options || [];

  const filteredOptions = useMemo(() => {
    if (!field.searchable) return options;
    if (!searchTerm.trim()) return options;

    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, field.searchable]);

  const selectedLabel = useMemo(() => {
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.label : "";
  }, [value, options]);

  const loadMoreOptions = async (resetOptions = false) => {
    if (!field.lazyLoad || !field.onLoadMore || loading) return;

    setLoading(true);
    try {
      const currentPage = resetOptions ? 1 : page;
      const newOptions = await field.onLoadMore(searchTerm, currentPage);

      setPage(currentPage + 1);
      setHasMore(newOptions.length > 0);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (field.lazyLoad) {
        setPage(1);
        setHasMore(true);
        loadMoreOptions(true);
      }
    }, 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setHighlightedIndex(-1);

    if (field.lazyLoad) {
      debouncedSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!field.lazyLoad || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMoreOptions();
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [highlightedIndex]);

  console.log(`SearchableSelect Debug - Field: ${field.id}`, {
    fieldOptions: field.options,
    optionsLength: options.length,
    filteredOptionsLength: filteredOptions.length,
    searchTerm,
    value,
    disabled
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          value={isOpen ? searchTerm : selectedLabel}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={field.placeholder}
          className={`w-full p-3 pr-20 border rounded-md text-sm cursor-pointer ${disabled
            ? "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
            : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            } dark:border-gray-600 ${isOpen ? "border-blue-500 dark:border-blue-400" : ""
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400`}
          disabled={disabled}
          autoComplete="off"
        />

        {/* Clear button */}
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Dropdown arrow */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          disabled={disabled}
        >
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
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Options list */}
          <div
            ref={listRef}
            className="overflow-y-auto max-h-48"
            onScroll={handleScroll}
          >
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                {searchTerm ? "Tidak ada opsi yang cocok" :
                  disabled ? field.placeholder : "Tidak ada opsi tersedia"}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full text-left p-3 text-sm transition-colors ${value === option.value
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                    : highlightedIndex === index
                      ? "bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
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
                  <span>Memuat...</span>
                </div>
              </div>
            )}

            {/* Load more indicator */}
            {field.lazyLoad && hasMore && !loading && filteredOptions.length > 0 && (
              <div className="p-2 text-xs text-gray-400 dark:text-gray-500 text-center">
                Scroll ke bawah untuk memuat lebih banyak...
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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [, setFieldValidationStates] = useState<Record<string, {
    isValid: boolean;
    message: string;
  }>>({});

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

  const renderField = (field: Field) => {
    const value = formValues[field.id] || "";
    const isReadonly = field.readonly || false;
    const isDisabled = field.disabled || false;
    const hasError = !!validationErrors[field.id];
    const inputClassName = `w-full p-3 border rounded-md text-sm ${hasError
      ? "border-red-500 dark:border-red-400"
      : "dark:border-gray-600"
      } ${isDisabled || isReadonly
        ? "bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed"
        : "bg-white dark:bg-gray-700"
      }`;

    switch (field.type) {
      case "select":
        return (
          <div>
            <SearchableSelect
              field={{
                ...field,
                searchable: true
              }}
              value={value}
              onChange={(newValue) => handleInputChange(field.id, newValue)}
              disabled={isDisabled || isReadonly}
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

      default:
        return (
          <div>
            <input
              type={field.type}
              value={value}
              onChange={(e) => {
                if (field.id === "number_plate") {
                  const upperValue = e.target.value.toUpperCase();
                  handleInputChange(field.id, upperValue);

                  if (field.validation) {
                    const result = field.validation(upperValue);
                    setValidationErrors(prev => ({
                      ...prev,
                      [field.id]: result.isValid ? "" : result.message
                    }));
                  }
                } else {
                  handleInputChange(field.id, e.target.value);
                }
              }}
              onBlur={() => {
                if (field.validation) {
                  const result = field.validation(value);
                  setValidationErrors(prev => ({
                    ...prev,
                    [field.id]: result.isValid ? "" : result.message
                  }));
                }
              }}
              placeholder={field.placeholder}
              className={`${inputClassName} ${validationErrors[field.id] ? 'border-red-500 focus:border-red-500' : ''
                }`}
              readOnly={isReadonly}
              disabled={isDisabled}
              required={field.required}
              // Tambahkan pattern untuk plat nomor
              pattern={field.id === "number_plate" ? "[A-Z0-9 ]{5,11}" : undefined}
              maxLength={field.id === "number_plate" ? 11 : undefined}
            />
          </div>
        );
    }
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));

    const field = fields.find(f => f.id === fieldId);
    if (field?.validation) {
      const result = field.validation(value);
      setValidationErrors(prev => ({
        ...prev,
        [fieldId]: result.isValid ? "" : result.message
      }));
    }

    field?.onChange?.(value);
  };

  const validateForm = (): boolean => {
    const newValidationStates: Record<string, { isValid: boolean; message: string }> = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formValues[field.id] || "";

      if (field.required && (!value || value.trim() === "")) {
        newValidationStates[field.id] = {
          isValid: false,
          message: `${field.label} wajib diisi`
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
      Object.entries(newValidationStates).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value.isValid ? "" : value.message
      }), {})
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
                      {field.required && <span className="text-red-500 ml-1">*</span>}
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
                      {field.required && <span className="text-red-500 ml-1">*</span>}
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