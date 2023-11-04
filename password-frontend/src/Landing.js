/*npm dependencies */
import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import dotenv from "dotenv";

/*local dependencies */
import "./Landing.css";
import axios from './axios.js';
import video from "./videos/passwords.mp4";




var loggedin = false;
var eresponse=[{}];

dotenv.config();

function Landing(props) {
    const [is_loggedin,setloggedin] = useState(false);
    const[err,seterrr] = useState(false);
    function responsegooglesuccess(response){
        console.log("success")
        setloggedin(true);
        eresponse = response.profileObj;
        const data = {
            unique_id : eresponse.googleId
        }
        axios.post("/register",data,{
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then((response)=>{
            props.history.push("/passwords");
        })
        .catch((err)=>{
            seterrr(true);
            props.history.push("/");
        });
    }
    function responsegooglefailed(err){
        console.log("failed");
        setloggedin(false);
    }
    if(is_loggedin)
    {
        loggedin=true;
    }
    else{
        loggedin=false;
    }
    return (
           <section className="landing__page" id="Landing">
                <section className="landing">
                
                <video autoPlay muted loop id="myVideo" playsInline>
                    <source src={video} type="video/mp4" />
                </video>
                <div className="container">
                    <h2 className="heading">PASS<span className="special">CODES</span></h2>
                    <div className="info">
                    <p>Store all your password and userdetails here! </p>
                    <p>your passwords and usenames are encrypted </p>
                    <p>and can be accessed from anywhere </p>
                    </div>
                    <GoogleLogin
                    clientId="1050344741692-q4dtjq050v8jkp7i6ad61nb3ahltq3re.apps.googleusercontent.com"
                    onSuccess={responsegooglesuccess}
                    onFailure={responsegooglefailed}
                    cookiePolicy={'single_host_origin'}
                    className="google-btn"
                    buttonText="sign in with google!"
                    />
                    <p class="error">{err? 'error signing in ':null}</p>
                    <a className="randompass" href="https://www.avast.com/en-in/random-password-generator#pc" target="blank" >Random generator </a>
                </div>
                </section>
                
           </section>
    );
}
export default Landing;
export {loggedin,eresponse};