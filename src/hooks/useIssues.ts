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

interface IssueMonthly {
  month: string;
  total: number;
}
interface IssueMonthlyResponse {
  status: string;
  data: IssueMonthly[];
}

interface IssueDetailResponse {
  code: number;
  message: string;
  data: Issue;
}

export const fetchIssues = async (page = 1, limit = 5) => {
  try {
    const response = await fetch(
      `/api/issue/get-all?page=${page}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: IssueResponse = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data;
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (err) {
    console.error("Error fetching descriptions: ", err);
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
    console.error("Error fetching descriptions: ", err);
    throw err;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addIssue = async (issue: any) => {
  try {
    // Dapatkan signature terlebih dahulu
    // const { timestamp, signature } = await getSignature();

    // const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';

    const response = await fetch("/api/issue/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // 'x-timestamp': timestamp,
        // 'x-signature': signature,
        // 'Authorization': `Bearer ${token}`
      },
      // credentials: "include",
      body: JSON.stringify(issue),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menambahkan issue / report");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding issue / report:", error);
    throw error;
  }
};

export const fetchIssuesMonthly = async () => {
  try {
    const response = await fetch(`/api/summary/issue-monthly`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: IssueMonthlyResponse = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data;
    } else {
      throw new Error("Format data tidak valid");
    }
  } catch (err) {
    console.error("Error fetching descriptions: ", err);
    throw err;
  }
};
