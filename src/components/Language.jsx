import React, { useMemo, useState } from 'react'

export const LanguageContext = React.createContext();

export default function Language(props) {
    const [english,setEnglish] = React.useState(true);
    const [russian,setRussian] = React.useState(false);
    const [translatedText,setTranslatedText] = React.useState('');
    const [pText,setPText] = React.useState('Dashboard');
    const [chText,setChText] = React.useState('Users');
    const [chatRoomTitle,setChatRoomTitle] = React.useState('Chat room');
    const [logoutText,setLogoutText] = useState('Sign Out');

let globalData = {
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
}


  return (
   <LanguageContext.Provider value={globalData}>
    {props.children}
   </LanguageContext.Provider>
  )
}
