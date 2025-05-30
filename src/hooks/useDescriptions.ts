export interface Description {
    id: number;
    id_category: number;
    object: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    createdBy: string;
    modifyBy: null;
}

interface DescriptionResponse {
    code: number;
    message: string;
    data: Description[];
    meta?: {
        page: number;
        limit: number;
        totalPages: number;
        totalItems: number;
    };
}

interface DescriptionDetailResponse {
    code: number;
    message: string;
    data: Description;
}

export const fetchDescriptions = async () => {
    try {
        // Menggunakan API route lokal untuk menyembunyikan URL asli
        const response = await fetch('/api/description');

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: DescriptionResponse = await response.json();

        // Periksa apakah data.data ada dan merupakan array
        if (data.data && Array.isArray(data.data)) {
            return data.data;
        } else {
            throw new Error('Format data tidak valid');
        }

    } catch (err) {
        console.error('Error fetching descriptions: ', err);
        throw err;

    }
};

export const fetchDescriptionDetail = async (id: number) => {
    try {
        const response = await fetch(`/api/description/get-byid/${id.toString()}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data: DescriptionDetailResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error get detail description:', error);
        throw error;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addDescription = async (category: any) => {
    try {
        // Dapatkan signature terlebih dahulu
        // const { timestamp, signature } = await getSignature();

        // const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

        const response = await fetch('/api/description/create', {
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
        console.error('Error adding employee:', error);
        throw error;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const editDescription = async (description: any) => {
    try {
        const response = await fetch(`/api/description/update-byid/${description.id.toString()}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: description?.name, idDescription: description?.idDescription
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal merubah description');
        }

        return await response.json();
    } catch (error) {
        console.error('Error editing description:', error);
        throw error;
    }
};

export const deleteDescription = async (id: number): Promise<void> => {
    try {

        const response = await fetch(`/api/description/deleted-byid/${id}`, {
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