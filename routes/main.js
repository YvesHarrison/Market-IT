const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require('bcrypt');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var SALT_ROUNDS = 16;
var User = require('../data/users');

router.get("/", function (req, res) {
	try {
		res.render("dashboard");
	} catch (e) {
		res.status(500).json({
			error: e
		});
	}
});
/*-----------Login and Authentication-------------------------*/
router.get("/login", function (req, res) {
	try {
		res.render("login");
	} catch (e) {
		res.status(500).json({
			error: e
		});
	}
});

/*---------------------------Registaration and Authentication----------------------*/
router.get("/signup", function (req, res) {
	try {
		res.render("signup");
	} catch (e) {
		res.status(500).json({
			error: e
		});
	}
});

router.post('/signup', function (req, res) {
	var name = req.body.firstName;
	var email = req.body.email;
	var lastName = req.body.lastName;
	var Phone = req.body.Phone;
	var city = req.body.city;
	var address1 = req.body.address1;
	var address2 = req.body.address2;
	console.log(req.body.password);
	var password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);

	var password2 = bcrypt.compare(req.body.password2, password);

	// Validation
	req.checkBody('firstName', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();


	var errors = req.validationErrors();
	if (!password2) {
		errors.push("Passwords do not match");
	}
	if (errors) {
		console.log(errors);
		res.render('signup', {
			errors: errors
		});
	} else {
		//checking for email and username are already taken
		var userexist = User.getUserByemail(email);
		if (!userexist) {
			errors.push("User Exists");
			res.render('signup', {
				errors: errors
			});
		} else {
			var newUser = ({
				firstName: name,
				lastName: lastName,
				Phone: Phone,
				city: city,
				address1: address1,
				address2: address2,
				email: email,
				hashedPassword: password
      });
			User.addUser(newUser, function (err, user) {
				if (err) throw err;
				console.log(user);
				console.log(req.user);
			});
			req.flash('success_msg', 'You are registered and can now login');
			res.redirect('/login');
		}
	}
});
/*-------------------------Passport Locale Use-----------------------*/
passport.use(new LocalStrategy(
	async function (email, password, done) {
		console.log(password);
		var l_objuser = await User.getUserByemail(email);
		console.log("hi user: " + l_objuser);
		if (!l_objuser) {
			return done(null, false, {
				message: 'Unknown User'
			});
		}

		if (bcrypt.compare(password, l_objuser.hashedPassword)) {

			return done(null, l_objuser);
		}
		else {
			return done(null, false, {
				message: 'Invalid password'
			});
		}
	}));

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(async function (_id, done) {
	console.log(_id);
	var l_objuser = await User.getUserById(_id);
	if(l_objuser){
		done(null,l_objuser);
	}
	
});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}),
	function (req, res) {
		
		res.redirect('/');
	});

/*------------------------Logout------------------------------*/
router.all("/logout", function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect("/login");
});

router.get("/info", function (req, res) {
	try {
		res.render("info");
	} catch (e) {
		res.status(500).json({
			error: e
		});
	}
});
module.exports = router;