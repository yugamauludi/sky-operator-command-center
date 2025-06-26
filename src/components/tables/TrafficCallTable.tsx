import React, { useState } from 'react';
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface MonthlyData {
    qty: number;
    percentage: number;
}

interface VehicleData {
    traffic: MonthlyData;
    call: MonthlyData;
}

interface LocationData {
    location: string;
    region: string;
    car: {
        jan: VehicleData;
        feb: VehicleData;
        mar: VehicleData;
        apr: VehicleData;
        mei: VehicleData;
        juni: VehicleData;
        juli: VehicleData;
        agu: VehicleData;
        sept: VehicleData;
        okt: VehicleData;
        nov: VehicleData;
        des: VehicleData;
        total: VehicleData;
    };
    bike: {
        jan: VehicleData;
        feb: VehicleData;
        mar: VehicleData;
        apr: VehicleData;
        mei: VehicleData;
        juni: VehicleData;
        juli: VehicleData;
        agu: VehicleData;
        sept: VehicleData;
        okt: VehicleData;
        nov: VehicleData;
        des: VehicleData;
        total: VehicleData;
    };
}

type MonthKey =
    | 'jan' | 'feb' | 'mar' | 'apr' | 'mei' | 'juni'
    | 'juli' | 'agu' | 'sept' | 'okt' | 'nov' | 'des' | 'total';
// type MonthKey = typeof MONTH_KEYS[number];

