
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

const Execative = () => {
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
    axios.get("http://localhost:3001/clients").then((res) => {
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
                    <td>{d.FirstName}</td>
                    <td>{d.LastName}</td>
                    <td>{d.ContactNumber}</td>
                    <td>{d.Email}</td>
                    <td>{d.Address}</td>
                    <td>{d.City}</td>
                    <td>{d.Area}</td>
                    <td>{d.Aadhar_Number}</td>
                    <td>{d.PAN_Number}</td>
                    <td>{d.ClientType}</td>
                    <td>{d.CreatedBy}</td>
                    <td>{d.Created_date}</td>
                    <td>{d.UpdatedBy}</td>
                    <td>{d.Updated_date}</td>
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

export default Execative;
