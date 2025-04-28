

// import React, { useEffect, useState } from "react";
// import Slider from "./Slider";
// import Header from "./Header.js";
// import "./ClientPage.css";
// import axios from "axios";
// import { Button } from "primereact/button";
// import { Card } from "primereact/card";
// import { Dialog } from "primereact/dialog";
// import { FaPlus } from "react-icons/fa";
// import AddDetails from "./AddDetails";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import AddLeadPage from "./AddLeadPage.js";

// const Execative = () => {
//   const [leads, setLeads] = useState([
//     // Initial dummy lead for testing, remove to test empty state
//     {
//       id: 1,
//       FirstName: "Rahul",
//       LastName: "Sharma",
//       ContactNumber: "+91 9876543210",
//       Email: "rahul.sharma@example.com",
//       City: "Delhi",
//       Area: "MG Road",
//       ClientType: "Owner",
//       Remarks: "Interested in renting a 2BHK apartment",
//       CreatedBy: "Admin",
//       Created_date: "2025-03-06",
//       UpdatedBy: "Admin",
//       Updated_date: "2025-03-06",
//       LeadStatus: "In Progress",
//       TotalAmount: "₹50,000",
//       Aadhar_Number: "AAB123456",
//       PAN_Number: "ABCDE1234F",
//       TotalPayment: "₹50,000",
//       OwnerPayment: "₹45,000",
//       TenantPayment: "₹5,000",
//       PaymentMode: "UPI"
//     }
//   ]);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("common");

//   const handleAcceptLead = (lead) => {
//     setSelectedLead(lead);
//   };

//   const handleCancelLead = (leadId) => {
//     setLeads(leads.filter((lead) => lead.id !== leadId));
//   };

//   return (
//     <div className="client-container">
//       <Slider />
//       <div className="client-page">
//         <Header />
//         <div className="client-content-box">
//           {!selectedLead ? (
//             <div className="table-container">
//               {leads.length === 0 ? (
//                 <div className="no-leads">
//                   <img
//                     src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
//                     alt="No Leads"
//                     className="no-leads-img"
//                   />
//                   <h3>No leads assigned yet!</h3>
//                   <p>Please wait for admin to assign you a lead.</p>
//                 </div>
//               ) : (
//                 <DataTable
//                   value={leads}
//                   responsiveLayout="scroll"
//                   className="custom-table"
//                 >
//                   <Column field="FirstName" header="First Name" />
//                   <Column field="LastName" header="Last Name" />
//                   <Column field="ContactNumber" header="Contact" />
//                   <Column field="Email" header="Email" />
//                   <Column field="LeadStatus" header="Status" />
//                   <Column
//                     header="Actions"
//                     body={(rowData) => (
//                       <>
//                         <Button
//                           label="Accept"
//                           onClick={() => handleAcceptLead(rowData)}
//                           className="p-button-success"
//                         />
//                         <Button
//                           label="Cancel"
//                           onClick={() => handleCancelLead(rowData.id)}
//                           className="p-button-danger"
//                           style={{ marginLeft: "10px" }}
//                         />
//                       </>
//                     )}
//                   />
//                 </DataTable>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="client-action">
//                 <Button
//                   icon={<FaPlus />}
//                   label="Add Client"
//                   onClick={() => setIsModalOpen(true)}
//                 />
//               </div>
//               <div className="tab-buttons">
//                 <Button
//                   label="Common Details"
//                   onClick={() => setActiveTab("common")}
//                   className={activeTab === "common" ? "active-tab" : ""}
//                 />
//                 <Button
//                   label="Owner Details"
//                   onClick={() => setActiveTab("owner")}
//                   className={activeTab === "owner" ? "active-tab" : ""}
//                 />
//                 <Button
//                   label="Tenant Details"
//                   onClick={() => setActiveTab("tenant")}
//                   className={activeTab === "tenant" ? "active-tab" : ""}
//                 />
//                 <Button
//                   label="Payment Details"
//                   onClick={() => setActiveTab("payment")}
//                   className={activeTab === "payment" ? "active-tab" : ""}
//                 />
//               </div>
//               <div className="client-card-container">
//                 <Card key={selectedLead.id} className="client-card">
//                   <h3>
//                     {selectedLead.FirstName} {selectedLead.LastName}
//                   </h3>
//                   <div className="details-box">
//                     {activeTab === "common" && (
//                       <>
//                         <div className="detail-item">
//                           <strong>Client Type:</strong> {selectedLead.ClientType}
//                         </div>
//                         <div className="detail-item">
//                           <strong>Remarks:</strong> {selectedLead.Remarks}
//                         </div>
//                         <div className="detail-item">
//                           <strong>Lead Status:</strong> {selectedLead.LeadStatus}
//                         </div>
//                         <div className="detail-item">
//                           <strong>Total Amount:</strong> {selectedLead.TotalAmount}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                   <div className="lead-actions">
//                     <Button label="Complete" className="p-button-success" />
//                     <Button
//                       label="Pending"
//                       className="p-button-warning"
//                       style={{ marginLeft: "10px", padding: "10px" }}
//                     />
//                     <Button
//                       label="Postpone"
//                       className="p-button-secondary"
//                       style={{ marginLeft: "10px", padding: "10px" }}
//                     />
//                   </div>
//                 </Card>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
     
