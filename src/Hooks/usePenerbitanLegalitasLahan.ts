import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useModalStore } from '../store/useModalStore';
import { showSuccessNotification } from '../utils/util';

const schema = z.object({
    nomorSTDB: z.string(),
});

type FormFields = z.infer<typeof schema>;

const usePengajuanLegalitasLahanForm = () => {
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

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            console.log('Submitting form with data:', data);
            const response = await axios.put(
                `https://palmmapping-backend.my.to/api/legalitasLahan/PublishLegalitasLahan/${data.nomorSTDB}`,
                {
                    nomorSTDB: data.nomorSTDB,
                },
            );
            setShowModal(false);
            // const responseData = JSON.parse(response.data.data);
            showSuccessNotification(response.data.data);
            console.log('Axios response hasil:', response.data.data);
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
        setValue,
        formState: { errors, isSubmitting },
        onSubmit,
    };
};

export default usePengajuanLegalitasLahanForm;
