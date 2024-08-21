import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TablePemetaanHutan from '../../../Components/Elements/Tables/TableDaftarPemetaanHutan';
import TableHistoryPemetaanHutan from '../../../Components/Elements/Tables/TableHistoryPemetaanHutan';
import { NavLink } from 'react-router-dom';
import useIdHutanStore from '../../../store/useIdHutanStore';

const PemetaanHutan = () => {
    const idHutanStore = useIdHutanStore((state) => state.idHutanStore);
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Pemetaan Hutan" />
            <div className="flex w-60 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <NavLink to={'/dashboard/PemetaanHutan/FormPemetaanHutan'}>
                    Tambah Pemetaan Hutan
                </NavLink>
            </div>
            <div className="flex flex-col gap-10 ">
                <TablePemetaanHutan />
            </div>
            <div className="flex flex-col gap-10 ">
                {idHutanStore && <TableHistoryPemetaanHutan />}
            </div>
        </DefaultLayout>
    );
};

export default PemetaanHutan;
