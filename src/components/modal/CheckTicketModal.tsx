/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { fetchLocation } from "@/hooks/useLocation";
import { fetchTransaction } from "@/hooks/useTransaction";
import { validateLicensePlate } from "@/utils/validationNumberPlat";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchableSelect from "@/components/input/SearchableSelect";
import formatTanggalUTC from "@/utils/formatDate";
import { formatDuration } from "@/utils/formatDuration";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStatusColor } from "@/utils/statusColorBedge";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Location {
  Code: string;
  Name: string;
}

interface TransactionResponse {
  // Sesuaikan dengan struktur data tiket kamu
  TransactionNo: string;
  [key: string]: any;
}

interface CheckTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckTicketModal({
  isOpen,
  onClose,
}: CheckTicketModalProps) {
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [keyword, setKeyword] = useState("");
  const [locationCode, setLocationCode] = useState("");
  const [date, setDate] = useState(getToday());
  const [dateObj, setDateObj] = useState<Date | null>(new Date());
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [plateError, setPlateError] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk hasil pencarian tiket
  const [ticketData, setTicketData] = useState<TransactionResponse | null>(
    null
  );
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // New state to track if search has been performed

  useEffect(() => {
    if (isOpen) {
      setKeyword("");
      setLocationCode("");
      setDate(getToday());
      setDateObj(new Date());
      setPlateError("");
      setTicketData(null);
      setNotFound(false);
      setHasSearched(false); // Reset search state when modal opens
      fetchAllLocations();
    }
  }, [isOpen]);

  // Sinkronisasi date string dan dateObj
  useEffect(() => {
    if (dateObj) {
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObj.getDate()).padStart(2, "0");
      setDate(`${yyyy}-${mm}-${dd}`);
    }
  }, [dateObj]);

  const fetchAllLocations = async () => {
    try {
      setLoadingLocations(true);
      const locationData = await fetchLocation(1, 1000);
      if (locationData && locationData.data) {
        setLocations(locationData.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Gagal memuat data lokasi");
    } finally {
      setLoadingLocations(false);
    }
  };

  const normalizeLicensePlate = (plate: string): string => {
    return plate.replace(/\s/g, "");
  };

  // Function to clear ticket data when inputs change
  const clearTicketData = () => {
    setTicketData(null);
    setNotFound(false);
    setHasSearched(false); // Reset search state when inputs change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      toast.error("Silakan masukkan nomor polisi");
      return;
    }

    if (!validateLicensePlate(trimmedKeyword)) {
      setPlateError(
        "Format nomor polisi tidak valid. Contoh: B 1234 ABC atau AB 123 CD"
      );
      return;
    }

    if (!locationCode) {
      toast.error("Silakan pilih lokasi");
      return;
    }

    if (!date) {
      toast.error("Silakan pilih tanggal");
      return;
    }

    setLoading(true);
    setTicketData(null);
    setNotFound(false);
    setHasSearched(true); // Mark that search has been performed

    try {
      const normalizedPlate = normalizeLicensePlate(trimmedKeyword);
      const data = await fetchTransaction(normalizedPlate, locationCode, date);

      if (
        !data ||
        !data.data ||
        (Array.isArray(data.data) && data.data.length === 0) ||
        (data.data &&
          typeof data.data === "object" &&
          Object.keys(data.data).length === 0)
      ) {
        setNotFound(true);
        setTicketData(null);
        return;
      }

      setTicketData(data.data);
      setNotFound(false);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      toast.error("Data tidak ditemukan");
      setNotFound(true);
      setTicketData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setKeyword(value);

    clearTicketData();

    if (value && !validateLicensePlate(value.replace(/\s/g, ""))) {
      setPlateError(
        "Format nomor polisi tidak valid. Contoh: B 1234 ABC atau AB 123 CD atau RI 1"
      );
    } else {
      setPlateError("");
    }
  };

  const handleLocationChange = (value: string) => {
    setLocationCode(value);
    clearTicketData();
  };

  const handleDateChange = (date: Date | null) => {
    setDateObj(date);
    clearTicketData();
  };

  const handleClose = () => {
    setKeyword("");
    setLocationCode("");
    setDate(getToday());
    setDateObj(new Date());
    setPlateError("");
    setTicketData(null);
    setNotFound(false);
    setHasSearched(false); // Reset search state when closing
    onClose();
  };

  const getVehicleStatus = (
    outTime: string | null,
    paymentStatus: string
  ): string => {
    if (outTime === null) {
      return "IN AREA";
    } else if (
      (outTime !== null && paymentStatus === "PAID") ||
      "FREE" ||
      null
    ) {
      return "OUT AREA";
    }
    return "UNKNOWN";
  };

  const vehicleStatus = getVehicleStatus(
    ticketData?.OutTime,
    ticketData?.PaymentStatus
  );

  // Determine what to show in the results section
  const shouldShowResults = hasSearched || loading;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-[1100px] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Cek Transaksi Parkir
          </h2>
          <button
            onClick={handleClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        {/* Form input - Responsive Stack */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-6">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-4">
            {/* Nomor Polisi */}
            <div className="flex-1 space-y-1">
              <label
                htmlFor="keyword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Nomor Polisi
              </label>
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={handleKeywordChange}
                placeholder="Contoh: B 1234 ABC"
                className={`w-full h-11 px-3 py-2 border ${
                  plateError
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100`}
              />
              {plateError && (
                <div className="text-xs text-red-600 dark:text-red-400 flex items-start">
                  <svg
                    className="w-3 h-3 mt-0.5 mr-1 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="leading-tight">{plateError}</span>
                </div>
              )}
              {!plateError && keyword && (
                <div className="text-xs text-green-600 dark:text-green-400">
                  Format nomor polisi valid
                </div>
              )}
            </div>

            {/* Lokasi */}
            <div className="flex-1 space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Lokasi
              </label>
              <div className="h-11 relative">
                <SearchableSelect
                  options={locations.map((loc) => ({
                    value: loc.Code,
                    label: loc.Name,
                  }))}
                  value={locationCode}
                  onChange={handleLocationChange}
                  placeholder="-- Pilih Lokasi --"
                  disabled={loadingLocations}
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Tanggal */}
            <div className="flex-1 space-y-1">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tanggal
              </label>
              <div className="h-11">
                <DatePicker
                  selected={dateObj}
                  onChange={handleDateChange}
                  dateFormat="dd MMM yyyy"
                  className="w-full h-11 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholderText="Pilih tanggal"
                  maxDate={new Date()}
                  id="date"
                  showPopperArrow={true}
                  autoComplete="off"
                  wrapperClassName="block w-full h-11"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Results Section */}
        {shouldShowResults ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 mt-6">
            {loading ? (
              <div className="text-center py-4 p-6">
                <div className="three-body">
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 blink-smooth">
                  Memuat data...
                </p>
              </div>
            ) : notFound ? (
              <div className="text-center text-red-500 dark:text-red-400 font-semibold py-8">
                Data tiket tidak ditemukan.
              </div>
            ) : ticketData ? (
              <div className="space-y-4">
                {/* Mobile: Stack all cards vertically */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                  {/* Transaksi Card */}
                  <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Transaksi
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Nomor Transaksi
                        </div>
                        <div className="text-sm font-mono bg-white dark:bg-gray-800 rounded px-2 py-1 break-all">
                          {ticketData?.TransactionNo}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Status Pembayaran
                        </div>
                        {ticketData.PaymentStatus ? (
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              ticketData.PaymentStatus
                            )}`}
                          >
                            {ticketData.PaymentStatus}
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                            tidak ada data
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Tarif
                        </div>
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded">
                          {formatCurrency(Number(ticketData?.TariffAmount))}
                        </div>
                      </div>
                      {ticketData.PaymentStatus === "PAID" && (
                        <>
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Waktu Pembayaran
                            </div>
                            <div className="text-sm font-semibold bg-white dark:bg-gray-800 px-2 py-1 rounded">
                              {ticketData?.paymentTIme}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Metode Pembayaran
                            </div>
                            <div className="text-sm font-semibold bg-white dark:bg-gray-800 px-2 py-1 rounded">
                              {ticketData.paymentMethod}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Issuer Name
                            </div>
                            <div className="text-sm font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded break-all">
                              {ticketData.issuerInfo || "-"}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Kendaraan Card */}
                  <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Kendaraan
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          vehicleStatus
                        )}`}
                      >
                        {vehicleStatus}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Jenis Kendaraan
                        </div>
                        <div className="text-sm font-semibold">
                          {ticketData.VehicleType}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Plat Masuk
                        </div>
                        <div className="text-sm font-mono bg-white dark:bg-gray-800 rounded px-2 py-1">
                          {ticketData.LicensePlateIn}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Plat Keluar
                        </div>
                        <div className="text-sm font-mono bg-white dark:bg-gray-800 rounded px-2 py-1">
                          {ticketData.LicensePlateOut || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lokasi Card */}
                  <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Lokasi
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Nama Lokasi
                        </div>
                        <div className="text-sm font-semibold">
                          {ticketData.locationInfo?.Name || "-"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {ticketData.GateInCode && (
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Gate Masuk
                            </div>
                            <div className="text-sm bg-white dark:bg-gray-800 rounded px-2 py-1">
                              {ticketData.GateInCode}
                            </div>
                          </div>
                        )}
                        {ticketData.GateOutCode && (
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Gate Keluar
                            </div>
                            <div className="text-sm bg-white dark:bg-gray-800 rounded px-2 py-1">
                              {ticketData.GateOutCode}
                            </div>
                          </div>
                        )}
                      </div>
                      {ticketData?.gracePeriod && (
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Grace Period
                          </div>
                          <div className="text-sm text-gray-900 dark:text-white">
                            {ticketData?.gracePeriod
                              ? `${ticketData.gracePeriod} menit`
                              : "Tidak ada"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Waktu Card */}
                  <div className="bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Waktu
                    </div>
                    <div className="space-y-3">
                      {ticketData.InTime && (
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Waktu Masuk
                          </div>
                          <div className="text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded">
                            {formatTanggalUTC(ticketData.InTime)}
                          </div>
                        </div>
                      )}
                      {ticketData.OutTime && (
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Waktu Keluar
                          </div>
                          <div className="text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded">
                            {formatTanggalUTC(ticketData.OutTime)}
                          </div>
                        </div>
                      )}
                      {ticketData.Duration != null &&
                        typeof ticketData.Duration === "number" &&
                        ticketData.Duration > 0 && (
                          <div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Durasi Parkir
                            </div>
                            <div className="text-sm text-orange-700 dark:text-orange-300 font-bold text-center bg-white dark:bg-gray-800 px-2 py-1 rounded">
                              {formatDuration(ticketData.Duration)}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 mt-6">
            <div className="text-center py-8">
              <div className="flex flex-col items-center space-y-3">
                <svg
                  className="w-16 h-16 text-gray-400 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <div className="text-gray-500 dark:text-gray-400">
                  <div className="text-lg font-medium mb-1">
                    Silakan Masukkan Data Pencarian
                  </div>
                  <div className="text-sm">
                    Masukkan nomor polisi, pilih lokasi, dan tanggal untuk
                    mencari transaksi parkir
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer - Fixed */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex-shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !!plateError}
              onClick={handleSubmit}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-md text-sm font-medium text-white transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading || plateError
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Mencari..." : "Cek Transaksi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
