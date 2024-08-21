import axios from 'axios';
import { DataPemetaanKebun } from '../types/dataPemetaanKebun';

export const GetAllDataPemetaanKebun = async (): Promise<
    DataPemetaanKebun[]
> => {
    try {
        const response = await axios.get<{ data: DataPemetaanKebun[] }>(
            'http://localhost:9999/api/pemetaanKebun/GetAllPemetaanKebun',
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

export const FindOnePemetaanKebun = async (
    idPemetaanKebun: string,
): Promise<DataPemetaanKebun[]> => {
    try {
        const response = await axios.put<{ data: DataPemetaanKebun[] }>(
            `http://localhost:9999/api/pemetaanKebun/FindOnePemetaanKebun/${idPemetaanKebun}`,
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

export const HistoryPemetaanKebun = async (
    idPemetaanKebun: string,
): Promise<DataPemetaanKebun[]> => {
    try {
        const response = await axios.put<{ data: DataPemetaanKebun[] }>(
            `http://localhost:9999/api/pemetaanKebun/HistoryPemetaanKebun/${idPemetaanKebun}`,
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
