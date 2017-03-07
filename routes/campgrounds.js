var express = require("express");
var router = express.Router(); 
var Campground = require("../models/campground");

//==========================
//     Campground ROUTE
//==========================

//INDEX - show you all the campgrounds
router.get("/", function(req,res){
    Campground.find({},function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
           res.render("campgrounds/index",{campgrounds: allCampgrounds}); 
       }
    });
});

//CREATE - add new campground to DB
router.post("/", function(req,res){
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
router.get("/new", function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW - show more detailed info of each campground
router.get("/:id", function(req, res){
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

module.exports = router;