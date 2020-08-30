var express = require('express');
var path = require('path');
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var app = express();

var dbUrl = 'mongodb://localhost/Rankachu'

mongoose.connect(dbUrl)

let contest = require('../models/Contests')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json())

app.get('/', function (req, res){
    res.render('index')
})

app.get('/contest', function(req, res){
    contest.find({}, async function(err, result){
        if (err){
            console.log(err)
        } else{
            if (!result.length){
                let overall = await contest.create({
                    name: "overall"
                });
                await overall.save(function(error){
                    if(error){throw error;}
                })
                let legendary = await contest.create({
                    name: "legendary"
                })
                await legendary.save(function(error){
                    if(error){throw error;}
                })
            }
            else{
                res.send(result)
            }
        }
    })

    res.send("hello")
})

app.post('/vote', function(req, res){
    console.log(req.body)
    contest.find({name: req.body.contest}, async function(err, result){
        const selectedContest = await contest.findOne({name: req.body.contest})
        let pokeIndex = selectedContest.nominees.findIndex((poke => poke.dexNum == req.body.dexNum))
        if(pokeIndex >= 0){
            selectedContest.nominees[pokeIndex].voteCount += 1
        }
        else{
            selectedContest.nominees.push({
                dexNum: req.body.dexNum,
                voteCount: 1
            })
        }
        await selectedContest.save()
    })
    res.send("voted")
})


module.exports=app;