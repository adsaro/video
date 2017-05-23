var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

var User = require('../models/user').User;

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    (function findUser(){
      User.findById(req.user.id, function(err, user){
        if(err){
          findUser();
        }else if(!user){
          res.render('index', {title: "Hello!"});
        }else{
          res.render('index', {user: user, title: "Hello!"});
        }
      });
    })();
  }else{
    res.render('index', {title: "Hello!"});
  }
});

router.get('/video', function(req, res, next){
  if(req.user){
    (function findUser(){
      User.findById(req.user.id, function(err, user){
        if(err){
          findUser();
        }else if(!user){
          res.redirect('/');
        }else{
          res.render('video', {user: user, title: "Hello!"});
        }
      });
    })();
  }else{
    res.redirect('/');
  }
});

router.get('/register', function(req, res, next){
  res.render('register', {title: "Join us!"});
});

router.post('/register', function(req, res, next){
  var name = req.body.name;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var salt1 = bcrypt.genSaltSync();
  var hash1 = bcrypt.hashSync(req.body.password, salt1);
  var newUser = new User({
    name: name,
    lastName: lastName,
    email: email,
    password: {
      salt: salt1,
      hash: hash1
    }
  });
  newUser.save(function(err, data){
    if(err){
      console.log(err);
    }else{
      console.log(data);
      res.redirect("/");
    }
  });
});

router.get('/login', function(req, res){
  res.render('login');
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/register'}), function(req, res, next){
  res.redirect('/');
});

router.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
});

router.use('/videos', require('./videos'));

module.exports = router;
