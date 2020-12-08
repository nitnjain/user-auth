const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token
        const decoded_payload = jwt.verify(token, 'secrettoken')
        
        const user = await User.findOne({ _id: decoded_payload._id, 'tokens.token': token})

        req.user = user
        
        next()
    } catch(e) {
        res.clearCookie('token') 
        res.redirect('/login')
    }
}

module.exports = auth