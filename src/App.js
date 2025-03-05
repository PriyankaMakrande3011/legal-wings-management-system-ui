

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import ClientPage from './Pages/ClientPage';
import CallingTeam from './Pages/CallingTeam';
import ExecativeTeam from "./Pages/Execative"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slider from './Pages/Slider';
import { useState } from 'react';
import AddClient from './Pages/AddClient';
import Execative from './Pages/Execative';

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
        <Route path="/executive-team" element={<Execative />} />
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
