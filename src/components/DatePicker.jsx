// DatePicker.js
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { useState } from "react";

function DatePicker({ initialDate = new Date(), onChange }) {
  const [date, setDate] = useState(initialDate);

  const handleChange = (selectedDate) => {
    setDate(selectedDate[0]);
    if (onChange) {
      onChange(selectedDate[0]); // Optional callback to parent
    }
  };

  return (
    <Flatpickr
      data-enable-time
      value={date}
      onChange={handleChange}
    />
  );
}

export default DatePicker;