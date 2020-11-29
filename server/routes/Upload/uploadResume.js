const express = require('express');
const router = express.Router();
var multer = require('multer');
var multerS3 = require('multer-s3');
var keyword_extractor = require("keyword-extractor");
const Parser = require("../../models/Parser/ParsedResume");

const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};

var upload = multer({ dest: 'uploads/' })

//Upload file to S3 - TBD; store locally for now.
// const upload = multer({
//     storage: multerS3({
//         s3: {},
//         bucket: 'cmpe295',
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             cb(null, file.originalname)
//         }
//     })
// });

async function parseResumeContent(contents) {

    let parsedWords = [];
    contents.forEach(function (word) {
        parsedWords.push(word.str)
    });
    return parsedWords;
}

async function extractKeyWords(parsedContent) {

    let finalParsedContent = parsedContent.join(' ');

    let extractedContent = keyword_extractor.extract(finalParsedContent, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
        return_chained_words: true
    });

    return extractedContent;
}

async function persistExtractedContent(resumeName, extractedContent) {
    const newParsedResume = new Parser({
        filename: resumeName,
        contents: extractedContent
    });
    await newParsedResume.save()
        .then(() => console.log('Persisted parsed resume!'))
        .catch(err => console.log(err));
}

router.post('/upload', upload.single('file'), (req, res) => {

    pdfExtract.extract(req.file.path, options, (err, data) => {
        if (err) return console.log(err);

        let contents = data.pages[0].content;
        parseResumeContent(contents).then((parsedData) => {
            extractKeyWords(parsedData).then((extractedData) => {
                persistExtractedContent(data.filename,extractedData).then(() => {
                    res.sendStatus(200);
                }).catch(err => res.sendStatus(400));
            }).catch(err => console.log(err));
        }).catch((err) => console.log(err));
    });
});

module.exports = router;