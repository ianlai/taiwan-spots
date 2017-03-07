//1. Add comment function (only show comment but not add comment)
//2. Refactor database schemas (campground and comment) to separate files
//3. Create seedDB() to create the dumb data in database

var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds");
var app = express();

mongoose.connect("mongodb://localhost/yelpcamp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB();

//=====================
//        ROUTE
//=====================
app.get("/", function(req,res){
    res.render("landing");
});

//INDEX - show you all the campgrounds
app.get("/campgrounds", function(req,res){
    Campground.find({},function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("campgrounds",{campgrounds: allCampgrounds}); 
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
   res.render("new.ejs"); 
});

//SHOW - show more detailed info of each campground
app.get("/campgrounds/:id", function(req, res){
//Campground.findById(req.params.id, function(err, foundCampground){    //still comment ID only
Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){  //change to real comment
      if(err){
          console.log(err);
      }else{
          //console.log(foundCampground);
          res.render("show", {campground: foundCampground});
      }
   }); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started.");
});