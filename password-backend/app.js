/*npm packages dependencies */
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import cors from "cors";
/*local dependencies */
import userModel from "./Models.js";
import {password_model} from "./Models.js";
/*app config */
const app = express();
app.use(bodyparser.urlencoded({extended:1}));
app.use(bodyparser.json({extended:1}));

app.use(cors());

/*global constants or variables used insidcde app */
const port  = process.env.PORT || 5000;
var uniqueg_id;
var unique_id_recieved = false;

/*mongoose setup */
const mongodb_url = "mongodb+srv://susrutha:123456789@@cluster0.0owzjph.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongodb_url, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false  },function(err){
    if(!err)
    {
        console.log("succesfully connected");
    }
    else
    {
        console.log(err)
    }
});
mongoose.set('useFindAndModify', false);

/*api routes */
app.get("/getpasswords",function(req,res){
    userModel.findOne({unique_id:uniqueg_id},function(err,results){
        if(!err)
        {
            res.status(200).send(results.password_set);
        }
        else{
            res.status(404).send(err);
        }
    })
});
app.post("/register",function(req,res){
    const uniqueid = req.body.unique_id;
    uniqueg_id = uniqueid;
    userModel.findOne({unique_id:uniqueid},function(err,result){
        if(err)
        {
            res.status(500).json({message:"problem with the data base"});
        }
        else{
            if(result){
                res.status(200).json({message:"userfound"});
            }
            else
            {
                const new_user = new userModel({
                    unique_id:uniqueid,
                    password_set:[]
                });
                new_user.save();
                res.status(200).json({message:"successfully added a new user"});
            }
        }
    });
});

app.post("/passwordset",function(req,res){
    const user_name = req.body.username;
    const passcode = req.body.password;
    const account = req.body.account_type;
    userModel.findOne({unique_id:uniqueg_id},function(err,result){
        if(err)
        {
            res.status(500).json({message:"problem with the database"});
        }
        else
        {
            if(result)
            {
                const new_password = new password_model({
                    username:user_name,
                    password:passcode,
                    account_type:account
                });
                new_password.save();
                result.password_set.unshift(new_password);
                result.save();
                
                res.status(200).json({message:"successfull"});
            }
            else{
                res.status(200).json({message:"some random error"})
            }
            
        }
    })
})
/*post for deleting password  */
app.post("/deletepassword",(req,res)=>{
    const uid = req.body.id_to_del;
    password_model.findByIdAndRemove({_id:uid},function(err){
        if(err)
        {
            console.log(err);
            res.status(500).json({message:"deletion not succesfull try again"});
        }
        else
        {   
            userModel.findOne({unique_id:uniqueg_id},function(err,results){
                if(err){
                    res.status(500).json({message:"detion failed becasue of internal error try again"});
                }
                else{
                    var index=0;
                    const card_index = results.password_set.findIndex((a)=>{
                       if(a._id==uid)
                       {
                            return 1;
                       }
                       else
                       {
                           ++index;
                       }
                    });
                    results.password_set.splice(index , 1);
                    results.save();
                    res.status(200).json({message:"deletion succesful"})
                }
            });
        }
    });
})
app.get("/",function(req,res){
    res.send("<h1>I am up and running</h1>")
})
app.listen(port,function(){
    console.log("server has started");
});