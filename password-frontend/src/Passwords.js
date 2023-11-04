/*npm dependencies */
import React, { useEffect, useState } from 'react';
import {GoogleLogout} from 'react-google-login';
import { Avatar,IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

/*local dependencies */
import axios from './axios';
import {eresponse} from "./Landing";
import bgvideo from "./videos/passwords.mp4";
import "./passwords.css";
import encrypt,{decrypt} from "./encryptions";

function Passwords(props) {
    const [overallData,setOverallData] = useState([]);
    const [passwords,setPasswords] = useState([]);
    const [newdata,setnewData] = useState("false");
    const [searchKey,setSearchkey] = useState("");
    const [err,setErr] = useState(false);

    const [data,setData] = useState({
        username:"",
        password:"",
        account_type:""
    });
    const avatar_styling = {
        height:"auto",
        width:"25%"
    }
    useEffect(()=>{
        axios.get("/getpasswords").then((response)=>{
            setPasswords(response.data);
            setOverallData(response.data);
            setnewData("false");
        })
        .catch((err)=>{
            console.log(err);
        })
    },[newdata]);
    function handleSubmit(event){
        const new_trimmed_data = {
            username:data.username.trim(),
            password:data.password.trim(),
            account_type:data.account_type.trim()
        }
        setData({
            username:"",
            password:"",
            account_type:""
        });
        if(new_trimmed_data.username.length>0&&new_trimmed_data.password.length>8&&new_trimmed_data.account_type.length>0){
            const encrypt_data = {
                username:new_trimmed_data.username,
                password:encrypt(new_trimmed_data.password),
                account_type:new_trimmed_data.account_type
            }
            axios.post("/passwordset",encrypt_data,{
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then((response)=>{
                setnewData("true");
            })
            .catch((err)=>{
                console.log(err);
            });
            setErr(false);
        }
        else{
            setErr(true);
        }
        event.preventDefault();
    }
    function handleChange(event)
    {
        const name = event.target.name;
        if(name==="username")
        {
            setData((previous_value)=>{
                const Username = event.target.value;
                return(
                    {
                        username:Username,
                        password:previous_value.password,
                        account_type:previous_value.account_type
                    }
                );
            });
        }
        else if(name==="password")
        {
            setData((previous_value)=>{
                return(
                    {
                        username:previous_value.username,
                        password:event.target.value,
                        account_type:previous_value.account_type
                    }
                );
            });
        }
        else if(name==="account_name")
        {
            setData((previous_value)=>{
                return(
                    {
                        username:previous_value.username,
                        password:previous_value.password,
                        account_type:event.target.value
                    }
                );
            });
        }
    }
    function handledelete(event){
        const del_data = {
            id_to_del : event.target.value,
        }
        axios.post("/deletepassword",del_data,{
            headers:{
                'Content-Type': 'application/json'
            }
        }).then((response)=>{
            setnewData("delted")
        }).catch((err)=>{
            console.log(err);
        });
        event.preventDefault();
    }
    function handlesearchchange(e){
        const key = e.target.value;
        setSearchkey(key);
        setPasswords(overallData);
        e.preventDefault();
    }
    function handlesearch(event){
        
        const search_key = searchKey.trim();
        const search_array = [];
        var matched=false;
        for(var i=0;i<passwords.length;i++)
        {
            const account_card = passwords[i];
            if(account_card.account_type===search_key){
                matched = true;
                search_array.push(account_card);
            }
        }
        if(search_array.length>0){
            if(matched){
                matched = false;
                setPasswords(search_array);
            }
        }
        else{
            if(!matched){
                setPasswords(overallData);
            }
        }
        setSearchkey("");
        event.preventDefault();
    }
    function handleshow(event){
        setPasswords(overallData);
        event.preventDefault();
    }
    function handleslogout(responses){
        props.history.push("/");
    }
    function handleloutfalied(rfailed){
        props.history.push("/");
    }
    return (
        <section className="passwords">
            <div className="passwords_header">
                <video autoPlay muted loop id="video" playsInline className="bgvideo">
                    <source src={bgvideo} type="video/mp4"/>
                </video>
                <div className="contents">
                <Avatar style={avatar_styling} src={eresponse.imageUrl} alt="profile picture"/>
                <h2 className="welcomeheading">Welcome {eresponse.givenName}</h2>
                <div className="passwords_search">
                    <form onSubmit={handlesearch} >
                    <input type="text" placeholder="Search by account name" value={searchKey} onChange={handlesearchchange} class="password_search_bar"/>
                    <IconButton onClick={handlesearch}>
                        <SearchIcon/>
                    </IconButton>
                    </form>
                    
                </div>
                <GoogleLogout
                        clientId = {process.env.REACT_APP_GOOGLE_ID}
                        buttonText="Logout"
                        onLogoutSuccess={handleslogout}
                        onLogoutFailure={handleloutfalied}
                        className="password-logout"
                    ></GoogleLogout>
                </div>
                
            </div>
            
            <div className="heading-password">
            <h1 class="title-passwords">your Accounts</h1>
            </div>
            <button className="show_all_passwords" onClick={handleshow}>show all passwords</button>
            <div className="passwords_body">
            <div className="submitpasscode">
                <form onSubmit={handleSubmit}>
                        <input 
                        type="text" 
                        name="username"
                        placeholder="Username"
                        value={data.username}
                        onChange={handleChange}
                        autoComplete="off"
                        required/>
                        <br></br>
                        <input 
                        type="password" 
                        name="password" 
                        placeholder="Password minimum of 8 length" 
                        value={data.password} 
                        onChange={handleChange}
                        minLength="8"
                        autoComplete="off"
                        required/>
                        <br></br>
                        <input type="text" 
                        name="account_name" 
                        placeholder="Account Name" 
                        value={data.account_type} 
                        onChange={handleChange}
                        required/>
                        <h1></h1>

                        <button className="btn">Add</button>
                        <br></br>
                        <p className="showerr">{err? 'error submitting ' :null }</p>
                    </form>
                    
                </div>
                {passwords.map((item,index)=>{
                    const style_value = Math.floor(Math.random()*4);
                    var blue_styles = false;
                    var orange_styles= false;
                    var red_styles =false;
                    var green_styles = false;
                    if(style_value===0)
                    {
                        blue_styles=true
                    }
                    else if(style_value===1)
                    {
                        orange_styles=true
                    }
                    else if(style_value===2)
                    {
                        red_styles=true;
                    }
                    else
                    {
                        green_styles=true;
                    }
                    const box_styles = {
                        backgroundColor:blue_styles? "#03256C" : orange_styles? "#FF5200" : red_styles? "#FF5200" : green_styles? "#1EAE98"  : "#1EAE98" 
                    }
                    return(
                        <div key={index}className="detail_container" style={box_styles}>
                            <div className="card_front_face">
                                <div>
                                    <h1>{item.account_type}</h1>
                                </div>
                            </div>
                            <div className="card_back_face">
                                
                                <div class="container_card">
                                    <div className="wraper">
                                    <div className="username_shower">
                                        <span>Username</span>
                                        <h1>{item.username}</h1>
                                    </div>
                                    <div className="password_shower">
                                        <span>Password</span>
                                        <h1 >{decrypt(item.password)}</h1>
                                    </div>
                                    <button className="delbtn" value={item._id} onClick={handledelete}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div> 
        </section>
    );
};
export default Passwords;