var express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds');

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

router.post('/', isLoggedIn, function (req, res) {
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

router.get('/new', isLoggedIn, function (req, res) {
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

module.exports = router;