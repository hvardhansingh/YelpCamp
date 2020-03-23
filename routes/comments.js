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

// EDIT Route
// campgrounds/:id/comments/:id/edit
router.get('/:commentId/edit', checkCommentOwnership, function(req, res){
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
router.put('/:commentId', checkCommentOwnership, function(req, res){
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
router.delete('/:commentId', checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, removedComment){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, comment){
            if(err){
                res.redirect('back');
            }
            else{

                if(comment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        });
    }else{
        res.redirect('back');
    }
}

module.exports = router;