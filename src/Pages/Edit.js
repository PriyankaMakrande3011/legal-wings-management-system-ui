import React, { useState, useEffect } from 'react';
import Slider from "./Slider";
import Header from "./Header.js";
import './AddLead.css';
import { useKeycloak } from "@react-keycloak/web";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import CustomDatePicker from '../common/CustomDatePicker.js';
import Api from './Api.js';

const Edit = ({ showLead = true, showClient = true, showPayment = true }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");  // can be 'edit' or something
  const id = queryParams.get("id");
  const defaultTab = showLead ? 'lead' : showClient ? 'client' : 'payment';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({ cityId: "", areaId: "" });
  const [clients, setClients] = useState([]);
  const [leadId, setLeadId] = useState(null);
  const { keycloak } = useKeycloak();
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);

  // Fetch clients
  useEffect(() => {
    if (keycloak?.token) {
      fetch(Api.CLIENT_DROPDOWN, {
        headers: { "Authorization": `Bearer ${keycloak.token}` }
      })
        .then(res => res.json())
        .then(data => setClients(data))
        .catch(err => console.error("Failed to fetch clients", err));
    }
  }, [keycloak?.token]);

  // City/Area dropdown fetch
  const fetchDropdowns = async (selectedCityId = null) => {
    const requestBody = {
      cityIdsUi: selectedCityId ? [selectedCityId] : [],
      areaIdsUi: []
    };
    try {
      const resp = await fetch(`${Api.BASE_URL}geographic-nexus/allDropDowns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keycloak.token}`
        },
        body: JSON.stringify(requestBody)
      });
      const data = await resp.json();
      setCityOptions(data.cities || []);
      setAreaOptions(data.areas || []);
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  // Utility to check if a field should be editable in ‘edit’ mode
  const isEditable = field => {
    if (mode !== 'edit') return true;
    const editableFields = [
      // Lead
      "tentativeAgreementDate", "visitAddress", "cityId", "areaId",
      // Agreement
      "tokenNumber", "startDate", "endDate", "addressLine1", "addressLine2",
      // Payment
      "ownerPayment", "ownerPaymentDate",
      "tenantPayment", "tenantPaymentDate",
      "totalPayment", "remainingPayment",
      "paymentMode", "grnNumber",
      "govtGrnDate", "dhcDate"
    ];
    return editableFields.includes(field);
  };

  // Input and Dropdown render helpers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const renderInput = (label, field, placeholder = "") => (
    <div>
      <label htmlFor={field}>{label}</label>
      <input
        placeholder={placeholder || label}
        value={formData[field] || ""}
        onChange={e => handleInputChange(field, e.target.value)}
        readOnly={!isEditable(field)}
      />
    </div>
  );
  const renderDropdown = (label, field, options) => (
    <div>
      <label>{label}</label>
      <select
        name={field}
        value={formData[field] || ""}
        onChange={e => {
          handleInputChange(field, e.target.value);
          if (field === "cityId") fetchDropdowns(e.target.value);
        }}
        disabled={!isEditable(field)}
        className="client-dropdown"
      >
        <option value="">Select {label}</option>
        {options.map(opt => (
          <option key={opt.id || opt} value={opt.id || opt}>{opt.name || opt}</option>
        ))}
      </select>
    </div>
  );

  // Conditional dropdown for existing clients
  const renderClientDropdown = type => {
    let show = false;
    if (type === "lead") show = !formData.firstName;
    else if (type === "owner") show = !formData.ownerFirstName;
    else if (type === "tenant") show = !formData.tenantFirstName;
    if (!show) return null;

    return (
      <select
        onChange={e => fetchAndAutofillClient(e.target.value, type)}
        defaultValue=""
        className="client-dropdown"
        disabled={false}
      >
        <option value="">Select Existing Client</option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    );
  };

  const fetchAndAutofillClient = (clientId, type) => {
    if (!clientId) return;
    fetch(`${Api.BASE_URL}clients/${clientId}`, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    })
      .then(res => res.json())
      .then(client => {
        const base = {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          contactNumber: client.phoneNo
        };
        if (type === "lead") {
          setFormData(prev => ({ ...prev, ...base }));
        } else if (type === "owner") {
          setFormData(prev => ({
            ...prev,
            ownerFirstName: client.firstName,
            ownerLastName: client.lastName,
            ownerEmail: client.email,
            ownerContact: client.phoneNo,
            ownerAadhar: client.aadharNumber,
            ownerPan: client.panNumber
          }));
        } else if (type === "tenant") {
          setFormData(prev => ({
            ...prev,
            tenantFirstName: client.firstName,
            tenantLastName: client.lastName,
            tenantEmail: client.email,
            tenantContact: client.phoneNo,
            tenantAadhar: client.aadharNumber,
            tenantPan: client.panNumber
          }));
        }
      })
      .catch(err => console.error("Failed to fetch client data", err));
  };

  // Fetch existing lead details
  useEffect(() => {
    if (mode === "edit" && id) {
      axios.get(`${Api.BASE_URL}leads/${id}`, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      })
        .then(resp => {
          const data = resp.data;
          setLeadId(data.id);
          setFormData({
            firstName: data.client?.firstName || "",
            lastName: data.client?.lastName || "",
            contactNumber: data.client?.phoneNo || "",
            email: data.client?.email || "",
            clientType: data.client?.clientType || "",
            tentativeAgreementDate: data.tentativeAgreementDate || "",
            visitAddress: data.visitAddress || "",
            cityId: data.city?.id || "",
            areaId: data.area?.id || "",
            ownerFirstName: data.agreement?.owner?.firstName || "",
            ownerLastName: data.agreement?.owner?.lastName || "",
            ownerEmail: data.agreement?.owner?.email || "",
            ownerContact: data.agreement?.owner?.phoneNo || "",
            ownerAadhar: data.agreement?.owner?.aadharNumber || "",
            ownerPan: data.agreement?.owner?.panNumber || "",
            tenantFirstName: data.agreement?.tenant?.firstName || "",
            tenantLastName: data.agreement?.tenant?.lastName || "",
            tenantEmail: data.agreement?.tenant?.email || "",
            tenantContact: data.agreement?.tenant?.phoneNo || "",
            tenantAadhar: data.agreement?.tenant?.aadharNumber || "",
            tenantPan: data.agreement?.tenant?.panNumber || "",
            tokenNumber: data.agreement?.tokenNo || "",
            startDate: data.agreement?.agreementStartDate || "",
            endDate: data.agreement?.agreementEndDate || "",
            addressLine1: data.agreement?.addressLine1 || "",
            addressLine2: data.agreement?.addressLine2 || "",
            totalPayment: data.payment?.totalAmount || "",
            ownerPayment: data.payment?.ownerAmount || "",
            ownerPaymentDate: data.payment?.ownerPaymentDate || "",
            tenantPayment: data.payment?.tenantAmount || "",
            tenantPaymentDate: data.payment?.tenantPaymentDate || "",
            remainingPayment: data.payment?.remainingAmount || "",
            paymentMode: data.payment?.modeOfPayment || "",
            grnNumber: data.payment?.grnNumber || "",
            govtGrnDate: data.payment?.govtGrnDate || "",
            dhcDate: data.payment?.dhcDate || ""
          });
          fetchDropdowns(data.city?.id);
        })
        .catch(err => console.error("Error fetching lead details:", err));
    }
  }, [mode, id]);

  // Save methods (same as in AddLeadPage)
  const handleSaveLead = () => {
    const payload = {
      id: leadId,
      tentativeAgreementDate: formData.tentativeAgreementDate,
      visitAddress: formData.visitAddress,
      city: { id: formData.cityId || null },
      area: { id: formData.areaId || null },
      client: formData.firstName ? {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNo: formData.contactNumber,
        clientType: formData.clientType || ""
      } : undefined
    };
    fetch(`${Api.BASE_URL}leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save lead");
        return res.json();
      })
      .then(data => {
        alert("Lead saved successfully!");
        setLeadId(data.id);
        setActiveTab("client");
      })
      .catch(err => {
        console.error("Lead Save Error:", err);
        alert("Error saving lead. Please try again.");
      });
  };

  const handleSaveAgreement = () => {
    const data = {
      leadId,
      tokenNo: formData.tokenNumber,
      agreementStartDate: formData.startDate,
      agreementEndDate: formData.endDate,
      area: { id: formData.areaId || null },
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      tenant: {
        firstName: formData.tenantFirstName,
        lastName: formData.tenantLastName,
        clientType: "TENANT",
        email: formData.tenantEmail,
        phoneNo: formData.tenantContact,
        aadharNumber: formData.tenantAadhar,
        panNumber: formData.tenantPan
      },
      owner: {
        firstName: formData.ownerFirstName,
        lastName: formData.ownerLastName,
        clientType: "OWNER",
        email: formData.ownerEmail,
        phoneNo: formData.ownerContact,
        aadharNumber: formData.ownerAadhar,
        panNumber: formData.ownerPan
      }
    };
    fetch(`${Api.BASE_URL}agreements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save agreement");
        return res.json();
      })
      .then(() => {
        alert("Agreement saved successfully!");
        setActiveTab("payment");
      })
      .catch(err => {
        console.error("Agreement Save Error:", err);
        alert("Error saving agreement. Please try again.");
      });
  };

  const handleSavePayment = () => {
    const data = {
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
      dhcDate: formData.dhcDate
    };
    fetch(`${Api.BASE_URL}payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save payment");
        return res.json();
      })
      .then(() => alert("Payment saved successfully!"))
      .catch(err => {
        console.error("Payment Save Error:", err);
        alert("Error saving payment. Please try again.");
      });
  };

  // Render content per tab
  const renderContent = () => {
    switch (activeTab) {
      case 'lead': return (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
            {renderClientDropdown('lead')}
          </div>
          <div className="form-grid">
            {renderInput("First Name", "firstName")}
            {renderInput("Last Name", "lastName")}
            {renderDropdown("Client Type", "clientType", [{ name: "OWNER" }, { name: "TENANT" }, { name: "AGENT" }])}
            {renderInput("Contact Number", "contactNumber")}
            {renderInput("Email", "email")}
            <CustomDatePicker
              label="Tentative Agreement Date"
              placeholder="Tentative Agreement Date"
              value={formData.tentativeAgreementDate}
              onChange={date => handleInputChange('tentativeAgreementDate', date)}
              dateFormat="yyyy-MM-dd"
              readOnly={!isEditable('tentativeAgreementDate')}
            />
            {renderInput("Visit Address", "visitAddress")}
            {renderDropdown("City", "cityId", cityOptions)}
            {renderDropdown("Area", "areaId", areaOptions)}
          </div>
          {mode === 'edit' && (
            <div className="button-wrapper">
              <button onClick={handleSaveLead}>Save</button>
              <button onClick={() => setActiveTab('client')}>Next</button>
            </div>
          )}
        </>
      );

      case 'client': return (
        <>
          <h3 className="agreement-heading">Owner</h3>
          {renderClientDropdown('owner')}
          <div className="form-grid">
            {renderInput("Owner Firstname", "ownerFirstName")}
            {renderInput("Owner Last Name", "ownerLastName")}
            {renderInput("Owner Email", "ownerEmail")}
            {renderInput("Owner Contact", "ownerContact")}
            {renderInput("Owner Aadhar Number", "ownerAadhar")}
            {renderInput("Owner PAN Number", "ownerPan")}
          </div>
          <h3 className="agreement-heading">Tenant</h3>
          {renderClientDropdown('tenant')}
          <div className="form-grid">
            {renderInput("Tenant Firstname", "tenantFirstName")}
            {renderInput("Tenant Last Name", "tenantLastName")}
            {renderInput("Tenant Email", "tenantEmail")}
            {renderInput("Tenant Contact", "tenantContact")}
            {renderInput("Tenant Aadhar Number", "tenantAadhar")}
            {renderInput("Tenant PAN Number", "tenantPan")}
          </div>
          <h3 className="agreement-heading">Agreement Details</h3>
          <div className="form-grid">
            {renderInput("Token Number", "tokenNumber")}
            <CustomDatePicker
              label="Agreement Start Date"
              placeholder="Start Date"
              value={formData.startDate}
              onChange={date => handleInputChange('startDate', date)}
              dateFormat="yyyy-MM-dd"
              readOnly={!isEditable('startDate')}
            />
            <CustomDatePicker
              label="Agreement End Date"
              placeholder="End Date"
              value={formData.endDate}
              onChange={date => handleInputChange('endDate', date)}
              dateFormat="yyyy-MM-dd"
              readOnly={!isEditable('endDate')}
            />
            {renderInput("Address Line 1", "addressLine1")}
            {renderInput("Address Line 2", "addressLine2")}
          </div>
          {mode === 'edit' && (
            <div className="button-wrapper">
              <button onClick={handleSaveAgreement}>Save Agreement</button>
              <button onClick={() => setActiveTab('payment')}>Next</button>
            </div>
          )}
        </>
      );

      case 'payment': return (
        <>
          <div className="form-grid">
            {renderInput("Owner Payment Amount", "ownerPayment")}
            {renderInput("Owner Payment Date", "ownerPaymentDate")}
            {renderInput("Tenant Payment Amount", "tenantPayment")}
            {renderInput("Tenant Payment Date", "tenantPaymentDate")}
            {renderInput("Total Payment", "totalPayment")}
            {renderInput("Remaining Payment", "remainingPayment")}
            {renderInput("Mode of Payment", "paymentMode")}
            {renderInput("GRN Number", "grnNumber")}
            {renderInput("Govt GRN Date", "govtGrnDate")}
            {renderInput("DHC Date", "dhcDate")}
          </div>
          {mode === 'edit' && (
            <div className="button-wrapper">
              <button onClick={handleSavePayment}>Save</button>
            </div>
          )}
        </>
      );

      default: return null;
    }
  };

  return (
    <div className="add-lead-container">
      <Slider />
      <div className="main-content">
        <Header title="Edit Lead" />
        <div className="tab-buttons">
          {showLead && <button className={activeTab === 'lead' ? 'active' : ''} onClick={() => setActiveTab('lead')}>Lead Details</button>}
          {showClient && <button className={activeTab === 'client' ? 'active' : ''} onClick={() => setActiveTab('client')}>Client Details</button>}
          {showPayment && <button className={activeTab === 'payment' ? 'active' : ''} onClick={() => setActiveTab('payment')}>Payment Details</button>}
        </div>
        <div className="tab-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Edit;
