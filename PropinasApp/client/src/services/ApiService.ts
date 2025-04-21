import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3000/api';

export default {
    saveTransaction(data: Record<string, unknown>): Promise<AxiosResponse<any>> {
        return axios.post(`${API_URL}/transactions`, data);
    },

    fetchTransactions(): Promise<AxiosResponse<any>> {
        return axios.get(`${API_URL}/transactions`);
    },

    generateReceipt(id: number): Promise<AxiosResponse<any>> {
        return axios.get(`${API_URL}/transactions/${id}/receipt`);
    },
};

