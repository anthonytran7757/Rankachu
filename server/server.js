if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
const jwt = require('jsonwebtoken')


let contest = require('../models/Contests')
let user  = require('../models/Users')
const dbUrl = 'mongodb://localhost/Rankachu'

mongoose.connect(dbUrl)

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
    res.status(200);
    res.send("voted");
})

app.get('/*', function (req, res) {
    res.render('index')
})

module.exports = app;