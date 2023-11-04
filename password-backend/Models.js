import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import dotenv from "dotenv";
dotenv.config();
const stext = "somethingscret";

const passwordSchema = new mongoose.Schema({
    username:String,
    password:String,
    account_type:String,
});
passwordSchema.plugin(encrypt,{secret:stext,encryptedFields:['password']});
const userSchema = new mongoose.Schema({
    unique_id:String,
    password_set:[passwordSchema]
});
const password_model = new mongoose.model('passwords',passwordSchema);
const user_model = new mongoose.model('user',userSchema);
export default user_model;
export {password_model};
