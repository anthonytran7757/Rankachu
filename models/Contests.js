var mongoose = require('mongoose')

const contestSchema = new mongoose.Schema({
    name: String,
    nominees:[{
        name: String,
        dexNum: Number,
        imgURL: String,
        spriteURL: String,
        voteCount: Number
    }]
})

const contestModel = mongoose.model('Contest', contestSchema);

let Contest = module.exports = mongoose.model('Contest', contestSchema)