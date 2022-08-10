const dotenv = require('dotenv') ;
const mongoose = require('mongoose')
dotenv.config({path:'./config.env'});
const app = require('./app');

process.on('uncaughtException',err=>{
    console.log(err);
    console.log(err.name, err.message);
    process.exit(1)
})

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
    console.log("db connection sucessfull...")
})//.catch(err => console.log('error'));





// const testTour = new Tour({
//     name:'the forest loader',
//     rating:4.7,
//     price:497
// });

// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err=>{
//     console.log('error: ',err);
// });

console.log(app.get('env'));
//console.log(process.env);

const port =process.env.port;

const server = app.listen(port,()=>{
    console.log('app running on the port '+port+ '...');
});


process.on('unhandledRejection',err=>{
    console.log(err.name, err.message);
    console.log('unhandled rejection shutting don....');
    server.close(()=>{
        process.exit(1)
    });
});

