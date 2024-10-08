import { NavLink } from 'react-router-dom';
import Logo from '../../../images/logo/Logo.png';
import useAuthStore from '../../../store/authStore';
import DropdownUser from '../Header/DropdownUser';
const Navbar = () => {
    const { user } = useAuthStore((state) => state);
    return (
        <>
            <nav className="nav shadow-lg mb-5">
                <div className="md:flex items-center justify-between py-2 px-8 md:px-12 md:w-11/12 lg:w-5/6 xl:w-4/5 mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-800 md:text-3xl">
                            <div className="flex items-center">
                                <NavLink to="/">
                                    <img
                                        src={Logo}
                                        alt="Logo"
                                        className="w-15"
                                    />
                                </NavLink>
                                <h1 className="text-2xl text-white opacity-90">
                                    Palm Mapping
                                </h1>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <button
                                type="button"
                                className="block text-gray-800 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6 fill-current"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className="hidden"
                                        d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"
                                    />
                                    <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:block mx-2 text-white font-semibold font-satoshi">
                        {user ? (
                            <>
                                <div className="flex items-center gap-3 ">
                                    <NavLink
                                        to="/Dashboard"
                                        className="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2"
                                    >
                                        Dashboard
                                    </NavLink>

                                    <DropdownUser />
                                </div>
                            </>
                        ) : (
                            <>
                                
                                <NavLink
                                    to="/login"
                                    className="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="text-gray-800 rounded hover:bg-gray-900 hover:text-gray-100 hover:font-medium py-2 px-2 md:mx-2"
                                >
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
