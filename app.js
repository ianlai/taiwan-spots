//1. Styling

//INDEX    /campgrounds
//NEW      /campgrounds/new
//CREATE   /campgrounds
//SHOW     /campgrounds/:id    

//NEW      /campgrounds/:id/comments/new
//CREATE   /campgrounds/:id 


var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    seedDB     = require("./seeds");
var app = express();

mongoose.connect("mongodb://localhost/yelpcamp_v5");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
seedDB();

//==========================
//        Campground ROUTE
//==========================
app.get("/", function(req,res){
    res.render("landing");
});

//INDEX - show you all the campgrounds
app.get("/campgrounds", function(req,res){
    Campground.find({},function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("campgrounds/index",{campgrounds: allCampgrounds}); 
       }
    });
   
});

//CREATE - add new campground to DB
app.post("/campgrounds", function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show the form to send the data to create a new campground
app.get("/campgrounds/new", function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW - show more detailed info of each campground
app.get("/campgrounds/:id", function(req, res){
//Campground.findById(req.params.id, function(err, foundCampground){    //still comment ID only
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){  //change to real comment
      if(err){
          console.log(err);
      }else{
          //console.log(foundCampground);
          res.render("campgrounds/show", {campground: foundCampground});
      }
   }); 
});

//==========================
//      Comment ROUTE
//==========================
app.get("/campgrounds/:id/comments/new", function(req,res){
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
      } else{
             res.render("comments/new", {campground: campground}); 
      }
   });
}); 

app.post("/campgrounds/:id/comments", function(req,res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } else{
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
            });
      }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground to 
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started.");
});