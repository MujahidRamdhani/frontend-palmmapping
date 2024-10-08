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
        idPemetaanKebun :z.string().nonempty('Id Pemetaan Kebun Tidak Boleh Kosong !!!'),
});

type FormFields = z.infer<typeof schema>;

const useUpdateStatusConfirm = () => {
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
                `https://palmmapping-backend.my.to/api/legalitasLahan/UpdateStatusConfirmLegalitasLahan/${data.nomorSTDB}`,
                {
                    statusKonfirmator: data.statusKonfirmasi,
                    pesanKonfirmator: data.pesanKonfirmator,
                    idPemetaanKebun: data.idPemetaanKebun,
                },
            );
           
            showSuccessNotification("Update Konfirmasi Berhasil!");
            reset();
        } catch (err) {
            console.log(err);
            if (err instanceof AxiosError) {
                setError('root', {
                    message: err.response?.data.msg || 'An error occurred', 
                });
            } else {
                setError('root', {
                    message: 'An unexpected error occurred', 
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

export default useUpdateStatusConfirm;
