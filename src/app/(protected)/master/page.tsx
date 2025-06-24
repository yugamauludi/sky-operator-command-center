"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */


import { useState, useEffect, lazy, Suspense } from "react";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {
  addCategory,
  Category,
  deleteCategory,
  fetchCategories,
  fetchCategoryDetail,
  editCategory,
} from "@/hooks/useCategories";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addDescription,
  Description,
  fetchDescriptions,
  fetchDescriptionByCategoryId,
  editDescription,
  deleteDescription,
} from "@/hooks/useDescriptions";
import { CustomSelect } from "@/components/CustomSelect";
import formatTanggalUTC from "@/utils/formatDate";
import NoData from "@/components/NoData";

// Lazy load komponen yang berat
const CommonTable = lazy(() => import("@/components/tables/CommonTable"));

// Define Column interface to match your CommonTable expectations
interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, item: T) => React.ReactNode;
}

// Komponen loading skeleton
const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
    ))}
  </div>
);

// Komponen loading untuk tab content
const TabContentLoader = () => (
  <div className="text-center py-8">
    <div className="three-body">
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
      <div className="three-body__dot"></div>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mt-4">Memuat data...</p>
  </div>
);

interface CategoryData {
  id: number | null;
  categoryName: string;
}

interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

// Custom hook untuk lazy loading data
const useDataLoader = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set());

  const markTabAsLoaded = (tab: string) => {
    setLoadedTabs(prev => new Set(prev).add(tab));
    setIsInitialLoad(false);
  };

  const isTabLoaded = (tab: string) => loadedTabs.has(tab);

  return { isInitialLoad, markTabAsLoaded, isTabLoaded };
};

