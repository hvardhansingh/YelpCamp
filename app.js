var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    Campground      = require('./models/campgrounds'),
    Comment         = require('./models/comments'),
    User            = require('./models/users'),
    seedDB          = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));
seedDB();

// PASSPORT CONFIG

app.use(require('express-session')({
    secret: 'I am harsh Vardhan Singh',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    return next();
}); 

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render('campgrounds/index', {campgrounds:campgrounds, currentUser: req.user});            
        }
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

app.get('/campgrounds/:id/comments/new', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render('comments/new', {campground: campground});
        }
    });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res){
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

// AUTH ROUTES

app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect('/register');
        }
        else{
            console.log(user);
            passport.authenticate('local')(req, res, function(){
                res.redirect('/campgrounds');
            });
        }
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), function(req, res){
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    res.redirect('/login');
};

app.listen(3000, function(){
    console.log('Serving at port 3000');
});