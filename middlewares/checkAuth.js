const { default: axios } = require('axios')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const url = require('../url')

const checkAuth = async(req, res, next) => {
    let token
    try {
        token = req.headers.authorization.split(" ")[1]
    } catch(err) {
        console.log('Token fetch error', err);
        return res.status(404).json({success:false, error:"token not found"})
    }
    // console.log(token);
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        let user
        await axios.get(url+'api/users/'+decode.username)
        .then(response=>{
            // console.log(response.data);
            user = response.data.user
        })
        req.username = decode.username
        if(user==undefined || user.length==0) return res.status(403).json({success:false, message:'You\'re not authorized.'})
        next()
    } catch(err) {
        console.log('JWT Token verification failed.', err);
        return res.status(401).json({success: true, error: "You're not authorized."})
    }
}
module.exports = checkAuth