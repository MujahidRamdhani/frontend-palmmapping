import DefaultLayout from '../../Components/Layouts/DefaultLayout';
import CardDataStats from '../../Components/Elements/CardDataStats';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiBadgeCheck, HiClipboardCheck, HiOutlineViewBoards } from 'react-icons/hi';
import { getCookieValue } from '../../utils/cookieUtils';
import { GetAllLegalitasLahan } from '../../Services/legalitasLahanServices';
import { GetAllDataPemetaanKebun } from '../../Services/pemetaanKebunServices';
import { LegalitasLahan } from '../../types/legalitasLahan';
import { DataPemetaanKebun } from '../../types/dataPemetaanKebun';
import { GetAllDataPemetaanHutan } from '../../Services/pemetaanHutanServices';
import { DataPemetaanHutan } from '../../types/dataPemetaanHutan';
import { HiGlobeEuropeAfrica } from 'react-icons/hi2';
import { NavLink } from 'react-router-dom';
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
    nikKonfirmator: string;
    namaKonfirmator: string;
    statusKonfirmasi: string;
    waktuStatusKonfirmasi: string;
    alasanPenolakan: string;
    nipDinas: string;
    namaDinas: string;
    waktuPenerbitanSTDB: string;
    createdAt: string;
    statusPemetaan: string;
    statusPenerbitanSTDB: string;
    nikSurveyor: string;
}
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

const Dashboard = () => {
    const [roleState, setRoleState] = useState('');
    const [profileLengap, setProfileLengap] = useState('');
    const [STDBS, setSTDBS] = useState<Cooperative[]>([]);
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);
    const [dataPemetaanHutan, setDataPemetaanHutan] = useState<DataPemetaanHutan[]>([]);
    const { user, logout } = useAuthStore((state) => state);
    
    if (user) {
        console.log('User is logged in:', user.data.role);
    } else {
        console.log('User is not logged in');
    }
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchKoperasiData = async () => {
            try {
                const response = await axios.get<{ data: UserData }>(
                    'https://palmmapping-backend.my.to/api/users/profil',
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

    const navigate = useNavigate();
    const [nik, setNik] = useState('');
   
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setRoleState(user.data.role);
            setNik(user.data.idRole);
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

 

   
    const filterData = (data: LegalitasLahan[]) => {
        return data.filter((item: LegalitasLahan) => item.nik === nik);
    };

    const filterDataKonfirmasi = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) =>
                item.nikKonfirmator === nik &&
                item.statusKonfirmator === 'Disetujui',
        );
    };

    const filterDataPemetaan = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) =>
                item.nikSurveyor === nik && item.idPemetaanKebun !== 'Belum dipetakan',
        );
    };

    const filterDataPenerbitan = (data: LegalitasLahan[]) => {
        return data.filter(
            (item: LegalitasLahan) =>
                item.nipPenerbitLegalitas === nik &&
                item.statusPenerbitLegalitas === 'Diterbitkan',
        );
    };
    const filterDataPemetaanHutan = (data: DataPemetaanHutan[]) => {
        return data.filter(
            (item: DataPemetaanHutan) =>
                item.nipSurveyor === nik 
        );
    };

    const calculateTotalLuasArealKebun = (data: LegalitasLahan[]) => {
        return data.reduce((total, item) => total + parseFloat(item.luasKebun || '0', 10), 0);
    };

  

    useEffect(() => {
        const fetchSTDBS = async () => {
            try {
                const data = await GetAllLegalitasLahan();
                setStdbs(data);
            } catch (error) {
                console.error('Failed to fetch STDBS:', error);
            }
        };

        fetchSTDBS();
    }, []);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanKebun();
                setDataPemetaan(data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        fetchDataPemetaanKebun();
    }, [])

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanHutan();
                setDataPemetaanHutan(data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        console.log(fetchDataPemetaanKebun());
        fetchDataPemetaanKebun();
    }, []);

    const mergeData = (
        stdbs: LegalitasLahan[],
        dataPemetaan: DataPemetaanKebun[],
    ) => {
        return stdbs.map((stdb) => {
            const matchingPemetaan = dataPemetaan.find(
                (pemetaan) => pemetaan.idPemetaanKebun === stdb.idPemetaanKebun,
            );
            return {
                ...stdb,
                ...matchingPemetaan,
            };
        });
    };
    const combinedData = mergeData(stdbs, dataPemetaan);

    return (
        <DefaultLayout>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                {roleState === 'petani' && (
                    <>
                        <CardDataStats
                            title="Total Pengajuan Legalitas Lahan"
                            total={filterData(combinedData).length}
                        >
                            <HiClipboardCheck
                                className="fill-primary dark:fill-white"
                                width="22"
                                height="16"
                            />
                        </CardDataStats>
                        <CardDataStats
                            title="Luas Areal Kebun"
                            total={calculateTotalLuasArealKebun(
                                filterData(combinedData),
                            )}
                            Ha={true}
                        >
                            <HiOutlineViewBoards
                                className="fill-primary dark:fill-white"
                                width="22"
                                height="16"
                            />
                        </CardDataStats>
                    </>
                )}
             
                
                {roleState === 'koperasi' && (
                    <>
                        <CardDataStats
                            title="Total Legalitas Lahan Yang telah Dikonfirmasi"
                            total={filterDataKonfirmasi(combinedData).length}
                        >
                            <HiClipboardCheck
                                className="fill-primary dark:fill-white"
                                width="22"
                                height="16"
                            />
                        </CardDataStats>
                        <CardDataStats
                            title="Total Lahan yang telah dipetakan"
                            total={filterDataPemetaan(combinedData).length}
                        >
                            <HiGlobeEuropeAfrica
                                className="fill-primary dark:fill-white"
                                width="22"
                                height="16"
                            />
                        </CardDataStats>
                    </>
                )}
                {roleState === 'dinas' && (


                    <>
                    <CardDataStats
                            title="Total Pemetaan Hutan"
                            total={filterDataPemetaanHutan(dataPemetaanHutan).length}
                        >
                            <HiGlobeEuropeAfrica
                                className="fill-primary dark:fill-white"
                                width="22"
                                height="16"
                            />
                        </CardDataStats>
                        
                        <CardDataStats
                            title="Total Verifikasi Pemetaan Kebun"
                            total={filterDataPenerbitan(combinedData).length}
                        >
                            <HiBadgeCheck 
                                className="fill-primary dark:fill-white"
                                width="22"
                                height="16"
                            />
                        </CardDataStats>
                        <CardDataStats
                            title="Total Penerbitan  Legalitas Lahan"
                            total={filterDataPenerbitan(combinedData).length}
                        >
                            <HiClipboardCheck
                                className="fill-primary dark:fill-white"
                                width="22"
                                height="16"
                            />
                        </CardDataStats>
                        
                    </>
                )}
                
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

export default Dashboard;
