'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CommonTable, { Column } from '@/components/tables/CommonTable';

interface Report {
  day: string;
  date: string;
  time: string;
  duration: string;
  call: string;
  location: string;
  category: string;
  description: string;
  solution: string;
}

export default function ReportsPage() {
  const [reports] = useState<Report[]>([
    {
      day: "Monday",
      date: "2023-10-01",
      time: "10:00 AM",
      duration: "30 mins",
      call: "123456789",
      location: "Jakarta",
      category: "Technical",
      description: "Issue with network",
      solution: "Restart router"
    },
    // Tambahkan data laporan lainnya di sini
  ]);

  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const filteredReports = reports.filter(report => 
    (!searchDate || report.date.includes(searchDate.toISOString().split('T')[0])) &&
    (searchLocation === '' || report.location.includes(searchLocation)) &&
    (searchCategory === '' || report.category.includes(searchCategory))
  );

  const columns: Column<Report>[] = [
    { header: 'Day', accessor: 'day' },
    { header: 'Date', accessor: 'date' },
    { header: 'Time', accessor: 'time' },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Call', accessor: 'call' },
    { header: 'Lokasi', accessor: 'location' },
    { header: 'Kategori', accessor: 'category' },
    { header: 'Deskripsi', accessor: 'description' },
    { header: 'Solusi', accessor: 'solution' },
  ];

  const handleExport = () => {
    // Implementasi logika ekspor data
    console.log('Exporting data...');
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">Laporan</h1>
            
            {/* Filter Section */}
            <div className="flex items-center mb-4 space-x-2">
              <div className="relative">
                <DatePicker
                  selected={searchDate}
                  onChange={(date) => setSearchDate(date)}
                  className="px-4 py-2 border rounded-lg pl-10"
                  placeholderText="Cari Tanggal"
                  dateFormat="yyyy-MM-dd"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📅
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari Lokasi"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="px-4 py-2 border rounded-lg pl-10"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📍
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari Kategori"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg pl-10"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full ml-auto"
              >
                Export Data
              </button>
            </div>

            <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg p-6">
              <CommonTable 
                data={filteredReports} 
                columns={columns}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}