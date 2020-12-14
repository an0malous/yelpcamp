const Campground = require("../models/campground"),
    Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)){
					next();
			} else {
				res.redirect("back");
			}
		}
		})
	} else {
		res.redirect("back");
	}
	
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
                req.flash("error", "There was a problem. Please try agian." );
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
			} else {
                req.flash("error", "There was a problem. Please try agian." );
				res.redirect("back");
			}
		}
		})
	} else {
        req.flash("error", "There was a problem. Please try agian." );
		res.redirect("back");
	}
	
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
        req.flash("success", "You are logged in." );
		return next();
    }
    req.flash("error", "You must first log in" );
	res.redirect("/login");
};




module.exports = middlewareObj