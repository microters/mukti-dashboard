import React from 'react';
import drImg from "../../src/assets/dr-one.jpg"

const TopDoctorCard = () => {
    return (
        <div>
            <img src={drImg} alt="dr Image" />
            <div>
                <h3>Dr. Master Gulati</h3>
                <p>Dental Specialist</p>
            </div>
        </div>
    );
};

export default TopDoctorCard;