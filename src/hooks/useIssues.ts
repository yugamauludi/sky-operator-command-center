export interface Issue {
    id: number;
    ticket: string;
    category: string;
    lokasi: string;
    description: string;
    gate: string;
    action: string;
    foto: string;
    number_plate: string;
    TrxNo: string;
    status: string;
    createdBy: string;
    modifiedBy: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
}

interface IssueResponse {
    code: number;
    message: string;
    data: Issue[];
    meta?: {
        page: number;
        limit: number;
        totalPages: number;
        totalItems: number;
    };
}

interface IssueDetailResponse {
    code: number;
    message: string;
    data: Issue;
}

export const fetchIssues = async () => {
    try {
        const response = await fetch('/api/issue/get-all');

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: IssueResponse = await response.json();

        // Periksa apakah data.data ada dan merupakan array
        if (data.data && Array.isArray(data.data)) {
            return data;
        } else {
            throw new Error('Format data tidak valid');
        }

    } catch (err) {
        console.error('Error fetching descriptions: ', err);
        throw err;
    }
};

export const fetchIssueDetail = async (id: number) => {
    try {
        const response = await fetch(`/api/issue/get-byid/${id.toString()}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: IssueDetailResponse = await response.json();

        return data;

    } catch (err) {
        console.error('Error fetching descriptions: ', err);
        throw err;
    }
};