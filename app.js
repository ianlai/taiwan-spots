//1. Edit campground
//2. Delete campground
//3. Authorization  (only campground owner can edit/delete it)
//    - middleware to protect at route
//    - hide the button
//4. Edit comment
//5. Delete comment 
//6. Authorization for 
//7. Refactor middleware

var express       = require("express"),
    bodyParser    = require("body-parser"),
    methodOverride= require("method-override"),
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

mongoose.connect("mongodb://localhost/yelpcamp_v10");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
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