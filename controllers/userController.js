const User = require('./../model/userModel');
const catchAsync = require('./../utils/catchAsync');
const fs = require('fs');
const AppError = require('./../utils/appError');
const { allowedNodeEnvironmentFlags } = require('process');

const filterObj = (obj,...allowedfeilds)=>{
    const newObj ={};
    Object.keys(obj).forEach(el =>{
        if (allowedfeilds.includes(el)) newObj[el]=obj[el]
    });
    return newObj;
}

exports.getAllUser =catchAsync(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        status:'success',
        result: users.length,
        data:{
            users
        }
    })
    return next( new AppError('invalid request',400))

})

exports.createUser =(req,res)=>{
    res.status(500).json({ 
        status:'error',
        message:'this route is not yet defined'
    })
};

exports.deleteUser =(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'this route is not yet defined'
    })
};

exports.updateUser =(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'this route is not yet defined'
    })
}

exports.getUser =(req,res)=>{
    res.status(500).json({
        status:'error',
        message:'this route is not yet defined'
    })
}

exports.updateMe =catchAsync(async (req,res,next)=>{
    // 1 create error if user post passord data
    if (req.body.password || req.body.passwordConfirm){
        return next(new AppError(' thi route i not for password update',400));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');
    const user = await User.findByIdAndUpdate(req.user.id,filteredBody , {
        new: true,
        runValidators:true
    });
    

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
    // update user data
});

exports.deleteMe =catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active:false});

    res.status(204).json({
        status:"success",
        data:null
    })
})