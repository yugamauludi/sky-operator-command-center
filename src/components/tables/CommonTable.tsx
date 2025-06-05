"use client";
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string | number;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  showPagination?: boolean;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export default function CommonTable<T>({
  data,
  columns,
  className = "",
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  showPagination = false,
  onItemsPerPageChange,
}: TableProps<T>) {
  const renderPagination = () => {
    if (!showPagination || !currentPage || !totalPages || !onPageChange) {
      return null;
    }

    const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
    const endItem = Math.min(
      currentPage * (itemsPerPage || 10),
      totalItems || data.length
    );

    const getVisiblePages = () => {
      if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const pages: (number | string)[] = [];

      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
        if (totalPages > 5) {
          pages.push("...", totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, "...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...", totalPages);
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:px-6">
        {/* Results Info - Mobile */}
        <div className="flex flex-1 justify-between sm:hidden">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Showing {startItem} to {endItem} of {totalItems || data.length}{" "}
            results
          </span>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{startItem}</span> to{" "}
              <span className="font-medium">{endItem}</span> of{" "}
              <span className="font-medium">{totalItems || data.length}</span>{" "}
              results
            </p>
            {onItemsPerPageChange && (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="itemsPerPage"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Items per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  className="block w-20 rounded-md border-0 py-1.5 pl-3 pr-2 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {/* First Page */}
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 transition-colors duration-200"
                title="First page"
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 transition-colors duration-200"
                title="Previous page"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {getVisiblePages().map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-800">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page as number)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:z-20 focus:outline-offset-0 transition-colors duration-200 ${
                        currentPage === page
                          ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      title={`Go to page ${page}`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}

              {/* Next Page */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 transition-colors duration-200"
                title="Next page"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 transition-colors duration-200"
                title="Last page"
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="w-4 h-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-120 overflow-y-auto">
          <table className={`w-full ${className}`}>
            <thead className="sticky top-0 z-10">
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    rowIndex % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="p-4 text-sm text-gray-900 dark:text-gray-100"
                      style={{ width: column.width }} // ✅ Tambahkan ini
                    >
                      {column.render
                        ? column.render(item[column.accessor], item)
                        : item[column.accessor]?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {renderPagination()}
    </div>
  );
}
