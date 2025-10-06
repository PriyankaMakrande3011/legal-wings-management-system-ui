// import React, { useState, useEffect } from 'react'
// import { useNavigate ,useLocation, NavLink} from 'react-router-dom'
// import logo from "../images/logo.png.png";
// import { Link } from 'react-router-dom';
// import {motion} from 'framer-motion'
// import { FaRegUser } from "react-icons/fa";
// import { FaBars } from "react-icons/fa";
// import { MdDashboard } from "react-icons/md";
// import { AiOutlineDown, AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
// import '../Pages/Slider.css'


// const Slider = ({child}) => {
//     const [isSiderOpen,setIsSiderOpen]=useState(false)
//     const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
//     const navigate = useNavigate();
//     const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//     const location = useLocation();

//     const handleResize = () => {
//         setIsMobile(window.innerWidth <= 768);
//         if (window.innerWidth > 768) {
//           setIsSiderOpen(true); // Keep open on desktop
//         } else {
//           setIsSiderOpen(false); // Collapse on mobile
//         }
//       };
    
//       useEffect(() => {
//         handleResize();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//       }, []);

// const toggleSider =() =>{
//     setIsSiderOpen(!isSiderOpen)

// }    



// const toggleDataManagement = () => {
//     setIsDataManagementOpen(!isDataManagementOpen);
// };

// const handleClientClick = () => {
//     navigate('/clients'); // Navigate to the Client Page
// };

// const teams = [
//     { name: 'Dashboard', path: '/dashboard',icon:<MdDashboard /> },
//     { name: 'Calling Team', path: '/calling-team',icon:<FaRegUser /> },
//     { name: 'Executive Team', path: '/executive-team' ,icon:<FaRegUser /> },
//     { name: 'Backend Team', path: '/backend-team',icon:<FaRegUser />  },
//     { name: 'Account Team', path: '/account-team' ,icon:<FaRegUser /> },
//     { name: 'Marketing Team', path: '/marketing-team',icon:<FaRegUser />  },
//     {
//         name: 'Data Management',
//         path: '/data-management',
//         icon: isDataManagementOpen ? <AiOutlineDown /> : <AiOutlineRight />,
//         subRoutes: [
//             { name: 'Client', path: '/clients', icon: <FaRegUser /> },
//         ],
//     },
// ];
  
// const showAnimation = {
//     hidden: {
//         width : 0,
//         opacity: 0,
//         transition:{
//             duration:0.5,
//         }
//     },
//     show:{
//         width: "auto",
//         opacity: 1,
//         transition:{
//             duration:0.2,
//         }
//     }
// }
//   return (


// <div className='slidermain-container'>
// {isMobile && (
//         <div className="mobile-header">
//           <FaBars className="hamburger-icon" onClick={toggleSider} />
//         </div>
//       )}
//     <motion.div 
//                 onMouseEnter={() => setIsSiderOpen(true)}
//                 onMouseLeave={() => setIsSiderOpen(false)}
//                 initial={{ width: isMobile ? 0 : "80px" }}
//                 animate={{ width: isSiderOpen ? "250px" : (isMobile ? 0 : "80px") }}
//                 transition={{ type: "spring", stiffness: 120, damping: 12 }}
//                   className='sidebar'
//                 >
//         <div className='sidebar-logo'>
//            <div className='sidebar-logo'>
// {isSiderOpen && <img src={logo} alt="Logo" />}
// </div>
       
//         </div>

// <section className='sidebar-content'>
//     {teams.map((team, index) => (
//         <div key={team.name}>
//             {/* Add <hr> before "Data Management" */}
//             {team.name === 'Data Management' && <hr className='sidebar-divider' />}
            
//             {/* If no subRoutes, render normally */}
//             {!team.subRoutes ? (
//                 <NavLink to={team.path} className='sidebar-link'>
//                     <div className='sidebar-icon'>{team.icon}</div>
//                     {isSiderOpen && (
//                         <motion.div className='sidebar-text'>
//                             {team.name}
//                         </motion.div>
//                     )}
//                 </NavLink>
//             ) : (
//                 <div>
//                     {/* Only show parent route if the sidebar is expanded */}
//                     {isSiderOpen && (
//                         <div
//                             className='sidebar-link'
//                             onClick={toggleDataManagement}
//                         >
//                             <div className='sidebar-icon'>
//                                 {isDataManagementOpen ? <AiOutlineDown /> : <AiOutlineRight />}
//                             </div>
//                             <motion.div className='sidebar-text'>
//                                 {team.name}
//                             </motion.div>
//                         </div>
//                     )}

//                     {/* Always show subRoutes in collapsed or expanded state */}
//                     {(isSiderOpen && isDataManagementOpen || !isSiderOpen) && (
//                         <motion.div
//                             className={isSiderOpen ? 'dropdown-container' : ''}
//                             initial={{ height: 0 }}
//                             animate={{ height: isSiderOpen ? "auto" : "initial" }}
//                             exit={{ height: 0 }}
//                         >
//                             {team.subRoutes.map((subRoute) => (
//                                 <NavLink
//                                     to={subRoute.path}
//                                     key={subRoute.name}
//                                     className='sidebar-link dropdown-link'
//                                 >
//                                     <div className='sidebar-icon'>{subRoute.icon}</div>
//                                     {isSiderOpen && (
//                                         <div className='sidebar-text'>
//                                             {subRoute.name}
//                                         </div>
//                                     )}
//                                 </NavLink>
//                             ))}
//                         </motion.div>
//                     )}
//                 </div>
//             )}
//         </div>
//     ))}
// </section>




