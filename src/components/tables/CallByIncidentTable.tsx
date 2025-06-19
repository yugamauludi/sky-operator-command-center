import React, { useState } from 'react';

interface MonthlyIncidentData {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    mei: number;
    juni: number;
    total: number;
}

interface CategoryData {
    trafficHumanError: MonthlyIncidentData;
    trafficSystem: MonthlyIncidentData;
    customerBehaviour: MonthlyIncidentData;
    assetSystem: MonthlyIncidentData;
}

interface LocationIncidentData {
    location: string;
    car: CategoryData;
    bike: CategoryData;
    total: CategoryData;
}

type MonthKey = 'jan' | 'feb' | 'mar' | 'apr' | 'mei' | 'juni' | 'total';

const CallByIncidentTable: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<MonthKey>('jan');

    const monthOptions = [
        { value: 'jan', label: 'Januari' },
        { value: 'feb', label: 'Februari' },
        { value: 'mar', label: 'Maret' },
        { value: 'apr', label: 'April' },
        { value: 'mei', label: 'Mei' },
        { value: 'juni', label: 'Juni' },
        { value: 'total', label: 'Total' }
    ];

    // Sample data based on the image
    const data: LocationIncidentData[] = [
        {
            location: 'HPM LKU',
            car: {
                trafficHumanError: { jan: 16113, feb: 5140, mar: 22492, apr: 15076, mei: 28203, juni: 12222, total: 99246 },
                trafficSystem: { jan: 133, feb: 23, mar: 300, apr: 312, mei: 533, juni: 25, total: 1326 },
                customerBehaviour: { jan: 35, feb: 55, mar: 125, apr: 115, mei: 91, juni: 50, total: 471 },
                assetSystem: { jan: 0, feb: 0, mar: 56, apr: 36, mei: 8, juni: 0, total: 100 }
            },
            bike: {
                trafficHumanError: { jan: 1327, feb: 1896, mar: 1835, apr: 1606, mei: 3221, juni: 1306, total: 11191 },
                trafficSystem: { jan: 4, feb: 0, mar: 53, apr: 43, mei: 50, juni: 0, total: 150 },
                customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
            },
            total: {
                trafficHumanError: { jan: 17440, feb: 7036, mar: 24327, apr: 16682, mei: 31424, juni: 13528, total: 110437 },
                trafficSystem: { jan: 137, feb: 23, mar: 353, apr: 355, mei: 583, juni: 25, total: 1476 },
                customerBehaviour: { jan: 35, feb: 55, mar: 125, apr: 115, mei: 91, juni: 50, total: 471 },
                assetSystem: { jan: 0, feb: 0, mar: 56, apr: 36, mei: 8, juni: 0, total: 100 }
            }
        }
    ];

    // Sample data for other locations
    const locations = [
        { name: 'HPM LKU', data: data[0] },
        {
            name: 'LMP',
            data: {
                location: 'LMP',
                car: {
                    trafficHumanError: { jan: 271073, feb: 231193, mar: 278248, apr: 252020, mei: 263330, juni: 99954, total: 1395818 },
                    trafficSystem: { jan: 404, feb: 605, mar: 370, apr: 435, mei: 330, juni: 115, total: 2259 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 163, feb: 138, mar: 363, apr: 420, mei: 235, juni: 30, total: 1349 }
                },
                bike: {
                    trafficHumanError: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    trafficSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                },
                total: {
                    trafficHumanError: { jan: 271073, feb: 231193, mar: 278248, apr: 252020, mei: 263330, juni: 99954, total: 1395818 },
                    trafficSystem: { jan: 404, feb: 605, mar: 370, apr: 435, mei: 330, juni: 115, total: 2259 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 163, feb: 138, mar: 363, apr: 420, mei: 235, juni: 30, total: 1349 }
                }
            }
        },
        {
            name: 'PV',
            data: {
                location: 'PV',
                car: {
                    trafficHumanError: { jan: 127347, feb: 135155, mar: 116451, apr: 140845, mei: 170391, juni: 62131, total: 752320 },
                    trafficSystem: { jan: 272, feb: 582, mar: 625, apr: 582, mei: 374, juni: 146, total: 2581 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                },
                bike: {
                    trafficHumanError: { jan: 6456, feb: 17556, mar: 22671, apr: 21298, mei: 27051, juni: 9783, total: 104815 },
                    trafficSystem: { jan: 72, feb: 140, mar: 164, apr: 223, mei: 211, juni: 105, total: 915 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                },
                total: {
                    trafficHumanError: { jan: 133803, feb: 152711, mar: 139122, apr: 162143, mei: 197442, juni: 71914, total: 857135 },
                    trafficSystem: { jan: 344, feb: 722, mar: 789, apr: 805, mei: 585, juni: 251, total: 3496 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                }
            }
        },
        {
            name: 'SPARK',
            data: {
                location: 'SPARK',
                car: {
                    trafficHumanError: { jan: 0, feb: 0, mar: 0, apr: 50533, mei: 57434, juni: 20616, total: 128583 },
                    trafficSystem: { jan: 0, feb: 0, mar: 0, apr: 62, mei: 72, juni: 8, total: 142 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                },
                bike: {
                    trafficHumanError: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    trafficSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                },
                total: {
                    trafficHumanError: { jan: 0, feb: 0, mar: 0, apr: 50533, mei: 57434, juni: 20616, total: 128583 },
                    trafficSystem: { jan: 0, feb: 0, mar: 0, apr: 62, mei: 72, juni: 8, total: 142 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                }
            }
        },
        {
            name: 'PICON',
            data: {
                location: 'PICON',
                car: {
                    trafficHumanError: { jan: 0, feb: 0, mar: 0, apr: 11162, mei: 82742, juni: 8, total: 93912 },
                    trafficSystem: { jan: 0, feb: 0, mar: 0, apr: 42, mei: 52, juni: 0, total: 94 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                },
                bike: {
                    trafficHumanError: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    trafficSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                },
                total: {
                    trafficHumanError: { jan: 0, feb: 0, mar: 0, apr: 11162, mei: 82742, juni: 8, total: 93912 },
                    trafficSystem: { jan: 0, feb: 0, mar: 0, apr: 42, mei: 52, juni: 0, total: 94 },
                    customerBehaviour: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 },
                    assetSystem: { jan: 0, feb: 0, mar: 0, apr: 0, mei: 0, juni: 0, total: 0 }
                }
            }
        }
    ];

    const formatNumber = (num: number): string => {
        return num === 0 ? '-' : num.toLocaleString();
    };

    const renderCategoryRow = (categoryName: string, categoryType: keyof CategoryData) => (
        <tr key={categoryName} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-2 py-1 text-sm">
                {categoryName}
            </td>
            {locations.map((location) => (
                <td key={`${location.name}-car-${categoryType}`} className="border border-gray-300 px-2 py-1 text-right text-sm">
                    {formatNumber(location.data.car[categoryType][selectedMonth])}
                </td>
            ))}
            {locations.map((location) => (
                <td key={`${location.name}-bike-${categoryType}`} className="border border-gray-300 px-2 py-1 text-right text-sm">
                    {formatNumber(location.data.bike[categoryType][selectedMonth])}
                </td>
            ))}
            {locations.map((location) => (
                <td key={`${location.name}-total-${categoryType}`} className="border border-gray-300 px-2 py-1 text-right text-sm">
                    {formatNumber(location.data.total[categoryType][selectedMonth])}
                </td>
            ))}
        </tr>
    );

    return (
        <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
            <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-black dark:text-white">Call by Incident</h3>
            </div>

            {/* Month Filter */}
            <div className="mb-4 rounded-lg">
                <label htmlFor="month-select" className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Select Month:
                </label>
                <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value as MonthKey)}
                    className="block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                    {monthOptions.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Currently showing data for: <span className="font-semibold capitalize">{selectedMonth}</span>
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-xs">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                            <th rowSpan={2} className="border border-gray-300 dark:border-gray-600 px-2 py-2 text-left font-medium text-black dark:text-white">
                                CATEGORY
                            </th>
                            <th colSpan={5} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-medium text-black dark:text-white">
                                CAR
                            </th>
                            <th colSpan={5} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-medium text-black dark:text-white">
                                BIKE
                            </th>
                            <th colSpan={5} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center font-medium bg-blue-100 dark:bg-blue-900 text-black dark:text-white">
                                TOTAL
                            </th>
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                            {/* Car columns */}
                            {locations.map((location) => (
                                <th key={`car-${location.name}`} className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center text-xs text-black dark:text-white">
                                    {location.name}
                                </th>
                            ))}
                            {/* Bike columns */}
                            {locations.map((location) => (
                                <th key={`bike-${location.name}`} className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center text-xs text-black dark:text-white">
                                    {location.name}
                                </th>
                            ))}
                            {/* Total columns */}
                            {locations.map((location) => (
                                <th key={`total-${location.name}`} className="border border-gray-300 dark:border-gray-600 px-1 py-1 text-center text-xs bg-blue-50 dark:bg-blue-800 text-black dark:text-white">
                                    {location.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-black dark:text-white">
                        {renderCategoryRow('Traffic Human Error', 'trafficHumanError')}
                        {renderCategoryRow('Traffic System', 'trafficSystem')}
                        {renderCategoryRow('Customer Behaviour', 'customerBehaviour')}
                        {renderCategoryRow('Asset System', 'assetSystem')}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default CallByIncidentTable;