//     </div>
//   );
// };

// export default Execative;


import React, { useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./ClientPage.css";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddLeadPage from "./AddLeadPage.js";

const Execative = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      FirstName: "Rahul",
      LastName: "Sharma",
      ContactNumber: "+91 9876543210",
      Email: "rahul.sharma@example.com",
      City: "Delhi",
      Area: "MG Road",
      ClientType: "Owner",
      Remarks: "Interested in renting a 2BHK apartment",
      CreatedBy: "Admin",
      Created_date: "2025-03-06",
      UpdatedBy: "Admin",
      Updated_date: "2025-03-06",
      LeadStatus: "In Progress",
      TotalAmount: "₹50,000",
      Aadhar_Number: "AAB123456",
      PAN_Number: "ABCDE1234F",
      TotalPayment: "₹50,000",
      OwnerPayment: "₹45,000",
      TenantPayment: "₹5,000",
      PaymentMode: "UPI"
    }
  ]);

  const [selectedLead, setSelectedLead] = useState(null);

  const handleAcceptLead = (lead) => {
    setSelectedLead(lead); // set the lead for AddLeadPage
  };

  const handleCancelLead = (leadId) => {
    setLeads(leads.filter((lead) => lead.id !== leadId));
  };

  const handleCloseAddLeadPage = () => {
    setSelectedLead(); // close AddLeadPage and go back
  };

  return (
    <div className="client-container">
      <Slider />
      <div className="client-page">
        <Header />
        <div className="client-content-box">
          {!selectedLead ? (
            <div className="table-container">
              {leads.length === 0 ? (
                <div className="no-leads">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                    alt="No Leads"
                    className="no-leads-img"
                  />
                  <h3>No leads assigned yet!</h3>
                  <p>Please wait for admin to assign you a lead.</p>
                </div>
              ) : (
                <DataTable
                  value={leads}
                  responsiveLayout="scroll"
                  className="custom-table"
                >
                  <Column field="FirstName" header="First Name" />
                  <Column field="LastName" header="Last Name" />
                  <Column field="ContactNumber" header="Contact" />
                  <Column field="Email" header="Email" />
                  <Column field="LeadStatus" header="Status" />
                  <Column
                    header="Actions"
                    body={(rowData) => (
                      <>
                        <Button
                          label="Accept"
                          onClick={() => handleAcceptLead(rowData)}
                          className="p-button-success"
                        />
                        <Button
                          label="Cancel"
                          onClick={() => handleCancelLead(rowData.id)}
                          className="p-button-danger"
                          style={{ marginLeft: "10px" }}
                        />
                      </>
                    )}
                  />
                </DataTable>
              )}
            </div>
          ) : (
            <AddLeadPage selectedLead={selectedLead} onClose={handleCloseAddLeadPage}  />
          )}
        </div>
      </div>
    </div>
  );
};

export default Execative;
