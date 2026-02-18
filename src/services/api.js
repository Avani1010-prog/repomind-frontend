import axios from 'axios';

const API_BASE_URL = 'https://repomind-backend-fufh.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadZip = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/upload/zip`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const uploadGithub = async (repoUrl) => {
    const response = await api.post('/upload/github', { repoUrl });
    return response.data;
};

// Alias for backward compatibility
export const connectGithub = uploadGithub;

export const askQuestion = async (codebaseId, question, tags = []) => {
    const response = await api.post('/question/ask', {
        codebaseId,
        question,
        tags,
    });
    return response.data;
};

export const getHistory = async (codebaseId, search = '') => {
    const params = search ? { search } : {};
    const response = await api.get(`/history/${codebaseId}`, { params });
    return response.data;
};

export const getAllCodebases = async () => {
    const response = await api.get('/history');
    return response.data;
};

export const getHealth = async () => {
    const response = await api.get('/health');
    return response.data;
};

export const generateRefactor = async (code, language) => {
    const response = await api.post('/refactor', { code, language });
    return response.data;
};

export default api;
