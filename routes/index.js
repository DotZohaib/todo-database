var express = require('express');
const passport = require('passport');
var router = express.Router();
var userModel = require('./users');

var localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Express' });
});


// Registration route
router.post('/register', function(req, res, next) {
  var userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  userModel.register(userdata, req.body.password)
  .then(function(registeredUsers){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile');
    });
  })
  .catch(function(err) {
    console.error('Registration error:', err);
    // Handle registration error, e.g., display an error message or redirect to registration page with error message
    res.redirect('/register'); // Example: Redirect back to registration page
  });
});


router.post('/login', passport.authenticate('local', {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res, next) {
});


router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } 
  res.redirect('/login');
}



module.exports = router;
