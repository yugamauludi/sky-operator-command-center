"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CommonTable, { Column } from "@/components/tables/CommonTable";
import IsseFormInputModal, { Field } from "@/components/IssueFormInputModal";
import { addIssue, fetchIssues } from "@/hooks/useIssues";
import { Category, fetchCategories } from "@/hooks/useCategories";
import { Description, fetchDescriptions } from "@/hooks/useDescriptions";

interface Report {
  no?: number;
  duration?: string;
  call: string;
  location: string;
  category: string;
  description: string;
  solution: string;
  formatDate: string;  // Keep only the combined format
}

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface NewReportData {
  idCategory: number;
  idGate: number;
  description: string;
  action: string;
  foto: string;
  number_plate: string;
  TrxNo: string;
}

export default function ReportsPage() {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [issuesPagination, setIssuesPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
  });

  const fetchIssuesData = async (page = 1, limit = 5) => {
    try {
      setIsDataLoading(true);
      const issuesData = await fetchIssues(page, limit);
      if (issuesData && issuesData.data && issuesData.meta) {
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

          const formatDate = day + ", " + date + ", " + time + " WIB"

          return {
            no: index + 1,
            formatDate,
            duration: "30 mins",
            call: issue.ticket,
            location: issue.lokasi,
            category: issue.category,
            description: issue.description,
            solution: issue.action || "No solution provided",
          };
        });
        setIssuesPagination({
          totalItems: issuesData.meta.totalItems,
          totalPages: issuesData.meta.totalPages,
          currentPage: issuesData.meta.page,
          itemsPerPage: issuesData.meta.limit,
        });
        setReports(mappedReports);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const response = await fetchCategories(1, 1000);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDescriptionsData = async () => {
    try {
      const response = await fetchDescriptions(1, 1000);
      setDescriptions(response.data);
    } catch (error) {
      console.error("Error fetching descriptions:", error);
    }
  };

  const handleIssuesPageChange = (page: number) => {
    setIssuesPagination((prev) => ({ ...prev, currentPage: page }));
    fetchIssuesData(page, issuesPagination.itemsPerPage);
  };

  const handleItemsReportPerPageChange = (newItemsPerPage: number) => {
    setIssuesPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchIssuesData(1, newItemsPerPage);
  };

  const handleNewReportSubmit = async (values: Record<string, string>) => {
    try {
      setIsDataLoading(true);

      const newReportData: NewReportData = {
        idCategory: parseInt(values.idCategory),
        idGate: parseInt(values.idGate) || 0,
        description: values.description,
        action: values.action,
        foto: values.foto || "-",
        number_plate: values.number_plate || "-",
        TrxNo: values.TrxNo || "-",
      };

      console.log("Submitting new report:", newReportData);

      // TODO: Replace with actual API call to create new issue
      await addIssue(newReportData);

      // Refresh data after successful creation
      await fetchIssuesData(
        issuesPagination.currentPage,
        issuesPagination.itemsPerPage
      );

      // Show success message (you can add a toast notification here)
      console.log("Report created successfully!");
    } catch (error) {
      console.error("Error creating new report:", error);
      // Handle error (show error message to user)
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuesData();
    fetchCategoriesData();
    fetchDescriptionsData();
  }, []);

  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const columns: Column<Report>[] = [
    { header: "No.", accessor: "no" },
    // { header: "Day", accessor: "day" },
    { header: "Date", accessor: "formatDate" },
    // { header: "Time", accessor: "time" },
    // { header: "Duration", accessor: "duration" },
    // { header: "Call", accessor: "call" },
    { header: "Lokasi", accessor: "location" },
    { header: "Kategori", accessor: "category" },
    { header: "Deskripsi", accessor: "description" },
    { header: "Solusi", accessor: "solution" },
  ];

  // Format current date and time for default values
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const formattedInTime = currentDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const newReportFields: Field[] = [
    // Information Section
    {
      id: "no_transaction",
      label: "No Transaction",
      type: "text" as const,
      value: "-",
      placeholder: "No Transaction",
      readonly: true,
    },
    {
      id: "number_plate",
      label: "No Plat Number",
      type: "text" as const,
      value: "-",
      placeholder: "No Plat Number",
      readonly: true,
    },
    {
      id: "date",
      label: "Date",
      type: "text" as const,
      value: formattedDate,
      placeholder: "Date",
      readonly: true,
    },
    {
      id: "in_time",
      label: "In Time",
      type: "text" as const,
      value: formattedInTime,
      placeholder: "In Time",
      readonly: true,
    },
    {
      id: "out_time",
      label: "Out Time",
      type: "text" as const,
      value: "-",
      placeholder: "Out Time",
      readonly: true,
    },
    {
      id: "payment_time",
      label: "Payment Time",
      type: "text" as const,
      value: "-",
      placeholder: "Payment Time",
      readonly: true,
    },
    {
      id: "tariff",
      label: "Tariff",
      type: "text" as const,
      value: "-",
      placeholder: "Tariff",
      readonly: true,
    },
    // Input Issue Section
    {
      id: "idCategory",
      label: "Kategori",
      type: "select" as const,
      value: "",
      placeholder: "-- Pilih Kategori --",
      options: categories.map((cat) => ({
        value: cat.id.toString(),
        label: cat.category,
      })),
      required: true,
    },
    {
      id: "description",
      label: "Object/Description",
      type: "select" as const,
      value: "",
      placeholder: "-- Pilih Deskripsi --",
      options: descriptions.map((desc) => ({
        value: desc.id.toString(),
        label: desc.object,
      })),
      required: true,
    },
    {
      id: "action",
      label: "Action",
      type: "text" as const,
      value: "",
      placeholder: "Enter action (e.g., OPEN_GATE, CREATE_ISSUE)",
      required: true,
    },
  ];

  const handleExport = () => {
    console.log("Exporting data...");
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Laporan</h1>
      </div>

      {/* Filter Section */}
      <div className="flex items-center mb-4 justify-between">
        {/* Bagian kiri: Filter */}
        <div className="flex space-x-2">
          <div className="relative z-50">
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
        </div>

        {/* Bagian kanan: Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsNewReportModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            <span>➕</span>
            <span>Tambah Laporan</span>
          </button>

          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
          >
            Export Data
          </button>
        </div>
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
          <CommonTable
            data={reports}
            columns={columns}
            showPagination={true}
            currentPage={issuesPagination.currentPage}
            totalPages={issuesPagination.totalPages}
            onPageChange={handleIssuesPageChange}
            itemsPerPage={issuesPagination.itemsPerPage}
            totalItems={issuesPagination.totalItems}
            onItemsPerPageChange={handleItemsReportPerPageChange}
          />
        )}
      </div>

      {/* New Report Modal */}
      <IsseFormInputModal
        isOpen={isNewReportModalOpen}
        onClose={() => setIsNewReportModalOpen(false)}
        onSubmit={handleNewReportSubmit}
        title="Tambah Laporan Baru"
        fields={newReportFields}
        confirmText="Submit"
        cancelText="Cancel"
      />
    </div>
  );
}
