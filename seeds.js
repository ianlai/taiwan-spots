var mongoose   = require("mongoose"),
    Spot       = require("./models/spot"),
    Comment    = require("./models/comment");
    
var data_spot = [
    {
        name: "Bryce Canyon", 
        image: "http://i.imgur.com/FBmfqAt.jpg", 
        description: "Just a few of the many things you can look forward to your experience at Canyon Camp. Nestled at the base of the Apple Canyon in Northwestern Illinois, Canyon Camp offers complete immersion in the natural world for your Boy Scout Troop. Make use of the 330 acres of natural wooded land for both Scouting advancement and activities."
    },    
    {
        name: "Devil Mountain", 
        image: "https://www.adventure-journal.com/wp-content/uploads/2014/06/adventure-journal-aj-list-bad-camping-reviews.jpg", 
        description: "The Seven Devils Mountains extend along the Idaho/Oregon border for about 50 miles roughly between the Idaho towns of Whitebird and Council. The Snake River through Hells Canyon forms the west boundary and the Salmon and Little Salmon rivers bound the east."
    },       
    {
        name: "Assateague Island", 
        image: "https://www.visitnc.com/resimg.php/imgcrop/2/41952/preview/800/480/CampingHammocksBeach.jpg", 
        description: "The protected seashore at Assateague Island stretches from Maryland into Virginia, with camping permitted on the Maryland side. The park’s oceanside campsites are spacious, sandy and just a short stroll on the boardwalk past the dunes to the beach."
    }    
]

var data_comment = [
    {
        author: "Luna",
        text: "Wow awesome place!"
    },
    {
        author: "Kimson",
        text: "I'd like to go one day."
    }
]

function seedDB(){
    Spot.remove({}, function(err){
       if(err){
           console.log(err);
        }
        console.log("All spots removed!");
        Comment.remove({}, function(err){
            if(err){
                console.log(err);
            };
            console.log("All comments removed!");
       
            data_spot.forEach(function(seed){
                Spot.create(seed, function(err, spot){
                    if(err){
                        console.log(err);
                    } else{
                        console.log("-- Spot created");
                     
                        Comment.create(data_comment[0], function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                spot.comments.push(comment);
                                spot.save();
                                console.log("----- Comment[0] created")
                                //console.log(spot.comments);
                            
                                Comment.create(data_comment[1], function(err, comment){
                                    if(err){
                                        console.log(err);
                                    } else{
                                        spot.comments.push(comment);
                                        spot.save();
                                        console.log("----- Comment[1] created")
                                        //console.log(spot.comments);
                                    }
                                });
                            }
                         });
                     
                    }
                });
            });
        });
    });
}

module.exports = seedDB;