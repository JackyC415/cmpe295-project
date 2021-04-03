const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'ratings.csv',
    header: [
        {id: 'userID', title: 'userID'},
        {id: 'itemID', title: 'itemID'},
        {id: 'rating', title: 'rating'},
        {id: 'timestamp', title: 'timestamp'}
    ]
});

let records = [];
for(let i = 0; i < 500000; i++) {
    records.push({
        userID: Math.floor(Math.random() * 1000),
        itemID: Math.floor(Math.random() * 1000),
        rating: Math.floor(Math.random() * 1) + 5,
        timestamp: Date.now()
    });
}
 
csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });