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

interface ApiResponse {
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

export const fetchDescriptions = async () => {
    try {
        // Menggunakan API route lokal untuk menyembunyikan URL asli
        const response = await fetch('/api/description');
        console.log(response, "<<<<ini si response");


        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

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