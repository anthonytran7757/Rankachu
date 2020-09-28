const schedule = require('node-schedule');
schedule.scheduleJob('*/30 * 6-18 * *', ()=>{
    console.log("im alive")
});