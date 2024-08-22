import { z } from 'zod';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputDashboard from '../../../Components/Elements/Input/InputDashboard';
import InputFile from '../../../Components/Elements/Input/InputFile';
import SelectGroupOne from '../../../Components/Elements/Select/SelectGroupOne';
import SelectDate from '../../../Components/Elements/Select/SelectDate';
import SelectPolaTanam from '../../../Components/Elements/Select/SelectPolaTanam';
import SelectJenisTanah from '../../../Components/Elements/Select/SelectJenisTanah';
import ImageUploader from '../../../Components/Elements/Input/ImageUploader';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import { useEffect, useState } from 'react';
import pengajuanSTDBStore from '../../../store/pengajuanSTDBStore';
import useAuthStore from '../../../store/authStore';
import axios, { AxiosError } from 'axios';

import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { useNavigate } from 'react-router-dom';
export interface Cooperative {
    uuid: string;
    nomorSTDB: string;
    nama: string;
    tempatTanggalLahir: string;
    nik: string;
    alamat: string;
    lokasiKebun: string;
    statusKepemilikanLahan: string;
    nomorSertifikat: string;
    luasArealKebun: number;
    jenisTanaman: string;
    produksiPerHaPertahun: number;
    asalBenih: string;
    polaTanam: string;
    jenisPupuk: string;
    mitraPengolahan: string;
    jenisTanah: string;
    tahunTanam: string;
    usahaLainDikebun: string;
    cidFotoLahan: string;
    longLatitude: string;
    waktuPengajuanSTDB: string;
    niKoperasi: string;
    namaKoperasi: string;
    statusKonfirmasiKoperasi: string;
    waktuStatusKonfirmasiKoperasi: string;
    alasanPenolakan: string;
    nipDinas: string;
    namaDinas: string;
    waktuPenerbitanSTDB: string;
    createdAt: string;
}

const MAX_FILE_SIZE = 4000000;
const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

const imageSchema = z
    .any()
    // To not allow empty files
    .refine((files) => files?.length >= 1, {
        message: 'Foto Kebun Tidak Boleh Kosong',
    })
    // To not allow files other than images
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
        message: '.jpg, .jpeg, .png and .webp files are accepted.',
    })
    // To not allow files larger than 5MB
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
        message: `Max file size is 4MB.`,
    });

const MAX_FILE_SIZE_LEGALITAS = 4000000; // 4MB
const ACCEPTED_PDF_TYPES = [
    'application/pdf', // Correct MIME type for PDF files
];

const pdfSchema = z
    .any()
    // To not allow empty files
    .refine((files) => files?.length >= 1, {
        message: 'File Legalitas Lahan Tidak Boleh kosong',
    })
    // To only allow PDF files
    .refine((files) => ACCEPTED_PDF_TYPES.includes(files?.[0]?.type), {
        message: 'File yang diterima hanya PDF.',
    })
    // To not allow files larger than 4MB
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE_LEGALITAS, {
        message: 'Max file size is 4MB.',
    });

// Define validation schema using Zod
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

// Define type for form fields based on Zod schema
type FormFields = z.infer<typeof schema>;

