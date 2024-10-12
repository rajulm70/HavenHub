const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loginSchema = new Schema ({
    As : {
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    mobile : {
        type: String,
        required : true,
    }, 
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
});

const Login = mongoose.model("Login",loginSchema);
module.exports = Login;