

// import React, { useEffect, useState } from "react";
// import Slider from "./Slider";
// import Header from "./Header.js";
// import "./ClientPage.css";
// import axios from "axios";
// import { Button } from "primereact/button";
// import { Card } from "primereact/card";
// import { Dialog } from "primereact/dialog";
// import { FaPlus } from "react-icons/fa";
// import AddDetails from "./AddDetails";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import AddLeadPage from "./AddLeadPage.js";

// const Execative = () => {
//   const [leads, setLeads] = useState([
//     // Initial dummy lead for testing, remove to test empty state
//     {
//       id: 1,
//       FirstName: "Rahul",
//       LastName: "Sharma",
//       ContactNumber: "+91 9876543210",
//       Email: "rahul.sharma@example.com",
//       City: "Delhi",
//       Area: "MG Road",
//       ClientType: "Owner",
//       Remarks: "Interested in renting a 2BHK apartment",
//       CreatedBy: "Admin",
//       Created_date: "2025-03-06",
//       UpdatedBy: "Admin",
//       Updated_date: "2025-03-06",
//       LeadStatus: "In Progress",
//       TotalAmount: "₹50,000",
//       Aadhar_Number: "AAB123456",
//       PAN_Number: "ABCDE1234F",
//       TotalPayment: "₹50,000",
//       OwnerPayment: "₹45,000",
//       TenantPayment: "₹5,000",
//       PaymentMode: "UPI"
//     }
//   ]);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("common");

//   const handleAcceptLead = (lead) => {
//     setSelectedLead(lead);
//   };

//   const handleCancelLead = (leadId) => {
//     setLeads(leads.filter((lead) => lead.id !== leadId));
//   };

//   return (
//     <div className="client-container">
//       <Slider />
//       <div className="client-page">
//         <Header />
//         <div className="client-content-box">
//           {!selectedLead ? (
//             <div className="table-container">
//               {leads.length === 0 ? (
//                 <div className="no-leads">
//                   <img
//                     src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
//                     alt="No Leads"
//                     className="no-leads-img"
//                   />
//                   <h3>No leads assigned yet!</h3>
//                   <p>Please wait for admin to assign you a lead.</p>
//                 </div>
//               ) : (
//                 <DataTable
//                   value={leads}
//                   responsiveLayout="scroll"
//                   className="custom-table"
//                 >
//                   <Column field="FirstName" header="First Name" />
//                   <Column field="LastName" header="Last Name" />
//                   <Column field="ContactNumber" header="Contact" />
//                   <Column field="Email" header="Email" />
//                   <Column field="LeadStatus" header="Status" />
//                   <Column
//                     header="Actions"
//                     body={(rowData) => (
//                       <>
//                         <Button
//                           label="Accept"
//                           onClick={() => handleAcceptLead(rowData)}
//                           className="p-button-success"
//                         />
//                         <Button
//                           label="Cancel"
//                           onClick={() => handleCancelLead(rowData.id)}
//                           className="p-button-danger"
//                           style={{ marginLeft: "10px" }}
//                         />
//                       </>
//                     )}
//                   />
//                 </DataTable>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="client-action">
//                 <Button
//                   icon={<FaPlus />}
//                   label="Add Client"
//                   onClick={() => setIsModalOpen(true)}
//                 />
//               </div>
//               <div className="tab-buttons">
//                 <Button
//                   label="Common Details"
//                   onClick={() => setActiveTab("common")}
//                   className={activeTab === "common" ? "active-tab" : ""}
//                 />
//                 <Button
//                   label="Owner Details"
//                   onClick={() => setActiveTab("owner")}
//                   className={activeTab === "owner" ? "active-tab" : ""}
//                 />
//                 <Button
//                   label="Tenant Details"
//                   onClick={() => setActiveTab("tenant")}
//                   className={activeTab === "tenant" ? "active-tab" : ""}
//                 />
//                 <Button
//                   label="Payment Details"
//                   onClick={() => setActiveTab("payment")}
//                   className={activeTab === "payment" ? "active-tab" : ""}
//                 />
//               </div>
//               <div className="client-card-container">
//                 <Card key={selectedLead.id} className="client-card">
//                   <h3>
//                     {selectedLead.FirstName} {selectedLead.LastName}
//                   </h3>
//                   <div className="details-box">
//                     {activeTab === "common" && (
//                       <>
//                         <div className="detail-item">
//                           <strong>Client Type:</strong> {selectedLead.ClientType}
//                         </div>
//                         <div className="detail-item">
//                           <strong>Remarks:</strong> {selectedLead.Remarks}
//                         </div>
//                         <div className="detail-item">
//                           <strong>Lead Status:</strong> {selectedLead.LeadStatus}
//                         </div>
//                         <div className="detail-item">
//                           <strong>Total Amount:</strong> {selectedLead.TotalAmount}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                   <div className="lead-actions">
//                     <Button label="Complete" className="p-button-success" />
//                     <Button
//                       label="Pending"
//                       className="p-button-warning"
//                       style={{ marginLeft: "10px", padding: "10px" }}
//                     />
//                     <Button
//                       label="Postpone"
//                       className="p-button-secondary"
//                       style={{ marginLeft: "10px", padding: "10px" }}
//                     />
//                   </div>
//                 </Card>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Execative;


