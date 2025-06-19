import React, { useState } from 'react';

interface CallData {
  location: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  mei: number;
  juni: number;
  total: number;
}

const CallQuantityTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'car' | 'bike' | 'total'>('total');

  const carData: CallData[] = [
    { location: 'HPM LKU', jan: 179, feb: 363, mar: 483, apr: 342, mei: 266, juni: 94, total: 1727 },
    { location: 'LMP', jan: 840, feb: 1178, mar: 1721, apr: 1306, mei: 956, juni: 395, total: 6396 },
    { location: 'PV', jan: 437, feb: 990, mar: 1056, apr: 785, mei: 796, juni: 241, total: 4305 },
    { location: 'SPARK', jan: 0, feb: 0, mar: 235, apr: 247, mei: 78, juni: 0, total: 560 },
    { location: 'PICON', jan: 0, feb: 0, mar: 0, apr: 67, mei: 278, juni: 117, total: 462 },
    { location: 'MLC', jan: 0, feb: 0, mar: 0, apr: 0, mei: 353, juni: 0, total: 353 },
    { location: 'LMN', jan: 0, feb: 0, mar: 0, apr: 0, mei: 47, juni: 72, total: 119 },
    { location: 'SHLV', jan: 295, feb: 343, mar: 312, apr: 386, mei: 309, juni: 115, total: 1760 },
    { location: 'SHKJ', jan: 31, feb: 246, mar: 310, apr: 217, mei: 246, juni: 100, total: 1150 },
    { location: 'SHKD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 5, total: 5 },
    { location: 'UPH', jan: 188, feb: 289, mar: 198, apr: 216, mei: 210, juni: 104, total: 1205 },
    { location: 'HELIPAD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 2, juni: 7, total: 9 },
  ];

  const bikeData: CallData[] = [
    { location: 'HPM LKU', jan: 11, feb: 67, mar: 115, apr: 74, mei: 83, juni: 45, total: 395 },
    { location: 'LMP', jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
    { location: 'PV', jan: 99, feb: 326, mar: 349, apr: 352, mei: 316, juni: 133, total: 1575 },
    { location: 'SPARK', jan: 0, feb: 0, mar: 0, apr: 46, mei: 55, juni: 18, total: 119 },
    { location: 'PICON', jan: 0, feb: 0, mar: 0, apr: 12, mei: 33, juni: 0, total: 45 },
    { location: 'MLC', jan: 0, feb: 0, mar: 0, apr: 0, mei: 174, juni: 0, total: 174 },
    { location: 'LMN', jan: 0, feb: 0, mar: 0, apr: 0, mei: 5, juni: 1, total: 6 },
    { location: 'SHLV', jan: 265, feb: 375, mar: 392, apr: 285, mei: 222, juni: 85, total: 1624 },
    { location: 'SHKJ', jan: 28, feb: 115, mar: 157, apr: 139, mei: 189, juni: 71, total: 699 },
    { location: 'SHKD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
    { location: 'UPH', jan: 119, feb: 271, mar: 271, apr: 221, mei: 123, juni: 71, total: 1076 },
    { location: 'HELIPAD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 16, juni: 30, total: 46 },
  ];

  const totalData: CallData[] = [
    { location: 'HPM LKU', jan: 190, feb: 430, mar: 598, apr: 416, mei: 349, juni: 139, total: 2122 },
    { location: 'LMP', jan: 840, feb: 1178, mar: 1721, apr: 1306, mei: 956, juni: 395, total: 6396 },
    { location: 'PV', jan: 536, feb: 1316, mar: 1405, apr: 1137, mei: 1112, juni: 374, total: 5880 },
    { location: 'SPARK', jan: 0, feb: 0, mar: 0, apr: 281, mei: 302, juni: 96, total: 679 },
    { location: 'PICON', jan: 0, feb: 0, mar: 0, apr: 79, mei: 311, juni: 117, total: 507 },
    { location: 'MLC', jan: 0, feb: 0, mar: 0, apr: 0, mei: 527, juni: 0, total: 527 },
    { location: 'LMN', jan: 0, feb: 0, mar: 0, apr: 0, mei: 52, juni: 73, total: 125 },
    { location: 'SHLV', jan: 560, feb: 718, mar: 704, apr: 671, mei: 531, juni: 200, total: 3384 },
    { location: 'SHKJ', jan: 59, feb: 361, mar: 467, apr: 356, mei: 435, juni: 171, total: 1849 },
    { location: 'SHKD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 5, total: 5 },
    { location: 'UPH', jan: 307, feb: 560, mar: 469, apr: 437, mei: 333, juni: 175, total: 2281 },
    { location: 'HELIPAD', jan: 0, feb: 0, mar: 0, apr: 0, mei: 18, juni: 37, total: 55 },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'car': return carData;
      case 'bike': return bikeData;
      case 'total': return totalData;
      default: return totalData;
    }
  };

  const formatNumber = (num: number) => {
    return num === 0 ? '-' : num.toLocaleString('id-ID');
  };

  const getRowTotal = (data: CallData[]) => {
    return data.reduce((acc, curr) => ({
      jan: acc.jan + curr.jan,
      feb: acc.feb + curr.feb,
      mar: acc.mar + curr.mar,
      apr: acc.apr + curr.apr,
      mei: acc.mei + curr.mei,
      juni: acc.juni + curr.juni,
      total: acc.total + curr.total
    }), { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 });
  };

  const currentData = getCurrentData();
  const rowTotal = getRowTotal(currentData);

  return (
    <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">Call by Quantity</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Periode Januari - Juni 2025
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 dark:bg-[#2A3441] rounded-lg p-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('total')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'total' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Total
          </button>
          <button
            onClick={() => setActiveTab('car')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'car' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Car
          </button>
          <button
            onClick={() => setActiveTab('bike')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'bike' 
                ? 'bg-blue-500 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Bike
          </button>
        </div>
      </div>

      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-full inline-block align-middle px-4 md:px-0">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-[#2A3441]">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-[#2A3441] z-10">
                  Location
                </th>
                <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jan
                </th>
                <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Feb
                </th>
                <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mar
                </th>
                <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Apr
                </th>
                <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mei
                </th>
                <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Juni
                </th>
                <th className="px-3 md:px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#222B36] divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((row, index) => (
                <tr 
                  key={row.location}
                  className={`hover:bg-gray-50 dark:hover:bg-[#2A3441] transition-colors ${
                    index % 2 === 0 ? 'bg-white dark:bg-[#222B36]' : 'bg-gray-50/50 dark:bg-[#2A3441]/50'
                  }`}
                >
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 sticky left-0 bg-inherit z-10">
                    {row.location}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300">
                    {formatNumber(row.jan)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300">
                    {formatNumber(row.feb)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300">
                    {formatNumber(row.mar)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300">
                    {formatNumber(row.apr)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300">
                    {formatNumber(row.mei)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 dark:text-gray-300">
                    {formatNumber(row.juni)}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                    {formatNumber(row.total)}
                  </td>
                </tr>
              ))}
              
              {/* Total Row */}
              <tr className="bg-gray-100 dark:bg-[#2A3441] border-t-2 border-gray-300 dark:border-gray-600">
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100 sticky left-0 bg-gray-100 dark:bg-[#2A3441] z-10">
                  TOTAL
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(rowTotal.jan)}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(rowTotal.feb)}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(rowTotal.mar)}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(rowTotal.apr)}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(rowTotal.mei)}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-900 dark:text-gray-100">
                  {formatNumber(rowTotal.juni)}
                </td>
                <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40">
                  {formatNumber(rowTotal.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Summary Cards */}
      <div className="mt-6 grid grid-cols-2 md:hidden gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Panggilan</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatNumber(rowTotal.total)}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bulan Tertinggi</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {Math.max(rowTotal.jan, rowTotal.feb, rowTotal.mar, rowTotal.apr, rowTotal.mei, rowTotal.juni) === rowTotal.jan ? 'Jan' :
             Math.max(rowTotal.jan, rowTotal.feb, rowTotal.mar, rowTotal.apr, rowTotal.mei, rowTotal.juni) === rowTotal.feb ? 'Feb' :
             Math.max(rowTotal.jan, rowTotal.feb, rowTotal.mar, rowTotal.apr, rowTotal.mei, rowTotal.juni) === rowTotal.mar ? 'Mar' :
             Math.max(rowTotal.jan, rowTotal.feb, rowTotal.mar, rowTotal.apr, rowTotal.mei, rowTotal.juni) === rowTotal.apr ? 'Apr' :
             Math.max(rowTotal.jan, rowTotal.feb, rowTotal.mar, rowTotal.apr, rowTotal.mei, rowTotal.juni) === rowTotal.mei ? 'Mei' : 'Juni'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallQuantityTable;