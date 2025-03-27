
// import React, { useEffect, useState } from "react";
// import Slider from "./Slider";
// import Header from "./Header.js";
// import "./ClientPage.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaPlus, FaEye, FaEdit, FaTrash, FaArrowCircleRight } from "react-icons/fa";
// import AddClient from "./AddClient";
// import { MdKeyboardArrowDown } from "react-icons/md";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const ClientPage = ({id}) => {
//   const [columns, setColumns] = useState([]);
//   const [records, setRecords] = useState([]);
//   const [city, setCity] = useState("");
//   const [area, setArea] = useState("");
//   const [areas, setAreas] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();
//   const [fromDate, setFromDate] = useState(new Date());
//   const [toDate, setToDate] = useState(new Date());


//   // const handleAddClient = () => {
//   //   navigate("/addclients");
//   // };
//   const handleAddClient = () => {
//     setIsModalOpen(true); 
//   };
//   const handleCloseModal = () => {
//     setIsModalOpen(false); 
//   };

//   useEffect(() => {
//     const fetchAllClients = async () => {
//       try {
//         const response = await axios.post(
//           "http://13.50.102.11:8080/legal-wings-management/clients/all",
//           {
//             fromDate: fromDate.toISOString().split("T")[0],
//             toDate: toDate.toISOString().split("T")[0],
//             sortField: "id",
//             sortOrder: "",  
//             searchText: null,
//             pageNumber: 0,
//             pageSize: 10
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("API Response:", response.data);

//         // Extract clients from correct property
//         if (response.data && response.data.clientPage && Array.isArray(response.data.clientPage.content)) {
//           setRecords(response.data.clientPage.content);
//         } else {
//           console.warn("Unexpected API response format:", response.data);
//           setRecords([]);
//         }
//       } catch (error) {
//         console.error("Error fetching all clients:", error.response?.data || error.message);
//         setRecords([]);
//       }
//     };

//     fetchAllClients();
//   }, [fromDate, toDate]);








//   // Handle city change and update areas
//   const handleCityChange = (e) => {

//     const selectedCity = e.target.value;
//     setCity(selectedCity);
//     setArea(""); // Reset area
//     setClients([]); // Reset clients

//     const cityAreas = {
//       Mumbai: ["Andheri", "Borivali", "Dadar"],
//       Pune: ["Kothrud", "Viman Nagar", "Hinjewadi"],
//     };

//     setAreas(cityAreas[selectedCity] || []);
//   };

//   // Handle area change and fetch clients


//   return (
//     <div className="client-container">
//       <Slider />
//       <div className="client-page">
//         <Header />
//         <div className="client-content-box">
//         <div className="date-range-container">
//       <div className="date-field">
//         <label>From Date*</label>
//         <DatePicker
//           selected={fromDate}
//           onChange={(date) => setFromDate(date)}
//           dateFormat="dd-MM-yyyy"
//           className="custom-input"
//         />
//       </div>
//       <div className="date-field">
//         <label>To Date*</label>
//         <DatePicker
//           selected={toDate}
//           onChange={(date) => setToDate(date)}
//           dateFormat="dd-MM-yyyy"
//           className="custom-input"
//         />
//       </div>
//     </div>
//           <div className="client-filter">

//             {/* City Dropdown */}
//             <select value={city} >
//               <option value="" disabled>
//                 Select City
//               </option>
//               <option value="Mumbai">Mumbai</option>
//               <option value="Pune">Pune</option>
//               <MdKeyboardArrowDown />
//             </select>

//             {/* Area Dropdown */}
//             <select
//               value={area}

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
//             <select>
//               <option >
//                 Select Client Type
//               </option>
//               <option value="Owner">Owner</option>
//               <option value="Tenant">Tenant</option>
//               <option value="Agent">Agent</option>
//             </select>
//             {/* Client Dropdown */}
//             <input type="text" className="searchClient" placeholder="Search" />
//             <button >Submit</button>
//           </div>

//           <hr />
//           <div className="client-action">

