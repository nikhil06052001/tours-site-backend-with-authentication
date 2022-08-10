const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');


const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"a tour must have a name"],
        unique:true,
        trim:true,
        maxlength:[40,'A tour name must have less than 40 character'],
        minlength:[5, "a tour have minimum 5 character"],
        //validate: [validator.isAlpha,' tour name must only contain charactor']
    },
    slug:String,
    duration:{
        type:Number,
        required:[true," A tour must have a duration"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"a goup can have ma 10 people"]
    },
    difficulty:{
        type:String,
        required:[true,"A tour must have difficulty"],
        enum:{
            values:['easy','medium','difficult'],
            message:'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingAverage:{
        type:Number,
        default:4.5,
        min:[1,"minimum 1"],
        max:[5,"less than 5"]
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'a tour must have price']
    },
    pricediscount:{
        type:Number,
        validate: {
            validator:function(val){
                // this only point to current doc
            return val < this.price;
        },
        message:'discount price ({value}) must be less than price'
    }
    },
    summary:{
        type:String,
        trim:true,
        required:[true,"a tour must have summary"]
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true, " a tour mu"]
    },
    image:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    },
    startLoctaion:{
        // geoJson
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    location:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            },
            coordinate:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    // embedding the user data
    // guides:{
    //     type:Array,
    //     required: true
    // }

    // refrencing the user data

    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]

},{
    toJSON:{ virtuals:true},
    toObject:{ virtuals:true}

});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
});

// document Middleare run before .save and .pre
tourSchema.pre('save',function(next){
    //console.log(this)
    this.slug = slugify(this.name, {Lower:true});
    next();
});
// // embeding the user data in tour data
// tourSchema.pre('save',async function(next){
//     const guidePromises = this.guides.map(async id =>await User.findById(id));
//     this.guides= await Promise.all(guidePromises)
//     next();
// });

tourSchema.pre('save',function(next){
    console.log('ill nextave the document')
    
    next();
});

tourSchema.pre(/^find/, function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
    })
})

tourSchema.post('save',function(doc, next){
    console.log(doc);
    next();
});



tourSchema.pre(/^find/,function(next){
// tourSchema.pre('find',function(next){
    this.find({secretTour:{$ne:true} });
    this.start = Date.now();
    next();
});
 
tourSchema.post(/^find/,function(docs,next){
    console.log(`Query took ${Date.now()-this.start} milliseconds`);
    //console.log(docs);
    next();
});

// AGGREGATION MIDDLEare

tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({ $match:{ secretTour:{ $ne: true}}});
    console.log(this.pipeline());
    next();
})

const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;