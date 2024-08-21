import React from 'react';
import { NavLink } from 'react-router-dom';
import Breadcrumb from '../../../Components/Elements/Breadcrumbs/Breadcrumb';
import Button from '../../../Components/Elements/Button/Button';
import TableOne from '../../../Components/Elements/Tables/TableOne';
import DefaultLayout from '../../../Components/Layouts/DefaultLayout';
import TableUsers from '../../../Components/Elements/Tables/TableUsers';

const Users = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Enroll Certificate Authory kepada Pengguna" />
            <div className="flex flex-col gap-10">
                <TableUsers />
            </div>
        </DefaultLayout>
    );
};

export default Users;
