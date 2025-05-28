"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import {
  addCategory,
  Category,
  deleteCategory,
  fetchCategories,
  fetchCategoryDetail,
  editCategory,
} from "@/hooks/useCategories";
import CommonTable, { Column } from "@/components/tables/CommonTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addDescription,
  Description,
  fetchDescriptions,
} from "@/hooks/useDescriptions";
import { CustomSelect } from "@/components/CustomSelect";

interface CategoryData {
  id: number | null;
  categoryName: string;
}

export default function MasterPage() {
  const [activeTab, setActiveTab] = useState("category");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState<CategoryData>({
    id: null,
    categoryName: "",
  });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [categoryName, setCategoryName] = useState<
    { id: number; name: string }[]
  >([]);

  const fetchCategoriesData = async () => {
    try {
      setIsDataLoading(true);
      const categoriesData = await fetchCategories();
      console.log(categoriesData, "<<<<<");
      const category = categoriesData.map((category) => ({
        id: category.id,
        name: category.category,
      }));
      setCategoryName(category);

      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchDescriptionData = async () => {
    try {
      setIsDataLoading(true);
      const descriptionsData = await fetchDescriptions();
      setDescriptions(descriptionsData);
    } catch (error) {
      console.error("Error fetching descriptions:", error);
    } finally {
      setIsDataLoading(false);
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

  useEffect(() => {
    fetchCategoriesData();
    fetchDescriptionData();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const handleEditCategory = (id: number) => {
    setIsEditing(true);
    fetchCategoryDetailData(id);
  };
  // Define columns for Category table
  const categoryColumns: Column<Category>[] = [
    {
      header: "No",
      accessor: "id",
      render: (value, item) => {
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
    },
    {
      header: "Aksi",
      accessor: "id",
      render: (value, item) => (
        <div className="flex space-x-2">
          <button
            className="p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400"
            onClick={() => handleEditCategory(item.id)}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteCategory(item.id)}
            className="p-2 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const descriptionColumns: Column<Description>[] = [
    {
      header: "No",
      accessor: "id",
      render: (value, item) => {
        const index = descriptions.findIndex((desc) => desc.id === item.id);
        return index + 1;
      },
    },
    {
      header: "Name",
      accessor: "object",
      // render: (value) => value
    },
    {
      header: "Category",
      accessor: "id_category",
      // render: (value) => value
    },
    {
      header: "Created Date",
      accessor: "createdAt",
      // render: (value) => value
    },
    {
      header: "Action",
      accessor: "id",
      render: () => (
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
            <FiEdit2 size={16} />
          </button>
          <button className="p-2 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400">
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const [newDescription, setNewDescription] = useState<{
    category: number | null;
    desc: string;
  }>({
    category: null,
    desc: "",
  });

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
      fetchCategoriesData();
      setShowAddModal(false);
    } catch (error) {
      setShowAddModal(false);
      setIsEditing(false);
      if (isEditing) {
        console.error("Gagal mengubah kategori:", error);
      } else {
        console.error("Gagal menambahkan kategori:", error);
      }
    }
  };

  const handleAddDescription = async () => {
    try {
      await addDescription({
        name: newDescription.desc,
        idDescription: newDescription.category,
      });
      fetchDescriptionData();
      toast.success("Deskripsi berhasil ditambahkan!");
      setShowAddModal(false);
    } catch (error) {
      setShowAddModal(false);
      console.error("Gagal menambahkan deskripsi:", error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      // setIsConfirmationOpen(false);
      toast.success("Data kategori berhasil dihapus");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Gagal menghapus data kategori");
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Master Data
      </h1>

      {/* Tab Navigation */}
      <ul className="flex border-b border-gray-200 dark:border-gray-900 mb-6">
        <li className="w-full mr-2">
          <button
            onClick={() => setActiveTab("category")}
            className={`w-full inline-block px-6 py-3 rounded-t-lg ${
              activeTab === "category"
                ? "bg-white dark:bg-[#222B36] text-blue-500 border-b-2 border-gray-500"
                : "bg-gray-200 dark:bg-[#2A3441] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2F3B4B]"
            }`}
          >
            Kategori
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={() => setActiveTab("description")}
            className={`w-full inline-block px-6 py-3 rounded-t-lg ${
              activeTab === "description"
                ? "bg-white dark:bg-[#222B36] text-blue-500 border-b-2 border-blue-500"
                : "bg-gray-200 dark:bg-[#2A3441] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2F3B4B]"
            }`}
          >
            Deskripsi
          </button>
        </li>
      </ul>

      {/* Modal Add Category/Description */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-500 flex items-center justify-center">
          <div className="bg-white dark:bg-[#222B36] rounded-lg p-6 w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Tambah {activeTab === "category" ? "Kategori" : "Deskripsi"}{" "}
                Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
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

        {/* Tables */}
        <div className="overflow-x-auto">
          {activeTab === "category" ? (
            <>
              {isDataLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Memuat data kategori...
                  </p>
                </div>
              ) : (
                <CommonTable
                  columns={categoryColumns}
                  data={categories}
                  className="text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                />
              )}
            </>
          ) : (
            <CommonTable
              columns={descriptionColumns}
              data={descriptions}
              className="text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
            />
          )}
        </div>
      </div>
    </div>
  );
}
