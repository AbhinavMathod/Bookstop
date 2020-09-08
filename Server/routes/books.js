const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

//const Book = require('../models/bookmodel');



router.post('/create', function(req, res) {
    console.log(req.body);
    if (!req.body.isbn || !req.body.title || !req.body.authors || !req.body.publication_date || !req.body.quantity || !req.body.price) {
      res.status(400).send({msg: 'Please pass all parameters'})
    } else {
        Book
        .create({
          isbn: req.body.isbn,
          title: req.body.title,
          authors: req.body.authors,
          publication_date: req.body.publication_date,
          quantity: req.body.quantity,
          price: req.body.price
        })
        .then((book) => res.status(201).send(book))
        .catch((error) => {
          console.log(error);
          res.status(400).send(error);
        });
    }
  });

  router.get('/books', passport.authenticate('jwt', { session: false}), 
  function(req, res) {
    var token = getToken(req.headers);
    console.log(token);
    if (token) {
        Book
        .findAll()
        .then((books) => res.status(200).send(books))
        .catch((error) => { res.status(400).send(error); });
    } 
    else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });
    
  module.exports = router;



