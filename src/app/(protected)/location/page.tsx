"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, lazy, Suspense, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ConfirmationModal = lazy(() => import("@/components/ConfirmationModal"));
const CommonTable = lazy(() => import("@/components/tables/CommonTable"));
const DynamicInputModal = lazy(() => import("@/components/DynamicInputModal"));
const ActivateLocationModal = lazy(() => import("@/components/ActivateLocationModal"));

import {
  createGate,
  fetchLocationActive,
} from "@/hooks/useLocation";

import type { Column } from "@/components/tables/CommonTable";

interface Location {
  id: number;
  name: string;
  address: string | undefined;
  region?: string;
  vendor?: string;
}

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

const TableSkeleton = () => (
  <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg w-full p-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ModalSkeleton = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function LocationPage() {
  const router = useRouter();
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [locations, setLocations] = useState<Location[]>([]);
  const [locationPagination, setLocationPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isActivateLocationModalOpen, setIsActivateLocationModalOpen] = useState(false);

  const fields = useMemo(() => [
    {
      id: "name",
      label: "Nama Lokasi",
      type: "text",
      value: "",
      placeholder: "Masukkan nama lokasi",
    },
  ], []);

  const handleViewDetail = useCallback(async (location: Location) => {
    try {
      router.push(
        `/location/detail?id=${location.id}&name=${encodeURIComponent(
          location.name
        )}`
      );
    } catch (error) {
      console.error("Error navigating to detail:", error);
      toast.error("Gagal membuka detail lokasi");
    }
  }, [router]);

  const handleOpenActivateLocationModal = useCallback(() => {
    setIsActivateLocationModalOpen(true);
  }, []);

  const handleActivateLocationSuccess = useCallback(() => {
    fetchLocationActiveData(locationPagination.currentPage, locationPagination.itemsPerPage);
    toast.success("Data lokasi aktif telah diperbarui");
  }, []);

  // const handleConfirmDelete = useCallback(() => {
  //   console.log("Deleting location:", selectedLocation);
  //   setIsDeleteModalOpen(false);
  // }, [selectedLocation]);

  // const handleConfirmEdit = useCallback(() => {
  //   console.log("Editing location:", selectedLocation);
  //   setIsEditModalOpen(false);
  // }, [selectedLocation]);

  const fetchLocationActiveData = useCallback(async (page = 1, limit = 5) => {
    try {
      setIsDataLoading(true);
      const locationsActiveData = await fetchLocationActive(page, limit);

      if (
        locationsActiveData &&
        locationsActiveData.data &&
        locationsActiveData.meta
      ) {
        const mappedLocation: Location[] = locationsActiveData.data.map(
          (loc, index) => ({
            id: loc.id || index + 1,
            name: loc.Name,
            address: loc.Address,
          })
        );

        setLocationPagination({
          totalItems: locationsActiveData.meta.totalItems,
          totalPages: locationsActiveData.meta.totalPages,
          currentPage: locationsActiveData.meta.page,
          itemsPerPage: locationsActiveData.meta.limit,
        });
        setLocations(mappedLocation);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Gagal memuat data lokasi aktif");
    } finally {
      setIsDataLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  const handleSubmit = useCallback(async (values: Record<string, string>) => {
    try {
      await createGate(values);
      setIsAddModalOpen(false);
      toast.success("gate baru berhasil ditambahkan!");
      fetchLocationActiveData(locationPagination.currentPage, locationPagination.itemsPerPage);
    } catch (error) {
      setIsAddModalOpen(false);
      console.error("Gagal menambahkan gate baru:", error);
      toast.error("gate baru gagal ditambahkan!");
    }
  }, [fetchLocationActiveData, locationPagination.currentPage, locationPagination.itemsPerPage]);

  const handleConfirmAdd = useCallback(() => {
    setIsConfirmationModalOpen(false);
    setIsAddModalOpen(true);
  }, []);

  // // Debounced fetch function to prevent multiple rapid calls
  // const fetchLocationData = useCallback(async (page = 1, limit = 5) => {
  //   try {
  //     setIsDataLoading(true);
  //     const locationsData = await fetchLocation(page, limit);
  //     console.log("DATA LOCATION : ", locationsData);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //     toast.error("Gagal memuat data lokasi");
  //   } finally {
  //     setIsDataLoading(false);
  //   }
  // }, []);

  // Optimized page change handler
  const handleLocationPageChange = useCallback((page: number) => {
    setLocationPagination((prev) => ({ ...prev, currentPage: page }));
    fetchLocationActiveData(page, locationPagination.itemsPerPage);
  }, [fetchLocationActiveData, locationPagination.itemsPerPage]);

  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setLocationPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchLocationActiveData(1, newItemsPerPage);
  }, [fetchLocationActiveData]);

  const columns: Column<Location>[] = useMemo(() => [
    {
      header: "No",
      accessor: "id",
      render: (value, item) => {
        const index = locations.findIndex((cat) => cat.id === item.id);
        return index + 1;
      },
    },
    { header: "Name", accessor: "name" },
    { header: "Address", accessor: "address", maxWidth: "720px" },
    {
      header: "Aksi",
      accessor: "id",
      render: (_: Location[keyof Location], location: Location) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetail(location)}
            className="text-green-500 hover:text-green-600 transition-colors duration-200"
            title="Lihat Detail"
            style={{ minWidth: "40px", minHeight: "40px" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ], [locations, handleViewDetail]);

  useEffect(() => {
    const initializeData = async () => {
      await fetchLocationActiveData();
    };

    initializeData();
  }, [fetchLocationActiveData]);

  return (
    <>
      {/* <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=yes"
        />
      </Head> */}
      <div className="w-full max-w-8xl mx-auto px-2 sm:px-4 py-6">
        <div className="flex flex-col w-full">
          <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-hidden bg-white rounded-lg shadow-lg dark:bg-[#222B36]">
              <div className="w-full px-4 sm:px-6 py-4 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h1 className="text-xl sm:text-2xl font-bold">Daftar Lokasi</h1>
                  <div className="flex space-x-3">
                    {/* Button untuk aktivasi lokasi */}
                    <button
                      onClick={handleOpenActivateLocationModal}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Aktifkan Lokasi
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 p-4 rounded">
                    <h2 className="text-lg font-medium text-indigo-700 dark:text-indigo-400 mb-2">
                      Manajemen Lokasi
                    </h2>
                    <p className="text-indigo-600/80 dark:text-indigo-300/80">
                      Halaman ini digunakan untuk mengelola informasi lokasi gerbang
                      parkir yang tersedia. Setiap lokasi mencakup detail seperti nama
                      lokasi, alamat, dan informasi terkait lainnya. Anda dapat
                      melihat detail lengkap setiap lokasi dengan mengklik tombol
                      lihat detail pada tabel. Gunakan tombol &quot;Aktifkan Lokasi&quot; untuk
                      mengaktifkan lokasi yang belum aktif.
                    </p>
                  </div>
                </div>

                {/* Table Section with Lazy Loading */}
                {isInitialLoad ? (
                  <TableSkeleton />
                ) : (
                  <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg w-full">
                    {isDataLoading ? (
                      <div className="text-center py-4 p-6">
                        <div className="three-body">
                          <div className="three-body__dot"></div>
                          <div className="three-body__dot"></div>
                          <div className="three-body__dot"></div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 blink-smooth">
                          Memuat data location...
                        </p>
                      </div>
                    ) : locations.length === 0 ? (
                      <div className="text-center py-8 p-6">
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
                          Tidak ada lokasi ditemukan
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Gunakan tombol &quot;Aktifkan Lokasi&quot; untuk mengaktifkan lokasi baru
                        </p>
                      </div>
                    ) : (
                      <Suspense fallback={<TableSkeleton />}>
                        <CommonTable
                          data={locations}
                          columns={columns as any}
                          showPagination={true}
                          currentPage={locationPagination.currentPage}
                          totalPages={locationPagination.totalPages}
                          onPageChange={handleLocationPageChange}
                          itemsPerPage={locationPagination.itemsPerPage}
                          totalItems={locationPagination.totalItems}
                          onItemsPerPageChange={handleItemsPerPageChange}
                        />
                      </Suspense>
                    )}
                  </div>
                )}
              </div>
            </main>
          </div>

          {/* Lazy Loaded Modals */}
          {/* {isDeleteModalOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <ConfirmationModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
              title="Konfirmasi Hapus"
              message={`Apakah Anda yakin ingin menghapus lokasi ${selectedLocation?.name}?`}
              confirmText="Hapus"
              cancelText="Batal"
              type="delete"
            />
          </Suspense>
        )} */}

          {/* {isEditModalOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <ConfirmationModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onConfirm={handleConfirmEdit}
              title="Konfirmasi Edit"
              message={`Anda akan mengubah data lokasi ${selectedLocation?.name}`}
              confirmText="Edit"
              cancelText="Batal"
              type="edit"
            />
          </Suspense>
        )} */}

          {isConfirmationModalOpen && (
            <Suspense fallback={<ModalSkeleton />}>
              <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={handleConfirmAdd}
                title="Tambah Lokasi"
                message="Apakah Anda yakin ingin menambah lokasi baru?"
                confirmText="Tambah"
                cancelText="Batal"
                type="edit"
              />
            </Suspense>
          )}

          {isAddModalOpen && (
            <Suspense fallback={<ModalSkeleton />}>
              <DynamicInputModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleSubmit}
                title="Form Input"
                fields={fields}
                confirmText="Simpan"
                cancelText="Batal"
              />
            </Suspense>
          )}

          {/* Modal Aktivasi Lokasi */}
          {isActivateLocationModalOpen && (
            <Suspense fallback={<ModalSkeleton />}>
              <ActivateLocationModal
                isOpen={isActivateLocationModalOpen}
                onClose={() => setIsActivateLocationModalOpen(false)}
                onSuccess={handleActivateLocationSuccess}
              />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
}