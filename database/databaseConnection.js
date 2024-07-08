const mongoose = require('mongoose');
// cjs ma xa vane

async function connectToDb(){
    await mongoose.connect("mongodb+srv://chauhanhariomraj7:techhrch123@cluster0.fswzwtx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    console.log("Connected to database");
}

module.exports = connectToDb;