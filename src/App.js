

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import ClientPage from './Pages/ClientPage';
import CallingTeam from './Pages/CallingTeam';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slider from './Pages/Slider';
import { useState } from 'react';
import AddClient from './Pages/AddClient';
import Executive from './Pages/Execative';
import BackendTeam from './Pages/BackendTeam';
import BackendDetails from './Pages/BackendDetails';
import AddLeadPage from './Pages/AddLeadPage';
import AssignLead from './Pages/AssingLead';
import ExecutiveAddDetails from './Pages/ExecativeAddDetails';
import Edit from './Pages/Edit';
import EditClient from './Pages/EditClient';

function App() {


const teams = [
  { name: 'Calling Team', path: '/calling-team' },
  { name: 'Executive Team', path: '/executive-team' },
  { name: 'Backend Team', path: '/backend-team' },
  { name: 'Account Team', path: '/account-team' },
  { name: 'Marketing Team', path: '/marketing-team' },
];

  return (
    <div className="App">
     <Router>
      
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register />}/>
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard */}
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/addclients" element={<AddClient />} />
        <Route path="/calling-team" element={<CallingTeam />} />
        <Route path="/executive-team" element={<Executive />} />
        <Route path="/backend-team" element={<BackendTeam />} />
        <Route path="/lead-details/" element={<BackendDetails />} />
        <Route path="/assing-lead" element={<AssignLead />} />
        <Route path="/add-Executive-details" element={<ExecutiveAddDetails/>} />
<Route path="/add-lead" element={<AddLeadPage />} />
   <Route path="/edit" element={<Edit />} />
    <Route path="/edit-client" element={<EditClient />} />

       
        {/* {teams.map((team, index) => (
          <Route
            key={index}
            path={team.path}
            element={<CallingTeam teamName={team.name} />}
          />
        ))} */}
      </Routes>
      
      <ToastContainer/>
     </Router>
    
    </div>
  );
}

export default App;
