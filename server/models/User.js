const mongoose = require('mongoose');
const { schema } = require('./Checklist');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    
    email : {
        type : String,
        required: "Please enter your email"
    },
    username : {
        type: String,
        required : "Please enter your name"
    },
    password : {
        type : String,
        required : true
    },
    token : {
        type: String
    },
    // token의 유효기간 : token이 사용할 수 있는 기간
    tokenExp : {
        type: Number
    }

}, { timestamps : true})

const User = mongoose.model('User', userSchema)
module.exports = User