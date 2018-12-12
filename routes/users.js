const express = require("express");
const router = express.Router();
const path = require("path");
const data = require('../data');
const users = data.users;
router.get("/", async (req, res) => {
    try {

        res.json(await users.getAllUsers());
    } catch (e) {
        res.status(500).json({
            error: e
        });
    }
});

router.get("/logout", function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect("/login");
});

module.exports = router;