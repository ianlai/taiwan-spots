var express = require("express");
var router = express.Router({mergeParams: true}); 
var Spot       = require("../models/spot");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

//==========================
//      Comment ROUTE
//==========================

//EDIT:    GET    /spots/:id/comments/:comment_id/edit 
//UPDATE:  PUT    /spots/:id/comments/:comment_id
//DELETE:  DELETE /spots/:id/comments/:comment_id

// Comments new 
router.get("/new", middleware.isLoggedIn, function(req,res){
   Spot.findById(req.params.id, function(err, spot){
      if(err){
          console.log(err);
      } else{
             res.render("comments/new", {spot: spot}); 
      }
   });
}); 

// Comment create
router.post("/", middleware.isLoggedIn, function(req,res){
   //lookup spot using ID
   Spot.findById(req.params.id, function(err, spot){
      if(err){
          console.log(err);
          res.redirect("/spots");
      } else{
            Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log(err);
               } else{
                   //add username and id to comment 
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();

                   //save comment
                   spot.comments.push(comment);
                   spot.save();
                   res.redirect("/spots/" + spot._id);
               }
            });
      }
   });
});

// Comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("/spots");
        }else{ 
            res.render("comments/edit", {
                spot_id: req.params.id,  //camground id (only id)
                comment: foundComment          //comment (whole object)
            });
        }
    });
});

// Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      }else{
          req.flash("success", "Comment updated.");
          res.redirect("/spots/" + req.params.id);
      }
   }); 
});

// Comment delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted.");
            res.redirect("/spots/" + req.params.id);
        }
    }); 
});

module.exports = router;