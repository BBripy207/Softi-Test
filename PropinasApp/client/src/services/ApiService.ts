import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3000/api';

export default {
    guardarTransaccion(data: Record<string, unknown>): Promise<AxiosResponse<any>> {
        return axios.post(`${API_URL}/transacciones`, data);
    },

    obtenerTransacciones(): Promise<AxiosResponse<any>> {
        return axios.get(`${API_URL}/transacciones`);
    },

    generarRecibo(id: number): Promise<AxiosResponse<any>> {
        return axios.get(`${API_URL}/transacciones/${id}/recibo`);
    },
};

