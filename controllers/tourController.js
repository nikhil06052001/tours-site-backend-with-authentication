const fs = require('fs');
const { exit, nextTick } = require('process');
const { findByIdAndUpdate } = require('./../model/tourModel');
const Tour= require('./../model/tourModel');
const APIFearute = require('./../utils/apifeatures');
const APIFeatures = require('./../utils/apifeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req,res,next)=>{
    req.query.limit = '5';
    req.query.sort = '-ratingAverage, price';
    req.query.feilds = 'name,price,ratingsAverage,summary,difficulty';
    next();

}

//const tours= JSON.parse(fs.readFileSync(__dirname+'/../dev-data/data/tours-simple.json'));

// exports.CheckID=(req,res,next,val)=>{
//     if (req.params.id*1 > tours.length){
//         return res.status(404).json({
//             status:"fail",
//             message:"invalid id"
//         });
//     };
//     next();
// };

// exports.checkBody = (req,res,next)=>{
//     if (!req.body.name || !req.body.price){
//         return res.satus(400).json({
//             status:'fail',
//             message:'missing name or price'
//         })
//     }
//     next();
// }





exports.getAllTours=catchAsync(async (req,res,next)=>{
    //console.log(req.requestTime);
    // res.status(200).json({
    //     satus:'success',
    //     results:tours.length,
    //     requestedAt: req.requestTime,
    //     data:{
    //         tours:tours
    //     }
    //});

    //try{
        // build query
        
        // const queryObj = {...req.query};
        // const excludeFeilds = ['page','sort','limit','feilds'];
        // excludeFeilds.forEach(el => delete queryObj[el]);

        // // advance filtering
        // let querystr = JSON.stringify(queryObj);
        // querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g,match => ('$'+match));
        // console.log(JSON.parse(querystr));
        // console.log(req.query, queryObj,JSON.parse(querystr));
        // // {difficulty:'easy', duration:{ $gte:5}}
        // // {difficulty:'easy', duration: {gte:'5'}}
        // // gte, gt, lte, lt

        // let query = await Tour.find(JSON.parse(querystr))

        // sortig
        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ');
        // }
        // else{
        //     sortBy=('createdAt');
        // }
        // query=query.sort(req.query.sortBy)
        //console.log(sortBy);

        // // feild limiting
        // if (req.query.feilds){
        //     const feilds = req.query.feilds.split(',').join(' ');
        //     //query = query.select(feilds);
        // }else{
        //     //query= query.select('-__v');
        // }

        // pagination
        // const page = req.query.page*1 || 1;
        // const limit = req.query.limit*1 ||100;
        // const skip = (page - 1)*limit;
        // //query = query.skip(skip).limit(limit);

        // if (req.query.page){
        //     const numTours = await Tour.countDocuments();
        //     if(skip>= numTours) throw new Error('this page does not eist');
        // }

        // const tour = await Tour.find({
        //     duration:5,
        //     difficulty:'easy'
        // });

        // const tour = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');


        // ecute query
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFeild().pagination();
        const tours = await features.query;
        res.status(200).json({
        satus:'success',
        results:tours.length,
        requestedAt: req.requestTime,
        data:{
            tours:tours
        }
        });
    // }catch(err){
    //     console.log(err);
    //     res.status(400).json({
    //         status:"fail",
    //         message:"error"
    //     });
    // };
});


exports.getTour=catchAsync(async (req,res,next)=>{
    // console.log(req.params);
    // const id = req.params.id*1;
    // const tour = tours.find(el => el.id === id)
    // //if(id> tours.length)
    // if (!tour){
    //     return res.status(404).json({
    //         status:"fail",
    //         message:" invalid id"
    //     })
    // }
    
    // res.status(200).json({
    //     satus:'success',
    //     //results:tours.length,
    //     data:{
    //         tours:tour
    //     }
    // });
    const tour = await Tour.findById(req.params.id);//.populate({
    //     path:'guides',
    //     select:'-__v -passwordChangedAt'
    // });

    if (!tour){
       return next(new AppError('No tour ith that ID',400))
    }

    //try{
        // Tour.findOne({ _id: req.params.id})
    res.status(200).json({
    satus:'success',
    requestedAt: req.requestTime,
    data:{
        tours:tour
    }
    })
    // }catch(err){
    //     console.log(err);
    //     res.status(400).json({
    //         status:"fail",
    //         message:"error"
    //     });
    // };
});



