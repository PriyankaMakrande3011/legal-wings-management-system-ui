

import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./Calling.css";
import { useNavigate, useParams } from "react-router-dom";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FaPlus, FaEye, FaEdit, FaTrash, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdCancel } from "react-icons/md";
import Api from "./Api.js";
import AssignLead from "./AssingLead.js";
import axios from "axios";
import Swal from "sweetalert2";
import { useKeycloak } from "@react-keycloak/web";
import "./ClientPage.css"

const Executive = () => {
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const recordsPerPage = 10;
  const { keycloak } = useKeycloak();
  const handleAddNewLead = () => {
    navigate("/add-lead", {
      state: {
        transitLevel: "EXECUTIVE_TEAM"
      }
    });
  };
  // const handleCancel = async (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "This action will cancel the lead!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, cancel it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {

  //         await axios.put(`https://legalwingcrm.in:8081/legal-wings-management/leads/${id}/cancel`);
  //         Swal.fire("Cancelled!", "Lead has been cancelled.", "success");

  //         fetchLeads(); 
  //       } catch (error) {
  //         console.error("Error canceling lead:", error.response?.data || error.message);
  //         Swal.fire("Error!", "Failed to cancel the lead. Please try again.", "error");
  //       }
  //     }
  //   });
  // };
  const handleCancel = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will cancel the lead!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `https://legalwingcrm.in:8081/legal-wings-management/leads/${id}/cancel`,
            {}, // empty body
            {
              headers: {
                Authorization: `Bearer ${keycloak.token}`,
              },
            }
          );

          Swal.fire("Cancelled!", "Lead has been cancelled.", "success");

          fetchLeads();
        } catch (error) {
          console.error("Error canceling lead:", error.response?.data || error.message);
          Swal.fire("Error!", "Failed to cancel the lead. Please try again.", "error");
        }
      }
    });
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
        headers: { "Content-Type": "application/json" ,
          "Authorization": `Bearer ${keycloak.token}` 
        },
        body: JSON.stringify(requestBody),
        "Authorization": `Bearer ${keycloak.token}`
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
      transitLevel: "EXECUTIVE_TEAM"
    };

    try {
      const response = await fetch(`${Api.BASE_URL}leads/byAssignedUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keycloak.token}`
        },
        body: JSON.stringify(requestBody),
        "Authorization": `Bearer ${keycloak.token}`
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
      const response = await fetch(`${Api.BASE_URL}leads/byAssignedUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${keycloak.token}`
         },
        body: JSON.stringify(requestBody),
        "Authorization": `Bearer ${keycloak.token}`
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
    navigate(`/edit?mode=edit&id=${leadId}`);
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
              {loading ? (
                <div className="loading-spinner">
                  <img src="https://la-solargroup.com/wp-content/uploads/2019/02/loading-icon.gif" alt="Loading..." />
                </div>
              ) : (
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
                                  handleEditClick(record.id)
                                }
                                }
                              />
                              <MdCancel className="action-icon icon-cancel"
                                onClick={() => handleCancel(record.id)} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Executive;
