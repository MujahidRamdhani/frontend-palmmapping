import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useModalStore } from '../store/useModalStore';
import { showSuccessNotification } from '../utils/util';

const schema = z.object({
    statusKonfirmasi: z
        .string()
        .nonempty('Status Konfirmasi tidak boleh kosong !!!'),
    nomorSTDB: z.string().nonempty('Nomor STDB tidak boleh kosong !!!'),
    pesanKonfirmator: z
        .string()
        .nonempty('Pesan Konfirmator Tidak Boleh Kosong !!!'),
});

type FormFields = z.infer<typeof schema>;

const useLegalitasLahanForm = () => {
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
                `http://localhost:9999/api/legalitasLahan/ConfirmLegalitasLahan/${data.nomorSTDB}`,
                {
                    statusKonfirmator: data.statusKonfirmasi,
                    pesanKonfirmator: data.pesanKonfirmator,
                },
            );
            setShowModal(false);
            setShowModalPenolakan(false);
            showSuccessNotification("Konfirmasi Berhasil!");
            reset();
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
        formState: { errors, isSubmitting },
        onSubmit,
        setValue,
    };
};

export default useLegalitasLahanForm;
