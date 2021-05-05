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
for(let i = 0; i < 20; i++) {
    records.push({
        userID: Math.floor(Math.random() * 18),
        itemID: Math.floor(Math.random() * 10),
        rating: Math.floor(Math.random() * 3) + 3,
        timestamp: Date.now()
    });
}
 
csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('...Done');
    });