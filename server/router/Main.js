const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const path = require('path');
const { User } = require('../models/User')
const { Checklist } = require('../models/Checklist')
const { Notice } = require('../models/Notice')
// auth 라는 middleware 을 가져온다 ( 인증처리 )
const { auth } = require( '../middleware/auth' );
const jwt = require('jsonwebtoken');
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid  = require('gridfs-stream')
const methodOverride = require('method-override')


const mongoURI = 'mongodb+srv://BUMJUN:bjoh1227!!@dancematchcooperation-gkkwx.mongodb.net/urbanoasis?retryWrites=true&w=majority'

mongoose.connect(
    mongoURI,
    { useNewUrlParser : true }
    ).then(() => console.log("MongoDB Connected in Main.js")).catch(err => console.log(err))
    
Grid.mongo = mongoose.mongo;

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

router.get('/', function(req,res){

    var x_auth = req.cookies.x_auth

    if( x_auth){
        // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
        console.log('x_auth : ',x_auth)

        connection.db.collection("users", function(err, collection){

            collection.find({token:x_auth}).toArray(function(err, data){
                //검색 개수 보여주기
                // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
                // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 

            console.log("loged in")
            console.log("data : " , data[0])
            res.render('index', { member : data[0] })

            })   
        });
    }else{
        console.log("Not loged in")
        res.render('index', { member : {}})
    }
    
})
router.get('/about', function(req,res){
    var x_auth = req.cookies.x_auth

    if( x_auth){
        // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
        console.log('x_auth : ',x_auth)

        connection.db.collection("users", function(err, collection){

            collection.find({token:x_auth}).toArray(function(err, data){
                //검색 개수 보여주기
                // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
                // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 

            console.log("loged in")
            console.log("data : " , data[0])
            res.render('about', { member : data[0] })

            })   
        });
    }else{
        console.log("Not loged in")
        res.render('about', { member : {}})
    }
})
router.get('/products', function(req,res){

    var x_auth = req.cookies.x_auth

    if( x_auth){
        // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
        console.log('x_auth : ',x_auth)

        connection.db.collection("users", function(err, collection){

            collection.find({token:x_auth}).toArray(function(err, data){
                //검색 개수 보여주기
                // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
                // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 

            console.log("loged in")
            console.log("data : " , data[0])
            res.render('products', { member : data[0] })

            })   
        });
    }else{
        console.log("Not loged in")
        res.render('products', { member : {}})
    }
})

router.get('/recipe', function(req,res){
    
    var x_auth = req.cookies.x_auth

    if( x_auth){

        // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
        console.log('x_auth : ',x_auth)

        connection.db.collection("users", function(err, collection){

            collection.find({token:x_auth}).toArray(function(err, data){
                //검색 개수 보여주기
                // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
                // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 

            console.log("loged in")
            console.log("data : " , data[0])
            res.render('store', { member : data[0] })

            })   
        });
    }else{
        console.log("Not loged in")
        res.render('store', { member : {}})
    }
})
router.get('/songs', function(req,res){
    
    var x_auth = req.cookies.x_auth

    if( x_auth){
        // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
        console.log('x_auth : ',x_auth)

        connection.db.collection("users", function(err, collection){

            collection.find({token:x_auth}).toArray(function(err, data){
                //검색 개수 보여주기
                // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
                // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 

            console.log("loged in")
            console.log("data : " , data[0])
            res.render('song', { member : data[0] })

            })   
        });
    }else{
        console.log("Not loged in")
        res.render('song', { member : {}})
    }
})

// router.get('/notice', function(req,res){

//     var x_auth = req.cookies.x_auth

//     if( x_auth){
//         // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
//         console.log('x_auth : ',x_auth)

//         connection.db.collection("users", function(err, collection){

//             collection.find({token:x_auth}).toArray(function(err, data){
//                 //검색 개수 보여주기
//                 // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
//                 // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 

//             console.log("loged in")
//             console.log("data : " , data[0])
//             res.render('notice', { member : data[0] })

//             })   
//         });
//     }else{
//         console.log("Not loged in")
//         res.render('notice', { member : {}})
        
//     }
// })


module.exports = router;