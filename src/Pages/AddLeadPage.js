
import React, { useState, useEffect } from 'react';
import Slider from "./Slider";
import Header from "./Header.js";
import './AddLead.css';
import AddClient from "./AddClient.js";
import { useKeycloak } from "@react-keycloak/web";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import CustomDatePicker from '../common/CustomDatePicker.js';
import CustomDateTimePicker from '../common/CustomDateTimePicker.js';
import Select from "react-select";




import Api from './Api.js';


const AddLeadPage = ({
  showLead = true,
  showClient = true,
  showPayment = true,

}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const id = queryParams.get("id");
  const [leadId, setLeadId] = useState(null);
  const defaultTab = showLead ? 'lead' : showClient ? 'client' : 'payment';
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({
    cityId: "",
    areaId: "",
  });
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null); // <--- New
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clientTypeOptions = ["OWNER", "TENANT", "AGENT"];
  const leadSourceOptions = ["ONLINE", "CALL", "EXCEL", "REFERENCE", "SHOP"];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { keycloak } = useKeycloak();
  const transitLevel = location.state?.transitLevel;
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [agreementStatusOptions, setAgreementStatusOptions] = useState([]);
  const [backOfficeStatusOptions, setBackOfficeStatusOptions] = useState([]);
  const [leadStatusOptions, setLeadStatusOptions] = useState([]);
  const [agreementFile, setAgreementFile] = useState(null);
  const [ownerPayments, setOwnerPayments] = useState([{}]);
  const [tenantPayments, setTenantPayments] = useState([{}]);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [autoFilledClients, setAutoFilledClients] = useState({ lead: false, owner: false, tenant: false });
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);

  const modeOfPaymentOptions = ["CASH", "ONLINE", "CHEQUE"];



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

    // Fetch Lead Statuses
    if (keycloak?.token) {
      fetch(`${Api.BASE_URL}leads/lead-status`, {
        headers: {
          "Authorization": `Bearer ${keycloak.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // Map response to { id, name } format expected by renderDropdown
          const options = data.map(s => ({ id: s.key || s.name, name: s.value || s.label || s.toString() }));
          setLeadStatusOptions(options);
        })
        .catch((err) => console.error("Failed to fetch lead statuses", err));
    }

    // Fetch Agreement Statuses
    if (keycloak?.token) {
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
    }

    // Fetch Back Office Statuses
    if (keycloak?.token) {
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

  const handleAcceptLead = (lead) => {
    navigate("/add-Executive-details");   // navigate to AddLeadPage
  };

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from, { state: { filters: location.state.filters } });
    } else {
      navigate(-1); // Fallback
    }
  };


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    if (type === 'owner') {
      const newPayments = [...ownerPayments];
      newPayments[index][field] = value;
      setOwnerPayments(newPayments);
    } else if (type === 'tenant') {
      const newPayments = [...tenantPayments];
      newPayments[index][field] = value;
      setTenantPayments(newPayments);
    }
  };

  const removePaymentEntry = (index, type) => {
    if (type === 'owner') {
      if (ownerPayments.length > 1) {
        const newPayments = ownerPayments.filter((_, i) => i !== index);
        setOwnerPayments(newPayments);
      }
    } else if (type === 'tenant') {
      if (tenantPayments.length > 1) {
        const newPayments = tenantPayments.filter((_, i) => i !== index);
        setTenantPayments(newPayments);
      }
    }
  };
  const handleCityInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      console.log("Updated formData:", updated);
      return updated;
    });


    if (field === "cityId") {
      fetchDropdowns(value);
    }
  };

  const handleSaveLead = () => {
    console.log("formData before save:", formData);
    console.log("Accessing areaId directly:", formData.areaId);
    const requestBody = {      
      tentativeAgreementDate: formData.tentativeAgreementDate ? format(new Date(formData.tentativeAgreementDate), 'yyyy-MM-dd') : null, // Corrected format
      visitAddress: formData.visitAddress,
      id: leadId,
      transitLevel: transitLevel,
      leadSource: formData.leadSource,
      description: formData.description,
      appointmentTime: formData.appointmentTime ? format(new Date(formData.appointmentTime), "yyyy-MM-dd'T'HH:mm:ss") : null,
      referenceNumber: formData.referenceNumber,
      referenceName: formData.referenceName,
      amount: formData.amount,
      leadStatus: formData.leadStatus,
      lastFollowUpDate: formData.lastFollowUpDate ? format(new Date(formData.lastFollowUpDate), 'yyyy-MM-dd') : null, // Corrected format
      nextFollowUpDate: formData.nextFollowUpDate ? format(new Date(formData.nextFollowUpDate), 'yyyy-MM-dd') : null, // Corrected format


      city: {
        id: formData.cityId || null
      },

      area: {
        id: formData.areaId || null

      },
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
    console.log("Final payload:", requestBody);
  };

  const handleSaveAgreement = () => {
    const formDataPayload = new FormData();

    const agreementData = {
      leadId,
      tokenNo: formData.tokenNumber,
      agreementStartDate: formData.agreementStartDate ? format(new Date(formData.agreementStartDate), 'yyyy-MM-dd') : null,
      agreementEndDate: formData.agreementEndDate ? format(new Date(formData.agreementEndDate), 'yyyy-MM-dd') : null,
      area: { id: formData.areaId || null },
      status: formData.agreementStatus,
      backOfficeStatus: formData.backOfficeStatus,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      tenant: {
        firstName: formData.tenantFirstName,
        lastName: formData.tenantLastName,
        clientType: "TENANT",
        email: formData.tenantEmail,
        phoneNo: formData.tenantContact,
        aadharNumber: formData.tenantAadhar,
        panNumber: formData.tenantPan,
      },
      owner: {
        firstName: formData.ownerFirstName,
        lastName: formData.ownerLastName,
        clientType: "OWNER",
        email: formData.ownerEmail,
        phoneNo: formData.ownerContact,
        aadharNumber: formData.ownerAadhar,
        panNumber: formData.ownerPan,
      }
    };

    formDataPayload.append('agreement', new Blob([JSON.stringify(agreementData)], { type: 'application/json' }));

    if (agreementFile) {
      formDataPayload.append('file', agreementFile);
    }

    fetch("https://legalwingcrm.in:8081/legal-wings-management/agreements", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Authorization": `Bearer ${keycloak.token}`
      },
      body: formDataPayload
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

    const allPaymentDetails = [
      ...ownerPayments.filter(p => p.paymentAmount).map(p => ({ ...p, clientType: 'OWNER' })),
      ...tenantPayments.filter(p => p.paymentAmount).map(p => ({ ...p, clientType: 'TENANT' }))
    ];

    // Format dates before sending
    const formattedDetails = allPaymentDetails.map(detail => ({
      ...detail,
      paymentDate: detail.paymentDate ? format(new Date(detail.paymentDate), 'yyyy-MM-dd') : null,
    }));

    const totalAgreement = parseFloat(formData.totalAmount) || 0; // This is the agreement amount
    const commission = parseFloat(formData.commissionAmount) || 0;

    const paymentData = {
      leadId,
      id: formData.paymentId, // Include payment ID for updates
      totalAmount: totalAgreement, // The main payment object's totalAmount is just the agreement amount
      grnNumber: formData.grnNumber,
      govtGrnDate: formData.govtGrnDate ? format(new Date(formData.govtGrnDate), 'yyyy-MM-dd') : null, // Correct
      dhcDate: formData.dhcDate ? format(new Date(formData.dhcDate), 'yyyy-MM-dd') : null, // Corrected format
      dhcAmount: formData.dhcAmount,
      grnAmount: formData.grnAmount,
      dhcNumber: formData.dhcNumber,
      commissionDate: formData.commissionDate ? format(new Date(formData.commissionDate), 'yyyy-MM-dd') : null,
      commissionAmount: commission,
      commissionName: formData.commissionName,
      description: formData.paymentDescription,
      paymentDetails: formattedDetails
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
        setFormData(prev => ({ ...prev, paymentId: data.id })); // Store the payment ID after save
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
    if (!clientId) {
      // Clear fields and reset autofill status if client is deselected
      setAutoFilledClients(prev => ({ ...prev, [type]: false }));
      if (type === 'lead') {
        setFormData(prev => ({ ...prev, firstName: '', lastName: '', clientType: '', email: '', contactNumber: '' }));
      } else if (type === 'owner') {
        setFormData(prev => ({ ...prev, ownerFirstName: '', ownerLastName: '', ownerEmail: '', ownerContact: '', ownerAadhar: '', ownerPan: '' }));
      } else if (type === 'tenant') {
        setFormData(prev => ({ ...prev, tenantFirstName: '', tenantLastName: '', tenantEmail: '', tenantContact: '', tenantAadhar: '', tenantPan: '' }));
      }
      setSelectedClientId(null);
      return;
    }

    setSelectedClientId(clientId); // <--- New

    // Set autofill status to true for the given type
    setAutoFilledClients(prev => ({ ...prev, [type]: true }));

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


  const renderClientDropdown = (type) => {
    if (mode === "view") return null;

    const clientOptions = clients.map((client) => ({
      value: client.id,
      label: client.name, // you might want firstName + lastName instead
    }));

    return (
      <Select
        options={clientOptions}
        placeholder="Select Existing Client"
        isClearable
        isSearchable
        onChange={(selected) =>
          fetchAndAutofillClient(selected?.value || null, type)
        }
        styles={{
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,        // keeps it above other elements
            minWidth: "250px",   // ensures suggestions don’t shrink
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: "200px",  // makes list scrollable instead of shrinking
          }),
          control: (provided) => ({
            ...provided,
            minWidth: "250px",   // ensures input is wide enough
          }),
        }}
      />
    );
  };


  const fetchDropdowns = async (selectedCityId = null, selectedAreaId = null) => {
    const requestBody = {
      cityIdsUi: selectedCityId ? [selectedCityId] : [],
      areaIdsUi: selectedAreaId ? [selectedAreaId] : [],
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

  const renderDropdown = (label, field, options = [], onChange, value) => {
    // Ensure options are in { value, label } format.
    // This handles both arrays of strings and arrays of objects.
    const selectOptions = options.map(opt =>
      typeof opt === 'string'
        ? { value: opt, label: opt }
        : { value: opt.id || opt.name, label: opt.name }
    );
  
    const currentValue = selectOptions.find(
      (opt) => opt.value === (value !== undefined ? value : formData[field])
    );
  
    return (
      <div>
        <label>{label}</label>
        <Select
          options={selectOptions}
          placeholder={`Select ${label}`}
          isClearable
          isSearchable
          isDisabled={mode === "view"}
          value={currentValue}
          onChange={onChange 
            ? (selected) => onChange(selected?.value || null) 
            : (selected) => handleCityInputChange(field, selected?.value || null)}
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9998 }),
            control: (provided) => ({
              ...provided,
              minWidth: "200px", // Adjust as needed
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

  const isClientFieldLocked = (field) => {
    if (autoFilledClients.lead && ["firstName", "lastName", "clientType", "contactNumber", "email"].includes(field)) return true;
    if (autoFilledClients.owner && ["ownerFirstName", "ownerLastName", "ownerEmail", "ownerContact", "ownerAadhar", "ownerPan"].includes(field)) return true;
    if (autoFilledClients.tenant && ["tenantFirstName", "tenantLastName", "tenantEmail", "tenantContact", "tenantAadhar", "tenantPan"].includes(field)) return true;
    return false;
  };

  const handleLockedFieldClick = () => {
    alert("This is client's master data. You cannot edit that from here. Go to the Data Management tab and edit from there, or create a new client.");
  };

  const renderInput = (label, placeholder, field, onChange, value) => {
    const locked = isClientFieldLocked(field);
    return (
      <div>
        <label htmlFor={field}>{label}</label>
        <input
          type={["contactNumber", "referenceNumber", "ownerContact", "tenantContact"].includes(field) ? "tel" : "text"}
          maxLength={["contactNumber", "referenceNumber", "ownerContact", "tenantContact"].includes(field) ? 10 : undefined}
          placeholder={placeholder}
          value={value !== undefined ? value : (formData[field] || '')}
          onChange={locked ? () => { } : (onChange || (e => {
            let value = e.target.value;
            if (["contactNumber", "referenceNumber", "ownerContact", "tenantContact"].includes(field)) {
              value = value.replace(/[^0-9]/g, '');
              if (value.length > 10) {
                value = value.slice(0, 10);
              }
            }
            handleInputChange(field, value);
          }))}
          readOnly={mode === 'view' || locked}
          onClick={locked ? handleLockedFieldClick : undefined}
          style={locked ? { backgroundColor: '#f2f2f2', cursor: 'not-allowed' } : {}}
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
              onChange={e => setAgreementFile(e.target.files ? e.target.files[0] : null)}
            />
          )}
        </div>
      </div>
    );
  };

  const addPaymentEntry = (type) => {
    const setter = type === 'owner' ? setOwnerPayments : setTenantPayments;
    setter(prev => [...prev, {}]);
  };

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
            leadStatus: data.leadStatus || null,
            clientType: data.client?.clientType || "",
            tentativeAgreementDate: data.tentativeAgreementDate ? new Date(data.tentativeAgreementDate) : null,
            visitAddress: data.visitAddress || "",
            description: data.description || "",
            appointmentTime: data.appointmentTime ? new Date(data.appointmentTime) : null,
            referenceNumber: data.referenceNumber || "",
            referenceName: data.referenceName || "",
            cancellationReason: data.cancellationReason || "",
            amount: data.amount || "",
            lastFollowUpDate: data.lastFollowUpDate ? new Date(data.lastFollowUpDate) : null,
            nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null,


            cityId: data.city?.id || "",
            areaId: data.area?.id || "",
            leadSource: data.leadSource || null,
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
            agreementStartDate: data.agreement?.agreementStartDate ? new Date(data.agreement.agreementStartDate) : null,
            agreementEndDate: data.agreement?.agreementEndDate ? new Date(data.agreement.agreementEndDate) : null,
            agreementStatus: data.agreement?.status || "",
            backOfficeStatus: data.agreement?.backOfficeStatus || "",
            fileUrl: data.agreement?.fileUrl || "",
            area: data.agreement?.area?.name || "",
            addressLine1: data.agreement?.addressLine1 || "",
            addressLine2: data.agreement?.addressLine2 || "",
            tokenNumber: data.agreement?.tokenNo || "",

            // Payment
            paymentId: data.payment?.id || null,
            totalAmount: data.payment?.totalAmount || "", // This might need adjustment based on logic
            grnNumber: data.payment?.grnNumber || "",
            govtGrnDate: data.payment?.govtGrnDate ? new Date(data.payment.govtGrnDate) : null,
            dhcDate: data.payment?.dhcDate ? new Date(data.payment.dhcDate) : null,
            dhcAmount: data.payment?.dhcAmount || "",
            paymentDescription: data.payment?.description || "",
            grnAmount: data.payment?.grnAmount || "",
            dhcNumber: data.payment?.dhcNumber || "",
            commissionAmount: data.payment?.commissionAmount || "",
            commissionName: data.payment?.commissionName || "",
            commissionDate: data.payment?.commissionDate ? new Date(data.payment.commissionDate) : null,
          });

          if (data.payment?.paymentDetails) {
            const ownerPays = data.payment.paymentDetails
              .filter(p => p.clientType === 'OWNER')
              .map(p => ({ ...p, paymentDate: p.paymentDate ? new Date(p.paymentDate) : null }));
            const tenantPays = data.payment.paymentDetails
              .filter(p => p.clientType === 'TENANT')
              .map(p => ({ ...p, paymentDate: p.paymentDate ? new Date(p.paymentDate) : null }));

            setOwnerPayments(ownerPays.length > 0 ? ownerPays : [{}]);
            setTenantPayments(tenantPays.length > 0 ? tenantPays : [{}]);
          }


          await fetchDropdowns(data.client?.city?.id, data.client?.area?.id);
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
              {renderDropdown("Lead Source", "leadSource", leadSourceOptions)}
              {renderDropdown("Lead Status", "leadStatus", leadStatusOptions)}
              <CustomDatePicker
                label="Tentative Agreement Date"
                placeholderText="DD-MM-YYYY"
                value={formData.tentativeAgreementDate}
                onChange={(date) => handleInputChange('tentativeAgreementDate', date)}
                readOnly={mode === 'view'}
                dateFormat="dd-MM-yyyy"
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
                placeholderText="DD-MM-YYYY"
                value={formData.lastFollowUpDate}
                onChange={(date) => handleInputChange('lastFollowUpDate', date)}
                readOnly={mode === 'view'}
                dateFormat="dd-MM-yyyy"
              />
              <CustomDatePicker
                label="Next FollowUp Date"
                placeholderText="DD-MM-YYYY"
                value={formData.nextFollowUpDate}
                readOnly={mode === 'view'}
                onChange={(date) => handleInputChange('nextFollowUpDate', date)}
                dateFormat="dd-MM-yyyy"
              />
              {mode === 'view' && formData.cancellationReason && renderInput("Cancellation Reason", "Cancellation Reason", "cancellationReason")}

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
              {renderInput("Owner LastName", "Owner LastName", "ownerLastName")}
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
              <CustomDatePicker
                label="Agreement Start Date"
                placeholderText="DD-MM-YYYY"
                value={formData.agreementStartDate}
                readOnly={mode === 'view'}
                onChange={(date) => handleInputChange('agreementStartDate', date)}
              />
              <CustomDatePicker
                label="Agreement End Date"
                placeholderText="DD-MM-YYYY"
                value={formData.agreementEndDate}
                readOnly={mode === 'view'}
                onChange={(date) => handleInputChange('agreementEndDate', date)}
              />
              {renderInput("Address Line 1", "Address Line 1", "addressLine1")}
              {renderInput("Address Line 2", "Address Line 2", "addressLine2")}
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
            {formData.tokenNumber && (
              <h3 className="payment-token-title">
                Payment Details ({formData.tokenNumber})
              </h3>
            )}
            <div className="payment-section">
              {/* Part A */}
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
                      <CustomDatePicker
                        label="Payment Date"
                        value={p.paymentDate}
                        readOnly={mode === 'view'}
                        onChange={(date) => handlePaymentChange(index, 'paymentDate', date, 'owner')}
                      />
                      {renderInput('Amount', 'Amount', `owner-payment-amount-${index}`, (e) => handlePaymentChange(index, 'paymentAmount', e.target.value, 'owner'), p.paymentAmount)}
                      {renderDropdown('Mode', `owner-modeOfPayment-${index}`, modeOfPaymentOptions, (val) => handlePaymentChange(index, 'modeOfPayment', val, 'owner'), p.modeOfPayment)}
                      {renderInput('Payer Name', 'Payer Name', `owner-payerName-${index}`, (e) => handlePaymentChange(index, 'payerName', e.target.value, 'owner'), p.payerName)}
                      {mode !== 'view' && ownerPayments.length > 1 && (
                        <button type="button" className="remove-payment-btn" onClick={() => removePaymentEntry(index, 'owner')}>
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                  {mode !== 'view' && <button className="add-more-btn" onClick={() => addPaymentEntry('owner')}>+ Add Owner Payment</button>}
                </div>

                <div className="payment-details-section">
                  <h4>Tenant Payments</h4>
                  {tenantPayments.map((p, index) => (
                    <div key={index} className="payment-entry-grid">
                      <CustomDatePicker
                        label="Payment Date"
                        value={p.paymentDate}
                        readOnly={mode === 'view'}
                        onChange={(date) => handlePaymentChange(index, 'paymentDate', date, 'tenant')}
                      />
                      {renderInput('Amount', 'Amount', `tenant-payment-amount-${index}`, (e) => handlePaymentChange(index, 'paymentAmount', e.target.value, 'tenant'), p.paymentAmount)}
                      {renderDropdown('Mode', `tenant-modeOfPayment-${index}`, modeOfPaymentOptions, (val) => handlePaymentChange(index, 'modeOfPayment', val, 'tenant'), p.modeOfPayment)}
                      {renderInput('Payer Name', 'Payer Name', `tenant-payerName-${index}`, (e) => handlePaymentChange(index, 'payerName', e.target.value, 'tenant'), p.payerName)}
                      {mode !== 'view' && tenantPayments.length > 1 && (
                        <button type="button" className="remove-payment-btn" onClick={() => removePaymentEntry(index, 'tenant')}>
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                  {mode !== 'view' && <button className="add-more-btn" onClick={() => addPaymentEntry('tenant')}>+ Add Tenant Payment</button>}
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
                    readOnly={mode === 'view'}
                    onChange={e => handleInputChange('paymentDescription', e.target.value)}
                    rows="3"
                  />
                </div>
              </div>

              {/* Part B */}
              <div className="payment-part-b">
                <h4>Back Work Account</h4>
                <div className="form-grid payment-grid-bottom">
                  <CustomDatePicker
                    label="Govt GRN Date"
                    value={formData.govtGrnDate}
                    readOnly={mode === 'view'}
                    onChange={date => handleInputChange('govtGrnDate', date)}
                  />
                  {renderInput("GRN Number", "GRN Number", "grnNumber", (e) => handleInputChange('grnNumber', e.target.value))}
                  {renderInput("GRN Amount", "GRN Amount", "grnAmount", (e) => handleInputChange('grnAmount', e.target.value))}

                  <CustomDatePicker
                    label="DHC Date"
                    value={formData.dhcDate}
                    readOnly={mode === 'view'}
                    onChange={date => handleInputChange('dhcDate', date)}
                  />
                  {renderInput("DHC Number", "DHC Number", "dhcNumber", (e) => handleInputChange('dhcNumber', e.target.value))}
                  {renderInput("DHC Amount", "DHC Amount", "dhcAmount", (e) => handleInputChange('dhcAmount', e.target.value))}

                  {/* Commission Name seems to be a new concept, adding a simple version */}
                  <CustomDatePicker
                    label="Commission Date"
                    value={formData.commissionDate}
                    readOnly={mode === 'view'}
                    onChange={date => handleInputChange('commissionDate', date)}
                  />
                  {renderInput("Commission Name", "Commission Name", "commissionName", (e) => handleInputChange('commissionName', e.target.value))}
                  {renderInput("Commission Amount", "Commission Amount", "commissionAmount", (e) => handleInputChange('commissionAmount', e.target.value))}
                </div>
              </div>
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
        <Header title={mode === 'view' ? 'Lead Details' : 'Add New Lead'} onBack={handleBack} />
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
