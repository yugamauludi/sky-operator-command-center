"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CommonTable, { Column } from "@/components/tables/CommonTable";
import {
  fetchGateByLocation,
  GateByLocation,
  createGate,
} from "@/hooks/useLocation";
import { toast } from "react-toastify";
import { changeStatusGate } from "@/hooks/useIOT";
import { ConfirmationModal } from "@/components/modal/ConfirmationModalV2";
import formatTanggalUTC from "@/utils/formatDate";
import GreenDownArrow from "@/public/icons/GreenDownArrow"
import RedCross from "@/public/icons/RedCross";
import NoData from "@/components/NoData";

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

function LocationDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationId = searchParams.get("id");
  const locationName = searchParams.get("name");

  const [gates, setGates] = useState<GateByLocation[]>([]);
  const [gatePagination, setGatePagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
  });
  const reqParams = { id: locationId, page: gatePagination.currentPage, limit: gatePagination.itemsPerPage };
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actioningGateId, setActioningGateId] = useState<number | null>(null);

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedGate, setSelectedGate] = useState<GateByLocation | null>(null);
  const [actionType, setActionType] = useState<"open" | "close">("open");
  const [arrowType, setArrowType] = useState<"open" | "close">("open");
  const [ledArrowStatus, setLedArrowStatus] = useState<Record<number, boolean>>({});
  const [showLedArrowModal, setShowLedArrowModal] = useState(false);
  const [selectedLedGate, setSelectedLedGate] = useState<GateByLocation | null>(null);

  // Add Gate Modal state
  const [showAddGateModal, setShowAddGateModal] = useState(false);
  const [gateName, setGateName] = useState("");
  const [isAddingGate, setIsAddingGate] = useState(false);

  const handleLedArrowClick = (gate: GateByLocation) => {
    setSelectedLedGate(gate);
    setShowLedArrowModal(true);
    setArrowType(ledArrowStatus[gate.id] ? "close" : "open");
  };

  const handleConfirmLedArrow = () => {
    if (selectedLedGate) {
      setLedArrowStatus(prev => ({
        ...prev,
        [selectedLedGate.id]: !(prev[selectedLedGate.id] ?? true)
      }));
    }
    setShowLedArrowModal(false);
    setSelectedLedGate(null);
  };

  const handleCancelLedArrow = () => {
    setShowLedArrowModal(false);
    setSelectedLedGate(null);
  };

  const fetchGatesData = async () => {
    if (!locationId) return;

    try {
      setIsDataLoading(true);
      const gatesData = await fetchGateByLocation(reqParams);

      if (gatesData && gatesData.data && gatesData.meta) {
        setGates(gatesData.data);
        setGatePagination({
          totalItems: gatesData.meta.totalItems,
          totalPages: gatesData.meta.totalPages,
          currentPage: gatesData.meta.page,
          itemsPerPage: gatesData.meta.limit,
        });
      }
    } catch (error) {
      console.error("Error fetching gates:", error);
      toast.error("Gagal memuat data gate");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleGateActionClick = (gate: GateByLocation) => {
    setSelectedGate(gate);
    setActionType(gate.statusGate === 1 ? "close" : "open");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedGate) return;

    try {
      setIsActionLoading(true);
      setActioningGateId(selectedGate.id);

      if (selectedGate.statusGate === 0) {
        await changeStatusGate(selectedGate.id, "OPEN");
        toast.success(`Gate ${selectedGate.gate} berhasil dibuka`);
      } else {
        await changeStatusGate(selectedGate.id, "CLOSE");
        toast.success(`Gate ${selectedGate.gate} berhasil ditutup`);
      }

      await fetchGatesData();

      setShowConfirmModal(false);
      setSelectedGate(null);
    } catch (error) {
      console.error("Error performing gate action:", error);
      toast.error("Gagal melakukan aksi pada gate");
    } finally {
      setIsActionLoading(false);
      setActioningGateId(null);
    }
  };

  const handleCancelAction = () => {
    if (!isActionLoading) {
      setShowConfirmModal(false);
      setSelectedGate(null);
    }
  };

  const handleAddGateClick = () => {
    setShowAddGateModal(true);
    setGateName("");
  };

  const handleAddGateConfirm = async () => {
    if (!gateName.trim()) {
      toast.error("Nama gate tidak boleh kosong");
      return;
    }

    if (!locationId) {
      toast.error("ID lokasi tidak ditemukan");
      return;
    }

    try {
      setIsAddingGate(true);

      const gateData = {
        id: parseInt(locationId),
        name: gateName.trim()
      };

      await createGate(gateData);
      toast.success("Gate berhasil ditambahkan");

      await fetchGatesData();

      setShowAddGateModal(false);
      setGateName("");
    } catch (error) {
      console.error("Error adding gate:", error);
      toast.error(error instanceof Error ? error.message : "Gagal menambahkan gate");
    } finally {
      setIsAddingGate(false);
    }
  };

  const handleAddGateCancel = () => {
    if (!isAddingGate) {
      setShowAddGateModal(false);
      setGateName("");
    }
  };

  const handlePageChange = (page: number) => {
    setGatePagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setGatePagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (locationId) {
      fetchGatesData();
    }
  }, [locationId]);

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Open
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Closed
      </span>
    );
  };

  const getActionButton = (gate: GateByLocation) => {
    const isLoading = isActionLoading && actioningGateId === gate.id;
    const isOpen = gate.statusGate === 1;

    return (
      <button
        onClick={() => handleGateActionClick(gate)}
        disabled={isLoading || showConfirmModal}
        className={`${isOpen
          ? "bg-red-500 hover:bg-red-600"
          : "bg-green-500 hover:bg-green-600"
          } cursor-pointer text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 min-w-0`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white flex-shrink-0"></div>
            <span className="hidden sm:inline">Loading...</span>
          </>
        ) : (
          <>
            {isOpen ? (
              <>
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sm:inline">Close</span>
                {/* <span className="sm:hidden">X</span> */}
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sm:inline">Open</span>
                {/* <span className="sm:hidden">▶</span> */}
              </>
            )}
          </>
        )}
      </button>
    );
  };

  const columns: Column<GateByLocation>[] = [
    {
      header: "No",
      accessor: "id",
      render: (value, item) => {
        const index = gates.findIndex((gate) => gate.id === item.id);
        return index + 1;
      },
    },
    {
      header: "Gate",
      accessor: "gate",
    },
    {
      header: "Status",
      accessor: "statusGate",
      render: (value) => getStatusBadge(value as number),
    },
    {
      header: "Updated At",
      accessor: "updatedAt",
      render: (value) =>
        formatTanggalUTC(value as string) || "Tidak ada data",
    },
    {
      header: "LED Arrow",
      accessor: "id",
      render: (_, gate) => {
        const isOn = ledArrowStatus[gate.id] ?? true; // default true (hijau)
        return (
          <button
            className="p-1 cursor-pointer  rounded hover:bg-green-100 transition"
            title={isOn ? "Matikan LED Arrow" : "Nyalakan LED Arrow"}
            onClick={() => handleLedArrowClick(gate)}
          >
            {isOn ? (
              <GreenDownArrow className="w-6 h-6 text-green-500" />
            ) : (
              <RedCross className="w-6 h-6 text-red-500" />
            )}
          </button>
        );
      },
    },
    {
      header: "Aksi",
      accessor: "id",
      render: (_, gate) => getActionButton(gate as GateByLocation),
    },
  ];

  const getModalContent = () => {
    if (!selectedGate)
      return { title: "", message: "", confirmText: "", cancelText: "" };

    const isOpen = selectedGate.statusGate === 1;

    return {
      title: isOpen ? "Tutup Gate" : "Buka Gate",
      message: `Apakah Anda yakin ingin ${isOpen ? "menutup" : "membuka"
        } gate "${selectedGate.gate}"?`,
      confirmText: isOpen ? "Ya, Tutup Gate" : "Ya, Buka Gate",
      cancelText: "Batal",
    };
  };

  const modalContent = getModalContent();

  return (
    <>
      <div className="w-full max-w-8xl mx-auto px-2 sm:px-4 py-6">
        <div className="w-full">
          <main className="flex-1 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-[#222B36]">
            <div className="w-full px-4 sm:px-6 py-4 sm:py-8 max-w-none">
              {/* Header Section - Improved for mobile */}
              <div className="flex items-start mb-4 sm:mb-6">
                <button
                  onClick={handleBack}
                  className="cursor-pointer mr-3 sm:mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    Detail Lokasi: {decodeURIComponent(locationName || "")}
                  </h1>
                  <div className="text-gray-700 dark:text-gray-200 mt-2 space-y-2 text-base sm:text-[1.05rem] leading-relaxed">
                    <p>
                      Manajemen gate parkir untuk lokasi ini. Anda dapat memantau dan mengontrol status setiap gate secara real-time.
                    </p>
                    <div className="text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium">Gate terbuka (Open)</span>
                        <span className="text-gray-500 dark:text-gray-400">- Kendaraan dapat keluar/masuk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                        <span className="font-medium">Gate tertutup (Closed)</span>
                        <span className="text-gray-500 dark:text-gray-400">- Akses kendaraan ditutup</span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm">
                        <span className="font-bold">LED Arrow</span> menunjukkan status gate parkir:
                        <br />
                        <span>
                          Jika <GreenDownArrow className="inline w-4 h-4 text-green-500 align-middle mx-1" />
                          <span className="font-semibold text-green-600">panah hijau</span>, gate <b>dapat digunakan</b> untuk keluar/masuk kendaraan.
                          Jika <RedCross className="inline w-4 h-4 text-red-500 align-middle mx-1" />
                          <span className="font-semibold text-red-500">silang merah</span>, gate sedang <b>trouble</b> (misal: ada masalah pembayaran atau kendaraan tidak bisa keluar/masuk).
                          {/* <br />
                          <span className="ml-0 sm:ml-5">
                            Saat gate bermasalah, <b>kendaraan diarahkan ke gate lain</b> agar tidak terjadi antrian panjang.
                          </span> */}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Gate Button Section */}
              <div className="mb-4 sm:mb-6 flex justify-end">
                <button
                  onClick={handleAddGateClick}
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  disabled={isDataLoading}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Tambah Gate Baru</span>
                </button>
              </div>


              {/* Content Section */}
              <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg overflow-x-auto">
                {isDataLoading ? (
                  <div className="text-center py-8 px-4">
                    <div className="three-body">
                      <div className="three-body__dot"></div>
                      <div className="three-body__dot"></div>
                      <div className="three-body__dot"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 blink-smooth mt-4">
                      Memuat data gate...
                    </p>
                  </div>
                ) : gates.length === 0 ? (
                  <NoData message="Tidak ada gate ditemukan untuk lokasi ini" />
                ) : (
                  <div className="p-3 sm:p-6">
                    <CommonTable
                      data={gates}
                      columns={columns}
                      showPagination={true}
                      currentPage={gatePagination.currentPage}
                      totalPages={gatePagination.totalPages}
                      onPageChange={handlePageChange}
                      itemsPerPage={gatePagination.itemsPerPage}
                      totalItems={gatePagination.totalItems}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Confirmation Modal for Gate Actions */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.confirmText}
        cancelText={modalContent.cancelText}
        isLoading={isActionLoading}
        type={actionType}
      />

      {/* LED Arrow Modal */}
      {showLedArrowModal && selectedLedGate && (
        <ConfirmationModal
          isOpen={showLedArrowModal}
          onClose={handleCancelLedArrow}
          onConfirm={handleConfirmLedArrow}
          title={
            (ledArrowStatus[selectedLedGate.id] ?? true)
              ? "Matikan LED Arrow"
              : "Nyalakan LED Arrow"
          }
          message={`Apakah Anda yakin ingin ${(ledArrowStatus[selectedLedGate.id] ?? true) ? "mematikan" : "menyalakan"
            } LED Arrow pada gate "${selectedLedGate.gate}"?`}
          confirmText="Ya, Lanjutkan"
          cancelText="Batal"
          isLoading={false}
          type={arrowType}
        />
      )}

      {/* Add Gate Modal */}
      {showAddGateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/20 dark:bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tambah Gate Baru
              </h3>

              <div className="mb-4">
                <label
                  htmlFor="gateName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Nama Gate
                </label>
                <input
                  type="text"
                  id="gateName"
                  value={gateName}
                  onChange={(e) => setGateName(e.target.value)}
                  placeholder="Masukkan nama gate..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isAddingGate}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleAddGateCancel}
                  disabled={isAddingGate}
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddGateConfirm}
                  disabled={isAddingGate || !gateName.trim()}
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAddingGate ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Menambahkan...</span>
                    </>
                  ) : (
                    <span>Tambah Gate</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full">
        <main className="w-full">
          <div className="w-full px-4 sm:px-6 py-4 sm:py-8">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600 mt-4">Memuat halaman...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LocationDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LocationDetailContent />
    </Suspense>
  );
}