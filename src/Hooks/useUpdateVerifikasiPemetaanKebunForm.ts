import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useModalStore } from '../store/useModalStore';
import { showSuccessNotification } from '../utils/util';

const schema = z.object({
    statusVerifikator: z.string().nonempty('Pilih Status Verifikator !!!'),
    idPemetaanKebun: z.string().nonempty('Pilih Status Verifikator !!!'),
    pesanVerifikator: z
        .string()
        .nonempty('Pesan Verifikator Tidak Boleh Kosong !!!'),
     statusPenerbitLegalitas : z.string().nonempty('Status Penerbit Legalitas Tidak Boleh Kosong !!!'),
});

type FormFields = z.infer<typeof schema>;

const useUpdateVerifikasiPemetaanKebun = () => {
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
                `http://localhost:9999/api/pemetaanKebun/UpdateStatusVerify/${data.idPemetaanKebun}`,
                {
                    statusVerifikator: data.statusVerifikator,
                    pesanVerifikator: data.pesanVerifikator,
                    statusPenerbitLegalitas: data.statusPenerbitLegalitas
                },
            );
            console.log(response);
            setShowModal(false);
            setShowModalPenolakan(false);
            showSuccessNotification('Update verifikasi pemetaan kebun sukses');
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
        setValue,
        formState: { errors, isSubmitting },
        onSubmit,
    };
};

export default useUpdateVerifikasiPemetaanKebun;
