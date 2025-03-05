// import React from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import { FaCalendarAlt, FaSearch } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Filter = ({
//   city,
//   setCity,
//   area,
//   setArea,
//   areas,
//   clientType,
//   setClientType,
//   searchText,
//   setSearchText,
//   fromDate,
//   setFromDate,
//   toDate,
//   setToDate,
//   handleSubmit,
// }) => {
//   return (
//     <div className="container mt-3">
//       <div className="row">
//         {/* From Date */}
//         <div className="col-md-3 mb-3">
//           <label className="form-label">
//             From Date <span className="text-danger">*</span>
//           </label>
//           <div className="input-group">
//             <DatePicker
//               selected={fromDate}
//               onChange={(date) => setFromDate(date)}
//               dateFormat="dd-MM-yyyy"
//               className="form-control"
//             />
//             <span className="input-group-text">
//               <FaCalendarAlt />
//             </span>
//           </div>
//         </div>

//         {/* To Date */}
//         <div className="col-md-3 mb-3">
//           <label className="form-label">
//             To Date <span className="text-danger">*</span>
//           </label>
//           <div className="input-group">
//             <DatePicker
//               selected={toDate}
//               onChange={(date) => setToDate(date)}
//               dateFormat="dd-MM-yyyy"
//               className="form-control"
//             />
//             <span className="input-group-text">
//               <FaCalendarAlt />
//             </span>
//           </div>
//         </div>

//         {/* City Dropdown */}
//         <div className="col-md-3 mb-3">
//           <label className="form-label">City</label>
//           <div className="input-group">
//             <select
//               className="form-select"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//             >
//               <option value="" disabled>
//                 Select City
//               </option>
//               <option value="Mumbai">Mumbai</option>
//               <option value="Pune">Pune</option>
//             </select>
//             <span className="input-group-text">
//               <MdKeyboardArrowDown />
//             </span>
//           </div>
//         </div>

//         {/* Area Dropdown */}
//         <div className="col-md-3 mb-3">
//           <label className="form-label">Area</label>
//           <div className="input-group">
//             <select
//               className="form-select"
//               value={area}
//               onChange={(e) => setArea(e.target.value)}
//               disabled={!areas.length}
//             >
//               <option value="" disabled>
//                 Select Area
//               </option>
//               {areas.map((area, index) => (
//                 <option key={index} value={area}>
//                   {area}
//                 </option>
//               ))}
//             </select>
//             <span className="input-group-text">
//               <MdKeyboardArrowDown />
//             </span>
//           </div>
//         </div>

//         {/* Client Type Dropdown */}
//         <div className="col-md-3 mb-3">
//           <label className="form-label">Client Type</label>
//           <div className="input-group">
//             <select
//               className="form-select"
//               value={clientType}
//               onChange={(e) => setClientType(e.target.value)}
//             >
//               <option value="">Select Client Type</option>
//               <option value="Owner">Owner</option>
//               <option value="Tenant">Tenant</option>
//               <option value="Agent">Agent</option>
//             </select>
//             <span className="input-group-text">
//               <MdKeyboardArrowDown />
//             </span>
//           </div>
//         </div>

//         {/* Search Input */}
//         <div className="col-md-3 mb-3">
//           <label className="form-label">Search</label>
//           <div className="input-group">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//             <span className="input-group-text">
//               <FaSearch />
//             </span>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="col-md-3 align-self-end">
//           <button className="btn btn-primary w-100" onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default Filter;
// import React from "react";
// import { Calendar } from "primereact/calendar";
// import { Dropdown } from "primereact/dropdown";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
// import "primereact/resources/themes/lara-light-blue/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
// import { FaSearch } from "react-icons/fa";
// import "./Filter.css";

// const Filter = ({
//   city,
//   setCity,
//   area,
//   setArea,
//   areas,
//   clientType,
//   setClientType,
//   searchText,
//   setSearchText,
//   fromDate,
//   setFromDate,
//   toDate,
//   setToDate,
//   handleSubmit,
// }) => {
//   return (
//     <div className="filter-container">
//       <div className="filter-row">
//         <div className="filter-item">
//           <label>From Date</label>
//           <span className="p-input-icon-right">
//             <Calendar value={fromDate} onChange={(e) => setFromDate(e.value)} dateFormat="dd-mm-yy" showIcon className="p-calendar p-inputtext" />
//           </span>
//         </div>
//         <div className="filter-item">
//           <label>To Date</label>
//           <span className="p-input-icon-right">
//             <Calendar value={toDate} onChange={(e) => setToDate(e.value)} dateFormat="dd-mm-yy" showIcon className="p-calendar p-inputtext" />
//           </span>
//         </div>
//         <div className="filter-item">
//           <label>City</label>
//           <Dropdown value={city} options={[{ label: "Mumbai", value: "Mumbai" }, { label: "Pune", value: "Pune" }]} onChange={(e) => setCity(e.value)} placeholder="Select City" />
//         </div>
//         <div className="filter-item">
//           <label>Area</label>
//           <Dropdown value={area} options={areas.map(a => ({ label: a, value: a }))} onChange={(e) => setArea(e.value)} placeholder="Select Area" disabled={!areas.length} />
//         </div>
//         <div className="filter-item">
//           <label>Client Type</label>
//           <Dropdown value={clientType} options={[{ label: "Owner", value: "Owner" }, { label: "Tenant", value: "Tenant" }, { label: "Agent", value: "Agent" }]} onChange={(e) => setClientType(e.value)} placeholder="Select Client Type" />
//         </div>
//       </div>
//       <div className="search-submit-row">
//         <div className="filter-item">
//           <label>Search</label>
//           <span className="p-input-icon-left">
//             <i className="pi pi-search" />
//             <InputText value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search" />
//           </span>
//         </div>
//         <div className="filter-item">
//           <Button label="Submit" icon="pi pi-check" className="p-button-primary" onClick={handleSubmit} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Filter;

