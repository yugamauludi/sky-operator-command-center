/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Location {
    id: number;
    Code: string;
    Name: string;
    Address?: string;
}

interface LocationResponse {
    code: number;
    message: string;
    data: Location[];
    meta?: {
        page: number;
        limit: number;
        totalPages: number;
        totalItems: number;
    };
}

export interface LocationDetail {
    id: number;
    Code: string;
    Name: string;
    Region: string;
    Vendor: string;
    VendorParkingCode: string;
    ShortName: string;
    Address: string;
    StartTime: string;
    EndTime: string;
    DateNext: number;
    TimeZone: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string;
    recordStatus: string;
}

interface LocationDetailResponse {
    code: number;
    message: string;
    data: LocationDetail;
}

export interface GateByLocation {
    id: number;
    id_location: number;
    gate: string;
    channel_cctv: string;
    arduino: number;
    statusGate: number;
    id_tele: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    location: {
        Code: string;
        Name: string;
    };
}

interface GateByLocationResponse {
    code: number;
    message: string;
    data: GateByLocation[];
    meta?: {
        page: number;
        limit: number;
        totalPages: number;
        totalItems: number;
    };
}

export const fetchLocation = async (page = 1, limit = 5) => {
    try {
        const response = await fetch(`/api/location/get-all?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: LocationResponse = await response.json();

        if (data.data && Array.isArray(data.data)) {
            return data;
        } else {
            throw new Error('Format data lokasi tidak valid');
        }

    } catch (err) {
        console.error('Error fetching locations: ', err);
        throw err;
    }
};

export const fetchLocationById = async (id: number) => {
    try {
        const response = await fetch(`/api/location/get-byid/${id}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: LocationDetailResponse = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching location by ID: ', err);
        throw err;
    }
}

export const fetchGateByLocation = async (locationData: any) => {
    try {
        const response = await fetch(`/api/location/get-gate-by-location/${locationData.id}?page=${locationData.page}limit=${locationData.limit}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: GateByLocationResponse = await response.json();
        return data;
    } catch (err) {
        console.error('Error fetching location by ID: ', err);
        throw err;
    }
}

export const fetchLocationActive = async (page = 1, limit = 5) => {
    try {
        const response = await fetch(`/api/location/get-all-location-active?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data: LocationResponse = await response.json();

        if (data.data && Array.isArray(data.data)) {
            return data;
        } else {
            throw new Error('Format data lokasi tidak valid');
        }

    } catch (err) {
        console.error('Error fetching locations: ', err);
        throw err;
    }
};

export const updateLocation = async (location: any) => {
    try {
        const response = await fetch(`/api/location/update-location-active/${location.id.toString()}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: location?.name, idDescription: location?.idDescription
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal merubah location');
        }

        return await response.json();
    } catch (error) {
        console.error('Error editing location:', error);
        throw error;
    }
};

export const openGate = async (gateId: number | string) => {
    try {
        const response = await fetch(`/api/location/open-gate/${gateId.toString()}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: "OPEN"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal membuka gate');
        }

        return await response.json();
    } catch (error) {
        console.error('Error open gate:', error);
        throw error;
    }
};

export const createGate = async (gate: any) => {
    try {
        const response = await fetch(`/api/location/create-data/${gate.id.toString()}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gateName: gate?.name
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mambuat gate');
        }

        return await response.json();
    } catch (error) {
        console.error('Error create gate:', error);
        throw error;
    }
};