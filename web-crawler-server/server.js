const indeed = require('indeed-scraper');
const Jobs = require("./models/Job/Job");

const request = require("request");
const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/cmpe295";
const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true  
};
const queryOptions = {
    host: 'www.indeed.com',
    query: 'Software',
    city: 'Seattle, WA',
    radius: '25',
    level: 'entry_level',
    jobType: 'fulltime',
    maxAge: '7',
    sort: 'date',
    limit: 100
  };
  

// https.get("https://www.indeed.com/jobs?q=software%20engineer&l=California",function(res){
//     console.log(res);
// });

//request('https://www.indeed.com/jobs?q=software%20engineer&l=California', function (error, response, body) {
  //if (!error && response.statusCode == 200) {
  //  console.log(body);
  //}
//});
   indeed.query(queryOptions).then(res => {
      console.log(res); // An array of Job objects
    
      initDB();

//var jobs = new Job[];
res.forEach(j => {
    var job = new Jobs ({
        title: j.title,
        company : j.company,
        city : j.city,
        zipcode : j.zip,
        description : j.sumary,
        responsibilities : j.responsibilities, 
        url: j.url       
    });

     job.save(function(err){
        if(err != undefined)
       {
           console.log(err);
       }            
    });
jobs.push(job);
 });
 console.log(jobs)
   });

  function initDB () {
    
    try{
        mongoose.connect(mongoURI,options);
        console.log('Connected to MongoDB!');
        
    }catch(error){
        console.log('Unable to connect to MongoDB!');
        console.log(error);
        process.exit(1);
    }
}