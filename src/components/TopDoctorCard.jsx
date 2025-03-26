import React from 'react';
import drImg from "../../src/assets/dr-one.jpg"
import { FaStar } from "react-icons/fa6";
import { GoArrowRight } from "react-icons/go";
import { Link } from 'react-router-dom';

const TopDoctorCard = () => {
    return (
        <div className="grid grid-cols-3 gap-5">
                <div className='flex items-center gap-6 bg-M-text-color/10 py-4 px-5'>
            <img src={drImg} alt="dr Image" className='size-20 shrink-0 rounded-full object-cover'/>
            <div>
                <h3 className='text-sm text-M-text-color font-normal'>Dr. Master Gulati</h3>
                <p>Dental Specialist</p>
                <p className='flex items-center gap-1 font-inter font-normal text-M-text-color'>
                    <FaStar size={16} className='text-[#f9c45c]' /> 5.0 
                    <Link to="#" className='flex items-center relative pl-3 bg-M-secondary-color before:size-[6px] before:bg-M-text-color before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 '>580+ Reviews  <GoArrowRight size={16} /></Link>
                </p>
            </div>
        </div>
        </div>
    );
};

export default TopDoctorCard;