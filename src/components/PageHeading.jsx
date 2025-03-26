import React from 'react';
import { Link } from 'react-router-dom';

const PageHeading = () => {
    return (
        <div className='flex items-center justify-between gap-9 mb-5 mt-1'>
            <h2 className='font-inter font-semibold text-lg text-[#4C4D5D]'>Add Patient</h2>
            <ul className='flex items-center gap-5'>
                <li className='font-inter font-normal text-sm text-M-text-color relative before:content-["\203A"] before:-right-3 before:top-1/2 before:-translate-y-1/2 before:absolute last:before:hidden before:text-lg last:text-M-text-color/50'><Link to={"#"} className='hover:text-M-primary-color transition-all duration-200 '>Dashboard</Link></li>
                <li className='font-inter font-normal text-sm text-M-text-color relative before:content-["\203A"] before:-right-3 before:top-1/2 before:-translate-y-1/2 before:absolute last:before:hidden before:text-lg last:text-M-text-color/50'><Link to={"#"} className='hover:text-M-primary-color transition-all duration-200 '>Manage Patients</Link></li>
                <li className='font-inter font-normal text-sm text-M-text-color relative before:content-["\203A"] before:-right-3 before:top-1/2 before:-translate-y-1/2 before:absolute last:before:hidden before:text-lg last:text-M-text-color/50'>Add New Patient</li>
            </ul>
        </div>
    );
};

export default PageHeading;