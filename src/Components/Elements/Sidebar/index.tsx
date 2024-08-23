import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../../images/logo/Logo.png';
import useAuthStore from '../../../store/authStore';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const location = useLocation();
    const { pathname } = location;

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    const { user } = useAuthStore((state) => state); // Dapatkan fungsi loginUser dari useAuthStore
    const [roleState, setRoleState] = useState('');
    const [idRole, setIdRole] = useState('');
    const [nama, setNama] = useState('');
    useEffect(() => {
        if (user) {
            setRoleState(user.data.role);
            setIdRole(user.data.idRole);
            setNama(user.data.nama);
        }
    }, [user]);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-indigo-800 duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            {/* <!-- SIDEBAR HEADER --> */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-4">
                <NavLink to="/dashboard">
                    <div className="flex gap-4 items-center">
                        <img src={Logo} alt="Logo" className="w-15" />
                        <h2 className="font-extrabold text-violet-100">
                            Palm Mapping
                        </h2>
                    </div>
                </NavLink>

                <button
                    ref={trigger}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden"
                >
                    <svg
                        className="fill-current"
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                            fill=""
                        />
                    </svg>
                </button>
            </div>
            {/* <!-- SIDEBAR HEADER --> */}

            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                {/* <!-- Sidebar Menu --> */}
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    {/* <!-- Menu Group --> */}
                    <div>
                        <h3 className=" ml-4 text-sm font-semibold text-bodydark2">
                            MENU
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            {/* <!-- Menu Item Dashboard --> */}

                            {/* <!-- Menu Item Dashboard --> */}

                            {/* <!-- Menu Item Calendar --> */}

                            {/* <!-- Menu Item Profile --> */}
                            <li>
                                {/* <NavLink
                                    to="/"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                        pathname.includes('dashboard') &&
                                        'bg-indigo-600 dark:bg-meta-4'
                                    }`}
                                > */}
                                <NavLink
                                    to="/dashboard"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 $`}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            {/* <!-- Menu petani --> */}

                            {user && user.data.role === 'petani' ? (
                                <>
                                    <li>
                                        <NavLink
                                            to="/dashboard/PengajuanSTDB"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    'dashboard/PengajuanSTDB',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            Pengajuan Legalitas Lahan
                                        </NavLink>
                                    </li>
                                   

                                   
                                </>
                            ) : null}

                            {/* <!-- Menu Koperasi --> */}

                            {user && user.data.role === 'koperasi' ? (
                                <>
                                 <h3 className="mt-4 ml-4 text-sm font-semibold text-bodydark2">
                                        LEGALITAS LAHAN
                                    </h3>
                                    {/* <!-- Menu Riwayat Pengajuan STDB --> */}
                                    <li>
                                        <NavLink
                                            to="/dashboard/KonfirmasiSTDB"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    'dashboard/KonfirmasiSTDB',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            Konfirmasi Legalitas Lahan
                                        </NavLink>
                                    </li>

                                    {/* <!-- Menu Konfirmasi STDB --> */}
                                   

                                    {/* <!-- Menu Konfirmasi STDB --> */}
                                    <li>
                                        <NavLink
                                            to="/dashboard/RiwayatKonfirmasiSTDB"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    'dashboard/RiwayatSTDB',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            Riwayat Konfirmasi 
                                        </NavLink>
                                    </li>

                                    <h3 className="mt-4 ml-4 text-sm font-semibold text-bodydark2">
                                        PEMETAAN
                                    </h3>

                                    <ul className="mb-6 flex flex-col gap-1.5">
                                        {/* <!-- Menu Item Chart --> */}
                                        {/* <!-- Menu Item Daftar Pemetaan --> */}
                                        <li>
                                            <NavLink
                                                to="/dashboard/DaftarPemetaan"
                                                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 bg-indigo-600 dark:bg-meta-4`}
                                            >
                                                Daftar Pemetaan
                                            </NavLink>
                                        </li>
                                        {/* <!-- Menu Item Riwayat Pemetaan--> */}
                                        <li>
                                            <NavLink
                                                to="/dashboard/RiwayatPemetaan"
                                                className={'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 bg-indigo-600 dark:bg-meta-4'}
                                            >
                                                Riwayat Pemetaan
                                            </NavLink>
                                        </li>
                                        {/* <!-- Menu Item Ui Elements --> */}

                                        {/* <!-- Menu Item Ui Elements --> */}

                                        {/* <!-- Menu Item Auth Pages --> */}

                                        {/* <!-- Menu Item Auth Pages --> */}
                                    </ul>
                                </>
                            ) : null}

                            {/* <!-- Menu Dinas  --> */}
                            {user && user.data.role === 'dinas' ? (
                                <>
                                 <h3 className="mt-4 ml-4 text-sm font-semibold text-bodydark2">
                                        VERIFIKASI
                                </h3>
                                    {/* <!-- Menu Penerbitan STDB  --> */}
                                    <li>
                                        <NavLink
                                            to="/dashboard/PenerbitanSTDB"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    'dashboard/PenerbitanSTDB',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            Verifikasi Pemetaan Kebun
                                        </NavLink>
                                    </li>
                                    {/* <!-- Menu Riwayat Penerbitan STDB  --> */}
                                    <li>
                                        <NavLink
                                            to="/dashboard/RiwayatPenerbitanSTDB"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    'dashboard/RiwayataPenerbitanSTDB',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            Riwayat Verifikasi
                                        </NavLink>
                                    </li>
                                    <h3 className="mt-2 ml-4 text-sm font-semibold text-bodydark2">
                                        PENERBITAN
                                </h3>
                                    <li>
                                        <NavLink
                                            to="/dashboard/PenerbitanLegalitasLahan"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    '/PenerbitanLegalitasLahan',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            Penerbitan Legalitas Lahan
                                        </NavLink>
                                    </li>
                                    {/* <!-- Menu Riwayat Penerbitan STDB  --> */}
                                    <li>
                                        <NavLink
                                            to="/dashboard/RiwayatPenerbitanLegalitasLahan"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    'RiwayatPenerbitanLegalitasLahan',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            Riwayat Penerbitan Legalitas
                                        </NavLink>
                                    </li>
                                    <h3 className="mt-2 ml-4 text-sm font-semibold text-bodydark2">
                                        PEMETAAN HUTAN
                                    </h3>
                                    <li>
                                        <NavLink
                                            to="/dashboard/PemetaanHutan"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    '/PemetaanHutan',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            Pemetaan Hutan
                                        </NavLink>
                                    </li>
                                    <h3 className="mt-2 ml-4 text-sm font-semibold text-bodydark2">
                                        ENROLL CA
                                </h3>
                                    <li>
                                        <NavLink
                                            to="/dashboard/Users"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes('/Users') &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            
                                            Enroll CA Users
                                        </NavLink>
                                    </li>
                                    {/* <!-- Menu Riwayat Users  --> */}
                                   
                                </>
                            ) : null}

                            {/* <!-- Menu Super Admin  --> */}
                            {user && user.data.role === 'SUPER ADMIN' ? (
                                <>
                                    {/* <!-- Menu  Users  --> */}
                                    <li>
                                        <NavLink
                                            to="/dashboard/Users"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    'dashboard/PenerbitanSTDB',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            <svg
                                                className="fill-current"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                                    fill=""
                                                />
                                                <path
                                                    d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                                    fill=""
                                                />
                                            </svg>
                                            Enroll CA Users
                                        </NavLink>
                                    </li>
                                    {/* <!-- Menu Riwayat Users  --> */}
                                    <li>
                                        <NavLink
                                            to="/dashboard/RiwayatUsers"
                                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                                pathname.includes(
                                                    'dashboard/RiwayatUsers',
                                                ) &&
                                                'bg-indigo-600 dark:bg-meta-4'
                                            }`}
                                        >
                                            <svg
                                                className="fill-current"
                                                width="18"
                                                height="18"
                                                viewBox="0 0 18 18"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                                    fill=""
                                                />
                                                <path
                                                    d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                                    fill=""
                                                />
                                            </svg>
                                            Users
                                        </NavLink>
                                    </li>
                                </>
                            ) : null}
                           
                        </ul>
                    </div>

                    {/* <!-- Others Group --> */}
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                            OTHERS
                        </h3>

                        <ul className="mb-6 flex flex-col gap-1.5">
                            {/* <!-- Menu Item Chart --> */}
                            {/* <!-- Menu Item Profile --> */}
                            <li>
                                <NavLink
                                    to="/profile"
                                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-indigo-600 dark:hover:bg-meta-4 ${
                                        pathname.includes('profile') &&
                                        'bg-indigo-600 dark:bg-meta-4'
                                    }`}
                                >
                                    {/* <svg
                                        className="fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                            fill=""
                                        />
                                        <path
                                            d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                            fill=""
                                        />
                                    </svg> */}
                                    Profile
                                </NavLink>
                            </li>
                            {/* <!-- Menu Item Chart --> */}

                            {/* <!-- Menu Item Ui Elements --> */}

                            {/* <!-- Menu Item Ui Elements --> */}

                            {/* <!-- Menu Item Auth Pages --> */}

                            {/* <!-- Menu Item Auth Pages --> */}
                        </ul>
                    </div>
                </nav>
                {/* <!-- Sidebar Menu --> */}
            </div>
        </aside>
    );
};

export default Sidebar;
