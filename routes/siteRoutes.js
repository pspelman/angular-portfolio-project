var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var ProjectModel = mongoose.model('ProjectModel');
var ProjectModels = mongoose.model('ProjectModel');

mongoose.Promise = global.Promise;

class errorObject {
    constructor(){
        this.has_errors = false;
        this.error_list = [];
    }
}

// router.get('/', function (req, res) {
//     console.log(`reached the router`,);
//     res.sendFile(path.resolve("./public/dist/index.html"));
// });
//

//get all projects
router.get('/projects', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`arrived at GET projects...getting all projects`,);

    ProjectModels.find({}).
    // sort({stars: 1}).exec(function (err, projects) {
    exec(function (err, projects) {
        if (err) {
            err_holder.push(err.message);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            console.log(`there was an error looking up projects`, err);
            res.json({'message': 'there was an error', 'errors': err.message, 'err_holder': err_holder, 'errs': errs})
        } else {
            res.json({'message': 'successfully retrieved projects', 'projects': projects, 'errs': errs});
        }
    });

});


//COMPLETE: REVIEW router.get('/projects/:id', function(req, res){}
//get a SINGLE author by ID
router.get('/projects/:id', function (req, res) {
    console.log(`reached individual project lookup`,);
    let errs = new errorObject();
    let err_holder = [];
    console.log(`req.body: `,req.body);

    ProjectModels.find({_id: req.params.id}).
    sort({stars: -1}).exec(function (err, project) {
        if (err) {
            err_holder.push(err.message);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            console.log(`there was an error looking up the project`, err);
            res.json({'message': 'there was an error', 'errors': err.message, 'err_holder': err_holder, 'errs': errs})
        } else {
            res.json({'message': 'successfully retrieved the project', 'project': project, 'errs': errs});
        }
    });

});



//create a project
router.post('/projects', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    //new data recieved
    console.log(`request.body: `,req.body);

    console.log(`received request to make new project`,);

    let project = new ProjectModel();
    console.log(`initiated model`,);

    //VALIDATIONS
    if (req.body.project_title.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("title must be at least 3 characters");
    }
    // if (req.body.project_genre.length < 3 && req.body.project_genre.length > 0){
    //     errs.has_errors = true;
    //     errs.error_list.push("type must be at least 3 characters");
    // }
    if (req.body.review.user_name.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("reviewer name must be at least 3 characters");
    }
    if (req.body.review.review_text.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("review must be at least 3 characters long");
    }
    if (req.body.review.stars < 1 || req.body.review.stars > 5) {
        errs.has_errors = true;
        errs.error_list.push("rating can only be between 1-5 stars");
    }


    if (errs.has_errors) {
        res.json({"message": "validation errors encountered when trying to save new project", "errs": errs});
    } else {
        project.project_title = req.body.project_title;
        project.project_genre = req.body.project_genre;
        project.reviews.push(req.body.review);
        // project.description = req.body.description;

        project.save(function (err) {
            if (err) {
                // console.log(`there was an error saving to db`, err);
                errs.has_errors = true;
                errs.error_list.push(err.message);
                console.log(`there were errors saving to db`, err.message );
                res.json({'message': 'unable to save new project', 'errs': errs})
            } else {
                console.log(`successfully saved!`);
                res.json({'message': 'Saved new project!', 'errs': errs})
            }
        });
    }
});



