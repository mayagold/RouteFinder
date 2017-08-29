/////////////////////////////////////////////////////
//     MODELS, DEPENDENCIES
/////////////////////////////////////////////////////
const express = require('express');
const router  = express.Router();
const User    = require('../models/users.js');
const bcrypt  = require('bcrypt');

/////////////////////////////////////////////////////
//     INDEX: GET USER DATA
/////////////////////////////////////////////////////
router.get('/', (req,res)=>{
  User.find( {}, (err,foundUsers)=>{
    res.json(foundUsers)
    console.log(foundUsers);
  })
})

/////////////////////////////////////////////////////
//     LOGIN EXISTING USER
/////////////////////////////////////////////////////
router.post('/login', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if(user){
      if(bcrypt.compareSync(req.body.password, user.password)) {
        req.session.message = 'Logged in';
        req.session.username = req.body.username;
        req.session.logged = true;
        res.json(req.session.logged);
      } else {
        // do something
      }
    } else {
        req.session.message = 'username or password are incorrect';
        res.json(req.session.message);
      }
    })
})

/////////////////////////////////////////////////////
//     REGISTER NEW USER
/////////////////////////////////////////////////////
router.post('/registration', (req, res) => {
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const userDbEntry = {};
  userDbEntry.username = req.body.username;
  userDbEntry.password = passwordHash;
  User.create(userDbEntry, (err, user) => {
    req.session.message  = 'Logged in';
    req.session.username = user.username;
    req.session.logged   = true;
    res.json(user);
  });
});

/////////////////////////////////////////////////////
//     LOGOUT
/////////////////////////////////////////////////////
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err){
      //do something
    } else {
      req.session = false;
      console.log("logged out");
      res.redirect('/')
    }
  })
})

/////////////////////////////////////////////////////
//     EXPORT
/////////////////////////////////////////////////////
module.exports = router;
