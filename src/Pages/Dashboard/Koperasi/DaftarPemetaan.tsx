import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TableOne from '../../../Components/Elements/Tables/TableOne';
import TableKonfirmasiSTDB from '../../../Components/Elements/Tables/TableKonfirmasiSTDB';
import TableDaftarPemetaan from '../../../Components/Elements/Tables/TableDaftarPemetaan';

const DaftarPemetaan = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Daftar Pemetaan kebun" />
            <div className="flex flex-col gap-10 ">
                <TableDaftarPemetaan />
            </div>
            
        </DefaultLayout>
    );
};

export default DaftarPemetaan;
