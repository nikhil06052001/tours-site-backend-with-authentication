const Review = require('./../model/reviewModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReview = catchAsync(async (req,res,next)=>{
    const reviews =await Review.find()

    res.status(200).json({
        status:'succes',
        result:reviews.length,
        data:{
            reviews:reviews
        }
    })
});

exports.createReview = catchAsync( async (req,res,next)=>{
    const review = await Review.create(req.body);

    res.status(201).json({
        status:'success',
        data:{
            review:review
        }
    })
})