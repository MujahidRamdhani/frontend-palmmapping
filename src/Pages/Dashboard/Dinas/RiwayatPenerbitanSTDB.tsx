
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TableRiwayatPenerbitanSTDB from '../../../Components/Elements/Tables/TableRiwayatPenerbitanSTDB';
import TableHistoryPemetaanKebun from '../../../Components/Elements/Tables/TableHistoryPemetaanKebun';
import useIdPemetaanKebunStore from '../../../store/useIdPemetaanKebunStore';

const RiwayatPenerbitanSTDB = () => {
    const idPemetaanKebun = useIdPemetaanKebunStore(
        (state) => state.idPemetaanKebun,
    );
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Riwayat Verifikasi Pemetaan" />
            <div className="flex flex-col gap-10 ">
                <TableRiwayatPenerbitanSTDB />
            </div>
            <div>{idPemetaanKebun && <TableHistoryPemetaanKebun />}</div>
        </DefaultLayout>
    );
};

export default RiwayatPenerbitanSTDB;