const FormPengajuanSTDB = () => {
    const [selectedFile, setSelectedFile]: any = useState();
    const [cidLegalitasLahan, setCidLegalitasLahan]: any = useState();
    const [cidImage, setCidImage]: any = useState();
    const [stdbs, setStdbs] = useState<Cooperative[]>([]);
    const { user, isError } = useAuthStore((state) => state); // Dapatkan fungsi loginUser dari useAuthStore
    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });
    // useEffect(() => {
    //     getStdb();
    // }, []);

    // useEffect(() => {
    //     console.log('Total count of data:', stdbs.length);
    //     if (stdbs.length === 0) {
    //         setValue('nomorSTDB', `STDB-01`);
    //     } else {
    //         setValue('nomorSTDB', `STDB-0${stdbs.length + 1}`);
    //     }
    // }, [stdbs]);

    // const getStdb = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:5000/STDBS');
    //         setStdbs(response.data);
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             console.error('Error fetching data:', error.message);
    //         } else {
    //             console.error('Unexpected error:', error);
    //         }
    //     }
    // };

    // let uuid = '';
    // let nik = '';
    // let nama = '';
    // let alamat = '';
    // let tempatTanggalLahir = '';

    if (!user) {
        navigate('/login');
    }

    // const navigate = useNavigate();
    //    const { submitForm }  = pengajuanSTDBStore();

    const showSuccessNotification = (response: any) => {
        Toastify({
            text: response,
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            style: {
                background: 'linear-gradient(to right, #00b09b, #96c93d)',
            },
        }).showToast();
    };

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
            console.log('Image response data:', resDataImage);
            setCidLegalitasLahan(resData.IpfsHash);
            setCidImage(resDataImage.IpfsHash);
            console.log('image', resDataImage.IpfsHash);
            console.log('file', resData.IpfsHash);
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
                'https://palmmapping-backend.my.to/api/legalitasLahan/CreateLegalitasLahan',
                postData,
            );
            console.log('Axios response:');
            // reset()
            const response = axiosRes.data.data;
            showSuccessNotification(response);
            navigate('/dashboard/pengajuanSTDB');
            console.log(data);
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

    const handleImageUpload = (file: File) => {
        // Here you can do whatever you want with the uploaded file
        console.log('Uploaded File:', file);
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, []);

    // const isAuthenticated = !!localStorage.getItem(nik);
    // console.log(isAuthenticated)
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Form Pengajuan Legalitas lahan" />
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-2 pb-2 lg:pb-4">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Form Pengajuan Legalitas lahan
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="p-6.5">
                            <InputDashboard
                                label="Nomor STDB"
                                id="nomorSTDB"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Nomor STDB"
                                // value={nik}
                                // readOnly="true"
                            />
                            <InputDashboard
                                label="Lokasi Kebun (desa/kecamatan)"
                                id="lokasiKebun"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Lokasi Kebun"
                            />
                            <SelectGroupOne
                                register={register}
                                errors={errors}
                                id="statusKepemilikanLahan"
                            />
                            <InputDashboard
                                label="Nomor Sertifikat"
                                id="nomorSertifikat"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Nomor Sertifikat"
                            />

                            <InputDashboard
                                label="Jenis Tanaman"
                                id="jenisTanaman"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Jenis Tanaman"
                            />
                            <InputDashboard
                                label="Produksi Per Ha Pertahun (Dalam Ton)"
                                id="produksiPerHaPertahun"
                                type="number"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Produksi Per Ha Pertahun"
                                valueAsNumber
                            />
                            <InputDashboard
                                label="Asal Benih"
                                id="asalBenih"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Asal Benih"
                            />
                            <InputDashboard
                                label="Jumlah Pohon"
                                id="jumlahPohon"
                                type="number"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Jumlah Pohon"
                                valueAsNumber
                            />
                            <SelectPolaTanam
                                register={register}
                                id="polaTanam"
                                errors={errors}
                            />
                            <InputDashboard
                                label="Jenis Pupuk"
                                id="jenisPupuk"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Jenis Pupuk"
                            />
                            <InputDashboard
                                label="Mitra Pengolahan"
                                id="mitraPengolahan"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Mitra Pengolahan"
                            />
                            <SelectJenisTanah
                                register={register}
                                id="jenisTanah"
                                errors={errors}
                            />
                            <div className="mb-2">
                                <SelectDate
                                    register={register}
                                    id="tahunTanam"
                                    errors={errors}
                                />
                            </div>
                            <InputDashboard
                                label="Usaha Lain Dikebun"
                                id="usahaLainDikebun"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Usaha Lain Dikebun"
                            />
                            <InputFile
                                label="File Sertifikat Legalitas Lahan"
                                id="fileLegalitasLahan"
                                type="file"
                                register={register}
                                errors={errors}
                            />
                            <ImageUploader
                                register={register}
                                errors={errors}
                                onImageUpload={handleImageUpload}
                            />
                            <button
                                type="submit"
                                className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${isSubmitting ? 'bg-opacity-90' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Loading...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default FormPengajuanSTDB;
