import { useEffect, useState } from 'react';

import Loader from './common/Loader';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTitle from './Components/Elements/PageTitle';
import Profile from './Pages/Dashboard/Profile';
import TambahPemetaan from './Pages/TambahPemetaan';

import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard/Dashboard';
import PengajuanSTDB from './Pages/Dashboard/Petani/PengajuanSTDB';
import FormPengajuanSTDB from './Pages/Dashboard/Petani/FormPengajuanSTDB';
import PenolakanSTDB from './Pages/Dashboard/Koperasi/PenolakanSTDB';
import PenolakanPemetaan from './Pages/Dashboard/Petani/PenolakanPemetaan';
import RiwayatPengajuanSTDB from './Pages/Dashboard/Petani/RiwayatPengajuanSTDB';
import KonfirmaSTDB from './Pages/Dashboard/Koperasi/KonfirmaSTDB';
import RiwayatKonfirmasiSTDB from './Pages/Dashboard/Koperasi/RiwayatKonfirmasiSTDB';
import DaftarPemetaan from './Pages/Dashboard/Koperasi/DaftarPemetaan';
import RiwayatPemetaan from './Pages/Dashboard/Koperasi/RiwayatPemetaan';
import RiwayatPenerbitanSTDB from './Pages/Dashboard/Dinas/RiwayatPenerbitanSTDB';
import PenerbitanSTDB from './Pages/Dashboard/Dinas/PenerbitanSTDB';
import DetailPeta from './Pages/DetailPeta';
import Users from './Pages/Dashboard/Dinas/Users';
import RiwayatUsers from './Pages/Dashboard/Dinas/RiwayatUsers';
import PemetaanHutan from './Pages/Dashboard/Dinas/PemetaanHutan';
import PenerbitanLegalitasLahan from './Pages/Dashboard/Dinas/PenerbitanLegalitasLahan';
import FormPemetaanHutan from './Components/Fragments/FormPemetaanHutan';
import RiwayatPenerbitanLegalitasLahan from './Pages/Dashboard/Dinas/RiwayatPenerbitanLegalitasLahan';

import FormEditPemetaanHutan from './Components/Fragments/FormEditPemetaanHutan';
import FormUpdatePemetaanKebun from './Pages/Dashboard/Petani/FormUpdatePemetaanKebun';
import FormUpdateLegalitasLahan from './Pages/Dashboard/Petani/FormUpdateLegalitasLahan';

