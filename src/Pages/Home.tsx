import React, { useState } from 'react';
import Peta from './Peta';
import Header from '../Components/Elements/Header';
import Chart from './Chart';
import Keterangan from './Keterangan';
import { NavLink, useLocation } from 'react-router-dom';
import useStore from '../store/filterStore';
import Logo from '../images/logo/Logo.png';
import Navbar from '../Components/Elements/Navbar/Navbar';
import Footer from '../Components/Elements/Footer';
import ParticlesComponent from '../Components/Elements/Particles/Particles';
import useAuthStore from '../store/authStore';
const Home = () => {
    const selectedCategory = useStore((state) => state.selectedCategory);

    return (
        <div className=" ">
            <Navbar />
            <ParticlesComponent id="particles" />

            <div className='className="flex mx-auto justify-center md:w-11/12 lg:w-5/6 xl:w-10/12">'>
                <div className="flex justify-center mb-4">
                    <h1 className="text-xl font-extrabold text-white">
                        {selectedCategory && (
                            <>Filter Kawasan : {selectedCategory}</>
                        )}
                    </h1>
                </div>
                <div className="mb-22">
                    <Peta />
                </div>
                <Keterangan />
                <Chart />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
