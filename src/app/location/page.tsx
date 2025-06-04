"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ConfirmationModal";
import CommonTable, { Column } from "@/components/tables/CommonTable";
import {
  createGate,
  fetchGateByLocation,
  fetchLocation,
  fetchLocationActive,
  fetchLocationById,
  LocationDetail,
} from "@/hooks/useLocation";
import DynamicInputModal from "@/components/DynamicInputModal";
import { toast } from "react-toastify";

interface Location {
  id: number;
  name: string;
  address: string;
  region?: string;
  vendor?: string;
}

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function LocationPage() {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation, ] = useState<Location | null>(
    null
  );
  const [isDataLoading, setIsDataLoading] = useState(false);

  // const handleDelete = (location: Location) => {
  //   setSelectedLocation(location);
  //   setIsDeleteModalOpen(true);
  // };

  // const handleEdit = (location: Location) => {
  //   setSelectedLocation(location);
  //   setIsEditModalOpen(true);
  // };

  const handleViewDetail = async (location: Location) => {
    try {
      // Navigate to detail page with location id
      router.push(
        `/location/detail?id=${location.id}&name=${encodeURIComponent(
          location.name
        )}`
      );
    } catch (error) {
      console.error("Error navigating to detail:", error);
      toast.error("Gagal membuka detail lokasi");
    }
  };

  const handleConfirmDelete = () => {
    // Implementasi delete disini
    console.log("Deleting location:", selectedLocation);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmEdit = () => {
    // Implementasi edit disini
    console.log("Editing location:", selectedLocation);
    setIsEditModalOpen(false);
  };

  const handleExport = () => {
    // Implementasi export data ke CSV/Excel
    console.log("Exporting data...");
  };

  // Tambahkan state untuk data lokasi
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationPagination, setLocationPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
  });

  const fetchLocationData = async (page = 1, limit = 5) => {
    try {
      setIsDataLoading(true);
      const locationsData = await fetchLocation(page, limit);
      if (locationsData && locationsData.data && locationsData.meta) {
        const mappedLocation: Location[] = locationsData.data.map(
          (loc, index) => {
            return {
              id: loc.id || index + 1, // Use actual ID from API
              name: loc.Name,
              address: loc.Code,
            };
          }
        );
        setLocationPagination({
          totalItems: locationsData.meta.totalItems,
          totalPages: locationsData.meta.totalPages,
          currentPage: locationsData.meta.page,
          itemsPerPage: locationsData.meta.limit,
        });
        setLocations(mappedLocation);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const [locationDetailData, setLocationDetailData] = useState<LocationDetail>({
    id: 0,
    Code: "",
    Name: "",
    Region: "",
    Vendor: "",
    VendorParkingCode: "",
    ShortName: "",
    Address: "",
    StartTime: "",
    EndTime: "",
    DateNext: 0,
    TimeZone: "",
    CreatedAt: "",
    UpdatedAt: "",
    DeletedAt: "",
    recordStatus: "",
  });

  const fetchLocationDetailData = async (id: number) => {
    try {
      setIsDataLoading(true);
      const locationDetailRes = await fetchLocationById(id);
      setLocationDetailData(locationDetailRes.data);
    } catch (error) {
      console.error("Error fetching Location detail:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchGateByLocationData = async (id: number) => {
    try {
      setIsDataLoading(true);
      const gateByLocationRes = await fetchGateByLocation(id);
      console.log(gateByLocationRes, "<<<<gateByLocation");
    } catch (error) {
      console.error("Error fetching gate by location:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchLocationActiveData = async (page = 1, limit = 5) => {
    try {
      setIsDataLoading(true);
      const locationsActiveData = await fetchLocationActive(page, limit);
      console.log(locationsActiveData, "<<<<locationsActiveData");
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
    fetchLocationDetailData(1);
    fetchGateByLocationData(1);
    fetchLocationActiveData();
    console.log(locationDetailData, "<<<<locationDetailData");
  }, []);

  const handleLocationPageChange = (page: number) => {
    setLocationPagination((prev) => ({ ...prev, currentPage: page }));
    fetchLocationData(page, locationPagination.itemsPerPage);
  };

  const columns: Column<Location>[] = [
    {
      header: "No",
      accessor: "id",
    },
    { header: "Name", accessor: "name" },
    { header: "Address", accessor: "address" },
    {
      header: "Aksi",
      accessor: "id",
      render: (_: Location[keyof Location], location: Location) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetail(location)}
            className="text-green-500 hover:text-green-600 transition-colors duration-200"
            title="Lihat Detail"
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
          {/* <button
            onClick={() => handleEdit(location)}
            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(location)}
            className="text-red-500 hover:text-red-600 transition-colors duration-200"
            title="Hapus"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button> */}
        </div>
      ),
    },
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const fields = [
    {
      id: "name",
      label: "Nama Lokasi",
      type: "text",
      value: "",
      placeholder: "Masukkan nama lokasi",
    },
  ];

  const handleSubmit = async (values: Record<string, string>) => {
    console.log("Form values:", values);
    try {
      await createGate(values);
      setIsAddModalOpen(false);
      toast.success("gate baru berhasil ditambahkan!");
    } catch (error) {
      setIsAddModalOpen(false);
      console.error("Gagal menambahkan gate baru:", error);
      toast.success("gate baru gagal ditambahkan!");
    }
  };

  const handleConfirmAdd = () => {
    // Implementasi add disini
    setIsAddModalOpen(false);
    setIsAddModalOpen(false);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setLocationPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchLocationData(1, newItemsPerPage);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Daftar Lokasi</h1>
              <div className="flex space-x-3">
                <button
                  onClick={handleExport}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Export Data</span>
                </button>
                <button
                  onClick={handleAdd}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Tambah Lokasi</span>
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
                    Memuat data location...
                  </p>
                </div>
              ) : locations.length === 0 ? (
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
                    Tidak ada lokasi ditemukan
                  </p>
                </div>
              ) : (
                <CommonTable
                  data={locations}
                  columns={columns}
                  showPagination={true}
                  currentPage={locationPagination.currentPage}
                  totalPages={locationPagination.totalPages}
                  onPageChange={handleLocationPageChange}
                  itemsPerPage={locationPagination.itemsPerPage}
                  totalItems={locationPagination.totalItems}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Konfirmasi Delete */}
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

      {/* Modal Konfirmasi Edit */}
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

      {/* Modal Tambah Lokasi */}
      <ConfirmationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleConfirmAdd}
        title="Tambah Lokasi"
        message="Apakah Anda yakin ingin menambah lokasi baru?"
        confirmText="Tambah"
        cancelText="Batal"
        type="edit"
      />

      {/* Modal Input */}
      <DynamicInputModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
        title="Form Input"
        fields={fields}
        confirmText="Simpan"
        cancelText="Batal"
      />
    </div>
  );
}