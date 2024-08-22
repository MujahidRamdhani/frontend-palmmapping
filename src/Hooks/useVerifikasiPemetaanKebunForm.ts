import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useModalStore } from '../store/useModalStore';
import { showSuccessNotification } from '../utils/util';

const schema = z.object({
    statusVerifikator: z.string().nonempty('Pilih Status Verifikator !!!'),
    idPemetaanKebun: z.string(),
    pesanVerifikator: z
        .string()
        .nonempty('Pesan Verifikator Tidak Boleh Kosong !!!'),
});

type FormFields = z.infer<typeof schema>;

const userVerifikasiPemetaanKebun = () => {
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

    const setShowModal = useModalStore((state) => state.setShowModal);
    const setShowModalPenolakan = useModalStore(
        (state) => state.setShowModalPenolakan,
    );

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            console.log('Submitting form with data:', data);
            const response = await axios.put(
                `https://palmmapping-backend.my.to/api/pemetaanKebun/VerifyPemetaanKebun/${data.idPemetaanKebun}`,
                {
                    statusVerifikator: data.statusVerifikator,
                    pesanVerifikator: data.pesanVerifikator,
                },
            );
            setShowModal(false);
            setShowModalPenolakan(false);
            // const responseData = JSON.parse(response.data.data);
            showSuccessNotification(response.data.data);
            console.log('Axios response hasil:', response.data.data);
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

export default userVerifikasiPemetaanKebun;
