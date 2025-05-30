"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommonTable, { Column } from "@/components/tables/CommonTable";
import { 
  // fetchIssueDetail, 
  fetchIssues 
} from "@/hooks/useIssues";

interface Report {
  no?: number;
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
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);

  const fetchIssuesData = async () => {
    try {
      setIsDataLoading(true);
      const issuesData = await fetchIssues();
      if (issuesData && issuesData.data) {
        const mappedReports: Report[] = issuesData.data.map((issue, index) => {
          const createdDate = new Date(issue.createdAt);
          const day = createdDate.toLocaleDateString("en-US", {
            weekday: "long",
          });
          const date = createdDate.toISOString().split("T")[0]; // YYYY-MM-DD
          const time = createdDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return {
            no: index + 1,
            day,
            date,
            time,
            duration: "30 mins",
            call: issue.ticket,
            location: issue.lokasi,
            category: issue.category,
            description: issue.description,
            solution: issue.action || "No solution provided",
          };
        });

        setReports(mappedReports);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuesData();
  }, []);

  // const fetchIssueDetailData = async (issueId: number) => {
  //   try {
  //     setIsDataLoading(true);
  //     const response = await fetchIssueDetail(issueId);
  //     if (response && response.data) {
  //       const issueDetail = response.data;
  //       console.log("Issue Detail:", issueDetail);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching issue detail:", error);
  //   } finally {
  //     setIsDataLoading(false);
  //   }
  // }

  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const columns: Column<Report>[] = [
    { header: "No.", accessor: "no" },
    { header: "Day", accessor: "day" },
    { header: "Date", accessor: "date" },
    { header: "Time", accessor: "time" },
    { header: "Duration", accessor: "duration" },
    { header: "Call", accessor: "call" },
    { header: "Lokasi", accessor: "location" },
    { header: "Kategori", accessor: "category" },
    { header: "Deskripsi", accessor: "description" },
    { header: "Solusi", accessor: "solution" },
  ];

  const handleExport = () => {
    // Implementasi logika ekspor data
    console.log("Exporting data...");
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
              {isDataLoading ? (
                <div className="text-center py-4">
                  <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                  </div>{" "}
                  <p className="text-gray-600 dark:text-gray-300 blink-smooth">
                    Memuat data kategori...
                  </p>
                </div>
              ) : (
                <CommonTable data={reports} columns={columns} />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
