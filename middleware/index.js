var Campground = require('../models/campgrounds');
var Comment = require('../models/comments');
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err){
                req.flash('error', 'Campground not found.');
                res.redirect('back');
            }
            else{
                if(campground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash('error', 'Access denied.');
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash('error', 'Please login first.');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
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
                    req.flash('error', 'Access denied.');
                    res.redirect('back');
                }
            }
        });
    }else{
        req.flash('error', 'Please login first.');
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    req.flash('error', 'Please login first.');
    res.redirect('/login');
}

module.exports = middlewareObj;