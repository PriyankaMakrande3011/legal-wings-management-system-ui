import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./Calling.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Api from "./Api.js";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import "./ClientPage.css";
import Select from "react-select";
import { useKeycloak } from "@react-keycloak/web";

const AccountsTeam = () => {
  const [records, setRecords] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const recordsPerPage = 20;
  const { keycloak } = useKeycloak();

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
    navigate(`/add-lead?mode=view&id=${leadId}&showLead=false`);
  };

  const handleEditClick = (leadId) => {
    navigate(`/edit?mode=edit&id=${leadId}&showLead=false`);
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
          `${Api.BASE_URL}leads/cancel`,
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
              </div>

              <div className="filters">
                {renderDropdown("City", city, cities, handleCityChange)}
                {renderDropdown("Area", area, areas, handleAreaChange)}
                <input type="text" className="searchClient" placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <button onClick={handleSubmit}>Submit</button>
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
                    <thead>
                      <tr>
                        <th className="sticky-col">Owner Name</th>
                        <th>Owner Phone</th>
                        <th>Tenant Name</th>
                        <th>Tenant Phone</th>
                        <th>Total Amount</th>
                        <th>Owner Amount</th>
                        <th>Owner Payment Date</th>
                        <th>Tenant Amount</th>
                        <th>Tenant Payment Date</th>
                        <th>GRN Number</th>
                        <th>Token No</th>
                        <th>Status</th>
                        <th>Created By</th>
                        <th>Updated By</th>
                        <th className="action-column">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, index) => (
                        <tr key={index}>
                          <td className="sticky-col">{record.ownerName || "-"}</td>
                          <td>{record.ownerPhone || "-"}</td>
                          <td>{record.tenantName || "-"}</td>
                          <td>{record.tenantPhone || "-"}</td>
                          <td>{record.totalAmount || "-"}</td>
                          <td>{record.ownerAmount || "-"}</td>
                          <td>{formatDate(record.ownerPaymentDate)}</td>
                          <td>{record.tenantAmount || "-"}</td>
                          <td>{formatDate(record.tenantPaymentDate)}</td>
                          <td>{record.grnNumber || "-"}</td>
                          <td>{record.tokenNo || "-"}</td>
                          <td>{record.status || "-"}</td>
                          <td>{record.createdByUserName || "-"}</td>
                          <td>{record.updatedByUserName || "-"}</td>
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