/* eslint-disable @typescript-eslint/no-explicit-any */
export const closeGate = async (gateId: string | number) => {
    try {
        const response = await fetch(`/api/iot/close-gate/${gateId.toString()}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: "CLOSE"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menutup gate');
        }

        return await response.json();
    } catch (error) {
        console.error('Error close gate:', error);
        throw error;
    }
};

export const pingArduino = async (data: any) => {
    try {
        const response = await fetch(`/api/location/close-gate/${data.id.toString()}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arduino: data?.dataArduino
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal ping arduino');
        }

        return await response.json();
    } catch (error) {
        console.error('Error ping arduino:', error);
        throw error;
    }
};

export const pushGetId = async (data: any) => {
    try {
        const response = await fetch(`/api/gate/status/${data.id.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                socketId: data?.socketId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal ping arduino');
        }

        return await response.json();
    } catch (error) {
        console.error('Error ping arduino:', error);
        throw error;
    }
};

export const endCall = async (data: any) => {
    try {
        const response = await fetch(`api/gate/call-ended`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                socketId: data
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal end call');
        }

        return await response.json();
    } catch (error) {
        console.error('Error end call:', error);
        throw error;
    }
};