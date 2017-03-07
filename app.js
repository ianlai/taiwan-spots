//1. Store data in MongoDB with mongoose
//2. Add show route (show detail page)

var express    = require("express"),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");
var app = express();

mongoose.connect("mongodb://localhost/yelpcamp_v2");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// var campgrounds=[
//     {name:"Bryce Canyon", image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg"}, 
//     {name:"Wickham Park", image: "https://farm6.staticflickr.com/5059/5518252117_d232831997.jpg"}, 
//     {name:"Melton Hill", image: "https://farm4.staticflickr.com/3741/9586943706_b22f00e403.jpg"},
//     {name:"Beach Jersy", image: "https://farm2.staticflickr.com/1256/1307272314_ff4bbb3a45.jpg"}, 
//     {name:"Sounthe Lake", image: "https://farm6.staticflickr.com/5787/20522423745_5b6ca60c43.jpg"}, 
//     {name:"Orange Waterfall", image: "https://farm8.staticflickr.com/7021/6571748351_80ee449b23.jpg"}, 
//     {name:"Devil Mountain", image: "https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg"}
//     ]


var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);

//============
//   ROUTE
//============
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
   Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
          console.log(err);
      }else{
          res.render("show", {campground: foundCampground});
      }
   }); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started.");
});