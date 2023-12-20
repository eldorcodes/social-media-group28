import React, { useState } from "react";
import * as firebase from 'firebase/auth';
import './firebase';
import { Link } from 'react-router-dom';

export default function Login(){
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

  function handleSubmit(e){
       e.preventDefault();
       const auth = firebase.getAuth();
       firebase.signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
           // Signed in 
           const user = userCredential.user;
           console.log(user)
         })
         .catch((error) => {
           const errorCode = error.code;
           const errorMessage = error.message;
           setErrorMessage(`${errorCode}`)
         });
    }

    return (
       <div className="signup-div">
         <h1>Log In</h1>
         {
            errorMessage && <p className="red">{errorMessage}</p>
         }
         <form 
         onSubmit={handleSubmit}
         id="signup">
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
            <button>Sign In</button>
         </form>
         <br />
         <a href="/signup">Need an Account?</a>
         <br />
         <Link to={'/password'}>Forgot password?</Link>
       </div>
    )
    
}