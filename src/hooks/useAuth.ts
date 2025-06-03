interface LoginRequest {
    identifier: string;
    password: string;
    remember?: boolean;
}

export const LoginAuth = async (loginRequest: LoginRequest) => {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginRequest)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal login');
        }

        return await response.json();
    } catch (error) {
        console.error('Error login:', error);
        throw error;
    }
};