const express = require('express'),
	router = express.Router(),
	methodOverride = require('method-override'),
	Campground = require("../models/campground"),
	middleware = require("../middleware");

router.use(methodOverride("_method"));

//Displays all Campgrounds
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err) {
			console.log(err);
	} else {
		res.render("campgrounds/index", {campgrounds: allCampgrounds})
	}
	});
});

//Posts New campground after form is sent
router.post("/", function(req, res){
	let name= req.body.name;
	let image = req.body.image;
	let description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {name: name, image: image, description: description, author: author};
	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log(err);
		} else {
			res.redirect("campgrounds");
		}
	});
});
//Diplays page to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})

//SHOW
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){

	res.render("campgrounds/show", {campground: foundCampground});
	});
});
//EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//DELETE
router.delete("/:id", function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
})

module.exports = router;