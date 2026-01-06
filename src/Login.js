
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import React,{useState} from 'react';
// import { auth } from './Firebase';
// import { toast } from 'react-toastify';
// function Login() {
//     const [email,setEmail]=useState("");
//     const [password,setPassword]=useState("");

//     const handleSubmit = async (e) =>{
//         // e.preventDefault();
//         try{
//  await signInWithEmailAndPassword(auth,email,password);
//  console.log("done")
//  toast.success("User logged in Successfully",{
//     position: "top-center",
//  })
//         } catch (error){
// console.log("failed");

//         }
//     }
//     return (
//        <form  onSubmit={handleSubmit}>
//         <h3>Login </h3>
//         <div className="mb-3">
//             <label>Email address</label>
//             <input type="email"
//             className="from-control"
//             placeholder="Enter Email"
//             autocomplete="off" 
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}/>

//         </div>
//         <div className="mb-3">
//             <label>Password</label>
//             <input type="password"
//             className="from-control"
//             placeholder="Enter password"
//             autocomplete="new-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}/>

//         </div>

//         <button>Login in</button>
//        </form>
//     )
// }

// export default Login;

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './images/logo.png.png';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // For demo purposes, allow any login
        if (email && password) {
            toast.success("User logged in successfully", {
                position: "top-center",
            });
            navigate('/dashboard');
            return;
        }
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("done");
            toast.success("User logged in successfully", {
                position: "top-center",
            });
            navigate('/dashboard');
        } catch (error) {
            console.log("failed");
            toast.error("Login failed. Please check your credentials.", {
                position: "top-center",
            });
        }
    };

    return (
        <div className='main-container'>
        <div className='main'>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h3>Login</h3>
                    {logo && <img src={logo} alt="Legal Wings Logo" style={{width: '150px', marginBottom: '20px'}} />}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter Email"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter Password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="login-button">Login</button>
                </form>
            </div>
                 <div className='hero-div'>
                 <img src='https://ioux.in/images/rent-agreement-banner.png?v=4.0.8' />
                </div>
            </div>
            </div>
            );
}

            export default Login;
