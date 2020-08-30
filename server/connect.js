import mongoose from "mongoose"

export default (db) =>{
    const connect = () => {
        mongoose.connect(db, {useNewUrlParser: true})
            .then(()=>{
                return console.log(`connected to ${db}`)
            })
            .catch(error => {
                console.log(`db error connecting to ${db}`, error)
                return process.exit(1)
            })
    }
    connect();
    mongoose.connection.on("disconnected", connect);
};

