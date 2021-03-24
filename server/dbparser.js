'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fs = require('fs');
const path = require('path');
const { json } = require("body-parser");
const { Double } = require("mongodb");

const dir = '../APIFY-Crawler-Server/file2/';
const jobsDataFileLoc="../jobs-data.csv";
const skillCollectionFileLoc="../tech_skills.csv";

const Json2csvParser = require("json2csv").Parser;
var fileObjs=init();
var allStr=["id,description"];//contains all jobs describtion in string format
var countID=0;

function init() {
  var returnObj= fs.readdirSync(dir)
           .filter(name => path.extname(name) === '.json')
           .map(name => require(path.join(dir, name)));
  
  return returnObj;
}
//Write arrays of data to a file at path
function writeArrToFile( path, data)
{
  fs.writeFile(path, data.join("\r\n"), (err) => {
    console.log(err || "Wrote to "+path);  });

}
/*
//Write jobs data to csv
fileObjs.forEach(file => { 
    var str=JSON.stringify(file).replace(/\"/g, '');
    str=JSON.stringify(file).replace(/"{}"/g, ',');
    countID++;
    allStr.push(countID+",\""+str+'\"');
});
writeArrToFile("../jobs-data.csv",allStr);
*/
//Create jobs collection
var MongoClient = require('mongodb').MongoClient;
const { AsyncLocalStorage } = require("async_hooks");
const { forEach } = require("jszip");
const { nextTick } = require("process");
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) 
{
  if (err) throw err;
  var dbo = db.db("cmpe295");
  dbo.listCollections({name: "jobs"})
    .next(function(err, collinfo) {
        if (collinfo) {
          console.log("jobs collection already in db");
        }
        else{
          dbo.createCollection("jobs", function(err, res) {
            if (err) 
                console.log(err);
            else
                console.log("Collection created!");
            
          });
        }
    });

  dbo.collection("jobs").deleteMany({});//for now delete first before update new jobs
  //Insert scraped data to jobs collection 
  dbo.collection("jobs").insertMany(fileObjs, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
  
  /*
  var resumeData=["id,description"];
  //Write to resumes-data.csv
  dbo.collection("parsers").distinct("contents")
    .then(resume => {
      resumeData.push(1+",\""+resume+"\"");//Todo: change 1 to id when there are more than 1 resume
      writeArrToFile("../resumes-data.csv",resumeData);
      db.close();
    });
   */ 
  });
  

  //Write jobs to CSV
  dbo.collection("jobs").find({}).toArray((err, data) => 
  {
    if (err) throw err;
    const json2csvParser = new Json2csvParser({ header: true });
    const jobsData = json2csvParser.parse(data);
    const csvData=jobsData;
    fs.writeFile(jobsDataFileLoc, csvData, function(error) {
      if (error) throw error;
      console.log("Write to jobs-data.csv successfully!");
    })
    db.close();
  });
});
