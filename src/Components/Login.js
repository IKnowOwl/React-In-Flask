import React, { useState, useEffect } from "react";
import {login, useAuth, authFetch, logout} from "../auth"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";


export const Login = ()=> {
    const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitClick = (e)=>{
    e.preventDefault()
    console.log("You pressed login")
    let opts = {
      'username': username,
      'password': password
    }
    console.log(opts)
    fetch('/api/login', {
      method: 'post',
      body: JSON.stringify(opts)
    }).then(r => r.json())
      .then(token => {
        if (token.access_token){
            login(token)
            alert("Your token is "+token.access_token)
          console.log(token)          
        }
        else {
            alert("Credentials by you are wrong.")
          console.log("Please type in correct username/password")
        }
      })
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
    const [logged] = useAuth();

  return (
    <div>
      <h2>Login</h2>
      {!logged? <form action="#">
        <div>
          <input type="text" 
            placeholder="Username" 
            onChange={handleUsernameChange}
            value={username} 
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            onChange={handlePasswordChange}
            value={password}
          />
        </div>
        <button onClick={onSubmitClick} type="submit">
          Login Now
        </button>
      </form>
          : <Redirect to='/upload' /> }
    </div>
  )
}

