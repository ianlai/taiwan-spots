//1. Change to Taiwan Spot

var express       = require("express"),
    bodyParser    = require("body-parser"),
    methodOverride= require("method-override"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    flash         = require("connect-flash"),
    Spot          = require("./models/spot"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");
    
var commentRoutes    = require("./routes/comments"),
    spotRoutes       = require("./routes/spots"),
    indexRoutes      = require("./routes/index");
    
var app = express();
var url = process.env.DATABASEURL || "mongodb://localhost/taiwanspots_v12"
mongoose.connect(url); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());
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
   res.locals.flash_success = req.flash("success");
   res.locals.flash_error = req.flash("error");
   next(); 
});

//======================
// Router Configuration
//======================

app.use("/", indexRoutes);
app.use("/spots", spotRoutes);
app.use("/spots/:id/comments/",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The TaiwanSpots server has started.");
});