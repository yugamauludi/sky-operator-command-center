/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { useGlobalSocket } from "@/contexts/SocketContext";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/LoadingSpinner";
import React from 'react';
import { fetchIssuesMonthly } from "@/hooks/useIssues";
import { ComplaintModal } from "@/components/tables/ComplaintModal";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CallQuantityTable = lazy(() => import("@/components/tables/CallQuantityTable"));
const CallByTimeTable = lazy(() => import("@/components/tables/CallByTimeTable"));
const CallByGateTable = lazy(() => import("@/components/tables/CallByGateTable"));
const CallByIncidentTable = lazy(() => import("@/components/tables/CallByIncidentTable"));
const TrafficCallTable = lazy(() => import("@/components/tables/TrafficCallTable"));

interface MonthlyComplaintData {
  month: string;
  date: string;
  complaints: number;
}

type TableType = "call-quantity" | "call-by-time" | "call-by-gate" | "call-by-incident" | "traffic-call";
const tableOptions = [
  { value: "call-quantity", label: "Jumlah Panggilan per Periode" },
  { value: "call-by-time", label: "Panggilan per Waktu" },
  { value: "call-by-gate", label: "Panggilan per Gate" },
  { value: "call-by-incident", label: "Panggilan per Insiden" },
  { value: "traffic-call", label: "Panggilan dan Traffic" }
] as const;

export default function Dashboard() {
  const { connectionStatus, userNumber } = useGlobalSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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

  const handlePieChartClick = (event: any, chartContext: any, config: any) => {
    const category = categoryComplaintOptions.labels?.[config.dataPointIndex] as string;
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const categoryComplaintOptions: ApexOptions = {
    chart: {
      type: "pie",
      background: "transparent",
      foreColor: "inherit",
      events: {
        dataPointSelection: handlePieChartClick
      }
    },
    labels: ["Informasi", "Teknikal", "Fasilitas", "Layanan"],
    colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"],
    title: {
      text: "Komplain per Kategori",
      align: 'center',
      style: {
        color: "currentColor",
        fontSize: '16px',
        fontWeight: '600',
      },
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      labels: {
        colors: "currentColor",
        useSeriesColors: false,
      },
      itemMargin: {
        horizontal: 5,
        vertical: 5
      },
      formatter: function (seriesName, opts) {
        return seriesName + ": " + opts.w.globals.series[opts.seriesIndex];
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#ffffff"],
        fontSize: '12px',
        fontWeight: 'bold',
      },
      dropShadow: {
        enabled: false
      },
      formatter: function (val: any) {
        return val.toFixed(1) + '%';
      },
      textAnchor: 'middle'
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        dataLabels: {
          minAngleToShowLabel: 5,
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 280
        },
        legend: {
          position: 'bottom',
          fontSize: '11px',
          itemMargin: {
            horizontal: 3,
            vertical: 2
          }
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '10px'
          }
        },
        plotOptions: {
          pie: {
            customScale: 0.85
          }
        }
      }
    }]
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
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 250,
          toolbar: {
            show: false
          }
        },
        title: {
          style: {
            fontSize: '14px'
          }
        },
        xaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '10px'
            }
          },
          title: {
            style: {
              fontSize: '12px'
            }
          }
        }
      }
    }]
  };

  const [monthlyComplaintData, setMonthlyComplaintData] = useState<MonthlyComplaintData[]>([]);
  const [isLoadingMonthlyData, setIsLoadingMonthlyData] = useState(false);

  const fetchMonthlyComplaintData = async () => {
    setIsLoadingMonthlyData(true);
    try {
      const response = await fetchIssuesMonthly();
      const apiData = response.data;

      const data: MonthlyComplaintData[] = apiData.map((item: { month: string; total: number }) => ({
        month: item.month,
        date: item.month + "-01",
        complaints: item.total,
      }));

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

  const categoryComplaintSeries = [30, 25, 20, 15];

  const renderActiveTable = () => {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
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
        })()}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col w-full min-h-screen px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
        {/* Navigation Header */}
        <div className="bg-white dark:bg-[#222B36] p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
              <div className="text-sm">
                <span className="text-gray-500">Status: </span>
                <span className={`font-semibold ${connectionStatus === "Connected" ? "text-green-500" : "text-red-500"}`}>
                  {connectionStatus}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">User Number: </span>
                <span className="font-semibold">{userNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Monthly Chart */}
          <div className="bg-white dark:bg-[#222B36] p-3 sm:p-4 rounded-lg">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:justify-between sm:items-center">
              <h3 className="text-base font-semibold">Statistik Bulanan</h3>
              <button
                onClick={fetchMonthlyComplaintData}
                disabled={isLoadingMonthlyData}
                className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 rounded text-white transition-colors"
              >
                {isLoadingMonthlyData ? "Loading..." : "Refresh"}
              </button>
            </div>

            <div className="w-full h-[250px] sm:h-[300px]">
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
                  }}
                  series={chartSeries}
                  type="line"
                  height="100%"
                  width="100%"
                />
              )}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-[#222B36] p-3 sm:p-4 rounded-lg">
            <div className="w-full h-[250px] sm:h-[300px]">
              <ReactApexChart
                options={categoryComplaintOptions}
                series={categoryComplaintSeries}
                type="pie"
                height="100%"
                width="100%"
              />
            </div>
          </div>
        </div>

        {/* Table Section with Horizontal Tab Bar */}
        <div className="bg-white dark:bg-[#222B36] rounded-lg p-3 sm:p-4 lg:p-6">
          {/* Horizontal Tab Bar (desktop/tablet) */}
          <div className="hidden md:flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
            {tableOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveTable(option.value)}
                className={`cursor-pointer px-3 lg:px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 border-b-2 ${activeTable === option.value
                    ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                <span className="hidden lg:inline">{option.label}</span>
                <span className="lg:hidden">{option.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Select Input (mobile) */}
          <div className="mb-4 md:hidden">
            <select
              value={activeTable}
              onChange={e => setActiveTable(e.target.value as TableType)}
              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222B36] text-gray-900 dark:text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            >
              {tableOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Table Content */}
          <div className="min-h-[300px] sm:min-h-[400px]">
            {renderActiveTable()}
          </div>
        </div>
      </div>
      <ComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}