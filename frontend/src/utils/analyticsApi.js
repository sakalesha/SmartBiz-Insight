// Analytics API functions
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const userInfo = localStorage.getItem('userInfo');
    const user = userInfo ? JSON.parse(userInfo) : null;

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
    };
};

// Product Analytics
export const fetchProductAnalytics = async (startDate = null, endDate = null) => {
    let url = `${API_URL}/analytics/products`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch product analytics');
    return response.json();
};

// Time Trends
export const fetchTimeTrends = async (startDate = null, endDate = null) => {
    let url = `${API_URL}/analytics/time-trends`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch time trends');
    return response.json();
};

// Customer Insights
export const fetchCustomerInsights = async (startDate = null, endDate = null) => {
    let url = `${API_URL}/analytics/customers`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch customer insights');
    return response.json();
};

// Order Analytics
export const fetchOrderAnalytics = async (startDate = null, endDate = null) => {
    let url = `${API_URL}/analytics/orders`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch order analytics');
    return response.json();
};
