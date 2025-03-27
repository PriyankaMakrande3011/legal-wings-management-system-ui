import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
// import "./ClientPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import AddClient from "./AddLead";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BackendTeam = () => {
    const [columns, setColumns] = useState([]);
    const [records, setRecords] = useState([]);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const handleAddClient = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const requestData = {
      fromDate: fromDate.toISOString().split("T")[0],
            toDate: toDate.toISOString().split("T")[0],
      sortField: "id",
      sortOrder: "",
      searchText: null,
      pageNumber: 0,
      pageSize: 10,
    };
  
    axios
      .post("http://13.50.102.11:8080/legal-wings-management/clients/all", requestData)
      .then((res) => {
        console.log("API Response:", res.data);
  
        let data = res.data?.clientPage?.content || [];
  
        // 🔹 Select only specific fields from API response
        let filteredData = data.map(({ id, firstName, lastName, clientType, email, phoneNo,address,aadharNumber,panNumber }) => ({
          id,
          firstName,
          lastName,
          clientType,
          email,
          phoneNo,
          address,
          aadharNumber,
          panNumber,
        }));
  
        if (filteredData.length > 0) {
          setColumns(Object.keys(filteredData[0])); // Extract column names
          setRecords(filteredData); // Update records state
        } else {
          console.warn("No valid data received.");
          setColumns([]);
          setRecords([]);
        }
  
        console.log("Filtered Records:", filteredData); // Debugging
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setColumns([]);
        setRecords([]);
      });
  }, []);
  
  
  return (
    <div className="client-container">
      <Slider />
      <div className="client-page">
        <Header />
        <div className="client-content-box">
          <div className="card-Container">
            <div className="date-range-container">
              <div className="date-field">
                <label>From Date*</label>
                <DatePicker selected={fromDate} onChange={(date) => setFromDate(date)} dateFormat="dd-MM-yyyy" className="custom-input" />
              </div>
              <div className="date-field">
                <label>To Date*</label>
                <DatePicker selected={toDate} onChange={(date) => setToDate(date)} dateFormat="dd-MM-yyyy" className="custom-input" />
              </div>
            </div>
            <div className="client-filter">
              <select value={city}>
                <option value="" disabled>Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <MdKeyboardArrowDown />
              </select>
              <select value={area} onChange={() => {}} disabled={!areas.length}>
                <option value="" disabled>Select Area</option>
                {areas.map((area, index) => (
                  <option key={index} value={area}>{area}</option>
                ))}
              </select>
              <select>
                <option>Select Client Type</option>
                <option value="Owner">Owner</option>
                <option value="Tenant">Tenant</option>
                <option value="Agent">Agent</option>
              </select>
              <select>
                <option>Select Client </option>
                <option value="Owner">Select Client</option>
               
              </select>
              <input type="text" className="searchClient" placeholder="Search" />
              <button>Submit</button>
            </div>
           
          </div>
          <hr />
          {/* <div className="client-action">
            <button onClick={handleAddClient}>
              <FaPlus className="plus" />
              Add Details
            </button>
          </div> */}
          <div className="client-table">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((c, i) => (
                    <th key={i}>{c}</th>
                  ))}
                  <th className="action-column">Action</th>
                </tr>
              </thead>
              <tbody>
  {Array.isArray(records) && records.length > 0 ? (
    records.map((d, i) => (
      <tr key={i} onClick={() => navigate(`/lead/${d.id}`)} style={{ cursor: "pointer" }}>
        {columns.map((col, idx) => (
          <td key={idx}>{d[col]}</td> // Dynamically rendering values
        ))}
        <td className="action-column" style={{ width: "150px" }}>
          <div>
            <FaEye className="action-icon" />
            <FaEdit className="action-icon" />
            <FaTrash className="action-icon" />
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={columns.length + 1}>No records found</td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>
      </div>
      <AddClient isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default BackendTeam;