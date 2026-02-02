// Centralized API helper functions
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const userInfo = localStorage.getItem('userInfo');
    const user = userInfo ? JSON.parse(userInfo) : null;

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}`
    };
};

// Helper to serialize filters
const serializeFilters = (filters) => {
    return Object.entries(filters || {})
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
};

// Customer APIs
export const fetchCustomers = async (page = 1, filters = {}) => {
    const queryParams = serializeFilters(filters);
    const url = `${API_URL}/customers?page=${page}&limit=10${queryParams ? `&${queryParams}` : ''}`;

    const response = await fetch(url, { headers: getAuthHeaders() });

    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }

    return response.json();
};

export const createCustomer = async (data) => {
    const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create customer');
    }

    return response.json();
};

export const updateCustomer = async (id, data) => {
    const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update customer');
    }

    return response.json();
};

export const deleteCustomer = async (id) => {
    const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to delete customer');
    }

    return response.json();
};

// Order APIs
export const fetchOrders = async (page = 1, filters = {}) => {
    const queryParams = serializeFilters(filters);
    const url = `${API_URL}/orders?page=${page}&limit=10${queryParams ? `&${queryParams}` : ''}`;

    const response = await fetch(url, { headers: getAuthHeaders() });

    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }

    return response.json();
};

export const createOrder = async (data) => {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
    }

    return response.json();
};

export const updateOrderStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update order status');
    }

    return response.json();
};

// Product APIs
export const fetchProducts = async (page = 1, filters = {}) => {
    const queryParams = serializeFilters(filters);
    const url = `${API_URL}/products?page=${page}&limit=10${queryParams ? `&${queryParams}` : ''}`;

    const response = await fetch(url, {
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    return response.json();
};

export const createProduct = async (data) => {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
    }

    return response.json();
};

export const updateProduct = async (id, data) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
    }

    return response.json();
};

export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to delete product');
    }

    return response.json();
};
