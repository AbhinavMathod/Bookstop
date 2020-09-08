const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
//require('../config/passport');
const User = require('../models').User;
const Book = require('../models').BookModel2;
const Order = require('../models').Order;
const Cart = require('../models').cartfinal;
const BookImage = require('../models').BookImage;
require('../config/passport')(passport);
const upload = require('./../services/file-upload');
const download = require('./../services/file-download');
//const awsWorker = require('./../services/file-upload');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const StatsD = require("node-statsd"),
client = new StatsD();
const logger = require('./winston');




router.post('/signup', function(req, res) {
    console.log(req.body);
    client.increment('signup_counter');
    logger.info("user sign-up");
    logger.info(req.body);
    if (!req.body.username || !req.body.password) {
      res.status(400).send({msg: 'Please pass username and password.'})
    } else {
      User
        .create({
          username: req.body.username,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname
        })
        .then((user) => res.status(201).send(user))
        .catch((error) => {
          console.log(error);
          logger.info(error);
          res.status(400).send(error);
        });
    }
  });

  router.post('/signin', function(req, res) {
    client.increment('signin_counter');
    logger.info("user sign-in");
    User
        .findOne({
          where: {
            username: req.body.username
          }
        })
        .then((user) => {
          if (!user) {
            return res.status(401).send({
              message: 'Authentication failed. User not found.',
            });
          }
          user.comparePassword(req.body.password, (err, isMatch) => {
            if(isMatch && !err) {
              var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'nodeauthsecret', {expiresIn: 86400 * 30});
              jwt.verify(token, 'nodeauthsecret', function(err, data){
                console.log(err, data);
              })
               res.json({success: true, token: 'JWT ' + token});
              
              
            } else {
              res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
          })
        })
        .catch((error) => res.status(400).send(error));
  });


  router.get('/profile', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'nodeauthsecret', function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
        res.status(200).send(decoded);
    });
  
});

router.put('/profile', function (req, res) {
  var token = req.body.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, 'nodeauthsecret', function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

      
  });

  let start4 = Date.now();
  User
      .findOne({
          where: {
              username: req.body.user.username
          }
      })
      .then((user) => {
          if (!user) {
              return res.status(401).send({
                  message: 'Authentication failed. User not found.',
              });
          }

          if (req.body.user.password) {
              user.update({
                  username: req.body.user.username,
                  password: req.body.user.password,
                  firstname: req.body.user.firstname?req.body.user.firstname:user.firstname,
                  lastname: req.body.user.lastname?req.body.user.lastname:user.lastname,
              }).then((user) => res.status(201).send(user))
              .catch((error) => {
                console.log(error);
                logger.info(error);
                res.status(400).send(error);
              });
          }
          else{
              user.update({
                  firstname: req.body.firstname?req.body.firstname:user.firstname,
                  lastname: req.body.lastname?req.body.lastname:user.lastname,
              }).then((user) => res.status(201).send(user))
              .catch((error) => {
                console.log(error);
                logger.info(error);
                res.status(400).send(error);
              });
          }
      })
      let end4 = Date.now();
      client.timing("update_profile_timer",end-start);

});

router.post('/create',passport.authenticate('jwt', { session: false}),function(req, res) {
  if (!req.body.isbn || !req.body.title || !req.body.authors || !req.body.publication_date || !req.body.quantity || !req.body.price) {
    res.status(400).send({msg: 'Please pass all parameters'})
  } else {
      upload.array('image', 1);
        //console.log(encode(img.Body));
        var start = Date.now();
        Book
        .create({
        isbn: req.body.isbn,
        title: req.body.title,
        authors: req.body.authors,
        publication_date: req.body.publication_date,
        quantity: req.body.quantity,
        price: req.body.price,
        seller_name: req.body.seller_name
      })
      .then((book) =>
      res.status(201).send(book))
      var end = Date.now();
      client.timing('Book_Timer',end-start);
      logger.info('Book added successfully');
  }
    
});


