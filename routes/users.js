const express = require("express");
const router = express.Router();
const path = require("path");
const data = require('../data');
const xss = require('xss');
const users = data.users;
const tag = "Sign Out";
router.get("/", async (req, res) => {
    try {
        if (await users.getAllUsers()) {
            res.status(200).redirect('/');
        } else {
            req.flash('error', "No users found");
            res.status(404).redirect('/');
        }
    } catch (e) {
        var msg = typeof e == 'string' ? e : e.message;
        msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
        req.flash('error', msg);
        res.status(500).redirect('/');
    }
});

router.get("/info", function (req, res) {
    try {
        if (xss(req.user))
            res.render("info", {
                Logout: tag
            });
        else throw "You are not authenticated";
    } catch (e) {
        var msg = typeof e == 'string' ? e : e.message;
        msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
        req.flash('error', msg);
        res.status(500).redirect('/');
    }
});

router.get("/info/:id", function (req, res) {
    try {
        if(xss(req.user)){
            users.getUserById(xss(req.params._id), function (err, foundUser) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    res.status(403).redirect("/")
                } else {
                    res.status(200).render("info", {
                        Logout: tag,
                        users: foundUser
                    });
                }
            });
        }else{
            req.flash("error", "You are not authenticated");
            res.status(403).redirect("/login")
        }
        

    } catch (e) {
        var msg = typeof e == 'string' ? e : e.message;
        msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
        req.flash('error', msg);
        res.status(500).redirect('/products');
    }
});

router.get("/logout", function (req, res) {
    try {
        if (xss(req.user)) {
            req.logout();
            req.flash('success_msg', 'You are logged out');
            res.status(200).redirect("/login");
        } else {
            req.flash('error', 'Login first');
            res.status(403).redirect("/login");
        }
    } catch (e) {
        var msg = typeof e == 'string' ? e : e.message;
        msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
        req.flash('error', msg);
        res.status(500).redirect('/');
    }
});



module.exports = router;