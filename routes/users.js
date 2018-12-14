const express = require("express");
const router = express.Router();
const path = require("path");
const data = require('../data');
const users = data.users;
const tag = "Sign Out";
router.get("/", async (req, res) => {
    try {

        res.json(await users.getAllUsers());
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

router.get("/info", function (req, res) {
	try {
		res.render("info", {Logout:tag});
	} catch (e) {
		res.status(500).json({
			error: e
		});
	}
});

router.get("/info/:id", function (req, res) {
	try {
        users.getUserById(xss(req.params._id), function(err,foundUser){
            if(err){
                req.flash("error", "Something went wrong");
                res.render("/")
            }
            else{
                res.render("info", {Logout:tag, users: foundUser});
            }
        });
		
	} catch (e) {
		res.status(500).json({
			error: e
		});
	}
});

router.get("/logout", function (req, res) {
    try{
	req.logout();
	req.flash('success_msg', 'You are logged out');
    res.redirect("/login");
    }
    catch (e) {
        res.status(500).json({
            error: e
        });
    }
});



module.exports = router;