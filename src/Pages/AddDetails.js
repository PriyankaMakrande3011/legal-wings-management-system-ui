import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import "./AddClient.css"

const AddDetails = () => {
  const [formData, setFormData] = useState({
    tokenNo: "",
    existingClient: null,
    ownerFirstName: "",
    ownerLastName: "",
    ownerEmail: "",
    ownerPhone: "",
    ownerAadhar: "",
    ownerPAN: "",
    ownerAddress: "",
    ownerBiometric: "No",
    tenantFirstName: "",
    tenantLastName: "",
    tenantEmail: "",
    tenantPhone: "",
    tenantAadhar: "",
    tenantPAN: "",
    tenantAddress: "",
    tenantBiometric: "No",
    totalPayment: "",
    cashPayment: "",
    onlinePayment: "",
    pendingPayment: ""
  });

  const existingClients = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" }
  ];

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const calculatePendingPayment = () => {
    const total = parseFloat(formData.totalPayment) || 0;
    const cash = parseFloat(formData.cashPayment) || 0;
    const online = parseFloat(formData.onlinePayment) || 0;
    return total - (cash + online);
  };

  const handleSubmit = () => {
    console.log("Submitted Data: ", formData);
  };

  return (
    <div className="p-4">
      
      <div className="p-fluid p-grid">
        <div className="col-6 md:col-6">
          <label>Token No*</label>
          <InputText value={formData.tokenNo} onChange={(e) => handleChange(e, "tokenNo")} required />
        </div>
        <div className="col-6 md:col-6">
          <label>Existing Client</label>
          <Dropdown value={formData.existingClient} options={existingClients} onChange={(e) => handleChange(e, "existingClient")} placeholder="Select" />
        </div>
      </div>

      <h3>Owner Details</h3>
      <div className="p-grid">
        <div className="col-12 md:col-4">
          <label>First Name*</label>
          <InputText value={formData.ownerFirstName} onChange={(e) => handleChange(e, "ownerFirstName")} required />
        </div>
        <div className="col-12 md:col-4">
          <label>Last Name*</label>
          <InputText value={formData.ownerLastName} onChange={(e) => handleChange(e, "ownerLastName")} required />
        </div>
        <div className="col-12 md:col-4">
          <label>Email</label>
          <InputText value={formData.ownerEmail} onChange={(e) => handleChange(e, "ownerEmail")} />
        </div>
      </div>

      <div className="p-grid">
        <div className="col-12 md:col-4">
          <label>Phone No.*</label>
          <InputText value={formData.ownerPhone} onChange={(e) => handleChange(e, "ownerPhone")} required />
        </div>
        <div className="col-12 md:col-4">
          <label>Aadhar No.*</label>
          <InputText value={formData.ownerAadhar} onChange={(e) => handleChange(e, "ownerAadhar")} required />
        </div>
        <div className="col-12 md:col-4">
          <label>PAN No.*</label>
          <InputText value={formData.ownerPAN} onChange={(e) => handleChange(e, "ownerPAN")} required />
        </div>
        
        <div className="col-12">
          <label>Address*</label>
          <InputText value={formData.ownerAddress} onChange={(e) => handleChange(e, "ownerAddress")} required />
       
      </div>
      </div>

      

      <div className="p-grid">
        <label>Biometric</label>
        <div>
          <RadioButton inputId="ownerBiometricYes" name="ownerBiometric" value="Yes" onChange={(e) => handleChange(e, "ownerBiometric")} checked={formData.ownerBiometric === "Yes"} />
          <label htmlFor="ownerBiometricYes">Yes</label>
          <RadioButton inputId="ownerBiometricNo" name="ownerBiometric" value="No" onChange={(e) => handleChange(e, "ownerBiometric")} checked={formData.ownerBiometric === "No"} />
          <label htmlFor="ownerBiometricNo">No</label>
        </div>
      </div>

      <h3>Payment Details</h3>
      <div className="p-grid">
        <div className="col-12 md:col-4">
          <label>Total Payment*</label>
          <InputText value={formData.totalPayment} onChange={(e) => handleChange(e, "totalPayment")} required />
        </div>
        <div className="col-12 md:col-4">
          <label>Cash Payment*</label>
          <InputText value={formData.cashPayment} onChange={(e) => handleChange(e, "cashPayment")} required />
        </div>
        <div className="col-12 md:col-4">
          <label>Online Payment*</label>
          <InputText value={formData.onlinePayment} onChange={(e) => handleChange(e, "onlinePayment")} required />
        </div>
        <div className="col-12">
        <label>Pending Payment*</label>
        <InputText value={calculatePendingPayment()} disabled />
      </div>
      </div>

      

      <Button label="Submit" className="p-mt-3" onClick={handleSubmit} />
    </div>
  );
};

export default AddDetails;
