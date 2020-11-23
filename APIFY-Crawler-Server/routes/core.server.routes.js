/**
* @module routes
* @description
* Define all core routes of applications
*/
"user strict";
const coreCtrl = require('../controllers').Core;
module.exports = function(app) {
	app.route('/').get(coreCtrl.homePage);
	app.route('/run').get(coreCtrl.runTask);
	app.route('/data').get(coreCtrl.getData);
	app.route('/run_write').get(coreCtrl.runAndWrite);
	app.route('/read').get(coreCtrl.readData);
	app.route('/get_detail').get(coreCtrl.getDetail);
};