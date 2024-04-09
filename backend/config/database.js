const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config();

const databaseConnect = () =>{
    console.log('mongo url',process.env.DATABASE_URL)
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology  : true
    }).then(()=>{
        console.log('Database Connected');
    }).catch((error)=> console.log(error))
}

module.exports = databaseConnect;