//TODO: function for adding a review on a project
router.put('/reviews/:id', function (req, res) {
    console.log(`request to add new review to project ${req.params.id }`,);
    console.log(`BODY: `,req.body);

    let errs = new errorObject();
    let err_holder = [];


//     //VALIDATION FOR REVIEWS
    if (req.body.stars < 1 || req.body.stars > 5) {
        errs.has_errors = true;
        errs.error_list.push("Stars may only be between 1 and 5");
    }

    if (req.body.review_text.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("reviews must be at least 3 characters long");
    }
    // res.json({"message": "working on it", "errs": errs})

    if (req.body.user_name.length < 3) {
        errs.has_errors = true;
        errs.error_list.push("User name must be at least 3 characters long");
    }
    if (errs.has_errors) {
        res.json({"message":"there were errors adding the review", "errs": errs});

    }
    else {

        //TODO: Find project
        let current_project;
        ProjectModel.find({_id: req.params.id}).exec(function (err, project) {
            if (err) {
                console.log(`there was an error finding the project`, err);
                errs.has_errors = true;
                errs.error_list.push("no such project in DB");
            } else {
                console.log(`found project`, project);
                current_project = project;

            }
            console.log(`CURRENT MOVIE:`, current_project);
        });

        var opts = {runValidators: true, context: 'query'};
        ProjectModel.findOneAndUpdate({_id: req.params.id}, {
                $push: {
                    reviews: {
                        user_name: req.body.user_name,
                        review_text: req.body.review_text,
                        stars: req.body.stars
                    }
                }
            },
            opts,
            function (err, project) {
                if (err) {
                    console.log(`errors trying to add review`, err);
                    errs.has_errors = true;
                    errs.error_list.push(err.message);
                    res.json({"message": "error while trying to add review", 'project': project, 'errs': errs});

                } else {
                    res.json({"message": "Successfully added review!", 'project': project, 'errs': errs});

                }
            });
    }

});

//REMOVE REVIEW
router.put('/reviews/remove/:project_id', function (req, res) {
    console.log(`reached individual project lookup`,);
    let errs = new errorObject();
    let err_holder = [];
    console.log(`req.body: `,req.body);

    ProjectModel.findByIdAndUpdate(req.params.project_id, {
        "$pull": {
            'reviews': {'_id': req.body.review_id}

        }
    }, function (err) {
        if (err) {
            console.log(`there was an error`, err.message);
            res.json({"message": 'error removing review', "errs": errs});

        }
        else {
            console.log(`success`,);
            res.json({"message": 'success', "errs": errs});
        }
    });

});






//update an project's name
router.put('/projects/:id', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`ID: `,req.params.id);
    console.log(`reached project updater. Body: `, req.body);


    var opts = {runValidators: true , context: 'query'};
    ProjectModels.findOneAndUpdate({_id: req.params.id}, {
        project_title: req.body.project_title,
        project_genre: req.body.project_genre,
        description: req.body.description,
    }, opts, function (err) {
        if (err) {
            console.log(`there was an error updating`, err.message);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            res.json({'message': 'problem updating project', 'errs': errs});

        } else {
            res.json({'message': 'successfully updated project', 'errs': errs});
        }
    });
});



//UPDATE
router.put('/add_belt_test_model/:project_id', function (req, res) {
    console.log(`got request to update author's quotes auth: `,req.params.project_id);
    let errors = [];
    let project_id = req.params.project_id;
    let text_to_add_as_quote = req.body.quote_text;

    //validate quote length
    if(text_to_add_as_quote.length < 3){
        console.log(`you done messed up`,);
        let err = new Error("quote is not long enough");
        errors.push(err.message);
        res.json({'message':'done with the thing', 'author':project_id, 'errors': errors});

    } else {
        ProjectModels.find({_id: project_id}, function (err, author) {
            if (err) {
                errors.push(err.message);
                res.json({"message":"error adding quote", "errors":errors})
            } else {
                let author_to_update = author[0];
                console.log(`got the author, continue to ADD a quote:`,author);
                author[0].quotes.push({ quote_text: text_to_add_as_quote });
                author[0].save();
                res.json({'message':'Successfully saved', 'author':project_id});
            }
        });
    }
});


//DONE: router.delete('/', function(req, res){}
router.delete('/projects/:id', function (req, res) {
    let errs = new errorObject();
    let err_holder = [];

    console.log(`trying to delete the project`,);
    let project_id = req.params.id;

    console.log(`project: ${project_id}`);
    ProjectModels.remove({_id: req.params.id}, function (err) {
        if (err) {
            errs.has_errors = true;
            errs.error_list.push(err);
            res.json({'message': 'Error when deleting project', 'errs': errs});
        } else {
            res.json({'message': 'successfully deleted project', 'errs': errs});
        }
    });
});

//forward unresolved routes to Angular
router.all("/*", (req,res,next) => {
    console.log(`reached wildcard route...need to redirect to Angular templates`,);
    res.sendFile(path.resolve("./public/dist/index.html"));
});


