import axios from 'axios';
import { LegalitasLahan } from '../types/legalitasLahan';

export const GetAllLegalitasLahan = async (): Promise<LegalitasLahan[]> => {
    try {
        const response = await axios.get<{ data: LegalitasLahan[] }>(
            'http://localhost:9999/api/LegalitasLahan/GetAllLegalitasLahan',
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

export const FindOneLegalitasLahan = async (
    nomorSTDB: string,
): Promise<LegalitasLahan> => {
    try {
        const response = await axios.put<{ data: LegalitasLahan }>(
            `http://localhost:9999/api/LegalitasLahan/FindOneLegalitasLahan/${nomorSTDB}`,
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

export const HistoryLegalitasLahan = async (
    nomorSTDB: string,
): Promise<LegalitasLahan[]> => {
    try {
        const response = await axios.put<{ data: LegalitasLahan[] }>(
            `http://localhost:9999/api/legalitasLahan/HistoryLegalitasLahan/${nomorSTDB}`,
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
