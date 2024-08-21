import { ReactNode } from 'react';
import Logo from '../../images/logo/Logo.png';
import './stylesLogin.css';
import { useLocation } from 'react-router-dom';
interface AuthLayoutsProps {
    title: string;
    children: ReactNode;
}

const AuthLayouts: React.FC<AuthLayoutsProps> = ({ title, children }) => {
    const usepatch = useLocation();
    let ubahWidth = '';
    if (usepatch.pathname === '/register') {
        ubahWidth = 'sm:w-11/12 md:w-3/4 lg:w-2/4 xl:w-1/3';
    }
    return (
        <>
            <div className="h-screen w-screen flex justify-center items-center ">
                <div
                    className={`opacity-95 sm:shadow-xl px-10 pb-8 pt-12  sm:bg-white rounded-xl space-y-6 ${ubahWidth}`}
                    id="Login"
                >
                    <div className="flex justify-center">
                        <img
                            className="mx-auto h-20 w-auto"
                            src={Logo}
                            alt="Logo"
                        />
                    </div>
                    <div className="flex justify-center">
                        <h1 className="font-semibold text-2xl ">
                            Palm Mapping
                        </h1>
                    </div>
                    <h1 className="font-semibold text-xl">{title}</h1>
                    {children}
                    {/* <FormLogin />
                <p className="text-center">
                    Belum Mempunyai Akun?{' '}
                    <Link
                        className="text-indigo-500 hover:underline"
                        to="/register"
                    >
                        Registrasi
                    </Link>{' '}
                </p> */}
                </div>
            </div>
        </>
    );
};

export default AuthLayouts;
