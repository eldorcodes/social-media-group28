import { getDatabase, onValue, ref } from "firebase/database";
import React, { useState, useEffect } from "react";
import Logo from './user-286.png';
import Header from "./Header";
import Stack from 'react-bootstrap/Stack';

export default function Users() {
    const [users,setUsers] = useState([]);

    useEffect(() => {
        onValue(ref(getDatabase(),`users`),(usersData) => {
            let usersArray = []
            usersData.forEach((user) => {
                usersArray.push(user.val())
            })
            setUsers(usersArray)
        })
    },[])

    function getUsername(id){
        let username = ''
        users.forEach((user) => {
            if (user.id == id) {
                username = user.username
            }
        })
        return username
    }

  return <>
  <Header title="Users" />
  <div style={{padding:20,marginTop:50}}>
    <Stack gap={3}>
    {
        users?.map((user,index) => {
            return (
                    <a className="option" href={`/chatroom/${user.id}`}>
                    <div className="p-2" style={{display:'flex'}}
                    key={index}>
                        <img src={Logo} alt="" style={{width:75,height:75}} />
                        <div>
                            <h3>{getUsername(user.id)}</h3>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    </a>
            )
        })
    }
    </Stack>
  </div>
  </>
}
