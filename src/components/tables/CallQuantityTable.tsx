import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import React, { useState } from 'react';

interface CallData {
  location: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  juni: number;
  jul: number;
  aug: number;
  sep: number;
  okt: number;
  nov: number;
  des: number;
  total: number;
}

const CallQuantityTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'car' | 'bike' | 'total'>('total');
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2 | 'all'>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Extended data with full year (adding Jul-Dec with sample data)
  const carData: CallData[] = [
    { location: 'HPM LKU', jan: 179, feb: 363, mar: 483, apr: 342, mei: 266, juni: 94, jul: 120, aug: 145, sep: 167, okt: 189, nov: 156, des: 98, total: 2602 },
    { location: 'LMP', jan: 840, feb: 1178, mar: 1721, apr: 1306, mei: 956, juni: 395, jul: 456, aug: 567, sep: 678, okt: 789, nov: 654, des: 432, total: 9972 },
    { location: 'PV', jan: 437, feb: 990, mar: 1056, apr: 785, mei: 796, juni: 241, jul: 298, aug: 356, sep: 412, okt: 468, nov: 389, des: 256, total: 6484 },
    { location: 'SPARK', jan: 0, feb: 0, mar: 235, apr: 247, mei: 78, juni: 0, jul: 89, aug: 112, sep: 134, okt: 156, nov: 98, des: 67, total: 1216 },
    { location: 'PICON', jan: 0, feb: 0, mar: 0, apr: 67, mei: 278, juni: 117, jul: 145, aug: 178, sep: 189, okt: 167, nov: 134, des: 89, total: 1364 },
    { location: 'MLC', jan: 0, feb: 0, mar: 0, apr: 0, mei: 353, juni: 0, jul: 234, aug: 267, sep: 298, okt: 321, nov: 245, des: 178, total: 1896 },
    { location: 'LMN', jan: 0, feb: 0, mar: 0, apr: 0, mei: 47, juni: 72, jul: 89, aug: 98, sep: 76, okt: 67, nov: 54, des: 43, total: 546 },
    { location: 'SHLV', jan: 295, feb: 343, mar: 312, apr: 386, mei: 309, juni: 115, jul: 156, aug: 189, sep: 234, okt: 267, nov: 221, des: 167, total: 2994 },
    { location: 'SHKJ', jan: 31, feb: 246, mar: 310, apr: 217, mei: 246, juni: 100, jul: 134, aug: 167, sep: 189, okt: 212, nov: 178, des: 123, total: 2153 },
    { location: 'SHKD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 5, jul: 12, aug: 18, sep: 23, okt: 15, nov: 8, des: 3, total: 84 },
    { location: 'UPH', jan: 188, feb: 289, mar: 198, apr: 216, mei: 210, juni: 104, jul: 134, aug: 156, sep: 178, okt: 189, nov: 167, des: 123, total: 2152 },
    { location: 'HELIPAD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 2, juni: 7, jul: 12, aug: 15, sep: 18, okt: 21, nov: 16, des: 9, total: 100 },
  ];

  const bikeData: CallData[] = [
    { location: 'HPM LKU', jan: 11, feb: 67, mar: 115, apr: 74, mei: 83, juni: 45, jul: 56, aug: 67, sep: 78, okt: 89, nov: 72, des: 45, total: 802 },
    { location: 'LMP', jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, jul: 0, aug: 0, sep: 0, okt: 0, nov: 0, des: 0, total: 0 },
    { location: 'PV', jan: 99, feb: 326, mar: 349, apr: 352, mei: 316, juni: 133, jul: 156, aug: 178, sep: 189, okt: 167, nov: 134, des: 89, total: 2488 },
    { location: 'SPARK', jan: 0, feb: 0, mar: 0, apr: 46, mei: 55, juni: 18, jul: 23, aug: 34, sep: 45, okt: 38, nov: 29, des: 18, total: 306 },
    { location: 'PICON', jan: 0, feb: 0, mar: 0, apr: 12, mei: 33, juni: 0, jul: 18, aug: 23, sep: 29, okt: 34, nov: 26, des: 15, total: 190 },
    { location: 'MLC', jan: 0, feb: 0, mar: 0, apr: 0, mei: 174, juni: 0, jul: 89, aug: 112, sep: 134, okt: 123, nov: 98, des: 67, total: 797 },
    { location: 'LMN', jan: 0, feb: 0, mar: 0, apr: 0, mei: 5, juni: 1, jul: 12, aug: 15, sep: 18, okt: 21, nov: 16, des: 8, total: 96 },
    { location: 'SHLV', jan: 265, feb: 375, mar: 392, apr: 285, mei: 222, juni: 85, jul: 112, aug: 134, sep: 156, okt: 178, nov: 145, des: 98, total: 2447 },
    { location: 'SHKJ', jan: 28, feb: 115, mar: 157, apr: 139, mei: 189, juni: 71, jul: 89, aug: 112, sep: 134, okt: 156, nov: 123, des: 78, total: 1391 },
    { location: 'SHKD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, jul: 0, aug: 0, sep: 0, okt: 0, nov: 0, des: 0, total: 0 },
    { location: 'UPH', jan: 119, feb: 271, mar: 271, apr: 221, mei: 123, juni: 71, jul: 89, aug: 112, sep: 134, okt: 156, nov: 123, des: 78, total: 1768 },
    { location: 'HELIPAD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 16, juni: 30, jul: 23, aug: 18, sep: 15, okt: 12, nov: 8, des: 4, total: 126 },
  ];

  // Calculate total data by combining car and bike data
  const totalData: CallData[] = carData.map((carRow, index) => {
    const bikeRow = bikeData[index];
    return {
      location: carRow.location,
      jan: carRow.jan + bikeRow.jan,
      feb: carRow.feb + bikeRow.feb,
      mar: carRow.mar + bikeRow.mar,
      apr: carRow.apr + bikeRow.apr,
      mei: carRow.mei + bikeRow.mei,
      juni: carRow.juni + bikeRow.juni,
      jul: carRow.jul + bikeRow.jul,
      aug: carRow.aug + bikeRow.aug,
      sep: carRow.sep + bikeRow.sep,
      okt: carRow.okt + bikeRow.okt,
      nov: carRow.nov + bikeRow.nov,
      des: carRow.des + bikeRow.des,
      total: carRow.total + bikeRow.total
    };
  });

  const getCurrentData = () => {
    switch (activeTab) {
      case 'car': return carData;
      case 'bike': return bikeData;
      case 'total': return totalData;
      default: return totalData;
    }
  };

  const getPaginatedData = (data: CallData[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (data: CallData[]) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset ke halaman pertama
  };

  const getFilteredColumns = () => {
    if (selectedSemester === 1) {
      return ['jan', 'feb', 'mar', 'apr', 'mei', 'juni'];
    } else if (selectedSemester === 2) {
      return ['jul', 'aug', 'sep', 'okt', 'nov', 'des'];
    } else {
      return ['jan', 'feb', 'mar', 'apr', 'mei', 'juni', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'];
    }
  };

  const getColumnHeaders = () => {
    const columns = getFilteredColumns();
    const headers = {
      jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', mei: 'Mei', juni: 'Juni',
      jul: 'Jul', aug: 'Aug', sep: 'Sep', okt: 'Okt', nov: 'Nov', des: 'Des'
    };
    return columns.map(col => ({ key: col, label: headers[col as keyof typeof headers] }));
  };

  const formatNumber = (num: number) => {
    return num === 0 ? '-' : num.toLocaleString('id-ID');
  };

  const getRowTotal = (data: CallData[]) => {
    const columns = getFilteredColumns();
    const totals = columns.reduce((acc, col) => {
      acc[col] = data.reduce((sum, row) => sum + Number(row[col as keyof CallData]), 0);
      return acc;
    }, {} as Record<string, number>);

    totals.total = Object.values(totals).reduce((sum, val) => sum + val, 0);
    return totals;
  };

  const getPeriodText = () => {
    if (selectedSemester === 1) {
      return `Semester 1 (Januari - Juni) ${selectedYear}`;
    } else if (selectedSemester === 2) {
      return `Semester 2 (Juli - Desember) ${selectedYear}`;
    } else {
      return `Tahun ${selectedYear}`;
    }
  };

  const currentData = getCurrentData();
  const paginatedData = getPaginatedData(currentData);
  const totalPages = getTotalPages(currentData);
  const rowTotal = getRowTotal(currentData);
  const columnHeaders = getColumnHeaders();

  return (
    <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Call by Quantity</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getPeriodText()}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 dark:bg-[#2A3441] rounded-lg p-1 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('total')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'total'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Total
            </button>
            <button
              onClick={() => setActiveTab('car')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'car'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Car
            </button>
            <button
              onClick={() => setActiveTab('bike')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'bike'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              Bike
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Tahun:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#2A3441] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Periode:
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value) as 1 | 2)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#2A3441] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>Semester 1 (Jan - Jun)</option>
              <option value={2}>Semester 2 (Jul - Des)</option>
              <option value="all">Sepanjang Tahun</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Tampilkan:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#2A3441] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5 data</option>
              <option value={10}>10 data</option>
              <option value={50}>50 data</option>
              <option value={100}>100 data</option>
              <option value={currentData.length}>Semua</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container with vertical and horizontal scroll */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto thin-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-[#2A3441] sticky top-0 z-10">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-[#2A3441] z-30">
                    Location
                  </th>
                  {columnHeaders.map((header) => (
                    <th key={header.key} className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {header.label}
                    </th>
                  ))}
                  <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#222B36] divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedData.map((row, index) => (
                  <tr
                    key={row.location}
                    className={`hover:bg-gray-50 dark:hover:bg-[#2A3441] transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-[#222B36]' : 'bg-gray-50 dark:bg-[#2A3441]'
                      }`}
                  >
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-inherit">
                      {row.location}
                    </td>
                    {columnHeaders.map((header) => (
                      <td key={header.key} className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300">
                        {formatNumber(row[header.key as keyof CallData] as number)}
                      </td>
                    ))}
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                      {formatNumber(getFilteredColumns().reduce((sum, col) => sum + (row[col as keyof CallData] as number), 0))}
                    </td>
                  </tr>
                ))}

                {/* Total Row - sticky at bottom when scrolling */}
                <tr className="bg-gray-100 dark:bg-[#2A3441] border-t-2 border-gray-300 dark:border-gray-600 sticky bottom-0 z-10">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100 sticky left-0 bg-gray-100 dark:bg-[#2A3441] z-20">
                    TOTAL
                  </td>
                  {columnHeaders.map((header) => (
                    <td key={header.key} className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-gray-100">
                      {formatNumber(rowTotal[header.key] || 0)}
                    </td>
                  ))}
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40">
                    {formatNumber(rowTotal.total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, currentData.length)} of {currentData.length} results
          </div>

          <div className="flex items-center rounded-lg p-1 gap-1 bg-gray-100 dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700">
            {/* First Page Button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {(() => {
              const getVisiblePages = () => {
                const delta = 2;
                const range = [];
                const rangeWithDots = [];

                for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                  range.push(i);
                }

                if (currentPage - delta > 2) {
                  rangeWithDots.push(1, '...');
                } else {
                  rangeWithDots.push(1);
                }

                rangeWithDots.push(...range);

                if (currentPage + delta < totalPages - 1) {
                  rangeWithDots.push('...', totalPages);
                } else if (totalPages > 1) {
                  rangeWithDots.push(totalPages);
                }

                return rangeWithDots;
              };

              return getVisiblePages().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`w-8 h-8 flex items-center justify-center text-xs rounded border ${currentPage === page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-[#232B36] text-gray-500 dark:text-gray-300 border-transparent hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300'
                      } transition-colors`}
                  >
                    {page}
                  </button>
                );
              });
            })()}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center text-xs rounded border border-transparent text-gray-500 dark:text-gray-300 bg-white dark:bg-[#232B36] hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CallQuantityTable;