exports.createTour= catchAsync(async (req,res,next)=>{

    const newTour = await Tour.create(req.body);
        res.status(201).json({
            status:'sucess',
            data: {
                tour:newTour
            }
        });

    //console.log(req.body);
    // const newId = tours[tours.length-1].id+1;
    // const newTour = Object.assign({id:newId}, req.body);
    // tours.push(newTour);
    // fs.writeFile(__dirname+'/dev-data/data/tours-simple.json',JSON.stringify(tours),err=>{
    //     res.status(201).json({
    //         status:'sucess',
    //         data: {
    //             tour:newTour
    //         } 
    //     });
    // });
    //res.send('Done');

    // const newTour = new Tour({});
    // newTour.save();


//     try{
//     const newTour = await Tour.create(req.body);
//         res.status(201).json({
//             status:'sucess',
//             data: {
//                 tour:newTour
//             }
//         });
//     }catch(err){
//         console.log(err);
//         res.status(400).json({
//             status:"fail",
//             message:err
//         });
//     }
//     next();
});

exports.updateTour=catchAsync(async(req,res,next)=>{
    // if (req.params.id*1 > tours.length){
    //     return res.status(404).json({
    //         status:"fail",
    //         message:"invalid id"
    //     });
    // }
    //try{
        const tour =await Tour.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });

        if (!tour){
            return next(new AppError('No tour ith that ID',400))
         }

        // res.status(200).json({
        //     status:"sucuss",
        //     data:{
        //         tour:tour
        //     }
        // });
    // }catch(err){
    //     console.log(err);
    //     res.status(400).json({
    //         status:"fail",
    //         message:"error"
    //     });
    // };
});

exports.deleteTour=catchAsync(async (req,res,next)=>{
    // if (req.params.id*1 > tours.length){
    //     return res.status(404).json({
    //         status:"fail",
    //         message:"invalid id"
    //     })
    // }
    

    //try{
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if (!tour){
            return next(new AppError('No tour ith that ID',400))
         }
        //  
    // }catch(err){
    //     console.log(err);
    //     res.status(400).json({
    //         status:"fail",
    //         message:"error"
    //     });
    // };
});

exports.getTourStats =catchAsync( async(req,res)=>{
    //try{
        const stats =await Tour.aggregate([
        {
            $match:{ ratingsAverage: {$gte:4.5}}
        },
        {
            $group:{
                _id:null,
                numRatings:{ $sum:'$ratingsQuantity'},
                avgRating:{ $avg: '$ratingsAverage'},
                avgPrice: { $avg:'$price'},
                minPrice:{ $min:'$price'},
                maxPrice:{ $max:'$price'}
            }
        },
        {
            $sort:{ avgPrice:1}
        },
        {
            $match:{_id:{$ne:'EASY'}}
        }
        ]);
        res.status(200).json({
            status:"sucuss",
            data:{
                stats:stats
            }
        });
    } 
    // catch(err){
    //     console.log(err);
    //     res.status(400).json({
    //         status:"fail",
    //         message:"error"
    //     });
    // }
);

exports.getMonthlyPlan =catchAsync( async (req,res,next)=>{
    //try{
        const year = req.params.year*1;
        const plan = await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    numTourstart:{ $sum:1},
                    tours:{$push:'$name'}
                }
            },
            {
                $addFields:{month:'$_id'}
            },
            {
                $project:{
                    _id:0
                }
            },
            {
                $sort:{
                    numTourstart:-1
                }
            },
            {
                $limit:6
            }
        ]);

        res.status(200).json({
            status:"sucuss",
            data:{
                plan
            }
        });
    // }catch(err){
    //     console.log(err);
    //     res.status(400).json({
    //         status:"fail",
    //         message:"error"
    //     });
    // }
});
