// import React, { useState } from 'react';
// import Slider from "./Slider";
// import Header from "./Header.js";
// import './AddLead.css'; // Your custom CSS

// const AddLeadPage = ({
//   showLead = true,
//   showAgreement = true,
//   showClient = true,
//   showPayment = true,
// }) => {
//   const defaultTab = showLead ? 'lead' :
//                     showClient ? 'client' :
//                     showAgreement ? 'agreement' :
//                     showPayment ? 'payment' : null;

//   const [activeTab, setActiveTab] = useState(defaultTab);

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'lead':
//         return (
//           <div className="form-section">
           
//             <div className="form-grid">
//             <input placeholder="Client Name" />
//             <input placeholder="Client Type" />
//             <input placeholder="Contact Number" />
//             <input placeholder="Email" />
//             <input placeholder="Address" />
//             <input placeholder="City" />
//             <input placeholder="Area" />
//             <input placeholder="Tentative Agreement Date" />
//             </div>
//           </div>
//         );
//       case 'agreement':
//         return (
//           <div className="form-section">
            
//             <div className="form-grid">
//             <input placeholder="Token Number" />
//             <input placeholder="Agreement Start Date" type="date" />
//             <input placeholder="Agreement End Date" type="date" />
//             <input placeholder="Address Line 1" />
//             <input placeholder="Address Line 2" />
//           </div>
//           </div>
//         );
//         case 'client':
//           return (
//             <div className="form-section">
//               {/* Owner Card */}
//               <div className="card">
//                 <h3>Owner Details</h3>
//                 <div className="form-grid">
//                   <input placeholder="Owner Name" />
//                   <input placeholder="Owner Email" />
//                   <input placeholder="Owner Contact" />
//                   <input placeholder="Owner Aadhar Number" />
//                   <input placeholder="Owner PAN Number" />
//                 </div>
//               </div>
        
//               {/* Tenant Card */}
//               <div className="card">
//                 <h3>Tenant Details</h3>
//                 <div className="form-grid">
//                   <input placeholder="Tenant Name" />
//                   <input placeholder="Tenant Email" />
//                   <input placeholder="Tenant Contact" />
//                   <input placeholder="Tenant Aadhar Number" />
//                   <input placeholder="Tenant PAN Number" />
//                 </div>
//               </div>
//             </div>
//           );
        
//       case 'payment':
//         return (
//           <div className="form-section">
           
//             <div className="form-grid">
//             <input placeholder="Owner Payment Amount" />
//             <input placeholder="Tenant Payment Amount" />
//             <input placeholder="Total Payment" />
//             <input placeholder="Remaining Payment" />
//             <input placeholder="Mode of Payment" />
//             <input placeholder="Payment Calendar (if any)" />
//           </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="add-lead-container">
//       <Slider />
//       <div className="main-content">
//         <Header title="Add New Lead" />

//         {/* Tab Buttons */}
//         <div className="tab-buttons">
//           {showLead && (
//             <button
//               className={activeTab === 'lead' ? 'active' : ''}
//               onClick={() => setActiveTab('lead')}
//             >
//               Lead Details
//             </button>
//           )}
//           {showClient && (
//             <button
//               className={activeTab === 'client' ? 'active' : ''}
//               onClick={() => setActiveTab('client')}
//             >
//               Client Details
//             </button>
//           )}
//           {showAgreement && (
//             <button
//               className={activeTab === 'agreement' ? 'active' : ''}
//               onClick={() => setActiveTab('agreement')}
//             >
//               Agreement Details
//             </button>
//           )}
//           {showPayment && (
//             <button
//               className={activeTab === 'payment' ? 'active' : ''}
//               onClick={() => setActiveTab('payment')}
//             >
//               Payment Details
//             </button>
//           )}
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddLeadPage;
// import React, { useState, useEffect } from 'react';
// import Slider from "./Slider";
// import Header from "./Header.js";
// import './AddLead.css';
// import { useLocation } from 'react-router-dom';

// const AddLeadPage = ({
//   showLead = true,
//   showAgreement = true,
//   showClient = true,
//   showPayment = true,
// }) => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const mode = queryParams.get("mode");
//   const id = queryParams.get("id");

//   const defaultTab = showLead ? 'lead' :
//     showClient ? 'client' :
//     showAgreement ? 'agreement' :
//     showPayment ? 'payment' : null;