import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./Calling.css";
import { useNavigate } from "react-router-dom";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FaPlus, FaEye, FaEdit, FaTrash, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdCancel } from "react-icons/md";
import Api from "./Api.js";
import AssignLead from "./AssingLead.js";
import "./ClientPage.css"

const Execative = () => {
  const [records, setRecords] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [clientTypes, setClientTypes] = useState(["OWNER", "TENANT", "AGENT"]);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [searchText, setSearchText] = useState("");
  const [clientType, setClientType] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const handleAddNewLead = () => {
    navigate("/add-lead");
  };

  const fetchDropdowns = async (selectedCityId, selectedAreaId) => {
    const requestBody = {
      cityIdsUi: selectedCityId ? [parseInt(selectedCityId)] : [],
      stateIdsUi: [],
      zoneIdsUi: [],
      areaIdsUi: selectedAreaId ? [parseInt(selectedAreaId)] : []
    };

    try {
      const response = await fetch(`${Api.BASE_URL}geographic-nexus/allDropDowns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setCities(data?.cities || []);
      setAreas(data?.areas || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    setCity(selectedCityId);
    fetchDropdowns(selectedCityId, area);
  };

  const handleAreaChange = (e) => {
    const selectedAreaId = e.target.value;
    setArea(selectedAreaId);
    fetchDropdowns(city, selectedAreaId);
  };

  const handleClearCity = () => {
    setCity("");
    fetchDropdowns("", area);
  };

  const handleClearArea = () => {
    setArea("");
    fetchDropdowns(city, "");
  };

  const handleClearClientType = () => {
    setClientType("");
  };

  const handleSubmit = () => {
    fetchLeads();
  };

  const fetchLeads = async () => {
    const requestBody = {
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
      clientType: clientType ? clientType.toUpperCase() : undefined,
      cityIdsUi: city ? [parseInt(city)] : [],
      areaIdsUi: area ? [parseInt(area)] : [],
      pageNumber: 0,
      pageSize: 1000,
      sortField: "id",
      sortOrder: "desc",
      transitLevel: "CALLING_TEAM"
    };

    try {
      const response = await fetch(`${Api.BASE_URL}leads/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      let data = (await response.json())?.leadPage?.content || [];

      if (searchText.trim()) {
        const keyword = searchText.toLowerCase();
        data = data.filter((record) => {
          const firstName = record.client?.firstName?.toLowerCase() || "";
          const lastName = record.client?.lastName?.toLowerCase() || "";
          return firstName.includes(keyword) || lastName.includes(keyword);
        });
      }

      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };


  const fetchAllLeads = async () => {
    const requestBody = {
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
      sortField: "id",
      sortOrder: "",
      searchText: null,
      pageNumber: 0,
      pageSize: 10
    };

    try {
      const response = await fetch(`${Api.BASE_URL}leads/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      let data = (await response.json())?.leadPage?.content || [];

      if (searchText.trim()) {
        const keyword = searchText.toLowerCase();
        data = data.filter((record) => {
          const firstName = record.client?.firstName?.toLowerCase() || "";
          const lastName = record.client?.lastName?.toLowerCase() || "";
          return firstName.includes(keyword) || lastName.includes(keyword);
        });
      }

      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };

  useEffect(() => {
    fetchAllLeads();
  }, []);  // Trigger fetchLeads when component is mounted


  const handleViewClick = (leadId) => {
    navigate(`/add-lead?mode=view&id=${leadId}&mode=view`);
  };

  const handleEditClick = (leadId) => {
    navigate(`/add-lead?mode=edit&id=${leadId}`);
  };

  const handleAssign = (lead) => {

    setModalOpen(false);
    setSelectedLeadId(lead);
  };



  return (
    <div className="client-container">
      <Slider />
      <div className="client-page">
        <Header />
        <div className="client-content-box">
          <div className="card-Container">
            <div className="filter-bar">
              <div className="date-range">
                <div className="date-field">
                  <label>From Date*</label>
                  <div className="input-wrapper">
                    <DatePicker
                      selected={fromDate}
                      onChange={(date) => setFromDate(date)}
                      dateFormat="dd-MM-yyyy"
                      className="custom-input"
                    />
                    <FaRegCalendarAlt className="calendar-icon" />
                  </div>
                </div>
                <div className="date-field">
                  <label>To Date*</label>
                  <div className="input-wrapper">
                    <DatePicker
                      selected={toDate}
                      onChange={(date) => setToDate(date)}
                      dateFormat="dd-MM-yyyy"
                      className="custom-input"
                    />
                    <FaRegCalendarAlt className="calendar-icon" />
                  </div>
                </div>
              </div>


              <div className="filters">
                {/* City Dropdown */}
                <div className="select-wrapper">
                  <select value={city} onChange={handleCityChange}>
                    <option value="">Select City</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {city && <span className="clear-icon" onClick={handleClearCity}><FaTimes /></span>}
                </div>

                {/* Area Dropdown */}
                <div className="select-wrapper">
                  <select value={area} onChange={handleAreaChange}>
                    <option value="">Select Area</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  {area && <span className="clear-icon" onClick={handleClearArea}><FaTimes /></span>}
                </div>

                {/* Client Type Dropdown */}
                <div className="select-wrapper">
                  <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
                    <option value="">Select Client Type</option>
                    {clientTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  {clientType && <span className="clear-icon" onClick={handleClearClientType}><FaTimes /></span>}
                </div>

                <input
                  type="text"
                  className="searchClient"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>


            <hr />
            <div className="client-action">
              <button onClick={handleAddNewLead}>
                <FaPlus className="plus" />
                Add New Lead
              </button>
            </div>

            <div className="client-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Phone No</th>
                    <th>Client Type</th>
                    <th>Address</th>
                    <th>Created Date</th>
                    <th>Created By</th>
                    <th>Updated By</th>
                    <th>Tentative Date</th>
                    <th>Status</th>
                    <th className="action-column">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => {
                    const client = record.client || {};
                    return (
                      <tr key={index}>
                        <td>{client.firstName || "-"}</td>
                        <td>{client.lastName || "-"}</td>
                        <td>{client.phoneNo || "-"}</td>
                        <td>{client.clientType || "-"}</td>
                        <td>{client.address || "-"}</td>
                        <td>{new Date(record.createdDate).toLocaleDateString() || "-"}</td>
                        <td>{client.createdByUserName || "-"}</td>
                        <td>{client.updatedByUserName || "-"}</td>
                        <td>{record.tentativeAgreementDate || "-"}</td>
                        <td>{record.status || "-"}</td>
                        <td className="action-column" >
                          <div>
                            <FaEye className="action-icon icon-view" onClick={() => handleViewClick(record.id)} />

                            <BsBoxArrowInRight
                              className="action-icon icon-edit"
                              onClick={() => {
                                setModalOpen(true)
                                setSelectedLeadId(record.id)
                              }
                              }
                            />
                            <MdCancel className="action-icon icon-cancel" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Execative;
