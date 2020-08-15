const express = require('express')
const router  = express.Router();
const cors    = require('cors')
const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcrypt')
const User    = require('../models/User')
const path    = require('path')
const mongoose = require('mongoose')
const { auth } = require( '../middleware/auth' );
router.use(cors())

mongoose.connect(
    'mongodb+srv://BUMJUN:bjoh1227!!@dancematchcooperation-gkkwx.mongodb.net/urbanoasis?retryWrites=true&w=majority',
    { useNewUrlParser : true }
).then(() => console.log("MongoDB Connected in Account.js")).catch(err => console.log(err))

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

process.env.SECRET_KEY = 'secret'

router.post('/register', ( req, res ) => {

    const today = new Date()

    console.log("Req body : ", req.body)
    
    const userData = {
        email    : req.body.email,
        username : req.body.username,
        password : req.body.password
    }

    User.findOne({

        email : req.body.email

    }).then(user => {

        if(!user){

            // continue hashing password
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash
                User.create(userData).then(uer => {
                    res.json({ status : user.email + "Registered"})
                }).catch(err => {
                    res.send('error : ' + err )
                })
            })
        }else{
            res.json({ error : "User already exists"})
        }
    }).catch(err => {
        res.send('error :' + err)
    })
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {

    console.log("login process going")
    console.log(req.body)

    User.findOne({
        username : req.body.username
    }).then(user => {
        if( user ){

            console.log("We are dealing with User", user)

            console.log("Found the corresponding username")

            // 입력한 비밀번호와, db에 hash 되어 저장된 비밀번호를 저장한다
            if( bcrypt.compareSync(req.body.password, user.password)){
                console.log("Same password is found")

                // password match
                const payload = {
                    username : req.body.username,
                    password : req.body.password
                }

                // 우리가 입력한 username과 password를 이용하여 token을 만든다 
                let token = jwt.sign(payload, process.env.SECRET_KEY)
                console.log("token is made :" ,token)

                // 찾아낸 userSchema에 token field 에 저장하기
                user.token = token
                console.log("user.token : ", user.token)

                // 만들어낸 token을 db에 저장한다
                User.findOneAndUpdate({ email : user.email }, {
                    $set : {
                        token : token 
                    }
                } ,( err, doc ) => {
                    console.log("token update ongoing")
                    if(err){
                        console.log("Something wrong when updating data")
                        console.log("error : " , err )
                        return res.status(400).json({ error : err})
                    }
                    console.log("Found")
                    return res.cookie("x_auth", user.token).status(200).json({ 'message' : 'success'})
                })
            }else{
                // password doesn't match
                console.log("Wrong password")
                res.status(401).json({'message' : 'passworderror'})
            }
        }else{
            console.log("No user")
            res.status(402).json({ 'message' : 'usererror'})
        }
    })
})

// 로그아웃
router.get('/logout' ,( req , res ) => {

    let token = req.cookies.x_auth;

    console.log("token brought")

    jwt.verify(token, process.env.SECRET_KEY, function( err, decoded){

        console.log("decoded : ",  decoded)

        if(err){
            // 20분후에 다시 token이 사라지기 때문에, 이 경우 아래의 메시지가 뜰 것이다 
            console.log("Error : " , err);
            return res.status(200).json( { "result" : "LinkError" });
        }
    
            User.findOneAndUpdate( { token },
                // 여기서는 token을 지워준다
                {$set:{token:''}}
                , ( err, user) => {
                    if(err){
                        console.log("token related error")
                        return res.json({ success : false , err});
                    } 
                    //쿠키지우기
                    res.clearCookie("x_auth")

                    console.log("cookie deleted")
                    res.redirect('/')

            })
        });
});

module.exports = router;