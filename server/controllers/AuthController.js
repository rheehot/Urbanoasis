const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = ( req, res, next) => {
    
    // 해쉬화 : 비밀번호 암호화 
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err){
            res.json({
                error: err
            })
        }

        let user = new User({
            username : req.body.username,
            password : hashedPass
        })
    
        user.save().then(user => {
            req.json({
                message : 'User Added Successfully'
            })
        })
        .catch(error => {
            res.json({
                message : 'An error occured!'
            })
        })
        
    })

}

module.exports = {
    register 
}