//TODO : function for liking project
router.put('/projects/like/:id', function (req, res) {
    console.log(`like request: `, req.params.id);

    ProjectModels.findOneAndUpdate(
        { _id: req.params.id },
        {$inc: {likes: 1}}).exec(function(err, belt_test_model_data) {
        if (err) {
            throw err;
        }
        else {
            console.log(belt_test_model_data);
            res.json({'message': 'did the likes', 'project':belt_test_model_data})
        }
    })
});

//create one sample thing on load
var createSampleBeltTestModel = function () {
    let errs = new errorObject();
    let err_holder = [];
    console.log(`trying to make a sample ProjectModel`,);
    var BeltTestModelInstance = new ProjectModel();
    // BeltTestModelInstance.project_title = 'Barney';
    // BeltTestModelInstance.type = 'cat';
    // BeltTestModelInstance.description = 'fat cat in Washington';
    // BeltTestModelInstance.skills = ['bird watching', 'killing','littering', 'something_else'];
    BeltTestModelInstance.project_title = 'Blake';
    BeltTestModelInstance.type = 'Dog';
    BeltTestModelInstance.description = 'Likes lasagna';
    BeltTestModelInstance.skills.push({review: 'cleaning'});
    var subdoc = BeltTestModelInstance.skills[0];
    console.log(`SKILL SUBDOC: `,subdoc);

    BeltTestModelInstance.save(function (err) {
        if (err) {
            // console.log(`there was an error saving to db`, err);
            errs.has_errors = true;
            errs.error_list.push(err.message);
            console.log(`there were errors saving to db`, err.message );
        } else {
            console.log(`successfully saved!`);
        }
    });
};
// createSampleBeltTestModel();


module.exports = router;










