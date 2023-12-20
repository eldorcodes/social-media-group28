import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Header from "./Header";
import { useParams } from 'react-router-dom';
import { onValue, ref, getDatabase, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { IoMdImages } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { LanguageContext } from "./Language";

export default function Chatroom() {
    const [otherUser,setOtherUser] = useState(null);
    const [message,setMessage] = useState('');
    const [chat,setChat] = useState([]);
    const [users,setUsers] = useState([]);

    const { english,setEnglish } = React.useContext(LanguageContext);


    const scrollRef = useRef(null);

    const currentUserId = getAuth().currentUser.uid;

    const param = useParams();
    console.log(param.id);
    const db = getDatabase();

    function autoScroll(){
        // scrollRef?.current?.scrollIntoView({ behavior:'smooth',block:'end' })
       window.scrollTo({ top:10000,behavior:'smooth' })
    }


function fetchAllChats(){
    onValue(ref(db,`chat/`),(chatsData) => {
        let chatsArray = []
       chatsData.forEach((chat) => {
        chatsArray.push(chat.val())
       })
       console.log(chatsArray)
       setChat(chatsArray)
   })
}

function fetchUsers(){
    onValue(ref(db,`users`),(usersData) => {
        let usersArray = []
        usersData.forEach((user) => {
            usersArray.push(user.val())
            if (param.id == user.val().id) {
                // other user
                console.log(user.val())
                setOtherUser(user.val())
            }
        })
        setUsers(usersArray);
    })
}


useEffect(() => {
    autoScroll()
},[chat])



useEffect(() => {
   fetchUsers()
   fetchAllChats()
},[])


async function translator(from, to, text) {
    let res = '';
    const url =
      "https://google-translate113.p.rapidapi.com/api/v1/translator/text";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "98405912eamshd9518930844d7ecp11ec3bjsnea7984244fd0",
        "X-RapidAPI-Host": "google-translate113.p.rapidapi.com",
      },
      body: new URLSearchParams({
        from: from,
        to: to,
        text: text,
      }),
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response.json();
     console.log(result.trans);
     
     res = result.trans

    } catch (error) {
      console.error(error);
    }

    return res
  }


 async function fetchData(t){
    let text = await translator('en','uz',t);
    console.log(text)
    return text
  }



async function handleSubmit(e){
    e.preventDefault();

    let translatedText = await fetchData(message);

    push(ref(db,`chat/`),{
        from:currentUserId,
        to:otherUser?.id,
        message:translatedText,
        originalMessage:message,
        date:new Date().toString()
    })
    setMessage('')
    scrollRef.current.scrollIntoView({ behavior:'smooth',block:'end' })
}

function findUsername(id){
    let name = '';
    users.forEach((user) => {
        if (user.id == id) {
            name = user.username;
        }
    })
    return name;
}

function chooseImage(){
    alert('Ready to upload image..')
}


  return (
  <>
  <Header fixed={'fixed'} title={english?"Chatroom":"Suhbatxona"} />
  <div id="live"></div>
    <div 
    ref={scrollRef}
    id="messages">
        <h1 className="center">{otherUser?.username} vs {findUsername(currentUserId)}</h1>
        {
            chat?.map((chat,i) => {
                if (chat?.from == currentUserId && chat?.to == otherUser?.id || chat?.from == otherUser?.id && chat?.to == currentUserId) {
                    return <div key={i} className={chat.from == currentUserId ? "message2" : "message"}>
                        <div className="user-info">
                            <img src={require('./user-286.png')} alt="img" className="avatar" />
                            <p>{findUsername(chat?.from)}</p>
                        </div>
                        <p className={chat?.from == currentUserId ? "sender":"receiver"}>
                        {chat?.message}
                        </p>
                        <small>{new Date(chat?.date).toDateString()}</small>
                    </div>
                }
            })
        }
    </div>
    <form 
    onSubmit={handleSubmit}
    className="chat-form">
        <input 
        onChange={(e) => setMessage(e.target.value)}
        className="message-input" 
        type="text" 
        placeholder={english ? 'Type message...' : 'Xat yozish..'}
        value={message}
        required
        />
        <button onClick={chooseImage} type="button" className="image-button">
        <IoMdImages size={20} />
        </button>
        <button type="submit" className="message-button">
            <IoSend size={20} />
        </button>
    </form>
  </>
 
  )
}
