import React, { useState } from "react"
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios"
import Cookies from "js-cookie"
import "./Login.css"

const Login = () => {

    const [userName,setUserName] = useState("")
    const [password,setPassword] = useState("")
    const [error, setError] = useState(false)
    const [account,setAccount] = useState("Admin")
    const notify = (msg) => toast.success(msg)
    const notifyError = (msg) => toast.error(msg)

    const submitting =  (e) => {
        e.preventDefault()

        axios.post("http://localhost:5000/login",{
            "username":userName,
            "password":password,
            "user":account
        })
        .then((response) =>{
                {notify(response.data.message)};
                Cookies.set('jwt_token', response.data.jwt_token, { expires: 1 });
                Cookies.set("user",account,{expires:1})
                window.location.href = "/"


        })
        .catch((error) => {
            {notifyError(error.response.data)}
            console.log(error.response.data)
        })
    
    
    }
return <div className="loginPage">

    <div className="loginBox">

        <h1>Login</h1>
        <form onSubmit={submitting}>
            <label>Username:</label><br/>
            <input onChange={(e) => {
                setUserName(e.target.value)
            }} type="text" name="username" required/><br/>
            <label>Password:</label><br/>
            <input onChange={(e) => {
                setPassword(e.target.value)
            }} type="password" name="password" required/><br/>
            <select onChange={(e) => {
                setAccount(e.target.value)
            }}>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
            </select>
            <button type="submit">Login</button>
        </form>
      <Toaster />
    </div>
</div>
}

export default Login