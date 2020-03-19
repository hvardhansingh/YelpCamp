var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp');

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
//     name: "mardi himal", 
//     image: "http://bit.ly/38XPWiW",
//     description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
//     }, function(err, campground){
//         if(err){
//             console.log('Something Went Wrong');
//         }
//         else
//         {
//             console.log(campground);
//         }
// });

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

// var camps = [
//     {name: "ABC", image: "http://bit.ly/2SaoFD7"},
//     {name: "mardi himal".toUpperCase(), image:"http://bit.ly/38XPWiW"},
//     {name: "everest".toUpperCase(), image:"http://bit.ly/2u2Mh4N"},
//     {name: "ABC", image: "http://bit.ly/2SaoFD7"},
//     {name: "mardi himal".toUpperCase(), image:"http://bit.ly/38XPWiW"},
//     {name: "everest".toUpperCase(), image:"http://bit.ly/2u2Mh4N"},
//     {name: "ABC", image: "http://bit.ly/2SaoFD7"},
//     {name: "mardi himal".toUpperCase(), image:"http://bit.ly/38XPWiW"},
//     {name: "everest".toUpperCase(), image:"http://bit.ly/2u2Mh4N"}
// ];

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, campgrounds){
        res.render('campgrounds', {campgrounds:campgrounds});
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
    res.render('newCampground.ejs');
});

app.get('/campgrounds/:id', function(req, res){

    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log('Something went wrong in findById !');
        }
        else{
            res.render('show', {campground:foundCampground});
        }
    });

    // res.render('show');
});

app.listen(3000, function(){
    console.log('Serving at port 3000');
});