"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
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

  // Force desktop view dengan CSS dan viewport
  useEffect(() => {
    // Set viewport untuk desktop width
    const setDesktopViewport = () => {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=1024, initial-scale=0.5, user-scalable=yes"
        );
      } else {
        viewport = document.createElement("meta");
        viewport.setAttribute("name", "viewport");
        viewport.setAttribute(
          "content",
          "width=1024, initial-scale=0.5, user-scalable=yes"
        );
        document.head.appendChild(viewport);
      }
    };

    // Tambahkan CSS untuk force desktop layout
    const addDesktopStyles = () => {
      const style = document.createElement("style");
      style.textContent = `
        /* Force desktop layout */
        html, body {
          min-width: 1024px !important;
          overflow-x: auto !important;
        }
        
        /* Table column width control */
        table {
          min-width: 800px !important;
          table-layout: fixed !important;
          width: 100% !important;
        }
        
        /* Specific column widths */
        table th:nth-child(1),
        table td:nth-child(1) {
          width: 60px !important;
          max-width: 60px !important;
          min-width: 60px !important;
          text-align: center !important;
        }
        
        table th:nth-child(2),
        table td:nth-child(2) {
          width: 200px !important;
          max-width: 200px !important;
          min-width: 200px !important;
        }
        
        table th:nth-child(3),
        table td:nth-child(3) {
          width: auto !important;
          min-width: 300px !important;
        }
        
        table th:nth-child(4),
        table td:nth-child(4) {
          width: 100px !important;
          max-width: 100px !important;
          min-width: 100px !important;
          text-align: center !important;
        }
        
        /* Disable responsive behaviors */
        * {
          min-width: auto !important;
        }
        
        /* Force container widths */
        .container {
          min-width: 1000px !important;
          max-width: none !important;
        }
        
        /* Disable mobile-first responsive classes */
        @media (max-width: 768px) {
          .sm\\:hidden { display: block !important; }
          .sm\\:block { display: block !important; }
          .sm\\:flex { display: flex !important; }
          .sm\\:grid { display: grid !important; }
          .sm\\:inline { display: inline !important; }
          .sm\\:inline-block { display: inline-block !important; }
        }
        
        /* Ensure buttons and elements maintain desktop size */
        button, input, select, textarea {
          min-height: 40px !important;
          font-size: 14px !important;
        }
        
        /* Force desktop padding and margins */
        .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
        .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        .py-8 { padding-top: 2rem !important; padding-bottom: 2rem !important; }
      `;
      document.head.appendChild(style);
    };

    setDesktopViewport();
    addDesktopStyles();

    // Cleanup function
    return () => {
      const customStyles = document.querySelectorAll("style");
      customStyles.forEach((style) => {
        if (style.textContent?.includes("Force desktop layout")) {
          style.remove();
        }
      });
    };
  }, []);

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
          content="width=1024, initial-scale=0.5, user-scalable=yes"
        />
      </Head>

      <div
        className="flex h-screen"
        style={{ minWidth: "1024px", overflowX: "auto" }}
      >
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div
              className="container mx-auto px-6 py-8"
              style={{ minWidth: "1000px" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daftar Lokasi</h1>
                <div className="flex space-x-3">
                  {/* Button actions if needed */}
                </div>
              </div>
              <div className="bg-white dark:bg-[#222B36] rounded-lg shadow-lg p-6">
                {isDataLoading ? (
                  <div className="text-center py-4">
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
                  <div style={{ minWidth: "800px", overflowX: "auto" }}>
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
                  </div>
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
