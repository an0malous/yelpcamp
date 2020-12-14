const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

//============
//AUTH ROUTES
//============
//show signup page
router.get("/register", function(req, res){
res.render("register");
});
//handle signup logic
router.post("/register", function(req, res){
let newUser = new User({username: req.body.username});
router.register(newUser, req.body.password, function(err, user){
    if(err){
        req.flash("error", "There was a problem. Please try again.");
        return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
        req.flash("success", "registration was successful!");
        res.redirect("/campgrounds");
    });
});
});

//Show login form
router.get("/login", function(req, res){
res.render('login');

});
//handeling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect: "/login"
    })
);

//logout route
router.get("/logout", function(req, res){
req.logout();
req.flash("success", "Logged you out");
res.redirect("/campgrounds");

});
module.exports = router;