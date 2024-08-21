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
const PengajuanSTDB = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore((state) => state);

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
            </div>
        </DefaultLayout>
    );
};

export default PengajuanSTDB;
