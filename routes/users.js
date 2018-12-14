const express = require("express");
const router = express.Router();
const path = require("path");
const data = require('../data');
const users = data.users;
const tag = "Sign Out";
router.get("/", async (req, res) => {
    try {
        res.status(200).json(await users.getAllUsers());
    } catch (e) {
        var msg = (typeof (e) == String) ? e : e.message;
        msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
        req.flash('failure_msg', msg);
        res.status(500).redirect('/');
    }
});

router.get("/info", function (req, res) {
    try {
        res.status(200).render("info", {
            Logout: tag
        });
    } catch (e) {
        var msg = (typeof (e) == String) ? e : e.message;
        msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
        req.flash('failure_msg', msg);
        res.status(500).redirect('/');
    }
});

router.get("/info/:id", function (req, res) {
    try {
        users.getUserById(xss(req.params._id), function (err, foundUser) {
            if (err) {
                req.flash("error", "Something went wrong");
                res.status(403).render("/")
            } else {
                res.status(200).render("info", {
                    Logout: tag,
                    users: foundUser
                });
            }
        });

    } catch (e) {
        var msg = (typeof (e) == String) ? e : e.message;
        msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
        req.flash('failure_msg', msg);
        res.status(500).redirect('/products');
    }
});

router.get("/logout", function (req, res) {
    try {
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.status(200).redirect("/login");
    } catch (e) {
        var msg = (typeof (e) == String) ? e : e.message;
        msg = msg == undefined ? 'Somethin went wrong, Please try again' : msg;
        req.flash('failure_msg', msg);
        res.status(500).redirect('/');
    }
});



module.exports = router;