/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, Suspense, lazy } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Column } from "@/components/tables/CommonTable";
// Replace regular imports with lazy ones
const CommonTable = lazy(() => import("@/components/tables/CommonTable"));
const IsseFormInputModal = lazy(() => import("@/components/IssueFormInputModal"));
import { Field } from "@/components/IssueFormInputModal";
import { addIssue, fetchIssues } from "@/hooks/useIssues";
import { Category, fetchCategories } from "@/hooks/useCategories";
import { Description, fetchDescriptions } from "@/hooks/useDescriptions";
import { toast } from "react-toastify";
import { formatDateOnly } from "@/utils/formatDate";
import {
  fetchGateByLocation,
  fetchLocationActive,
  GateByLocation,
  Location,
} from "@/hooks/useLocation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { validateIndonesianLicensePlate } from "@/utils/validationNumberPlat";

interface Report {
  no?: number;
  duration?: string;
  call: string;
  location: string;
  category: string;
  description: string;
  solution: string;
  formatDate: string;
  rawDate: Date;
}

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface NewReportData {
  idLocation: number;
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
  const [locationData, setLocationData] = useState<Location[]>([]);
  const [gateIdData, setGateIdData] = useState<GateByLocation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [issuesPagination, setIssuesPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
  });

  // Filter states
  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // Form field values state to track location changes
  const [formFieldValues, setFormFieldValues] = useState<
    Record<string, string>
  >({});

  // Load ALL data for frontend filtering
  const fetchAllIssuesData = async () => {
    try {
      setIsDataLoading(true);
      // Fetch a large number to get all data (adjust based on your needs)
      const issuesData = await fetchIssues(1, 10000); // or use a separate API endpoint that returns all data
      if (issuesData && issuesData.data && issuesData.meta) {
        const mappedReports: Report[] = issuesData.data.map((issue, index) => {
          const createdDate = new Date(issue.createdAt);
          // const day = createdDate.toLocaleDateString("en-US", {
          //   weekday: "long",
          // });
          // const date = createdDate.toISOString().split("T")[0]; // YYYY-MM-DD
          // const time = createdDate.toLocaleTimeString("en-US", {
          //   hour: "2-digit",
          //   minute: "2-digit",
          // });

          const formatDate = formatDateOnly(issue.createdAt);

          return {
            no: index + 1,
            formatDate,
            duration: "30 mins",
            call: issue.ticket,
            location: issue.lokasi,
            category: issue.category,
            description: issue.description,
            solution: issue.action || "No solution provided",
            rawDate: createdDate, // Store raw date for filtering
          };
        });
        setReports(mappedReports);
        // Set initial pagination for frontend filtering
        setIssuesPagination({
          totalItems: mappedReports.length,
          totalPages: Math.ceil(mappedReports.length / 5),
          currentPage: 1,
          itemsPerPage: 5,
        });
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Filter logic using useMemo for performance
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Date filter
      const dateMatch =
        !searchDate ||
        report?.rawDate?.toDateString() === searchDate?.toDateString();

      // Location filter (case insensitive)
      const locationMatch =
        !searchLocation ||
        report?.location
          ?.toLowerCase()
          ?.includes(searchLocation?.toLowerCase());

      // Category filter (case insensitive)
      const categoryMatch =
        !searchCategory ||
        report?.category
          ?.toLowerCase()
          ?.includes(searchCategory?.toLowerCase());

      return dateMatch && locationMatch && categoryMatch;
    });
  }, [reports, searchDate, searchLocation, searchCategory]);

  // Update pagination info based on filtered data
  const filteredPagination = useMemo(() => {
    const totalFilteredItems = filteredReports.length;
    const totalFilteredPages = Math.ceil(
      totalFilteredItems / issuesPagination.itemsPerPage
    );
    const currentPage = Math.min(
      issuesPagination.currentPage,
      totalFilteredPages || 1
    );

    return {
      ...issuesPagination,
      totalItems: totalFilteredItems,
      totalPages: totalFilteredPages,
      currentPage: currentPage,
    };
  }, [
    filteredReports,
    issuesPagination,
  ]);

  // Get paginated filtered data
  const paginatedFilteredReports = useMemo(() => {
    const startIndex =
      (filteredPagination.currentPage - 1) * filteredPagination.itemsPerPage;
    const endIndex = startIndex + filteredPagination.itemsPerPage;

    return filteredReports.slice(startIndex, endIndex).map((report, index) => ({
      ...report,
      no: startIndex + index + 1, // Renumber based on current page
    }));
  }, [
    filteredReports,
    filteredPagination.currentPage,
    filteredPagination.itemsPerPage,
  ]);

  const fetchLocationData = async () => {
    try {
      const response = await fetchLocationActive(1, 1000);
      setLocationData(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchGateData = async (data: any) => {
    try {
      const response = await fetchGateByLocation(data);
      setGateIdData(response.data);
    } catch (error) {
      console.error("Error fetching gates:", error);
      setGateIdData([]);
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
  };

  const handleItemsReportPerPageChange = (newItemsPerPage: number) => {
    setIssuesPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
  };

  // Handle field value changes in modal
  const handleFieldValueChange = (fieldId: string, value: string) => {
    setFormFieldValues((prev) => {
      const newValues = { ...prev, [fieldId]: value };

      // If location changed, clear gate selection and fetch new gates
      if (fieldId === "idLocation") {
        // Clear gate selection
        newValues.idGate = "";

        // Fetch gates for new location
        if (value) {
          fetchGateData({
            id: parseInt(value),
            page: 1,
            limit: 1000,
          });
        } else {
          setGateIdData([]); // Clear gates if no location selected
        }
      }

      return newValues;
    });
  };

  const handleNewReportSubmit = async (values: Record<string, string>) => {
    try {
      setIsDataLoading(true);

      const newReportData: NewReportData = {
        idLocation: parseInt(values.idLocation),
        idCategory: parseInt(values.idCategory),
        idGate: parseInt(values.idGate) || 0,
        description: values.description,
        action: values.action,
        foto: values.foto || "-",
        number_plate: values.number_plate || "-",
        TrxNo: values.TrxNo || "-",
      };

      await addIssue(newReportData);

      // Refresh all data after successful creation
      await fetchAllIssuesData();
      toast.success("Report Created successfully!");
      // Clear form values and gate data
      setFormFieldValues({});
      setGateIdData([]);
    } catch (error) {
      console.error("Error creating new report:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchDate(null);
    setSearchLocation("");
    setSearchCategory("");
    setIssuesPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Check if any filter is active
  const hasActiveFilters = searchDate || searchLocation || searchCategory;

  // Handle modal close
  const handleModalClose = () => {
    setIsNewReportModalOpen(false);
    setFormFieldValues({});
    setGateIdData([]);
  };

  useEffect(() => {
    fetchAllIssuesData(); // Load all data once
    fetchCategoriesData();
    fetchDescriptionsData();
    fetchLocationData();
  }, []);

  const columns: Column<Report>[] = [
    { header: "No.", accessor: "no" },
    { header: "Date", accessor: "formatDate", width: 100 },
    { header: "Lokasi", accessor: "location" },
    { header: "Kategori", accessor: "category" },
    { header: "Deskripsi", accessor: "description" },
    { header: "Solusi", accessor: "solution" },
  ];

  // Format current date and time for default values
  // const currentDate = new Date();
  // const formattedDate = currentDate.toISOString().split("T")[0];
  // const formattedInTime = currentDate.toLocaleTimeString("en-GB", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  // });

  const newReportFields: Field[] = [
    // Required input fields based on your specification - arranged for left-right layout
    {
      id: "idLocation",
      label: "Location",
      type: "select" as const,
      value: formFieldValues.idLocation || "",
      placeholder: "-- Pilih Location --",
      options: locationData?.map((loc) => ({
        value: loc.id.toString(),
        label: loc.Name,
      })),
      required: true,
      onChange: (value) => handleFieldValueChange("idLocation", value),
    },
    {
      id: "idCategory",
      label: "Kategori",
      type: "select" as const,
      value: formFieldValues.idCategory || "",
      placeholder: "-- Pilih Kategori --",
      options: categories.map((cat) => ({
        value: cat.id.toString(),
        label: cat.category,
      })),
      required: true,
      onChange: (value) => handleFieldValueChange("idCategory", value),
    },
    {
      id: "idGate",
      label: "ID Gate",
      type: "select" as const,
      value: formFieldValues.idGate || "",
      placeholder: formFieldValues.idLocation
        ? "-- Pilih Gate --"
        : "-- Pilih Location dulu --",
      options:
        gateIdData?.map((gate) => ({
          value: gate.id.toString(),
          label: `Gate ${gate.id}`,
        })) || [],
      required: true,
      disabled: !formFieldValues.idLocation,
      onChange: (value) => handleFieldValueChange("idGate", value),
    },
    {
      id: "description",
      label: "Object/Description",
      type: "select" as const,
      value: formFieldValues.description || "",
      placeholder: "-- Pilih Deskripsi --",
      options: descriptions.map((desc) => ({
        // value: desc.id.toString(),
        value: desc.object,
        label: desc.object,
      })),
      required: true,
      onChange: (value) => handleFieldValueChange("description", value),
    },
    {
      id: "TrxNo",
      label: "Transaction Number",
      type: "text" as const,
      value: formFieldValues.TrxNo || "",
      placeholder: "Enter transaction number",
      required: true,
      onChange: (value) => handleFieldValueChange("TrxNo", value),
    },
    {
      id: "action",
      label: "Action",
      type: "text" as const,
      value: formFieldValues.action || "",
      placeholder: "Enter action (e.g., OPEN_GATE, CREATE_ISSUE)",
      required: true,
      onChange: (value) => handleFieldValueChange("action", value),
    },
    {
      id: "number_plate",
      label: "Number Plate",
      type: "text",
      value: formFieldValues.number_plate || "",
      placeholder: "Contoh: B1234XYZ",
      required: true,
      validation: validateIndonesianLicensePlate,
      onChange: (value) => {
        // Konversi input ke uppercase
        const upperValue = value.toUpperCase();
        handleFieldValueChange("number_plate", upperValue);
      }
    },
    {
      id: "foto",
      label: "Foto",
      type: "text" as const,
      value: formFieldValues.foto || "-",
      placeholder: "Photo URL or path",
      required: false,
      onChange: (value) => handleFieldValueChange("foto", value),
    },

    // COMMENTED OUT - Information Section (not required for input)
    /*
    {
      id: "no_transaction",
      label: "No Transaction",
      type: "text" as const,
      value: "-",
      placeholder: "No Transaction",
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
    */
  ];

  // const handleExport = () => {
  //   console.log("Exporting filtered data:", filteredReports);
  //   // You can implement CSV export or other export functionality here
  // };

  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-8">              {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Laporan</h1>
      </div>

      {/* Wrap DatePicker with Suspense */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 space-y-2 sm:space-y-0 justify-between">
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-start sm:items-center w-full sm:w-auto">
          <div className="relative z-40 w-full sm:w-auto">
            <DatePicker
              selected={searchDate}
              onChange={(date) => setSearchDate(date)}
              className="px-4 py-2 border rounded-lg pl-10 w-full sm:w-auto"
              placeholderText="Cari Tanggal"
              dateFormat="yyyy-MM-dd"
              isClearable
              maxDate={new Date()}
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="flex items-center justify-between px-2 py-2">
                  <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                    <IoIosArrowBack />
                  </button>
                  <select
                    value={date.getMonth()}
                    onChange={({ target: { value } }) => changeMonth(Number(value))}
                    className="mx-1 px-2 py-1 border rounded"
                  >
                    {[
                      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ].map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={date.getFullYear()}
                    onChange={({ target: { value } }) => changeYear(Number(value))}
                    className="mx-1 px-2 py-1 border rounded"
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                    <IoIosArrowForward />
                  </button>
                </div>
              )}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              📅
            </span>
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari Lokasi"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="px-4 py-2 border rounded-lg pl-10 w-full sm:w-auto"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              📍
            </span>
          </div>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Cari Kategori"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg pl-10 w-full sm:w-auto"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm w-full sm:w-auto whitespace-nowrap"
              title="Clear all filters"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <button
            onClick={() => setIsNewReportModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center justify-center space-x-2"
          >
            <span>➕</span>
            <span>Tambah Laporan</span>
          </button>

          {/* <button
              onClick={handleExport}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
            >
              Export Data
            </button> */}
        </div>
      </div>

      {/* Filter Results Info */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium">Filter aktif:</span>
              {searchDate && (
                <span className="ml-2 inline-block bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                  Tanggal: {searchDate.toLocaleDateString("id-ID")}
                </span>
              )}
              {searchLocation && (
                <span className="ml-2 inline-block bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                  Lokasi: {searchLocation}
                </span>
              )}
              {searchCategory && (
                <span className="ml-2 inline-block bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">
                  Kategori: {searchCategory}
                </span>
              )}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              Menampilkan {filteredReports.length} dari {reports.length} data
            </div>
          </div>
        </div>
      )}

      {/* Wrap Table with Suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg p-6">
          {isDataLoading ? (
            <div className="text-center py-4">
              <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>{" "}
              <p className="text-gray-600 dark:text-gray-300 blink-smooth">
                Memuat data laporan...
              </p>
            </div>
          ) : filteredReports.length === 0 && hasActiveFilters ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium mb-2">
                  Tidak ada data ditemukan
                </h3>
                <p className="text-sm">Coba ubah filter pencarian Anda</p>
              </div>
            </div>
          ) : (
            <CommonTable
              data={paginatedFilteredReports}
              columns={columns as any}
              showPagination={true}
              currentPage={filteredPagination.currentPage}
              totalPages={filteredPagination.totalPages}
              onPageChange={handleIssuesPageChange}
              itemsPerPage={filteredPagination.itemsPerPage}
              totalItems={filteredPagination.totalItems}
              onItemsPerPageChange={handleItemsReportPerPageChange}
            />
          )}
        </div>
      </Suspense>

      {/* Wrap Modal with Suspense */}
      <Suspense fallback={null}>
        <IsseFormInputModal
          isOpen={isNewReportModalOpen}
          onClose={handleModalClose}
          onSubmit={handleNewReportSubmit}
          title="Tambah Laporan Baru"
          fields={newReportFields}
          confirmText="Submit"
          cancelText="Cancel"
        />
      </Suspense>
    </div>
  );
}
