const aws = require('aws-sdk');
//const s3 = require('../config/s3.config.js');
const env = require('../config/s3.env.js');
const s3 = new aws.S3();


exports.download = (async function(){
    try {
        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId: "AKIAJSQQA77SPUUMMJPA",
            secretAccessKey: "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"
        });
        const response = await s3.listObjectsV2({
            Bucket:'webapp.abhinav.nagaraj'
        }).promise();
        
        console.log(response);

        } catch(e){
        console.log('our error',e);
    }

    debugger;
})();

// module.exports = download;