const App = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);
    return loading ? (
        <Loader />
    ) : (
        <>
            <Routes>
          
                <Route
                    index
                    element={
                        <>
                            <PageTitle title="Login | Palm Mapping" />
                            <Login />
                        </>
                    }
                />

                <Route
                    path="/dashboard/LegalitasLahan/FormUpdateLegalitasLahan"
                    element={
                        <>
                            <PageTitle title="Update Legalitas Lahan | Palm Mapping" />
                            <FormUpdateLegalitasLahan />
                        </>
                    }
                />

                <Route
                    path="/PalmMapping"
                    element={
                        <>
                            <PageTitle title="Detail Peta | Palm Mapping" />
                            <Home />
                        </>
                    }
                />
                <Route
                    path="/DetailPeta"
                    element={
                        <>
                            <PageTitle title="Detail Peta | Palm Mapping" />
                            <DetailPeta />
                        </>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <>
                            <PageTitle title="Profile | Palm Mapping" />
                            <Profile />
                        </>
                    }
                />
                <Route
                    path="/PengajuanSTDB"
                    element={
                        <>
                            <PageTitle title="Pengajuan Legalitas Lahan | Palm Mapping" />
                            <PengajuanSTDB />
                        </>
                    }
                />
                <Route
                    path="/TambahPemetaan"
                    element={
                        <>
                            <PageTitle title="Tambah pemetaan Kebun | Palm Mapping" />
                            <TambahPemetaan />
                        </>
                    }
                />
                <Route
                    path="/Register"
                    element={
                        <>
                            <PageTitle title="Register | Palm Mapping" />
                            <Register />
                        </>
                    }
                />
                <Route
                    path="/Login"
                    element={
                        <>
                            <PageTitle title="Login | Palm Mapping" />
                            <Login />
                        </>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <PageTitle title="Dashboard | Palm Mapping" />
                            <Dashboard />
                        </>
                    }
                />
                <Route
                    path="/dashboard/PengajuanSTDB"
                    element={
                        <>
                            <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                            <PengajuanSTDB />
                        </>
                    }
                />
                <Route
                    path="/dashboard/PengajuanSTDB/FormPengajuanSTDB"
                    element={
                        <>
                            <PageTitle title="Form Pengajuan Legalitas Lahan | Palm Mapping" />
                            <FormPengajuanSTDB />
                        </>
                    }
                />
                <Route
                    path="/dashboard/Petani/penolakanPemetaan"
                    element={
                        <>
                            <PageTitle title="Penolakan Legalitas Lahan | Petani  | Palm Mapping" />
                            <PenolakanPemetaan />
                        </>
                    }
                />
                <Route
                    path="/dashboard/PenolakanSTDB"
                    element={
                        <>
                            <PageTitle title="Penolakan Legalitas Lahan | Koperasi | Palm Mapping" />
                            <PenolakanSTDB />
                        </>
                    }
                />
                <Route
                    path="/dashboard/RiwayatPengajuanSTDB"
                    element={
                        <>
                            <PageTitle title="Riwayat Pengajuan Legalitas Lahan | Petani  | Palm Mapping" />
                            <RiwayatPengajuanSTDB />
                        </>
                    }
                />

                {/* <!-- Koperasi --> */}
                <Route
                    path="/dashboard/KonfirmasiSTDB"
                    element={
                        <>
                            <PageTitle title="Konfirmasi Pengajuan Legalitas Lahan | Koperasi  | Palm Mapping" />
                            <KonfirmaSTDB />
                        </>
                    }
                />

                <Route
                    path="/dashboard/RiwayatKonfirmasiSTDB"
                    element={
                        <>
                            <PageTitle title="Riwayat Konfirmasi Pengajuan Legalitas Lahan | Koperasi  | Palm Mapping" />
                            <RiwayatKonfirmasiSTDB />
                        </>
                    }
                />

                <Route
                    path="/dashboard/DaftarPemetaan"
                    element={
                        <>
                            <PageTitle title="Daftar Pemetaan | Koperasi  | Palm Mapping" />
                            <DaftarPemetaan />
                        </>
                    }
                />
                <Route
                    path="/dashboard/RiwayatPemetaan"
                    element={
                        <>
                            <PageTitle title="Riwayat Pemetaan | Koperasi  | Palm Mapping" />
                            <RiwayatPemetaan />
                        </>
                    }
                />
                <Route
                    path="/dashboard/PemetaanKebun/FormUpdatePemetaanKebun"
                    element={
                        <>
                            <PageTitle title="Form Update Pemetaan Kebun | Dinas  | Palm Mapping" />
                            <FormUpdatePemetaanKebun />
                        </>
                    }
                />

                {/* <!-- Dinas --> */}
                <Route
                    path="/dashboard/PenerbitanSTDB"
                    element={
                        <>
                            <PageTitle title="Verifikasi Pemetaan | Dinas  | Palm Mapping" />
                            <PenerbitanSTDB />
                        </>
                    }
                />

                <Route
                    path="/dashboard/RiwayatPenerbitanSTDB"
                    element={
                        <>
                            <PageTitle title="Riwayat Verifikasi Pemetaan | Dinas  | Palm Mapping" />
                            <RiwayatPenerbitanSTDB />
                        </>
                    }
                />

                <Route
                    path="/dashboard/PenerbitanLegalitasLahan"
                    element={
                        <>
                            <PageTitle title="Penerbitan Legalitas Lahan | Dinas  | Palm Mapping" />
                            <PenerbitanLegalitasLahan />
                        </>
                    }
                />
                <Route
                    path="/dashboard/RiwayatPenerbitanLegalitasLahan"
                    element={
                        <>
                            <PageTitle title="Riwayat Penerbitan Legalitas Lahan | Dinas  | Palm Mapping" />
                            <RiwayatPenerbitanLegalitasLahan />
                        </>
                    }
                />
                <Route
                    path="/dashboard/PemetaanHutan"
                    element={
                        <>
                            <PageTitle title="Daftar Pemetaan Hutan | Dinas  | Palm Mapping" />
                            {/* <FormPemetaanHutan /> */}
                            <PemetaanHutan />
                        </>
                    }
                />

                <Route
                    path="/dashboard/PemetaanHutan/FormPemetaanHutan"
                    element={
                        <>
                            <PageTitle title="Form Pemetaan Hutan | Dinas  | Palm Mapping" />
                            <FormPemetaanHutan />
                        </>
                    }
                />
                <Route
                    path="/dashboard/PemetaanHutan/FormEditPemetaanHutan"
                    element={
                        <>
                            <PageTitle title="Form Edit Pemetaan Hutan | Dinas  | Palm Mapping" />
                            <FormEditPemetaanHutan />
                        </>
                    }
                />

                <Route
                    path="/dashboard/Users"
                    element={
                        <>
                            <PageTitle title="Kelola User | Dinas  | Palm Mapping" />
                            <Users />
                        </>
                    }
                />
                <Route
                    path="/dashboard/RiwayatUsers"
                    element={
                        <>
                            <PageTitle title="Daftar User | Dinas  | Palm Mapping" />
                            <RiwayatUsers />
                        </>
                    }
                />
            </Routes>
        </>
    );
};

export default App;
