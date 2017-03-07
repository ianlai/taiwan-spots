//1. Associate campgrounds and user
//     - Unauthenticated user cannot create a campground
//     - Save username+id to a newly created campground

var express       = require("express"),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
    
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
var app = express();

mongoose.connect("mongodb://localhost/yelpcamp_v8");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
//seedDB(); //seed the database

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

//======================
// Router Configuration
//======================

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started.");
});