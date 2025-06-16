"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import ConfirmationModal from "@/components/ConfirmationModal";
import CommonTable, { Column } from "@/components/tables/CommonTable";
import {
  createGate,
  // fetchGateByLocation,
  fetchLocation,
  fetchLocationActive,
  // fetchLocationById,
  // LocationDetail,
} from "@/hooks/useLocation";
import DynamicInputModal from "@/components/DynamicInputModal";
import { toast } from "react-toastify";

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

export default function LocationPage() {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLocation] = useState<Location | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const handleViewDetail = async (location: Location) => {
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
  };

  const handleConfirmDelete = () => {
    console.log("Deleting location:", selectedLocation);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmEdit = () => {
    console.log("Editing location:", selectedLocation);
    setIsEditModalOpen(false);
  };

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
      console.log("DATA LOCATION : ", locationsData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  // const [, setLocationDetailData] = useState<LocationDetail>({
  //   id: 0,
  //   Code: "",
  //   Name: "",
  //   Region: "",
  //   Vendor: "",
  //   VendorParkingCode: "",
  //   ShortName: "",
  //   Address: "",
  //   StartTime: "",
  //   EndTime: "",
  //   DateNext: 0,
  //   TimeZone: "",
  //   CreatedAt: "",
  //   UpdatedAt: "",
  //   DeletedAt: "",
  //   recordStatus: "",
  // });

  // const fetchLocationDetailData = async (id: number) => {
  //   try {
  //     setIsDataLoading(true);
  //     const locationDetailRes = await fetchLocationById(id);
  //     setLocationDetailData(locationDetailRes.data);
  //   } catch (error) {
  //     console.error("Error fetching Location detail:", error);
  //   } finally {
  //     setIsDataLoading(false);
  //   }
  // };

  // const fetchGateByLocationData = async (id: number) => {
  //   try {
  //     setIsDataLoading(true);
  //     const gateByLocationRes = await fetchGateByLocation(id);
  //     console.log("Data gateByLocation :", gateByLocationRes);
  //   } catch (error) {
  //     console.error("Error fetching gate by location:", error);
  //   } finally {
  //     setIsDataLoading(false);
  //   }
  // };

  const fetchLocationActiveData = async (page = 1, limit = 5) => {
    try {
      setIsDataLoading(true);
      const locationsActiveData = await fetchLocationActive(page, limit);
      if (
        locationsActiveData &&
        locationsActiveData.data &&
        locationsActiveData.meta
      ) {
        const mappedLocation: Location[] = locationsActiveData.data.map(
          (loc, index) => {
            return {
              id: loc.id || index + 1,
              name: loc.Name,
              address: loc.Address,
            };
          }
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
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
    // fetchLocationDetailData(1);
    // fetchGateByLocationData(1);
    fetchLocationActiveData();
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
  ];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

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
    setIsConfirmationModalOpen(false);
    setIsAddModalOpen(true);
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
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=yes"
        />
      </Head>

      {/* Responsive container - hapus minWidth dan 
      X */}
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-hidden">
            {/* Container dengan padding responsif */}
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 w-full">
              {/* Header responsif */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-bold">Daftar Lokasi</h1>
                <div className="flex space-x-3">
                  {/* Button actions if needed */}
                </div>
              </div>

              {/* Table wrapper dengan proper horizontal scroll */}
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
                  </div>
                ) : (
                  /* Container untuk horizontal scroll - key fix di sini */
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
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
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
    </>
  );
}