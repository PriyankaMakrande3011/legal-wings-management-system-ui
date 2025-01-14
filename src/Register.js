// import {createUserWithEmailAndPassword} from 'firebase/auth';
// import { useState } from "react";
// import {auth,db} from "./Firebase";
// import { setDoc,doc } from 'firebase/firestore';


// function Register() {
//     const [email,setEmail]=useState("");
//     const [password,setPassword]=useState("");
//     const [fname,setFname]=useState("");
//     const [lname,setLname]=useState("");

//     const handleRegister = async (e)=>{
//         e.preventDefault();
//         try{
//             createUserWithEmailAndPassword(auth,email,password);  
//             const user=auth.currentUser;
//             console.log(user);
//             if(user){
//                 await setDoc(doc(db,"Users",user.uid), {
//                     email: user.email,
//                     firstName: fname,
//                     lastName: lname,
//                 });
//             }
//             console.log("done");
            
//         } catch (error){
//            console.log(error.message);
//         }
//     }
//     return (
//     <form onSubmit={handleRegister}>
//         <h3>Sing Up</h3>
//         <div className="mb-3">
//             <label>First Name</label>
//             <input type="text"
//             className="from-control"
//             placeholder="First Name"
//             value={fname}
//             onChange={(e) => setFname(e.target.value)}/>
         
//         </div>
//         <div className="mb-3">
//             <label>Last Name</label>
//             <input type="text"
//             className="from-control"
//             placeholder="Last Name"
//             value={lname}
//             onChange={(e) => setLname(e.target.value)}/>
         
//         </div>
//         <div className="mb-3">
//             <label>Email address</label>
//             <input type="email"
//             className="from-control"
//             placeholder="Enter Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}/>
         
//         </div>
//         <div className="mb-3">
//             <label>Password</label>
//             <input type="password"
//             className="from-control"
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}/>
         
//         </div>
//         <button>Sing Up</button>
//     </form>
//     )
// }

// export default Register;