export default function MasterPage() {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("category");
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<CategoryData>({
    id: null,
    categoryName: "",
  });
  const [categoryName, setCategoryName] = useState<
    { id: number; name: string }[]
  >([]);
  const [newDescription, setNewDescription] = useState<{
    id?: number;
    category: number | null;
    desc: string;
  }>({
    category: null,
    desc: "",
  });
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [categoryPagination, setCategoryPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 5,
  });
  const [descriptionPagination, setDescriptionPagination] =
    useState<PaginationInfo>({
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      itemsPerPage: 5,
    });

  const {
    // isInitialLoad,
    markTabAsLoaded,
    isTabLoaded
  } = useDataLoader();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch functions dengan lazy loading
  const fetchCategoriesData = async (page = 1, limit = 5, isLazy = false) => {
    try {
      setIsDataLoading(true);

      // Jika lazy loading dan data sudah ada, skip fetch
      if (isLazy && categories.length > 0) {
        setIsDataLoading(false);
        return;
      }

      const categoriesData = await fetchCategories(page, limit);
      if (categoriesData.data && categoriesData.meta) {
        setCategories(categoriesData.data);
        setCategoryPagination({
          totalItems: categoriesData.meta.totalItems,
          totalPages: categoriesData.meta.totalPages,
          currentPage: categoriesData.meta.page,
          itemsPerPage: categoriesData.meta.limit,
        });

        const category = categoriesData.data.map((category: Category) => ({
          id: category.id,
          name: category.category,
        }));
        setCategoryName(category);
      } else {
        const categoriesDataArr = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.data || [];
        setCategories(categoriesDataArr);

        const totalItems = categoriesDataArr.length;
        const totalPages = Math.ceil(totalItems / limit);
        setCategoryPagination({
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        });

        const category = categoriesDataArr.map((category: Category) => ({
          id: category.id,
          name: category.category,
        }));
        setCategoryName(category);
      }

      markTabAsLoaded("category");
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsDataLoading(false);
      markTabAsLoaded("category");
    }
  };

  const fetchDescriptionData = async (page = 1, limit = 5, isLazy = false) => {
    try {
      setIsDataLoading(true);

      // Jika lazy loading dan data sudah ada, skip fetch
      if (isLazy && descriptions.length > 0) {
        setIsDataLoading(false);
        return;
      }

      const descriptionsData = await fetchDescriptions(page, limit);
      if (descriptionsData.data && descriptionsData.meta) {
        setDescriptions(descriptionsData.data);
        setDescriptionPagination({
          totalItems: descriptionsData.meta.totalItems,
          totalPages: descriptionsData.meta.totalPages,
          currentPage: descriptionsData.meta.page,
          itemsPerPage: descriptionsData.meta.limit,
        });
      } else {
        const descriptionsDataArr = Array.isArray(descriptionsData)
          ? descriptionsData
          : descriptionsData.data || [];
        setDescriptions(descriptionsDataArr);

        const totalItems = descriptionsDataArr.length;
        const totalPages = Math.ceil(totalItems / limit);
        setDescriptionPagination({
          totalItems,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        });
      }

      markTabAsLoaded("description");
    } catch (error) {
      console.error("Error fetching descriptions:", error);
    } finally {
      setIsDataLoading(false);
      markTabAsLoaded("description");

    }
  };

  // Handle tab change dengan lazy loading
  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);

    // Lazy load data hanya ketika tab diklik dan belum pernah dimuat
    if (!isTabLoaded(tab)) {
      if (tab === "category") {
        await fetchCategoriesData(1, 5, true);
      } else if (tab === "description") {
        await fetchDescriptionData(1, 5, true);
      }
    }
  };

  const fetchCategoryDetailData = async (id: number) => {
    try {
      setIsDataLoading(true);
      const categoryDetailData = await fetchCategoryDetail(id);
      if (categoryDetailData?.category) {
        setNewCategoryName({
          id: categoryDetailData.id,
          categoryName: categoryDetailData.category,
        });
        setShowAddModal(true);
      } else {
        console.warn("Category not found in response");
        setNewCategoryName({ id: null, categoryName: "" });
      }
    } catch (error) {
      console.error("Error fetching category detail:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchDescriptionByCategoryIdData = async (id: number) => {
    try {
      setIsDataLoading(true);
      const descriptionDetailData = await fetchDescriptionByCategoryId(id);

      const category = categories.find(
        (cat) => cat.id === descriptionDetailData.id_category
      );

      setNewDescription({
        id: descriptionDetailData.id,
        category: category?.id || null,
        desc: descriptionDetailData.object,
      });
      setShowAddModal(true);
    } catch (error) {
      console.error("Error fetching category detail:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Initial load - hanya load tab yang aktif
  useEffect(() => {
    if (activeTab === "category") {
      fetchCategoriesData();
    }
  }, [activeTab]);

  const handleEditCategory = (id: number) => {
    setIsEditing(true);
    fetchCategoryDetailData(id);
  };

  const handleEditDescription = (id: number) => {
    setIsEditing(true);
    fetchDescriptionByCategoryIdData(id);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsConfirmationOpen(true);
  };

  // Fixed column definitions with proper typing
  const getCategoryColumns = (): Column<Category>[] => [
    {
      header: "No",
      accessor: "id",
      render: (value: any, item: Category) => {
        const index = categories.findIndex((cat) => cat.id === item.id);
        return index + 1;
      },
    },
    {
      header: "Kategori",
      accessor: "category",
    },
    {
      header: "Dibuat Oleh",
      accessor: "createdBy",
    },
    {
      header: "Tanggal Dibuat",
      accessor: "createdAt",
      render: (value: any) => (value ? formatTanggalUTC(value.toString()) : ""),
    },
    {
      header: "Aksi",
      accessor: "id",
      render: (value: any, item: Category) => (
        <div className="flex space-x-2">
          <button
            className="p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"
            onClick={() => handleEditCategory(item.id)}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-2 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const getDescriptionColumns = (): Column<Description>[] => [
    {
      header: "No",
      accessor: "id",
      render: (value: any, item: Description) => {
        const index = descriptions.findIndex((desc) => desc.id === item.id);
        return index + 1;
      },
    },
    {
      header: "Name",
      accessor: "object",
    },
    {
      header: "Kategori",
      accessor: "id_category",
    },
    {
      header: "Tanggal Dibuat",
      accessor: "createdAt",
      render: (value: any) => (value ? formatTanggalUTC(value.toString()) : ""),
    },
    {
      header: "Action",
      accessor: "id",
      render: (value: any, item: Description) => (
        <div className="flex space-x-2">
          <button
            className="p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"
            onClick={() => handleEditDescription(item.id)}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-2 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Rest of the handlers remain the same...
  const handleAddCategory = async () => {
    try {
      if (isEditing) {
        await editCategory({
          id: newCategoryName.id,
          name: newCategoryName.categoryName,
        });
        toast.success("Kategori berhasil diubah!");
        setIsEditing(false);
      } else {
        await addCategory({
          name: newCategoryName,
        });
        toast.success("Kategori berhasil ditambahkan!");
      }
    } catch (error) {
      setShowAddModal(false);
      if (isEditing) {
        console.error("Gagal mengubah kategori:", error);
      } else {
        console.error("Gagal menambahkan kategori:", error);
      }
    } finally {
      fetchCategoriesData();
      setShowAddModal(false);
      resetFormState();
    }
  };

  const handleAddDescription = async () => {
    try {
      if (isEditing) {
        await editDescription({
          id: newDescription.id,
          name: newDescription.desc,
          idDescription: newDescription.id,
        });
        toast.success("Deskripsi berhasil diubah!");
      } else {
        await addDescription({
          name: newDescription.desc,
          idDescription: newDescription.category,
        });
        toast.success("Deskripsi berhasil ditambahkan!");
      }
    } catch (error) {
      setShowAddModal(false);
      if (isEditing) {
        console.error("Gagal mengubah deskripsi:", error);
      } else {
        console.error("Gagal menambahkan deskripsi:", error);
      }
      setIsEditing(false);
    } finally {
      fetchDescriptionData();
      setShowAddModal(false);
      resetFormState();
    }
  };

  const actionDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setIsConfirmationOpen(false);
      toast.success("Data kategori berhasil dihapus");
      fetchCategoriesData();
    } catch (error) {
      setIsConfirmationOpen(false);
      console.error("Error deleting category:", error);
      toast.error("Gagal menghapus data kategori");
    }
  };

  const actionDeleteDescription = async (id: number) => {
    try {
      await deleteDescription(id);
      setIsConfirmationOpen(false);
      toast.success("Data deskripsi berhasil dihapus");
      fetchDescriptionData();
    } catch (error) {
      setIsConfirmationOpen(false);
      console.error("Error deleting deskripsi:", error);
      toast.error("Gagal menghapus data deskripsi");
    }
  };

  const handleCategoryPageChange = (page: number) => {
    setCategoryPagination((prev) => ({ ...prev, currentPage: page }));
    fetchCategoriesData(page, categoryPagination.itemsPerPage);
  };

  const handleDescriptionPageChange = (page: number) => {
    setDescriptionPagination((prev) => ({ ...prev, currentPage: page }));
    fetchDescriptionData(page, descriptionPagination.itemsPerPage);
  };

  const resetFormState = () => {
    setNewCategoryName({
      id: null,
      categoryName: "",
    });
    setNewDescription({
      category: null,
      desc: "",
    });
    setDeleteId(null);
    setIsEditing(false);
  };

  const handleItemsCategoryPerPageChange = (newItemsPerPage: number) => {
    setCategoryPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchCategoriesData(1, newItemsPerPage);
  };

  const handleItemsDescriptionPerPageChange = (newItemsPerPage: number) => {
    setDescriptionPagination((prev) => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
    fetchDescriptionData(1, newItemsPerPage);
  };

  console.log(categories, descriptions);


  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-8">              {/* Header */}
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Master Data
      </h1>

      {/* Tab Navigation */}
      <ul className="flex border-b border-gray-200 dark:border-gray-900 mb-6">
        <li className="w-full mr-2">
          <button
            onClick={() => handleTabChange("category")}
            className={`w-full inline-block px-6 py-3 rounded-t-lg transition-colors ${activeTab === "category"
              ? "bg-white dark:bg-[#222B36] text-blue-500 border-b-2 border-gray-500"
              : "bg-gray-200 dark:bg-[#2A3441] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2F3B4B]"
              }`}
          >
            Kategori
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={() => handleTabChange("description")}
            className={`w-full inline-block px-6 py-3 rounded-t-lg transition-colors ${activeTab === "description"
              ? "bg-white dark:bg-[#222B36] text-blue-500 border-b-2 border-blue-500"
              : "bg-gray-200 dark:bg-[#2A3441] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2F3B4B]"
              }`}
          >
            Deskripsi
          </button>
        </li>
      </ul>

      {/* Description Text */}
      <div className="mb-6">
        {activeTab === "category" ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
            <h2 className="text-lg font-medium text-blue-700 dark:text-blue-400 mb-2">
              Manajemen Kategori
            </h2>
            <p className="text-blue-600/80 dark:text-blue-300/80">
              Halaman ini digunakan untuk mengelola kategori permasalahan yang dapat terjadi di gerbang.
              Setiap kategori akan menjadi pengelompokan utama untuk berbagai jenis permasalahan yang mungkin dihadapi.
            </p>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
            <h2 className="text-lg font-medium text-green-700 dark:text-green-400 mb-2">
              Manajemen Deskripsi Permasalahan
            </h2>
            <p className="text-green-600/80 dark:text-green-300/80">
              Halaman ini memungkinkan Anda mengelola deskripsi detail dari setiap permasalahan.
              Setiap deskripsi terhubung dengan kategori tertentu dan memberikan penjelasan spesifik tentang jenis masalah yang dapat terjadi.
            </p>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="bg-white dark:bg-[#222B36] rounded-lg p-6">
        {/* Add Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            + Tambah {activeTab === "category" ? "Kategori" : "Deskripsi"}
          </button>
        </div>

        {/* Tables with Lazy Loading */}
        <div className="overflow-x-auto">
          {activeTab === "category" ? (
            <>
              {!isTabLoaded("category") || isDataLoading ? (
                <TabContentLoader />
              ) : categories.length === 0 ? (
                <NoData message="Belum ada data kategori yang tersedia. Silakan refresh halaman untuk mencoba lagi." />
              ) : (
                <Suspense fallback={<TableSkeleton />}>
                  <CommonTable
                    data={categories}
                    columns={getCategoryColumns() as any}
                    showPagination={true}
                    currentPage={categoryPagination.currentPage}
                    totalPages={categoryPagination.totalPages}
                    onPageChange={handleCategoryPageChange}
                    itemsPerPage={categoryPagination.itemsPerPage}
                    totalItems={categoryPagination.totalItems}
                    onItemsPerPageChange={handleItemsCategoryPerPageChange}
                    className="text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                  />
                </Suspense>
              )}
            </>
          ) : (
            <>
              {!isTabLoaded("description") || isDataLoading ? (
                <TabContentLoader />
              ) : descriptions.length === 0 ? (
                <NoData message="Belum ada data deskripsi yang tersedia. Silakan refresh halaman untuk mencoba lagi." />
              ) : (
                <Suspense fallback={<TableSkeleton />}>
                  <CommonTable
                    columns={getDescriptionColumns() as any}
                    data={descriptions}
                    showPagination={true}
                    currentPage={descriptionPagination.currentPage}
                    totalPages={descriptionPagination.totalPages}
                    onPageChange={handleDescriptionPageChange}
                    itemsPerPage={descriptionPagination.itemsPerPage}
                    totalItems={descriptionPagination.totalItems}
                    onItemsPerPageChange={handleItemsDescriptionPerPageChange}
                    className="text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                  />
                </Suspense>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Add Category/Description */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-1050">
          <div className="bg-white dark:bg-[#222B36] rounded-lg p-6 w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isEditing ? "Ubah" : "Tambah"}{" "}
                {activeTab === "category" ? "Kategori" : "Deskripsi"}{" "}
                {isEditing ? "" : "Baru"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetFormState();
                }}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            {activeTab === "category" ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={newCategoryName.categoryName}
                  onChange={(e) => {
                    const { id } = newCategoryName;
                    setNewCategoryName({
                      id: id,
                      categoryName: e.target.value,
                    });
                  }}
                  className="w-full bg-gray-50 dark:bg-[#2A3441] text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama kategori"
                />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kategori
                  </label>
                  <CustomSelect
                    options={categoryName}
                    value={newDescription.category}
                    onChange={(value) =>
                      setNewDescription((prev) => ({
                        ...prev,
                        category: value,
                      }))
                    }
                    isDisabled={isEditing}
                    placeholder="Pilih kategori"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={newDescription.desc}
                    onChange={(e) =>
                      setNewDescription((prev) => ({
                        ...prev,
                        desc: e.target.value,
                      }))
                    }
                    className="w-full min-h-[150px] bg-gray-50 dark:bg-[#2A3441] text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan deskripsi"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={
                  activeTab === "category"
                    ? handleAddCategory
                    : handleAddDescription
                }
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete Category/Description */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-500 flex items-center justify-center">
          <div className="bg-white dark:bg-[#222B36] rounded-lg p-6 w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Hapus {activeTab === "category" ? "Kategori" : "Deskripsi"}
              </h3>
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Apakah Anda yakin ingin menghapus{" "}
              {activeTab === "category" ? "kategori" : "deskripsi"} ini?
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (activeTab === "category" && deleteId) {
                    actionDeleteCategory(deleteId);
                  } else if (activeTab === "description" && deleteId) {
                    actionDeleteDescription(deleteId);
                  }
                }}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}