const express = require("express");
const router = express.Router();
const path = require("path");
const xss = require('xss');
const flash = require("connect-flash")
const bcrypt = require('bcrypt');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var SALT_ROUNDS = 16;
var User = require('../data/users');
var Prod = require('../data/products');
var Metadata = require('../data/metadata');
let tag = "Sign Out";

router.get("/", function (req, res) {
	try {
		res.render("dashboardlog");
	} catch (e) {
		var msg = typeof e == 'string' ? e : e.message;
		msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
		req.flash('error', msg);
		res.status(500).redirect('/');
	}
});
router.get("/aboutus", function (req, res) {
	try {
		res.render("aboutus");
	} catch (e) {
		var msg = typeof e == 'string' ? e : e.message;
		msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
		req.flash('error', msg);
		res.status(500).redirect('/');
	}
});
/*-----------Login and Authentication-------------------------*/
router.get("/login", function (req, res) {
	try {
		if (xss(req.user)) {
			req.flash('error', "First signout to login");
			res.status(403).redirect('/');
		} else
			res.render("login");
	} catch (e) {
		var msg = typeof e == 'string' ? e : e.message;
		msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
		req.flash('error', msg);
		res.status(500).redirect('/');
	}
});

/*---------------------------Registaration and Authentication----------------------*/
router.get("/signup", function (req, res) {
	try {
		if (xss(req.user)) {
			req.flash('error', "First signout to signup");
			res.status(403).redirect('/');
		} else
			res.render("signup");
	} catch (e) {
		var msg = typeof e == 'string' ? e : e.message;
		msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
		req.flash('error', msg);
		res.status(500).redirect('/');
	}
});

router.post('/signup', async function (req, res) {
	try {
		var name = xss(req.body.firstName);
		var email = xss(req.body.email);
		var lastName = xss(req.body.last);
		var phone = xss(req.body.phone);
		var city = xss(req.body.city);
		var address1 = xss(req.body.address1);
		var address2 = xss(req.body.address2);
		var password = bcrypt.hashSync(xss(req.body.password), SALT_ROUNDS);
		var password2 = bcrypt.compare(xss(req.body.password2), password);

		// Validation
		req.checkBody('firstName', 'Name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('phone', 'Phone is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Password do not match').equals(xss(req.body.password));

		var errors = req.validationErrors();
		if (errors) {
			res.render('signup', {
				errors: errors
			});
		} else {
			//checking for email and username are already taken
			try {
				var userexist = await User.getUserByemail(xss(email));
			} catch (e) {
				var userexist = undefined;
			}

			if (userexist) {
				var err = [{
					param: 'email',
					msg: 'User already Exists',
					value: xss(req.body.email)
				}];
				res.render('signup', {
					errors: err
				});
			} else {
				var newUser = ({
					firstName: name,
					lastName: lastName,
					phone: phone,
					city: city,
					phone: phone,
					address1: address1,
					address2: address2,
					email: email,
					hashedPassword: password
				});
				User.addUser(newUser, function (err, user) {
					if (err) throw err;
					console.log(xss(user));
					console.log(xss(req.user));
				});
				req.flash('success_msg', 'You are registered and can now login');
				res.redirect('/login');
			}
		}
	} catch (e) {
		var msg = typeof e == 'string' ? e : e.message;
		msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
		req.flash('error', msg);
		res.status(500).redirect('/signup');
	}

});
/*-------------------------Passport Locale Use-----------------------*/
passport.use('local', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, async function (email, password, done) {
	try {
		var l_objuser = await User.getUserByemail(xss(email));
		if (!l_objuser) {
			return done(null, false, {
				message: 'Unknown User'
			});
		}
		console.log("password match : " + bcrypt.compare(password, l_objuser.hashedPassword));
		if (await bcrypt.compare(password, l_objuser.hashedPassword)) {

			return done(null, l_objuser);
		} else {
			return done(null, false, {
				message: 'Invalid username and password'
			});
		}

	} catch (e) {
		return done(null, false, {
			message: 'Invalid username and password'
		});
	}

}));

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(async function (_id, done) {
	var l_objuser = await User.getUserById(_id);
	if (l_objuser) {
		done(null, l_objuser);
	}

});

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/products',
		failureRedirect: '/login',
		failureFlash: true
	}),
	function (req, res) {
		res.redirect('/');
	});

/*------------------------Logout------------------------------*/
router.get("/logout", function (req, res) {
	try {
		if (xss(req.user)) {
			req.logout();
			req.flash('success_msg', 'You are logged out');
			res.status(200).redirect("/login");
		} else {
			req.flash('error', 'Login first to logout');
			res.status(403).redirect("/login");
		}
	} catch (e) {
		var msg = typeof e == 'string' ? e : e.message;
		msg = (msg == undefined) ? 'Something went wrong, Please try again' : msg;
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

router.get("/info/:id", async function (req, res) {
	try {
		var posted_products = [];
		var bought_products = [];
		var postprod = false;
		var boughtprod = false;
		if (req.user) {
			if (req.user.posted_products.length > 0) {
				posted_products = await Prod.getProductsByPosterId(req.user._id);
				postprod = true;
			}
			if (req.user.bought_products.length > 0) {
				bought_products = await Metadata.getProductsByBuyerId(req.user._id);
				boughtprod = true;
			}
			res.render("info", {
				Logout: tag,
				users: xss(req.user),
				posted_products: posted_products,
				bought_products: bought_products,
				postprod: postprod,
				boughtprod: boughtprod
			});
		} else {
			req.flash("error", "You are not authenticated");
			res.status(403).redirect("/");
		}
	} catch (e) {
		var msg = typeof e == 'string' ? e : e.message;
		msg = msg == undefined ? 'Something went wrong, Please try again' : msg;
		req.flash('error', msg);
		res.status(500).redirect('/');
	}
});

module.exports = router;