//   const [activeTab, setActiveTab] = useState(defaultTab);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (mode === "view" && id) {
//       fetch(`http://192.168.95.72:8080/legal-wings-management/leads/all`)
//         .then((res) => res.json())
//         .then((data) => {
//           const leadsArray = Array.isArray(data) ? data : data.leads || [];
//           const lead = leadsArray.find(item => item.id === parseInt(id));
//           if (lead) {
//             setFormData(lead);
//           } else {
//             console.warn("Lead not found with id:", id);
//           }
//         })
//         .catch(err => console.error("Error fetching lead:", err));
//     }
//   }, [mode, id]);

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'lead':
//         return (
//           <div className="form-section">
//             <div className="form-grid">
//               <input placeholder="Client Name" value={formData.clientName || ''} readOnly />
//               <input placeholder="Client Type" value={formData.clientType || ''} readOnly />
//               <input placeholder="Contact Number" value={formData.contactNumber || ''} readOnly />
//               <input placeholder="Email" value={formData.email || ''} readOnly />
//               <input placeholder="Address" value={formData.address || ''} readOnly />
//               <input placeholder="City" value={formData.city || ''} readOnly />
//               <input placeholder="Area" value={formData.area || ''} readOnly />
//               <input placeholder="Tentative Agreement Date" value={formData.agreementDate || ''} readOnly />
//             </div>
//           </div>
//         );

//       case 'agreement':
//         return (
//           <div className="form-section">
//             <div className="form-grid">
//               <input placeholder="Token Number" value={formData.tokenNumber || ''} readOnly />
//               <input placeholder="Agreement Start Date" type="date" value={formData.startDate || ''} readOnly />
//               <input placeholder="Agreement End Date" type="date" value={formData.endDate || ''} readOnly />
//               <input placeholder="Address Line 1" value={formData.addressLine1 || ''} readOnly />
//               <input placeholder="Address Line 2" value={formData.addressLine2 || ''} readOnly />
//             </div>
//           </div>
//         );

//       case 'client':
//         return (
//           <div className="form-section">
//             <div className="card">
//               <h3>Owner Details</h3>
//               <div className="form-grid">
//                 <input placeholder="Owner Name" value={formData.ownerName || ''} readOnly />
//                 <input placeholder="Owner Email" value={formData.ownerEmail || ''} readOnly />
//                 <input placeholder="Owner Contact" value={formData.ownerContact || ''} readOnly />
//                 <input placeholder="Owner Aadhar Number" value={formData.ownerAadhar || ''} readOnly />
//                 <input placeholder="Owner PAN Number" value={formData.ownerPan || ''} readOnly />
//               </div>
//             </div>

//             <div className="card">
//               <h3>Tenant Details</h3>
//               <div className="form-grid">
//                 <input placeholder="Tenant Name" value={formData.tenantName || ''} readOnly />
//                 <input placeholder="Tenant Email" value={formData.tenantEmail || ''} readOnly />
//                 <input placeholder="Tenant Contact" value={formData.tenantContact || ''} readOnly />
//                 <input placeholder="Tenant Aadhar Number" value={formData.tenantAadhar || ''} readOnly />
//                 <input placeholder="Tenant PAN Number" value={formData.tenantPan || ''} readOnly />
//               </div>
//             </div>
//           </div>
//         );

//       case 'payment':
//         return (
//           <div className="form-section">
//             <div className="form-grid">
//               <input placeholder="Owner Payment Amount" value={formData.ownerPayment || ''} readOnly />
//               <input placeholder="Tenant Payment Amount" value={formData.tenantPayment || ''} readOnly />
//               <input placeholder="Total Payment" value={formData.totalPayment || ''} readOnly />
//               <input placeholder="Remaining Payment" value={formData.remainingPayment || ''} readOnly />
//               <input placeholder="Mode of Payment" value={formData.paymentMode || ''} readOnly />
//               <input placeholder="Payment Calendar (if any)" value={formData.paymentCalendar || ''} readOnly />
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="add-lead-container">
//       <Slider />
//       <div className="main-content">
//         <Header title="Add New Lead" />

