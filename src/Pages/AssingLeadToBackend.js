import React from "react";
import axios from "axios";

import { useKeycloak } from "@react-keycloak/web";

const AssignLeadToBackend = ({ isOpen, onClose, leadId, onAssignSuccess }) => {
  const { keycloak } = useKeycloak();

  const handleAssignToBackend = async () => {
    const confirmAssign = window.confirm(
      "Do you want to send this lead to backend team?"
    );

    if (!confirmAssign) return; // If No, exit

    try {
      await axios.put(
        `https://legalwingcrm.in:8081/legal-wings-management/leads/${leadId}/approve`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${keycloak.token}`,
          },
        }
      );

      alert("Lead successfully sent to backend team!");
      if (onAssignSuccess) onAssignSuccess();
      onClose();
    } catch (error) {
      console.error("Error sending lead to backend:", error);
      alert("Failed to send lead to backend. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Send Lead to Backend</h3>

        <p>Are you sure you want to send this lead to the backend team?</p>

        <div className="button-group">
          <button className="yes-btn" onClick={handleAssignToBackend}>
            Yes
          </button>
          <button className="no-btn" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadToBackend;
