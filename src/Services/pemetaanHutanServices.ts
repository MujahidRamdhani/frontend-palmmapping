import axios from 'axios';
import {
    DataPemetaanHutan,
    DataPemetaanHutanArray,
} from '../types/dataPemetaanHutan';

export const GetAllDataPemetaanHutan = async (): Promise<
    DataPemetaanHutan[]
> => {
    try {
        const response = await axios.get<{ data: DataPemetaanHutan[] }>(
            'http://localhost:9999/api/pemetaanHutan/GetAllPemetaanHutan',
        );
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};

export const FindOnePemetaanHutan = async (
    idPemetaanHutan: string,
): Promise<DataPemetaanHutan[]> => {
    try {
        const response = await axios.put<{ data: DataPemetaanHutan[] }>(
            `http://localhost:9999/api/pemetaanHutan/FindOnePemetaanHutan/${idPemetaanHutan}`,
        );
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};

export const HistoryPemetaanHutan = async (
    idHutan: string,
): Promise<DataPemetaanHutan[]> => {
    try {
        const response = await axios.put<{ data: DataPemetaanHutan[] }>(
            `http://localhost:9999/api/pemetaanHutan/HistoryPemetaanHutan/${idHutan}`,
        );
        console.log('data', response.data.data);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching data:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};
