const fs = require("fs");
const dotenv = require('dotenv') ;
const mongoose = require('mongoose')
dotenv.config({path:'./config.env'});
const Tour = require('./../../model/tourModel')


const DB = process.env.DATABASE//.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose
    //.connect(DB,{
    .connect(process.env.DATABASE_LOCAL
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModiy:false
    //}
).then(con =>{
    //console.log(con.connections);
    console.log(" db connection sucessfull...")
});

// read jason file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8')
)
// import data into db

const importData = async()=>{
    try{
        await Tour.create(tours);
        console.log('Data successfully loaded !')
    } catch(err){
        console.log(err);
    }
    process.exit();
}

// Delete all data from Db

const deleteData = async()=>{
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted !')
    } catch(err){
        console.log(err);
    }
    process.exit()
}

if(process.argv[2]==='--import'){
    importData()
}else if (process.argv[2]==='--delete'){
    deleteData();
}

console.log(process.argv);