//             <button onClick={handleAddClient}>
//               <FaPlus className="plus" />
//              Add Client
//             </button>
//           </div>
//           <div className="table-container">
//             <table className="table">
//               <thead>
//                 <tr>
//                   {columns.map((c, i) => (
//                     <th key={i}>{c}</th>
//                   ))}
//                   <th>Action</th> 
//                 </tr>
//               </thead>
//               <tbody>
//   {records.length > 0 ? (
//     records.map((d, i) => (
//       <tr key={i}>
//         <td>{d.id || "N/A"}</td>
//         <td>{d.firstName || "N/A"}</td>
//         <td>{d.lastName || "N/A"}</td>
//         <td>{d.clientType || "N/A"}</td>
//         <td>{d.email || "N/A"}</td>
//         <td>{d.phoneNo || "N/A"}</td>
//         <td>{d.address || "N/A"}</td>
//         <td>{d.areaName || "N/A"}</td>
//         <td>{d.areaId || "N/A"}</td>
//         <td>{d.cityName || "N/A"}</td>
//         <td>{d.cityId || "N/A"}</td>
//         <td>{d.pinCode || "N/A"}</td>
//         <td>{d.aadharNumber || "N/A"}</td>
//         <td>{d.panNumber || "N/A"}</td>
//         <td>{d.createDate || "N/A"}</td>
//         <td>{d.createdByUserId || "N/A"}</td>
//         <td>{d.createdByUserName || "N/A"}</td>
//         <td>{d.updatedDate || "N/A"}</td>
//         <td>{d.updatedByUserId || "N/A"}</td>
//         <td>{d.updatedByUserName || "N/A"}</td>
//         <td>
//           <FaEye className="action-icon" />
//           <FaEdit className="action-icon" />
//           <FaTrash className="action-icon" />
//           <FaArrowCircleRight className="action-icon" />
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="20">No clients found</td>
//     </tr>
//   )}
// </tbody>

//             </table>
//           </div>
//         </div>
//       </div>
//       <AddClient
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         // onSubmit={handleClientSubmit}
//       />
//     </div>
//   );
// };

//  export default ClientPage;
import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./ClientPage.css";
import ReactPaginate from "react-paginate";
import { FaPlus, FaEye, FaEdit, FaTrash, FaArrowCircleRight } from "react-icons/fa";
import AddClient from "./AddClient";
import { fetchDropdownData, fetchAllClients } from "./apiService"; // Import API service functions

const ClientPage = () => {
  const [columns, setColumns] = useState([]); 
  const [records, setRecords] = useState([]); // Use records for pagination
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [clientTypes, setClientTypes] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedClientType, setSelectedClientType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const recordsPerPage = 10; // Show 10 records per page

  // Fetch dropdown data
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setDropdownLoading(true);
        const data = await fetchDropdownData();
        console.log("Dropdown API Response:", data);

        if (!data || Object.keys(data).length === 0) {
          console.error("API returned empty or undefined response.");
          return;
        }

        setCities(data.cities || []);
        setAreas(data.areas || []);
        setClientTypes(data.clients || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setDropdownLoading(false);
      }
    };

    loadDropdownData();
  }, []);

  // Fetch client data & dynamically generate columns
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const clients = await fetchAllClients();
        console.log("Clients Data:", clients);

        if (clients.length > 0) {
          setRecords(clients); // Update records for pagination
          setColumns(Object.keys(clients[0]).filter((key) => key !== "id"));
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Pagination logic
  const startIndex = currentPage * recordsPerPage;
  const selectedRecords = records.slice(startIndex, startIndex + recordsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="client-container">
      <Slider />
      <div className="client-page">
        <Header />
        <div className="client-content-box">
          {/* Filters */}
          <div className="client-filter">
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
              <option value="">Select City</option>
              {dropdownLoading ? (
                <option disabled>Loading cities...</option>
              ) : cities.length > 0 ? (
                cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))
              ) : (
                <option disabled>No cities available</option>
              )}
            </select>

            <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
              <option value="">Select Area</option>
              {dropdownLoading ? (
                <option disabled>Loading areas...</option>
              ) : areas.length > 0 ? (
                areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))
              ) : (
                <option disabled>No areas available</option>
              )}
            </select>

            <select value={selectedClientType} onChange={(e) => setSelectedClientType(e.target.value)}>
              <option value="">Select Client Type</option>
              {dropdownLoading ? (
                <option disabled>Loading client types...</option>
              ) : clientTypes.length > 0 ? (
                clientTypes.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))
              ) : (
                <option disabled>No client types available</option>
              )}
            </select>

            <input type="text" className="searchClient" placeholder="Search" />
            <button>Submit</button>
          </div>

          <hr />

          {/* Add Client Button */}
          <div className="client-action">
            <button onClick={() => setIsModalOpen(true)}>
              <FaPlus className="plus" /> Add Client
            </button>
          </div>

          {/* Client Table */}
          <div className="table-container">
            {loading ? (
              <p>Loading...</p>
            ) : selectedRecords.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    {columns.map((col, i) => (
                      <th key={i}>{col.replace(/([A-Z])/g, " $1").trim()}</th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRecords.map((client) => (
                    <tr key={client.id || client.email}>
                      <td>{client.id || "N/A"}</td>
                      {columns.map((col, i) => (
                        <td key={i}>{client[col] || "N/A"}</td>
                      ))}
                      <td>
                        <FaEye className="action-icon" />
                        <FaEdit className="action-icon" />
                        <FaTrash className="action-icon" />
                        <FaArrowCircleRight className="action-icon" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No clients found</p>
            )}

            {/* Pagination */}
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(records.length / recordsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClient isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ClientPage;
