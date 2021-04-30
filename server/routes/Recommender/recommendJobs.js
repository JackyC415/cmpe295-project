const express = require('express');
const router = express.Router();
const spawn =  require('child_process').spawn;

router.get('/recommend', async (req, res) => {

    const childPython = spawn('python3', ['./TF-IDF.py']);
    childPython.stdout.on('data', (data) => {
        console.log(JSON.parse(data.toString()));
        return res.status(200).send(JSON.parse(data.toString()));
    });

    childPython.stderr.on('data', (err) => {
        console.log('script errors: ' + err);
    });

    childPython.on('close', (data) => {
        console.log('ending script...');
    });

});

module.exports = router;