//     </motion.div>
//     {!isMobile && (
//         <motion.div
//           animate={{ left: isSiderOpen ? "250px" : "80px" }}
//           transition={{ type: "spring", stiffness: 120, damping: 12 }}
//           className="sidebar-toggle"
//           onClick={toggleSider}
//         >
//           {isSiderOpen ? <AiOutlineLeft size={20} /> : <AiOutlineRight size={20} />}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Slider



import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import logo from "../images/logo.png.png";
import { motion } from 'framer-motion';
import { FaRegUser, FaBars } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { AiOutlineDown, AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import '../Pages/Slider.css';
import { useUser } from "../Pages/UserContext"; 
import { useKeycloak } from "@react-keycloak/web";

const Slider = ({ child }) => {
  const [isSiderOpen, setIsSiderOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
 const { keycloak } = useKeycloak();
  const { user } = useUser();

  
 
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    if (window.innerWidth > 768) {
      setIsSiderOpen(true); // Open on desktop
    } else {
      setIsSiderOpen(false); // Collapse on mobile
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSider = () => {
    setIsSiderOpen(!isSiderOpen);
  };

  const toggleDataManagement = () => {
    setIsDataManagementOpen(!isDataManagementOpen);
  };

 const teams = [
 
  { name: 'Dashboard', path: '/dashboard', role: 'all',icon: <MdDashboard /> },
  { name: 'Calling Team', path: '/calling-team', role: 'calling', icon: <FaRegUser /> },
  { name: 'Executive Team', path: '/executive-team', role: 'executive', icon: <FaRegUser /> },
  { name: 'Backend Team', path: '/backend-team', role: 'backend', icon: <FaRegUser /> },
  { name: 'Account Team', path: '/account-team', role: 'accounting', icon: <FaRegUser /> },
  { name: 'Marketing Team', path: '/marketing-team', role: 'marketing', icon: <FaRegUser /> },
  {
    name: 'Data Management',
    path: '/data-management',
    role: 'admin',
    icon: isDataManagementOpen ? <AiOutlineDown /> : <AiOutlineRight />,
    subRoutes: [
      { name: 'Client', path: '/clients', icon: <FaRegUser /> },
    ],
  },
];

const visibleTeams = user.roles.includes('admin')
  ? teams
  : teams.filter(team =>
      team.role === 'all' || user.roles.includes(team.role)
    );


const handleTeamClick = (path) => navigate(path);

  return (
    <div className='slidermain-container'>
      {isMobile && (
        <div className="mobile-header">
          <FaBars className="hamburger-icon" onClick={toggleSider} />
        </div>
      )}

      <motion.div
        onMouseEnter={() => setIsSiderOpen(true)}
        onMouseLeave={() => setIsSiderOpen(false)}
        initial={{ width: isMobile ? 0 : "80px" }}
        animate={{ width: isSiderOpen ? "250px" : (isMobile ? 0 : "80px") }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className='sidebar'
      >
        <div className='sidebar-logo'>
          {isSiderOpen && <img src={logo} alt="Logo" />}
        </div>

        <section className='sidebar-content'>
          {visibleTeams.map((team, index) => (
            <div key={team.name}>
              {team.name === 'Data Management' && <hr className='sidebar-divider' />}

              {!team.subRoutes ? (
                <NavLink to={team.path} className='sidebar-link'>
                  <div className='sidebar-icon'>{team.icon}</div>
                  {isSiderOpen && (
                    <motion.div className='sidebar-text'>
                      {team.name}
                    </motion.div>
                  )}
                </NavLink>
              ) : (
                <div>
                  {isSiderOpen && (
                    <div
                      className='sidebar-link'
                      onClick={toggleDataManagement}
                    >
                      <div className='sidebar-icon'>
                        {team.icon}
                      </div>
                      <motion.div className='sidebar-text'>
                        {team.name}
                      </motion.div>
                    </div>
                  )}
                  {(isSiderOpen && isDataManagementOpen || !isSiderOpen) && (
                    <motion.div
                      className={isSiderOpen ? 'dropdown-container' : ''}
                      initial={{ height: 0 }}
                      animate={{ height: isSiderOpen ? "auto" : "initial" }}
                      exit={{ height: 0 }}
                    >
                      {team.subRoutes.map((subRoute) => (
                        <NavLink
                          to={subRoute.path}
                          key={subRoute.name}
                          className='sidebar-link dropdown-link'
                        >
                          <div className='sidebar-icon'>{subRoute.icon}</div>
                          {isSiderOpen && (
                            <div className='sidebar-text'>
                              {subRoute.name}
                            </div>
                          )}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>
      </motion.div>

      {!isMobile && (
        <motion.div
          animate={{ left: isSiderOpen ? "250px" : "80px" }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
          className="sidebar-toggle"
          onClick={toggleSider}
        >
          {isSiderOpen ? <AiOutlineLeft size={20} /> : <AiOutlineRight size={20} />}
        </motion.div>
      )}
    </div>
  );
};

export default Slider;