const TrafficCallTable: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('semester1');
    const [selectedYear, setSelectedYear] = useState<string>('2025');
    const [selectedRegion, setSelectedRegion] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const periods = [
        { value: 'all', label: 'Sepanjang Tahun' },
        { value: 'semester1', label: 'Semester 1 (Jan-Jun)' },
        { value: 'semester2', label: 'Semester 2 (Jul-Des)' }
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

    // Generate sample data with regions
    const generateSampleData = (): LocationData[] => {
        const baseData = [
            {
                location: 'HPM LKU',
                region: 'Region 1',
                car: {
                    jan: { traffic: { qty: 1779, percentage: 2.4 }, call: { qty: 91, percentage: 0 } },
                    feb: { traffic: { qty: 363, percentage: 0 }, call: { qty: 67, percentage: 0 } },
                    mar: { traffic: { qty: 6453, percentage: 1.8 }, call: { qty: 115, percentage: 0 } },
                    apr: { traffic: { qty: 342, percentage: 1.9 }, call: { qty: 74, percentage: 0 } },
                    mei: { traffic: { qty: 565, percentage: 1.1 }, call: { qty: 83, percentage: 0 } },
                    juni: { traffic: { qty: 1, percentage: 1.3 }, call: { qty: 55, percentage: 0 } },
                    juli: { traffic: { qty: 1200, percentage: 1.5 }, call: { qty: 45, percentage: 0 } },
                    agu: { traffic: { qty: 890, percentage: 1.2 }, call: { qty: 38, percentage: 0 } },
                    sept: { traffic: { qty: 1450, percentage: 1.8 }, call: { qty: 62, percentage: 0 } },
                    okt: { traffic: { qty: 980, percentage: 1.4 }, call: { qty: 41, percentage: 0 } },
                    nov: { traffic: { qty: 1100, percentage: 1.6 }, call: { qty: 52, percentage: 0 } },
                    des: { traffic: { qty: 760, percentage: 1.1 }, call: { qty: 35, percentage: 0 } },

                    total: { traffic: { qty: 9503, percentage: 1.5 }, call: { qty: 485, percentage: 0 } }
                },
                bike: {
                    jan: { traffic: { qty: 523, percentage: 2.1 }, call: { qty: 8, percentage: 0 } },
                    feb: { traffic: { qty: 4316, percentage: 1.5 }, call: { qty: 67, percentage: 0 } },
                    mar: { traffic: { qty: 6172, percentage: 1.8 }, call: { qty: 115, percentage: 0 } },
                    apr: { traffic: { qty: 3883, percentage: 1.9 }, call: { qty: 74, percentage: 0 } },
                    mei: { traffic: { qty: 7770, percentage: 1.1 }, call: { qty: 83, percentage: 0 } },
                    juni: { traffic: { qty: 3476, percentage: 1.3 }, call: { qty: 55, percentage: 0 } },
                    juli: { traffic: { qty: 1200, percentage: 1.5 }, call: { qty: 45, percentage: 0 } },
                    agu: { traffic: { qty: 890, percentage: 1.2 }, call: { qty: 38, percentage: 0 } },
                    sept: { traffic: { qty: 1450, percentage: 1.8 }, call: { qty: 62, percentage: 0 } },
                    okt: { traffic: { qty: 980, percentage: 1.4 }, call: { qty: 41, percentage: 0 } },
                    nov: { traffic: { qty: 1100, percentage: 1.6 }, call: { qty: 52, percentage: 0 } },
                    des: { traffic: { qty: 760, percentage: 1.1 }, call: { qty: 35, percentage: 0 } },
                    total: { traffic: { qty: 26140, percentage: 1.5 }, call: { qty: 502, percentage: 0 } }
                }
            },
            {
                location: 'LMP',
                region: 'Region 2',
                car: {
                    jan: { traffic: { qty: 271879, percentage: 0.3 }, call: { qty: 840, percentage: 0 } },
                    feb: { traffic: { qty: 231129, percentage: 0.5 }, call: { qty: 1178, percentage: 0 } },
                    mar: { traffic: { qty: 278249, percentage: 0.6 }, call: { qty: 1721, percentage: 0 } },
                    apr: { traffic: { qty: 252020, percentage: 0.5 }, call: { qty: 1306, percentage: 0 } },
                    mei: { traffic: { qty: 263380, percentage: 0.4 }, call: { qty: 956, percentage: 0 } },
                    juni: { traffic: { qty: 99954, percentage: 0.4 }, call: { qty: 395, percentage: 0 } },
                    juli: { traffic: { qty: 1200, percentage: 1.5 }, call: { qty: 45, percentage: 0 } },
                    agu: { traffic: { qty: 890, percentage: 1.2 }, call: { qty: 38, percentage: 0 } },
                    sept: { traffic: { qty: 1450, percentage: 1.8 }, call: { qty: 62, percentage: 0 } },
                    okt: { traffic: { qty: 980, percentage: 1.4 }, call: { qty: 41, percentage: 0 } },
                    nov: { traffic: { qty: 1100, percentage: 1.6 }, call: { qty: 52, percentage: 0 } },
                    des: { traffic: { qty: 760, percentage: 1.1 }, call: { qty: 35, percentage: 0 } },
                    total: { traffic: { qty: 1397061, percentage: 0.5 }, call: { qty: 6396, percentage: 0 } }
                },
                bike: {
                    jan: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                    feb: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                    mar: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                    apr: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                    mei: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                    juni: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                    juli: { traffic: { qty: 1200, percentage: 1.5 }, call: { qty: 45, percentage: 0 } },
                    agu: { traffic: { qty: 890, percentage: 1.2 }, call: { qty: 38, percentage: 0 } },
                    sept: { traffic: { qty: 1450, percentage: 1.8 }, call: { qty: 62, percentage: 0 } },
                    okt: { traffic: { qty: 980, percentage: 1.4 }, call: { qty: 41, percentage: 0 } },
                    nov: { traffic: { qty: 1100, percentage: 1.6 }, call: { qty: 52, percentage: 0 } },
                    des: { traffic: { qty: 760, percentage: 1.1 }, call: { qty: 35, percentage: 0 } },
                    total: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } }
                }
            },
            {
                location: 'PV',
                region: 'Region 1',
                car: {
                    jan: { traffic: { qty: 127347, percentage: 0.3 }, call: { qty: 437, percentage: 0 } },
                    feb: { traffic: { qty: 135155, percentage: 0.7 }, call: { qty: 990, percentage: 0 } },
                    mar: { traffic: { qty: 116451, percentage: 0.9 }, call: { qty: 1056, percentage: 0 } },
                    apr: { traffic: { qty: 140845, percentage: 0.6 }, call: { qty: 785, percentage: 0 } },
                    mei: { traffic: { qty: 170391, percentage: 0.5 }, call: { qty: 796, percentage: 0 } },
                    juni: { traffic: { qty: 62131, percentage: 0.4 }, call: { qty: 241, percentage: 0 } },
                    juli: { traffic: { qty: 1200, percentage: 1.5 }, call: { qty: 45, percentage: 0 } },
                    agu: { traffic: { qty: 890, percentage: 1.2 }, call: { qty: 38, percentage: 0 } },
                    sept: { traffic: { qty: 1450, percentage: 1.8 }, call: { qty: 62, percentage: 0 } },
                    okt: { traffic: { qty: 980, percentage: 1.4 }, call: { qty: 41, percentage: 0 } },
                    nov: { traffic: { qty: 1100, percentage: 1.6 }, call: { qty: 52, percentage: 0 } },
                    des: { traffic: { qty: 760, percentage: 1.1 }, call: { qty: 35, percentage: 0 } },
                    total: { traffic: { qty: 752320, percentage: 0.6 }, call: { qty: 4305, percentage: 0 } }
                },
                bike: {
                    jan: { traffic: { qty: 6456, percentage: 1.5 }, call: { qty: 99, percentage: 0 } },
                    feb: { traffic: { qty: 17556, percentage: 1.8 }, call: { qty: 326, percentage: 0 } },
                    mar: { traffic: { qty: 22671, percentage: 1.6 }, call: { qty: 349, percentage: 0 } },
                    apr: { traffic: { qty: 21298, percentage: 1.6 }, call: { qty: 352, percentage: 0 } },
                    mei: { traffic: { qty: 27051, percentage: 1.2 }, call: { qty: 316, percentage: 0 } },
                    juni: { traffic: { qty: 9783, percentage: 1.3 }, call: { qty: 133, percentage: 0 } },
                    juli: { traffic: { qty: 1200, percentage: 1.5 }, call: { qty: 45, percentage: 0 } },
                    agu: { traffic: { qty: 890, percentage: 1.2 }, call: { qty: 38, percentage: 0 } },
                    sept: { traffic: { qty: 1450, percentage: 1.8 }, call: { qty: 62, percentage: 0 } },
                    okt: { traffic: { qty: 980, percentage: 1.4 }, call: { qty: 41, percentage: 0 } },
                    nov: { traffic: { qty: 1100, percentage: 1.6 }, call: { qty: 52, percentage: 0 } },
                    des: { traffic: { qty: 760, percentage: 1.1 }, call: { qty: 35, percentage: 0 } },
                    total: { traffic: { qty: 104815, percentage: 1.5 }, call: { qty: 1575, percentage: 0 } }
                }
            }
        ];

        // Generate additional sample locations for demonstration
        const additionalLocations: LocationData[] = [];
        const locationTypes = ['Mall A', 'Mall B', 'Plaza X', 'Plaza Y', 'Supermarket'];
        const regionsList = ['Region 1', 'Region 2', 'Region 3', 'Region 4'];

        for (let i = 0; i < 20; i++) {
            const locationType = locationTypes[i % locationTypes.length];
            const locationNumber = Math.floor(i / locationTypes.length) + 1;
            const region = regionsList[i % regionsList.length];

            const generateRandomData = (): VehicleData => ({
                traffic: { qty: Math.floor(Math.random() * 50000), percentage: Math.random() * 3 },
                call: { qty: Math.floor(Math.random() * 500), percentage: 0 }
            });

            const carData = {
                jan: generateRandomData(),
                feb: generateRandomData(),
                mar: generateRandomData(),
                apr: generateRandomData(),
                mei: generateRandomData(),
                juni: generateRandomData(),
                juli: generateRandomData(),
                agu: generateRandomData(),
                sept: generateRandomData(),
                okt: generateRandomData(),
                nov: generateRandomData(),
                des: generateRandomData(),
                total: generateRandomData()
            };

            const bikeData = {
                jan: generateRandomData(),
                feb: generateRandomData(),
                mar: generateRandomData(),
                apr: generateRandomData(),
                mei: generateRandomData(),
                juni: generateRandomData(),
                juli: generateRandomData(),
                agu: generateRandomData(),
                sept: generateRandomData(),
                okt: generateRandomData(),
                nov: generateRandomData(),
                des: generateRandomData(),
                total: generateRandomData()
            };

            additionalLocations.push({
                location: `${locationType} ${locationNumber}`,
                region: region,
                car: carData,
                bike: bikeData
            });
        }

        return [...baseData, ...additionalLocations];
    };

    const getMonthsForPeriod = (period: string) => {
        if (period === 'semester1') {
            return ['jan', 'feb', 'mar', 'apr', 'mei', 'juni'];
        } else if (period === 'semester2') {
            return ['juli', 'agu', 'sept', 'okt', 'nov', 'des'];
        } else {
            return ['jan', 'feb', 'mar', 'apr', 'mei', 'juni', 'juli', 'agu', 'sept', 'okt', 'nov', 'des'];
        }
    };

    const getMonthLabels = (period: string) => {
        if (period === 'semester1') {
            return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Juni'];
        } else if (period === 'semester2') {
            return ['Juli', 'Agu', 'Sept', 'Okt', 'Nov', 'Des'];
        } else {
            return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Juni', 'Juli', 'Agu', 'Sept', 'Okt', 'Nov', 'Des'];
        }
    };


    const allData = generateSampleData();

    const getCurrentData = (): LocationData[] => {
        // Filter by region if not 'all'
        if (selectedRegion === 'all') {
            return allData;
        }
        return allData.filter(location => location.region === selectedRegion);
    };

    const filteredData = getCurrentData();

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    const formatPercentage = (percent: number): string => {
        return `${percent.toFixed(1)}%`;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
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
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Traffic VS Call</h3>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Periode:</label>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => {
                                setSelectedPeriod(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            {periods.map((period) => (
                                <option key={period.value} value={period.value}>{period.label}</option>
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
                    Showing data for: <span className="font-semibold text-gray-900 dark:text-white">
                        {periods.find(p => p.value === selectedPeriod)?.label} {selectedYear}
                    </span> |
                    Region: <span className="font-semibold text-gray-900 dark:text-white">
                        {regions.find(r => r.value === selectedRegion)?.label}
                    </span>
                </p>
            </div>

            <div className="w-full overflow-x-auto thin-scrollbar">
                <div className="max-h-[600px] overflow-y-auto thin-scrollbar border border-gray-300 dark:border-gray-600 rounded-lg">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-40">
                            <tr>
                                <th rowSpan={2} className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-left font-medium text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 sticky left-0 z-50 min-w-[140px]">
                                    Location
                                </th>
                                <th rowSpan={2} className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center font-medium text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 sticky left-[140px] z-50 min-w-[80px]">
                                    Vehicle
                                </th>
                                <th rowSpan={2} className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center font-medium text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 sticky left-[220px] z-50 min-w-[100px]">
                                    Traffic & Call
                                </th>
                                {getMonthsForPeriod(selectedPeriod).concat(['total']).map((month, idx) => (
                                    <th key={month} colSpan={2} className="border border-gray-400 dark:border-gray-600 px-4 py-2 text-center font-medium text-sm text-gray-900 dark:text-white bg-blue-100 dark:bg-blue-700 min-w-[120px]">
                                        {getMonthLabels(selectedPeriod).concat(['Total'])[idx]}
                                    </th>
                                ))}
                            </tr>
                            <tr>
                                {getMonthsForPeriod(selectedPeriod).concat(['total']).map((_, idx) => (
                                    <React.Fragment key={idx}>
                                        <th className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-medium text-xs text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 min-w-[60px]">
                                            Qty
                                        </th>
                                        <th className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-center font-medium text-xs text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 min-w-[60px]">
                                            %
                                        </th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((location) => (
                                <React.Fragment key={location.location}>
                                    {/* Car rows */}
                                    <tr className={`${getLocationRowClassName(location.location)} transition-colors duration-150`}>
                                        <td rowSpan={4} className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-900 dark:text-white align-top sticky left-0 z-20 bg-white dark:bg-gray-800 min-w-[140px]">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{location.location}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{location.region}</span>
                                            </div>
                                        </td>

                                        <td rowSpan={2} className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center text-sm text-gray-900 dark:text-white align-middle bg-blue-100 dark:bg-blue-700 sticky left-[140px] z-20 min-w-[80px]">
                                            Car
                                        </td>

                                        <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 sticky left-[220px] z-20 min-w-[100px]">
                                            Traffic
                                        </td>
                                        {getMonthsForPeriod(selectedPeriod).concat(['total']).map((month) => {
                                            const data = location.car[month as MonthKey];
                                            return (
                                                <React.Fragment key={`car-traffic-${month}`}>
                                                    <td className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-right text-sm text-gray-900 dark:text-gray-100 min-w-[60px]">
                                                        {data?.traffic.qty === 0 ? '-' : formatNumber(data?.traffic.qty ?? 0)}
                                                    </td>
                                                    <td className="border border-gray-400 dark:border-gray-600 px-3 py-2 text-right text-sm text-gray-900 dark:text-gray-100 min-w-[60px]">
                                                        {data?.traffic.percentage === 0 ? '0.0%' : formatPercentage(data?.traffic.percentage ?? 0)}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                    <tr className={`${getLocationRowClassName(location.location)} transition-colors duration-150`}>
                                        <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 sticky left-[220px] z-20 min-w-[100px]">
                                            Call
                                        </td>
                                        {getMonthsForPeriod(selectedPeriod).concat(['total']).map((month) => {
                                            const data = location.car[month as MonthKey];
                                            return (
                                                <React.Fragment key={`car-call-${month}`}>
                                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                                                        {data?.call.qty === 0 ? '-' : formatNumber(data?.call.qty ?? 0)}
                                                    </td>
                                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                                                        {data?.call.percentage === 0 ? '0.0%' : formatPercentage(data?.call.percentage ?? 0)}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>

                                    {/* Bike rows */}
                                    <tr className={`${getLocationRowClassName(location.location)} transition-colors duration-150`}>
                                        <td rowSpan={2} className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-center text-sm text-gray-900 dark:text-white align-middle bg-blue-100 dark:bg-blue-700 sticky left-[140px] z-20 min-w-[80px]">
                                            Bike
                                        </td>
                                        <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 sticky left-[220px] z-20 min-w-[100px]">
                                            Traffic
                                        </td>
                                        {getMonthsForPeriod(selectedPeriod).concat(['total']).map((month) => {
                                            const data = location.bike[month as MonthKey];
                                            return (
                                                <React.Fragment key={`bike-traffic-${month}`}>
                                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                                                        {data?.traffic.qty === 0 ? '-' : formatNumber(data?.traffic.qty ?? 0)}
                                                    </td>
                                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                                                        {data?.traffic.percentage === 0 ? '0.0%' : formatPercentage(data?.traffic.percentage ?? 0)}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                    <tr className={`${getLocationRowClassName(location.location)} transition-colors duration-150`}>
                                        <td className="border border-gray-400 dark:border-gray-600 px-2 py-2 text-sm text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-600 sticky left-[220px] z-20 min-w-[100px]">
                                            Call
                                        </td>
                                        {getMonthsForPeriod(selectedPeriod).concat(['total']).map((month) => {
                                            const data = location.bike[month as MonthKey];
                                            return (
                                                <React.Fragment key={`bike-call-${month}`}>
                                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                                                        {data?.call.qty === 0 ? '-' : formatNumber(data?.call.qty ?? 0)}
                                                    </td>
                                                    <td className="border border-gray-400 dark:border-gray-600 px-2 py-1 text-right text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20">
                                                        {data?.call.percentage === 0 ? '0.0%' : formatPercentage(data?.call.percentage ?? 0)}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} locations
                </div>

                {/* Pagination Controls */}
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

export default TrafficCallTable;