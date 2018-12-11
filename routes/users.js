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
module.exports = router;