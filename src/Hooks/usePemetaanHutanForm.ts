import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { showSuccessNotification } from '../utils/util';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    latitude: z.string().nonempty('Mohon Petakan Terlebih Dahulu !!!'),
    longitude: z.string().nonempty('Mohon Petakan Terlebih Dahulu !!!'),
    luasHutan: z.string().nonempty('Mohon isi Luas lahan terlebih dahulu !!!'),
    namaHutan: z.string(),
    idHutan: z.string(),
});

type FormFields = z.infer<typeof schema>;

const useTambahPemetaanHutan = () => {
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
            const response = await axios.post(
                `https://palmmapping-backend.my.to/api/pemetaanHutan/CreatePemetaanHutan`,
                {
                    idHutan: data.idHutan,
                    namaHutan: data.namaHutan,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    luasHutan: data.luasHutan,
                },
            );

            // const responseData = JSON.parse(response.data.data);
            showSuccessNotification(response.data.data);
            console.log(response.data.data);
            navigate('/dashboard/PemetaanHutan');
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

export default useTambahPemetaanHutan;
