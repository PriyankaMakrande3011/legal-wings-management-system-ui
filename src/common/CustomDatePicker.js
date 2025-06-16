import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.css";

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="custom-date-input-wrapper" onClick={onClick} ref={ref}>
    <input
      type="text"
      className="custom-date-input"
      placeholder={placeholder}
      value={value}
      readOnly
    />
    <FaCalendarAlt className="calendar-icon" />
  </div>
));

const CustomDatePicker = ({
  label = "",
  value,
  onChange,
  placeholder = "Select a date",
  dateFormat = "yyyy-MM-dd",
  minDate,
  maxDate,
}) => {
  const handleChange = (date) => {
    onChange(date ? format(date, dateFormat) : "");
  };

  return (
    <div className="datepicker-wrapper">
      {label && <label className="datepicker-label">{label}</label>}
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={handleChange}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        customInput={<CustomInput placeholder={placeholder} />}
      />
    </div>
  );
};

export default CustomDatePicker;
