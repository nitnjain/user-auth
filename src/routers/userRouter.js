const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.get('/', auth, (req, res) => {
    res.render('home')
})

router.get('/login', (req, res) => {
    if(req.cookies.token) {
        res.redirect('/')
    } else {
        res.render('login')
    }
})

//
router.get('/signup', (req, res) => {
    if(req.cookies.token) {
        res.redirect('/').send()
    } else {
        res.render('signup')
    }
})

router.get('/logout', auth, async (req, res) => {
    try {
        
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.cookies.token
        })
        console.log(req.user)
        await req.user.save()
        res.clearCookie('token')
        res.redirect('/login')
    } catch(e) {
        res.redirect('/login')
    }
})


//signup router
router.post('/signup', async (req, res) => {
    const duplicateCheck = await User.findOne({ username: req.body.username })
    console.log(duplicateCheck)
    if(!duplicateCheck) {
        const user = new User(req.body)
        try {
            await user.save()
            const token = await user.generateAuthToken()
            res.clearCookie('token')
            res.cookie('token', token)
            res.redirect('/')
        } catch(e) {
            res.status(500).send({ error: `could not create user`})
        }    
    } else {
        res.status(409).send({ error: `username already exists`})
    }
})

//login router
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.clearCookie('token')
        res.cookie('token', token)
        res.redirect('/')
    } catch(e) {
        res.redirect('/login')
    }
})

module.exports = router