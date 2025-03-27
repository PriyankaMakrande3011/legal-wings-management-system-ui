// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import Header from "./Header";
// import Slider from "./Slider";
// import "./BackendDetails.css";

// const BackendDetails = () => {
//   const { id } = useParams(); // Get Lead ID from URL

//   // Manual Lead Data
//   const [lead] = useState({
//     FirstName: "Rahul",
//     LastName: "Sharma",
//     ContactNumber: "+91 9876543210",
//     Email: "rahul.sharma@example.com",
//     City: "Delhi",
//     Area: "MG Road",
//     ClientType: "Owner",
//     TokenNumber: "TK12345",
//     GRNNumber: "GRN98765",
//     OwnerName: "Amit Verma",
//     OwnerContact: "+91 9988776655",
//     TenantName: "Suresh Gupta",
//     TenantContact: "+91 8877665544",
//     TotalPayment: "₹50,000",
//     OwnerPayment: "₹45,000",
//     TenantPayment: "₹5,000",
//     PendingPayment: "₹0",
//     PaymentMode: "UPI",
//   });

//   const [activeTab, setActiveTab] = useState("agreement");

//   return (
//     <div className="lead-details-container">
//       <Slider />
//       <div className="lead-details-content">
//         <Header />
     

//         {/* Tab Navigation */}
//         <div className="tabs">
//           <button onClick={() => setActiveTab("agreement")} className={activeTab === "agreement" ? "active" : ""}>
//             Agreement
//           </button>
//           <button onClick={() => setActiveTab("client")} className={activeTab === "client" ? "active" : ""}>
//             Client
//           </button>
//           <button onClick={() => setActiveTab("payment")} className={activeTab === "payment" ? "active" : ""}>
//             Payment
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className="tab-content">
//           {activeTab === "agreement" && (
//             <>
//               <h3>Agreement Details</h3>
//               <div className="input-group">
//                 <label>Token Number</label>
//                 <input type="text" value={lead.TokenNumber} readOnly />
//               </div>
//               <div className="input-group">
//                 <label>GRN Number</label>
//                 <input type="text" value={lead.GRNNumber} readOnly />
//               </div>
//             </>
//           )}

//           {activeTab === "client" && (
//             <>
//               <h3>Client Details</h3>
//               <div className="owner">
//                 <h4>Owner Details</h4>
//                 <div className="input-group">
//                   <label>Owner Name</label>
//                   <input type="text" value={lead.OwnerName} readOnly />
//                 </div>
//                 <div className="input-group">
//                   <label>Owner Contact</label>
//                   <input type="text" value={lead.OwnerContact} readOnly />
//                 </div>
//               </div>
//               <div className="tenant">
//                 <h4>Tenant Details</h4>
//                 <div className="input-group">
//                   <label>Tenant Name</label>
//                   <input type="text" value={lead.TenantName} readOnly />
//                 </div>
//                 <div className="input-group">
//                   <label>Tenant Contact</label>
//                   <input type="text" value={lead.TenantContact} readOnly />
//                 </div>
//               </div>
//             </>
//           )}

//           {activeTab === "payment" && (
//             <>
//               <h3>Payment Details</h3>
//               <div className="input-group">
//                 <label>Total Payment</label>
//                 <input type="text" value={lead.TotalPayment} readOnly />
//               </div>
//               <div className="input-group">
//                 <label>Owner Payment</label>
//                 <input type="text" value={lead.OwnerPayment} readOnly />
//               </div>
//               <div className="input-group">
//                 <label>Tenant Payment</label>
//                 <input type="text" value={lead.TenantPayment} readOnly />
//               </div>
//               <div className="input-group">
//                 <label>Pending Payment</label>
//                 <input type="text" value={lead.PendingPayment} readOnly />
//               </div>
//               <div className="input-group">
//                 <label>Payment Mode</label>
//                 <input type="text" value={lead.PaymentMode} readOnly />
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BackendDetails;
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Slider from "./Slider";
import "./BackendDetails.css";

const BackendDetails = () => {
  const { id } = useParams(); // Get Lead ID from URL

  // Manual Lead Data
  const [lead] = useState({
    FirstName: "Rahul",
    LastName: "Sharma",
    ContactNumber: "+91 9876543210",
    Email: "rahul.sharma@example.com",
    City: "Delhi",
    Area: "MG Road",
    ClientType: "Owner",
    TokenNumber: "TK12345",
    GRNNumber: "GRN98765",
    OwnerName: "Amit Verma",
    OwnerContact: "+91 9988776655",
    TenantName: "Suresh Gupta",
    TenantContact: "+91 8877665544",
    TotalPayment: "₹50,000",
    OwnerPayment: "₹45,000",
    TenantPayment: "₹5,000",
    PendingPayment: "₹0",
    PaymentMode: "UPI",
  });

  const [activeTab, setActiveTab] = useState("agreement");

  return (
    <div className="lead-details-container">
      <Slider />
      <div className="lead-details-content">
        <Header />

        {/* Tab Navigation */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab("agreement")}
            className={activeTab === "agreement" ? "active" : ""}
          >
            Agreement
          </button>
          <button
            onClick={() => setActiveTab("client")}
            className={activeTab === "client" ? "active" : ""}
          >
            Client
          </button>
          <button
            onClick={() => setActiveTab("payment")}
            className={activeTab === "payment" ? "active" : ""}
          >
            Payment
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "agreement" && (
            <>
              <h3>Agreement Details</h3>
              <div className="input-row">
                <div className="input-group">
                  <label>Token Number</label>
                  <input type="text" value={lead.TokenNumber} readOnly />
                </div>
                <div className="input-group">
                  <label>GRN Number</label>
                  <input type="text" value={lead.GRNNumber} readOnly />
                </div>
              </div>
            </>
          )}

          {activeTab === "client" && (
            <>
              <h3>Client Details</h3>
              <div className="input-row">
                <div className="input-group">
                  <label>Owner Name</label>
                  <input type="text" value={lead.OwnerName} readOnly />
                </div>
                <div className="input-group">
                  <label>Owner Contact</label>
                  <input type="text" value={lead.OwnerContact} readOnly />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Tenant Name</label>
                  <input type="text" value={lead.TenantName} readOnly />
                </div>
                <div className="input-group">
                  <label>Tenant Contact</label>
                  <input type="text" value={lead.TenantContact} readOnly />
                </div>
              </div>
            </>
          )}

          {activeTab === "payment" && (
            <>
              <h3>Payment Details</h3>
              <div className="input-row">
                <div className="input-group">
                  <label>Total Payment</label>
                  <input type="text" value={lead.TotalPayment} readOnly />
                </div>
                <div className="input-group">
                  <label>Owner Payment</label>
                  <input type="text" value={lead.OwnerPayment} readOnly />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Tenant Payment</label>
                  <input type="text" value={lead.TenantPayment} readOnly />
                </div>
                <div className="input-group">
                  <label>Pending Payment</label>
                  <input type="text" value={lead.PendingPayment} readOnly />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Payment Mode</label>
                  <input type="text" value={lead.PaymentMode} readOnly />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendDetails;
