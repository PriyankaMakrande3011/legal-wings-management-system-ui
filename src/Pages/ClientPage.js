
import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./ClientPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash, FaArrowCircleRight } from "react-icons/fa";
import AddClient from "./AddClient";
import { MdKeyboardArrowDown } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ClientPage = ({id}) => {
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


  // const handleAddClient = () => {
  //   navigate("/addclients");
  // };
  const handleAddClient = () => {
    setIsModalOpen(true); 
  };
  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };
 
  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const response = await axios.post(
          "http://13.50.102.11:8080/legal-wings-management/clients/all",
          {
            fromDate: fromDate.toISOString().split("T")[0],
            toDate: toDate.toISOString().split("T")[0],
            sortField: "id",
            sortOrder: "",  
            searchText: null,
            pageNumber: 0,
            pageSize: 10
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log("All Clients:", response.data);
  
        // Ensure response contains expected data
        if (response.data && Array.isArray(response.data.clients)) {
          setRecords(response.data.clients);
        } else {
          console.warn("Unexpected API response format:", response.data);
          setRecords([]); // Reset records if response is not as expected
        }
      } catch (error) {
        console.error("Error fetching all clients:", error.response?.data || error.message);
        setRecords([]); // Ensure UI does not get stuck on a previous state
      }
    };
  
    fetchAllClients();
  }, [fromDate, toDate]);
  
  

 
  
 
  
  
  
  // Handle city change and update areas
  const handleCityChange = (e) => {
    
    const selectedCity = e.target.value;
    setCity(selectedCity);
    setArea(""); // Reset area
    setClients([]); // Reset clients

    const cityAreas = {
      Mumbai: ["Andheri", "Borivali", "Dadar"],
      Pune: ["Kothrud", "Viman Nagar", "Hinjewadi"],
    };

    setAreas(cityAreas[selectedCity] || []);
  };

  // Handle area change and fetch clients
 

  return (
    <div className="client-container">
      <Slider />
      <div className="client-page">
        <Header />
        <div className="client-content-box">
        <div className="date-range-container">
      <div className="date-field">
        <label>From Date*</label>
        <DatePicker
          selected={fromDate}
          onChange={(date) => setFromDate(date)}
          dateFormat="dd-MM-yyyy"
          className="custom-input"
        />
      </div>
      <div className="date-field">
        <label>To Date*</label>
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          dateFormat="dd-MM-yyyy"
          className="custom-input"
        />
      </div>
    </div>
          <div className="client-filter">
            
            {/* City Dropdown */}
            <select value={city} >
              <option value="" disabled>
                Select City
              </option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <MdKeyboardArrowDown />
            </select>

            {/* Area Dropdown */}
            <select
              value={area}
             
              disabled={!areas.length}
            >
              <option value="" disabled>
                Select Area
              </option>
              {areas.map((area, index) => (
                <option key={index} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <select>
              <option >
                Select Client Type
              </option>
              <option value="Owner">Owner</option>
              <option value="Tenant">Tenant</option>
              <option value="Agent">Agent</option>
            </select>
            {/* Client Dropdown */}
            <input type="text" className="searchClient" placeholder="Search" />
            <button >Submit</button>
          </div>

          <hr />
          <div className="client-action">
            
            <button onClick={handleAddClient}>
              <FaPlus className="plus" />
             Add Client
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((c, i) => (
                    <th key={i}>{c}</th>
                  ))}
                  <th>Action</th> 
                </tr>
              </thead>
              <tbody>
  {records.length > 0 ? (
    records.map((d, i) => (
      <tr key={i}>
        <td>{d.id || "N/A"}</td>
        <td>{d.firstName || "N/A"}</td>
        <td>{d.lastName || "N/A"}</td>
        <td>{d.clientType || "N/A"}</td>
        <td>{d.email || "N/A"}</td>
        <td>{d.phoneNo || "N/A"}</td>
        <td>{d.address || "N/A"}</td>
        <td>{d.areaName || "N/A"}</td>
        <td>{d.areaId || "N/A"}</td>
        <td>{d.cityName || "N/A"}</td>
        <td>{d.cityId || "N/A"}</td>
        <td>{d.pinCode || "N/A"}</td>
        <td>{d.aadharNumber || "N/A"}</td>
        <td>{d.panNumber || "N/A"}</td>
        <td>{d.createDate || "N/A"}</td>
        <td>{d.createdByUserId || "N/A"}</td>
        <td>{d.createdByUserName || "N/A"}</td>
        <td>{d.updatedDate || "N/A"}</td>
        <td>{d.updatedByUserId || "N/A"}</td>
        <td>{d.updatedByUserName || "N/A"}</td>
        <td>
          <FaEye className="action-icon" />
          <FaEdit className="action-icon" />
          <FaTrash className="action-icon" />
          <FaArrowCircleRight className="action-icon" />
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="20">No clients found</td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>
      </div>
      <AddClient
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // onSubmit={handleClientSubmit}
      />
    </div>
  );
};

 export default ClientPage;