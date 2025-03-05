// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import "./AddClient.css";

// const AddClientModal = ({ isOpen, onClose }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [areas, setAreas] = useState([]);
//   const cityToAreas = {
//     pune: ["Kothrud", "Shivajinagar", "Hinjewadi", "Baner"],
//     mumbai: ["Andheri", "Bandra", "Dadar", "Borivali"],
//   };

//   const onCityChange = (city) => {
//     setAreas(city ? cityToAreas[city] || [] : []);
//   };

//   const onSubmit = (data) => {
//     console.log(data); // Handle form submission
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="addclient-container">
//       <div className="addclient-modal">
//         <h2>Add Client</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* First Name and Last Name */}
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="firstName">First Name:</label>
//               <input
//                 id="firstName"
//                 {...register("firstName", { required: "First Name is required" })}
//                 placeholder="Enter first name"
//               />
//               {errors.firstName && (
//                 <p className="error-message">{errors.firstName.message}</p>
//               )}
//             </div>
//             <div className="form-group">
//               <label htmlFor="lastName">Last Name:</label>
//               <input
//                 id="lastName"
//                 {...register("lastName", { required: "Last Name is required" })}
//                 placeholder="Enter last name"
//               />
//               {errors.lastName && (
//                 <p className="error-message">{errors.lastName.message}</p>
//               )}
//             </div>
//           </div>

//           {/* Contact Number */}
//           <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="contactNo">Contact Number:</label>
//             <input
//               id="contactNo"
//               type="tel"
//               {...register("contactNo", {
//                 required: "Contact Number is required",
//                 pattern: {
//                   value: /^[0-9]{10}$/,
//                   message: "Enter a valid 10-digit contact number",
//                 },
//               })}
//               placeholder="Enter contact number"
//             />
//             {errors.contactNo && (
//               <p className="error-message">{errors.contactNo.message}</p>
//             )}
//              </div>
//              <div className="form-group">
//             <label htmlFor="clientType">Client Type:</label>
//             <select
//               id="clientType"
//               {...register("clientType", { required: "Client Type is required" })}
//             >
//               <option value="">Select client type</option>
//               <option value="owner">Owner</option>
//               <option value="client">Client</option>
//               <option value="tenant">Tenant</option>
//             </select>
//             {errors.clientType && (
//               <p className="error-message">{errors.clientType.message}</p>
//             )}
//           </div>
         
//           </div>

//           {/* Address */}
//           <div className="form-group">
//             <label htmlFor="address">Address:</label>
//             <textarea
//               id="address"
//               {...register("address", { required: "Address is required" })}
//               placeholder="Enter address"
//               rows="3"
//               className="small-textarea"
//             />
//             {errors.address && (
//               <p className="error-message">{errors.address.message}</p>
//             )}
           
//           </div>

//           {/* City and Area */}
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="city">City:</label>
//               <select
//                 id="city"
//                 {...register("city", { required: "City is required" })}
//                 onChange={(e) => onCityChange(e.target.value)}
//               >
//                 <option value="">Select a city</option>
//                 <option value="pune">Pune</option>
//                 <option value="mumbai">Mumbai</option>
//               </select>
//               {errors.city && (
//                 <p className="error-message">{errors.city.message}</p>
//               )}
//             </div>
//             <div className="form-group">
//               <label htmlFor="area">Area:</label>
//               <select
//                 id="area"
//                 {...register("area", { required: "Area is required" })}
//                 disabled={!areas.length}
//               >
//                 <option value="">Select an area</option>
//                 {areas.map((area) => (
//                   <option key={area} value={area}>
//                     {area}
//                   </option>
//                 ))}
//               </select>
//               {errors.area && (
//                 <p className="error-message">{errors.area.message}</p>
//               )}
//             </div>
//           </div>

//           {/* Client Type Dropdown */}
          

