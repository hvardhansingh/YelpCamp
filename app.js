var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    Campground      = require('./models/campgrounds'),
    Comment         = require('./models/comments'),
    seedDB          = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
seedDB();

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, campgrounds){
        res.render('campgrounds/index', {campgrounds:campgrounds});
    });
});

app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var camp = {name:name, image:image, description:desc};
    Campground.create(camp, function(err, camp){
        if(err){
            console.log('Something went wrong !');
        }
        else
        {
            console.log('New Campground Created !');
            console.log(camp);
        }
    });

    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res){
    res.render('campgrounds/new.ejs');
});

app.get('/campgrounds/:id', function(req, res){

    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log('Something went wrong in findById !');
        }
        else{
            console.log(foundCampground);
            res.render('campgrounds/show', {campground:foundCampground});
        }
    });

    // res.render('show');
});

app.get('/campgrounds/:id/comments/new', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            console.log(req.body.comment);

            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else{
                    console.log('comment added');
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+ campground._id);
                }
            });
            // res.redirect('/campgrounds');
            // 
        }
    });
});

app.listen(3000, function(){
    console.log('Serving at port 3000');
});