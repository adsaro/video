var express = require('express');
var router = express.Router();
var request = require('request');
var User = require('../models/user').User;

//variables de depuracion
var address = 'http://127.0.0.1:8081';

/* GET home page. */
router.get('/:video', function(req, res, next){
  if(req.user){
    console.log(req.params.video);
    User.findById(req.user.id, function(err, user){
      if(err){
        res.end(JSON.stringify({status: 'error', error: 'Internal error'}));
      }else if(!user){
        res.end(JSON.stringify({status: 'error', error: 'Forbidden'}));
      }else{
        var cuerpo = {cliente: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                     agente: req.headers['user-agent'], 
                     video: req.params.video};
        console.log(cuerpo);
        request({uri: address, method: 'PUT', json: true, body: cuerpo}, function(err, response, body){
          console.log(body);
          res.end(JSON.stringify(body));
        });
      }
    });
  }else{
    res.redirect('/');
  }
});

module.exports = router;