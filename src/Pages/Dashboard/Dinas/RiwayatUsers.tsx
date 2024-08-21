import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TableRiwayatUsers from '../../../Components/Elements/Tables/TableRiwayatUsers';

const Users = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Manage Users" />
            <div className="flex flex-col gap-10">
                <TableRiwayatUsers />
            </div>
        </DefaultLayout>
    );
};

export default Users;
