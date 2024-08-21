import AuthLayouts from '../Components/Layouts/AuthLayouts';
import FormLogin from '../Components/Fragments/FormLogin';
import { Link } from 'react-router-dom';
import ParticlesComponent from '../Components/Elements/Particles/Particles';
import './app.css';
import Navbar from '../Components/Elements/Navbar/Navbar';
const Login = () => {
    localStorage.removeItem('auth-storage');
    return (
        <>
            <ParticlesComponent id="particles" />
            <Navbar />
            <AuthLayouts title="Login">
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
            </AuthLayouts>
        </>
    );
};

export default Login;
