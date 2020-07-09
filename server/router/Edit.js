const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const path = require('path');
const { User } = require('../models/User')
const { Checklist } = require('../models/Checklist')
// auth 라는 middleware 을 가져온다 ( 인증처리 )
const { auth } = require( '../middleware/auth' );
const jwt = require('jsonwebtoken');

const mongoURI = 'mongodb+srv://BUMJUN:bjoh1227!!@dancematchcooperation-gkkwx.mongodb.net/urbanoasis?retryWrites=true&w=majority';

mongoose.connect(
    mongoURI,
    { useNewUrlParser : true }
).then(() => console.log("MongoDB Connected in Edit.js")).catch(err => console.log(err))

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

router.post('/notice/ChecklistEdit', ( req, res) => {

    console.log(req.body)

    Checklist.findOneAndUpdate({ rowNum : req.body.num } , {
        $set : {
            Text : req.body.input
        }},
        {
            upsert : true,
            new : true
    } , ( err, doc ) => {
        
        console.log("Checklist update in Server ongoing")
        if(err){
            console.log("Something wrong when updating data")
            console.log("error : " , err )
            return res.status(400).json({ error : err})
        }

        console.log("Checklist update no problem, response is sent to the client")
        
        return res.status(200).json({ 'message' : 'success'})
    })
})

module.exports = router;