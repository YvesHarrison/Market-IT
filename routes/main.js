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
    res.status(500).json({ error: e });
  }
});
/*-----------Login and Authentication-------------------------*/
router.get("/login", function (req, res) {
  try {
    res.render("login");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

/*---------------------------Registaration and Authentication----------------------*/
router.get("/signup", function (req, res) {
  try {
    res.render("signup");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/signup', function (req, res) {
  var name = req.body.firstName;
  var email = req.body.email;
  var password = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
  
  user.save(function(err) {
    if (err) {
        res.send(err);
    } else {
        res.json({message: "User created!"});
    }    
});

	var password2 = bcrypt.compare(req.body.password2,password);

	// Validation
	req.checkBody('firstName', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();


	var errors = req.validationErrors();
	if(!password2){
	errors.push("Passwords do not match");
	}
	if (errors) {
		res.render('signup', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ firstname: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('signup', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: firstName,
						email: email,
						hashedPassword: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/login');
				}
			});
		});
	}
});
/*-------------------------Passport Locale Use-----------------------*/
passport.use(new LocalStrategy(
	function (email, password, done) {
		User.getUserByemail(email, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

/*------------------------Logout------------------------------*/
router.all("/logout", function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect("/login");
});

router.get("/info", function (req, res) {
  try {
    res.render("info");
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
module.exports = router;