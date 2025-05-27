"use client";

import { useState } from "react";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";

interface Category {
  id: number;
  name: string;
  createdDate: string;
}

interface Description {
  id: number;
  name: string;
  category: string;
  createdDate: string;
}

export default function MasterPage() {
  const [activeTab, setActiveTab] = useState<"category" | "description">(
    "category"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Data dummy untuk category
  const [categories] = useState<Category[]>([
    { id: 1, name: "Informasi", createdDate: "2024-01-20" },
    { id: 2, name: "Teknikal", createdDate: "2024-01-21" },
    { id: 3, name: "Fasilitas", createdDate: "2024-01-22" },
  ]);

  // Data dummy untuk description
  const [descriptions] = useState<Description[]>([
    {
      id: 1,
      name: "Informasi Gate",
      category: "Informasi",
      createdDate: "2024-01-20",
    },
    {
      id: 2,
      name: "Masalah Teknis",
      category: "Teknikal",
      createdDate: "2024-01-21",
    },
    {
      id: 3,
      name: "Fasilitas Rusak",
      category: "Fasilitas",
      createdDate: "2024-01-22",
    },
  ]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: categories.length + 1,
        name: newCategoryName,
        createdDate: new Date().toISOString().split("T")[0],
      };

      categories.push(newCategory);
      setNewCategoryName("");
      setShowAddModal(false);
    }
  };

  const [newDescription, setNewDescription] = useState({
    name: "",
    category: categories[0]?.name || "",
  });

  const handleAddDescription = () => {
    if (newDescription.name.trim() && newDescription.category) {
      const newDesc = {
        id: descriptions.length + 1,
        name: newDescription.name,
        category: newDescription.category,
        createdDate: new Date().toISOString().split("T")[0],
      };

      descriptions.push(newDesc);
      setNewDescription({ name: "", category: categories[0]?.name || "" });
      setShowAddModal(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Master Data
      </h1>

      {/* Tab Navigation */}
      <ul className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <li className="w-full mr-2">
          <button
            onClick={() => setActiveTab("category")}
            className={`w-full inline-block px-6 py-3 rounded-t-lg ${
              activeTab === "category"
                ? "bg-white dark:bg-[#222B36] text-blue-500 border-b-2 border-blue-500"
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

      {/* Modal Add Category */}
      {/* {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-500 flex items-center justify-center">
          <div className="bg-white dark:bg-[#222B36] rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Tambah Kategori Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Kategori
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#2A3441] text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama kategori"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )} */}

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
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
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
                  <select
                    value={newDescription.category}
                    onChange={(e) =>
                      setNewDescription((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full bg-gray-50 dark:bg-[#2A3441] text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={newDescription.name}
                    onChange={(e) =>
                      setNewDescription((prev) => ({
                        ...prev,
                        name: e.target.value,
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
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4">No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300">
                {categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2A3441]"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{category.name}</td>
                    <td className="p-4">{category.createdDate}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                          <FiEdit2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4">No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300">
                {descriptions.map((description, index) => (
                  <tr
                    key={description.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2A3441]"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{description.name}</td>
                    <td className="p-4">{description.category}</td>
                    <td className="p-4">{description.createdDate}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="p-2 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                          <FiEdit2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
