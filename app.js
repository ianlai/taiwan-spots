//1. Authentication

//   Part1
//   - Install all packages needed for auth
//   - Define User model

//   Part2
//   - Configure Passport
//   - Add register routes
//   - Add register template

//   Part3
//   - Add login routes
//   - Add login template
 
//   Part4 
//   - Add logout route
//   - Prevent user from adding a comment if not signed in (middleware)
//   - Add links to navbar 

//   Part5
//   - Show/hide auth links in navbar correctly



    
//INDEX    /campgrounds
//NEW      /campgrounds/new
//CREATE   /campgrounds
//SHOW     /campgrounds/:id    

//NEW      /campgrounds/:id/comments/new
//CREATE   /campgrounds/:id 


var express       = require("express"),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
var app = express();

mongoose.connect("mongodb://localhost/yelpcamp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
seedDB();

//======================
//Passport Configuration
//======================
app.use(require("express-session")({
    secret: "Winter is coming.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass req.user to currentUser for every route
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next(); 
});

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          console.log(err);
      } else{
             res.render("comments/new", {campground: campground}); 
      }
   });
}); 

app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
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

//==========================
//        Auth ROUTE
//==========================

//Show register form 
app.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
app.post("/register", function(req,res){
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
app.get("/login",function(req, res){
    res.render("login");
});

//handle login logic, use middleware 
//just like: 
//app.post("/login", middleware, callback)
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    function(req, res){
});

//logout route
app.get("/logout", function(req,res){
    req.logout();  //came from package
    res.redirect("/campgrounds");
}); 

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){  
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started.");
});