"user strict";
// Module public methods.
module.exports = {
	homePage	: homePage,
	getData		: getData,
	runTask		: runTask,
	runAndWrite	: runAndWrite,
	readData	: readData,
	getDetail	: getDetail
};

var dbUrl = 'mongodb://localhost:27017';
var	dbName= 'apify';
var token = 'fEwWLQffCRkM47etNGmNfiGQq';

/**
* @name renderHomePage
* @description
* Render homepage.
*
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/
function homePage(req, res) {
	res.send('This is homepage content');
}

/**
* @name renderContact
* @description
* Render contact page.
*
* @param  {object} req HTTP request
* @param  {object} res HTTP response
*/

function getData(request, response){
	var mongoClient = require('mongodb').MongoClient;
	mongoClient.connect(dbUrl, function(err, db){
		if(err)
			res.send('Can not connect');
		var dbo			= db.db(dbName),
			collection	= dbo.collection("apify_data"),
			page		= parseInt(request.query.page),
			ipp			= 10,
			start		= 0;
		if(page <= 0)
			page = 1;
		start = (page - 1) * ipp;
		collection.find({}).sort({_id: 1}).skip(start).limit(ipp).toArray(function(err, data){
			if(err)
				response.send('get data failed');
			response.setHeader("Content-Type", "application/json");
			response.send(data);
		});
		db.close();
	});
}

function runTask(request, response){
	var task	= request.query.task;
	var urlItems= 'https://api.apify.com/v2/actor-tasks/' + task + '/runs/last/dataset/items?token=' + token;
	var url		= 'https://api.apify.com/v2/actor-tasks/' + task + '/runs?token=' + token;
	var axios	= require('axios');
	axios({
		method	: 'get',
		url		: url,
		headers	: {
			'Content-Type': 'application/json'
		}
	}).then(res => {
		if(res.status == 200){
			axios({
				method	: 'get',
				url		: urlItems,
				headers	: {
					'Content-Type': 'application/json'
				}
			}).then(res => {
				if(res.status == 200){
					var mongoClient = require('mongodb').MongoClient;
					mongoClient.connect(dbUrl, function(err, db){
						if(err)
							res.send('Can not connect Mongo');
						var dbo			= db.db(dbName),
							collection	= dbo.collection("apify_data");
						
					});
					for(var index in res.data){
						var items = res.data[index].items;
						if(items.length){
							for(var i in items){
								var item = items[i];
								collection.insertOne(item, function(err, result){
									if(err)
										res.send('Insert Fail');
								});
							}
						}
					}
				}
			})
			.catch(error => {
				console.log(error);
			});
		}
	})
	.catch(error => {
		console.log(error);
	});
	response.send('');
}



function runAndWrite(request, response){
	var axios	= require('axios');
	var fs		= require("fs");
	var md5		= require('md5');
	
	var task	= request.query.task;
	var urlItems= 'https://api.apify.com/v2/actor-tasks/' + task + '/runs/last/dataset/items?token=' + token;
	var url		= 'https://api.apify.com/v2/actor-tasks/' + task + '/runs?token=' + token;
	var dir		= './files_tmp/';
	

	axios({
		method	: 'get',
		url		: url,
		headers	: {
			'Content-Type': 'application/json'
		}
	}).then(res => {
		if(res.status == 200){
			// run task success
			axios({
				method	: 'get',
				url		: urlItems,
				headers	: {
					'Content-Type': 'application/json'
				}
			}).then(res => {
				if(res.status == 200){
					for(var index in res.data){
						var items = res.data[index].items;
						if(items.length)
							for(var i in items){
								var data = {
									title		: items[i].title.replace(/(\r\n|\n|\r)/gm, ""),
									location	: items[i].location,
									salary		: items[i].salary,
									description	: items[i].description,
									term		: items[i].term,
									jk			: items[i].jk,
									detail		: items[i].detail,
									source		: items[i].source
								};
								console.log(data);
								var fileName = data.jk;
								if('' == fileName)
										fileName = items[i].detail;
								fs.writeFile(dir + md5(fileName) + '.json', JSON.stringify(data), function(err) {});
                                
								
							}	
					}					
				}
			}).catch(error => {
				console.log(error);
			});
			
		}
	}).catch(error => {
		console.log(error);
	});
	response.send('');
}

function getDetail(request, response){
	var axios	= require('axios');
	var fs		= require("fs");
	var auto	= request.query.auto;
	var dir		= './files_tmp/';
	var dir2	= './files/';
	var output	= '';
	
	var jsdom = require("jsdom");
	const { JSDOM } = jsdom;
	const { window }= new JSDOM();
	const { document } = (new JSDOM('')).window;
	global.document = document;
	var $ = jQuery	= require('jquery')(window);
	
	fs.readdir(dir, (err, files) => {
		if(files.length > 0){
			var fileName= files[0];
			var data	= JSON.parse(fs.readFileSync(dir + fileName).toString());
			var source	= data.source;
			
			axios({
				method	: 'get',
				url		: data.detail,
				headers	: {
					'Content-Type': 'application/json'
				}
			}).then(res => {
				
				if(res.status == 200){
					var el = $(res.data);
					if('indeed' == source){
						
						data.full_description = el.find('.jobsearch-jobDescriptionText').text();
						fs.writeFile(dir2 + fileName + '.json', JSON.stringify(data), function(err) {});
						fs.unlinkSync(dir + fileName);
						
					} else if('ziprecruiter' == source){
						data.full_description = el.find('.jobDescriptionSection').text();
						fs.writeFile(dir2 + fileName + '.json', JSON.stringify(data), function(err) {});
						fs.unlinkSync(dir + fileName);
					}
					
					if(1 == auto)
						response.send('<meta http-equiv="refresh" content="60">');
					else
						response.send('');
				}
			}).catch(error => {
				console.log(error);
			});
		} else
			response.send('Nothing Process');
	});
}

function readData(request, response){
	var fs		= require("fs");
	var dir		= './files/';
	
	fs.readdir(dir, (err, files) => {
		var output = [];
		files.forEach(file => { 
			var data = JSON.parse(fs.readFileSync(dir + file).toString());
			output.push(data);
		});
		response.setHeader("Content-Type", "application/json");
		response.send(JSON.stringify(output));
	});
}