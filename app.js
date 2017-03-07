var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds=[
    {name:"Bryce Canyon", image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg"}, 
    {name:"Wickham Park", image: "https://farm6.staticflickr.com/5059/5518252117_d232831997.jpg"}, 
    {name:"Melton Hill", image: "https://farm4.staticflickr.com/3741/9586943706_b22f00e403.jpg"},
    {name:"Beach Jersy", image: "https://farm2.staticflickr.com/1256/1307272314_ff4bbb3a45.jpg"}, 
    {name:"Sounthe Lake", image: "https://farm6.staticflickr.com/5787/20522423745_5b6ca60c43.jpg"}, 
    {name:"Orange Waterfall", image: "https://farm8.staticflickr.com/7021/6571748351_80ee449b23.jpg"}, 
    {name:"Devil Mountain", image: "https://farm9.staticflickr.com/8471/8137270056_21d5be6f52.jpg"}
    ]

app.get("/", function(req,res){
    res.render("landing");
});

//show you all the campgrounds
app.get("/campgrounds", function(req,res){
   res.render("campgrounds",{campgrounds: campgrounds}); 
});

//Totally different route with get one (RestFul)
//create a new campground
app.post("/campgrounds", function(req,res){
    //get data from form 
    //add to camgrounds array
    //redirect back to campgrounds page req
    
    //res.send("post request to /campgrounds");
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

//show the form to send the data to create a new campground
app.get("/campgrounds/new", function(req,res){
   res.render("new.ejs"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started.");
});