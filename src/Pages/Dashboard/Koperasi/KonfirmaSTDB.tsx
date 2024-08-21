import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TableOne from '../../../Components/Elements/Tables/TableOne';
import TableKonfirmasiSTDB from '../../../Components/Elements/Tables/TableKonfirmasiSTDB';
import useHistoryPengajuanLegalitasStore from '../../../store/useHistoryPengajuanLegalitasStore';
import TableHistoryPengajuanLegalitas from '../../../Components/Elements/Tables/TableHistoryPengajuanLegalitas';
const KonfirmaSTDB = () => {
    const historyPengajuanLegalitas = useHistoryPengajuanLegalitasStore(
        (state) => state.historyPengajuanLegalitas,
    );

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Konfirmasi Legalitas Lahan" />
            <div className="flex flex-col gap-10 ">
                <TableKonfirmasiSTDB />
            </div>
            <div>
                {historyPengajuanLegalitas && (
                    <TableHistoryPengajuanLegalitas />
                )}
            </div>
        </DefaultLayout>
    );
};

export default KonfirmaSTDB;
