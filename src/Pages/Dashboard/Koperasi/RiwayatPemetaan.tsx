import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TableOne from '../../../Components/Elements/Tables/TableOne';
import TableRiwayatPemetaan from '../../../Components/Elements/Tables/TableRiwayatPemetaan';
import TableHistoryPemetaanKebun from '../../../Components/Elements/Tables/TableHistoryPemetaanKebun';
import useIdPemetaanKebunStore from '../../../store/useIdPemetaanKebunStore';

const RiwayatPemetaan = () => {
    const idPemetaanKebun = useIdPemetaanKebunStore(
        (state) => state.idPemetaanKebun,
    );
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Riwayat Pemetaan Kebun" />
            <div className="flex flex-col gap-10 ">
                <TableRiwayatPemetaan />
                {/* <Breadcrumb pageName="History Pemetaan kebun" /> */}

                {idPemetaanKebun && <TableHistoryPemetaanKebun />}
            </div>
        </DefaultLayout>
    );
};

export default RiwayatPemetaan;
