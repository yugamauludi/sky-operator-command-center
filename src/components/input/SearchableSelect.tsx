import React, { useState, useRef, useEffect, useCallback } from "react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  className?: string;
  onLoadMore?: () => void;
  hasMoreData?: boolean;
  isLoadingMore?: boolean;
  showLoadMoreInfo?: boolean;
  loadMoreText?: string;
  // New props for infinite scroll
  onSearch?: (searchTerm: string) => void;
  isSearching?: boolean;
  searchDebounceMs?: number;
  loadMoreThreshold?: number;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "-- Pilih --",
  disabled = false,
  label,
  error,
  className = "",
  onLoadMore,
  hasMoreData = false,
  isLoadingMore = false,
  showLoadMoreInfo = false,
  loadMoreText = "Loading more...",
  onSearch,
  isSearching = false,
  searchDebounceMs = 300,
  loadMoreThreshold = 5,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hasTriggeredLoadMore, setHasTriggeredLoadMore] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement | null>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Debounced search handler
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        if (onSearch) {
          onSearch(searchTerm);
        }
      }, searchDebounceMs);
    },
    [onSearch, searchDebounceMs]
  );

  // Filter options locally if no search handler provided
  const filteredOptions = onSearch
    ? options // When using server-side search, show all provided options
    : options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      );

  const selectedOption = options.find((opt) => opt.value === value);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = element;

      // Check if scrolled near bottom
      const isNearBottom =
        scrollHeight - scrollTop <= clientHeight + loadMoreThreshold;

      if (
        isNearBottom &&
        onLoadMore &&
        hasMoreData &&
        !isLoadingMore &&
        !hasTriggeredLoadMore
      ) {
        setHasTriggeredLoadMore(true);
        onLoadMore();
      }
    },
    [
      onLoadMore,
      hasMoreData,
      isLoadingMore,
      hasTriggeredLoadMore,
      loadMoreThreshold,
    ]
  );

  // Reset load more trigger when new data is loaded
  useEffect(() => {
    if (!isLoadingMore) {
      setHasTriggeredLoadMore(false);
    }
  }, [isLoadingMore]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    setHasTriggeredLoadMore(false); // Reset load more when searching

    if (onSearch) {
      debouncedSearch(searchTerm);
    }
  };

  // Clear search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setHasTriggeredLoadMore(false);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Auto scroll to selected option when dropdown opens
  useEffect(() => {
    if (isOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  const renderLoadingIndicator = () => (
    <div className="flex items-center justify-center py-3">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {showLoadMoreInfo ? loadMoreText : "Memuat..."}
      </span>
    </div>
  );

  const renderNoDataMessage = () => (
    <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
      {search ? "Tidak ada data yang ditemukan" : "Tidak ada pilihan"}
    </div>
  );

  const renderLoadMoreInfo = () => {
    if (search) return null; // Don't show load more info when searching

    if (hasMoreData) {
      return (
        <div className="px-3 py-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
          {isLoadingMore ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              {showLoadMoreInfo ? loadMoreText : "Memuat..."}
            </div>
          ) : (
            "Scroll untuk memuat lebih banyak"
          )}
        </div>
      );
    }

    if (!hasMoreData && options.length > 5) {
      return (
        <div className="px-3 py-2 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
          Semua data telah dimuat
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className={`w-full px-3 py-[9.6px] text-left border ${
          error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white flex items-center justify-between ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <span
          className={`${
            selectedOption
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          } truncate max-w-[calc(100%-2rem)]`}
          title={selectedOption?.label || placeholder}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={search}
                onChange={handleSearchChange}
                placeholder="Cari..."
                className="w-full px-2 py-1 border border-gray-200 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
              />
              {isSearching && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Options Container */}
          <div
            ref={optionsContainerRef}
            className="py-1 max-h-52 overflow-y-auto"
            onScroll={handleScroll}
          >
            {/* Show loading indicator when searching */}
            {isSearching && filteredOptions.length === 0 ? (
              renderLoadingIndicator()
            ) : filteredOptions.length === 0 ? (
              renderNoDataMessage()
            ) : (
              <>
                {/* Options List */}
                {filteredOptions.map((opt) => {
                  const isSelected = value === opt.value;
                  return (
                    <button
                      key={opt.value}
                      ref={isSelected ? selectedRef : null}
                      type="button"
                      onClick={() => handleOptionClick(opt.value)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      <span className="truncate block">{opt.label}</span>
                    </button>
                  );
                })}

                {/* Load More Info */}
                {renderLoadMoreInfo()}
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;