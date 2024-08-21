import AuthLayouts from '../Components/Layouts/AuthLayouts';
import FormRegister from '../Components/Fragments/FormRegister';
import { Link } from 'react-router-dom';
import ParticlesComponent from '../Components/Elements/Particles/Particles';
import Navbar from '../Components/Elements/Navbar/Navbar';

const Register = () => {
    return (
        <>
            <ParticlesComponent id="particles" />
            <Navbar />
            <AuthLayouts title="Registrasi">
                <FormRegister />
                <p className="text-center">
                    Sudah Mempunyai Akun?{' '}
                    <Link className="text-indigo-500 hover:underline" to="/">
                        Login
                    </Link>{' '}
                </p>
            </AuthLayouts>
        </>
    );
};

export default Register;
