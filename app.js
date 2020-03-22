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

var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');


mongoose.connect('mongodb://localhost/yelp_camp');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({ extended: true }));
// seedDB();

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

app.use(indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);

app.listen(3000, function(){
    console.log('Serving at port 3000');
});