const mongoose = require('mongoose');
const Tour = require('./tourModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:[true, ' a review must have data'],
        trim:true,
        maxlength:[100,' a review connot excides 100 word'],
        minlength:[10,'minimum required word i 10']
    },
    rating:{
        type:String,
        required: [ true, ' a review must have rating'],
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    refToTour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,' a review must belong to a tour']
    },
    refToUser:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, ' a review must belong to user ']
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;