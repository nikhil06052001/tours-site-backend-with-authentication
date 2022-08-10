const mongoose = require('mongoose');
const validator = require('validator');
const bycrypt = require('bcryptjs');
const crypto = require('crypto');

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,`a user must have a name`]

    },
    email:{
        type:String,
        valida:[validator.isEmail,`provide valid email id`],
        unique:true,
        lowercase:true
    },
    role:{
        type:String,
        enum:['user', 'guide','lead-guide', 'admin'],
        default:'user'
    },
    photo:String,
    password:{
        type:String,
        required:[true,'a user must have a password'],
        minlength:8
    },
    passwordChangedAt:Date, 
    passwordConfirm:{
        type:String,
        required:[true,'a user must give password confirm'],
        validate:{
            validator: function(el){
                return el === this.password;
            },
            message:'the passord is not same'
        }
    },
    passwordResetExpires:Date,
    passwordResetToken:String,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
});

userschema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bycrypt.hash(this.password,12);
    this.passwordConfirm = undefined;
});

userschema.pre('save',function(next){
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() -1000;
    next();
});

userschema.pre(/^find/,function(next){
    this.find({ active:true});
    next();
})

userschema.methods.correctPassword=async function(candidatePassword, userPassword){
    return await bycrypt.compare(candidatePassword, userPassword);
} 
 
userschema.methods.changePasswordAfter = function(jwtTimestamp){
    if(this.passwordChangedAt){
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        console.log(this.passwordChangedAt, jwtTimestamp);
        return jwtTimestamp < changeTimestamp;
    }
    
    return false
}
userschema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires =Date.now +6000000;

    console.log({resetToken});
    return resetToken;
}

const User = mongoose.model('User',userschema);

module.exports = User; 