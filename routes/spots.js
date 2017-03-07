var express = require("express");
var router  = express.Router(); 
var Spot    = require("../models/spot");
var middleware = require("../middleware");

//==========================
//     Spots ROUTE
//==========================

//INDEX - show you all the spots
router.get("/", function(req,res){
    Spot.find({},function(err, allspots){
       if(err){
           console.log(err);
       }else{
           res.render("spots/index",{spots: allspots}); 
       }
    });
});

//CREATE - add new spot to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newspot = {name: name, image: image, description: desc, author: author};
    
    Spot.create(newspot, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            res.redirect("/spots");
        }
    });
});

//NEW - show the form to send the data to create a new spot
router.get("/new", middleware.isLoggedIn, function(req,res){
   res.render("spots/new"); 
});

//SHOW - show more detailed info of each spot
router.get("/:id", function(req, res){
    //spot.findById(req.params.id, function(err, foundspot){    //still comment ID only
    Spot.findById(req.params.id).populate("comments").exec(function(err, foundspot){  //change to real comment
          if(err){
              req.flash("error", "The post cannot be found.");
              console.log(err);
              res.redirect("/spots");
          }else{
              //console.log(foundspot);
              res.render("spots/show", {spot: foundspot});
          }
       }); 
});

//EDIT 
router.get("/:id/edit", middleware.checkspotOwnership, function(req, res){
    Spot.findById(req.params.id, function(err, foundspot){
        if(err){
            res.redirect("/spots");
        }else{ 
            res.render("spots/edit", {spot: foundspot});
        }
    });
});

//UPDATE
router.put("/:id", middleware.checkspotOwnership, function(req, res){
    Spot.findByIdAndUpdate(req.params.id, req.body.spot, function(err, updatedspot){
        if(err){
            res.redirect("/spots");
        }else{
            req.flash("success", "The post is updated.");
            res.redirect("/spots/" + req.params.id);
        }
    });
});

//DELETE
router.delete("/:id", middleware.checkspotOwnership, function(req, res){
    Spot.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/spots");
        }else{
            req.flash("success", "The post is deleted.");
            res.redirect("/spots");
        }
    });
});

module.exports = router;