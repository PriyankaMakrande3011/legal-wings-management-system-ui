import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssingLead.css";
import { useParams } from 'react-router-dom';
import { useKeycloak } from "@react-keycloak/web";
const AssignLead = ({ isOpen, onClose, onAssignSuccess, leadId }) => {
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(false);
  const { keycloak } = useKeycloak();
  const [executivesLoaded, setExecutivesLoaded] = useState(false);
  useEffect(() => {
    if (isOpen && !executivesLoaded) {
      fetchExecutives();
    }
  }, [isOpen, executivesLoaded]); // depend on both isOpen and executivesLoaded


  const fetchExecutives = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8081/legal-wings-management/users/dropDown?userType=EXECUTIVE",
        {
          headers: {
            "Authorization": `Bearer ${keycloak.token}`,
          },
        }
      );
      setExecutives(response.data || []);
      setExecutivesLoaded(true);
    } catch (error) {
      console.error("Error fetching executives:", error);
      alert("Failed to load executives.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (executive) => {
    console.log("leadId:", leadId);
    console.log("executive:", executive);

    let userId = executive?.userId || executive?.id || executive;
    console.log("Final userId used:", userId);

    if (!userId) {
      console.error("userId is missing!");
      alert("Executive userId is missing!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8081/legal-wings-management/leads/${leadId}/assign?userId=${userId}`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${keycloak.token}`,
          },
        }
      );
      alert(`Lead assigned successfully!`);
      if (onAssignSuccess) onAssignSuccess();
      onClose();
    } catch (error) {
      console.error("Error assigning lead:", error);
      alert("Failed to assign lead. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Assign Executive</h3>

        {loading ? (
          <p>Loading executives...</p>
        ) : (
          <ul>
            {executives.length > 0 ? (
              executives.map((executive, index) => (
                <li key={index} className="executive-row">
                  <span>{executive.name}</span>
                  <button onClick={() => handleAssign(executive)}>Assign</button>
                </li>
              ))
            ) : (
              <p>No executives found.</p>
            )}
          </ul>
        )}

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AssignLead;
