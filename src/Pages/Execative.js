

import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./Calling.css";
import "./BackendTeam.css";
import { useNavigate, useLocation } from "react-router-dom";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FaPlus, FaEye, FaEdit, FaTrash, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdCancel } from "react-icons/md";
import Api from "./Api.js";
import axios from "axios";
import Swal from "sweetalert2";
import { useKeycloak } from '../mockKeycloak'; // Mock for local dev
import "./ClientPage.css"
import Select from "react-select";
import ExecutiveData from "../Execative.json";
import AssignLeadToBackend from "./AssingLeadToBackend.js"

const Executive = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  const savedFilters = location.state?.filters;

  const [records, setRecords] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [clientTypes, setClientTypes] = useState(["OWNER", "TENANT", "AGENT"]);
  const [city, setCity] = useState(savedFilters?.city || "");
  const [area, setArea] = useState(savedFilters?.area || "");
  const [searchText, setSearchText] = useState(savedFilters?.searchText || "");
  const [clientType, setClientType] = useState(savedFilters?.clientType || "");
  const [dateFilter, setDateFilter] = useState(savedFilters?.dateFilter || "CREATED_DATE");
  const [fromDate, setFromDate] = useState(savedFilters ? new Date(savedFilters.fromDate) : new Date());
  const [toDate, setToDate] = useState(savedFilters ? new Date(savedFilters.toDate) : new Date());
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const recordsPerPage = 10;

  const handleAddNewLead = () => {
    navigate("/add-lead", {
      state: {
        transitLevel: "EXECUTIVE_TEAM",
        from: location.pathname,
        filters: {
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
          city,
          area,
          clientType,
          searchText,
          dateFilter,
        },
      },
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
    const { value: cancellationReason } = await Swal.fire({
      title: "Are you sure?",
      text: "Please enter the reason for cancellation:",
      icon: "warning",
      input: "text",
      inputPlaceholder: "Cancellation Reason",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write a reason!";
        }
      },
    });

    if (cancellationReason) {
      try {
        await axios.put(
          `${Api.BASE_URL}leads/${id}/cancel`,
          { id, cancellationReason },
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire("Cancelled!", "The lead has been cancelled.", "success");
        fetchLeads(); // Refresh list
      } catch (error) {
        console.error("Error canceling lead:", error.response?.data || error.message);
        Swal.fire("Error!", "Failed to cancel the lead. Please try again.", "error");
      }
    }
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
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keycloak.token}` 
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.warn(`API returned ${response.status}, using default values`);
        return;
      }

      const data = await response.json();
      setCities(data?.cities || []);
      setAreas(data?.areas || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error.message);
      setCities([]);
      setAreas([]);
    }
  };

  const handleCityChange = (selectedCityId) => {
    setCity(selectedCityId);
    setArea(null); // Reset area when city changes
    fetchDropdowns(selectedCityId, null);
  };

  const handleAreaChange = (selectedAreaId) => {
    setArea(selectedAreaId);
    fetchDropdowns(city, selectedAreaId);
  };

  const handleClearClientType = () => {
    setClientType("");
  };

  const handleSubmit = () => {
    // Assuming fetchLeads will use the current state
    fetchLeads();
  };

  const fetchLeads = async () => {
    const requestBody = {
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
      clientType: clientType ? clientType.toUpperCase() : undefined,
          cityId: city || null,
          areaId: area || null,
      searchText: searchText || null,
      dateFilter: dateFilter || null,
      pageNumber: 0,
      pageSize: 2000,
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
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      let data = (await response.json())?.leadPage?.content || [];

      if (data.length === 0) {
        // Load JSON data as fallback
        const jsonData = ExecutiveData.commonDetails;
        const fallbackRecord = {
          id: 1,
          client: {
            firstName: jsonData.clientName.split(' ')[0],
            lastName: jsonData.clientName.split(' ')[1] || '',
            phoneNo: jsonData.clientNumber,
            email: jsonData.clientEmail,
            address: jsonData.clientAddress,
            clientType: jsonData.clientType
          },
          lastFollowUpDate: null,
          nextFollowUpDate: null,
          appointmentTime: null,
          status: jsonData.leadStatus,
          visitAddress: jsonData.clientAddress,
          createdDate: jsonData.createdDate,
          createdByUserName: jsonData.createdBy,
          updatedByUserName: jsonData.updatedBy,
          tentativeAgreementDate: jsonData.tentativeAgreementDate,
          leadStatus: jsonData.leadStatus,
          remarks: jsonData.remarks
        };
        data = [fallbackRecord];
      }

      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      // Load JSON data on error
      const jsonData = ExecutiveData.commonDetails;
      const fallbackRecord = {
        id: 1,
        client: {
          firstName: jsonData.clientName.split(' ')[0],
          lastName: jsonData.clientName.split(' ')[1] || '',
          phoneNo: jsonData.clientNumber,
          email: jsonData.clientEmail,
          address: jsonData.clientAddress,
          clientType: jsonData.clientType
        },
        lastFollowUpDate: null,
        nextFollowUpDate: null,
        appointmentTime: null,
        status: jsonData.leadStatus,
        visitAddress: jsonData.clientAddress,
        createdDate: jsonData.createdDate,
        createdByUserName: jsonData.createdBy,
        updatedByUserName: jsonData.updatedBy,
        tentativeAgreementDate: jsonData.tentativeAgreementDate,
        leadStatus: jsonData.leadStatus,
        remarks: jsonData.remarks
      };
      setRecords([fallbackRecord]);
    }
  };


  useEffect(() => {
    fetchDropdowns(city, area);
    fetchLeads();
  }, []);  // Trigger fetchLeads when component is mounted


  const handleViewClick = (leadId) => {
    navigate(`/add-lead?mode=view&id=${leadId}`, {
      state: {
        from: location.pathname,
        filters: {
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
          city,
          area,
          clientType,
          searchText,
          dateFilter,
        },
      },
    });
  };

  const handleEditClick = (leadId) => {
    navigate(`/edit?mode=edit&id=${leadId}`, {
      state: {
        from: location.pathname,
        filters: {
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
          city,
          area,
          clientType,
          searchText,
          dateFilter,
        },
      },
    });
  };

  const handleAssign = (lead) => {

    setModalOpen(false);
    setSelectedLeadId(lead);
  };

  const renderDropdown = (label, field, value, options, onChange) => {
    const selectOptions = options.map(opt => ({ value: opt.id, label: opt.name }));
    const currentValue = selectOptions.find(opt => opt.value === value);

    return (
      <div className="select-wrapper">
        <Select
          placeholder={`Select ${label}`}
          isClearable
          isSearchable
          value={currentValue}
          options={selectOptions}
          onChange={(selected) => onChange(selected ? selected.value : null)}
          styles={{
            container: (provided) => ({
              ...provided,
              minWidth: '190px',
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 999,
            }),
            control: (provided) => ({
              ...provided,
              borderRadius: '16px',
              padding: '2px',
              fontSize: '0.85rem'
            }),
          }}
        />
      </div>
    );
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
                      placeholderText="DD-MM-YYYY"
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
                      placeholderText="DD-MM-YYYY"
                      className="custom-input"
                    />
                    <FaRegCalendarAlt className="calendar-icon" />
                  </div>
                </div>
                <div className="date-field">
                  <label>Filter On</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="custom-input"
                  >
                    <option value="">Select Filter</option>
                    <option value="CREATED_DATE">Created Date</option>
                    <option value="LAST_FOLLOWUP_DATE">Last Followup Date</option>
                    <option value="NEXT_FOLLOWUP_DATE">Next Followup Date</option>
                  </select>
                </div>
              </div>


              <div className="filters">
                {/* City Dropdown */}
                {renderDropdown("City", "city", city, cities, handleCityChange)}
                {/* Area Dropdown */}
                {renderDropdown("Area", "area", area, areas, handleAreaChange)}

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
                  <thead style={{ tableLayout: 'fixed', width: '100%' }}>
                    <tr>
                      <th className="sticky-col">Name</th>
                      <th>Phone Number</th>
                      <th>Visit Address</th>
                      <th>Client Type</th>
                      <th>Appointment Time</th>
                      <th>Agreement Status</th>
                      <th>Created By</th>
                      <th>Updated By</th>
                      <th className="action-column">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => {
                      const client = record.client || {};
                      const name = `${client.firstName || ''} ${client.lastName || ''}`.trim() || '-';
                      return (
                        <tr key={index}>
                          <td className="sticky-col">{name}</td>
                          <td>{client.phoneNo || '-'}</td>
                          <td>{record.visitAddress || "-"}</td>
                          <td>{client.clientType || "-"}</td>
                          <td>{record.appointmentTime ? new Date(record.appointmentTime).toLocaleString() : '-'}</td>
                          <td>{record.status || '-'}</td>
                          <td>{client.createdByUserName || "-"}</td>
                          <td>{client.updatedByUserName || "-"}</td>
                          <td className="action-column" >
                            <div>
                              <FaEye className="action-icon icon-view" onClick={() => handleViewClick(record.id)} />

                              <FaEdit
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

                                <BsBoxArrowInRight
                                  className="action-icon icon-assing"
                                  onClick={() => {
                                    setModalOpen(true)
                                    setSelectedLeadId(record.id)
                                  }
                                  }
                                />
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              )}
<AssignLeadToBackend
  isOpen={isModalOpen}
  leadId={selectedLeadId}
  onClose={() => setModalOpen(false)}
  onAssignSuccess={fetchLeads}
/>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Executive;
