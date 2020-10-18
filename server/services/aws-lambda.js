const AWS = require('aws-sdk');

AWS.config.apiVersions = {
    lambda: '',
    // other service API versions
  };
  
var lambda = new AWS.Lambda();
module.exports = lambda;