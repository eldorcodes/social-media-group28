import React, { Component } from "react";
import { getAuth, signOut } from 'firebase/auth';
import Header from "./Header";
import Footer from "./Footer";
import { onValue, ref, getDatabase } from 'firebase/database';
import Logo from './user-286.png';

function UserInfo(props) {
  function logUserOut(){
    signOut(getAuth())
  }

  async function getData(){
    let dataRaw = await fetch(`http://localhost:5555/data`,{
      headers:{'Content-Type':'Application/json'},
      method:'POST'
    });
    let data = dataRaw.json();
    data.then((res) => console.log(res))
    .catch(err => console.log(err))
  }


  return (
    <>
    <img src={Logo} alt="avatar" />
    <h1>{props.username}</h1>
    <p>{props.email}</p>
    <button onClick={logUserOut}>Sign Out</button>
    <br />
    <button onClick={getData}>GET DATA</button>
    </>
  )
}

export default class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      uid:null,
      username:null,
      email:null,
      date:null
    };
    this.logUserOut = this.logUserOut.bind(this);
  }
  logUserOut(){
    const auth = getAuth()
    signOut(auth)
  }
  componentDidMount(){
    let db = getDatabase()
    onValue(ref(db,`users`),(users) => {
      users.forEach((user) => {
        if (user.val().id == getAuth().currentUser.uid) {
          this.setState({
            uid:user.val().id,
            username:user.val().username,
            email:user.val().email,
            date:user.val().date
          })
        }
      })
    })
  }

 
  render() {
    return (
    <div className="profile">
      <Header title={'Profile'} />
      <UserInfo 
        uid={this.state.uid}
        username={this.state.username} 
        email={this.state.email} 
        />
        <a href="/users">Users</a>
    </div>
    )
  }
}
