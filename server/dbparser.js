'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fs = require('fs');
const path = require('path');
const { json } = require("body-parser");
const { Double } = require("mongodb");

const dir = '../APIFY-Crawler-Server/files/';

const Json2csvParser = require("json2csv").Parser;

function init() {
  return fs.readdirSync(dir)
           .filter(name => path.extname(name) === '.json')
           .map(name => require(path.join(dir, name)));
}
var fileObjs=init();

fileObjs.forEach(file => { 
    console.log(file); 
});

//Create jobs collection
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) 
{
  if (err) throw err;
  var dbo = db.db("cmpe295");
  
  dbo.createCollection("jobs", function(err, res) {
    if (err) 
        console.log(err);
    else
        console.log("Collection created!");
    
  });
  dbo.collection("jobs").deleteMany({});//for now delete first before update new jobs
  //Insert scraped data to jobs collection 
  dbo.collection("jobs").insertMany(fileObjs, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
  });
  var resumeData="id,description\n";

  //Write resume to CSV
  dbo.collection("parsers").find({}).toArray((err, data) => 
  {
    if (err) throw err;

    console.log(data);
    const json2csvParser = new Json2csvParser({ header: false });
    resumeData += json2csvParser.parse(data);
  });

  //Write resume+jobs to CSV
  dbo.collection("jobs").find({}).toArray((err, data) => 
  {
    if (err) throw err;

    console.log(data);
    const json2csvParser = new Json2csvParser({ header: false });
    const jobsData = json2csvParser.parse(data);
    const csvData=resumeData+jobsData;
    fs.writeFile("../jobs-data.csv", csvData, function(error) {
      if (error) throw error;
      console.log("Write to jobs-data.csv successfully!");
    })
    db.close();
  });
  
});
