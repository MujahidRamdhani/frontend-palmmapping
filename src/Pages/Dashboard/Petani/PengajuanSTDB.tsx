import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import Button from '../../../Components/Elements/Button/Button';
import TableOne from '../../../Components/Elements/Tables/TableOne';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TablePengajuanSTDB from '../../../Components/Elements/Tables/TablePengajuanSTDB';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../../../store/authStore';
import useHistoryPengajuanLegalitasStore from '../../../store/useHistoryPengajuanLegalitasStore';
import TableHistoryPengajuanLegalitas from '../../../Components/Elements/Tables/TableHistoryPengajuanLegalitas';
import axios from 'axios';
type UserData = {
    nik: string;
    email: string;
    nama: string;
    alamat: string;
    nomorTelepon: string;
    idKoperasi: string;
    lengkap: string
    profilLengkap: string
    role: string
};
const PengajuanSTDB = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuthStore((state) => state);
    useEffect(() => {
        const fetchKoperasiData = async () => {
            try {
                const response = await axios.get<{ data: UserData }>(
                    'http://localhost:9999/api/users/profil',
                );
                const data = response.data.data;
    
                if (data.role === 'PETANI') { // Use '===' for comparison
                    console.log('role:', data.role);
                    if (data.profilLengkap === 'FALSE') {
                      
                        setShowModal(true);
                    }
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchKoperasiData();
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        console.log(user);
    }, []);
    const historyPengajuanLegalitas = useHistoryPengajuanLegalitasStore(
        (state) => state.historyPengajuanLegalitas,
    );
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Pengajuan Legalitas Lahan" />
            <div className="flex flex-col gap-10">
                <div className="flex w-70 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <NavLink to={'/dashboard/PengajuanSTDB/FormPengajuanSTDB'}>
                        Tambah Pengajuan Legalitas Lahan
                    </NavLink>
                </div>
                <TablePengajuanSTDB />
                <div>
                    {historyPengajuanLegalitas && (
                        <TableHistoryPengajuanLegalitas />
                    )}
                </div>
                {showModal && (
                    <div className="z-999999">
                        <div className={``}>
                            <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm">
                                <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                    <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all lg:w-2/4 sm:w-4/6 xl:w-1/2 ">
                                        <header className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex  mx-1">
                                            <p className="text-lg font-semibold text-center flex-grow">
                                                Peringatan !!
                                            </p>
                                        </header>
                                        <div className="max-h-125  scoll p-4 ">
                                            {/* content 1 */}
                                            <div className="flex items-center justify-center">
                                                <div className="text-center">
                                                    <h1 className="font-semibold">
                                                        Lengkapi Dahulu Profile Akun 
                                                    </h1>
                                                    <span className="text-sm">
                                                        Silahkan tekan tombol di bawah untuk melengkapi profile
                                                    </span>
                                                    <div className="mt-4">
                                                        {/* <Stepper stepsConfig={stdb} />  */}
                                                        {/* {console.log(stdb)}  */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <footer className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mx-1">
                                        <NavLink
                                                            to="/profile"
                                                           
                                                            className="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#34D399] text-base font-medium text-white hover:bg-[#207a59] sm:ml-3 sm:w-auto sm:text-sm"
                                                           
                                                        >
                                                           Lengkapi
                                                        </NavLink>

                                         
                                        </footer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default PengajuanSTDB;
