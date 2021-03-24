const fs = require('fs');
const { forEach } = require('jszip');
const { stringify } = require('querystring');
const Json2csvParser = require("json2csv").Parser;
const jobsDataFileLoc="/jobs-data.csv";
const jobsSkillDataFileLoc="/jobs-skills-data.csv";
const skillCollectionFileLoc="/tech_skills.csv";


var jobData = fs.readFileSync(jobsDataFileLoc)
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()); // remove white spaces for each line

var skillDictionary=fs.readFileSync(skillCollectionFileLoc)
.toString() // convert Buffer to string
.split('\n') // split string to lines
.map(e => e.trim()); // remove white spaces for each line

//var skillMatchArr=["Skills"];
//jobData.forEach(eachJob => {
jobData[0]+=",Skills";
for (var jobIndex=1;jobIndex<jobData.length;jobIndex++)
{
    var eachJob=jobData[jobIndex];
    var skillStr="";
    skillDictionary.forEach( skill =>{
        if (eachJob.includes(skill))
        {
            skillStr+=skill+" ";
        }
    });
    eachJob+=", "+skillStr;
    jobData[jobIndex]=eachJob;
};


const os = require('os');
fs.writeFileSync(jobsSkillDataFileLoc, jobData.join(os.EOL));