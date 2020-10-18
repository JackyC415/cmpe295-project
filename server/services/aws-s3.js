const AWS = require('aws-sdk');

AWS.config.update({
    bucketName: 'cmpe295-bucket',
    accessKeyId: '',
    secretAccessKey: '',
    region:'us-west-1'
});

var s3 = new AWS.S3();

module.exports = s3;