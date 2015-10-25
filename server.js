var express = require('express')
var app = express()

var config = require('./config')

var morgan = require('morgan')
var bodyParser = require('body-parser')

var knex = require('knex')({client: 'postgresql', connection: config.postgres})

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

knex.migrate.latest()

require('./app/router')(app)

app.listen(config.port, function(){
  console.log("Server running on port: " + config.port)
})
