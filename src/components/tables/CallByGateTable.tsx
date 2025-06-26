import React, { useState } from 'react';
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface GateData {
    humanError: number;
    customerBehaviour: number;
    assetSystem: number;
}

interface LocationData {
    car: GateData;
    bike: GateData;
}

interface LocationRowData {
    location: string;
    region: string;
    data: LocationData;
}

interface MonthlyLocationData {
    [key: string]: LocationRowData[];
}

interface YearlyData {
    [year: string]: MonthlyLocationData;
}

const CallByGateTable: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>('january');
    const [selectedYear, setSelectedYear] = useState<string>('2024');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const months = [
        { value: 'january', label: 'January' },
        { value: 'february', label: 'February' },
        { value: 'march', label: 'March' },
        { value: 'april', label: 'April' },
        { value: 'may', label: 'May' },
        { value: 'june', label: 'June' },
        { value: 'july', label: 'July' },
        { value: 'august', label: 'August' },
        { value: 'september', label: 'September' },
        { value: 'october', label: 'October' },
        { value: 'november', label: 'November' },
        { value: 'december', label: 'December' }
    ];

    const years = ['2022', '2023', '2024', '2025'];
    const regions = [
        { value: 'all', label: 'All Regions' },
        { value: 'Region 1', label: 'Region 1' },
        { value: 'Region 2', label: 'Region 2' },
        { value: 'Region 3', label: 'Region 3' },
        { value: 'Region 4', label: 'Region 4' }
    ];

    const viewSets = [5, 10, 20, 50, 100];

    // Generate sample locations (this would be hundreds in real scenario)
    const generateLocations = (): LocationRowData[] => {
        const locations = [];
        const locationTypes = ['HPM LKU', 'LMP', 'PV', 'Mall A', 'Mall B', 'Mall C', 'Plaza X', 'Plaza Y', 'Supermarket 1', 'Supermarket 2'];
        const regionsList = ['Region 1', 'Region 2', 'Region 3', 'Region 4'];

        // Generate sample data for demonstration
        for (let i = 0; i < 100; i++) {
            const locationType = locationTypes[i % locationTypes.length];
            const locationNumber = Math.floor(i / locationTypes.length) + 1;
            const region = regionsList[i % regionsList.length];

            locations.push({
                location: `${locationType} ${locationNumber}`,
                region: region,
                data: {
                    car: {
                        humanError: Math.floor(Math.random() * 50),
                        customerBehaviour: Math.floor(Math.random() * 20),
                        assetSystem: Math.floor(Math.random() * 15)
                    },
                    bike: {
                        humanError: Math.floor(Math.random() * 30),
                        customerBehaviour: Math.floor(Math.random() * 10),
                        assetSystem: Math.floor(Math.random() * 10)
                    }
                }
            });
        }

        // Add totals
        // locations.push({
        //     location: 'TOTAL',
        //     region: 'all',
        //     data: {
        //         car: {
        //             humanError: Math.floor(Math.random() * 500),
        //             customerBehaviour: Math.floor(Math.random() * 200),
        //             assetSystem: Math.floor(Math.random() * 150)
        //         },
        //         bike: {
        //             humanError: Math.floor(Math.random() * 300),
        //             customerBehaviour: Math.floor(Math.random() * 100),
        //             assetSystem: Math.floor(Math.random() * 100)
        //         }
        //     }
        // });

        return locations;
    };

    // Sample yearly data structure
    const yearlyData: YearlyData = {
        '2024': {
            january: generateLocations()
        },
        '2023': {
            january: generateLocations()
        },
        '2022': {
            january: generateLocations()
        },
        '2025': {
            january: generateLocations()
        }
    };

    // Generate gate names (fixed columns)
    const generateGateNames = (): string[] => {
        const gates = [];
        // Pintu Masuk 1-16
        for (let i = 1; i <= 16; i++) {
            gates.push(`Pintu Masuk ${i}`);
        }
        gates.push('Total PM');

        // Pintu Keluar 1-17
        for (let i = 1; i <= 17; i++) {
            gates.push(`Pintu Keluar ${i}`);
        }
        gates.push('Total PK');
        gates.push('TOTAL');

        return gates;
    };

    const getCurrentData = (): LocationRowData[] => {
        const currentYearData = yearlyData[selectedYear];
        if (!currentYearData) return [];
        const monthData = currentYearData[selectedMonth] || [];

        // Filter by region if not 'all'
        if (selectedRegion === 'all') {
            return monthData;
        }
        return monthData.filter(location => location.region === selectedRegion || location.location === 'TOTAL');
    };

    const gateNames = generateGateNames();
    const allLocations = getCurrentData();

    // Pagination logic for locations
    const totalPages = Math.ceil(allLocations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLocations = allLocations.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    // Get cell value for gate data (random for demo)
    const getCellValue = (location: LocationRowData, gateName: string, vehicleType: 'car' | 'bike', errorType: keyof GateData): number => {
        // In real implementation, this would fetch actual gate-specific data
        // For demo, we'll use the location data with some variation based on gate
        const baseValue = location.data[vehicleType][errorType];
        const gateMultiplier = gateName.includes('Total') || gateName === 'TOTAL' ? 5 : Math.random() * 2;
        return Math.floor(baseValue * gateMultiplier);
    };

    const getHeaderClassName = (gateName: string): string => {
        if (gateName === 'TOTAL') {
            return 'bg-red-600 dark:bg-red-700 text-white font-bold';
        }
        if (gateName.includes('Total')) {
            return 'bg-orange-500 dark:bg-orange-600 text-white font-bold';
        }
        if (gateName.includes('Pintu Masuk')) {
            return 'bg-green-500 dark:bg-green-600 text-white';
        }
        if (gateName.includes('Pintu Keluar')) {
            return 'bg-blue-500 dark:bg-blue-600 text-white';
        }
        return 'bg-gray-500 dark:bg-gray-600 text-white';
    };

    const getLocationRowClassName = (location: string): string => {
        if (location === 'TOTAL') {
            return 'bg-orange-100 dark:bg-orange-900/30 font-bold';
        }
        return 'hover:bg-gray-50 dark:hover:bg-gray-700';
    };

    return (
        <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
            <div className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Call by Gate</h3>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Month:</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Year:</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => {
                                setSelectedYear(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Region:</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => {
                                setSelectedRegion(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {regions.map((region) => (
                                <option key={region.value} value={region.value}>{region.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Items per page:</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {viewSets.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Showing data for: <span className="font-semibold text-gray-900 dark:text-white">{selectedMonth} {selectedYear}</span> |
                    Region: <span className="font-semibold text-gray-900 dark:text-white">{regions.find(r => r.value === selectedRegion)?.label}</span>
                </p>
            </div>

            <div className="w-full overflow-x-auto thin-scrollbar">
                <div className="max-h-[600px] overflow-y-auto"> {/* Tambahkan wrapper ini */}
                    <table className="w-full border-collapse border border-gray-400 dark:border-gray-600 text-xs">
                        <thead className="sticky top-0 z-30 bg-white dark:bg-gray-800">
                            {/* Gates header row */}
                            <tr>
                                <th
                                    rowSpan={3}
                                    className="sticky left-0 z-20 border border-gray-400 dark:border-gray-600 bg-gray-800 dark:bg-gray-900 text-white p-2 min-w-[120px] font-bold"
                                >
                                    LOCATION
                                </th>
                                {gateNames.map((gateName) => (
                                    <th
                                        key={gateName}
                                        colSpan={6}
                                        className={`border border-gray-400 dark:border-gray-600 ${getHeaderClassName(gateName)} p-1 text-center font-semibold min-w-[180px]`}
                                    >
                                        {gateName}
                                    </th>
                                ))}
                            </tr>

                            {/* Vehicle type header row */}
                            <tr>
                                {gateNames.map((gateName) => (
                                    <React.Fragment key={gateName}>
                                        <th colSpan={3} className="border border-gray-400 dark:border-gray-600 bg-blue-200 dark:bg-blue-700 text-gray-900 dark:text-white p-1 text-center font-medium">
                                            CAR
                                        </th>
                                        <th colSpan={3} className="border border-gray-400 dark:border-gray-600 bg-green-200 dark:bg-green-700 text-gray-900 dark:text-white p-1 text-center font-medium">
                                            BIKE
                                        </th>
                                    </React.Fragment>
                                ))}
                            </tr>

                            {/* Error types header row */}
                            <tr>
                                {gateNames.map((gateName) => (
                                    <React.Fragment key={gateName}>
                                        {/* Car error types */}
                                        <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                            Human Error
                                        </th>
                                        <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                            Customer Behaviour
                                        </th>
                                        <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                            Asset / System
                                        </th>
                                        {/* Bike error types */}
                                        <th className="border border-gray-400 dark:border-gray-600 bg-green-100 dark:bg-green-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                            Human Error
                                        </th>
                                        <th className="border border-gray-400 dark:border-gray-600 bg-green-100 dark:bg-green-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                            Customer Behaviour
                                        </th>
                                        <th className="border border-gray-400 dark:border-gray-600 bg-green-100 dark:bg-green-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                            Asset / System
                                        </th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLocations.map((location) => (
                                <tr
                                    key={location.location}
                                    className={`${getLocationRowClassName(location.location)} transition-colors duration-150`}
                                >
                                    <td className={`sticky left-0 z-10 border border-gray-400 dark:border-gray-600 bg-gray-700 dark:bg-gray-800 text-white p-2 font-medium`}>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{location.location}</span>
                                            {/* {location.region !== 'all' && (
                                                <span className="text-xs text-gray-300 capitalize">{location.region}</span>
                                            )} */}
                                        </div>
                                    </td>

                                    {gateNames.map((gateName) => (
                                        <React.Fragment key={`${location.location}-${gateName}`}>
                                            {/* Car data */}
                                            <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100">
                                                {getCellValue(location, gateName, 'car', 'humanError') || '-'}
                                            </td>
                                            <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100">
                                                {getCellValue(location, gateName, 'car', 'customerBehaviour') || '-'}
                                            </td>
                                            <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100">
                                                {getCellValue(location, gateName, 'car', 'assetSystem') || '-'}
                                            </td>
                                            {/* Bike data */}
                                            <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100">
                                                {getCellValue(location, gateName, 'bike', 'humanError') || '-'}
                                            </td>
                                            <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100">
                                                {getCellValue(location, gateName, 'bike', 'customerBehaviour') || '-'}
                                            </td>
                                            <td className="border border-gray-400 dark:border-gray-600 p-1 text-center bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-gray-100">
                                                {getCellValue(location, gateName, 'bike', 'assetSystem') || '-'}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {startIndex + 1} to {Math.min(endIndex, allLocations.length)} of {allLocations.length} locations
                </div>

                {/* Location Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center bg-gray-100 dark:bg-[#2A3441] border border-gray-300 dark:border-gray-700 rounded-lg p-1 gap-1">
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
                )}
            </div>
        </div>
    );
};

export default CallByGateTable;