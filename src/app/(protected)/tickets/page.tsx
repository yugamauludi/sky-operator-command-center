"use client";

import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CommonTable, { Column } from "@/components/tables/CommonTable";

interface Ticket {
  no: number;
  noTicket: string;
  location: string;
  category: string;
  description: string;
  vehicleNo: string;
  inputBy: string;
}

export default function TicketsPage() {
  const [tickets,] = useState<Ticket[]>([
    {
      no: 1,
      noTicket: "TCK-001",
      location: "Jakarta",
      category: "Technical",
      description: "Network issue",
      vehicleNo: "B1234XYZ",
      inputBy: "Admin",
    },
    {
      no: 2,
      noTicket: "TCK-002",
      location: "Bandung",
      category: "Technical",
      description: "Network issue",
      vehicleNo: "B5678XYZ",
      inputBy: "Admin",
    },
  ]);

  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const filteredTickets = tickets.filter(
    (ticket) =>
      (searchLocation === "" || ticket.location.includes(searchLocation)) &&
      (searchCategory === "" || ticket.category.includes(searchCategory))
  );

  const columns: Column<Ticket>[] = [
    { header: "No", accessor: "no" },
    { header: "No Ticket", accessor: "noTicket" },
    { header: "Lokasi", accessor: "location" },
    { header: "Kategori", accessor: "category" },
    { header: "Deskripsi", accessor: "description" },
    { header: "No Kendaraan", accessor: "vehicleNo" },
    { header: "Di Input oleh", accessor: "inputBy" },
  ];

  const handleExport = () => {
    // Implementasi logika ekspor data
    console.log("Exporting data...");
  };

  const handleAddTicket = () => {
    // Implementasi logika penambahan tiket
    console.log("Adding new ticket...");
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">Daftar Tiket</h1>

            {/* Filter Section */}
            <div className="flex items-center mb-4 space-x-2">
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
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full ml-auto flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Export Data</span>
              </button>

              {/* Add Ticket Button */}
              <button
                onClick={handleAddTicket}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Tambah Tiket</span>
              </button>
            </div>

            <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg p-6">
              <CommonTable data={filteredTickets} columns={columns} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
