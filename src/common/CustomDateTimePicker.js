import React, { forwardRef } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDateTimePicker.css";

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="custom-datetime-input-wrapper" onClick={onClick} ref={ref}>
    <input
      type="text"
      className="custom-datetime-input"
      placeholder={placeholder}
      value={value || ""}
      readOnly
    />
    <FaCalendarAlt className="calendar-icon" />
  </div>
));
CustomInput.displayName = "CustomInput";

const CustomDateTimePicker = ({
  label = "",
  value,
  onChange,
  placeholder = "Select date & time",
  dateFormat = "dd-MM-yyyy h:mm aa",
  timeFormat = "HH:mm",
  timeIntervals = 15,
  showTimeSelect = true,
  minDate,
  maxDate,
  readOnly = false,
}) => {
  const handleChange = (date) => {
    if (readOnly) return;
    onChange(date || null);
  };

  return (
    <div className="datetimepicker-wrapper">
      {label && <label className="datetimepicker-label">{label}</label>}
      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={handleChange}
        showTimeSelect={showTimeSelect}
        timeFormat={timeFormat}
        timeIntervals={timeIntervals}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        disabled={readOnly}
        customInput={<CustomInput placeholder={placeholder} />}
      />
    </div>
  );
};

export default CustomDateTimePicker;
