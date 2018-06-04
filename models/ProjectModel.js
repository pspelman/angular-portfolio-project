var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var ReviewSchema = new mongoose.Schema({
    //review review, comment, etc.
    review: {
        type: String,
        minlength: 3
    }
});

//VALIDATION
ReviewSchema.pre('save', function (next) {
    if ('invalid' === this.review) {
        return next(new Error('#sadpanda'));
    }
    next();
});



var reviewSchema = new mongoose.Schema({
    user_name: 'string',
    review_text: 'string',
    stars: 'number',
}, {timestamps: true});

reviewSchema.pre('save', function (next) {
    // if (this.review.length > 0 && this.review.length < 3) {
    //     return next(new Error('#sadpanda, your reviews must be at least 3 characters long!'));
    // }
    if (this.user_name.length < 3) {
        return next(new Error('name must be more than 3 characters to leave a review'));
    }
    if (this.review_text.length < 3) {
        return next(new Error('review must be more than 3 characters to leave a review'));
    }
    next();
});

//Instruction says use only ONE schema
var ProjectSchema = new mongoose.Schema({
    project_title: {
        type: String,
        required: true,
        minlength: 3,
        unique: true
    },
    description: {
        type: String,
        required: true,
        minlength: 3,
        unique: false
    },
    project_genre: {
        type: String,
        required: false,
        minlength: 3
    },
    reviews: [reviewSchema],
    likes: {
        type: Number,
        default: 0
    }
},{timestamps: true});
ProjectSchema.plugin(uniqueValidator);

// ProjectSchema.pre('save', function (next) {
//     if (this.reviews.length > 3){
//         return next(new Error('you can only have 3 project reviews'));
//     }
//     next();
// });

mongoose.model('ProjectModel', ProjectSchema);
var ProjectModel = mongoose.model('ProjectModel');