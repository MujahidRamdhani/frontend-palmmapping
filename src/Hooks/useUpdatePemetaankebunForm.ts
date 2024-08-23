import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { showSuccessNotification } from '../utils/util';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    latitude: z.string().nonempty('Mohon Petakan Terlebih Dahulu !!!'),
    longitude: z.string().nonempty('Mohon Petakan Terlebih Dahulu !!!'),
    statusKawasan: z.string().nonempty('Mohon Petakan Terlebih Dahulu !!!'),
    luasLahan: z.string().nonempty('Mohon isi Luas lahan terlebih dahulu !!!'),
    waktuPemetaanKebun: z
        .string()
        .nonempty('Mohon isi waktu pemetaan terlebih dahulu !!!'),
    waktuVerifikator: z
        .string()
        .nonempty('Mohon isi waktu verifikator terlebih dahulu !!!'),
    nomorSTDB: z.string().nonempty('Mohon isi Nomor STDB terlebih dahulu !!!'),
    idPemetaanKebun: z
        .string()
        .nonempty('Mohon isi Id Pemetaan terlebih dahulu !!!'),
});

type FormFields = z.infer<typeof schema>;

const useUpdatePemetaanKebunForm = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            console.log('Submitting form with data:', data);
            const response = await axios.put(
                `https://palmmapping-backend.my.to/api/pemetaanKebun/UpdatePemetaanKebun/${data.idPemetaanKebun}`,
                {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    statusKawasan: data.statusKawasan,
                    nomorSTDB: data.nomorSTDB,
                    idPemetaanKebun: data.idPemetaanKebun,
                    luasKebun: data.luasLahan,
                    waktuPemetaanKebun: data.waktuPemetaanKebun,
                    waktuVerifikator: data.waktuVerifikator,
                },
            );

            // const responseData = JSON.parse(response.data.data);
            showSuccessNotification(response.data.data);
            navigate('/dashboard/RiwayatPemetaan');
            // console.log('Axios response:', responseData);
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                setError('root', {
                    message: err.response?.data.msg || 'An error occurred', // Use the error message if available
                });
            } else {
                setError('root', {
                    message: 'An unexpected error occurred', // Fallback error message
                });
            }
        }
    };

    return {
        register,
        handleSubmit,
        setError,
        reset,
        setValue,
        formState: { errors, isSubmitting },
        onSubmit,
    };
};

export default useUpdatePemetaanKebunForm;
