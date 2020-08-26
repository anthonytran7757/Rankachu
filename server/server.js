var express = require('express');
//var router = require('./routes/routes.js')
var path = require('path');
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Customers = require('../models/Customers.js')
var app = express();

var dbUrl = 'mongodb://localhost/dbname'

mongoose.connect(dbUrl)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
//app.use('/', router);
app.use(bodyParser.json())

app.get('/', function (req, res){
    res.render('index')
})

app.post('/insert', function (req, res) {
    var newCust = new Customers();
    console.log(req.body.name)
    console.log(req.body.phoneNumber)
    newCust.name = req.body.name
    newCust.phoneNumber = req.body.phoneNumber
    newCust.save(function(err){
        if(err)
            res.send(err);
        res.send('saved')
    })
})

app.get('/collections', function (req, res){

})


module.exports=app;