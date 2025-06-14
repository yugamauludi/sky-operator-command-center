"use client";

import { useEffect, useState } from "react";
// import { useSocket } from "@/hooks/useSocket";
import { useGlobalSocket } from "@/contexts/SocketContext";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
// import { endCall } from "@/hooks/useIOT";
// import { GateStatusUpdate } from "@/types/gate";
// import DynamicInputModal from "@/components/DynamicInputModal";
// import { toast } from "react-toastify";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface HelpRequest {
  id: string;
  gateId: string;
  type: "help" | "idle";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

// interface CustomerService {
//   id: string;
//   name: string;
//   status: "active" | "busy" | "offline";
//   handledRequests: number;
// }

interface MonthlyComplaintData {
  month: string;
  date: string;
  complaints: number;
}

// interface AdminData {
//   id: string;
//   name: string;
//   agentNumber: string;
//   status: "active" | "busy" | "offline";
// }

export default function Dashboard() {
  const { connectionStatus, userNumber } = useGlobalSocket();
  // const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  // const [socketId, setSocketId] = useState<undefined | null | string | number>("-");
  // const [showSetupModal, setShowSetupModal] = useState(true);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [totalOpen, ] = useState(0);
  const [totalInProgress, ] = useState(0);
  const [totalResolved, ] = useState(0);
  const [
    filterStatus,
    //  setFilterStatus
    ] = useState<
    "all" | "open" | "in_progress" | "resolved"
  >("all");
  const [
    searchQuery, 
    // setSearchQuery
  ] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("loginSuccess") === "1") {
      toast.success("Berhasil login!");
      // Optional: kamu bisa hapus query param dari URL (bersih)
      const url = new URL(window.location.href);
      url.searchParams.delete("loginSuccess");
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);


  // const [showSetupModal, setShowSetupModal] = useState(true);

  // const [adminData, setAdminData] = useState<AdminData>({
  //   id: "1",
  //   name: "John Doe", // Akan diambil dari data login
  //   agentNumber: "",
  //   status: "active",
  // });

  // const handleUserNumberSubmit = (values: Record<string, string>) => {
  //   const userNum = parseInt(values.userNumber);
  //   if (![1, 2, 3].includes(userNum)) {
  //     alert("User number harus 1, 2, atau 3");
  //     return;
  //   }
  //   setUserNumber(userNum);
  //   setShowSetupModal(false);

  //   // Register user number ke socket
  //   if (socket) {
  //     socket.emit("register", userNum);
  //   }
  // };

  // useEffect(() => {
  //   if (!socket) return;

  //   const handleHelpRequest = (data: HelpRequest) => {
  //     setHelpRequests((prev) => [data, ...prev]);
  //   };

  //   socket.on("help_request", handleHelpRequest);
  //   return () => socket.off("help_request", handleHelpRequest);
  // }, [socket]);

  // useEffect(() => {
  //   const open = helpRequests.filter((req) => req.status === "open").length;
  //   const inProgress = helpRequests.filter(
  //     (req) => req.status === "in_progress"
  //   ).length;
  //   const resolved = helpRequests.filter(
  //     (req) => req.status === "resolved"
  //   ).length;

  //   setTotalOpen(open);
  //   setTotalInProgress(inProgress);
  //   setTotalResolved(resolved);
  // }, [helpRequests]);

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
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
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
        colors: ["currentColor"],
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

  const [monthlyComplaintData, setMonthlyComplaintData] = useState<
    MonthlyComplaintData[]
  >([]);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeAdmins] = useState<any>({
    id: "1",
    name: "John Doe",
    agentNumber: "AGT001",
    status: "active",
  });

  const categoryComplaintSeries = [30, 25, 20, 15];

  return (
    <>
    <ToastContainer/>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-6 py-8">
          {/* Panduan Cepat */}
          {/* <div className="bg-white dark:bg-[#222B36] p-4 rounded-lg mb-8">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsPanduanVisible(!isPanduanVisible)}
              >
                <h3 className="text-lg font-semibold flex items-center">
                  📝 Panduan Cepat
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={testNotificationSound}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <span className="mr-2">🔊</span> Tes Suara
                  </button>
                  <button className="">{isPanduanVisible ? "▼" : "▶"}</button>
                </div>
              </div>
              {isPanduanVisible && (
                <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                  <li>Klik tombol {"Proses"} untuk mulai menangani bantuan</li>
                  <li>
                    Klik tombol {"Selesai"} jika bantuan sudah diselesaikan
                  </li>
                  <li>Suara akan berbunyi jika ada permintaan bantuan baru</li>
                  <li>
                    Klik tombol {"Tes Suara"} untuk menguji notifikasi suara dan
                    getaran
                  </li>
                </ul>
              )}
            </div> */}
          <div className="bg-white dark:bg-[#222B36] p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-6">
                <div>
                  <span className="text-sm text-gray-500">Status: </span>
                  <span
                    className={`font-semibold ${
                      connectionStatus === "Connected"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {connectionStatus}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">User Number: </span>
                  <span className="font-semibold">{userNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter dan Pencarian */}
          {/* <div className="bg-white dark:bg-[#222B36] rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold">Filter Status:</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          filterStatus === "all"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 dark:bg-[#2A3441] hover:bg-gray-200 dark:hover:bg-[#2F3B4B]"
                        }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setFilterStatus("open")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          filterStatus === "open"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 dark:bg-[#2A3441] hover:bg-[#2F3B4B]"
                        }`}
                  >
                    Perlu Bantuan
                  </button>
                  <button
                    onClick={() => setFilterStatus("in_progress")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          filterStatus === "in_progress"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200 dark:bg-[#2A3441] hover:bg-[#2F3B4B]"
                        }`}
                  >
                    Sedang Ditangani
                  </button>
                  <button
                    onClick={() => setFilterStatus("resolved")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          filterStatus === "resolved"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 dark:bg-[#2A3441] hover:bg-[#2F3B4B]"
                        }`}
                  >
                    Selesai
                  </button>
                </div>
              </div>
              <div className="flex-1 md:max-w-xs">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nomor gate..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-[#2A3441] border-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Status Summary dan Daftar */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Card Perlu Bantuan */}
            <div className="bg-white dark:bg-[#222B36] rounded-lg p-6 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Perlu Bantuan</h3>
                  <p className="text-3xl font-bold text-red-500 mt-2">
                    {totalOpen}
                  </p>
                </div>
                <div className="text-red-500 text-2xl">⚠️</div>
              </div>
            </div>

            {/* Daftar Permintaan */}
            <div className="col-span-3 bg-white dark:bg-[#222B36] rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">
                Daftar Permintaan Bantuan
              </h2>

              <div className="grid grid-cols-3 gap-6">
                {/* Kolom Status */}
                <div className="space-y-4">
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

                {/* Kolom Sedang Ditangani */}
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

                {/* Kolom Selesai */}
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

          {/* Dashboard Charts dan Summary */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Line Chart */}
            <div className="bg-white dark:bg-[#222B36] text-gray-900 dark:text-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Statistik Bulanan</h3>
                <button
                  onClick={fetchMonthlyComplaintData}
                  disabled={isLoadingMonthlyData}
                  className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 rounded transition-colors duration-200"
                >
                  {isLoadingMonthlyData ? "Loading..." : "Refresh"}
                </button>
              </div>

              {isLoadingMonthlyData ? (
                <div className="flex items-center justify-center h-[250px]">
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
                    },
                    theme: {
                      mode: "dark",
                      palette: "palette1",
                    },
                  }}
                  series={chartSeries}
                  type="line"
                  height={250} // Kurangi tinggi chart
                />
              )}
            </div>

            {/* Kolom Kanan: Pie Chart dan Admin Section */}
            <div className="space-y-6">
              {/* Pie Chart */}
              <div className="bg-white dark:bg-[#222B36] text-gray-900 dark:text-gray-100 p-4 rounded-lg">
                <ReactApexChart
                  options={{
                    ...categoryComplaintOptions,
                    chart: {
                      ...categoryComplaintOptions.chart,
                      background: "transparent",
                    },
                    theme: {
                      mode: "dark",
                      palette: "palette1",
                    },
                  }}
                  series={categoryComplaintSeries}
                  type="pie"
                  height={200} // Sesuaikan tinggi pie chart
                />
              </div>

              {/* Admin Section */}
              <div className="bg-white dark:bg-[#222B36] rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Informasi Admin</h3>
                {/* <div className="bg-gray-50 dark:bg-[#2A3441] p-6 rounded-lg"> */}
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">{activeAdmins.name}</h4>
                  <span
                    className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                      activeAdmins.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : activeAdmins.status === "busy"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {activeAdmins.status === "active"
                      ? "Aktif"
                      : activeAdmins.status === "busy"
                      ? "Sibuk"
                      : "Offline"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 mt-2">
                  Nomor Agent
                </p>
                <p className="text-lg font-medium">
                  {activeAdmins.agentNumber}
                </p>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
