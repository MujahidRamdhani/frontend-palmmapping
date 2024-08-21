import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the validation schema using Zod
const schema = z.object({
    kawasan: z.string().nonempty({ message: 'Kawasan is required' }),
    alamat: z
        .string()
        .min(10, { message: 'Alamat should be at least 10 characters long' }),
});

const Tes = () => {
    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });
    const [statusKawasan, setStatusKawasan] = useState('nilai awal');

    // Mengatur nilai input dari state ketika komponen dimuat atau state berubah
    useEffect(() => {
        setValue('kawasan', statusKawasan);
        setValue('alamat', statusKawasan);
    }, [statusKawasan, setValue]);

    // Fungsi untuk menangani submit formulir
    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="kawasan">Kawasan:</label>
            <input type="text" id="kawasan" {...register('kawasan')} readOnly />
            {errors.kawasan && <p>{errors.kawasan.message}</p>}

            <label htmlFor="alamat">Alamat:</label>
            <textarea id="alamat" {...register('alamat')} />
            {errors.alamat && <p>{errors.alamat.message}</p>}

            <button type="submit">Kirim</button>
            <button
                type="button"
                onClick={() => setStatusKawasan('nilai baru')}
            >
                Ubah Nilai
            </button>
        </form>
    );
};

export default Tes;
