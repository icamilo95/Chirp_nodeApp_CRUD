var express = require("express");
var app = express();
//Set up PG and models sequelize
var pg = require("pg"); //It requires the postgresmodel
var models = require("./models/index.js"); 
// var request = require("request");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended:true
}));
// Links to public folder
app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

//Set up method override --> It helps the form to set the put and delete 
var methodOverride = require("method-override");
app.use(methodOverride("_method"));


app.get('/', function(req,res){
   models.Chirp.findAll({order:[['createdAt']]}).done(function(messages, error){
      var lastChirpOder = messages.reverse();
      res.render("index", {
         allMessages: lastChirpOder
      });
   });
});


app.get('/edit/:id', function(req,res){
   models.Chirp.findById(req.params.id).done(function(message){
      res.render("edit", {
         chirpMessage: message
      });   
   });
   
});

app.post('/add', function(req,res){
   models.Chirp.create({
      message: req.body.message
   }).done(function(){
      res.redirect("/");
   });
});

app.put('/edit/:id', function(req,res){
   models.Chirp.findById(req.params.id).done(function(message){
      console.log("getting here");
      message.updateAttributes({
         message:req.body.message
      }).done(function(){
         res.redirect('/');
      });
   });
});

app.delete('/edit/:id', function(req,res){
   models.Chirp.findById(req.params.id).done(function(message){
      message.destroy().done(function(){
         res.redirect('/');
      });
   });
});












app.listen(3000);