// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object

// define the tournament model

let tournament = require('../models/tournament');


// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    displayName: req.user ? req.user.displayName : ''
   });
});




/* GET contact page. */
router.get('/contact', (req, res, next) => {
  res.render('content/contact', {
    title: 'Contact',
    displayName: req.user ? req.user.displayName : ''
   });
});

// GET /login - render the login view
router.get('/login', (req, res, next)=>{
  // check to see if the user is not already logged in
  if(!req.user) {
    // render the login page
    res.render('auth/login', {
      title: "Login",
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/'); // redirect to games list
  }
});

// POST /login - process the login attempt
router.post('/login', passport.authenticate('local', {
  successRedirect: '/tournament',
  failureRedirect: '/login',
  failureFlash: 'bad login'
}));

// GET /register - render the registration view
router.get('/register', (req, res, next)=>{
   // check to see if the user is not already logged in
  if(!req.user) {
    // render the registration page
      res.render('auth/register', {
      title: "Register",
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/tournament'); 
  }
});

// POST / register - process the registration submission
router.post('/register', (req, res, next)=>{
  User.register(
    new User({
      username: req.body.username,
      //password: req.body.password,
      email: req.body.email,
      displayName: req.body.displayName
    }),
    req.body.password,
    (err) => {
      if(err) {
        console.log('Error inserting new user');
        if(err.name == "UserExistsError") {
          req.flash('registerMessage', 'Registration Error: User Already Exists');
        }
        return res.render('auth/register', {
          title: "Register",
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
        });
      }
      // if registration is successful
      return passport.authenticate('local')(req, res, ()=>{
        res.redirect('/tournament');
      });
    });
});

// GET /logout - process the logout request
router.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/'); // redirect to the home page
});

router.get('/tournament', (req, res, next) => {
  res.render('content/tournament', {
    title: 'Dashboard',
    displayName: req.user ? req.user.displayName : ''
   });
});


module.exports = router;
