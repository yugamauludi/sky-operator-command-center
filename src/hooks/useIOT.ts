/* eslint-disable @typescript-eslint/no-explicit-any */
export const changeStatusGate = async (gateId: string | number, status: "OPEN" | "CLOSE" = "CLOSE") => {
    try {
        await pingArduino(gateId as number);
        const response = await fetch(`/api/iot/control-gate/${gateId.toString()}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status // status dinamis: "OPEN" atau "CLOSE"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mengubah status gate');
        }

        return await response.json();
    } catch (error) {
        console.error('Error change gate status:', error);
        throw error;
    }
};

export const pingArduino = async (dataId: number) => {
    try {
        const response = await fetch(`/api/iot/ping-status/${dataId.toString()}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                arduino: 1
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