//         <div className="tab-buttons">
//           {showLead && (
//             <button className={activeTab === 'lead' ? 'active' : ''} onClick={() => setActiveTab('lead')}>
//               Lead Details
//             </button>
//           )}
//           {showClient && (
//             <button className={activeTab === 'client' ? 'active' : ''} onClick={() => setActiveTab('client')}>
//               Client Details
//             </button>
//           )}
//           {showAgreement && (
//             <button className={activeTab === 'agreement' ? 'active' : ''} onClick={() => setActiveTab('agreement')}>
//               Agreement Details
//             </button>
//           )}
//           {showPayment && (
//             <button className={activeTab === 'payment' ? 'active' : ''} onClick={() => setActiveTab('payment')}>
//               Payment Details
//             </button>
//           )}
//         </div>

//         <div className="tab-content">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddLeadPage;
// AddLeadPage.js
import React, { useState, useEffect } from 'react';
import Slider from "./Slider";
import Header from "./Header.js";
import './AddLead.css';
import AddClient from "./AddClient.js";
import { FaPlus } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
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

  const defaultTab = showLead ? 'lead' : showClient ? 'client' : 'payment';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState({});
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    fetch(Api.CLIENT_DROPDOWN)
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.error("Failed to fetch clients", err));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    fetch(Api.ADD_LEAD, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save");
        return res.json();
      })
      .then(() => alert("Lead data saved successfully!"))
      .catch(err => {
        console.error("Submit error:", err);
        alert("Error saving lead. Try again.");
      });
  };

  const handleNext = (nextTab) => {
    setActiveTab(nextTab);
  };

  const fetchAndAutofillClient = (clientId, type) => {
    if (!clientId) return;

    fetch(`${Api.BASE_URL}clients/${clientId}`)
      .then(res => res.json())
      .then(client => {
        const fullName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
        const baseFields = {
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
            clientName: fullName,
            ...baseFields,
          }));
        } else if (type === 'owner') {
          setFormData(prev => ({
            ...prev,
            ownerName: fullName,
            ownerEmail: client.email,
            ownerContact: client.phoneNo,
            ownerAadhar: client.aadharNumber,
            ownerPan: client.panNumber,
          }));
        } else if (type === 'tenant') {
          setFormData(prev => ({
            ...prev,
            tenantName: fullName,
            tenantEmail: client.email,
            tenantContact: client.phoneNo,
            tenantAadhar: client.aadharNumber,
            tenantPan: client.panNumber,
          }));
        }
      })
      .catch(err => console.error("Failed to fetch client data", err));
  };

  const renderClientDropdown = (type) => (
    <select onChange={(e) => fetchAndAutofillClient(e.target.value, type)} defaultValue="" className='client-dropdown'>
      <option value="">Select Existing Client</option>
      {clients.map(client => (
        <option key={client.id} value={client.id}>{client.name}</option>
      ))}
    </select>
    
  );

  const renderInput = (placeholder, field) => (
    <input
      placeholder={placeholder}
      value={formData[field] || ''}
      readOnly={mode === 'view'}
      onChange={e => handleInputChange(field, e.target.value)}
    />
  );

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
                <button onClick={handleSave}>Save</button>
                <button onClick={() => handleNext('client')}>Next</button>
              </div>
            )}
          </>
        );

      case 'client':
        return (
          <>
            <h3>Owner</h3>
            {renderClientDropdown('owner')}
            <div className="form-grid">
              {renderInput("First Name", "firstName")}
              {renderInput("Last Name", "lastName")}
              {renderInput("Owner Email", "ownerEmail")}
              {renderInput("Owner Contact", "ownerContact")}
              {renderInput("Owner Aadhar Number", "ownerAadhar")}
              {renderInput("Owner PAN Number", "ownerPan")}
            </div>
            <h3>Tenant</h3>
            {renderClientDropdown('tenant')}
            <div className="form-grid">
            {renderInput("First Name", "firstName")}
            {renderInput("Last Name", "lastName")}
              {renderInput("Tenant Email", "tenantEmail")}
              {renderInput("Tenant Contact", "tenantContact")}
              {renderInput("Tenant Aadhar Number", "tenantAadhar")}
              {renderInput("Tenant PAN Number", "tenantPan")}
            </div>

            <h3>Agreement Details</h3>
            <div className="form-grid">
              {renderInput("Token Number", "tokenNumber")}
              {renderInput("Agreement Start Date", "startDate")}
              {renderInput("Agreement End Date", "endDate")}
              {renderInput("Address Line 1", "addressLine1")}
              {renderInput("Address Line 2", "addressLine2")}
            </div>

            {mode !== 'view' && (
              <div className="button-wrapper">
                <button onClick={handleSave}>Save</button>
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
                <button onClick={handleSave}>Save</button>
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
