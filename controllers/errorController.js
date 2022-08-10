const AppError = require("../utils/appError");

const handleCastErrorDE = err =>{
    const message = `invalid ${err.path}:${err.value}.`;
    return new AppError(message,400);
}

const handleJsonWebTokenError = err=>{
    return new AppError('invalid token, please login again!',401);
}

const handleDuplicateFeildDB = err =>{
    const value = err.errmsg.match(/(['''])(\\?.)*?\1/);
    console.log(value);
    const message = `Duplicate feild value: please use another value!`;
    return new AppError(message,400)
};

const handleValidationErrorDB = err=>{
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `invald input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const handleTokenExpiredError = err=>{
    new AppError('your token has epired, login again',401);
}

const sendErrorDev = (err, res) =>{
    return res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message:err.message,
        stack: err.stack
})
}

const sendErrorProd = (err,res)=>{
    // send only if err is operational and trusted
    if (err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        }) 
    }else{
        // for unknon error: don't leake detail
        console.log(err);
        res.status(500).json({
            status:'error',
            message:'something ent very rong'
        })
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
})
}


module.exports= fn=>((err,req,res,next)=>{
    //console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'devolopment'){
        sendErrorDev(err,res);
    }else if (process.env.NODE_ENV === 'production'){
        let error = {...err};

        if (error.name === 'CastError') error = handleCastErrorDE(error);
        if (error.code ===11000) error = handleDuplicateFeildDB(error);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name ==='JsonWebTokenError') error = handleJsonWebTokenError(error);
        if (error.name ==='TokenExpiredError') error = handleTokenExpiredError(error);

        sendErrorProd(error,res);
    }
})