import React from 'react';

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
    car: {
        jan: VehicleData;
        feb: VehicleData;
        mar: VehicleData;
        apr: VehicleData;
        mei: VehicleData;
        juni: VehicleData;
        total: VehicleData;
    };
    bike: {
        jan: VehicleData;
        feb: VehicleData;
        mar: VehicleData;
        apr: VehicleData;
        mei: VehicleData;
        juni: VehicleData;
        total: VehicleData;
    };
}

const TrafficCallTable: React.FC = () => {
    // Sample data based on the image
    const data: LocationData[] = [
        {
            location: 'HPM LKU',
            car: {
                jan: { traffic: { qty: 1779, percentage: 2.4 }, call: { qty: 91, percentage: 0 } },
                feb: { traffic: { qty: 363, percentage: 0 }, call: { qty: 67, percentage: 0 } },
                mar: { traffic: { qty: 6453, percentage: 1.8 }, call: { qty: 115, percentage: 0 } },
                apr: { traffic: { qty: 342, percentage: 1.9 }, call: { qty: 74, percentage: 0 } },
                mei: { traffic: { qty: 565, percentage: 1.1 }, call: { qty: 83, percentage: 0 } },
                juni: { traffic: { qty: 1, percentage: 1.3 }, call: { qty: 55, percentage: 0 } },
                total: { traffic: { qty: 9503, percentage: 1.5 }, call: { qty: 485, percentage: 0 } }
            },
            bike: {
                jan: { traffic: { qty: 523, percentage: 2.1 }, call: { qty: 8, percentage: 0 } },
                feb: { traffic: { qty: 4316, percentage: 1.5 }, call: { qty: 67, percentage: 0 } },
                mar: { traffic: { qty: 6172, percentage: 1.8 }, call: { qty: 115, percentage: 0 } },
                apr: { traffic: { qty: 3883, percentage: 1.9 }, call: { qty: 74, percentage: 0 } },
                mei: { traffic: { qty: 7770, percentage: 1.1 }, call: { qty: 83, percentage: 0 } },
                juni: { traffic: { qty: 3476, percentage: 1.3 }, call: { qty: 55, percentage: 0 } },
                total: { traffic: { qty: 26140, percentage: 1.5 }, call: { qty: 502, percentage: 0 } }
            }
        },
        {
            location: 'LMP',
            car: {
                jan: { traffic: { qty: 271879, percentage: 0.3 }, call: { qty: 840, percentage: 0 } },
                feb: { traffic: { qty: 231129, percentage: 0.5 }, call: { qty: 1178, percentage: 0 } },
                mar: { traffic: { qty: 278249, percentage: 0.6 }, call: { qty: 1721, percentage: 0 } },
                apr: { traffic: { qty: 252020, percentage: 0.5 }, call: { qty: 1306, percentage: 0 } },
                mei: { traffic: { qty: 263380, percentage: 0.4 }, call: { qty: 956, percentage: 0 } },
                juni: { traffic: { qty: 99954, percentage: 0.4 }, call: { qty: 395, percentage: 0 } },
                total: { traffic: { qty: 1397061, percentage: 0.5 }, call: { qty: 6396, percentage: 0 } }
            },
            bike: {
                jan: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                feb: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                mar: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                apr: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                mei: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                juni: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } },
                total: { traffic: { qty: 0, percentage: 0.0 }, call: { qty: 0, percentage: 0 } }
            }
        },
        {
            location: 'PV',
            car: {
                jan: { traffic: { qty: 127347, percentage: 0.3 }, call: { qty: 437, percentage: 0 } },
                feb: { traffic: { qty: 135155, percentage: 0.7 }, call: { qty: 990, percentage: 0 } },
                mar: { traffic: { qty: 116451, percentage: 0.9 }, call: { qty: 1056, percentage: 0 } },
                apr: { traffic: { qty: 140845, percentage: 0.6 }, call: { qty: 785, percentage: 0 } },
                mei: { traffic: { qty: 170391, percentage: 0.5 }, call: { qty: 796, percentage: 0 } },
                juni: { traffic: { qty: 62131, percentage: 0.4 }, call: { qty: 241, percentage: 0 } },
                total: { traffic: { qty: 752320, percentage: 0.6 }, call: { qty: 4305, percentage: 0 } }
            },
            bike: {
                jan: { traffic: { qty: 6456, percentage: 1.5 }, call: { qty: 99, percentage: 0 } },
                feb: { traffic: { qty: 17556, percentage: 1.8 }, call: { qty: 326, percentage: 0 } },
                mar: { traffic: { qty: 22671, percentage: 1.6 }, call: { qty: 349, percentage: 0 } },
                apr: { traffic: { qty: 21298, percentage: 1.6 }, call: { qty: 352, percentage: 0 } },
                mei: { traffic: { qty: 27051, percentage: 1.2 }, call: { qty: 316, percentage: 0 } },
                juni: { traffic: { qty: 9783, percentage: 1.3 }, call: { qty: 133, percentage: 0 } },
                total: { traffic: { qty: 104815, percentage: 1.5 }, call: { qty: 1575, percentage: 0 } }
            }
        }
    ];

    const formatNumber = (num: number): string => {
        return num.toLocaleString();
    };

    const formatPercentage = (percent: number): string => {
        return `${percent.toFixed(1)}%`;
    };

    return (
        <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
            <div className='mb-6'>
                <h3 className="text-lg md:text-xl font-semibold mb-2">Traffic VS Call</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Periode Januari - Juni 2025
                </p>
            </div>
            <div className="overflow-x-auto bg-white dark:bg-[#222B36] thin-scrollbar">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                            <th rowSpan={2} className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-left font-medium text-sm text-black dark:text-white">
                                Location
                            </th>
                            <th rowSpan={2} className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center font-medium text-sm text-black dark:text-white">
                                Vehicle
                            </th>
                            <th rowSpan={2} className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center font-medium text-sm text-black dark:text-white">
                                Traffic & Call
                            </th>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Juni', 'Total'].map((month) => (
                                <th key={month} colSpan={2} className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center font-medium text-sm text-black dark:text-white">
                                    {month}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                            {Array(7).fill(null).map((_, index) => (
                                <React.Fragment key={index}>
                                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center font-medium text-xs text-black dark:text-white">Qty</th>
                                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center font-medium text-xs text-black dark:text-white">%</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((location) => (
                            <React.Fragment key={location.location}>
                                {/* Car rows */}
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td rowSpan={4} className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm font-medium text-black dark:text-white align-top">
                                        {location.location}
                                    </td>
                                    <td rowSpan={2} className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center text-sm text-black dark:text-white align-middle">
                                        Car
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm text-black dark:text-white">Traffic</td>
                                    {Object.entries(location.car).map(([month, data]) => (
                                        <React.Fragment key={`car-traffic-${month}`}>
                                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-right text-sm text-black dark:text-white">
                                                {data.traffic.qty === 0 ? '-' : formatNumber(data.traffic.qty)}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-right text-sm text-black dark:text-white">
                                                {data.traffic.percentage === 0 ? '0.0%' : formatPercentage(data.traffic.percentage)}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm text-black dark:text-white">Call</td>
                                    {Object.entries(location.car).map(([month, data]) => (
                                        <React.Fragment key={`car-call-${month}`}>
                                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-right text-sm text-black dark:text-white">
                                                {data.call.qty === 0 ? '-' : formatNumber(data.call.qty)}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-right text-sm text-black dark:text-white">
                                                {formatPercentage(data.call.percentage)}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>

                                {/* Bike rows */}
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td rowSpan={2} className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center text-sm text-black dark:text-white align-middle">
                                        Bike
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm text-black dark:text-white">Traffic</td>
                                    {Object.entries(location.bike).map(([month, data]) => (
                                        <React.Fragment key={`bike-traffic-${month}`}>
                                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-right text-sm text-black dark:text-white">
                                                {data.traffic.qty === 0 ? '-' : formatNumber(data.traffic.qty)}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-right text-sm text-black dark:text-white">
                                                {data.traffic.percentage === 0 ? '0.0%' : formatPercentage(data.traffic.percentage)}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-sm text-black dark:text-white">Call</td>
                                    {Object.entries(location.bike).map(([month, data]) => (
                                        <React.Fragment key={`bike-call-${month}`}>
                                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-right text-sm text-black dark:text-white">
                                                {data.call.qty === 0 ? '-' : formatNumber(data.call.qty)}
                                            </td>
                                            <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-right text-sm text-black dark:text-white">
                                                {formatPercentage(data.call.percentage)}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TrafficCallTable;