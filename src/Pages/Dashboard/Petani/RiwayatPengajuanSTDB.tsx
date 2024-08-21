import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';

import TableOne from '../../../Components/Elements/Tables/TableOne';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';

const RiwayatPengajuanSTDB = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Riwayat Pengajuan STDB" />
            <div className="flex flex-col gap-10">
                <div className="flex w-50 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <NavLink to={'/dashboard/RiwayatPengajuanSTDB'}>
                        Tambah Pengajuan STDB
                    </NavLink>
                </div>
                <TableOne />
            </div>
        </DefaultLayout>
    );
};

export default RiwayatPengajuanSTDB;
