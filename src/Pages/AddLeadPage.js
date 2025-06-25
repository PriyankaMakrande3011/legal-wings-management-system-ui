
import React, { useState, useEffect } from 'react';
import Slider from "./Slider";
import Header from "./Header.js";
import './AddLead.css';
import AddClient from "./AddClient.js";
import { useKeycloak } from "@react-keycloak/web";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaRegCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import CustomDatePicker from '../common/CustomDatePicker.js';




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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({});
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null); // <--- New
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const clientTypeOptions = ["OWNER", "TENANT", "AGENT"];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { keycloak } = useKeycloak();
  const transitLevel = location.state?.transitLevel;
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);



  useEffect(() => {
    if (keycloak?.token) {
      fetch(Api.CLIENT_DROPDOWN, {
        headers: {
          "Authorization": `Bearer ${keycloak.token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => setClients(data))
        .catch(err => console.error("Failed to fetch clients", err));
    }
  }, [keycloak?.token]);

  const handleAcceptLead = (lead) => {
    navigate("/add-Executive-details");   // navigate to AddLeadPage
  };


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveLead = () => {
    const requestBody = {
      tentativeAgreementDate: formData.tentativeAgreementDate,
      visitAddress: formData.visitAddress,
      id: leadId,
      transitLevel: transitLevel,
      client: {
        ...(selectedClientId ? { id: selectedClientId } : {
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          email: formData.email || "",
          phoneNo: formData.contactNumber || "",
          clientType: formData.clientType || "",
        }
        )
      }
    };

    fetch("https://legalwingcrm.in:8081/legal-wings-management/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*",
        "Authorization": `Bearer ${keycloak.token}`
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

    fetch("https://legalwingcrm.in:8081/legal-wings-management/agreements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*",
        "Authorization": `Bearer ${keycloak.token}`
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
    if (isSubmitting) return; // prevent multiple submissions
    setIsSubmitting(true);
    const paymentData = {
      leadId,
      ownerAmount: formData.ownerPayment,
      ownerPaymentDate: formData.ownerPaymentDate,
      tenantAmount: formData.tenantPayment,
      tenantPaymentDate: formData.tenantPaymentDate,
      totalAmount: formData.totalPayment,
      remainingAmount: formData.remainingPayment,
      modeOfPayment: formData.paymentMode,
      grnNumber: formData.grnNumber,
      govtGrnDate: formData.govtGrnDate,
      dhcDate: formData.dhcDate,
    };

    fetch("https://legalwingcrm.in:8081/legal-wings-management/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*",
        "Authorization": `Bearer ${keycloak.token}`
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
      })
      .finally(() => {
        setIsSubmitting(false); // re-enable button after request
      });


  };

  const handleNext = (nextTab) => {
    setActiveTab(nextTab);
  };

  const fetchAndAutofillClient = (clientId, type) => {
    if (!clientId) return;

    setSelectedClientId(clientId); // <--- New

    fetch(`${Api.BASE_URL}clients/${clientId}`, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
        "Content-Type": "application/json"
      }
    })
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
            ownerFirstName: client.firstName,
            ownerLastName: client.lastName,
            ownerEmail: client.email,
            ownerContact: client.phoneNo,
            ownerAadhar: client.aadharNumber,
            ownerPan: client.panNumber,
          }));
        } else if (type === 'tenant') {
          setFormData(prev => ({
            ...prev,
            tenantFirstName: client.firstName,
            tenantLastName: client.lastName,
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


  const fetchDropdowns = async () => {
    const requestBody = {
      cityIdsUi: null,

      areaIdsUi: []
    };

    try {
      const response = await fetch(`${Api.BASE_URL}geographic-nexus/allDropDowns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keycloak.token}`
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      setCityOptions(data.cities || []);
      setAreaOptions(data.areas || []);

      console.log("City Options:", data.cityList);
      console.log("Area Options:", data.areaList);

    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    }
  };

  useEffect(() => {
    fetchDropdowns(); // Fetch cities initially
  }, []);

  const renderDropdown = (label, field, options = []) => (
    <div>
      <label>{label}</label>
      <select
        value={formData[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={mode === 'view'}
        className="client-dropdown"
      >
        <option value="">Select {label}</option>
        {options.map((opt, idx) => (
          <option
            key={opt.id || idx}
            value={opt.id || opt}
          >
            {opt.name || opt}
          </option>
        ))}
      </select>
    </div>
  );


  const renderInput = (label, placeholder, field) => (
    <div>
      <label htmlFor={field}>{label}</label>
      <input
        placeholder={placeholder}
        value={formData[field] || ''}
        readOnly={mode === 'view'}
        onChange={e => handleInputChange(field, e.target.value)}
      />
    </div>
  );

  useEffect(() => {
    console.log("Mode:", mode, "ID:", id);
    const fetchLeadDetails = async () => {
      if (mode === "view" && id) {
        try {
          const response = await axios.get(`https://legalwingcrm.in:8081/legal-wings-management/leads/${id}`, {
            headers: {
              Authorization: `Bearer ${keycloak.token}`
            }
          }); const data = response.data;
          console.log("Fetched data:", data);

          setFormData({
            // Client
            firstName: data.client?.firstName || "",
            lastName: data.client?.lastName || "",
            contactNumber: data.client?.phoneNo || "",
            email: data.client?.email || "",
            clientType: data.client?.clientType || "",
            tentativeAgreementDate: data.client.tentativeAgreementDate || "",
            area: data.client.area || "",
            city: data.client.city || "",
            tentativeAddress: data.client.tentativeAddress || "",

            // Owner
            ownerFirstName: data.agreement?.owner?.firstName || "",
            ownerLastName: data.agreement?.owner?.lastName || "",
            ownerContact: data.agreement?.owner?.phoneNo || "",
            ownerEmail: data.agreement?.owner?.email || "",
            ownerAadhar: data.agreement?.owner?.aadharNumber || "",
            ownerPan: data.agreement?.owner?.panNumber || "",

            // Tenant
            tenantFirstName: data.agreement?.tenant?.firstName || "",
            tenantLastName: data.agreement?.tenant?.lastName || "",
            tenantContact: data.agreement?.tenant?.phoneNo || "",
            tenantEmail: data.agreement?.tenant?.email || "",
            tenantAadhar: data.agreement?.tenant?.aadharNumber || "",
            tenantPan: data.agreement?.tenant?.panNumber || "",

            // Agreement
            startDate: data.agreement?.agreementStartDate || "",
            endDate: data.agreement?.agreementEndDate || "",
            area: data.agreement?.area?.name || "",
            addressLine1: data.agreement?.addressLine1 || "",
            addressLine2: data.agreement?.addressLine2 || "",
            city: data.agreement?.city || "",
            pinCode: data.agreement?.pinCode || "",
            tokenNumber: data.agreement?.tokenNo || "",

            // Payment
            totalPayment: data.payment?.totalAmount || "",
            ownerPayment: data.payment?.ownerAmount || "",
            tenantPayment: data.payment?.tenantAmount || "",
            remainingPayment: data.payment?.remainingAmount || "",
            paymentMode: data.payment?.modeOfPayment || "",
            ownerPaymentDate: data.payment?.ownerPaymentDate || "",
            tenantPaymentDate: data.payment?.tenantPaymentDate || "",
            grnNumber: data.payment?.grnNumber || "",
            govtGrnDate: data.payment?.govtGrnDate || "",
            dhcDate: data.payment?.dhcDate || ""
          });

          // For datepicker values
          if (data.agreement?.agreementStartDate) {
            setStartDate(new Date(data.agreement.agreementStartDate));
          }
          if (data.agreement?.agreementEndDate) {
            setEndDate(new Date(data.agreement.agreementEndDate));
          }

        } catch (err) {
          console.error("Error fetching lead details:", err);
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
              {renderInput("First Name", "First Name", "firstName")}
              {renderInput("Last Name", "Last Name", "lastName")}
              {renderDropdown("Client Type", "clientType", clientTypeOptions)}
              {renderInput("Contact Number", "Contact Number", "contactNumber")}
              {renderInput("Email", "Email", "email")}
              <CustomDatePicker
                label="Tentative Agreement Date"
                placeholder="Tentative Agreement Date"
                value={formData.tentativeAgreementDate}
                onChange={(date) => handleInputChange('tentativeAgreementDate', date)}
                dateFormat="yyyy-MM-dd"
              />
              {renderInput("Tentative Address", "Tentative Address", "address")}
              {renderDropdown("Area", "Area", areaOptions)}
              {renderDropdown("City", "City", cityOptions)}
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
              {renderInput("Owner Firstname", "Owner Firstname", "ownerFirstName")}
              {renderInput("Tenant LastName", "Tenant LastName", "ownerLastName")}
              {renderInput("Owner Email", "Owner Email", "ownerEmail")}
              {renderInput("Owner Contact", "Owner Contact", "ownerContact")}
              {renderInput("Owner Aadhar Number", "Owner Aadhar Number", "ownerAadhar")}
              {renderInput("Owner PAN Number", "Owner PAN Number", "ownerPan")}
            </div>
            <h3 className="agreement-heading">Tenant</h3>
            {renderClientDropdown('tenant')}
            <div className="form-grid">
              {renderInput("Tenant FirstName", "Tenant FirstName", "tenantFirstName")}
              {renderInput("Tenant LastName", "Tenant LastName", "tenantLastName")}
              {renderInput("Tenant Email", "Tenant Email", "tenantEmail")}
              {renderInput("Tenant Contact", "Tenant Contact", "tenantContact")}
              {renderInput("Tenant Aadhar Number", "Tenant Aadhar Number", "tenantAadhar")}
              {renderInput("Tenant PAN Number", "Tenant PAN Number", "tenantPan")}
            </div>
            <h3 className="agreement-heading">Agreement Details</h3>
            <div className="form-grid">
              {renderInput("Token Number", "Token Number", "tokenNumber")}
              {renderInput("Agreement Start Date", "Agreement Start Date", "startDate")}
              {renderInput("Agreement End Date", "Agreement End Date", "endDate")}
              {renderInput("Address Line 1", "Address Line 1", "addressLine1")}
              {renderInput("Address Line 2", "Address Line 2", "addressLine2")}
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
              {renderInput("Owner Payment Amount", "Owner Payment Amount", "ownerPayment")}
              {renderInput(" Owner Payment Date ", "Owner Payment Date", "ownerPaymentDate")}
              {renderInput("Tenant Payment Amount", "Tenant Payment Amount", "tenantPayment")}
              {renderInput(" Tenant Payment Date ", "Tenant Payment Date", "tenantPaymentDate")}
              {renderInput("Total Payment", "Total Payment", "totalPayment")}
              {renderInput("Remaining Payment", "Remaining Payment", "remainingPayment")}
              {renderInput("Mode of Payment", "Mode of Payment", "paymentMode")}
              {renderInput("GRN Number", "GRN Number", "grnNumber")}
              {renderInput("Govt GRN Date", "Govt GRN Date", "govtGrnDate")}
              {renderInput("DHC Date", "DHC Date", "dhcDate")}

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