// router.get('/', function (req, res) {
//     console.log(`reached the router`,);
//     res.sendFile(path.resolve("./public/dist/index.html"));
// });
//
//
// //get all projects
// router.get('/projects', function (req, res) {
//     let errs = new errorObject();
//     let err_holder = [];
//     console.log(`arrived at GET projects...getting all projects`,);
//
//     ProjectModels.find({}).
//     sort({stars: 1}).exec(function (err, projects) {
//         if (err) {
//             err_holder.push(err.message);
//             errs.has_errors = true;
//             errs.error_list.push(err.message);
//             console.log(`there was an error looking up projects`, err);
//             res.json({'message': 'there was an error', 'errors': err.message, 'err_holder': err_holder, 'errs': errs})
//         } else {
//             res.json({'message': 'successfully retrieved projects', 'projects': projects, 'errs': errs});
//         }
//     });
//
// });
//
//
// //COMPLETE: REVIEW router.get('/projects/:id', function(req, res){}
// //get a SINGLE author by ID
// router.get('/projects/:id', function (req, res) {
//     console.log(`reached individual project lookup`,);
//     let errs = new errorObject();
//     let err_holder = [];
//     console.log(`req.body: `,req.body);
//
//     ProjectModels.find({_id: req.params.id}).
//     sort({stars: -1}).exec(function (err, project) {
//         if (err) {
//             err_holder.push(err.message);
//             errs.has_errors = true;
//             errs.error_list.push(err.message);
//             console.log(`there was an error looking up the project`, err);
//             res.json({'message': 'there was an error', 'errors': err.message, 'err_holder': err_holder, 'errs': errs})
//         } else {
//             res.json({'message': 'successfully retrieved the project', 'project': project, 'errs': errs});
//         }
//     });
//
// });
//
//
//
// //FIXME: backside validation errors - standardize the way they are sent back to the front
// //create a project
// router.post('/projects', function (req, res) {
//     let errs = new errorObject();
//     let err_holder = [];
//     //new data recieved
//     console.log(`request.body: `,req.body);
//
//     console.log(`recieved request to make new project`,);
//
//     let project = new ProjectModel();
//     console.log(`initiated model`,);
//
//     if (req.body.project_title.length < 3) {
//         errs.has_errors = true;
//         errs.error_list.push("name must be at least 3 characters");
//     }
//     if (req.body.project_genre.length < 3){
//         errs.has_errors = true;
//         errs.error_list.push("type must be at least 3 characters");
//     }
//     if (req.body.description.length < 3){
//         errs.has_errors = true;
//         errs.error_list.push("description must be at least 3 characters");
//     }
//
//     if (errs.has_errors) {
//         res.json({"message": "validation errors encountered when trying to save new project", "errs": errs});
//     } else {
//         project.project_title = req.body.project_title;
//         project.project_genre = req.body.project_genre;
//         project.description = req.body.description;
//
//         project.save(function (err) {
//             if (err) {
//                 // console.log(`there was an error saving to db`, err);
//                 errs.has_errors = true;
//                 errs.error_list.push(err.message);
//                 console.log(`there were errors saving to db`, err.message );
//                 res.json({'message': 'unable to save new project', 'errs': errs})
//             } else {
//                 console.log(`successfully saved!`);
//                 res.json({'message': 'Saved new project!', 'errs': errs})
//             }
//         });
//     }
// });
//
//
//
// //TODO: function for adding a review on a project
// router.put('/reviews/:id', function (req, res) {
//     console.log(`request to add new review to project ${req.params.id }`,);
//     console.log(`BODY: `,req.body);
//
//     let errs = new errorObject();
//     let err_holder = [];
//
//     //VALIDATION FOR REVIEWS
//     if (req.body.stars < 1 || req.body.stars > 5) {
//         errs.has_errors = true;
//         errs.error_list.push("Stars may only be between 1 and 5");
//     }
//     if (req.body.review_text.length < 3) {
//         errs.has_errors = true;
//         errs.error_list.push("reviews must be at least 3 characters long");
//     }
//     if (req.body.user_name.length < 3) {
//         errs.has_errors = true;
//         errs.error_list.push("User name must be at least 3 characters long");
//     }
//
//
//     if (errs.has_errors) {
//         res.json({"message":"there were errors adding the review", "errs": errs});
//
//     }
//     else {
//
//         //TODO: Find project
//         let current_project;
//         ProjectModel.find({_id: req.params.id}).exec(function (err, project) {
//             if (err) {
//                 console.log(`there was an error finding the project`, err);
//             } else {
//                 console.log(`found project`, project);
//                 current_project = project;
//
//             }
//             console.log(`CURRENT REST:`, current_project);
//         });
//
//         var opts = {runValidators: true, context: 'query'};
//         ProjectModel.findOneAndUpdate({_id: req.params.id}, {
//                 $push: {
//                     reviews: {
//                         user_name: req.body.user_name,
//                         review_text: req.body.review_text,
//                         stars: req.body.stars
//                     }
//                 }
//             },
//             opts,
//             function (err, project) {
//                 if (err) {
//                     console.log(`errors trying to add review`, err);
//                     errs.has_errors = true;
//                     errs.error_list.push(err.message);
//                     res.json({"message": "error while trying to add review", 'project': project, 'errs': errs});
//
//                 } else {
//                     res.json({"message": "Successfully added review!", 'project': project, 'errs': errs});
//
//                 }
//             });
//     }
//
// });
//
// //update an project's name
// router.put('/projects/:id', function (req, res) {
//     let errs = new errorObject();
//     let err_holder = [];
//     console.log(`ID: `,req.params.id);
//     console.log(`reached project updater. Body: `, req.body);
//
//
//     var opts = {runValidators: true , context: 'query'};
//     ProjectModels.findOneAndUpdate({_id: req.params.id}, {
//         project_title: req.body.project_title,
//         project_genre: req.body.project_genre,
//         description: req.body.description,
//     }, opts, function (err) {
//         if (err) {
//             console.log(`there was an error updating`, err.message);
//             errs.has_errors = true;
//             errs.error_list.push(err.message);
//             res.json({'message': 'problem updating project', 'errs': errs});
//
//         } else {
//             res.json({'message': 'successfully updated project', 'errs': errs});
//         }
//     });
// });
//
//
//
//
// //UPDATE
// router.put('/add_belt_test_model/:project_id', function (req, res) {
//     console.log(`got request to update author's quotes auth: `,req.params.project_id);
//     let errors = [];
//     let project_id = req.params.project_id;
//     let text_to_add_as_quote = req.body.quote_text;
//
//     //validate quote length
//     if(text_to_add_as_quote.length < 3){
//         console.log(`you done messed up`,);
//         let err = new Error("quote is not long enough");
//         errors.push(err.message);
//         res.json({'message':'done with the thing', 'author':project_id, 'errors': errors});
//
//     } else {
//         ProjectModels.find({_id: project_id}, function (err, author) {
//             if (err) {
//                 errors.push(err.message);
//                 res.json({"message":"error adding quote", "errors":errors})
//             } else {
//                 let author_to_update = author[0];
//                 console.log(`got the author, continue to ADD a quote:`,author);
//                 author[0].quotes.push({ quote_text: text_to_add_as_quote });
//                 author[0].save();
//                 res.json({'message':'Successfully saved', 'author':project_id});
//             }
//         });
//     }
// });
//
//
//
// //DONE: router.delete('/', function(req, res){}
// router.delete('/projects/:id', function (req, res) {
//     let errs = new errorObject();
//     let err_holder = [];
//
//     console.log(`trying to delete the project`,);
//     let project_id = req.params.id;
//
//     console.log(`project: ${project_id}`);
//     ProjectModels.remove({_id: req.params.id}, function (err) {
//         if (err) {
//             errs.has_errors = true;
//             errs.error_list.push(err);
//             res.json({'message': 'Error when deleting project', 'errs': errs});
//         } else {
//             res.json({'message': 'successfully deleted project', 'errs': errs});
//         }
//     });
// });
//
// //forward unresolved routes to Angular
// router.all("/*", (req,res,next) => {
//     console.log(`reached wildcard route...need to redirect to Angular templates`,);
//     res.sendFile(path.resolve("./public/dist/index.html"));
// });
//
//
// //TODO : function for liking project
// router.put('/projects/like/:id', function (req, res) {
//     console.log(`like request: `, req.params.id);
//
//     ProjectModels.findOneAndUpdate(
//         { _id: req.params.id },
//         {$inc: {likes: 1}}).exec(function(err, belt_test_model_data) {
//         if (err) {
//             throw err;
//         }
//         else {
//             console.log(belt_test_model_data);
//             res.json({'message': 'did the likes', 'project':belt_test_model_data})
//         }
//     })
// });
//
//
//
//
// function update_by_quote_sub_id(){
//     ProjectModels.findOne({'quote._id': quoteId}).then(author => {
//         let quote = author.quote.id(quoteId);
//         quote.votes = 'something';
//         return author.save();
//     });
// }
//
// // Note that sub document array return from mongoose are mongoose
// // array instead of the native array data type. So you can manipulate them using .id .push .pop .remove method
// // http://mongoosejs.com/docs/subdocs.html
//
//
// //create one sample thing on load
// var createSampleBeltTestModel = function () {
//     let errs = new errorObject();
//     let err_holder = [];
//     console.log(`trying to make a sample ProjectModel`,);
//     var BeltTestModelInstance = new ProjectModel();
//     // BeltTestModelInstance.project_title = 'Barney';
//     // BeltTestModelInstance.type = 'cat';
//     // BeltTestModelInstance.description = 'fat cat in Washington';
//     // BeltTestModelInstance.skills = ['bird watching', 'killing','littering', 'something_else'];
//     BeltTestModelInstance.project_title = 'Blake';
//     BeltTestModelInstance.type = 'Dog';
//     BeltTestModelInstance.description = 'Likes lasagna';
//     BeltTestModelInstance.skills.push({review: 'pooping'});
//     var subdoc = BeltTestModelInstance.skills[0];
//     console.log(`SKILL SUBDOC: `,subdoc);
//
//     BeltTestModelInstance.save(function (err) {
//         if (err) {
//             // console.log(`there was an error saving to db`, err);
//             errs.has_errors = true;
//             errs.error_list.push(err.message);
//             console.log(`there were errors saving to db`, err.message );
//         } else {
//             console.log(`successfully saved!`);
//         }
//     });
// };
// // createSampleBeltTestModel();
