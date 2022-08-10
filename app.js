const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongosanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')


const { nextTick } = require('process');
const app = express();

// middlere
// devolopment logging
if (process.env.NODE_ENV ==='development'){
    app.use(morgan('dev'));
}

// body parser, reading data from body
app.use(express.json({limit:'10kb'}));
// serving static file
app.use(express.static(`${__dirname}/public`));



// app.use((req,res,next)=>{
//     console.log("hello from the middleare");
//     next();
// });

// Data sanitization aganist Nosql query injection
app.use(mongosanitize());

// prevent parameter pollution
app.use(hpp({
    whitelist:['duration','ratingQuantity','ratingAverage','maxGroupSize','difficulty','price']
}));

// Data sanitization
app.use(xss())

// rate limiter
const limiter = rateLimit({
    max:100,
    windowMs: 60*60*1000,
    message:'too many request from this IP, try again later'
});

app.use('/api',limiter);
app.use(helmet());

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();
});
// app.get('/',(req,res)=>{
//     res.status(200).json({
//         message:'hello from the server side',
//         app:"Natours"
//     }) 
// });
// app.post('/',(req,res)=>{
//     res.send('you can send at this end point');
// });

// route handlers



// users



//routes

// app.get('/api/v1/tours',getAllTours);
// app.get('/api/v1/tours/:id',getTour);
// app.delete('/api/v1/tours/:id',deleteTour);
// app.patch('/api/v1/tours/:id',updateTour);
// app.post('/api/v1/tours',createTour);



app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/reviews',reviewRouter);
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`Can't find ${req.originalUrl} on this server`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err);

    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
});
app.use(globalErrorHandler);


module.exports = app; 