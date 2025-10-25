import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./Calling.css";
import { useNavigate } from "react-router-dom";
import { BsBoxArrowInRight } from "react-icons/bs";
import { FaPlus, FaEye, FaEdit, FaTrash, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Api from "./Api.js";
import AssignLead from "./AssingLead.js";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import "./ClientPage.css"
import Select from "react-select";
import { useKeycloak } from "@react-keycloak/web";


const CallingTeam = () => {
  const [records, setRecords] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedClientType, setSelectedClientType] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 20;
  const { keycloak } = useKeycloak();




  const handleAddNewLead = () => {
    navigate("/add-lead", {
      state: {
        transitLevel: "CALLING_TEAM" // or any enum value
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
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${keycloak.token}` },
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
    fetchLeads();
  };

  const fetchAllLeads = async () => {
    const requestBody = {
      fromDate: fromDate.toISOString().split("T")[0],
      toDate: toDate.toISOString().split("T")[0],
      sortField: "id",
      sortOrder: "",
      searchText: null,
      pageNumber: 0,
      pageSize: 20,
      transitLevel: "CALLING_TEAM"
    };

    try {
      const response = await fetch(`${Api.BASE_URL}leads/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keycloak.token}`
        },
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

      // setRecords(data);
      setRecords(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };

  useEffect(() => {
    fetchAllLeads();
  }, []);  // Trigger fetchLeads when component is mounted
  const handleDelete = async (id) => {
    const { value: reason } = await Swal.fire({
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

    if (reason) {
      try {
        await axios.put( // Changed from axios.delete to axios.put
          `${Api.BASE_URL}leads/cancel`,
          { id: id, cancellationReason: reason }, // Sending data in the body
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire("Cancelled!", "The lead has been cancelled.", "success");
        fetchAllLeads(); // Refresh list
      } catch (error) {
        console.error(
          "Error canceling lead:",
          error.response?.data || error.message
        );
        Swal.fire("Error!", "Failed to cancel the lead. Please try again.", "error");
      }
    }
  };

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

  

  const fetchLeads = async (page = 0) => {
    setLoading(true);
    try {
      await keycloak.updateToken(30); // optional, ensures token validity

      const response = await axios.post(
        `${Api.BASE_URL}leads/all`,
        {
          clientType: clientType || null,
          searchText: searchText || null,
          cityId: city || null,
          areaId: area || null,
          fromDate,
          toDate,
          pageNumber: page,
          pageSize: recordsPerPage,
          sortField: "id",
          sortOrder: "desc",
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // handle the response
      console.log(response.data);
          const data = response.data?.leadPage?.content || [];
    setRecords(data); 
    setTotalPages(response.data?.leadPage?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };


  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
    fetchLeads(selectedPage);
  };

  useEffect(() => {
    fetchDropdowns();
    fetchLeads(0);
  }, []);

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
              ) : noData ? (
                <p>No records found.</p>
              ) : (
                <>
                  <table className="table">
                    <thead> <tr> <th className="sticky-col">Name</th> <th>Created Date</th> <th>Phone No.</th> <th>Visit Address</th> <th>Last Follow Up Date</th> <th>Next Follow Up Date</th> <th>Tentative Agreement Date</th> <th>Client Type</th> <th>Status</th> <th>Created By</th> <th>Updated By</th> <th className="action-column">Action</th> </tr> </thead>
                    <tbody>
                      {records.map((record, index) => {
                        const client = record.client || {};
                        const name = `${client.firstName || ''} ${client.lastName || ''}`.trim() || '-';
                        return (
                          <tr key={index}>
                            <td className="sticky-col">{name}</td>
                            <td>{record.createdDate ? new Date(record.createdDate).toLocaleDateString() : "-"}</td>
                            <td>{client.phoneNo || "-"}</td>
                            <td>{record.visitAddress || "-"}</td>
                            <td>{record.lastFollowUpDate ? new Date(record.lastFollowUpDate).toLocaleDateString() : "-"}</td>
                            <td>{record.nextFollowUpDate ? new Date(record.nextFollowUpDate).toLocaleDateString() : "-"}</td>
                            <td>{record.tentativeAgreementDate ? new Date(record.tentativeAgreementDate).toLocaleDateString() : "-"}</td>
                            <td>{client.clientType || "-"}</td>
                            <td>{record.status || "-"}</td>
                            <td>{record.createdByUserName || "-"}</td>
                            <td>{record.updatedByUserName || "-"}</td>
                            <td className="action-column" >
                              <div>
                                <FaEye className="action-icon icon-view" onClick={() => handleViewClick(record.id)} />
                                <FaEdit className="action-icon icon-edit" onClick={() => handleEditClick(record.id)} title="Edit" />
                                <FaTrash className="action-icon icon-cancel" onClick={() => handleDelete(record.id)} />
                                <BsBoxArrowInRight
                                  className="action-icon edit icon-assign"
                                  onClick={() => {
                                    setModalOpen(true)
                                    setSelectedLeadId(record.id)
                                  }
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        )

                      })}
                    </tbody>
                  </table>

                  <ReactPaginate
                    previousLabel={"Prev"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    forcePage={currentPage}
                  />
                </>
              )}
              <AssignLead
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onAssign={handleAssign}
                leadId={selectedLeadId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallingTeam;
