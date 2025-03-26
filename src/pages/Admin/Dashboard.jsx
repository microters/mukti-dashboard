import React, { useState } from "react";
import { TbSortAscending } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { TiArrowRight } from "react-icons/ti";
import { HiDotsVertical } from "react-icons/hi";
import Cards from "../../components/Cards";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
// import DatePicker from "../../components/DatePicker";

const AdminDashboard = () => {
  const [value, setValue] = useState(null);
  const dashboardData = [
    {
      category: "Appointments",
      total: 185,
      status: "Today",
      cardListDetails: [
        {
          label: "New Appointments",
          value: "125",
        },
        {
          label: "Total Appointments",
          value: "89.5K",
        },
      ],
    },
    {
      category: "Total Patients",
      total: "75.6K",
      cardListDetails: [
        {
          label: "New Patients",
          value: "61",
        },
        {
          label: "Old Patients",
          value: "75.5K",
        },
      ],
    },
    {
      category: "Overall Rooms",
      total: 195,
      status: "14 Rooms available",
      cardListDetails: [
        {
          label: "General Rooms",
          value: "136",
        },
        {
          label: "Private Rooms",
          value: "59",
        },
      ],
    },
    {
      category: "Doctors on Duty",
      total: 87,
      cardListDetails: [
        {
          label: "Available Doctors",
          value: "80",
        },
        {
          label: "On Leave",
          value: "7",
        },
      ],
    },
    {
      category: "Treatments",
      total: "99.87K",
      cardListDetails: [
        {
          label: "Operations",
          value: "20.69K",
        },
        {
          label: "General",
          value: "79.18K",
        },
      ],
    },
  ];

  return (
    <div className="p-4">
      {/* Top Totle Area */}
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg text-M-text-color">
          Welcome back, Dr. mashur Gulati 👋
        </h1>
        <div className="flex gap-4 items-center">
          <button className="py-[10px] px-4 bg-M-Green-color/90 hover:bg-M-Green-color text-sm text-white flex items-center gap-2 rounded-md">
            <TbSortAscending /> Add Appointment
          </button>
          <div className="flex  border rounded-md overflow-hidden relative">
            <input
              type="text"
              placeholder="01 jan 2025 to 31 Jan 2025"
              className="bg-white p-1 px-3 text-sm text-M-text-color font-normal font-inter outline-none ring-0 max-w-72 "
            />
            {/* <input type="date" className="absolute h-full right-0 opacity-0" /> */}
            <span className="bg-M-primary-color p-[10px] text-white h-full">
              <SlCalender />
            </span>
          </div>
        </div>
      </div>

      {/* Card Area */}
      <div className="py-3">
        <div className="grid grid-cols-5 gap-6">
          {dashboardData.map((data, index) => (
            <Cards key={index} data={data} isEven={index % 2 === 0} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-4">
        {/* Calender Area */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
            <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
              My Calendar
            </h2>
            <button className="text-base font-medium text-gray-700"><HiDotsVertical /></button>
          </div>
          <div className="p-5 text-center">
            <Calendar onChange={setValue} value={value} minDate={new Date()} />
            <button className="bg-M-primary-color text-white text-sm font-medium inline-flex items-center gap-1 px-3 py-1 rounded-md">Schedule a Meeting  <TiArrowRight  size={20} /></button>
          </div>
        </div>
        {/* Patient Chat  */}
        <div className="bg-white shadow-lg rounded-lg col-span-2">
          <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
            <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
            Patients Statistics <span className="text-M-text-color/60">(609.5k Patients)</span>
            </h2>
            <ul className="flex items-center gap-2">
              <li className="bg-M-text-color/10 hover:bg-M-text-color/20 rounded-sm text-M-text-color text-sm font-inter font-normal w-9 py-1 text-center">All</li>
              <li className="bg-M-text-color/10 hover:bg-M-text-color/20 rounded-sm text-M-text-color text-sm font-inter font-normal w-9 py-1 text-center">1M</li>
              <li className="bg-M-text-color/10 hover:bg-M-text-color/20 rounded-sm text-M-text-color text-sm font-inter font-normal w-9 py-1 text-center">6M</li>
              <li className="bg-M-text-color/10 hover:bg-M-text-color/20 rounded-sm text-M-text-color text-sm font-inter font-normal w-9 py-1 text-center">1Y</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
