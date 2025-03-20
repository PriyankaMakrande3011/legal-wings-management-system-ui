import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./ClientPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import AddClient from "./AddLead";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CallingTeam = () => {
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
    setIsModalOpen(true); // Open the modal when the button is clicked
  };
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  useEffect(() => {
    axios.get("http://localhost:3031/Lead").then((res) => {
      setColumns(Object.keys(res.data[0]));
      setRecords(res.data);
    });
  }, []);

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
          <div className="card-Container">
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
              <button >Submit</button>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
              <div className="stat-card">Total <strong>46</strong></div>
              <div className="stat-card">Pending <strong>08</strong></div>
              <div className="stat-card">Cancelled <strong>02</strong></div>
              <div className="stat-card">Approved <strong>36</strong></div>
            </div>

            {/* Add Leads Button */}
            {/* <div className="button-section">
            <button className="add-leads-btn">Add New Leads</button>
          </div> */}
          </div>

          <hr />
          <div className="client-action">
            <button onClick={handleAddClient}>
              <FaPlus className="plus" />
              Add New Lead
            </button>
          </div>
          <div className="client-table">
            <table className="table">
              <thead >
                <tr>
                  {columns.map((c, i) => (
                    <th key={i}>{c}</th>
                  ))}
                  <th className="action-column" > Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((d, i) => (
                  <tr key={i}>
                    <td>{d.id}</td>
                    <td>{d.FirstName}</td>
                    <td>{d.LastName}</td>
                    <td>{d.ContactNumber}</td>
                    <td>{d.Email}</td>
                    <td>{d.Address}</td>
                    <td>{d.City}</td>
                    <td>{d.Area}</td>
                    <td>{d.Pincode}</td>
                    <td>{d.Aadhar_Number}</td>
                    <td>{d.PAN_Number}</td>
                    <td>{d.ClientType}</td>
                    <td>{d.CreatedBy}</td>
                    <td>{d.Created_date}</td>
                    <td>{d.UpdatedBy}</td>
                    <td>{d.Updated_date}</td>
                    <td className="action-column" style={{ width: "150px" }}>
                      <div>
                        <FaEye
                          className="action-icon"

                        />
                        <FaEdit
                          className="action-icon"

                        />
                        <FaTrash
                          className="action-icon"

                        />
                      </div>
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

export default CallingTeam;
