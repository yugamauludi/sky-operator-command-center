/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useGlobalSocket } from "@/contexts/SocketContext";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
// import { ApexChart } from 'apexcharts';
import React from 'react';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Import table components
import CallQuantityTable from "@/components/tables/CallQuantityTable";
import CallByTimeTable from "@/components/tables/CallByTimeTable";
import CallByGateTable from "@/components/tables/CallByGateTable";
import TrafficCallTable from "@/components/tables/TrafficCallTable";
import CallByIncidentTable from "@/components/tables/CallByIncidentTable";

interface HelpRequest {
  id: string;
  gateId: string;
  type: "help" | "idle";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

interface MonthlyComplaintData {
  month: string;
  date: string;
  complaints: number;
}

// Define table types
type TableType = "call-quantity" | "call-by-time" | "call-by-gate" | "call-by-incident" | "traffic-call";
const tableOptions = [
  { value: "call-quantity", label: "Kuantitas Panggilan" },
  { value: "call-by-time", label: "Panggilan per Waktu" },
  { value: "call-by-gate", label: "Panggilan per Gate" },
  { value: "call-by-incident", label: "Panggilan per Insiden" },
  { value: "traffic-call", label: "Panggilan dan Traffic" }
] as const;

export default function Dashboard() {
  const { connectionStatus, userNumber } = useGlobalSocket();
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [totalOpen] = useState(0);
  const [totalInProgress] = useState(0);
  const [totalResolved] = useState(0);
  const [filterStatus] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  const [searchQuery] = useState("");

  // State for managing active table
  const [activeTable, setActiveTable] = useState<TableType>("call-quantity");

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("loginSuccess") === "1") {
      toast.success("Berhasil login!");
      const url = new URL(window.location.href);
      url.searchParams.delete("loginSuccess");
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const updateRequestStatus = (
    requestId: string,
    newStatus: HelpRequest["status"]
  ) => {
    setHelpRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: newStatus } : request
      )
    );
  };

  const filteredRequests = helpRequests.filter((request) => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesSearch = request.gateId
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const categoryComplaintOptions: ApexOptions = {
    chart: {
      type: "pie" as ApexChart["type"],
      background: "transparent",
      foreColor: "inherit",
    },
    labels: ["Informasi", "Teknikal", "Fasilitas", "Layanan"],
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
    title: {
      text: "Komplain per Kategori",
      style: {
        color: "currentColor",
      },
    },
    legend: {
      labels: {
        colors: "currentColor",
      },
    },
    dataLabels: {
      style: {
        colors: ["#ffffff"],
      },
    },
  };

  const monthlyComplaintOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      background: "transparent",
      foreColor: "inherit",
      toolbar: {
        show: true,
      },
    },
    title: {
      text: "Total Komplain per Bulan",
      style: {
        color: "currentColor",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "currentColor",
        },
        format: "MMM yyyy",
      },
      axisBorder: {
        color: "currentColor",
      },
      axisTicks: {
        color: "currentColor",
      },
    },
    yaxis: {
      title: {
        text: "Jumlah Komplain",
        style: {
          color: "currentColor",
        },
      },
      labels: {
        style: {
          colors: "currentColor",
        },
      },
    },
    grid: {
      borderColor: "currentColor",
    },
    legend: {
      labels: {
        colors: "currentColor",
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 6,
      colors: ["#1f77b4"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: {
      theme: "dark",
      x: {
        format: "MMM yyyy",
      },
      y: {
        formatter: (value: number) => `${value} komplain`,
      },
    },
  };

  const [monthlyComplaintData, setMonthlyComplaintData] = useState<MonthlyComplaintData[]>([]);
  const [isLoadingMonthlyData, setIsLoadingMonthlyData] = useState(false);

  const fetchMonthlyComplaintData = async () => {
    setIsLoadingMonthlyData(true);
    try {
      const response = await fetch("/api/complaints/monthly");
      const data: MonthlyComplaintData[] = await response.json();
      setMonthlyComplaintData(data);
    } catch (error) {
      console.error("Error fetching monthly complaint data:", error);
      setMonthlyComplaintData([
        { month: "Jan 2024", date: "2024-01-01", complaints: 125 },
        { month: "Feb 2024", date: "2024-02-01", complaints: 140 },
        { month: "Mar 2024", date: "2024-03-01", complaints: 110 },
        { month: "Apr 2024", date: "2024-04-01", complaints: 155 },
        { month: "May 2024", date: "2024-05-01", complaints: 135 },
        { month: "Jun 2024", date: "2024-06-01", complaints: 160 },
      ]);
    } finally {
      setIsLoadingMonthlyData(false);
    }
  };

  useEffect(() => {
    fetchMonthlyComplaintData();
  }, []);

  const chartSeries = [
    {
      name: "Komplain",
      data: monthlyComplaintData.map((item) => ({
        x: new Date(item.date).getTime(),
        y: item.complaints,
      })),
    },
  ];

  const [activeAdmins] = useState<any>({
    id: "1",
    name: "John Doe",
    agentNumber: "AGT001",
    status: "active",
  });

  const categoryComplaintSeries = [30, 25, 20, 15];

  // Function to render the active table
  const renderActiveTable = () => {
    switch (activeTable) {
      case "call-quantity":
        return <CallQuantityTable />;

      case "call-by-time":
        return <CallByTimeTable />;

      case "call-by-gate":
        return <CallByGateTable />;

      case "call-by-incident":
        return <CallByIncidentTable />;

      case "traffic-call":
        return <TrafficCallTable />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-2 md:px-4 lg:px-6 py-2 md:py-4 lg:py-8 max-w-7xl">

        {/* Navigation Header */}
        <div className="bg-white dark:bg-[#222B36] p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-6">
              <div className="text-sm md:text-base">
                <span className="text-gray-500">Status: </span>
                <span className={`font-semibold ${connectionStatus === "Connected" ? "text-green-500" : "text-red-500"
                  }`}>
                  {connectionStatus}
                </span>
              </div>
              <div className="text-sm md:text-base">
                <span className="text-gray-500">User Number: </span>
                <span className="font-semibold">{userNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 md:gap-6 mb-3 md:mb-6">
          {/* Need Help Card - Better mobile scaling */}
          <div className="bg-white dark:bg-[#222B36] rounded-lg p-3 md:p-4 lg:p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm md:text-base font-medium">Perlu Bantuan</h3>
                <p className="text-2xl md:text-3xl font-bold text-red-500 mt-2">{totalOpen}</p>
              </div>
              <div className="text-xl md:text-2xl text-red-500">⚠️</div>
            </div>
          </div>

          {/* Request List - Improved scrolling for mobile */}
          <div className="xl:col-span-3 bg-white dark:bg-[#222B36] rounded-lg p-3 md:p-4 lg:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-6">Daftar Permintaan Bantuan</h2>

            {/* Make columns stack better on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 max-h-[600px] overflow-y-auto">
              {/* Column headers with better mobile spacing */}
              <div className="space-y-3 md:space-y-4">
                {/* Open Status Column */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Perlu Bantuan
                  </span>
                  <span>({totalOpen})</span>
                </div>
                {filteredRequests
                  .filter((req) => req.status === "open")
                  .map((request) => (
                    <div
                      key={request.id}
                      className="bg-gray-50 dark:bg-[#2A3441] p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2F3B4B] transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">
                          Gate {request.gateId}
                        </span>
                        <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                          Baru
                        </span>
                      </div>
                      <div className="text-sm mb-4">
                        {new Date(request.createdAt).toLocaleString("id-ID")}
                      </div>
                      <button
                        onClick={() =>
                          updateRequestStatus(request.id, "in_progress")
                        }
                        className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded text-sm font-medium transition-colors duration-200"
                      >
                        Proses Sekarang
                      </button>
                    </div>
                  ))}
              </div>

              {/* In Progress Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Sedang Ditangani
                  </span>
                  <span>({totalInProgress})</span>
                </div>
                {filteredRequests
                  .filter((req) => req.status === "in_progress")
                  .map((request) => (
                    <div
                      key={request.id}
                      className="bg-[#2A3441] p-4 rounded-lg hover:bg-[#2F3B4B] transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">
                          Gate {request.gateId}
                        </span>
                        <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                          Proses
                        </span>
                      </div>
                      <div className="text-sm mb-4">
                        {new Date(request.createdAt).toLocaleString("id-ID")}
                      </div>
                      <button
                        onClick={() =>
                          updateRequestStatus(request.id, "resolved")
                        }
                        className="w-full bg-green-500 hover:bg-green-600 py-2 rounded text-sm font-medium transition-colors duration-200"
                      >
                        Selesai
                      </button>
                    </div>
                  ))}
              </div>

              {/* Resolved Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Selesai
                  </span>
                  <span>({totalResolved})</span>
                </div>
                {filteredRequests
                  .filter((req) => req.status === "resolved")
                  .map((request) => (
                    <div
                      key={request.id}
                      className="bg-[#2A3441] p-4 rounded-lg hover:bg-[#2F3B4B] transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">
                          Gate {request.gateId}
                        </span>
                        <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                          Selesai
                        </span>
                      </div>
                      <div className="text-sm">
                        {new Date(request.createdAt).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 md:gap-6 mb-3 md:mb-6">
          <div className="bg-white dark:bg-[#222B36] p-3 md:p-4 rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
              <h3 className="text-base md:text-lg font-semibold">Statistik Bulanan</h3>
              <button
                onClick={fetchMonthlyComplaintData}
                disabled={isLoadingMonthlyData}
                className="w-full md:w-auto px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 rounded"
              >
                {isLoadingMonthlyData ? "Loading..." : "Refresh"}
              </button>
            </div>

            <div className="w-full h-[200px] md:h-[250px] lg:h-[300px]">
              {isLoadingMonthlyData ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Memuat data...</p>
                  </div>
                </div>
              ) : (
                <ReactApexChart
                  options={{
                    ...monthlyComplaintOptions,
                    chart: {
                      ...monthlyComplaintOptions.chart,
                      background: "transparent",
                      height: "100%",
                      width: "100%",
                    },
                    theme: { mode: "dark" },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        legend: { position: "bottom" },
                        chart: { height: 200 }
                      }
                    }]
                  }}
                  series={chartSeries}
                  type="line"
                  height="100%"
                  width="100%"
                />
              )}
            </div>
          </div>

          <div className="space-y-3 md:space-y-6">
            <div className="bg-white dark:bg-[#222B36] p-3 md:p-4 rounded-lg">
              <div className="w-full h-[200px] md:h-[250px]">
                <ReactApexChart
                  options={{
                    ...categoryComplaintOptions,
                    chart: {
                      ...categoryComplaintOptions.chart,
                      background: "transparent",
                    },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        legend: { position: "bottom" },
                        chart: { height: 200 }
                      }
                    }]
                  }}
                  series={categoryComplaintSeries}
                  type="pie"
                  height="100%"
                  width="100%"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#222B36] rounded-lg p-3 md:p-4">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Informasi Admin</h3>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <h4 className="text-base md:text-lg font-medium">{activeAdmins.name}</h4>
                <span className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-full ${activeAdmins.status === "active"
                  ? "bg-green-500/20 text-green-400"
                  : activeAdmins.status === "busy"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-gray-500/20 text-gray-400"
                  }`}>
                  {activeAdmins.status === "active" ? "Aktif" :
                    activeAdmins.status === "busy" ? "Sibuk" : "Offline"}
                </span>
              </div>
              <div className="mt-3 md:mt-4">
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-1">Nomor Agent</p>
                <p className="text-base md:text-lg font-medium">{activeAdmins.agentNumber}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Table Section with Horizontal Tab Bar */}
        <div className="bg-white dark:bg-[#222B36] rounded-lg p-3 md:p-4 lg:p-6 mb-6">
          {/* Horizontal Tab Bar */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            {tableOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveTable(option.value)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 border-b-2 ${activeTable === option.value
                    ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Table Content */}
          <div className="min-h-[400px]">
            {renderActiveTable()}
          </div>
        </div>
      </div>
    </div>
  );
}