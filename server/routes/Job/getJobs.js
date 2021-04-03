const express	= require('express');
const router	= express.Router();

router.use(express.json()) // for parsing application/json
router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

router.post('/get_jobs', async (req, res) => {
	var fs		= require('fs'); 
	var parse	= require('csv-parse');
	var fileName= 'jobs-data.csv';
	var keyword	= req.body.keyword;
	var page	= req.body.page;
	var nextPage= ++page;
	var prevPage= --page;
	var ipp		= 40;
//	page	= 1;
	if(undefined == page)
		page	= 1;
	if(undefined == keyword)
		keyword	= '';
	
	var parser	= parse({columns: true}, function (err, records) {
		var allI= Object.keys(records).length;
		var data= [];
		if(keyword){
			for(i = 0; i < allI; i++){
				if( (records[i].title).indexOf(keyword) != -1 ){
					records[i].index = i;
					data.push(records[i]);
				}
			}
		} else
			data = records;
		if(data){
			var allI= Object.keys(data).length;
			var allP= Math.ceil(allI / ipp);
			if( page > allP)
				page	= allP;
			nextPage 	= page + 1;
			prevPage	= page - 1;
			if(nextPage > allP)
				nextPage= 0;
			
			var start	= (page - 1) * ipp;
			var end		= start + ipp;
			var output	= [];
			
			for(i = start; i < end; i++){
				
				if(undefined == data[i])
					break;
				var item = data[i];
					item.company	= (undefined == data[i].company_name	|| !data[i].company_name)	? 'Updating' : data[i].company_name;
					item.salary		= (undefined == data[i].salary			|| !data[i].salary)			? 'Updating' : data[i].salary;
					item.source		= (undefined == data[i].source			|| !data[i].source)			? 'Updating' : data[i].source;
					item.skills		= (undefined == data[i].Skills			|| !data[i].Skills)			? 'Updating' : data[i].Skills;
					item.position	= (undefined == data[i].position		|| !data[i].position)		? 'Updating' : data[i].position;
					item.location	= (undefined == data[i].location		|| !data[i].location)		? 'Updating' : data[i].location;
					item.index		= i;
				output.push(item);
			}
			
			res.setHeader("Content-Type", "application/json");
			res.status(200).send(JSON.stringify({
				next_page	: nextPage,
				prev_page	: prevPage,
				keyword		: keyword,
				items		: output
			}));
		} else {
			res.setHeader("Content-Type", "application/json");
			res.status(200).send(JSON.stringify({
				next_page	: 0,
				prev_page	: 0,
				keyword		: keyword,
				items		: []
			}));
		}
	});
	fs.createReadStream('./' + fileName).pipe(parser);
});


router.post('/get_detail', async (req, res) => {
	var fs		= require('fs'); 
	var parse	= require('csv-parse');
	var fileName= 'jobs-data.csv';
	var id		= req.body.id;
	var index	= req.body.index;
	
	
	var parser	= parse({columns: true}, function (err, records) {
		var allI= Object.keys(records).length;
		if(undefined != records[index]){
			var item			= records[index];
				item.company	= (undefined == records[index].company_name	|| !records[index].company_name)	? 'Updating' : records[index].company_name;
				item.salary		= (undefined == records[index].salary		|| !records[index].salary)			? 'Updating' : records[index].salary;
				item.source		= (undefined == records[index].source		|| !records[index].source)			? 'Updating' : records[index].source;
				item.skills		= (undefined == records[index].Skills		|| !records[index].Skills)			? 'Updating' : records[index].Skills;
				item.position	= (undefined == records[index].position		|| !records[index].position)		? 'Updating' : records[index].position;
				item.location	= (undefined == records[index].location		|| !records[index].location)		? 'Updating' : records[index].location;
				item.index		= index;
			res.setHeader("Content-Type", "application/json");
			res.status(200).send(JSON.stringify({
				result : 1,
				detail : item
			}));
		} else {
			res.setHeader("Content-Type", "application/json");
			res.status(200).send(JSON.stringify({
				result : 0,
				detail : []
			}));
		}
	});
	fs.createReadStream('./' + fileName).pipe(parser);
});

module.exports = router;