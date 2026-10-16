import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const ACCESS_TOKEN_KEY = 'access_token';
const TOKEN_TYPE_KEY = 'token_type';

const api = axios.create({
    baseURL: baseURL,
});

const clearSessionAndRedirect = () => {
    console.warn("Sesión cerrada. Limpiando datos...");

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);

    // Si guardas más datos del usuario, límpialos también
    localStorage.removeItem('user');

    window.location.href = '/';
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        const type = localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';

        if (token) {
            config.headers.Authorization = `${type} ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const detail = error.response?.data?.detail;

        const shouldLogout =
            status === 401 ||
            detail === "USER_WITHOUT_ACTIVE_LEASE";

        if (shouldLogout) {
            clearSessionAndRedirect();
        }

        return Promise.reject(error);
    }
);

export default api;