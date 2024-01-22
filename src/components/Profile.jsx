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


const myPromise = async () => {
  let x = 10
  if (x == 10) {
    return 'success10'
  }else{
    return 'erro10r'
  }
}

async function getCountry(){
  if (12 == 12) {
    return 'USA'
  }else{
    return 'Failed to fetch'
  }
}

myPromise()
.then((res) => {
  console.log(res)
  getCountry()
  .then((c) => {
    console.log(c)
    // continue
  })
  .catch(e => console.log(e))
})
.catch(err => console.log(err))


async function findData(){
  try {
    let data = await myPromise();
    let c = await getCountry();
    console.log(data)
    console.log(c)
  } catch (error) {
    console.log(error)
  }
}

findData()






  async function getData(){
    let dataRaw = await fetch(`http://localhost:5555/data`,{
      headers:{'Content-Type':'Application/json'},
      method:'POST'
    });
    let data = await dataRaw.json();
    console.log(data);
  }


  return (
    <>
    <img src={Logo} alt="avatar" />
    <h1>{props.username}</h1>
    <p>{props.email}</p>
    <button onClick={logUserOut}>Sign Out</button>
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
    </div>
    )
  }
}
