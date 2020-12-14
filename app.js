let express = require("express");
let app = express();
let mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	methodOverride = require('method-override'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	flash = require("connect-flash"),
	User = require('./models/user');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//===============
//ROUTER CONFIG
//===============
const commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/auth");


//===============
//PASSPORT CONFIG
//===============
app.use(require("express-session")({
	secret: "Crossfire is the best map",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});



//===========
//DATABASE
//===========
mongoose.connect("mongodb://localhost/YelpCamp");


//===========
// APP
//===========
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3002, process.env.IP, function(){
	console.log("App has launched");
});
