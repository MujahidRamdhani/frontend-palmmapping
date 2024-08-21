import React from 'react';
import { Link } from 'react-router-dom';
import FormLogin from '../Fragments/FormLogin';
import Logo from '../../images/logo/Logo.png';
const Login = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center ">
            <div
                className=" opacity-95 sm:shadow-xl px-8 pb-8 pt-12  sm:bg-white rounded-xl space-y-6"
                id="Login"
            >
                <div className="flex justify-center">
                    <img
                        className="mx-auto h-20 w-auto"
                        src={Logo}
                        alt="Palm Mapping"
                    />
                </div>
                <div className="flex justify-center">
                    <h1 className="font-semibold text-2xl ">Palm Mapping</h1>
                </div>
                <h1 className="font-semibold text-2xl">Login</h1>
                <FormLogin />
                <p className="text-center">
                    Belum Mempunyai Akun?{' '}
                    <Link
                        className="text-indigo-500 hover:underline"
                        to="/register"
                    >
                        Registrasi
                    </Link>{' '}
                </p>
            </div>
        </div>
    );
};

export default Login;
