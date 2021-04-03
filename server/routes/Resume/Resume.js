const express	= require('express');
const router	= express.Router();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

router.post('/resume', async (req, res) => {
	var fs		= require('fs'); 
	var parse	= require('csv-parse');
	var keyword	= req.query.keyword;
	var id		= req.body.id;
	if(undefined == id)
		id		= 1;
	
	
	var parser	= parse({columns: true}, function (err, records) {
		var item = {};
		for(var index in records){
			if(records[index].id == id){
				item.id			= records[index].id;
				item.Skills		= records[index].Skills;
				item.description= records[index].description;
			}
		}
		
		res.setHeader("Content-Type", "application/json");
		res.status(200).send(JSON.stringify({
			detail	: item,
			result	: 1
		}));
	});
	fs.createReadStream('./resumes-data.csv').pipe(parser);
});


router.post('/resume_update', async (req, res) => {
	var fs			= require("fs");
//	var csv			= require("csv");
	var parse		= require('csv-parse');
	
	var id			= req.body.id;
	var Skills		= req.body.Skills;
	var description = req.body.description;
	
	var parser	= parse({columns: true}, function (err, records) {
		for(var index in records){
			if(records[index].id == id){
				records[index].description	= description;
				records[index].Skills		= Skills;
			}
		}
		const csvWriter = createCsvWriter({
			path: './resumes-data.csv',
			header: [
				{id: 'id', title: 'id'},
				{id: 'description', title: 'description'},
				{id: 'Skills', title: 'Skills'}
			]
		});
		csvWriter.writeRecords(records).then(() => function(){
			
		});
		res.setHeader("Content-Type", "application/json");
		res.status(200).send(JSON.stringify({
			result : 1,
			records: records
		}));
	});
	fs.createReadStream('./resumes-data.csv').pipe(parser);
});

module.exports = router;