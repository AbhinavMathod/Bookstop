const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
//const s3 = require('../config/s3.config.js');
const env = require('../config/s3.env.js');
//const dotenv = require('dotenv');
//dotenv.config();

aws.config.update({
  secretAccessKey: 'KjI91f6hm2FEseEJUZaTTixRF09rj/2KrndnNAye',
  accessKeyId: 'AKIAJSQQA77SPUUMMJPA'
});

var storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '');
    }
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'webapp.abhinav.nagaraj',
    key: function(req, file, cb) {
      /*I'm using Date.now() to make sure my file has a unique name*/
      req.file = "1/"+file.originalname;
      console.log(req.file);

      cb(null, "1/"+file.originalname);
    }
  })
});


module.exports = upload;



// exports.doUpload = (req, res) => {
//     const params = {
//       Bucket: env.Bucket,
//       Key: req.file.originalname,
//       Body: req.file.buffer
//     }
    
//     s3.upload(params, (err, data) => {
//       if (err) {
//         res.status(500).send("Error -> " + err);
//       }
//       res.send("File uploaded successfully! -> keyname = " + req.file.originalname);
//     });
//   }