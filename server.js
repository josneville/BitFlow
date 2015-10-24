var express = require('express')
var app = express()

var config = require('./config')

var morgan = require('morgan')
var bodyParser = require('body-parser')

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

require('./app/router')(app)

app.listen(config.port, function(){
  console.log("Server running on port: " + config.port)
})
