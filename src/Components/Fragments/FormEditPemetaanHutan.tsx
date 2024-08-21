import { useLocation, useNavigate } from 'react-router-dom';
import usePengajuanLegalitasLahanForm from '../../Hooks/usePenerbitanLegalitasLahan';
import Breadcrumb from '../Elements/Breadcrumbs/Breadcrumb';
import InputDashboard from '../Elements/Input/InputDashboard';
import DefaultLayout from '../Layouts/DefaultLayout';
import useAuthStore from '../../store/authStore';
import { useEffect, useState } from 'react';
import MapComponent from '../Elements/Tables/mapComponent';
import MapHutanComponent from '../Elements/Tables/mapHutanComponent';
import useTambahPemetaanHutan from '../../Hooks/usePemetaanHutanForm';
import { FindOnePemetaanHutan } from '../../Services/pemetaanHutanServices';
import { DataPemetaanHutan } from '../../types/dataPemetaanHutan';
import useUpdatePemetaanHutan from '../../Hooks/useUpdatePemetaanHutan';

const FormEditPemetaanHutan = () => {
    const { user } = useAuthStore((state) => state); // Dapatkan fungsi loginUser dari useAuthStore
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [idHutan, setIdHutan] = useState('');
    const [namaHutan, setNamaHutan] = useState('');
    const [luasHutan, setLuasHutan] = useState('');
    const [data, setData] = useState('');
    const [map, setMap] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state;
    if (!user) {
        navigate('/login');
    }
    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                console.log('data', state.customData);
                const data: DataPemetaanHutan[] = await FindOnePemetaanHutan(
                    state.customData,
                );
                console.log(data);
                if (data) {
                    setIdHutan(data.idHutan);
                    setNamaHutan(data.namaHutan);
                    setLongitude(data.longitude);
                    setLatitude(data.latitude);
                    setLuasHutan(data.luasHutan);
                } else {
                    console.error(
                        'Failed to fetch Data Pemetaan Kebun: No data returned',
                    );
                }
            } catch (error) {
                console.error('Failed to fetch Data hutan:', error);
            }
        };
        console.log(fetchDataPemetaanKebun());
        fetchDataPemetaanKebun();
    }, []);

    useEffect(() => {
        setValue('idHutan', idHutan);
        setValue('namaHutan', namaHutan);
        setValue('longitude', longitude);
        setValue('latitude', latitude);
        setValue('luasHutan', luasHutan);
    }, [luasHutan]);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        onSubmit,
        setValue,
    } = useUpdatePemetaanHutan();
    let step1 = 'bg-primary';
    const handleNext = (dataLatitide: string, dataLongitude: string) => {
        console.log(dataLatitide);
        if (
            dataLatitide == '' ||
            dataLatitide == undefined ||
            dataLatitide == null
        ) {
            setData('data tidak boleh kosong !!!'); //
            return;
        }
        if (
            dataLongitude == '' ||
            dataLongitude == undefined ||
            dataLongitude == null
        ) {
            setData('data tidak boleh kosong !!!'); //
            return;
        }
        setMap(true);
    };

    const handleBack = () => {
        setMap(false);
    };
    // setValue('luasHutan', luasHutan)
    useEffect(() => {
        console.log('Luas Hutan:', luasHutan);
        setValue('luasHutan', luasHutan);
    }, [luasHutan]);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Form Pemetaan Hutan" />
            <ol className="mx-auto mt-4 flex w-full max-w-lg items-center justify-between mb-10 ">
                <li className="flex w-full items-center text-slate-300">
                    <div className="relative flex flex-col items-center ">
                        <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full dark:bg-[#3C48FC] text-white ${step1} `}
                        >
                            {map ? (
                                1
                            ) : (
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            )}
                        </span>
                        <div className="absolute top-0 mt-12 w-32 text-center text-neutral-500 font-medium ">
                            Data Hutan
                        </div>
                    </div>
                    <div className="flex-auto border-t-2"></div>
                </li>

                <li>
                    <div className="relative flex flex-col items-center ">
                        <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full dark:bg-[#3C48FC] text-white ${map ? 'bg-primary' : 'bg-slate-300'} `}
                        >
                            {map ? (
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            ) : (
                                2
                            )}
                        </span>
                        <div className="absolute top-0 mt-12 w-32 text-center text-neutral-500 font-medium">
                            Detail Peta
                        </div>
                    </div>
                </li>
            </ol>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="px-2 pb-2 lg:pb-4">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Form Pemetaan Hutan
                        </h3>
                    </div>

                    {map && (
                        <MapHutanComponent
                            longitude={latitude}
                            latitude={longitude}
                            idHutan={idHutan}
                            namaHutan={namaHutan}
                            luas={setLuasHutan}
                            setLuasHutan={setLuasHutan}
                        />
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <div className={`p-6.5 ${map ? 'hidden' : ''}`}>
                                <InputDashboard
                                    label="Id Hutan"
                                    id="idHutan"
                                    type="string"
                                    register={register}
                                    errors={errors}
                                    placeholder="Masukan Id Hutan"
                                    disabled
                                    onChange={(e) => setIdHutan(e.target.value)}
                                />
                                <InputDashboard
                                    label="Nama Hutan"
                                    id="namaHutan"
                                    type="string"
                                    register={register}
                                    errors={errors}
                                    placeholder="Masukan Nama Hutan"
                                    onChange={(e) =>
                                        setNamaHutan(e.target.value)
                                    }
                                />
                                <div className="mt-6">
                                    <label
                                        className="mb-3 block text-black dark:text-white"
                                        htmlFor="latitude"
                                    >
                                        Data Latitude
                                    </label>
                                    <textarea
                                        id="latitude"
                                        {...register('latitude')}
                                        rows={6}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) =>
                                            setLongitude(e.target.value)
                                        }
                                        placeholder="Masukan Data Latitude"
                                    ></textarea>
                                </div>

                                <div className="mt-6">
                                    <label
                                        className="mb-3 block text-black dark:text-white"
                                        htmlFor="longitude"
                                    >
                                        Data Longitude
                                    </label>
                                    <textarea
                                        id="latitude"
                                        {...register('longitude')}
                                        rows={6}
                                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        onChange={(e) =>
                                            setLatitude(e.target.value)
                                        }
                                        placeholder="Masukan Data Longitude"
                                    ></textarea>
                                </div>

                                <InputDashboard
                                    label="Luas Hutan"
                                    id="luasHutan"
                                    type="string"
                                    register={register}
                                    errors={errors}
                                    placeholder="Masukan LuasHutan"
                                    hidden={true}
                                />
                            </div>

                            <div
                                className={`${map ? 'mt-14' : ' hidden'} z-10`}
                            >
                                <button
                                    type="submit"
                                    className={`flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 ${isSubmitting ? 'bg-opacity-90' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Loading...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="flex justify-center font-semibold text-red-500">
                        <h1>{data}</h1>
                    </div>

                    <div className="flex justify-end p-6.5">
                        {map ? (
                            <button
                                className="font-semibold text-xl text-primary"
                                type="button"
                                onClick={() => handleBack()}
                            >
                                Back
                            </button>
                        ) : (
                            <button
                                className="font-semibold text-xl text-primary"
                                type="button"
                                onClick={() => handleNext(latitude, longitude)}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default FormEditPemetaanHutan;
