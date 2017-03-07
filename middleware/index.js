var middlewareObj = {};  //middleware object
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){  
        return next();
    }
    req.flash("error", "You need to log in to continue.");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next){ 
    if(!req.isAuthenticated()){
        req.flash("error", "You need to log in to continue.");
        res.redirect("back");
        console.log("Authentication check: failed");
    }else{
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                //check whether the current user matches the campground's owner 
                if(foundCampground.author.id.equals(req.user._id)){
                    console.log("Authrization check: match " + foundCampground.author.id + " " + req.user._id);
                    next();
                }else{
                    console.log("Authrization check: dismatch " + foundCampground.author.id + " " + req.user._id)
                    req.flash("error", "You can only edit the post you own.");
                    res.redirect("back");
                }
            }
        });
    }
}
    
middlewareObj.checkCommentOwnership = function(req, res, next){ 
    if(!req.isAuthenticated()){
        req.flash("error", "You need to log in to continue.");
        res.redirect("back");
        console.log("Authentication check: failed");
    }else{
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                //check whether the current user matches the campground's owner 
                if(foundComment.author.id.equals(req.user._id)){
                    //console.log("Authrization check: match " + foundCampground.author.id + " " + req.user._id);
                    next();
                }else{
                    //console.log("Authrization check: dismatch " + foundCampground.author.id + " " + req.user._id)
                    req.flash("error", "You can only edit the comment you post.");
                    res.redirect("back");
                }
            }
        });
    }
}
    
module.exports = middlewareObj;