import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import Signup from './components/Signup';
import Profile from './components/Profile';
import { useState, useEffect } from 'react';
import './components/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import Password from './components/Password';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Users from './components/Users';
import Chatroom from './components/Chatroom';
import Language from './components/Language';

function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth,(user) => {
      if (user) {
        setIsLoggedIn(true)
      }else{
        setIsLoggedIn(false)
      }
    })
  },[isLoggedIn])

  return (
   <Language>
       <BrowserRouter>
   {isLoggedIn ? 
   <Routes>
    <Route path='/' element={<Profile/>} />
    <Route path='/users' element={<Users/>} />
    <Route path='/chatroom/:id' element={<Chatroom />} />
    <Route path='*' element={<Profile/>} />
   </Routes> 
   :
   <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/password' element={<Password/>} />
    </Routes>
    }
    </BrowserRouter>
   </Language>
  );
}

export default App;
