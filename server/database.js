const mongoose = require("mongoose")

module.exports = () => {
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/portal")
        console.log("Connected to database succesfully");
    } catch(err){
        console.log(err);
        console.log("Could not connect to database");
    }
}