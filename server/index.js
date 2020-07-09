var express = require('express')
var cors    = require('cors')
var path    = require('path')
var bodyParser = require('body-parser')
var crypto  = require('crypto')
var app = express()
const mongoose = require('mongoose')
const cookieParser = require( 'cookie-parser' );
var port = 2000
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid  = require('gridfs-stream')
const methodOverride = require('method-override')


// css, js 파일들 적용
app.use(express.static(__dirname +'/../client/'))

// MiddlewarebodyParser: client가 보낸 정보를 Server가 받게 한다
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(methodOverride('_method')) 

// view
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'../client/views'))

// make mongoose use 'findOneAndUpdate"
mongoose.set('useFindAndModify', false)

// Users
const Users = require('./router/Account')
app.use( '/', Users)

// Main
const Main = require('./router/Main')
app.use('/', Main)

// Edit
const Edit = require('./router/Edit')
app.use('/', Edit)

// Notice
const Notice = require('./router/Notice')
app.use('/', Notice)

// route post : upload




app.listen(port, function(){
    console.log("Server is running on 2000 port")
})