import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./ClientPage.css";
import ReactPaginate from "react-paginate";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AddClient from "./AddClient";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Api from "./Api.js";
import EditClient from "./EditClient.js";
import { useKeycloak } from "@react-keycloak/web";

const ClientType = {
  OWNER: "OWNER",
  TENANT: "TENANT",
  AGENT: "AGENT",
  REFERENCE: "REFERENCE",
};

// Define the required columns
const REQUIRED_COLUMNS = [
  "firstName",
  "lastName",
  "phoneNo",
  "email",
  "clientType",
  "aadharNumber",
  "panNumber",
  "createdDate",
  "createdBy",
  "updatedDate",
  "updatedBy",
];

const ClientPage = () => {
  const [columns, setColumns] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedClientType, setSelectedClientType] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const recordsPerPage = 10;
  const navigate = useNavigate();
   const { keycloak } = useKeycloak();


  // Fetch client data
  const fetchClients = async (clientType = "", searchText = "", pageNumber = 0) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${Api.BASE_URL}clients/all`,
        {
          clientType: clientType || null,
          searchText: searchText || null,
          pageNumber: pageNumber,
          pageSize: recordsPerPage,
          sortField: "id",
          sortOrder: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${keycloak.token}`
          },
        }
      );

      if (response.data?.clientPage?.content) {
        const clients = response.data.clientPage.content;
        setRecords(clients);
        setTotalPages(response.data.clientPage.totalPages || 1);

        // Set only required columns
        if (clients.length > 0) {
          setColumns(REQUIRED_COLUMNS);
        }
      } else {
        setRecords([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching clients:", error.response?.data || error.message);
      setRecords([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Handle filter submit
  const handleSubmit = () => {
    setCurrentPage(0);
    fetchClients(selectedClientType, searchText, 0);
  };

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    fetchClients(selectedClientType, searchText, selected);
  };

  // Handle delete client with SweetAlert2
  // const handleDelete = async (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "This action cannot be undone!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         await axios.delete(`https://legalwingcrm.in:8081/legal-wings-management/clients/${id}`);
  //         Swal.fire("Deleted!", "Client has been removed.", "success");
  //         fetchClients(selectedClientType, searchText, currentPage); // Refresh list after delete
  //       } catch (error) {
  //         console.error("Error deleting client:", error.response?.data || error.message);
  //         Swal.fire("Error!", "Failed to delete the client. Please try again.", "error");
  //       }
  //     }
  //   });
  // };

  const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(
          `https://legalwingcrm.in:8081/legal-wings-management/clients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );

        Swal.fire("Deleted!", "Client has been removed.", "success");
        fetchClients(selectedClientType, searchText, currentPage);
      } catch (error) {
        console.error("Error deleting client:", error.response?.data || error.message);
        Swal.fire("Error!", "Failed to delete the client. Please try again.", "error");
      }
    }
  });
};

const handleEditClick = (id) => {
    setSelectedLeadId(id);  
  setShowEditClientModal(true);
};
  return (
    <div className="client-container">
      <Slider />
      <div className="client-page">
        <Header />
        <div className="client-content-box">
          {/* Filter Section */}
          <div className="client-filter">
            <select value={selectedClientType} onChange={(e) => setSelectedClientType(e.target.value)}>
              <option value="">Select Client Type</option>
              {Object.values(ClientType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="searchClient"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
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
            ) : records.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        style={{
                          width:
                            col === 'phoneNo'
                              ? '100px'
                              : ['createdDate', 'updatedDate'].includes(col)
                              ? '80px'
                              : undefined,
                        }}
                      >
                        {col.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((client, index) => (
                    <tr key={client.id}>
                      <td>{index + 1 + currentPage * recordsPerPage}</td>
                      {columns.map((col, i) => (
                        <td key={i}>{client[col] || "N/A"}</td>
                      ))}
                      <td>
                        <FaEdit className="action-icon" onClick={() => handleEditClick(client.id)} />
                        
                        <FaTrash className="action-icon delete-icon" onClick={() => handleDelete(client.id)} />
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
              pageCount={totalPages}
              onPageChange={handlePageChange}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={currentPage}
            />
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClient isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <EditClient isOpen={showEditClientModal} onClose={() => setShowEditClientModal(false)}  leadId={selectedLeadId}   />
    </div>
  );
};

export default ClientPage;
