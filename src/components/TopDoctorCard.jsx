import React from "react";
import { FaStar } from "react-icons/fa6";
import { GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";

const TopDoctorCard = ({ doctor, index }) => {
  return (
    <div
      key={index}
      className="flex items-center gap-6 bg-[#F6F8FB] py-4 px-5 rounded-md"
    >
      <img
        src={doctor.image}
        alt={`Dr. ${doctor.name}`}
        className="size-20 shrink-0 rounded-full object-cover"
      />
      <div>
        <h3 className="text-base text-M-text-color font-medium mb-1">
          {doctor.name}
        </h3>
        <p className="mb-3 text-sm text-M-text-color/60">
          {doctor.specialization}
        </p>
        <p className="flex items-center gap-1 font-inter font-medium text-M-text-color text-sm">
          <FaStar size={15} className="text-[#f9c45c]" /> {doctor.rating}
          <Link
            to="#"
            className="flex items-center gap-1 relative pl-[10px] before:size-[5px] before:bg-M-text-color before:rounded-full before:left-0 before:top-1/2 before:absolute before:-translate-y-1/2 hover:text-M-primary-color transition-all duration-300"
          >
            {doctor.reviews}+ Reviews <GoArrowRight size={16} />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default TopDoctorCard;
