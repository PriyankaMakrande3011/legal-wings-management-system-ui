
import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./ClientPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
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


  const fetchClients = async () => {
    try {
      const response = await axios.post(
        "http://13.50.102.11:8080/legal-wings-management/clients/getClients",
        {
          fromDate: fromDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
          toDate: toDate.toISOString().split("T")[0],
          clientType: "",
          areaId: area ? areas.indexOf(area) + 1 : null,
          cityId: city ? (city === "Mumbai" ? 2 : 1) : null,
          searchText: "",
          pageNumber: 0,
          pageSize: 10,
          sortField: "id",
          sortOrder: "asc",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.clientPage) {
        setColumns(response.data.clientPage.content.length > 0 ? Object.keys(response.data.clientPage.content[0]) : []);
        setRecords(response.data.clientPage.content);
      } else {
        setColumns([]);
        setRecords([]);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const handleSubmit = () => {
    fetchClients();
  };
  
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
  const handleAreaChange = (e) => {
    const selectedArea = e.target.value;
    setArea(selectedArea);

    // Fetch clients for the selected area
    axios
      .get(`http://localhost:3001/clients?area=${selectedArea}`)
      .then((res) => {
        setClients(res.data.map((client) => client.firstName)); // Assuming clients have `firstName`
      })
      .catch((err) => {
        console.error("Error fetching clients:", err);
      });
  };

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
            <select value={city} onChange={handleCityChange}>
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
              onChange={handleAreaChange}
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
            <button onClick={handleSubmit}>Submit</button>
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
                {records.map((d, i) => (
                  <tr key={i}>
                    <td>{d.id}</td>
                    <td>{d.firstName}</td>
                    <td>{d.lastName}</td>
                    <td>{d.clientType}</td>
                    <td>{d.email}</td>
                    <td>{d.phoneNo}</td>
                    <td>{d.address}</td>
                    <td>{d.areaName}</td>
                    <td>{d.areaId}</td>
                    <td>{d.cityName}</td>
                    <td>{d.cityId}</td>
                    <td>{d.pinCode}</td>
                    <td>{d.aadharNumber}</td>
                    <td>{d.panNumber}</td>
                    <td>{d.createDate}</td>
                    <td>{d.createdByUserId}</td>
                    <td>{d.createdByUserName}</td>
                    <td>{d.updatedDate}</td>
                    <td>{d.updatedByUserId}</td>
                    <td>{d.updatedByUserName}</td>
                    <td>
                      <FaEye
                        className="action-icon"
                       
                      />
                      <FaEdit
                        className="action-icon"
                        
                      />
                      <FaTrash
                        className="action-icon"
                       
                      />
                    </td>
                  </tr>
                ))}
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
