import React, { useState, useEffect } from 'react';
import Slider from "./Slider";
import Header from "./Header.js";
import './AddLead.css'; // Using the same CSS for consistency
import { useKeycloak } from '@react-keycloak/web';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomDatePicker from '../common/CustomDatePicker.js';
import { format } from 'date-fns'; // Ensure date-fns is used
import Api from './Api.js';
import { FaTimes, FaPlus } from "react-icons/fa";
import Select from "react-select";
import CustomDateTimePicker from '../common/CustomDateTimePicker.js';

const Edit = ({ showLead = true, showClient = true, showPayment = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");  // can be 'edit' or something
  const id = queryParams.get("id");
  const defaultTab = showLead ? 'lead' : showClient ? 'client' : 'payment';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({ cityId: "", areaId: "" });
  const [clients, setClients] = useState([]);
  const [leadId, setLeadId] = useState(id); // Initialize leadId from URL
  const { keycloak } = useKeycloak();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [agreementStatusOptions, setAgreementStatusOptions] = useState([]);
  const [backOfficeStatusOptions, setBackOfficeStatusOptions] = useState([]);
  const [agreementFile, setAgreementFile] = useState(null);
  const [ownerPayments, setOwnerPayments] = useState([{}]);
  const [tenantPayments, setTenantPayments] = useState([{}]);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [autoFilledClients, setAutoFilledClients] = useState({ lead: false, owner: false, tenant: false });

  const clientTypeOptions = ["OWNER", "TENANT", "AGENT"];
  const leadSourceOptions = ["ONLINE", "CALL", "EXCEL", "REFERENCE", "SHOP"];
  const [leadStatusOptions, setLeadStatusOptions] = useState([]);
  const modeOfPaymentOptions = ["CASH", "ONLINE", "CHEQUE"];

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from, { state: { filters: location.state.filters } });
    } else {
      navigate(-1); // Fallback
    }
  };


  // Fetch clients
  useEffect(() => {
    if (keycloak?.token) {
      fetch(Api.CLIENT_DROPDOWN, {
        headers: { "Authorization": `Bearer ${keycloak.token}` }
      })
        .then(res => res.json())
        .then(data => setClients(data))
        .catch(err => console.error("Failed to fetch clients", err));

      // Fetch Lead Statuses
      fetch(`${Api.BASE_URL}leads/lead-status`, {
        headers: {
          "Authorization": `Bearer ${keycloak.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const options = data.map(s => ({ id: s.key || s.name, name: s.value || s.label || s.toString() }));
          setLeadStatusOptions(options);
        })
        .catch((err) => console.error("Failed to fetch lead statuses", err));

      // Fetch Agreement Statuses
      fetch(`${Api.BASE_URL}agreements/agreement-status`, {
        headers: {
          "Authorization": `Bearer ${keycloak.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAgreementStatusOptions(data);
        })
        .catch((err) => console.error("Failed to fetch agreement statuses", err));

      // Fetch Back Office Statuses
      fetch(`${Api.BASE_URL}agreements/back-office-status`, {
        headers: {
          "Authorization": `Bearer ${keycloak.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setBackOfficeStatusOptions(data);
        })
        .catch((err) => console.error("Failed to fetch back office statuses", err));

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

  useEffect(() => {
    const totalAgreement = parseFloat(formData.totalAmount) || 0;
    const commission = parseFloat(formData.commissionAmount) || 0;
    const grandTotal = totalAgreement + commission;

    const totalOwnerPaid = ownerPayments.reduce((acc, p) => acc + (parseFloat(p.paymentAmount) || 0), 0);
    const totalTenantPaid = tenantPayments.reduce((acc, p) => acc + (parseFloat(p.paymentAmount) || 0), 0);

    const totalPaid = totalOwnerPaid + totalTenantPaid;
    setTotalAmountReceived(totalPaid);
    setOutstandingAmount(grandTotal - totalPaid);
  }, [formData.totalAmount, formData.commissionAmount, ownerPayments, tenantPayments]);

  const handlePaymentChange = (index, field, value, type) => {
    const payments = type === 'owner' ? [...ownerPayments] : [...tenantPayments];
    const setPayments = type === 'owner' ? setOwnerPayments : setTenantPayments;
    payments[index][field] = value;
    setPayments(payments);
  };

  const addPaymentEntry = (type) => {
    const setter = type === 'owner' ? setOwnerPayments : setTenantPayments;
    setter(prev => [...prev, {}]);
  };

  const removePaymentEntry = (index, type) => {
    const payments = type === 'owner' ? ownerPayments : tenantPayments;
    const setPayments = type === 'owner' ? setOwnerPayments : setTenantPayments;
    if (payments.length > 1) {
      const newPayments = payments.filter((_, i) => i !== index);
      setPayments(newPayments);
    }
  };


  // Utility to check if a field should be editable in ‘edit’ mode
  const isEditable = field => {
    if (mode !== 'edit') return true;
    const editableFields = [
      // Lead,
      "tentativeAgreementDate", "visitAddress", "cityId", "areaId", "leadSource",
      "description", "appointmentTime", "referenceName", "referenceNumber", "amount",
      "lastFollowUpDate", "nextFollowUpDate", "backOfficeStatus",
      // Agreement,
      "tokenNumber", "agreementStartDate", "agreementEndDate", "addressLine1", "addressLine2", "agreementStatus", "agreementFile",
      // Payment Part A
      "totalAmount", "commissionAmount",
      "ownerPaymentDate", "ownerPaymentAmount", "ownerModeOfPayment", "ownerPayerName",
      "tenantPaymentDate", "tenantPaymentAmount", "tenantModeOfPayment", "tenantPayerName",
      "paymentDescription",
      // Payment Part B
      "govtGrnDate", "grnNumber", "grnAmount",
      "dhcDate", "dhcNumber", "dhcAmount", "leadStatus",
      "commissionDate", "commissionName", "commissionAmount",
      "firstName", "lastName", "clientType", "contactNumber", "email",
      "ownerFirstName", "ownerLastName", "ownerEmail", "ownerContact", "ownerAadhar", "ownerPan",
      "tenantFirstName", "tenantLastName", "tenantEmail", "tenantContact", "tenantAadhar", "tenantPan"
    ];
    return editableFields.includes(field);
  };

  // Input and Dropdown render helpers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "cityId") {
      fetchDropdowns(value);
    }
  };

  const isClientFieldLocked = (field) => {
    if (autoFilledClients.lead && ["firstName", "lastName", "clientType", "contactNumber", "email"].includes(field)) return true;
    if (autoFilledClients.owner && ["ownerFirstName", "ownerLastName", "ownerEmail", "ownerContact", "ownerAadhar", "ownerPan"].includes(field)) return true;
    if (autoFilledClients.tenant && ["tenantFirstName", "tenantLastName", "tenantEmail", "tenantContact", "tenantAadhar", "tenantPan"].includes(field)) return true;
    return false;
  };

  const handleLockedFieldClick = () => {
    alert("This is client's master data. To edit, please go to the Data Management tab or create a new client.");
  };

const renderInput = (label, placeholder, field, onChange, value) => {
  // ✅ Add a safety check to prevent startsWith() errors
  if (!field || typeof field !== "string") {
    console.warn("renderInput called with invalid field:", field);
    return null;
  }

  const locked = isClientFieldLocked(field);
  let editableCheckField = field;

  if (field?.startsWith?.("owner-") || field?.startsWith?.("tenant-")) {
    const parts = field.split("-");
    const type = parts[0]; // owner or tenant
    const fieldNameParts = parts.slice(1, -1); // e.g., ['payment', 'Amount']
    const capitalizedFieldName = fieldNameParts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    editableCheckField = `${type}${capitalizedFieldName}`; // e.g., ownerPaymentAmount
  }

  const readOnly = mode === "view" || !isEditable(editableCheckField) || locked;

  return (
    <div>
      <label htmlFor={field}>{label}</label>
      <input
        type={
          ["contactNumber", "referenceNumber", "ownerContact", "tenantContact"].includes(field)
            ? "tel"
            : "text"
        }
        maxLength={
          ["contactNumber", "referenceNumber", "ownerContact", "tenantContact"].includes(field)
            ? 10
            : undefined
        }
        placeholder={placeholder}
        value={value !== undefined ? value : formData[field] || ""}
        onChange={
          readOnly
            ? () => {}
            : onChange ||
              ((e) => {
                let newValue = e.target.value;
                if (
                  ["contactNumber", "referenceNumber", "ownerContact", "tenantContact"].includes(
                    field
                  )
                ) {
                  newValue = newValue.replace(/[^0-9]/g, "").slice(0, 10);
                }
                handleInputChange(field, newValue);
              })
        }
        readOnly={readOnly}
        onClick={locked ? handleLockedFieldClick : undefined}
        style={locked ? { backgroundColor: "#f2f2f2", cursor: "not-allowed" } : {}}
      />
    </div>
  );
};


  const renderDropdown = (label, field, options, onChange, value) => {
    const selectOptions = options.map(opt =>
      typeof opt === 'string'
        ? { value: opt, label: opt }
        : { value: opt.id || opt.name, label: opt.name }
    );

    const currentValue = selectOptions.find(
      (opt) => opt.value === (value !== undefined ? value : formData[field])
    );

    let editableCheckField = field;
    if (field.startsWith('owner-') || field.startsWith('tenant-')) {
      const parts = field.split('-');
      const type = parts[0]; // owner
      const fieldName = parts.slice(1, -1).join('');
      editableCheckField = `${type}${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`; 
    }

    return (
      <div>
        <label>{label}</label>
        <Select
          options={selectOptions}
          placeholder={`Select ${label}`}
          isClearable
          isSearchable
          isDisabled={mode === "view" || !isEditable(editableCheckField) || isClientFieldLocked(field)}
          value={currentValue}
          onChange={onChange ? (selected) => onChange(selected?.value || null) : (selected) => handleInputChange(field, selected?.value || null)}
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9998 }),
            control: (provided) => ({
              ...provided,
              minWidth: "200px",
              border: '1px solid #ccc',
              boxShadow: 'none',
              '&:hover': {
                borderColor: '#888'
              }
            }),
          }}
        />
      </div>
    );
  };

  const renderFileInput = (label, field) => {
    // Determine the file name to display
    let fileName = agreementFile ? agreementFile.name : (formData.fileUrl ? formData.fileUrl.split('/').pop() : '');

    const handleRemoveFile = () => {
      setAgreementFile(null); // Clear newly selected file
      handleInputChange('fileUrl', ''); // Clear existing file URL
    };

    return (
      <div>
        <label>{label}</label>
        <div className="file-input-wrapper">
          {fileName && mode !== 'view' ? (
            // If a file exists (new or old) and not in view mode, show its name and a remove button
            <div className="file-display">
              <a href={agreementFile ? URL.createObjectURL(agreementFile) : formData.fileUrl} target="_blank" rel="noopener noreferrer" className="view-file-link">
                {fileName}
              </a>
              <FaTimes
                className="remove-file-icon"
                onClick={handleRemoveFile}
              />
            </div>
          ) : fileName && mode === 'view' ? (
            // If a file exists and in view mode, just show the link
            <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="view-file-link">{fileName}</a>
          ) : (
            // If no file exists and not in view mode, show the file input
            <input
              type="file"
              id={field}
              disabled={!isEditable(field)}
              onChange={e => setAgreementFile(e.target.files ? e.target.files[0] : null)}
            />
          )}
        </div>
      </div>
    );
  };


  // Conditional dropdown for existing clients
  const renderClientDropdown = type => {
    if (mode === 'view') return null;

    const clientOptions = clients.map((client) => ({
      value: client.id,
      label: client.name,
    }));

    return (
      <Select
        options={clientOptions}
        placeholder="Select Existing Client"
        isClearable
        isSearchable
        onChange={(selected) => fetchAndAutofillClient(selected?.value || null, type)}
        styles={{
          menu: (provided) => ({ ...provided, zIndex: 9999, minWidth: "250px" }),
          menuList: (provided) => ({ ...provided, maxHeight: "200px" }),
          control: (provided) => ({ ...provided, minWidth: "250px" }),
        }}
      />
    );
  };

  const fetchAndAutofillClient = (clientId, type) => {
    if (!clientId) {
      setAutoFilledClients(prev => ({ ...prev, [type]: false }));
      if (type === "lead") {
        setFormData(prev => ({ ...prev, firstName: '', lastName: '', email: '', contactNumber: '', clientType: '' }));
      } else if (type === "owner") {
        setFormData(prev => ({ ...prev, ownerFirstName: '', ownerLastName: '', ownerEmail: '', ownerContact: '', ownerAadhar: '', ownerPan: '' }));
      } else if (type === "tenant") {
        setFormData(prev => ({ ...prev, tenantFirstName: '', tenantLastName: '', tenantEmail: '', tenantContact: '', tenantAadhar: '', tenantPan: '' }));
      }
      return;
    }

    setAutoFilledClients(prev => ({ ...prev, [type]: true }));

    fetch(`${Api.BASE_URL}clients/${clientId}`, {
      headers: { Authorization: `Bearer ${keycloak.token}` }
    })
      .then(res => res.json())
      .then(client => {
        const base = {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          contactNumber: client.phoneNo,
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
    if ((mode === "edit" || mode === "view") && id) {
      axios.get(`${Api.BASE_URL}leads/${id}`, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      })
        .then(resp => {
          const data = resp.data;
          setLeadId(data.id); // Already set from URL, but good to confirm
          setFormData({
            firstName: data.client?.firstName || "",
            lastName: data.client?.lastName || "",
            contactNumber: data.client?.phoneNo || "",
            email: data.client?.email || "",
            leadStatus: data.leadStatus || "",
            cancellationReason: data.cancellationReason || "",
            clientType: data.client?.clientType || "",
            tentativeAgreementDate: data.tentativeAgreementDate ? format(new Date(data.tentativeAgreementDate), 'yyyy-MM-dd') : null, // Corrected format
            leadSource: data.leadSource || null,
            description: data.description || "",
            appointmentTime: data.appointmentTime ? new Date(data.appointmentTime) : null,
            referenceName: data.referenceName || "",
            referenceNumber: data.referenceNumber || "",
            amount: data.amount || "",
            lastFollowUpDate: data.lastFollowUpDate ? new Date(data.lastFollowUpDate) : null,
            nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null,
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
            agreementStartDate: data.agreement?.agreementStartDate ? new Date(data.agreement.agreementStartDate) : null,
            agreementEndDate: data.agreement?.agreementEndDate ? new Date(data.agreement.agreementEndDate) : null,
            agreementStatus: data.agreement?.status || "",
            backOfficeStatus: data.agreement?.backOfficeStatus || "",
            fileUrl: data.agreement?.fileUrl || "",
            addressLine1: data.agreement?.addressLine1 || "",
            addressLine2: data.agreement?.addressLine2 || "",
            // Payment
            paymentId: data.payment?.id || null,
            totalAmount: data.payment?.totalAmount || "",
            grnNumber: data.payment?.grnNumber || "",
            govtGrnDate: data.payment?.govtGrnDate ? new Date(data.payment.govtGrnDate) : null,
            grnAmount: data.payment?.grnAmount || "",
            dhcDate: data.payment?.dhcDate ? new Date(data.payment.dhcDate) : null,
            dhcAmount: data.payment?.dhcAmount || "",
            dhcNumber: data.payment?.dhcNumber || "",
            commissionDate: data.payment?.commissionDate ? new Date(data.payment.commissionDate) : null,
            commissionName: data.payment?.commissionName || "",
            commissionAmount: data.payment?.commissionAmount || "",
            paymentDescription: data.payment?.description || "",
          });

          if (data.payment?.paymentDetails) {
            const ownerPays = data.payment.paymentDetails.filter(p => p.clientType === 'OWNER').map(p => ({ ...p, paymentDate: p.paymentDate ? new Date(p.paymentDate) : null }));
            const tenantPays = data.payment.paymentDetails.filter(p => p.clientType === 'TENANT').map(p => ({ ...p, paymentDate: p.paymentDate ? new Date(p.paymentDate) : null }));
            setOwnerPayments(ownerPays.length > 0 ? ownerPays : [{}]);
            setTenantPayments(tenantPays.length > 0 ? tenantPays : [{}]);
          }

          fetchDropdowns(data.city?.id);
        })
        .catch(err => console.error("Error fetching lead details:", err));
    }
  }, [mode, id, keycloak.token]);

  // Save methods (same as in AddLeadPage)
  const handleSaveLead = () => {
    const payload = {
      id: leadId,
      tentativeAgreementDate: formData.tentativeAgreementDate ? format(new Date(formData.tentativeAgreementDate), 'yyyy-MM-dd') : null,
      visitAddress: formData.visitAddress,
      leadSource: formData.leadSource,
      description: formData.description,
      leadStatus: formData.leadStatus,
      appointmentTime: formData.appointmentTime ? format(new Date(formData.appointmentTime), "yyyy-MM-dd'T'HH:mm:ss") : null,
      referenceName: formData.referenceName,
      referenceNumber: formData.referenceNumber,
      amount: formData.amount,
      lastFollowUpDate: formData.lastFollowUpDate ? format(new Date(formData.lastFollowUpDate), 'yyyy-MM-dd') : null,
      nextFollowUpDate: formData.nextFollowUpDate ? format(new Date(formData.nextFollowUpDate), 'yyyy-MM-dd') : null,
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

  const handleSaveAgreement = async () => {
    const agreementData = {
      leadId,
      tokenNo: formData.tokenNumber,
      agreementStartDate: formData.agreementStartDate ? format(new Date(formData.agreementStartDate), 'yyyy-MM-dd') : null,
      agreementEndDate: formData.agreementEndDate ? format(new Date(formData.agreementEndDate), 'yyyy-MM-dd') : null,
      status: formData.agreementStatus,
      backOfficeStatus: formData.backOfficeStatus,
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
    const payload = new FormData();
    payload.append('agreement', new Blob([JSON.stringify(agreementData)], { type: 'application/json' }));
    if (agreementFile) {
      payload.append('file', agreementFile);
    }

    try {
      const response = await fetch(`${Api.BASE_URL}agreements`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${keycloak.token}`,
          "accept": "*/*"
        },
        body: payload
      });
      if (!response.ok) throw new Error("Failed to save agreement");
      await response.json();
      alert("Agreement saved successfully!");
      setActiveTab("payment");
    } catch (err) {
      console.error("Agreement Save Error:", err);
      alert("Error saving agreement. Please try again.");
    }
  };

  const handleSavePayment = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const allPaymentDetails = [
      ...ownerPayments.filter(p => p.paymentAmount).map(p => ({ ...p, clientType: 'OWNER' })),
      ...tenantPayments.filter(p => p.paymentAmount).map(p => ({ ...p, clientType: 'TENANT' }))
    ];

    const formattedDetails = allPaymentDetails.map(detail => ({
      ...detail,
      paymentDate: detail.paymentDate ? format(new Date(detail.paymentDate), 'yyyy-MM-dd') : null,
    }));

    const totalAgreement = parseFloat(formData.totalAmount) || 0; // This is the agreement amount
    const commission = parseFloat(formData.commissionAmount) || 0;

    const paymentData = {
      leadId,
      id: formData.paymentId, // Include payment ID for updates
      totalAmount: totalAgreement,
      grnNumber: formData.grnNumber,
      govtGrnDate: formData.govtGrnDate ? format(new Date(formData.govtGrnDate), 'yyyy-MM-dd') : null,
      grnAmount: formData.grnAmount, // Correct
      dhcDate: formData.dhcDate ? format(new Date(formData.dhcDate), 'yyyy-MM-dd') : null, // Corrected format
      dhcAmount: formData.dhcAmount,
      dhcNumber: formData.dhcNumber,
      commissionDate: formData.commissionDate ? format(new Date(formData.commissionDate), 'yyyy-MM-dd') : null, // Added
      commissionName: formData.commissionName,
      commissionAmount: formData.commissionAmount,
      description: formData.paymentDescription,
      paymentDetails: formattedDetails
    };

    fetch(`${Api.BASE_URL}payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${keycloak.token}`
      },
      body: JSON.stringify(paymentData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save payment");
        return res.json();
      })
      .then((data) => {
        alert("Payment saved successfully!");
        setFormData(prev => ({ ...prev, paymentId: data.id })); // Store the payment ID after save
      })
      .catch(err => {
        console.error("Payment Save Error:", err);
        alert("Error saving payment. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
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
            {renderInput("First Name", "First Name", "firstName")}
            {renderInput("Last Name", "Last Name", "lastName")}
            {renderDropdown("Client Type", "clientType", clientTypeOptions)}
            {renderInput("Contact Number", "Contact Number", "contactNumber")}
            {renderInput("Email", "Email", "email")}
            {renderDropdown("Lead Source", "leadSource", ["ONLINE", "CALL", "EXCEL", "REFERENCE", "SHOP"])}
            {renderDropdown("Lead Status", "leadStatus", leadStatusOptions)}
            <CustomDatePicker
              label="Tentative Agreement Date"
              placeholderText="dd-MM-yyyy"
              value={formData.tentativeAgreementDate}
              onChange={date => handleInputChange('tentativeAgreementDate', date)}
              dateFormat="dd-MM-yyyy"
              readOnly={mode === 'view' || !isEditable('tentativeAgreementDate')}
            />
            <CustomDateTimePicker
              label="Appointment Time"
              placeholder="dd-MM-yyyy h:mm aa"
              value={formData.appointmentTime}
              onChange={(date) => handleInputChange("appointmentTime", date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd-MM-yyyy h:mm aa"
              readOnly={mode === "view"}
            />
            {renderInput("Visit Address", "Visit Address", "visitAddress")}
            {renderInput("Description", "Description", "description")}
            {renderInput("Reference Name", "Reference Name", "referenceName")}
            {renderInput("Reference Number", "Reference Number", "referenceNumber")}
            {renderInput("Amount", "Amount", "amount")}
            {renderDropdown("City", "cityId", cityOptions)}
            {renderDropdown("Area", "areaId", areaOptions)}
            <CustomDatePicker
              label="Last FollowUp Date"
              placeholderText="dd-MM-yyyy"
              value={formData.lastFollowUpDate}
              onChange={(date) => handleInputChange('lastFollowUpDate', date)}
              readOnly={mode === 'view' || !isEditable('lastFollowUpDate')}
              dateFormat="dd-MM-yyyy"
            />
            <CustomDatePicker
              label="Next FollowUp Date"
              placeholderText="dd-MM-yyyy"
              value={formData.nextFollowUpDate}
              readOnly={mode === 'view' || !isEditable('nextFollowUpDate')}
              onChange={(date) => handleInputChange('nextFollowUpDate', date)}
              dateFormat="dd-MM-yyyy"
            />
            {formData.cancellationReason && renderInput("Cancellation Reason", "cancellationReason")}
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
            {renderInput("Owner Firstname", "Owner Firstname", "ownerFirstName")}
            {renderInput("Owner Last Name", "Owner Last Name", "ownerLastName")}
            {renderInput("Owner Email", "Owner Email", "ownerEmail")}
            {renderInput("Owner Contact", "Owner Contact", "ownerContact")}
            {renderInput("Owner Aadhar Number", "Owner Aadhar Number", "ownerAadhar")}
            {renderInput("Owner PAN Number", "Owner PAN Number", "ownerPan")}
          </div>
          <h3 className="agreement-heading">Tenant</h3>
          {renderClientDropdown('tenant')}
          <div className="form-grid">
            {renderInput("Tenant Firstname", "Tenant Firstname", "tenantFirstName")}
            {renderInput("Tenant Last Name", "Tenant Last Name", "tenantLastName")}
            {renderInput("Tenant Email", "Tenant Email", "tenantEmail")}
            {renderInput("Tenant Contact", "Tenant Contact", "tenantContact")}
            {renderInput("Tenant Aadhar Number", "Tenant Aadhar Number", "tenantAadhar")}
            {renderInput("Tenant PAN Number", "Tenant PAN Number", "tenantPan")}
          </div>
          <h3 className="agreement-heading">Agreement Details</h3>
          <div className="form-grid">
            {renderInput("Token Number", "Token Number", "tokenNumber")}
            <CustomDatePicker
              label="Agreement Start Date"
              placeholderText="dd-MM-yyyy"
              value={formData.agreementStartDate}
              onChange={date => handleInputChange('agreementStartDate', date)}
              dateFormat="dd-MM-yyyy"
              readOnly={mode === 'view' || !isEditable('agreementStartDate')}
            />
            <CustomDatePicker
              label="Agreement End Date"
              placeholderText="dd-MM-yyyy"
              value={formData.agreementEndDate}
              onChange={date => handleInputChange('agreementEndDate', date)}
              dateFormat="dd-MM-yyyy" // Correct
              readOnly={mode === 'view' || !isEditable('agreementEndDate')}
            />
            {renderInput("Address Line 1", "addressLine1")}
            {renderInput("Address Line 2", "addressLine2")}
            {renderDropdown(
              "Agreement Status",
              "agreementStatus",
              Array.isArray(agreementStatusOptions) ? agreementStatusOptions.map(s => ({ id: s.key, name: s.value })) : []
            )}
            {renderDropdown(
              "Back Office Status",
              "backOfficeStatus",
              Array.isArray(backOfficeStatusOptions) ? backOfficeStatusOptions.map(s => ({ id: s.key, name: s.value })) : []
            )}
            {renderFileInput("Agreement File", "agreementFile")}

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
          {formData.tokenNumber && (
            <h3 className="payment-token-title">
              Payment Details ({formData.tokenNumber})
            </h3>
          )}
          <div className="payment-section">
            <div className="payment-part-a">
              <div className="form-grid payment-grid-top">
                {renderInput("Total Agreement Amount", "e.g., 3000", "totalAmount")}
                {renderInput("Commission Amount", "e.g., 500", "commissionAmount")}
                <div>
                  <label>Outstanding Amount</label>
                  <input value={outstandingAmount.toFixed(2)} readOnly className="outstanding-amount" />
                </div>
              </div>

              <div className="payment-details-section">
                <h4>Owner Payments</h4>
                {ownerPayments.map((p, index) => (
                  <div key={index} className="payment-entry-grid">
                  <CustomDatePicker // Correct
                      label="Payment Date"
                      value={p.paymentDate}
                    readOnly={mode === 'view' || !isEditable('ownerPaymentDate')} // Correct
                      onChange={(date) => handlePaymentChange(index, 'paymentDate', date, 'owner')}
                    />
                    {renderInput('Amount', 'Amount', `owner-payment-amount-${index}`, (e) => handlePaymentChange(index, 'paymentAmount', e.target.value, 'owner'), p.paymentAmount)}
                    {renderDropdown('Mode', `owner-modeOfPayment-${index}`, modeOfPaymentOptions, (val) => handlePaymentChange(index, 'modeOfPayment', val, 'owner'), p.modeOfPayment)}
                    {renderInput('Payer Name', 'Payer Name', `owner-payerName-${index}`, (e) => handlePaymentChange(index, 'payerName', e.target.value, 'owner'), p.payerName)}
                    {mode === 'edit' && ownerPayments.length > 1 && (
                      <button type="button" className="remove-payment-btn" onClick={() => removePaymentEntry(index, 'owner')}>
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                {mode === 'edit' && <button className="add-more-btn" onClick={() => addPaymentEntry('owner')}>+ Add Owner Payment</button>}
              </div>

              <div className="payment-details-section">
                <h4>Tenant Payments</h4>
                {tenantPayments.map((p, index) => (
                  <div key={index} className="payment-entry-grid">
                    <CustomDatePicker
                      label="Payment Date"
                      value={p.paymentDate}
                      readOnly={mode === 'view' || !isEditable('tenantPaymentDate')}
                      onChange={(date) => handlePaymentChange(index, 'paymentDate', date, 'tenant')}
                    />
                    {renderInput('Amount', 'Amount', `tenant-payment-amount-${index}`, (e) => handlePaymentChange(index, 'paymentAmount', e.target.value, 'tenant'), p.paymentAmount)}
                    {renderDropdown('Mode', `tenant-modeOfPayment-${index}`, modeOfPaymentOptions, (val) => handlePaymentChange(index, 'modeOfPayment', val, 'tenant'), p.modeOfPayment)}
                    {renderInput('Payer Name', 'Payer Name', `tenant-payerName-${index}`, (e) => handlePaymentChange(index, 'payerName', e.target.value, 'tenant'), p.payerName)}
                    {mode === 'edit' && tenantPayments.length > 1 && (
                      <button type="button" className="remove-payment-btn" onClick={() => removePaymentEntry(index, 'tenant')}>
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                {mode === 'edit' && <button className="add-more-btn" onClick={() => addPaymentEntry('tenant')}>+ Add Tenant Payment</button>}
              </div>
              <div>
                <label>Total Amount Received</label>
                <input value={totalAmountReceived.toFixed(2)} readOnly className="total-received-amount" />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  placeholder="Add any payment related notes here..."
                  value={formData.paymentDescription || ''}
                  readOnly={mode === 'view' || !isEditable('paymentDescription')}
                  onChange={e => handleInputChange('paymentDescription', e.target.value)}
                  rows="3"
                />
              </div>
            </div>

            <div className="payment-part-b">
              <h4>Back Work Account</h4>
              <div className="form-grid payment-grid-bottom">
                <CustomDatePicker
                  label="Govt GRN Date"
                  value={formData.govtGrnDate}
                  readOnly={mode === 'view' || !isEditable('govtGrnDate')}
                  onChange={date => handleInputChange('govtGrnDate', date)} // Correct
                />
                {renderInput("GRN Number", "GRN Number", "grnNumber", (e) => handleInputChange('grnNumber', e.target.value))}
                {renderInput("GRN Amount", "GRN Amount", "grnAmount", (e) => handleInputChange('grnAmount', e.target.value))}
                <CustomDatePicker
                  label="DHC Date"
                  value={formData.dhcDate}
                  readOnly={mode === 'view' || !isEditable('dhcDate')}
                  onChange={date => handleInputChange('dhcDate', date)}
                />
                {renderInput("DHC Number", "DHC Number", "dhcNumber", (e) => handleInputChange('dhcNumber', e.target.value))}
                {renderInput("DHC Amount", "DHC Amount", "dhcAmount", (e) => handleInputChange('dhcAmount', e.target.value))}
                <CustomDatePicker
                  label="Commission Date"
                  value={formData.commissionDate}
                  readOnly={mode === 'view' || !isEditable('commissionDate')}
                  onChange={date => handleInputChange('commissionDate', date)}
                />
                {renderInput("Commission Name", "Commission Name", "commissionName", (e) => handleInputChange('commissionName', e.target.value))}
                {renderInput("Commission Amount", "Commission Amount", "commissionAmount", (e) => handleInputChange('commissionAmount', e.target.value))}
              </div>
            </div>
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
        <Header title={mode === 'view' ? 'Lead Details' : 'Edit Lead'} onBack={handleBack} />
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
