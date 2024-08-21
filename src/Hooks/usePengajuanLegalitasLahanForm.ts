import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { showSuccessNotification } from '../utils/util';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

const imageSchema = z
    .any()

    .refine((files) => files?.length >= 1, {
        message: 'Foto Kebun Tidak Boleh Kosong',
    })

    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
        message: '.jpg, .jpeg, .png and .webp files are accepted.',
    })

    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
        message: `Max file size is 4MB.`,
    });

const MAX_FILE_SIZE_LEGALITAS = 4000000;
const ACCEPTED_PDF_TYPES = ['application/pdf'];
const pdfSchema = z
    .any()

    .refine((files) => files?.length >= 1, {
        message: 'File Legalitas Lahan Tidak Boleh kosong',
    })

    .refine((files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), {
        message: 'File yang diterima hanya PDF.',
    })

    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE_LEGALITAS, {
        message: 'Max file size is 4MB.',
    });

const schema = z.object({
    nomorSTDB: z.string().nonempty('Nomor STDB Tidak Boleh Kosong !!!'),
    lokasiKebun: z.string().nonempty('Lokasi Kebun Tidak Boleh Kosong !!!'),
    nomorSertifikat: z
        .string()
        .nonempty('Nomor Sertifikat Tidak Boleh Kosong !!!'),
    statusKepemilikanLahan: z
        .string()
        .nonempty('Pilih status kepemilikan lahan terlebih dahulu'),
    jenisTanaman: z.string().nonempty('Jenis Tanaman Tidak Boleh Kosong !!!'),
    produksiPerHaPertahun: z
        .number()
        .nonnegative('Jumlah produksi Per Ha Pertahun angka positif')
        .refine((value) => value !== undefined && value !== null, {
            message: 'produksi Per Ha Pertahun Tidak Boleh Kosong !!!',
        }),
    asalBenih: z.string().nonempty('Asal Benih Tidak Boleh Kosong !!!'),
    jumlahPohon: z
        .number()
        .nonnegative('Jumlah Pohon angka positif')
        .refine((value) => value !== undefined && value !== null, {
            message: 'Jumlah Pohon Tidak Boleh Kosong !!!',
        }),
    polaTanam: z.string().nonempty('Pola Tanam Tidak Boleh Kosong !!!'),
    jenisPupuk: z.string().nonempty('Jenis Pupuk Tidak Boleh Kosong !!!'),
    mitraPengolahan: z
        .string()
        .nonempty('Mitra Pengolahan Tidak Boleh Kosong !!!'),
    jenisTanah: z.string().nonempty('Pilih Jenis Tanah  terlebih dahulu !!!'),
    tahunTanam: z.string().nonempty('Pilih Tahun Tanam terlebih dahulu !!!'),
    usahaLainDikebun: z
        .string()
        .nonempty('Usaha Lain di Kebun Tidak Boleh Kosong !!!'),
    image: imageSchema,
    fileLegalitasLahan: pdfSchema,
});

type FormFields = z.infer<typeof schema>;

const useTambahPemetaanKebunForm = () => {
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
            // Upload the first file
            const file = data.fileLegalitasLahan[0];
            if (!file) {
                throw new Error('No file selected');
            }

            const formData = new FormData();
            formData.append('file', file);

            const metadata = JSON.stringify({
                name: file.name, // Use the actual file name
            });
            formData.append('pinataMetadata', metadata);

            const options = JSON.stringify({
                cidVersion: 0,
            });
            formData.append('pinataOptions', options);

            const res = await fetch(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3NTFiM2Y0Yi05YTM5LTQ5ODctOWJjNS03ZTRlMDI0OTUwMWYiLCJlbWFpbCI6Im11amFoaWRyYW1kaGFuaTk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyMmQ3OGJhY2E5MWQyNTQ1YmYxMyIsInNjb3BlZEtleVNlY3JldCI6IjE4YjM4ZDE2MGRjMDI3NGUwNDVmMjU2MTI3MGUyMzg2MGY3YjdlOWI1MTJlMzI4NmM5N2YyZWMzYzAwMjliZWMiLCJpYXQiOjE3MTcwNzU1NDV9.vXJq3p6Z1OAWqP41-QB-hpaMVm2CYA2NkQ75jJPV98Q`,
                    },
                    body: formData,
                },
            );

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const resData = await res.json();
            console.log('Response data:', resData);

            // Upload the second file
            const fileImage = data.image[0];
            if (!fileImage) {
                throw new Error('No image file selected');
            }

            const formDataImage = new FormData();
            formDataImage.append('file', fileImage);

            const metadataImage = JSON.stringify({
                name: fileImage.name,
            });
            formDataImage.append('pinataMetadata', metadataImage);

            const optionsImage = JSON.stringify({
                cidVersion: 0,
            });
            formDataImage.append('pinataOptions', optionsImage);

            const resImage = await fetch(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3NTFiM2Y0Yi05YTM5LTQ5ODctOWJjNS03ZTRlMDI0OTUwMWYiLCJlbWFpbCI6Im11amFoaWRyYW1kaGFuaTk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyMmQ3OGJhY2E5MWQyNTQ1YmYxMyIsInNjb3BlZEtleVNlY3JldCI6IjE4YjM4ZDE2MGRjMDI3NGUwNDVmMjU2MTI3MGUyMzg2MGY3YjdlOWI1MTJlMzI4NmM5N2YyZWMzYzAwMjliZWMiLCJpYXQiOjE3MTcwNzU1NDV9.vXJq3p6Z1OAWqP41-QB-hpaMVm2CYA2NkQ75jJPV98Q`,
                    },
                    body: formDataImage,
                },
            );

            if (!resImage.ok) {
                throw new Error(`HTTP error! status: ${resImage.status}`);
            }
            const resDataImage = await resImage.json();

            const postData = {
                nomorSTDB: data.nomorSTDB,
                alamatKebun: data.lokasiKebun,
                statusKepemilikanLahan: data.statusKepemilikanLahan,
                nomorSertifikat: data.nomorSertifikat,
                jenisTanaman: data.jenisTanaman,
                produksiPerHaPerTahun: data.produksiPerHaPertahun,
                asalBenih: data.asalBenih,
                jumlahPohon: data.jumlahPohon,
                polaTanaman: data.polaTanam,
                jenisPupuk: data.jenisPupuk,
                mitraPengolahan: data.mitraPengolahan,
                jenisTanah: data.jenisTanah,
                tahunTanaman: data.tahunTanam,
                usahaLainDikebun: data.usahaLainDikebun,
                cidFileLegalitasKebun: resData.IpfsHash,
                cidFotoKebun: resDataImage.IpfsHash,
            };

            console.log('Post data:', postData);

            const axiosRes = await axios.post(
                'http://localhost:9999/api/legalitasLahan/CreateLegalitasLahan',
                postData,
            );
            console.log('Axios response:');
            const response = axiosRes.data.data;
            showSuccessNotification(response.data.data);
            navigate('/dashboard/pengajuanSTDB');
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

export default useTambahPemetaanKebunForm;