router.get('/books', passport.authenticate('jwt', { session: false}), 
  function(req, res) {
    console.log(process.env.AWS_ACCESS_KEY);
    var token = getToken(req.headers);
    //console.log(token);
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

  router.get('/mybooks', passport.authenticate('jwt', { session: false}), 
  function(req, res) {
    client.increment('books_viewed_counter');
    var token = getToken(req.headers);
    
    if (token) {
      console.log(req.user.dataValues.username);
      logger.info(req.user.dataValues.username);
      Book
        .findAll({where : {
          seller_name: req.user.dataValues.username
        }})
        .then((books) => res.status(200).send(books))
        .catch((error) => { res.status(400).send(error); });
    } 
    else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  router.put('/books/:id',passport.authenticate('jwt', { session: false}),
  function(req, res){
    var token = getToken(req.headers);
    if (token){
      var start2 = Date.now();
      Book
        .findByPk(req.params.id)
        .then((book) => {
          if (!book) {
            return res.status(401).send({
                message: 'Book not found.',
            });
          }
          book.update({
            isbn: req.body.isbn,
            title: req.body.title,
            authors: req.body.authors,
            publication_date: req.body.publication_date,
            quantity: req.body.quantity,
            price: req.body.price,
            seller_name: req.body.seller_name

          })}).then(() => {
          console.log("here")
          Cart
          .findOne({where : {
            isbn: Number(req.body.isbn)
          }})
          .then((order) => {
            if (!order) {
              return res.status(401).send({
                  message: 'Order not found.',
              });
            }
            console.log("here");
            console.log(order);
            logger.info(order);
            order.update({
              isbn: req.body.isbn,
              title: req.body.title,
              quantity: req.body.quantity,
              price: req.body.price
  
            })
          .catch((error) => {
            console.log(error);
            logger.info(error);
            res.status(400).send(error);
          });

        })
      });
      var end2 = Date.now();
      client.timing('update_book_timer',end2-start2);
  }

      else{
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
  });

  router.delete('/books/:id',passport.authenticate('jwt', { session: false}),
  function(req, res){
    var token = getToken(req.headers);
    console.log(req.body);
    logger.info(req.body);
    if (token){
      Book
        .findByPk(req.params.id)
        .then((book) => {
          if (!book) {
            return res.status(401).send({
                message: 'Book not found.',
            });
          }
          book.destroy();
          BookImage
    .findAll(
      {
        where : {
                  'bookID' : req.params.id
                }
      }
    ).map((image) => {
      image.destroy();
      const s3Client = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region : process.env.REGION,
        signatureVersion:"v4"
    });
    const S3_BUCKET = process.env.BUCKET;
    var params = {
      Bucket: process.env.BUCKET,
      Key: image.key
  };
    s3Client.deleteObject(params,function (err, data) {
      if (data) {
          console.log("File deleted successfully");
          logger.info("File deleted successfully")
      }
      else {
          console.log("Check if you have sufficient permissions : "+err);
          logger.info("Check if you have sufficient permissions : "+err);
      }
    })
  })

          }).then(() => {
          console.log("here")
          Cart
          .findAll({where : {
            isbn: Number(req.body.book.isbn)
          }})
          .map((order) => {
            if (!order) {
              return res.status(401).send({
                  message: 'Order not found.',
              });
            }
            console.log("here");
            console.log(order);
            order.destroy()
          .catch((error) => {
            console.log(error);
            logger.info(error);
            res.status(400).send(error);
          });

        })
      });
    
  }

      else{
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
      }
  });

  router.post('/orders',passport.authenticate('jwt', { session: false}),
  function(req,res){
    let start5 = Date.now();
    var token = getToken(req.headers);
    //console.log(req.headers);
    if (token){
      Cart
      .create({
        isbn : Number(req.body.isbn),
        title: req.body.title,
        quantity: req.body.quantity,
        price: req.body.price,
        username: req.body.username
        
      })
      .then((order) => res.status(201).send(order))
      .catch((error) => {
        console.log(error);
        logger.info(error);
        res.status(400).send(error);
      })
    }
    else{
      logger.info('unauthorized');
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
    let end5 = Date.now();
    client.timing('order_placement_timer',end5-start5);
  });

  router.get('/orders',passport.authenticate('jwt', { session: false}),
  function(req,res)
  {
    console.log(req)
    var token = getToken(req.headers); 
    if(token)
    {
      Cart
      .findAll()
      .then((orders) => res.status(200).send(orders))
      .catch((error) => { res.status(400).send(error); 
      });
    }
  }
  )


  router.post('/upload', 
  (req,res)=>{
    var start3 = Date.now();
    console.log(process.env.AWS_ACCESS_KEY);
    console.log(process.env.BUCKET);
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion:"v4",
      region: process.env.REGION
      });
      console.log(process.env.BUCKET);
      const S3_BUCKET = process.env.BUCKET
      const s3 = new aws.S3();  // Create a new instance of S3
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
// Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: process.env.BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read'
  };
// Make a request to the S3 API to get a signed URL which we can use to upload our file
s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      res.json({success: false, error: err})
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
    const returnData = {
      signedRequest: data,
      url: `https://${process.env.BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.json({success:true, data:{returnData}});
  });
  var end3 = Date.now();
  client.timing('S3_timer',end3-start3);
  })

  router.post('/download',(req,res)=>{
    var attachment=[];
    var imageNames=[];
    var count=0;
    let start8 = Date.now();
    console.log(req.body.bookId)
    BookImage.findAll(
      {
        
        where : {'bookID' : req.body.bookId}
      }
    )
    .then((result)=>{
      console.log(result);
      logger.info(result);
      result.map((e)=>{
     
      console.log("downloading"+ e.key )
      imageNames.push(e.key )
      let s3_filename=   e.key 
      const s3Client = new aws.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region : process.env.REGION,
          signatureVersion:"v4"
      });
      const S3_BUCKET = process.env.BUCKET;
      const downloadParams = {
              Bucket: process.env.BUCKET, 
              Key: s3_filename
      };
       const params = downloadParams;
      params.Key = s3_filename;
      s3Client.getObject(params, function(error, data) {
        count++;
       
        console.log(data.Body.toString('base64'));
        logger.info(data.Body.toString('base64'));
        let buf = Buffer.from(data.Body);
        let aa= buf.toString('base64');
        attachment.push(aa);
       if(count == result.length){
         console.log(count);
         logger.info(count);
        res.status(200);
        res.json({
         "att": attachment,
          "img":imageNames
        })
        return;
       }
    })
  
      })
    })


      function encode(data){
        let buf = Buffer.from(data);
        let base64 = buf.toString('base64');
        return base64
        }
      function getImagesbyBookId(id){
        BookImage.findAll(
          {
            
            where : {'bookID' : id}
          }
        )

      }
    let end8 = Date.now();
    client.timing('download_S3_timer',end8-start8);
  })


  router.post('/storeimage',(req,res)=>{
    client.increment('image_counter');
    BookImage
    .create({
      bookID: req.body.bookID,
      seller_name: req.body.seller_name,
      key: req.body.key
    }).then((image) =>
    res.status(201).send(image))
  })

  router.delete('/deleteimage',(req,res) => {
    client.increment('delete_books_counter');
    let hi = Date.now();
    BookImage
    .findOne(
      {
        where : {
                  'key' : req.body.key
                }
      }
    ).then((image) => {
      image.destroy();
      const s3Client = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region : process.env.REGION,
        signatureVersion:"v4"
    });
    const S3_BUCKET = process.env.BUCKET;
    var params = {
      Bucket: process.env.BUCKET,
      Key: image.key
  };
    s3Client.deleteObject(params,function (err, data) {
      if (data) {
          console.log("File deleted successfully");
          logger.info("File deleted successfully");
      }
      else {
          console.log("Check if you have sufficient permissions : "+err);
      }
    })
  })
  let bye = Date.now();
  client.timing('Delete_Image_Timer',bye-hi);
  })

  router.get('/myimages', passport.authenticate('jwt', { session: false}), 
  function(req, res) {
    var token = getToken(req.headers);
    //console.log(token);
    if (token) {
      BookImage
        .findAll()
        .then((images) => res.status(200).send(images))
        .catch((error) => { res.status(400).send(error); });
    } 
    else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  router.delete('/logout', 
  function(req,res){
    
    res.status(200).send('logged out successfully');
       
  });

  router.post('/subscribe',function(req,res){
    const sns = new aws.SNS({
      accessKeyId : process.env.AWS_ACCESS_KEY,
      secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
      region : process.env.REGION
    })
    let payload = {
      "message": req.body.username,
      "email": req.body.username
    }
    let params = {
        Message: JSON.stringify(payload),
        TopicArn: process.env.TOPIC_ARN
    };
    sns.publish(params, function(err, data) {
      if (err) 
      {
        console.log(err, err.stack);
        res.send(err);
      
      }
      else 
      {
        console.log(data);
        res.send(data);
      }
  });
  })

   
     

  


  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  module.exports = router;