//           {/* Aadhar and PAN Number */}
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="aadharNo">Aadhar Number:</label>
//               <input
//                 id="aadharNo"
//                 {...register("aadharNo", {
//                   required: "Aadhar Number is required",
//                   pattern: {
//                     value: /^[0-9]{12}$/,
//                     message: "Enter a valid 12-digit Aadhar number",
//                   },
//                 })}
//                 placeholder="Enter Aadhar number"
//               />
//               {errors.aadharNo && (
//                 <p className="error-message">{errors.aadharNo.message}</p>
//               )}
//             </div>
//             <div className="form-group">
//               <label htmlFor="panNumber">PAN Number:</label>
//               <input
//                 id="panNumber"
//                 {...register("panNumber", {
//                   required: "PAN Number is required",
//                   pattern: {
//                     value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
//                     message: "Enter a valid PAN number",
//                   },
//                 })}
//                 placeholder="Enter PAN number"
//               />
//               {errors.panNumber && (
//                 <p className="error-message">{errors.panNumber.message}</p>
//               )}
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="form-actions">
//             <button type="submit">Submit</button>
//             <button type="button" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddClientModal;
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import "./AddClient.css";

// const AddClientModal = ({ isOpen, onClose }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const [cities, setCities] = useState([]);
//   const [areas, setAreas] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

  
//   useEffect(() => {
//     if (!isOpen) return; // Fetch only when modal opens
  
//     const fetchCities = async () => {
//       setLoading(true);
//       setError(null);
  
//       try {
//         const response = await fetch("http://13.50.102.11:8080/legal-wings-management/clients");
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
  
//         const data = await response.json();
//         console.log("Fetched Cities Data:", data); // Debugging log
  
//         // Ensure response is an array
//         setCities(Array.isArray(data) ? data : []);
  
//       } catch (err) {
//         console.error("Error fetching cities:", err);
//         setError("Failed to fetch cities. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchCities();
//   }, [isOpen]);
  


//   const onSubmit = (data) => {
//     console.log(data); // Handle form submission
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="addclient-container">
//       <div className="addclient-modal">
//         <h2>Add Client</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* First Name and Last Name */}
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="firstName">First Name:</label>
//               <input
//                 id="firstName"
//                 {...register("firstName", { required: "First Name is required" })}
//                 placeholder="Enter first name"
//               />
//               {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
//             </div>
//             <div className="form-group">
//               <label htmlFor="lastName">Last Name:</label>
//               <input
//                 id="lastName"
//                 {...register("lastName", { required: "Last Name is required" })}
//                 placeholder="Enter last name"
//               />
//               {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
//             </div>
//           </div>

//           {/* Contact Number */}
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="contactNo">Contact Number:</label>
//               <input
//                 id="contactNo"
//                 type="tel"
//                 {...register("contactNo", {
//                   required: "Contact Number is required",
//                   pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit contact number" },
//                 })}
//                 placeholder="Enter contact number"
//               />
//               {errors.contactNo && <p className="error-message">{errors.contactNo.message}</p>}
//             </div>
//             <div className="form-group">
//               <label htmlFor="clientType">Client Type:</label>
//               <select id="clientType" {...register("clientType", { required: "Client Type is required" })}>
//                 <option value="">Select client type</option>
//                 <option value="owner">Owner</option>
//                 <option value="client">Client</option>
//                 <option value="tenant">Tenant</option>
//               </select>
//               {errors.clientType && <p className="error-message">{errors.clientType.message}</p>}
//             </div>
//           </div>

//           {/* Address */}
//           <div className="form-group">
//             <label htmlFor="address">Address:</label>
//             <textarea
//               id="address"
//               {...register("address", { required: "Address is required" })}
//               placeholder="Enter address"
//               rows="3"
//               className="small-textarea"
//             />
//             {errors.address && <p className="error-message">{errors.address.message}</p>}
//           </div>

//           {/* City and Area */}
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="city">City:</label>
//               <select id="city" {...register("city", { required: "City is required" })}>
//   <option value="">Select a city</option>
//   {cities.length > 0 ? (
//     cities.map((city) => (
//       <option key={city.id} value={city.name}>
//         {city.name}
//       </option>
//     ))
//   ) : (
//     <option disabled>No cities available</option>
//   )}
// </select>

