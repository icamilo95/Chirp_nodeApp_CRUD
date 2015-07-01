var express = require("express");
var app = express();
//Set up PG and models sequelize
var pg = require("pg"); //It requires the postgresmodel
var models = require("./models/index.js"); 

//It requires the postgresmodel
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

//----

var migrate = require('migrate');
var set = migrate.load('migration/.migrate', 'migration');

set.up(function (err) {
  if (err) throw err;

  console.log('Migration completed');
});

//----


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
   console.log("message is: ", req.body.message.length);
   if (req.body.message.length < 140) {
      models.Chirp.create({
      message: req.body.message,
      avatar: req.body.image
      }).done(function(){
         res.redirect("/");
      });   
   }else {
      res.send("Message Should be less than 140 Characters");
   }
   
});

app.put('/edit/:id', function(req,res){
   models.Chirp.findById(req.params.id).done(function(message){
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










var port = Number(process.env.PORT || 3000);

app.listen(port);