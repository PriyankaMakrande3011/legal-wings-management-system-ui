import React, { useState } from "react";
import "./AddClient.css"; 
import { useForm } from "react-hook-form"

const AddClientModal = ({ isOpen, onClose }) => {
  

 
  
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()
  const onSubmit = (data) => console.log(data);
  return (
    
    <div className="addclient-container">
<form onSubmit={handleSubmit(onSubmit)}>

</form>

    </div>
  );
};

export default AddClientModal;
