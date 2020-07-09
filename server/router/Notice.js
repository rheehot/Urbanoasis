const express = require('express')
const router  = express.Router();
const cors    = require('cors')
var crypto  = require('crypto')
const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcrypt')
const User    = require('../models/User')
const path    = require('path')
const mongoose = require('mongoose')
const { auth } = require( '../middleware/auth' );
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid  = require('gridfs-stream')
const methodOverride = require('method-override')

router.use(cors())

router.use(methodOverride('_method')) 

const mongoURI = 'mongodb+srv://BUMJUN:bjoh1227!!@dancematchcooperation-gkkwx.mongodb.net/urbanoasis?retryWrites=true&w=majority'

mongoose.connect(
    mongoURI,
    { useNewUrlParser : true }
    ).then(() => console.log("MongoDB Connected")).catch(err => console.log(err))
    
Grid.mongo = mongoose.mongo;

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));

var gfs;

// init gfs
connection.once('open', () => {
    // Init stream
    gfs = Grid(connection.db)
    gfs.collection('notices')
})

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            // bucketname should match collection name
            bucketName: 'notices',
            metadata : {
                    // get this information somehow
                    Date : req.body.upload[2],
                    Text : req.body.upload[1],
            },
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage }); // 이제 이를 통해 가능하게 되는 것은 내가 /notice를 통해서 비디오 혹은 이미지를 업로드할 때, 여기 const upload 를 middleware로 사용해서, db 에 정보를 upload 할 수 있게 해준다

  
router.get('/notice', (req , res) => {

    console.log("hello")
    var x_auth = req.cookies.x_auth

    if( x_auth){

        // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
        // 체크할 db 는 2개이다 1) Notice 2) login user

    // 1. token에 맞는 user를 알려준다 
    connection.db.collection("users", function(err, collection){

        collection.find({token:x_auth}).toArray(function(err, data){
            //검색 개수 보여주기
            // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
            // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 

        console.log("login confirmed in POST notice")
        console.log("data extracted from User DB : " , data[0])

        // 2. 우리가 render 해줄  Notice DB 의 내용이 있는지 체크해준다 
        gfs.files.find().toArray( ( err , files ) => {
            // Check if files exists
            if(!files || files.length === 0 ){
                return res.status(404).json({
                    err : 'No files exist'
                })
            }
            // file exist from notice DB
            // console.log("files of gfs from DB :", files)

            return res.render('notice', { member : data[0] , notice : files})
        })


        })   
    });
    }else{
        console.log("Not loged in")
        res.render('notice', { member : {}})
        
    }
})

// Get /files/:fileName
router.get('/notice/:filename', (req , res) => {

        // 1. 우리가 render 해줄  db의 내용이 있는지 체크해준다 
        gfs.files.find( { filename : req.params.filename } , (err, file) =>{

            if(!file || file.length === 0 ){
                return res.status(404).json({
                    err : 'No files exist'
                })
            }
            // File Exist
            return res.json(file);
        });
    })

// single file upload 이므로 upload.single 이 되는 것이다, ( )안에는 input type에 주어준 name을 입력해준다
router.post('/notice', upload.single('upload'), (req,res) => {

    console.log("notice upload going on")

    console.log("req :", req)
    
    console.log("req file: ",req.file)
    
    console.log("req body: ", req.body)

    console.log("req upload: ", req.body.upload)
    
    console.log("req upload date: ", req.body.upload[2]
    )
    return res.status(200).json({ 'message' : 'success'})

    // Notice.findOneAndUpdate({ Date : req.body.Date } , {
    //     $set : {
    //         Text  : req.body.Text,
    //         Video : req.body.Video,
    //         Img   : req.body.Img
    //     }},
    //     {
    //         upsert : true,
    //         new : true
    // } , ( err, doc ) => {
        
    //     console.log("Notice update in Server ongoing")
    //     if(err){
    //         console.log("Something wrong when updating Notice")
    //         console.log("error : " , err )
    //         return res.status(400).json({ error : err})
    //     }

    //     console.log("Notice update no problem, response is sent to the client")
        
    //     return res.status(200).json({ 'message' : 'success'})
    // return;
    
})



module.exports = router;