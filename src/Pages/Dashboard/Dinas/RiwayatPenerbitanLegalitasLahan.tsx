import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TableOne from '../../../Components/Elements/Tables/TableOne';
import TableRiwayatPenerbitanLegalitasLahan from '../../../Components/Elements/Tables/TableRiwayatPenerbitanLegalitasLahan';

const RiwayatPenerbitanLegalitasLahan = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Riwayat Penerbitan Legalitas Lahan" />
            <div className="flex flex-col gap-10 ">
                <TableRiwayatPenerbitanLegalitasLahan />
            </div>
        </DefaultLayout>
    );
};

export default RiwayatPenerbitanLegalitasLahan;
