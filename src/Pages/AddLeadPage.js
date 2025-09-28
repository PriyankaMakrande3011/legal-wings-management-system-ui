
import React, { useState, useEffect } from 'react';
import Slider from "./Slider";
import Header from "./Header.js";
import './AddLead.css';
import AddClient from "./AddClient.js";
import { useKeycloak } from "@react-keycloak/web";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaRegCalendarAlt, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import CustomDatePicker from '../common/CustomDatePicker.js';
import Select from "react-select";




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
  const [formData, setFormData] = useState({ cityId: "",
  areaId: "",});
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null); // <--- New
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const clientTypeOptions = ["OWNER", "TENANT", "AGENT"];
  const leadSourceOptions = ["ONLINE","CALL","EXCEL","REFERENCE","SHOP"];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { keycloak } = useKeycloak();
  const transitLevel = location.state?.transitLevel;
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [agreementStatusOptions, setAgreementStatusOptions] = useState([]);
  const [agreementFile, setAgreementFile] = useState(null);



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

  }, [keycloak?.token]);

  const handleAcceptLead = (lead) => {
    navigate("/add-Executive-details");   // navigate to AddLeadPage
  };


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      tentativeAgreementDate: formData.tentativeAgreementDate,
      visitAddress: formData.visitAddress,
      id: leadId,
      transitLevel: transitLevel,
      leadSource: formData.leadSource, 
      description: formData.description,
      appointmentTime: formData.appointmentTime,
      referenceNumber: formData.referenceNumber,
      referenceName: formData.referenceName,
      amount: formData.amount,
      lastFollowUpDate: formData.lastFollowUpDate ? format(new Date(formData.lastFollowUpDate), 'yyyy-MM-dd') : null,
      nextFollowUpDate: formData.nextFollowUpDate ? format(new Date(formData.nextFollowUpDate), 'yyyy-MM-dd') : null,

      
   city: {
      id: formData.cityId || null  
    },

    area: {
      id: formData.areaId|| null
  
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

    fetch("http://localhost:8081/legal-wings-management/leads", {
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
    const agreementData = {
      leadId,
      tokenNo: formData.tokenNumber,
      agreementStartDate: formData.agreementStartDate ? format(new Date(formData.agreementStartDate), 'yyyy-MM-dd') : null,
      agreementEndDate: formData.agreementEndDate ? format(new Date(formData.agreementEndDate), 'yyyy-MM-dd') : null,
      area: {
      id: formData.areaId|| null
  
    },
      agreementStatus: formData.agreementStatus,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      tenant: {

        firstName: formData.tenantFirstName,
        lastName: formData.tenantLastName,
        clientType: "TENANT", // Hardcoded for now, can be adjusted
        email: formData.tenantEmail,
        phoneNo: formData.tenantContact,
        aadharNumber: formData.tenantAadhar,
        panNumber: formData.tenantPan,
      },
      owner: {

        firstName: formData.ownerFirstName,
        lastName: formData.ownerLastName,
        clientType: "OWNER", // Hardcoded for now, can be adjusted
        email: formData.ownerEmail,
        phoneNo: formData.ownerContact,
        aadharNumber: formData.ownerAadhar,
        panNumber: formData.ownerPan,
      }
    };

    fetch("http://localhost:8081/legal-wings-management/agreements", {
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
      totalAmount: formData.totalAmount,
      ownerPayment: formData.ownerPayment,
      ownerPaymentDate: formData.ownerPaymentDate ? format(new Date(formData.ownerPaymentDate), 'yyyy-MM-dd') : null,
      ownerModeOfPayment: formData.ownerModeOfPayment,
      tenantAmount: formData.tenantPayment,
      tenantPaymentDate: formData.tenantPaymentDate ? format(new Date(formData.tenantPaymentDate), 'yyyy-MM-dd') : null,
      tenantModeOfPayment: formData.tenantModeOfPayment,
      grnNumber: formData.grnNumber,
      govtGrnDate: formData.govtGrnDate ? format(new Date(formData.govtGrnDate), 'yyyy-MM-dd') : null,
      dhcDate: formData.dhcDate ? format(new Date(formData.dhcDate), 'yyyy-MM-dd') : null,
    };

    fetch("http://localhost:8081/legal-wings-management/payments", {
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

  const renderDropdown = (label, field, options = []) => {
    // Ensure options are in { value, label } format.
    // This handles both arrays of strings and arrays of objects.
    const selectOptions = options.map(opt =>
      typeof opt === 'string'
        ? { value: opt, label: opt }
        : { value: opt.id || opt.name, label: opt.name }
    );

    const currentValue = selectOptions.find(
      (opt) => opt.value === formData[field]
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
          onChange={(selected) =>
            handleCityInputChange(field, selected?.value || null)
          }
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

  const renderFileInput = (label, field) => (
    <div>
      <label>{label}</label>
      <div className="file-input-wrapper">
        {agreementFile ? (
          <div className="file-display">
            <span>{agreementFile.name}</span>
            {mode !== 'view' && (
              <FaTimes
                className="remove-file-icon"
                onClick={() => setAgreementFile(null)}
              />
            )}
          </div>
        ) : mode !== 'view' && (
          <input
            type="file"
            id={field}
            onChange={e => setAgreementFile(e.target.files ? e.target.files[0] : null)}
          />
        )}
        {formData.fileUrl && (
          <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="view-file-link">View Agreement</a>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    console.log("Mode:", mode, "ID:", id);
    const fetchLeadDetails = async () => {
      if (mode === "view" && id) {
        try {
          const response = await axios.get(`http://localhost:8081/legal-wings-management/leads/${id}`, {
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
             tentativeAgreementDate: data.tentativeAgreementDate ? new Date(data.tentativeAgreementDate) : null,
  visitAddress: data.visitAddress || "",
        description: data.description || "",
      appointmentTime: data.appointmentTime || "",
      referenceNumber: data.referenceNumber || "",
      referenceName: data.referenceName || "",
      cancellationReason: data.cancellationReason || "",
      amount: data.amount || "",
      lastFollowUpDate: data.lastFollowUpDate ? new Date(data.lastFollowUpDate) : null,
      nextFollowUpDate: data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null,


  cityId: data.city?.id || "",          
    areaId : data.area?.id || "",
    leadSource: data.leadSource||"",
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
            agreementStatus: data.agreement?.agreementStatus || "",
            fileUrl: data.agreement?.fileUrl || "",
            area: data.agreement?.area?.name || "",
            addressLine1: data.agreement?.addressLine1 || "",
            addressLine2: data.agreement?.addressLine2 || "",
            tokenNumber: data.agreement?.tokenNo || "",

            // Payment
            totalPayment: data.payment?.totalAmount || "",
            ownerPayment: data.payment?.ownerAmount || "",
            tenantPayment: data.payment?.tenantAmount || "",
            remainingPayment: data.payment?.remainingAmount || "",
            ownerModeOfPayment: data.payment?.ownerModeOfPayment || "",
            tenantModeOfPayment: data.payment?.tenantModeOfPayment || "",
            ownerPaymentDate: data.payment?.ownerPaymentDate ? new Date(data.payment.ownerPaymentDate) : null,
            tenantPaymentDate: data.payment?.tenantPaymentDate ? new Date(data.payment.tenantPaymentDate) : null,
            grnNumber: data.payment?.grnNumber || "",
            govtGrnDate: data.payment?.govtGrnDate ? new Date(data.payment.govtGrnDate) : null,
            dhcDate: data.payment?.dhcDate ? new Date(data.payment.dhcDate) : null
          });
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
              <CustomDatePicker
                label="Tentative Agreement Date"
                placeholderText="DD-MM-YYYY"
                value={formData.tentativeAgreementDate}
                onChange={(date) => handleInputChange('tentativeAgreementDate', date)}
                readOnly={mode === 'view'}
                dateFormat="yyyy-MM-dd"
              />
              {renderInput("Appointment Time", "Appointment Time", "appointmentTime")}
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
                dateFormat="yyyy-MM-dd"
              />
              <CustomDatePicker
                label="Next FollowUp Date"
                placeholderText="DD-MM-YYYY"
                value={formData.nextFollowUpDate}
                readOnly={mode === 'view'}
                onChange={(date) => handleInputChange('nextFollowUpDate', date)}
                dateFormat="yyyy-MM-dd"
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
            <div className="form-grid">
              {renderInput("Total Amount", "Total Amount", "totalAmount")}
              {renderInput("Owner Payment", "Owner Payment", "ownerPayment")}
               <CustomDatePicker
                label="Owner Payment Date"
                placeholderText="DD-MM-YYYY"
                value={formData.ownerPaymentDate}
                readOnly={mode === 'view'}
                onChange={(date) => handleInputChange('ownerPaymentDate', date)}
              />
              {renderInput("Owner Mode of Payment", "Owner Mode of Payment", "ownerModeOfPayment")}
              {renderInput("Tenant Payment Amount", "Tenant Payment Amount", "tenantPayment")}
              <CustomDatePicker
                label="Tenant Payment Date"
                placeholderText="DD-MM-YYYY"
                value={formData.tenantPaymentDate}
                readOnly={mode === 'view'}
                onChange={(date) => handleInputChange('tenantPaymentDate', date)}
              />
              {renderInput("Tenant Mode of Payment", "Tenant Mode of Payment", "tenantModeOfPayment")}
              {renderInput("GRN Number", "GRN Number", "grnNumber")}
              <CustomDatePicker label="Govt GRN Date" placeholderText="DD-MM-YYYY" value={formData.govtGrnDate} readOnly={mode === 'view'} onChange={date => handleInputChange('govtGrnDate', date)} />
              <CustomDatePicker label="DHC Date" placeholderText="DD-MM-YYYY" value={formData.dhcDate} readOnly={mode === 'view'} onChange={date => handleInputChange('dhcDate', date)} />


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
