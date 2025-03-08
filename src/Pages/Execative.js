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

// const Execative = () => {
//   const [records, setRecords] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("owner");

//   useEffect(() => {
//     axios.get("http://localhost:3001/clients").then((res) => {
//       setRecords(res.data);
//     });
//   }, []);

//   const handleAddClient = () => {
//     setIsModalOpen(true);
//   };
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="client-container">
//       <Slider />
//       <div className="client-page">
//         <Header />
//         <div className="client-content-box">
          
//           <div className="client-action">
//             <Button icon={<FaPlus />} label="Add Client" onClick={handleAddClient} />
//           </div>
//           <div className="tab-buttons">
//             <Button label="Owner Details" onClick={() => setActiveTab("owner")} className={activeTab === "owner" ? "active-tab" : ""} />
//             <Button label="Tenant Details" onClick={() => setActiveTab("tenant")} className={activeTab === "tenant" ? "active-tab" : ""} />
//           </div>
//           <div className="client-card-container">
//   {records.length > 0 && (
//     <Card key={records[0].id} className="client-card">
//       <h3>{records[0].FirstName} {records[0].LastName}</h3>
      
//       <div className="details-box">
//         <div className="detail-item">
//           <i className="pi pi-phone"></i> 
//           <strong>Contact:</strong> {records[0].ContactNumber}
//         </div>
//         <div className="detail-item">
//           <i className="pi pi-envelope"></i> 
//           <strong>Email:</strong> {records[0].Email}
//         </div>
//         <div className="detail-item">
//           <i className="pi pi-map-marker"></i> 
//           <strong>City:</strong> {records[0].City}
//         </div>
//         <div className="detail-item">
//           <i className="pi pi-map"></i> 
//           <strong>Area:</strong> {records[0].Area}
//         </div>

//         {activeTab === "owner" && (
//           <>
//             <div className="detail-item">
//               <i className="pi pi-id-card"></i> 
//               <strong>Aadhar:</strong> {records[0].Aadhar_Number}
//             </div>
//             <div className="detail-item">
//               <i className="pi pi-credit-card"></i> 
//               <strong>PAN:</strong> {records[0].PAN_Number}
//             </div>
//             <div className="detail-item">
//               <i className="pi pi-user"></i> 
//               <strong>Client Type:</strong> {records[0].ClientType}
//             </div>
//           </>
//         )}

//         {activeTab === "tenant" && (
//           <>
//             <div className="detail-item">
//               <i className="pi pi-user-edit"></i> 
//               <strong>Created By:</strong> {records[0].CreatedBy}
//             </div>
//             <div className="detail-item">
//               <i className="pi pi-calendar"></i> 
//               <strong>Created Date:</strong> {records[0].Created_date}
//             </div>
//             <div className="detail-item">
//               <i className="pi pi-user-edit"></i> 
//               <strong>Updated By:</strong> {records[0].UpdatedBy}
//             </div>
//             <div className="detail-item">
//               <i className="pi pi-calendar"></i> 
//               <strong>Updated Date:</strong> {records[0].Updated_date}
//             </div>
//           </>
//         )}
//       </div>
//     </Card>
//   )}
// </div>


//         </div>
//       </div>
//      <Dialog
// header="Add Client"
// visible={isModalOpen}
// onHide={handleCloseModal}
// style={{ width: "50vw" }} // Adjust modal width
// >
// <AddDetails onClose={handleCloseModal} />
// </Dialog>
//     </div>
//   );
// };

// export default Execative;

import React, { useEffect, useState } from "react";
import Slider from "./Slider";
import Header from "./Header.js";
import "./ClientPage.css";
import axios from "axios";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { FaPlus } from "react-icons/fa";
import AddDetails from "./AddDetails";

const Execative = () => {
  const [records, setRecords] = useState([
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("common");

  const handleAddClient = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="client-container">
      <Slider />
      <div className="client-page">
        <Header />
        <div className="client-content-box">
          <div className="client-action">
            <Button icon={<FaPlus />} label="Add Client" onClick={handleAddClient} />
          </div>
          <div className="tab-buttons">
            <Button label="Common Details" onClick={() => setActiveTab("common")} className={activeTab === "common" ? "active-tab" : ""} />
            <Button label="Owner Details" onClick={() => setActiveTab("owner")} className={activeTab === "owner" ? "active-tab" : ""} />
            <Button label="Tenant Details" onClick={() => setActiveTab("tenant")} className={activeTab === "tenant" ? "active-tab" : ""} />
            <Button label="Payment Details" onClick={() => setActiveTab("payment")} className={activeTab === "payment" ? "active-tab" : ""} />
          </div>
          <div className="client-card-container">
            {records.length > 0 && (
              <Card key={records[0].id} className="client-card">
                <h3>{records[0].FirstName} {records[0].LastName}</h3>
                <div className="details-box">
                  {activeTab === "common" && (
                    <>
                      <div className="detail-item"><strong>Client Type:</strong> {records[0].ClientType}</div>
                      <div className="detail-item"><strong>Remarks:</strong> {records[0].Remarks}</div>
                      <div className="detail-item"><strong>Lead Status:</strong> {records[0].LeadStatus}</div>
                      <div className="detail-item"><strong>Total Amount:</strong> {records[0].TotalAmount}</div>
                      <div className="detail-item"><strong>Created By:</strong> {records[0].CreatedBy}</div>
                      <div className="detail-item"><strong>Created Date:</strong> {records[0].Created_date}</div>
                      <div className="detail-item"><strong>Updated By:</strong> {records[0].UpdatedBy}</div>
                      <div className="detail-item"><strong>Updated Date:</strong> {records[0].Updated_date}</div>
                    </>
                  )}
                  {activeTab === "owner" && (
                    <>
                      <div className="detail-item"><strong>Aadhar:</strong> {records[0].Aadhar_Number}</div>
                      <div className="detail-item"><strong>PAN:</strong> {records[0].PAN_Number}</div>
                    </>
                  )}
                  {activeTab === "tenant" && (
                    <>
                      <div className="detail-item"><strong>Tenant Name:</strong> {records[0].CreatedBy}</div>
                      <div className="detail-item"><strong>Contact No:</strong> {records[0].Created_date}</div>
                      <div className="detail-item"><strong>Adhar No:</strong> {records[0].Aadhar_Number}</div>
                      <div className="detail-item"><strong>PAN:</strong> {records[0].PAN_Number}</div>
                      
                    </>
                  )}
                  {activeTab === "payment" && (
                    <>
                      <div className="detail-item"><strong>Total Payment:</strong> {records[0].TotalPayment}</div>
                      <div className="detail-item"><strong>Owner Payment:</strong> {records[0].OwnerPayment}</div>
                      <div className="detail-item"><strong>Tenant Payment:</strong> {records[0].TenantPayment}</div>
                      <div className="detail-item"><strong>Payment Mode:</strong> {records[0].PaymentMode}</div>
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Dialog header="Add Details" visible={isModalOpen} onHide={handleCloseModal} style={{ width: "50vw" }}>
        <AddDetails onClose={handleCloseModal} />
      </Dialog>
    </div>
  );
};

export default Execative;
