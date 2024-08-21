import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TablePenerbitanLegalitasLahan from '../../../Components/Elements/Tables/TablePenerbitanLegalitasLahan';

const PenerbitanLegalitasLahan = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Penerbitan Legalitas Lahan" />
            <div className="flex flex-col gap-10 ">
                <TablePenerbitanLegalitasLahan />
            </div>
        </DefaultLayout>
    );
};

export default PenerbitanLegalitasLahan;
