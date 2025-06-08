import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser } from "react-icons/ai";
import Slider from './Pages/Slider';
import Header from './Pages/Header';
import { useUser } from './Pages/UserContext'; // ✅ Access user info
import { useKeycloak } from "@react-keycloak/web";
const Dashboard = () => {
    const navigate = useNavigate();
     const { keycloak } = useKeycloak();
    const { user } = useUser();

    if (!user) {
        return <div>Loading...</div>;
    }

    console.log("User:", user);
    console.log("User roles:", user.roles);

    const teams = [
        { name: 'Calling Team', path: '/calling-team', role: 'calling' },
        { name: 'Executive Team', path: '/executive-team', role: 'executive' },
        { name: 'Backend Team', path: '/backend-team', role: 'backend' },
        { name: 'Account Team', path: '/accountancy-team', role: 'accounting' },
        { name: 'Marketing Team', path: '/marketing-team', role: 'marketing' },
    ];

    const visibleTeams = user.roles.includes('admin')
        ? teams
        : teams.filter(team => user.roles.includes(team.role));

    const handleTeamClick = (path) => navigate(path);

    return (
        <div className="dashboard-container">
            <Slider />
            <div style={{ width: "100%" }}>
                <Header />
                <div className="main-content">
                    <div className="text-primary text-sm powered-heading">
                        <h4>Powered By Legal Wings</h4>
                    </div>
                    <div className='heading-grid'>
                        <h1>Welcome to the LegalWings Rent Agreement System</h1>
                    </div>
                    <div className="user-grid">
                        {visibleTeams.map((team, index) => (
                            <div key={index} className="team-card" onClick={() => handleTeamClick(team.path)}>
                                <AiOutlineUser size={60} />
                                <p style={{ fontSize: "20px", marginTop: "10px", fontWeight: "bold" }}>
                                    {team.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
