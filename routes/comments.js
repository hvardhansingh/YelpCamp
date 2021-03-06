var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campgrounds');
var Comment = require('../models/comments');
var middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', { campground: campground });
        }
    });
});
//CREATE
router.post('/', middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(req.body.comment);

            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash('error', 'Something went wrong.');
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
                    req.flash('success', 'Comment added successfully.');
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
});

// EDIT Route
// campgrounds/:id/comments/:id/edit
router.get('/:commentId/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, foundComment){
        if(err){
            console.log(err);
        }
        else{
            res.render('comments/edit.ejs', {campgroundId: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE Route
// campgrounds/:id/comments/:id/
router.put('/:commentId', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment,  function(err, updatedComment){
        if(err){
            console.log(err);
        }
        else{
            console.log('Comment Updated !');
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
}); 

// DESTROY Route
// campgrounds/:id/comments/:commentId
router.delete('/:commentId', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, removedComment){
        if(err){
            console.log(err);
        }
        else{
            req.flash('error', 'Comment deleted.');
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
})

module.exports = router;