const jwt = require('jsonwebtoken')
const {promisify} = require('util');
const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

const signToken =id=>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const cookieOptions ={
    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60),
    httpOnly:true
}

const createsendToken = (user, statusCode, res)=>{
    const token = signToken(user._id);

    if (process.env.NODE_ENV === 'production') cookieOptions.secure=true;
    res.cookie('jwt',token, cookieOptions)

    user.password = undefined;
    res.status(statusCode).json({
        status:'success',
        token,
        data:{
            user:user
        }
    });
} 

exports.signup =catchAsync( async(req,res,next)=>{
    const newUser = await User.create({

        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createsendToken(newUser, 201, res);
    next();
});

exports.login =async (req,res, next)=>{
    const {email,password} = req.body;
    // 1 check if email and password exist
    if (!email || !password ){
        return next(new AppError('please provide email and password',400));
    }
    // 2 check if user and password is correct
    const user =await User.findOne({email}).select('+password');
    const correct =await user.correctPassword(password, user.password);

    if (!user || !correct){
        return next(new AppError('incorrect email or password'),401);
    }
    // if all ok everything, send token to clint
    createsendToken(user,200,res)
    next();
}
 
exports.protect = catchAsync(async(req, res, next)=>{
    //1 getting token and check if it exist
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        //console.log(token)
    }
    
    console.log(token)
    if(!token){
        return next(new AppError('you are not logged in',401));
    }
    // 2 validate token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    //console.log(decoded)
    // 3 check if user is still exist
    const fershUser = await User.findById(decoded.id);
    console.log(fershUser);
    if (!fershUser){
        return next(new AppError('the user no longer eiht',401))
    }
    // if user change passord 
    if(fershUser.changePasswordAfter(decoded.iat)){
        return next(new AppError('please log in again',401))
    }
    req.user = fershUser;
    next();
}) ;
 
exports.restrictTo = (...roles)=>{
    return (req,res,next)=>{
        // role ['admin',['lead-guide']]
        if(!roles.includes(req.user.role)){
            return next(new AppError('you do not have permission',403))
        }
        next();
    }
}

exports.forgotPassword=catchAsync(async(req,res,next)=>{
    // get user based on email
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new AppError('ther is no such email address',404));
    }

    // genrate the random token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});

    // 
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `forgot your passord, submit the patch and confirm your passord to ${resetURL}, if you didn't then ignore the email`;
    //console.log(resetToken);

    try{await sendEmail({
        email:user.email,
        subject:`your token is valid for only ten min`,
        message
    });

    res.status(200).json({
        status:'success',
        message:'token sent to the mail'
    })}catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave:false})

        return next(new AppError('there as an error sending the email. try again later',500));
    }
})

exports.resetPassword =async (req,res, next)=>{
    // get user based token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    console.log(hashedToken);
    const user = await User.findOne({
        passwordResetToken:hashedToken
        //passwordResetExpires:{$gt:Date.now()}
        });

    //if the token is not epired then reset the passord
    if(!user){
        return next(new AppError('token is invalid, please try again',400));
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    // update the passord

    //log in the user and send jt
    createsendToken(user,200,res);
    next()
};

exports.updatePassword =async(req,res,next)=>{
    // get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // check if posted currentpassord i s correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('your current password is rong',401));
    };

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();


    // log in user , sent jt
    createsendToken(user,200,res) 
    next()
}