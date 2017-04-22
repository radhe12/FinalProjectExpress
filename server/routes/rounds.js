let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the user model
let UserModel = require('../models/users');
let User = UserModel.User; // alias for User Model - User object
let player = require('../models/players')
let round = require('../models/rounds')

// define the game model
let tournament = require('../models/tournaments');

// create a function to check if the user is authenticated
function requireAuth(req, res, next) {
  // check if the user is logged in
  if(!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/* GET home page. wildcard */
router.get('/:id', (req, res, next) => {
let id = req.params.id;
    round.find( (err, rounds) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('content/rounds', {
        title: 'Rounds',
        rounds: rounds,
        pid:id,
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });

});
router.post('/:id', requireAuth, (req, res, next) => {
  let id = req.params.id;
  // get a reference to the id from the url
    let newround7 = round({
      "roundno": req.body.roundno,
      "matchno": req.body.matchno,
      "pname1": req.body.pname1,
      "pname2": req.body.pname2,
      "winner": '',
      "tid": req.params.id
    });

    round.create(newround7, (err, rounds) => {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        console.log("Winner added for the round")
        res.redirect('/content/rounds/:id');
      }
    });
});






/* GET contact page. */

module.exports = router;