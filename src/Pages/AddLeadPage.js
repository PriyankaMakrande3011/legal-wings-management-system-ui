
import React, { useState, useEffect } from 'react';
import Slider from "./Slider";
import Header from "./Header.js";
import './AddLead.css';
import AddClient from "./AddClient.js";
import { FaPlus } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";


import Api from './Api.js';

const AddLeadPage = ({
  showLead = true,
  showClient = true,
  showPayment = true,

}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const id = queryParams.get("id");
  const [leadId, setLeadId] = useState(null);
  const defaultTab = showLead ? 'lead' : showClient ? 'client' : 'payment';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null); // <--- New
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetch(Api.CLIENT_DROPDOWN)
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error("Failed to fetch clients", err));
  }, []);

  const handleAcceptLead = (lead) => {
    navigate("/add-execative-details");   // navigate to AddLeadPage
  };
  

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveLead = () => {
    const requestBody = {
     
        client: {
          ...(selectedClientId ? { id: selectedClientId } : {
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          email: formData.email || "",
          phoneNo: formData.contactNumber || "",
        }
     ) }
    };

    fetch("http://localhost:8080/legal-wings-management/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify(requestBody)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save lead");
        return res.json();
      })
      .then(data => {
        alert("Lead saved successfully!");
        console.log("Saved Lead:", data);
        setLeadId(data.id);
        handleNext("client");
      })
      .catch(err => {
        console.error("Lead Save Error:", err);
        alert("Error saving lead. Please try again.");
      });
  };

  const handleSaveAgreement = () => {
    const agreementData = {
      leadId,
      tokenNo: formData.tokenNumber,
      agreementStartDate: formData.startDate,
      agreementEndDate: formData.endDate,
      area: {
        id: 1, // Replace with correct area ID
        name: formData.area || "",
      },
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      tenant: {
        
        firstName: formData.tenantFirstName,
        lastName: formData.tenantLastName,
        clientType: "TENANT", // Hardcoded for now, can be adjusted
        email: formData.tenantEmail,
        phoneNo: formData.tenantContact,
        areaName: formData.area,
        cityName: formData.city,
        pinCode: formData.pinCode,
        aadharNumber: formData.tenantAadhar,
        panNumber: formData.tenantPan,
      },
      owner: {
       
        firstName: formData.ownerFirstName,
        lastName: formData.ownerLastName,
        clientType: "OWNER", // Hardcoded for now, can be adjusted
        email: formData.ownerEmail,
        phoneNo: formData.ownerContact,
        areaName: formData.area,
        cityName: formData.city,
        pinCode: formData.pinCode,
        aadharNumber: formData.ownerAadhar,
        panNumber: formData.ownerPan,
      }
    };

    fetch("http://localhost:8080/legal-wings-management/agreements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify(agreementData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save agreement");
        return res.json();
      })
      .then(data => {
        alert("Agreement saved successfully!");
        console.log("Saved Agreement:", data);
        handleNext('payment');
      })
      .catch(err => {
        console.error("Agreement Save Error:", err);
        alert("Error saving agreement. Please try again.");
      });
  };

  const handleSavePayment = () => {
    const paymentData = {
      leadId,
      ownerAmount: formData.ownerPayment,
      tenantAmount: formData.tenantPayment,
      totalAmount: formData.totalPayment,
      remainingAmount: formData.remainingPayment,
      modeOfPayment: formData.paymentMode,
      paymentCalendar: formData.paymentCalendar
    };
  
    fetch("http://localhost:8080/legal-wings-management/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify(paymentData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save payment");
        return res.json();
      })
      .then(data => {
        alert("Payment saved successfully!");
       
        console.log("Saved Payment:", data);
      })
      .catch(err => {
        console.error("Payment Save Error:", err);
        alert("Error saving payment. Please try again.");
      });
  };

  const handleNext = (nextTab) => {
    setActiveTab(nextTab);
  };

  const fetchAndAutofillClient = (clientId, type) => {
    if (!clientId) return;

    setSelectedClientId(clientId); // <--- New

    fetch(`${Api.BASE_URL}clients/${clientId}`)
      .then(res => res.json())
      .then(client => {
        const baseFields = {
          firstName: client.firstName,
          lastName: client.lastName,
          clientType: client.clientType,
          email: client.email,
          address: client.address,
          city: client.cityName,
          area: client.areaName,
          contactNumber: client.phoneNo,
        };

        if (type === 'lead') {
          setFormData(prev => ({
            ...prev,
            ...baseFields,
          }));
        } else if (type === 'owner') {
          setFormData(prev => ({
            ...prev,
            ownerFirstName:client.firstName,
            ownerLastName:client.lastName,
            ownerEmail: client.email,
            ownerContact: client.phoneNo,
            ownerAadhar: client.aadharNumber,
            ownerPan: client.panNumber,
          }));
        } else if (type === 'tenant') {
          setFormData(prev => ({
            ...prev,
            tenantFirstName:client.firstName,
            tenantLastName:client.lastName,
            tenantEmail: client.email,
            tenantContact: client.phoneNo,
            tenantAadhar: client.aadharNumber,
            tenantPan: client.panNumber,
          }));
        }
      })
      .catch(err => console.error("Failed to fetch client data", err));
  };

  // const renderClientDropdown = (type) => (
  //   <select
  //     onChange={(e) => fetchAndAutofillClient(e.target.value, type)}
  //     defaultValue=""
  //     className='client-dropdown'
  //   >
  //     <option value="">Select Existing Client</option>
  //     {clients.map(client => (
  //       <option key={client.id} value={client.id}>{client.name}</option>
  //     ))}
  //   </select>
  // );

  const renderClientDropdown = (type) => {
    // Return null if mode is "view" to hide the dropdown
    if (mode === "view") {
      return null;
    }
  
    return (
      <select
        onChange={(e) => fetchAndAutofillClient(e.target.value, type)}
        defaultValue=""
        className="client-dropdown"
      >
        <option value="">Select Existing Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
    );
  };
  

  const renderInput = (placeholder, field) => (
    <input
      placeholder={placeholder}
      value={formData[field] || ''}
      readOnly={mode === 'view'}
      onChange={e => handleInputChange(field, e.target.value)}
    />
  );

  
  useEffect(() => {
    console.log("Mode:", mode, "ID:", id);
    const fetchLeadDetails = async () => {
      if (mode === "view" && id) {
        try {
          const response = await axios.get(
            `http://localhost:8080/legal-wings-management/leads/${id}`
          );
          const data = response.data;
          console.log("Fetched data:", data);
          const leadData = {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phoneNo: data.phoneNo || "",
            email: data.email || "",

            ownerFirstName: data.owner?.firstName || "",
            ownerPhone: data.owner?.phoneNo || "",

            tenantFirstName: data.tenant?.firstName || "",
            tenantPhone: data.tenant?.phoneNo || "",

            agreementStartDate: data.agreement?.startDate || "",
            agreementEndDate: data.agreement?.endDate || "",

            totalAmount: data.payment?.totalAmount || "",
            ownerAmount: data.payment?.ownerAmount || "",
            tenantAmount: data.payment?.tenantAmount || "",
          };

          setFormData(leadData);
        } catch (error) {
          console.error("Error fetching lead data", error);
        }
      }
    };

    fetchLeadDetails();
  }, [mode, id]);


  const renderContent = () => {
    switch (activeTab) {
      case 'lead':
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              {renderClientDropdown('lead')}
            </div>
            <div className="form-grid">
              {renderInput("First Name", "firstName")}
              {renderInput("Last Name", "lastName")}
              {renderInput("Client Type", "clientType")}
              {renderInput("Contact Number", "contactNumber")}
              {renderInput("Email", "email")}
              {renderInput("Tentative Agreement Date", "date")}
              {renderInput("Tentative Address", "address")}
              {renderInput("Area", "area")}
              {renderInput("City", "city")}
            </div>
            {mode !== 'view' && (
              <div className="button-wrapper">
                <button onClick={handleSaveLead}>Save</button>
                <button onClick={() => handleNext('client')}>Next</button>
              </div>
            )}
          </>
        );

      case 'client':
        return (
          <>
            <h3 className="agreement-heading">Owner</h3>
            {renderClientDropdown('owner')}
            <div className="form-grid">
            {renderInput("Owner Firstname", "ownerFirstName")}
            {renderInput("Tenant LastName", "ownerLastName")}
              {renderInput("Owner Email", "ownerEmail")}
              {renderInput("Owner Contact", "ownerContact")}
              {renderInput("Owner Aadhar Number", "ownerAadhar")}
              {renderInput("Owner PAN Number", "ownerPan")}
            </div>
            <h3 className="agreement-heading">Tenant</h3>
            {renderClientDropdown('tenant')}
            <div className="form-grid">
            {renderInput("Tenant FirstName", "tenantFirstName")}
            {renderInput("Tenant LastName", "tenantLastName")}
              {renderInput("Tenant Email", "tenantEmail")}
              {renderInput("Tenant Contact", "tenantContact")}
              {renderInput("Tenant Aadhar Number", "tenantAadhar")}
              {renderInput("Tenant PAN Number", "tenantPan")}
            </div>
            <h3 className="agreement-heading">Agreement Details</h3>
            <div className="form-grid">
              {renderInput("Token Number", "tokenNumber")}
              {renderInput("Agreement Start Date", "startDate")}
              {renderInput("Agreement End Date", "endDate")}
              {renderInput("Address Line 1", "addressLine1")}
              {renderInput("Address Line 2", "addressLine2")}
            </div>
            {mode !== 'view' && (
              <div className="button-wrapper">
                <button onClick={handleSaveAgreement}>Save Agreement</button>
                <button onClick={() => handleNext('payment')}>Next</button>
              </div>
            )}
          </>
        );

      case 'payment':
        return (
          <>
            <div className="form-grid">
              {renderInput("Owner Payment Amount", "ownerPayment")}
              {renderInput("Tenant Payment Amount", "tenantPayment")}
              {renderInput("Total Payment", "totalPayment")}
              {renderInput("Remaining Payment", "remainingPayment")}
              {renderInput("Mode of Payment", "paymentMode")}
              {renderInput("Payment Calendar", "paymentCalendar")}
            </div>
            {mode !== 'view' && (
              <div className="button-wrapper">
               <button onClick={handleSavePayment}>Save </button>

              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="add-lead-container">
      <Slider />
      <div className="main-content">
        <Header title="Add New Lead" />
        <div className="tab-buttons">
          {showLead && <button className={activeTab === 'lead' ? 'active' : ''} onClick={() => setActiveTab('lead')}>Lead Details</button>}
          {showClient && <button className={activeTab === 'client' ? 'active' : ''} onClick={() => setActiveTab('client')}>Client Details</button>}
          {showPayment && <button className={activeTab === 'payment' ? 'active' : ''} onClick={() => setActiveTab('payment')}>Payment Details</button>}
        </div>
        <div className="tab-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AddLeadPage;
