const express = require('express')
const hbs = require('hbs')
require('./config/db')
const userRouter = require('./routers/userRouter')
const path = require('path')
var cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.urlencoded({extended:false}))

app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '../public')))
app.set('views', path.join(__dirname, '../templates/views'))
hbs.registerPartials(path.join(__dirname,'../templates/partials'))

app.use(express.json())
app.use(cookieParser())

app.use(userRouter)

app.listen(PORT, console.log(`Server running on ${PORT}`))