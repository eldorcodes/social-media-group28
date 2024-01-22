import React, { useEffect, useState, useRef, useLayoutEffect, useCallback, useMemo } from "react";
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
    const [chosenLanguage,setChosenLanguage] = useState('en');
    const [worldLanguages,setWorldLanguages] = useState([]);

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


const fetchAllChats = useCallback(() => {
    onValue(ref(db,`chat/`),(chatsData) => {
        let chatsArray = []
       chatsData.forEach((chat) => {
        chatsArray.push(chat.val())
       })
       console.log(chatsArray)
       setChat(chatsArray)
   })
},[chat])

const fetchUsers = useCallback(() => {
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
},[users])


useEffect(() => {
    autoScroll()
},[chat])






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
    let text = await translator('uz',chosenLanguage,t);
    console.log(text)
    return text
  }

  // useCallback vs useMemo

   const getLanguages = useCallback(async () => {
    const url = 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages';
const options = {
	method: 'GET',
	headers: {
		'Accept-Encoding': 'application/gzip',
		'X-RapidAPI-Key': '98405912eamshd9518930844d7ecp11ec3bjsnea7984244fd0',
		'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.json();
	console.log(result);
    console.log(result?.data)
    setWorldLanguages(result?.data?.languages)
} catch (error) {
	console.error(error);
}
   },[worldLanguages])



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

console.log(chosenLanguage)

useEffect(() => {
    fetchUsers()
    fetchAllChats()
    getLanguages()
 },[])



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
        <select onChange={(e) => setChosenLanguage(e.target.value)}
        className="language" name="" id="">
            {
                worldLanguages?.map((lang,index) => (
                    <option key={index} value={lang?.language}>{lang?.language}</option>
                ))
            }
        </select>
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
