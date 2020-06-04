var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");




// ------****--------- APP CONFIG
var app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
// usare method_override per utilizzare i metodi put e delete
app.use(methodOverride("_method"));


// ------****--------- MONGOOSE CONFIG
mongoose.connect("mongodb://localhost:27017/movie", {useNewUrlParser: true});

var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    title: String,
    director: String,
    year: String,
    image: String,
    star: String,
    genre: String,
    text: String
});
// films is the collection of the folder movie
var Movie = mongoose.model("films", MovieSchema);


// ------****--------- ROUTE CONFIG

//FIRST PAGE
app.get("/", function(req,res){
   res.render("home"); 
});


// SHOW PAGE TO INSERT MOVIE
app.get("/movie/new", function(req,res){
    res.render("new");
});


// SHOW MOVIES
app.get("/movie", function(req,res){
    Movie.find({},function(err,movies){
        if(err){
            console.log(err);
        } else {
            res.render("show",{movies:movies});
        }
    });
});

// INSERT MOVIE - POST METHOD
app.post("/movie", function(req,res){
    console.log(req.body.movie);
    Movie.create(req.body.movie, function(err, data){
        if(err){
            res.redirect("/movie/new");
        } else {
            res.redirect("/movie");
        }
    });
});

// SINGLE MOVIE
app.get("/movie/:id", function(req,res){
    Movie.findById(req.params.id,function(err,data){
        if(err){
            console.log(err);
        } else {
            res.render("show-single-movie",{data:data});
        }
    });
});


// EDIT SINGLE MOVIE
app.get("/movie/:id/edit", function(req,res){
    Movie.findById(req.params.id, function(err,data){
        if(err){
            console.log(err);
        } else {
            res.render("edit-movie", {data:data});    
        }
    });
});

// UPDATE POST
app.put("/movie/:id", function(req,res){
    Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updateMovie){
        if(err){
            res.redirect("/movie/new");
        } else {
            res.redirect("/movie/" + req.params.id);
        }
    });
});


// -- DELETE ROUTE
app.delete("/movie/:id", function(req, res){
    // destroy
    Movie.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/movie/" + req.params.id);
        } else {
            res.redirect("/movie");
        }
    });
});




app.listen(4000 || newFunction(), function(){
    console.log("server started");
});


