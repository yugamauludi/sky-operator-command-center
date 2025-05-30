/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Category {
  id: number;
  category: string;
  createdBy: string;
  modifyBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CategoriesResponse {
  code: number;
  message: string;
  data: Category[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

interface CategoryResponse {
  code: number;
  message: string;
  data: Category;
}
export const fetchCategories = async () => {
  try {
    // Menggunakan API route lokal untuk menyembunyikan URL asli
    const response = await fetch('/api/category');

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: CategoriesResponse = await response.json();

    // Periksa apakah data.data ada dan merupakan array
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      throw new Error('Format data tidak valid');
    }

  } catch (err) {
    console.error('Error fetching categories: ', err);
    throw err;

  }
};

export const fetchCategoryDetail = async (id: number) => {
  try {
    const response = await fetch(`/api/category/get-byid/${id.toString()}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data: CategoryResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error get detail category:', error);
    throw error;
  }
};

export const addCategory = async (category: any) => {
  try {
    // Dapatkan signature terlebih dahulu
    // const { timestamp, signature } = await getSignature();

    // const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const response = await fetch('/api/category/create', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'x-timestamp': timestamp,
        // 'x-signature': signature,
        // 'Authorization': `Bearer ${token}`
      },
      // credentials: "include",
      body: JSON.stringify(category)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menambahkan category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const editCategory = async (category: any) => {
  try {
    const response = await fetch(`/api/category/update-byid/${category.id.toString()}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: category.name})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal merubah category');
    }

    return await response.json();
  } catch (error) {
    console.error('Error editing category:', error);
    throw error;
  }
};


export const deleteCategory = async (id: number): Promise<void> => {
  try {

    const response = await fetch(`/api/category/deleted-byid/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menghapus kategori');
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};