import React, { useState } from "react";
import * as firebase from 'firebase/auth';
import { push, ref, getDatabase } from 'firebase/database';

export default function Signup(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errorMessage,setErrorMessage] = useState('');


    function handleSubmit(e){
       e.preventDefault();
       const auth = firebase.getAuth();
       firebase.createUserWithEmailAndPassword(auth,email,password)
       .then((userCredential) => {
         const user = userCredential.user;
         console.log('Success',user)
         // save data into Firebase Realtime Database
         push(ref(getDatabase(),`users`),{
            username,
            email,
            date:new Date().toString(),
            id:user.uid,
            isDriver:false,
            status:false
         })
       })
       .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
        setErrorMessage(errorCode)
       })
    }

    return (
       <div className="signup-div">
         <h1>Register</h1>
         {
            errorMessage && <p className="red">{errorMessage}</p>
         }
         <form 
         onSubmit={handleSubmit}
         id="signup">
            <label htmlFor="Username">Username</label>
            <input 
            onChange={(e) => setUsername(e.target.value)}
            type="text" 
            placeholder="Enter username" 
            required
            />
            <label htmlFor="Email">Email</label>
            <input 
            onChange={(e) => setEmail(e.target.value)}
            type="text" 
            placeholder="Enter email" 
            required
            />
            <label htmlFor="Password">Password</label>
            <input 
            onChange={(e) => setPassword(e.target.value)}
            type="password" 
            placeholder="Enter password" 
            required
            />
            <button>Sign Up</button>
         </form>
         <br />
         <a href="/">Need to Login?</a>
       </div>
    )
    
}