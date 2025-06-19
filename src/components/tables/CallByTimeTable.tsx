import React, { useState } from 'react';

interface CallData {
    call: number;
    noAnswer: number;
    doublePush: number;
}

interface TimeSlotData {
    hour: string;
    hpm: CallData;
    lku: CallData;
    lmp: CallData;
    pv: CallData;
    spark: CallData;
    picon: CallData;
    // ml: CallData;
    // lmn: CallData;
    // shlv: CallData;
    // shkj: CallData;
    // shkd: CallData;
    // uph: CallData;
    // helipad: CallData;
    // total: CallData;
}

interface MonthlyData {
    [key: string]: TimeSlotData[];
}

const CallByTimeTable: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>('april');

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

    // Sample monthly data - replace with your actual data
    const monthlyData: MonthlyData = {
        january: [],
        february: [],
        march: [],
        april: [
            {
                hour: "00:00-01:00",
                hpm: { call: 0, noAnswer: 0, doublePush: 0 },
                lku: { call: 0, noAnswer: 0, doublePush: 0 },
                lmp: { call: 2, noAnswer: 2, doublePush: 0 },
                pv: { call: 0, noAnswer: 0, doublePush: 0 },
                spark: { call: 1, noAnswer: 0, doublePush: 0 },
                picon: { call: 0, noAnswer: 0, doublePush: 0 },
                // ml: { call: 1, noAnswer: 0, doublePush: 0 },
                // lmn: { call: 0, noAnswer: 0, doublePush: 0 },
                // shlv: { call: 0, noAnswer: 0, doublePush: 0 },
                // shkj: { call: 0, noAnswer: 0, doublePush: 0 },
                // shkd: { call: 0, noAnswer: 0, doublePush: 0 },
                // uph: { call: 0, noAnswer: 0, doublePush: 0 },
                // helipad: { call: 0, noAnswer: 0, doublePush: 0 },
                // total: { call: 4, noAnswer: 2, doublePush: 0 }
            },
        ],
        may: [],
        june: [],
        july: [],
        august: [],
        september: [],
        october: [],
        november: [],
        december: []
    };

    const getCurrentMonthData = (): TimeSlotData[] => {
        return monthlyData[selectedMonth] || [];
    };

    // Generate all 24 hour slots
    const generateTimeSlots = (): string[] => {
        const slots = [];
        for (let i = 0; i < 24; i++) {
            const startHour = i.toString().padStart(2, '0');
            const endHour = ((i + 1) % 24).toString().padStart(2, '0');
            slots.push(`${startHour}:00-${endHour}:00`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();
    const locations = ['HPM', 'LKU', 'LMP', 'PV', 'SPARK', 'PICON',
        //  'ML', 'LMN', 'SHLV', 'SHKJ', 'SHKD', 'UPH', 
        'HELIPAD', 'TOTAL'];
    const currentMonthData = getCurrentMonthData();

    // Get data for specific time slot and location, with fallback to random data
    const getDataForTimeSlot = (timeSlot: string, location: string): CallData => {
        const timeSlotData = currentMonthData.find(data => data.hour === timeSlot);
        if (timeSlotData && timeSlotData[location.toLowerCase() as keyof TimeSlotData]) {
            return timeSlotData[location.toLowerCase() as keyof TimeSlotData] as CallData;
        }
        // Fallback to random data if no specific data exists
        return {
            call: Math.floor(Math.random() * 100),
            noAnswer: Math.floor(Math.random() * 50),
            doublePush: Math.floor(Math.random() * 20)
        };
    };

    return (
        <div className="bg-white dark:bg-[#222B36] rounded-lg p-4 md:p-6">
            <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">Call by Time</h3>
            </div>
            <div className="mb-4 rounded-lg">
                <label htmlFor="month-select" className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Select Month:
                </label>
                <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="block w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-800 text-black dark:text-white"
                >
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Currently showing data for: <span className="font-semibold capitalize">{selectedMonth}</span>
                </p>
            </div>
            <div className="w-full overflow-x-auto thin-scrollbar">
                <table className="w-full border-collapse border border-gray-400 dark:border-gray-700 text-xs">
                    <thead>
                        <tr>
                            <th rowSpan={3} className="border border-gray-400 dark:border-gray-700 bg-blue-900 text-white p-2 min-w-[100px]">
                                HOUR
                            </th>
                            {locations.map((location) => (
                                <th key={location} colSpan={3} className="border border-gray-400 dark:border-gray-700 bg-green-100 dark:bg-green-900 text-black dark:text-white p-1 text-center">
                                    {location}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            {locations.map((location) => (
                                <React.Fragment key={location}>
                                    <th className="border border-gray-400 dark:border-gray-700 bg-blue-100 dark:bg-blue-800 text-black dark:text-white p-1 text-center min-w-[50px]">
                                        Call
                                    </th>
                                    <th colSpan={2} className="border border-gray-400 dark:border-gray-700 bg-blue-100 dark:bg-blue-800 text-black dark:text-white p-1 text-center min-w-[100px]">
                                        Miss Called
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>
                        <tr>
                            {locations.map((location) => (
                                <React.Fragment key={location}>
                                    <th className="border border-gray-400 dark:border-gray-700 bg-blue-100 dark:bg-blue-800 text-black dark:text-white p-1 text-center">
                                        &nbsp;
                                    </th>
                                    <th className="border border-gray-400 dark:border-gray-700 bg-blue-100 dark:bg-blue-800 text-black dark:text-white p-1 text-center min-w-[60px]">
                                        No Answer
                                    </th>
                                    <th className="border border-gray-400 dark:border-gray-700 bg-blue-100 dark:bg-blue-800 text-black dark:text-white p-1 text-center min-w-[60px]">
                                        Double Push
                                    </th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((timeSlot, index) => (
                            <tr key={timeSlot} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                                <td className="border border-gray-400 dark:border-gray-700 bg-blue-900 text-white p-2 font-medium text-center">
                                    {timeSlot}
                                </td>
                                {locations.map((location) => {
                                    const data = getDataForTimeSlot(timeSlot, location);
                                    return (
                                        <React.Fragment key={location}>
                                            <td className="border border-gray-400 dark:border-gray-700 p-1 text-center text-black dark:text-white">
                                                {data.call}
                                            </td>
                                            <td className="border border-gray-400 dark:border-gray-700 p-1 text-center text-black dark:text-white">
                                                {data.noAnswer}
                                            </td>
                                            <td className="border border-gray-400 dark:border-gray-700 p-1 text-center text-black dark:text-white">
                                                {data.doublePush}
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                        <tr className="bg-blue-900 text-white font-bold">
                            <td className="border border-gray-400 dark:border-gray-700 p-2 text-center">TOTAL</td>
                            {locations.map((location) => {
                                const totalCall = timeSlots.reduce((sum, timeSlot) => sum + getDataForTimeSlot(timeSlot, location).call, 0);
                                const totalNoAnswer = timeSlots.reduce((sum, timeSlot) => sum + getDataForTimeSlot(timeSlot, location).noAnswer, 0);
                                const totalDoublePush = timeSlots.reduce((sum, timeSlot) => sum + getDataForTimeSlot(timeSlot, location).doublePush, 0);
                                return (
                                    <React.Fragment key={location}>
                                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">{totalCall}</td>
                                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">{totalNoAnswer}</td>
                                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">{totalDoublePush}</td>
                                    </React.Fragment>
                                );
                            })}
                        </tr>
                        <tr className="bg-blue-800 text-white">
                            <td className="border border-gray-400 dark:border-gray-700 p-2 text-center">%</td>
                            {locations.map((location) => {
                                const totalCall = timeSlots.reduce((sum, timeSlot) => sum + getDataForTimeSlot(timeSlot, location).call, 0);
                                const totalNoAnswer = timeSlots.reduce((sum, timeSlot) => sum + getDataForTimeSlot(timeSlot, location).noAnswer, 0);
                                const totalMissed = totalNoAnswer;
                                const totalAll = totalCall + totalMissed;

                                const callPercentage = totalAll > 0 ? Math.round((totalCall / totalAll) * 100) : 0;
                                const missedPercentage = totalAll > 0 ? Math.round((totalMissed / totalAll) * 100) : 0;

                                return (
                                    <React.Fragment key={location}>
                                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">{callPercentage}%</td>
                                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">{missedPercentage}%</td>
                                        <td className="border border-gray-400 dark:border-gray-700 p-1 text-center">{Math.floor(Math.random() * 100)}%</td>
                                    </React.Fragment>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CallByTimeTable;