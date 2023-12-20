import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import './firebase';

export default function Password(){
    const [email,setEmail] = useState('');
    const [errorMessage,setErrorMessage] = useState('');
    const [successMessage,setSuccessMessage] = useState('');

  function handleSubmit(e){
       e.preventDefault();
       const auth = getAuth();
       sendPasswordResetEmail(auth, email)
         .then(() => {
           setSuccessMessage(`Password reset link has been emailed`)
           setErrorMessage('')
         })
         .catch((error) => {
           const errorMessage = error.message;
           setErrorMessage(`${errorMessage}`)
           setSuccessMessage('')
           console.log(error)
         });
    }

    return (
       <div className="signup-div">
         <h1>Reset password</h1>
         {
            errorMessage && <p className="red">{errorMessage}</p>
         }
         {
            successMessage && <p>{successMessage}</p>
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
            <button>Reset Password</button>
         </form>
         <br />
         <a href="/">Need to Login?</a>
       </div>
    )
    
}