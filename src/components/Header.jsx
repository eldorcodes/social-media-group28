import React from "react";
import { LanguageContext } from "./Language";

export default function Header(props) {
  const { 
    english,
    setEnglish,
    translatedText,
    pText,
    setPText,
    chText,
    setChText,
    chatRoomTitle,
    setChatRoomTitle,
    logoutText,
    setLogoutText
   } = React.useContext(LanguageContext);


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

 async function updateLanguage(){
    setEnglish(!english);
    let translatedText = await fetchData(pText);
    let chTranbslated = await fetchData(chText);
    let chatRoomTitleTranslateds = await fetchData(chatRoomTitle);
    let logoutTextTranslated = await fetchData(logoutText);
    setLogoutText(logoutTextTranslated);
    setPText(translatedText);
    setChText(chTranbslated);
    setChatRoomTitle(chatRoomTitleTranslateds);
  }



  return <div className={`header ${props.fixed}`}>
    <h1>{props.title}</h1>
    <a className="a" href="/">
      {
        pText
      }
    </a>
    <a className="a" href="/users">
      {
       chText
      }
    </a>
    <a className="a" href="/chatroom">
      {
        chatRoomTitle
      }
    </a>
    <a className="a" href="/logout">
      {
        logoutText
      }
    </a>
    <a className="a">
      <button onClick={updateLanguage}>{english ? 'EN':'UZ'}</button>
    </a>
  </div>
}
