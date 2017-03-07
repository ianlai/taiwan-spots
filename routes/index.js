var express = require("express");
var router = express.Router(); 
var passport = require("passport");
var User     = require("../models/user");

//==========================
//        Root ROUTE
//==========================
router.get("/", function(req,res){
    res.render("landing");
});

//==========================
//        Auth ROUTE
//==========================

//Show register form 
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");  //end the function if err
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form 
router.get("/login",function(req, res){
    res.render("login");
});

//handle login logic, use middleware 
//just like: 
//app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function(req, res){
});

//logout route
router.get("/logout", function(req,res){
    req.logout();  //came from package
    res.redirect("/campgrounds");
}); 

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){  
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
