var express = require('express');
var router = express.Router();

//lol
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Main Menu', name:"Leonardo Meza Martinez" });
}); 

router.get('/login', function (req, res) {
  res.render('login', { title: 'Login'});
});

router.get('/postVideo', function (req, res) {
  res.render('postVideo', { title: 'Post Video'});
});

router.get('/profile', function (req, res) { 
  res.render('profile', { title: 'Profile'}) ;
});

router.get('/signUp', function (req, res) { 
  res.render('signUp', { title: 'Sign Up'});
});

router.get('/viewPost', function (req, res) {
  res.render('viewPost', { title: 'View Post'});
 });
 

module.exports = router;
