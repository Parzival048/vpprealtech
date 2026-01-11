/**
 * API Service for VPP Realtech
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('vpp_admin_token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============ Projects API ============

export const projectsApi = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return fetchApi(`/projects${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id) => fetchApi(`/projects/${id}`),

    getFeatured: () => fetchApi('/projects/featured'),

    create: (data) => fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    update: (id, data) => fetchApi(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => fetchApi(`/projects/${id}`, {
        method: 'DELETE',
    }),

    toggleVisibility: (id) => fetchApi(`/projects/${id}/publish`, {
        method: 'PATCH',
    }),

    // Admin: Get all projects including unpublished
    getAllAdmin: () => fetchApi('/projects/all'),
};

// ============ Leads API ============

export const leadsApi = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return fetchApi(`/leads${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id) => fetchApi(`/leads/${id}`),

    create: (data) => fetchApi('/leads', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    update: (id, data) => fetchApi(`/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => fetchApi(`/leads/${id}`, {
        method: 'DELETE',
    }),
};

// ============ Auth API ============

export const authApi = {
    login: (credentials) => fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    logout: () => {
        localStorage.removeItem('vpp_admin_token');
        localStorage.removeItem('vpp_admin_user');
    },

    getProfile: () => fetchApi('/auth/profile'),

    isAuthenticated: () => {
        return !!localStorage.getItem('vpp_admin_token');
    },
};

// ============ Contact API ============

export const contactApi = {
    submit: (data) => fetchApi('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};

// ============ Upload API ============

export const uploadApi = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('vpp_admin_token');

        const response = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },

    uploadMultiple: async (files) => {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append('images', file);
        });

        const token = localStorage.getItem('vpp_admin_token');

        const response = await fetch(`${API_BASE_URL}/upload/images`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    },
};

export default {
    projects: projectsApi,
    leads: leadsApi,
    auth: authApi,
    contact: contactApi,
    upload: uploadApi,
};
