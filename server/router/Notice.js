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
const mime = require('mime');
const { restart } = require('nodemon');
const g = require('gridfs-stream');

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

// Create storage engine
const storage = new GridFsStorage({
    
    url: mongoURI,
    file: (req, file) => {
            console.log("req.body in GridFsStorage:" , req.body.upload )
            return new Promise((resolve, reject) => {
                // crypto code used to generate names
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
                  Text : req.body.upload[1]
                },
            };
            resolve(fileInfo);
            });
        });
}
});

// upload 라는 name으로 post를 보내줬으므로!
const upload = multer({ storage })// 이제 이를 통해 가능하게 되는 것은 내가 /notice를 통해서 비디오 혹은 이미지를 업로드할 때, 여기 const upload 를 middleware로 사용해서, db 에 정보를 upload 할 수 있게 해준다
const F_Singleupload = upload.single("upload")

// init gfs : GridFSStream is needed to read the files from db
// and help render an image to a browser when needed
connection.once('open', () => {
    // Init stream
    gfs = Grid(connection.db)
    gfs.collection("notices");

})
  
router.get('/notice', (req , res) => {

    var x_auth = req.cookies.x_auth
    let userData ;
    let filesData = [];
    let count = 0

    if( x_auth){
        // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
        // 체크할 db 는 2개이다 1) Notice 2) login user

        // 1. token에 맞는 user를 알려준다 
        connection.db.collection("users", function(err, collection){

            console.log("user collection being found in UserDB")

            collection.find({token:x_auth}).toArray(function(err, data){

                    if( err){
                        console.log("Error :", err)
                        return 
                    }
                    //검색 개수 보여주기
                    // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
                    // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 
                console.log("login confirmed in POST notice")
                console.log("data extracted from User DB : " , data[0])
                
                userData = data[0]

                console.log("data copied to userData : " , userData)

                // gfs.collection("notices.files")
        
                console.log("gfs prior setting")
                
                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                        console.log("Error in GridFs :", err)
                        return;
                    } else {
                        console.log("Gfs properly working")
                        files.map(file => {
                            if (
                                file.contentType === 'image/jpeg' ||
                                file.contentType === 'image/png'
                                ) {
                                    file.isImage = true;
                                } else {
                                    file.isImage = false;
                                }
                                // 월, 일 만 맞춘다 
                                file.uploadDate = String(file.uploadDate).split(" 2020")[0]
                            });
                    }
                    console.log("files in notice get :", files)

                    return res.render('notice', { member : userData , files : files})
                });
            }) 
        });
    // 로그인 하지 않은 상태
    }else{
        console.log("Not loged in")
        res.redirect('/login')
    }
})


// route for display single fileObject 
router.get('/file/:filename', (req,res) => {
    gfs.files.findOne({ filename : req.params.filename}, (err,file) => {
        // check if file exist
        if( !file || file.length === 0){
            return res.status(404).json({
                err : "No file exists"
            })
        }

        // File Exist
        if( file.contentType === "image/jpeg" || file.contentType === "img/png" || file.contentType === "video/mp4" ){
            // Read output to browser
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res)

        }else{
            res.status(404).json({
                error : "Not an image"
            })
        }
    })
})

// route for deleting img,video file > /image/:id
router.delete('/file/:id', (req,res) => {
    gfs.remove({ _id : req.params.id, root : "notices"}, (err, gridStore) => {
        if(err){
            return res.status(404).json({ err : err});
        }else{
            res.redirect('/notice')
        }
    });
})


// grid file save through notice.modal
// single file upload 이므로 upload.single 이 되는 것이다, ( )안에는 input type에 주어준 name을 입력해준다
router.post('/notice', (req,res) => {
    
    F_Singleupload(req,res,function(err){

        if(err){
            return res.status(400).json({ error : err })
        }

        console.log("notice upload going on")
    
        // console.log("req :", req)
        
        console.log("req file: ",req.file)
        
        console.log("req body: ", req.body)
    
        console.log("req upload: ", req.body.upload)
        
        console.log("req upload date: ", req.body.upload[2]
        )
    
        console.log("metadata :" , req.file.metadata)

        console.log("done upload--")
        return res.status(200).json({ 'message' : 'success'})
    })

})

// ----------------- notice_edit get page ------------------------
router.get('/notice_edit/:id', (req , res) => {

    var x_auth = req.cookies.x_auth
    let userData ;
    let filesData = [];
    let count = 0

    if( x_auth){
        // x_auth가 true : x_auth가 있다는 것 : login 된 상태 
        // 체크할 db 는 2개이다 1) Notice 2) login user

        // 1. token에 맞는 user를 알려준다 
        connection.db.collection("users", function(err, collection){

            console.log("user collection being found in UserDB")

            collection.find({token:x_auth}).toArray(function(err, data){

                    if( err){
                        console.log("Error :", err)
                        return 
                    }
                    //검색 개수 보여주기
                    // data는 collection에서 user , 혹은 dancer 정보를 받아오는 것이고, 그것을 mypageDancer 라는 router 에다가 넘겨주는 것이다 
                    // 아래 코드를 통해, mypage.ejs 에서, mongodb에 있는 내용의 data 들을 value 값으로 넣어줄 수가 있는 것이다 
                console.log("login confirmed in POST notice")
                console.log("data extracted from User DB : " , data[0])
                
                userData = data[0]

                console.log("data copied to userData : " , userData)

                // gfs.collection("notices.files")
        
                console.log("gfs prior setting")

                gfs.files.find().toArray((err, files) => {
                    // Check if files
                    if (!files || files.length === 0) {
                        
                        console.log("Error in GridFs :", err)
                        return;

                    } else {

                        console.log("Gfs properly working")

                        files.map(file => {
                            if (
                                file.contentType === 'image/jpeg' ||
                                file.contentType === 'image/png'
                                ) {
                                    file.isImage = true;
                                } else {
                                    file.isImage = false;
                                }
                                // 월, 일 만 맞춘다 
                                file.uploadDate = String(file.uploadDate).split(" 2020")[0]
                            });

        
                            console.log("Files from gridfs :", files)
                            console.log("id :", req.params.id)
                        }
                        return res.render('notice_edit', { member : userData , files : files, wantfile_id : req.params.id })
                    });
            }) 
        });
    // 로그인 하지 않은 상태
    }else{
        console.log("Not loged in")
        res.redirect('/login')
    }
})



// route for display single fileObject for Edit page
router.get('/notice_edit/file/:filename', (req,res) => {

    gfs.files.findOne({ filename : req.params.filename}, (err,file) => {
        // check if file exist
        if( !file || file.length === 0){
            return res.status(404).json({
                err : "No file exists"
            })
        }
        // File Exist
        if( file.contentType === "image/jpeg" || file.contentType === "img/png" || file.contentType === "video/mp4" ){
            // Read output to browser
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res)
        }else{
            res.status(404).json({
                error : "Not an image"
            })
        }
    })
})

// route for Editing single fileObject for Edit page
router.post('/notice_edit/update/:filename', (req,res) => {

    console.log("req.body for edit in post edit ", req.body)

    // update metadata
    gfs.files.updateOne(
        { filename: req.params.filename },
        { $set : { 'metadata.Text' : req.body.newtext}}
    )
 
    res.redirect("/notice")
})




module.exports = router;