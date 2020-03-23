var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds');
var middleware = require('../middleware');

router.get('/', function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('campgrounds/index', { campgrounds: campgrounds, currentUser: req.user });
        }
    });
});

router.post('/', middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var campgr = { name: name, image: image, description: desc, author: author };
    Campground.create(campgr, function (err, camp) {
        if (err) {
            console.log('Something went wrong !');
        }
        else {

            console.log('New Campground Created !');
            console.log("-------");
            console.log(camp);
            console.log("-------");
            // console.log(camp);
        }
    });

    res.redirect('/campgrounds');
});

router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new.ejs');
});

router.get('/:id', function (req, res) {

    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log('Something went wrong in findById !');
        }
        else {
            console.log(foundCampground);
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});

// EDIT CAMPGROUND
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req,res){

    Campground.findById(req.params.id, function(err, campground){
        res.render('campgrounds/edit', {campground: campground});
    });    
});

// UPDATE CAMPGROUND
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    var data = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    };
    Campground.findByIdAndUpdate(req.params.id, data, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.redirect('/campgrounds/'+ req.params.id);
        }
    });
});

// DELETE

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            console.log(campground.name+' deleted !');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;