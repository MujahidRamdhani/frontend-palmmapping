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
import { useLocation, useNavigate } from 'react-router-dom';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import { FindOneLegalitasLahan } from '../../../Services/legalitasLahanServices';
import Button from '../../../Components/Elements/Button/Button';
import { dataTool } from 'echarts';
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

const FormUpdateLegalitasLahan = () => {
    const [selectedFile, setSelectedFile]: any = useState();
    const [cidLegalitasLahan, setCidLegalitasLahan]: any = useState();
    const [cidImage, setCidImage]: any = useState();
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>();
    const { user, isError } = useAuthStore((state) => state); // Dapatkan fungsi loginUser dari useAuthStore
    const [deleteImage, setDeleteImage] = useState(false);
    const [deleteLegalitas, setDeleteLegalitas] = useState(false);

    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0]);
    };
    const navigate = useNavigate();

    const MAX_FILE_SIZE = 4000000; // 4MB
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
            message: '.jpg, .jpeg, .png, dan .webp files are accepted.',
        })
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
            message: 'Max file size is 4MB.',
        });

    const MAX_FILE_SIZE_LEGALITAS = 4000000; // 4MB
    const ACCEPTED_PDF_TYPES = [
        'application/pdf', // Correct MIME type for PDF files
    ];

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

    // Function to create the schema dynamically based on conditions
    const createSchema = (deleteImage: boolean, deleteLegalitas: boolean) => {
        const baseSchema: { [key: string]: any } = {
            nomorSTDB: z.string().nonempty('Nomor STDB Tidak Boleh Kosong !!!'),
            lokasiKebun: z
                .string()
                .nonempty('Lokasi Kebun Tidak Boleh Kosong !!!'),
            nomorSertifikat: z
                .string()
                .nonempty('Nomor Sertifikat Tidak Boleh Kosong !!!'),
            statusKepemilikanLahan: z
                .string()
                .nonempty('Pilih status kepemilikan lahan terlebih dahulu'),
            jenisTanaman: z
                .string()
                .nonempty('Jenis Tanaman Tidak Boleh Kosong !!!'),
            produksiPerHaPertahun: z
                .number()
                .nonnegative(
                    'Jumlah produksi Per Ha Pertahun harus angka positif',
                )
                .refine((value) => value !== undefined && value !== null, {
                    message: 'Produksi Per Ha Pertahun Tidak Boleh Kosong !!!',
                }),
            asalBenih: z.string().nonempty('Asal Benih Tidak Boleh Kosong !!!'),
            jumlahPohon: z
                .number()
                .nonnegative('Jumlah Pohon harus angka positif')
                .refine((value) => value !== undefined && value !== null, {
                    message: 'Jumlah Pohon Tidak Boleh Kosong !!!',
                }),
            polaTanam: z.string().nonempty('Pola Tanam Tidak Boleh Kosong !!!'),
            jenisPupuk: z
                .string()
                .nonempty('Jenis Pupuk Tidak Boleh Kosong !!!'),
            mitraPengolahan: z
                .string()
                .nonempty('Mitra Pengolahan Tidak Boleh Kosong !!!'),
            jenisTanah: z
                .string()
                .nonempty('Pilih Jenis Tanah terlebih dahulu !!!'),
            tahunTanam: z
                .string()
                .nonempty('Pilih Tahun Tanam terlebih dahulu !!!'),
            usahaLainDikebun: z
                .string()
                .nonempty('Usaha Lain di Kebun Tidak Boleh Kosong !!!'),
            oldImage: z.string().optional(), // Optional by default
            oldFileLegalitasLahan: z.string().optional(), // Optional by default

            image: z.any().optional(),
            fileLegalitasLahan: z.any().optional(),
            waktuPengajuan: z
                .string()
                .nonempty('Waktu Pengajuan Tidak Boleh Kosong !!!'),
            idPemetaanKebun: z
                .string()
                .nonempty('Id Pemetaan Kebun Tidak Boleh Kosong !!!'),
                nikKonfirmator: z
                .string()
                .nonempty('nik Konfirmator Tidak Boleh Kosong !!!'),
                namaKonfirmator: z
                .string()
                .nonempty('nama Konfirmator Tidak Boleh Kosong !!!'),
                idDataKebun: z
                .string()
                .nonempty('nama Konfirmator Tidak Boleh Kosong !!!'),
        };

        if (deleteImage) {
            baseSchema.image = imageSchema;
        }

        if (deleteLegalitas) {
            baseSchema.fileLegalitasLahan = pdfSchema;
        }
        return z.object(baseSchema);
    };

    // Example usage
    const schema = createSchema(deleteImage, deleteLegalitas);

    // Define type for form fields based on Zod schema
    type FormFields = z.infer<typeof schema>;

    // Component implementation remains the same

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
    const location = useLocation();
    const state = location.state;

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
              
                const legalitasLahan: LegalitasLahan =
                    await FindOneLegalitasLahan(state.customData);
                if (legalitasLahan) {
                    setStdbs([legalitasLahan]);

                    // setValue('nomorSTDB', legalitasLahan.nomorSTDB);
                    // setValue('lokasiKebun', legalitasLahan.alamatKebun);
                    // setValue('nomorSertifikat', legalitasLahan.nomorSertifikat);
                    // setValue('statusKepemilikanLahan', legalitasLahan.statusKepemilikanLahan);
                    // setValue('jenisTanaman', legalitasLahan.jenisTanaman);
                    // setValue('produksiPerHaPertahun', parseInt(legalitasLahan.produksiPerHaPertahun));
                    // setValue('asalBenih', legalitasLahan.asalBenih);
                    // setValue('polaTanam', legalitasLahan.polaTanam);
                    // setValue('jenisPupuk', legalitasLahan.jenisPupuk);
                    // setValue('mitraPengolahan', legalitasLahan.mitraPengolahan);
                    // setValue('jenisTanah', legalitasLahan.jenisTanah);
                    // setValue('tahunTanam', legalitasLahan.tahunTanam);
                    // setValue('usahaLainDikebun', legalitasLahan.usahaLainDikebun);
                    // setValue('jumlahPohon', parseInt(legalitasLahan.jumlahPohon));
                    // setValue('oldImage', legalitasLahan.cidFotoKebun);
                    // setValue('oldFileLegalitasLahan', legalitasLahan.cidFileLegalitasKebun);

                    setCidImage(legalitasLahan.cidFotoKebun);
                    setCidLegalitasLahan(legalitasLahan.cidFileLegalitasKebun);
                }
            } catch (error) {
                console.error('Failed to fetch Data hutan:', error);
            }
        };

        fetchDataPemetaanKebun();
    }, []);

    useEffect(() => {
        if (stdbs) {
            stdbs.forEach((legalitasLahan: LegalitasLahan, index) => {
                setValue('waktuPengajuan', legalitasLahan.waktuPengajuan);
                setValue('idPemetaanKebun', legalitasLahan.idPemetaanKebun);
                setValue('nomorSTDB', legalitasLahan.nomorSTDB);
                setValue('lokasiKebun', legalitasLahan.alamatKebun);
                setValue('nomorSertifikat', legalitasLahan.nomorSertifikat);
                setValue(
                    'statusKepemilikanLahan',
                    legalitasLahan.statusKepemilikanLahan,
                );
                setValue('jenisTanaman', legalitasLahan.jenisTanaman);
                setValue(
                    'produksiPerHaPertahun',
                    parseInt(legalitasLahan.produksiPerHaPertahun),
                );
                setValue('asalBenih', legalitasLahan.asalBenih);
                setValue('polaTanam', legalitasLahan.polaTanam);
                setValue('jenisPupuk', legalitasLahan.jenisPupuk);
                setValue('mitraPengolahan', legalitasLahan.mitraPengolahan);
                setValue('jenisTanah', legalitasLahan.jenisTanah);
                setValue('tahunTanam', legalitasLahan.tahunTanam);
                setValue('usahaLainDikebun', legalitasLahan.usahaLainDikebun);
                setValue('jumlahPohon', parseInt(legalitasLahan.jumlahPohon));
                setValue('nikKonfirmator', legalitasLahan.nikKonfirmator);
                setValue('namaKonfirmator', legalitasLahan.namaKonfirmator);
                setValue('idDataKebun', legalitasLahan.idDataKebun);
                setValue('oldImage', legalitasLahan.cidFotoKebun);
                setValue(
                    'oldFileLegalitasLahan',
                    legalitasLahan.cidFileLegalitasKebun,
                );
            });
        }
    }, [stdbs]);

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
            let cidFileLegalitasKebun = data.oldFileLegalitasLahan;
            let cidFotoKebun = data.oldImage;
            console.log('Submitting form with data:', data);
            if (deleteLegalitas === true) {
                // Upload LegalitasLahan
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
                cidFileLegalitasKebun = resData.IpfsHash;
            }

            if (deleteImage === true) {
                // Upload Image
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
                cidFotoKebun = resDataImage.IpfsHash;
            }

            const postData = {
                nomorSTDB: data.nomorSTDB,
                alamatKebun: data.lokasiKebun,
                statusKepemilikanLahan: data.statusKepemilikanLahan,
                nomorSertifikat: data.nomorSertifikat,
                jenisTanaman: data.jenisTanaman,
                produksiPerHaPerTahun: data.produksiPerHaPertahun,
                asalBenih: data.asalBenih,
                jumlahPohon: data.jumlahPohon,
                polaTanam: data.polaTanam,
                jenisPupuk: data.jenisPupuk,
                mitraPengolahan: data.mitraPengolahan,
                jenisTanah: data.jenisTanah,
                tahunTanam: data.tahunTanam,
                usahaLainDikebun: data.usahaLainDikebun,
                waktuPengajuan: data.waktuPengajuan,
                idPemetaanKebun: data.idPemetaanKebun,
                idDataKebun: data.idDataKebun,
                nikKonfirmator: data.nikKonfirmator,
                namaKonfirmator: data.namaKonfirmator,
                cidFileLegalitasKebun: cidFileLegalitasKebun,
                cidFotoKebun: cidFotoKebun,
            };

            const axiosRes = await axios.put(
                `https://palmmapping-backend.my.to/api/legalitasLahan/UpdateLegalitasLahan/${data.nomorSTDB}`,
                postData,
            );
            console.log('Axios response:');
            reset();
            const response = axiosRes.data.data;
            showSuccessNotification('Update Legalitas Lahan Berhasil');
            navigate('/dashboard/pengajuanSTDB');
            console.log(response);
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
    const handleDeleteImage = () => {
        setDeleteImage(true);
    };
    const handleDeleteLegalitas = () => {
        setDeleteLegalitas(true);
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
<div className='hidden'>

                           
                            <InputDashboard
                                label="Waktu Pengajuan"
                                id="waktuPengajuan"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Waktu Pengajuan"
                                // value={nik}
                                // readOnly="true"
                            />
                            <InputDashboard
                                label="Id Pemetaan Kebun"
                                id="idPemetaanKebun"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan id Pemetaan Kebun"
                            />
                            <InputDashboard
                                label="nik Konfirmator"
                                id="nikKonfirmator"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan nik Konfirmator"
                            />
                             <InputDashboard
                                label="nama Konfirmator"
                                id="namaKonfirmator"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Nama Konfirmator"
                            />
                             <InputDashboard
                                label="Id Data Kebun"
                                id="idDataKebun"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan id Data Kebun"
                            />
 </div>

                            <InputDashboard
                                label="Nomor STDB"
                                id="nomorSTDB"
                                type="string"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Nomor STDB"
                                disabled
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
                                label="Produksi Per Ha Pertahun"
                                id="produksiPerHaPertahun"
                                type="number"
                                register={register}
                                errors={errors}
                                placeholder="Masukan Produksi Per Ha Pertahun"
                                valueAsNumber
                                span="Ton"
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
                                span="Pohon"
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
                                disabled
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
                            {deleteLegalitas === true && (
                                <InputFile
                                    label="File Sertifikat Legalitas Lahan"
                                    id="fileLegalitasLahan"
                                    type="file"
                                    register={register}
                                    errors={errors}
                                />
                            )}
                            {deleteLegalitas === false && (
                                <div className="mb-6 mt-2">
                                    <p>File Legalitas Lahan</p>
                                    <div className="flex gap-8 items-center">
                                        <a
                                            href={`https://ipfs.io/ipfs/${cidLegalitasLahan}`}
                                            download="LegalitasKebun.pdf"
                                            className="font-medium text-blue-500"
                                        >
                                            Download File Legalitas
                                        </a>
<div className='hidden'>
                                        <InputDashboard
                                            label="CID Legalitas Lahan"
                                            id="oldFileLegalitasLahan"
                                            type="string"
                                            register={register}
                                            errors={errors}
                                            placeholder="Masukan CID Legalitas Lahan"
                                        />
</div>
                                        <Button
                                            type="button"
                                            onClick={handleDeleteLegalitas}
                                        >
                                            Delete Legalitas
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {deleteImage === true && (
                                <ImageUploader
                                    register={register}
                                    errors={errors}
                                    onImageUpload={handleImageUpload}
                                />
                            )}
                            {deleteImage === false && (
                                <div className="mb-6 mt-2">
                                    <p>Foto Lahan</p>
                                    <div className="flex gap-11 items-center">
                                        <div className="w-40 max-h-50 mb-2">
                                            <img
                                                src={`https://ipfs.io/ipfs/${cidImage}`}
                                                alt="Upload"
                                            />
                                        </div>
                                        <div className='hidden'>
                                        <InputDashboard
                                            label="CID Legalitas Lahan"
                                            id="oldImage"
                                            type="string"
                                            register={register}
                                            errors={errors}
                                            placeholder="Masukan CID Legalitas Lahan"
                                        />
                                        </div>
                                        <Button
                                            type="button"
                                            width="32"
                                            onClick={handleDeleteImage}
                                        >
                                            Delete Image
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${isSubmitting ? 'bg-opacity-90' : ''} `}
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

export default FormUpdateLegalitasLahan;
