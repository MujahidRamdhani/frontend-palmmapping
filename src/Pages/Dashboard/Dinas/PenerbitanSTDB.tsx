import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TablePenerbitanSTDB from '../../../Components/Elements/Tables/TableVerifikasiPemetaan';
import TableHistoryPemetaanKebun from '../../../Components/Elements/Tables/TableHistoryPemetaanKebun';
import useIdPemetaanKebunStore from '../../../store/useIdPemetaanKebunStore';

const PenerbitanSTDB = () => {
    const idPemetaanKebun = useIdPemetaanKebunStore(
        (state) => state.idPemetaanKebun,
    );
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Verifikasi Pemetaan Kebun" />
            <div className="flex flex-col gap-10 mb-10">
                <TablePenerbitanSTDB />
            </div>
            <div>{idPemetaanKebun && <TableHistoryPemetaanKebun />}</div>
        </DefaultLayout>
    );
};

export default PenerbitanSTDB;
