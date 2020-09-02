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



app.get('/contest', function (req, res) {
    contest.find({}, async function (err, result){
        if (!result.length){
            let overall = await contest.create({
                name: "overall"
            });
            await overall.save(function (error) {
                if (error) {
                    throw error;
                }
            })
            let legendary = await contest.create({
                name: "legendary"
            })
            await legendary.save(function (error) {
                if (error) {
                    throw error;
                }
            })
            res.send("created")
        }
        else{
            pokeVoteList = result
            pokeVoteList.forEach(poke =>{
                poke.nominees.sort(function(a,b){return(b.voteCount - a.voteCount)})
            })
            res.send(pokeVoteList)
        }
    })
})

app.post('/vote', function (req, res) {
    contest.find({name: req.body.contest}, async function (err, result) {
        const selectedContest = await contest.findOne({name: req.body.contest})
        let pokeIndex = selectedContest.nominees.findIndex((poke => poke.dexNum === req.body.dexNum))
        if (pokeIndex >= 0) {
            selectedContest.nominees[pokeIndex].voteCount += 1
        } else {
            selectedContest.nominees.push({
                name:req.body.name,
                dexNum: req.body.dexNum,
                imgURL: req.body.imgURL,
                spriteURL:req.body.spriteURL,
                voteCount: 1
            })
        }
        await selectedContest.save()
    })
    res.send("voted")
})

app.get('/*', function (req, res) {
    res.render('index')
})

module.exports = app;