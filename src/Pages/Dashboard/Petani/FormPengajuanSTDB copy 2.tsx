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
import useAuthStore from '../../../store/authStore';
import axios, { AxiosError } from 'axios';
import 'toastify-js/src/toastify.css';
import { useNavigate } from 'react-router-dom';
import { LegalitasLahan } from '../../../types/legalitasLahan';
import usePengajuanLegalitasLahanForm from '../../../Hooks/usePengajuanLegalitasLahanForm';

const FormPengajuanSTDB = () => {
    const { user, isError } = useAuthStore((state) => state); // Dapatkan fungsi loginUser dari useAuthStore

    const navigate = useNavigate();
    if (!user) {
        navigate('/login');
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        onSubmit,
    } = usePengajuanLegalitasLahanForm();

    const handleImageUpload = (file: File) => {
        // Here you can do whatever you want with the uploaded file
        console.log('Uploaded File:', file);
    };

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
