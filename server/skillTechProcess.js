const fs = require('fs');
const { forEach } = require('jszip');
const { stringify } = require('querystring');
const Json2csvParser = require("json2csv").Parser;
const jobsDataFileLoc="jobs-data1.csv";
const jobsSkillDataFileLoc="jobs-skills-data1.csv";
const resumeFileLoc="resumeData.csv";
const resumeSkillFileLoc="resume-skill.csv";
const skillCollectionFileLoc="tech_skills.csv";


var jobData = fs.readFileSync(jobsDataFileLoc)
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()); // remove white spaces for each line

var skillDictionary=fs.readFileSync(skillCollectionFileLoc)
.toString() // convert Buffer to string
.split('\n') // split string to lines
.map(e => e.trim()); // remove white spaces for each line


function addSkillsAndRewrite(dataArr,fileLoc)
{ 
    //Add skill data for jobsData
    dataArr[0]+=",Skills";
    for (var jobIndex=1;jobIndex<dataArr.length;jobIndex++)
    {
        var eachJob=dataArr[jobIndex].toLowerCase();
        var skillStr="";
        skillDictionary.forEach( skill =>{
            if (eachJob.includes(skill.toLowerCase()))
            {
                skillStr+=skill.toLowerCase()+" ";
            }
        });
        skillStr=skillStr.trim();
        if (skillStr!=""){
            if (eachJob[eachJob.length-1]!=',')
                eachJob+=",";
            eachJob+=skillStr;
        }
        dataArr[jobIndex]=eachJob;
    };

    //write back to job-skill-data.csv
    const os = require('os');
    fs.writeFileSync(fileLoc, dataArr.join(os.EOL));
}
addSkillsAndRewrite(jobData,jobsSkillDataFileLoc);
/*
var resumeData = fs.readFileSync(resumeFileLoc)
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()); // remove white spaces for each line
addSkillsAndRewrite(resumeData,resumeSkillFileLoc);*/
