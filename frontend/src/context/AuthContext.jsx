import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Use environment variable for API URL, fallback to production backend
const API_URL = import.meta.env.VITE_API_URL || 'https://smart-biz-insight.vercel.app/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            setUser(userInfo);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login to:', `${API_URL}/users/login`);

            // Create a timeout promise that rejects after 15 seconds
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            try {
                const response = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                const data = await response.json();

                if (response.ok) {
                    console.log('Login successful:', data);
                    localStorage.setItem('userInfo', JSON.stringify(data));
                    setUser(data);
                    return { success: true };
                } else {
                    console.error('Login failed:', data.message);
                    return { success: false, message: data.message };
                }
            } catch (fetchError) {
                clearTimeout(timeoutId);
                throw fetchError;
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.name === 'AbortError') {
                return { success: false, message: 'Request timed out. Server is taking too long to respond.' };
            }
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                return { success: false, message: 'Unable to connect to server. Check your internet or CORS settings.' };
            }
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            console.log('Attempting register to:', `${API_URL}/users/register`);
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful:', data);
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                return { success: true };
            } else {
                console.error('Registration failed:', data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                return { success: false, message: 'Unable to connect to server. Check your internet or CORS settings.' };
            }
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
