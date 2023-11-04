import React from "react";
import {loggedin} from "./Landing";
import {Route,Redirect} from "react-router-dom";

function Protected({component:Component,...rest}){
    return(
        <Route
            {...rest}
            render={props=>{
                if(loggedin)
                {
                    return <Component {...props} />
                }
                else{
                    return <Redirect to={
                        {
                            pathname:"/",
                            state:{
                                from:props.location
                            }
                        }
                    } />
                }
            }}
        />
    );
}  
export default Protected;