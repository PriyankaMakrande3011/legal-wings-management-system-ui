import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom'; // For navigation
import { AiOutlineUser } from "react-icons/ai";
import { RiDashboardLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import Slider from './Pages/Slider';
import Header from './Pages/Header'

const Dashboard = () => {
    const navigate = useNavigate();

    
    const teams = [
        { name: 'Calling Team', path: '/calling-team' },
        { name: 'Executive Team', path: '/executive-team' },
        { name: 'Backend Team', path: '/backend-team' },
        { name: 'Account Team', path: '/accountancy-team' },
        { name: 'Marketing Team', path: '/marketing-team' },
    ];

    const handleTeamClick = (path) => {
        navigate(path);
    };

    const handleClientClick = () => {
        navigate('/clients'); // Navigate to the Client Page
    };

    return (
        <div className="dashboard-container">
            
  <Slider/>
  <div style={{width:"100%"}}>
  <Header/>
            {/* Main Content */}
            <div className="main-content">
            <div className="flex justify-center w-full items-center py-2">
            <div className="text-primary text-sm powered-heading">
                <h4>Powered By Legal Wings</h4>
            </div>
            
        </div>
               <div className='heading-grid'>
                <h1>Welcome to the LegalWings Rent Agreement System</h1>
               </div>
                
                <div className="user-grid">
                    {teams.map((team, index) => (
                        <div
                            key={index}
                            className="team-card"
                            onClick={() => handleTeamClick(team.path)}
                        >
                            <AiOutlineUser   size={60} />
                            <p style={{fontSize:"20px", marginTop:"10px",fontWeight:"bold"}}>{team.name}</p>
                        </div>
                    ))}
                </div>
              <div>
                
              </div>
            </div>
            </div>
        </div>
    );
};

export default Dashboard;
