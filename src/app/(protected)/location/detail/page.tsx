"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CommonTable, { Column } from "@/components/tables/CommonTable";
import {
  fetchGateByLocation,
  GateByLocation,
  openGate,
} from "@/hooks/useLocation";
import { toast, ToastContainer } from "react-toastify";
import { closeGate, pingArduino } from "@/hooks/useIOT";
import { ConfirmationModal } from "@/components/ConfirmationModalV2";

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// Komponen terpisah yang menggunakan useSearchParams
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
    itemsPerPage: 10,
  });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actioningGateId, setActioningGateId] = useState<number | null>(null);

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedGate, setSelectedGate] = useState<GateByLocation | null>(null);
  const [actionType, setActionType] = useState<"open" | "close">("open");

  const fetchGatesData = async () => {
    if (!locationId) return;

    try {
      setIsDataLoading(true);
      const gatesData = await fetchGateByLocation(parseInt(locationId));

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
    setActionType(gate.statusGate === 0 ? "close" : "open");
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedGate) return;

    try {
      setIsActionLoading(true);
      setActioningGateId(selectedGate.id);

      if (selectedGate.statusGate === 0) {
        // Gate is open, so close it
        await closeGate(selectedGate.id);
        toast.success(`Gate ${selectedGate.gate} berhasil ditutup`);
      } else {
        // Gate is closed, so open it
        console.log(selectedGate, "<<<gate");
        await pingArduino(selectedGate.id);
        await openGate(selectedGate.id);
        toast.success(`Gate ${selectedGate.gate} berhasil dibuka`);
      }

      // Refresh data after action
      await fetchGatesData();

      // Close modal
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

  const handlePageChange = (page: number) => {
    setGatePagination((prev) => ({ ...prev, currentPage: page }));
    // fetchGatesData(page, gatePagination.itemsPerPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setGatePagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    // fetchGatesData(1, newItemsPerPage);
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
    return status === 0 ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Open
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Closed
      </span>
    );
  };

  const getActionButton = (gate: GateByLocation) => {
    const isLoading = isActionLoading && actioningGateId === gate.id;
    const isOpen = gate.statusGate === 0;

    return (
      <button
        onClick={() => handleGateActionClick(gate)}
        disabled={isLoading || showConfirmModal}
        className={`${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        } text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {isOpen ? (
              <>
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Close Gate</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Open Gate</span>
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
    // {
    //   header: "Channel CCTV",
    //   accessor: "channel_cctv",
    // },
    // {
    //   header: "Arduino",
    //   accessor: "arduino",
    //   render: (value) => value?.toString() || "0",
    // },
    {
      header: "Status",
      accessor: "statusGate",
      render: (value) => getStatusBadge(value as number),
    },
    // {
    //   header: "Created At",
    //   accessor: "createdAt",
    //   render: (value) =>
    //     new Date(value as string).toLocaleDateString("id-ID", {
    //       year: "numeric",
    //       month: "short",
    //       day: "numeric",
    //       hour: "2-digit",
    //       minute: "2-digit",
    //     }),
    // },
    {
      header: "Updated At",
      accessor: "updatedAt",
      render: (value) =>
        new Date(value as string).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
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

    const isOpen = selectedGate.statusGate === 0;

    return {
      title: isOpen ? "Tutup Gate" : "Buka Gate",
      message: `Apakah Anda yakin ingin ${
        isOpen ? "menutup" : "membuka"
      } gate "${selectedGate.gate}"?`,
      confirmText: isOpen ? "Ya, Tutup Gate" : "Ya, Buka Gate",
      cancelText: "Batal",
    };
  };

  const modalContent = getModalContent();

  return (
    <>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-6 py-8">
              <ToastContainer />  
              <div className="flex items-center mb-6">
                <button
                  onClick={handleBack}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
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
                <div>
                  <h1 className="text-2xl font-bold">
                    Detail Lokasi: {decodeURIComponent(locationName || "")}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Daftar Gate untuk lokasi ini
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg p-6">
                {isDataLoading ? (
                  <div className="text-center py-8">
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
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5M9 5v-.5"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      Tidak ada gate ditemukan untuk lokasi ini
                    </p>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Confirmation Modal */}
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
    </>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
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

// Main component dengan Suspense wrapper
export default function LocationDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LocationDetailContent />
    </Suspense>
  );
}
