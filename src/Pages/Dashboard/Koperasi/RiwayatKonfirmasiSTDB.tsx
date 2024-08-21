import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TableRiwayatKonfirmasiSTDB from '../../../Components/Elements/Tables/TableRiwayatKonfirmasiSTDB';

const RiwayatKonfirmasiSTDB = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Riwayat Konfirmasi Legalitas Lahan" />
            <div className="flex flex-col gap-10 ">
                <TableRiwayatKonfirmasiSTDB />
            </div>
            
        </DefaultLayout>
    );
};

export default RiwayatKonfirmasiSTDB;