//               {errors.city && <p className="error-message">{errors.city.message}</p>}
//             </div>
//             <div className="form-group">
//               <label htmlFor="area">Area:</label>
//               <select id="area" {...register("area", { required: "Area is required" })} disabled={!areas.length}>
//                 <option value="">Select an area</option>
//                 {areas.map((area) => (
//                   <option key={area.id} value={area.id}>
//                     {area.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.area && <p className="error-message">{errors.area.message}</p>}
//             </div>
//           </div>

//           {/* Aadhar and PAN Number */}
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="aadharNo">Aadhar Number:</label>
//               <input
//                 id="aadharNo"
//                 {...register("aadharNo", {
//                   required: "Aadhar Number is required",
//                   pattern: { value: /^[0-9]{12}$/, message: "Enter a valid 12-digit Aadhar number" },
//                 })}
//                 placeholder="Enter Aadhar number"
//               />
//               {errors.aadharNo && <p className="error-message">{errors.aadharNo.message}</p>}
//             </div>
//             <div className="form-group">
//               <label htmlFor="panNumber">PAN Number:</label>
//               <input
//                 id="panNumber"
//                 {...register("panNumber", {
//                   required: "PAN Number is required",
//                   pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Enter a valid PAN number" },
//                 })}
//                 placeholder="Enter PAN number"
//               />
//               {errors.panNumber && <p className="error-message">{errors.panNumber.message}</p>}
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="form-actions">
//             <button type="submit">Submit</button>
//             <button type="button" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddClientModal;
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./AddClient.css";

const AddClientModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (!isOpen) return; // Fetch only when modal opens

    const fetchCities = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://13.50.102.11:8080/legal-wings-management/cities");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched Cities Data:", data);
  
        setCities(Array.isArray(data) ? data : []);
  
      } catch (err) {
        console.error("Error fetching cities:", err);
        setError("Failed to fetch cities. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchCities();
  }, [isOpen]);

  const fetchAreas = async (cityId) => {
    if (!cityId) return;
    
    try {
      const response = await fetch(`http://13.50.102.11:8080/legal-wings-management/areas?cityId=${cityId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setAreas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://13.50.102.11:8080/legal-wings-management/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="addclient-container">
      <div className="addclient-modal">
        <h2>Add Client</h2>
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
              {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                id="lastName"
                {...register("lastName", { required: "Last Name is required" })}
                placeholder="Enter last name"
              />
              {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Contact Number */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contactNo">Contact Number:</label>
              <input
                id="contactNo"
                type="tel"
                {...register("contactNo", {
                  required: "Contact Number is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit contact number" },
                })}
                placeholder="Enter contact number"
              />
              {errors.contactNo && <p className="error-message">{errors.contactNo.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="clientType">Client Type:</label>
              <select id="clientType" {...register("clientType", { required: "Client Type is required" })}>
                <option value="">Select client type</option>
                <option value="owner">Owner</option>
                <option value="client">Client</option>
                <option value="tenant">Tenant</option>
              </select>
              {errors.clientType && <p className="error-message">{errors.clientType.message}</p>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="city">City:</label>
            <select
              id="city"
              {...register("city", { required: "City is required" })}
              onChange={(e) => setSelectedCity(e.target.value)} // Update selected city
            >
              <option value="">Select a city</option>
              {cities.length > 0 ? (
                cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))
              ) : (
                <option disabled>No cities available</option>
              )}
            </select>
            {errors.city && <p className="error-message">{errors.city.message}</p>}
          </div>

          {/* Area Dropdown (Loads after selecting city) */}
          <div className="form-group">
            <label htmlFor="area">Area:</label>
            <select id="area" {...register("area", { required: "Area is required" })} disabled={!areas.length}>
              <option value="">Select an area</option>
              {areas.map((area) => (
                <option key={area.id} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>
            {errors.area && <p className="error-message">{errors.area.message}</p>}
          </div>
          {/* Other Fields */}
          
          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
