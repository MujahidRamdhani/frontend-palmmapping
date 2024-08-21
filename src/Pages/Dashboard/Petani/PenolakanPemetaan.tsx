import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TablePenolakanPemetaanPetani from '../../../Components/Elements/Tables/TablePenolakanPemetaanPetani';

const PenolakanSTDB = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Pengajuan Legalitas Yang Ditolak" />
            <div className="flex flex-col gap-10 ">
                <TablePenolakanPemetaanPetani />
            </div>
        </DefaultLayout>
    );
};

export default PenolakanSTDB;
