import React from "react";
import { LanguageContext } from "./Language";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { getAuth, signOut } from "firebase/auth";

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


  return (
    <Navbar fixed="top" data-bs-theme="dark" bg="dark" expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="#home">{props.title}</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">{pText}</Nav.Link>
          <Nav.Link href="/users">{chText}</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="/chatroom">{chatRoomTitle}</NavDropdown.Item>
            <NavDropdown.Item href="/contact">
              Contact us
            </NavDropdown.Item>
            <NavDropdown.Item>
            <button onClick={updateLanguage}>{english ? 'EN':'UZ'}</button>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => signOut(getAuth())}>
              {logoutText}
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )

}
