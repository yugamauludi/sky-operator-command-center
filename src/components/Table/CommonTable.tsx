import { ReactNode } from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], item: T) => ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export default function CommonTable<T>({ data, columns, className = '' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>
        <thead>
          <tr className="text-left">
            {columns.map((column, index) => (
              <th key={index} className="p-4">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className={`border-t border-gray-200 dark:border-gray-700 ${
                rowIndex % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'
              }`}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="p-4">
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
  );
}