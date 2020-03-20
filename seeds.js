var mongoose = require('mongoose');
var Campground = require('./models/campgrounds');
var Comment    = require('./models/comments');

var data = [
    {
        name: 'Kasol',
        image: 'http://bit.ly/33tnioo',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: 'Pokhara',
        image: 'http://bit.ly/3bdw1Of',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: 'Varanasi',
        image: 'http://bit.ly/392cYF8',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
];  

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log('Campgrounds Removed !');
            data.forEach(function(camp){
                Campground.create(camp, function(err, camp){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log('ADDED CAMPGROUND !');
                        Comment.create({
                            text: 'This is a beautiful place to visit !',
                            author: 'Vardhan'
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }
                            else{
                                camp.comments.push(comment);
                                camp.save();
                                console.log('Comment added');
                            }
                        }); 
                    }
                });
            });
        }
    });

    
}

module.exports = seedDB;


