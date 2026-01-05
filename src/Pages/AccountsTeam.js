import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./Calling.css";
import "./BackendTeam.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaRegCalendarAlt, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Api from "./Api.js";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import "./ClientPage.css";
import Select from "react-select";
import { useKeycloak } from '../mockKeycloak'; // Mock for local dev

const AccountsTeam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { keycloak } = useKeycloak();

  const savedFilters = location.state?.filters;

  const [records, setRecords] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [city, setCity] = useState(savedFilters?.city || "");
  const [area, setArea] = useState(savedFilters?.area || "");
  const [searchText, setSearchText] = useState(savedFilters?.searchText || "");
  const [dateFilter, setDateFilter] = useState(savedFilters?.dateFilter || "CREATED_DATE");
  const [fromDate, setFromDate] = useState(savedFilters ? new Date(savedFilters.fromDate) : new Date());
  const [toDate, setToDate] = useState(savedFilters ? new Date(savedFilters.toDate) : new Date());
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(savedFilters?.currentPage || 0);
  const [totalPages, setTotalPages] = useState(1);
  const recordsPerPage = 20;

  const fetchDropdowns = async (selectedCityId, selectedAreaId) => {
    const requestBody = {
      cityIdsUi: selectedCityId ? [parseInt(selectedCityId)] : [],
      stateIdsUi: [],
      zoneIdsUi: [],
      areaIdsUi: selectedAreaId ? [parseInt(selectedAreaId)] : [],
    };

    try {
      const response = await fetch(`${Api.BASE_URL}geographic-nexus/allDropDowns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setCities(data?.cities || []);
      setAreas(data?.areas || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const fetchPayments = async (page = 0) => {
    setLoading(true);
    setNoData(false);
    try {
      await keycloak.updateToken(30);

      const response = await axios.post(
        `${Api.BASE_URL}leads/getPayments`,
        {
          searchText: searchText || null,
          cityId: city || null,
          areaId: area || null,
          fromDate,
          toDate,
          dateFilter: dateFilter || null,
          pageNumber: page,
          pageSize: recordsPerPage,
          sortField: "id",
          sortOrder: "desc",
          transitLevel: "ACCOUNT_TEAM"
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data?.leadPage?.content || [];
      setRecords(data);
      setTotalPages(response.data?.leadPage?.totalPages || 1);
      if (data.length === 0) {
        setNoData(true);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setNoData(true);
      setRecords([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    setLoading(true);
    try {
      await keycloak.updateToken(30);

      const response = await axios.post(
        `${Api.BASE_URL}payments/getPaymentsExcel`,
        {
          searchText: searchText || null,
          cityId: city || null,
          areaId: area || null,
          fromDate,
          toDate,
          dateFilter: dateFilter || null,
          pageNumber: 0, // Export all, so typically page 0 and a large size
          pageSize: 10000, // Or adjust as per backend capabilities for export
          sortField: "id",
          sortOrder: "desc",
          transitLevel: "ACCOUNT_TEAM"
        },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
            "Content-Type": "application/json",
          },
          responseType: 'blob', // Important for handling file downloads
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Payments.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.error("Error downloading Excel file:", error);
      Swal.fire("Error!", "Failed to download the Excel file. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keycloak.token) {
      fetchDropdowns();
      fetchPayments(0);
    }
  }, [keycloak.token]);

  const handleCityChange = (selectedCityId) => {
    setCity(selectedCityId);
    setArea(null);
    fetchDropdowns(selectedCityId, null);
  };

  const handleAreaChange = (selectedAreaId) => {
    setArea(selectedAreaId);
    fetchDropdowns(city, selectedAreaId);
  };

  const handleSubmit = () => {
    setCurrentPage(0);
    fetchPayments(0);
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
    fetchPayments(selectedPage);
  };

  const handleViewClick = (leadId) => {
    navigate(`/add-lead?mode=view&id=${leadId}&showLead=false`, {
      state: {
        from: location.pathname,
        filters: {
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
          city,
          area,
          searchText,
          dateFilter,
          currentPage,
        },
      },
    });
  };

  const handleEditClick = (leadId) => {
    navigate(`/edit?mode=edit&id=${leadId}&showLead=false`, {
      state: {
        from: location.pathname,
        filters: {
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
          city,
          area,
          searchText,
          dateFilter,
          currentPage,
        },
      },
    });
  };

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
        await keycloak.updateToken(30);
        await axios.put(
          `${Api.BASE_URL}leads/${id}/cancel`,
          { id: id, cancellationReason: reason },
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        Swal.fire("Cancelled!", "The lead has been cancelled.", "success");
        fetchPayments(currentPage); // Refresh list
      } catch (error) {
        console.error("Error canceling lead:", error.response?.data || error.message);
        Swal.fire("Error!", "Failed to cancel the lead. Please try again.", "error");
      }
    }
  };

  const renderDropdown = (label, value, options, onChange) => {
    const selectOptions = options.map((opt) => ({ value: opt.id, label: opt.name }));
    const currentValue = selectOptions.find((opt) => opt.value === value);

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
            container: (provided) => ({ ...provided, minWidth: "190px" }),
            menu: (provided) => ({ ...provided, zIndex: 999 }),
            control: (provided) => ({
              ...provided,
              borderRadius: "16px",
              padding: "2px",
              fontSize: "0.85rem",
            }),
          }}
        />
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
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
                    <DatePicker selected={fromDate} onChange={(date) => setFromDate(date)} dateFormat="dd-MM-yyyy" className="custom-input" />
                    <FaRegCalendarAlt className="calendar-icon" />
                  </div>
                </div>
                <div className="date-field">
                  <label>To Date*</label>
                  <div className="input-wrapper">
                    <DatePicker selected={toDate} onChange={(date) => setToDate(date)} dateFormat="dd-MM-yyyy" className="custom-input" />
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
                {renderDropdown("City", city, cities, handleCityChange)}
                {renderDropdown("Area", area, areas, handleAreaChange)}
                <input type="text" className="searchClient" placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <button onClick={handleSubmit}>Submit</button>
                <button className="download-btn" title="Download Payments Excel" onClick={handleDownloadExcel}>
                  <FaDownload />
                </button>
              </div>
            </div>

            <hr />

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
                    <thead style={{ tableLayout: 'fixed', width: '100%' }}>
                      <tr>
                        <th className="sticky-col">Token Number</th>
                        <th>Amount Received</th>
                        <th>Outstanding Amount</th>
                        <th>Total Amount</th>
                        <th>GRN Number</th>
                        <th>GRN Amount</th>
                        <th>DHC Number</th>
                        <th>DHC Amount</th>
                        <th>Commission Name</th>
                        <th>Commission Amount</th>
                        <th>Commission Date</th>
                        <th className="action-column">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, index) => (
                        <tr key={index}>
                          <td className="sticky-col">{record.tokenNo || "-"}</td>
                          <td>{record.totalReceivedAmount || "-"}</td>
                          <td>{record.outstandingAmount || "-"}</td>
                          <td>{record.totalAmount || "-"}</td>
                          <td>{record.grnNumber || "-"}</td>
                          <td>{record.grnAmount || "-"}</td>
                          <td>{record.dhcNumber || "-"}</td>
                          <td>{record.dhcAmount || "-"}</td>
                          <td>{record.commissionName || "-"}</td>
                          <td>{record.commissionAmount || "-"}</td>
                          <td>{formatDate(record.commissionDate)}</td>
                          <td className="action-column">
                            <div>
                              <FaEye className="action-icon icon-view" onClick={() => handleViewClick(record.leadId)} />
                              <FaEdit className="action-icon icon-edit" onClick={() => handleEditClick(record.leadId)} />
                              <FaTrash className="action-icon icon-cancel" onClick={() => handleDelete(record.leadId)} />
                            </div>
                          </td>
                        </tr>
                      ))}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsTeam;