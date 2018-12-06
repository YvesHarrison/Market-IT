const express = require("express");
const router = express.Router();
const path = require("path");
const passport = require('passport');

router.get("/", async (req, res) => {
  try {
    res.render("dashboard");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
/*-----------Login and Authentication-------------------------*/
router.get("/login", async (req, res) => {
  try {
    res.render("login", { message: req.flash('loginMessage') });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile', 
  failureRedirect : '/login', 
  failureFlash : true 
}));

/*---------------------------Registaration and Authentication----------------------*/
router.get("/signup", async (req, res) => {
  try {
    res.render("signup", { message: req.flash('signupMessage') });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

/*------------------------Logout------------------------------*/
router.all("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

router.get("/info", async (req, res) => {
  try {
    res.render("info");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
module.exports = router;