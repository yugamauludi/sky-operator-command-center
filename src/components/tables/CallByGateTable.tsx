import React, { useState } from 'react';

interface GateData {
    humanError: number;
    customerBehaviour: number;
    assetSystem: number;
}

interface LocationData {
    car: GateData;
    bike: GateData;
}

interface GateRowData {
    gate: string;
    hpmLku: LocationData;
    lmp: LocationData;
    pv: LocationData;
}

interface MonthlyGateData {
    [key: string]: GateRowData[];
}

const CallByGateTable: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>('january');

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

    // Sample monthly gate data - replace with your actual data
    const monthlyGateData: MonthlyGateData = {
        january: [
            {
                gate: "Pintu Masuk 1",
                hpmLku: {
                    car: { humanError: 35, customerBehaviour: 0, assetSystem: 1 },
                    bike: { humanError: 7, customerBehaviour: 0, assetSystem: 0 }
                },
                lmp: {
                    car: { humanError: 22, customerBehaviour: 0, assetSystem: 1 },
                    bike: { humanError: 0, customerBehaviour: 0, assetSystem: 0 }
                },
                pv: {
                    car: { humanError: 10, customerBehaviour: 3, assetSystem: 0 },
                    bike: { humanError: 14, customerBehaviour: 2, assetSystem: 0 }
                }
            },
            {
                gate: "Pintu Masuk 2",
                hpmLku: {
                    car: { humanError: 35, customerBehaviour: 0, assetSystem: 4 },
                    bike: { humanError: 0, customerBehaviour: 0, assetSystem: 0 }
                },
                lmp: {
                    car: { humanError: 1, customerBehaviour: 0, assetSystem: 0 },
                    bike: { humanError: 0, customerBehaviour: 0, assetSystem: 0 }
                },
                pv: {
                    car: { humanError: 12, customerBehaviour: 0, assetSystem: 0 },
                    bike: { humanError: 17, customerBehaviour: 2, assetSystem: 0 }
                }
            },
            // Add more gates...
        ],
        february: [
            // February data with different values
        ],
        march: [
            // March data
        ],
        april: [
            // April data
        ],
        may: [
            // May data
        ],
        june: [
            // June data
        ],
        july: [
            // July data
        ],
        august: [
            // August data
        ],
        september: [
            // September data
        ],
        october: [
            // October data
        ],
        november: [
            // November data
        ],
        december: [
            // December data
        ]
    };

    // Generate gate names
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

    const getCurrentMonthData = (): GateRowData[] => {
        return monthlyGateData[selectedMonth] || [];
    };

    const gateNames = generateGateNames();
    const currentMonthData = getCurrentMonthData();

    // Get data for specific gate, with fallback to random/zero data
    const getDataForGate = (gateName: string): GateRowData => {
        const gateData = currentMonthData.find(data => data.gate === gateName);
        if (gateData) {
            return gateData;
        }

        // Generate fallback data based on gate type
        const isTotal = gateName.includes('Total') || gateName === 'TOTAL';
        const multiplier = isTotal ? 10 : 1;

        return {
            gate: gateName,
            hpmLku: {
                car: {
                    humanError: Math.floor(Math.random() * 50 * multiplier),
                    customerBehaviour: Math.floor(Math.random() * 20 * multiplier),
                    assetSystem: Math.floor(Math.random() * 15 * multiplier)
                },
                bike: {
                    humanError: Math.floor(Math.random() * 30 * multiplier),
                    customerBehaviour: Math.floor(Math.random() * 10 * multiplier),
                    assetSystem: Math.floor(Math.random() * 10 * multiplier)
                }
            },
            lmp: {
                car: {
                    humanError: Math.floor(Math.random() * 40 * multiplier),
                    customerBehaviour: Math.floor(Math.random() * 15 * multiplier),
                    assetSystem: Math.floor(Math.random() * 12 * multiplier)
                },
                bike: {
                    humanError: Math.floor(Math.random() * 25 * multiplier),
                    customerBehaviour: Math.floor(Math.random() * 8 * multiplier),
                    assetSystem: Math.floor(Math.random() * 8 * multiplier)
                }
            },
            pv: {
                car: {
                    humanError: Math.floor(Math.random() * 35 * multiplier),
                    customerBehaviour: Math.floor(Math.random() * 12 * multiplier),
                    assetSystem: Math.floor(Math.random() * 10 * multiplier)
                },
                bike: {
                    humanError: Math.floor(Math.random() * 20 * multiplier),
                    customerBehaviour: Math.floor(Math.random() * 6 * multiplier),
                    assetSystem: Math.floor(Math.random() * 6 * multiplier)
                }
            }
        };
    };

    const getRowClassName = (gateName: string): string => {
        if (gateName === 'TOTAL') {
            return 'bg-blue-900 dark:bg-blue-950 text-white font-bold';
        }
        if (gateName.includes('Total')) {
            return 'bg-blue-800 dark:bg-blue-900 text-white font-bold';
        }
        return 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700';
    };

    return (
        <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
            <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">Call by Gate</h3>
            </div>
            {/* Month Selector */}
            <div className="mb-4 rounded-lg">
                <label htmlFor="month-select" className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Select Month:
                </label>
                <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Currently showing data for: <span className="font-semibold capitalize text-gray-900 dark:text-white">{selectedMonth}</span>
                </p>
            </div>

            <div className="w-full overflow-x-auto thin-scrollbar">
                <table className="w-full border-collapse border border-gray-400 dark:border-gray-600 text-xs">
                    <thead>
                        {/* First header row - Location names */}
                        <tr>
                            <th
                                rowSpan={3}
                                className="sticky left-0 z-10 border border-gray-400 dark:border-gray-600 bg-blue-900 dark:bg-blue-950 text-white p-2 min-w-[120px] font-bold"
                            >
                                GATE
                            </th>
                            <th colSpan={6} className="border border-gray-400 dark:border-gray-600 bg-green-200 dark:bg-green-800 text-gray-900 dark:text-white p-1 text-center font-semibold">
                                HPM LKU
                            </th>
                            <th colSpan={6} className="border border-gray-400 dark:border-gray-600 bg-green-200 dark:bg-green-800 text-gray-900 dark:text-white p-1 text-center font-semibold">
                                LMP
                            </th>
                            <th colSpan={6} className="border border-gray-400 dark:border-gray-600 bg-green-200 dark:bg-green-800 text-gray-900 dark:text-white p-1 text-center font-semibold">
                                PV
                            </th>
                            <th colSpan={6} className="border border-gray-400 dark:border-gray-600 bg-orange-200 dark:bg-orange-800 text-gray-900 dark:text-white p-1 text-center font-semibold">
                                TOTAL
                            </th>
                        </tr>

                        {/* Second header row - Car/Bike */}
                        <tr>
                            {Array.from({ length: 4 }).map((_, i) => (
                                <React.Fragment key={i}>
                                    <th colSpan={3} className={`border border-gray-400 dark:border-gray-600 ${i === 3 ? 'bg-orange-100 dark:bg-orange-700' : 'bg-blue-200 dark:bg-blue-700'} text-gray-900 dark:text-white p-1 text-center font-medium`}>
                                        Car
                                    </th>
                                    <th colSpan={3} className={`border border-gray-400 dark:border-gray-600 ${i === 3 ? 'bg-orange-100 dark:bg-orange-700' : 'bg-blue-200 dark:bg-blue-700'} text-gray-900 dark:text-white p-1 text-center font-medium`}>
                                        Bike
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>

                        {/* Third header row - Error types */}
                        <tr>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <React.Fragment key={i}>
                                    <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                        Human Error
                                    </th>
                                    <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                        Customer Behaviour
                                    </th>
                                    <th className="border border-gray-400 dark:border-gray-600 bg-blue-100 dark:bg-blue-600 text-gray-900 dark:text-white p-1 text-center min-w-[60px] font-medium text-[10px]">
                                        Asset / System
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {gateNames.map((gateName) => {
                            const gateData = getDataForGate(gateName);

                            const totalCarHumanError = gateData.hpmLku.car.humanError + gateData.lmp.car.humanError + gateData.pv.car.humanError;
                            const totalCarCustomerBehaviour = gateData.hpmLku.car.customerBehaviour + gateData.lmp.car.customerBehaviour + gateData.pv.car.customerBehaviour;
                            const totalCarAssetSystem = gateData.hpmLku.car.assetSystem + gateData.lmp.car.assetSystem + gateData.pv.car.assetSystem;

                            const totalBikeHumanError = gateData.hpmLku.bike.humanError + gateData.lmp.bike.humanError + gateData.pv.bike.humanError;
                            const totalBikeCustomerBehaviour = gateData.hpmLku.bike.customerBehaviour + gateData.lmp.bike.customerBehaviour + gateData.pv.bike.customerBehaviour;
                            const totalBikeAssetSystem = gateData.hpmLku.bike.assetSystem + gateData.lmp.bike.assetSystem + gateData.pv.bike.assetSystem;

                            return (
                                <tr
                                    key={gateName}
                                    className={`${getRowClassName(gateName)} transition-colors duration-150`}
                                >
                                    <td className={`sticky left-0 z-10 border border-gray-400 dark:border-gray-600 ${gateName.includes('Total') || gateName === 'TOTAL'
                                        ? 'bg-blue-900 dark:bg-blue-950 text-white font-bold'
                                        : 'bg-blue-900 dark:bg-blue-950 text-white'} p-2 font-medium`}>
                                        {gateName}
                                    </td>
                                    {/* Render all 24 data cells */}
                                    {[
                                        gateData.hpmLku.car, gateData.hpmLku.bike,
                                        gateData.lmp.car, gateData.lmp.bike,
                                        gateData.pv.car, gateData.pv.bike,
                                        { humanError: totalCarHumanError, customerBehaviour: totalCarCustomerBehaviour, assetSystem: totalCarAssetSystem },
                                        { humanError: totalBikeHumanError, customerBehaviour: totalBikeCustomerBehaviour, assetSystem: totalBikeAssetSystem }
                                    ].flatMap((item, i) => (
                                        [
                                            item.humanError,
                                            item.customerBehaviour,
                                            item.assetSystem
                                        ].map((value, j) => (
                                            <td
                                                key={`${i}-${j}`}
                                                className={`border border-gray-400 dark:border-gray-600 p-1 text-center font-medium transition-colors duration-150 ${gateName.includes('Total') || gateName === 'TOTAL'
                                                        ? i >= 6
                                                            ? 'bg-orange-200 dark:bg-orange-800 text-white font-bold'
                                                            : 'bg-blue-900 dark:bg-blue-950 text-white font-bold'
                                                        : i >= 6
                                                            ? 'bg-orange-50 dark:bg-orange-900/50 text-gray-900 dark:text-orange-100'
                                                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                                    }`}
                                            >
                                                {value || '-'}
                                            </td>
                                        ))
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CallByGateTable;