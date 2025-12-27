const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () =>{

    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('DB connected succesfully');
    }
    catch(er){
        console.error('Error connecting to DB', er.message);
        process.exit(1);
    }
};

module.exports = connectDB;