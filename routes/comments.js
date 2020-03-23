var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campgrounds');
var Comment = require('../models/comments');

router.get('/new', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', { campground: campground });
        }
    });
});

router.post('/', isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(req.body.comment);

            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('comment added');

                    // add username and id to comment
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

module.exports = router;