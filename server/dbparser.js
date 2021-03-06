'use strict';
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fs = require('fs');
const path = require('path');
const { json } = require("body-parser");
const { Double } = require("mongodb");

const dir = '../APIFY-Crawler-Server/files/';

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

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("cmpe295");
  
  dbo.createCollection("jobs", function(err, res) {
    if (err) 
        console.log(err);
    else
        console.log("Collection created!");
    
  });
  //Insert scraped data to jobs collection 
  dbo.collection("jobs").insertMany(fileObjs, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
  });
  db.close();
});
