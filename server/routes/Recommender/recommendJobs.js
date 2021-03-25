const express = require('express');
const router = express.Router();
const spawn =  require('child_process').spawn;

router.get('/recommend', async (req, res) => {

    const childPython = spawn('python3', ['./TF-IDF.py']);
    childPython.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        return res.send(data.toString());
    });

    childPython.stderr.on('data', (err) => {
        console.log('script errors: ' + err);
    });

    childPython.on('close', (data) => {
        console.log('ending script...');
    });

});

module.exports = router;