
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./AddClient.css";

const EditClient = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [existingClients, setExistingClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null); // Track selected client
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [areas, setAreas] = useState([]);
  const cityToAreas = {
    pune: ["Kothrud", "Shivajinagar", "Hinjewadi", "Baner"],
    mumbai: ["Andheri", "Bandra", "Dadar", "Borivali"],
  };

  // Fetch existing clients from JSON link
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:3031/Lead"); // Replace with your JSON link
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data = await response.json();
        setExistingClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  // Handle city selection and update areas
  const onCityChange = (city) => {
    setAreas(city ? cityToAreas[city] || [] : []);
  };

  // Handle existing client selection
  const onClientSelect = (clientId) => {
    const selectedClient = existingClients.find((client) => client.id === clientId);
    if (selectedClient) {
      // Autofill the form fields with selected client data
      Object.entries(selectedClient).forEach(([key, value]) => {
        setValue(key, value);
      });
      setAreas(cityToAreas[selectedClient.city] || []);
      setSelectedClientId(clientId);
      setShowForm(true); // Show the form
    }
  };

  // Handle creating a new client
  const handleNewClient = () => {
    reset(); // Reset the form for new client entry
    setAreas([]); // Reset areas dropdown
    setSelectedClientId(null);
    setShowForm(true); // Show the form
  };

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
  };

  if (!isOpen) return null;

  return (
    <div className="addclient-container">
      <div className="addclient-modal">
        <h2>Add Lead</h2>

        {/* Select Existing Client or Create New Client */}
        <div className="client-selection">
          <select
            id="clientName"
            onChange={(e) => onClientSelect(Number(e.target.value))}
          >
            <option value="">Select Existing Client</option>
            {existingClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.FirstName} {client.LastName}
              </option>
            ))}
          </select>
          <button onClick={handleNewClient}>Create New Client</button>
        </div>

        {/* Form Section (Initially Hidden) */}
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name and Last Name */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  id="firstName"
                  {...register("firstName", { required: "First Name is required" })}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="error-message">{errors.firstName.message}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  id="lastName"
                  {...register("lastName", { required: "Last Name is required" })}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="error-message">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label htmlFor="contactNo">Contact Number:</label>
              <input
                id="contactNo"
                type="tel"
                {...register("contactNo", {
                  required: "Contact Number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit contact number",
                  },
                })}
                placeholder="Enter contact number"
              />
              {errors.contactNo && (
                <p className="error-message">{errors.contactNo.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <textarea
                id="address"
                {...register("address", { required: "Address is required" })}
                placeholder="Enter address"
                rows="3"
                className="small-textarea"
              />
              {errors.address && (
                <p className="error-message">{errors.address.message}</p>
              )}
            </div>

            {/* City and Area */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City:</label>
                <select
                  id="city"
                  {...register("city", { required: "City is required" })}
                  onChange={(e) => onCityChange(e.target.value)}
                >
                  <option value="">Select a city</option>
                  <option value="pune">Pune</option>
                  <option value="mumbai">Mumbai</option>
                </select>
                {errors.city && (
                  <p className="error-message">{errors.city.message}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="area">Area:</label>
                <select
                  id="area"
                  {...register("area", { required: "Area is required" })}
                  disabled={!areas.length}
                >
                  <option value="">Select an area</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {errors.area && (
                  <p className="error-message">{errors.area.message}</p>
                )}
              </div>
            </div>

            {/* Aadhar and PAN Number */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="aadharNo">Aadhar Number:</label>
                <input
                  id="aadharNo"
                  {...register("aadharNo", {
                    pattern: {
                      value: /^[0-9]{12}$/,
                      message: "Enter a valid 12-digit Aadhar number",
                    },
                  })}
                  placeholder="Enter Aadhar number"
                />
                {errors.aadharNo && (
                  <p className="error-message">{errors.aadharNo.message}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="panNumber">PAN Number:</label>
                <input
                  id="panNumber"
                  {...register("panNumber", {
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Enter a valid PAN number",
                    },
                  })}
                  placeholder="Enter PAN number"
                />
                {errors.panNumber && (
                  <p className="error-message">{errors.panNumber.message}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="submit">Submit</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default EditClient;
