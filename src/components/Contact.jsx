import React, { useState, useEffect } from 'react'
import Header from './Header';

export default function Contact() {
    const [message,setMessage] = useState('');
    const [messages,setMessages] = useState([]);

    function handleSubmit(e){
        e.preventDefault();
        fetch('http://localhost:5555/message',{
            headers:{
                'Content-Type':'Application/json'
            },
            method:'POST',
            body:JSON.stringify({message})
        })
        .then(() => console.log('Message sent to server success'))
        .catch(err => console.log(err))
    }

    useEffect(() => {
        fetch('http://localhost:5555/messages')
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch(err => console.log(err))
    },[messages])

    function deleteThisItem(msg){
        fetch('http://localhost:5555/remove',{
            headers:{
                'Content-Type':'Application/json',
            },
            method:'POST',
            body:JSON.stringify(msg)
        })
    }

  return (
    <>
    <Header title="Contact us" />
    <div style={{padding:40,marginTop:50}}>
        <h1>To Do List</h1>
        <form 
        onSubmit={handleSubmit}
        action="">
            <input 
            onChange={(e) => setMessage(e.target.value)}
            type="text" 
            placeholder='Message...' />
            <button>Add</button>
        </form>
        {
            messages?.map((msg,index) => (
                <p key={index}>{msg.message} <button onClick={() => deleteThisItem(msg)}>x</button></p>
            ))
        }
    </div>
    </>
  )
}
