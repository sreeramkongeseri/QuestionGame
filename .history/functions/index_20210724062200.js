const functions = require("firebase-functions");


const express = require("express");
const cors = require("cors");

const app = express();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
const port = 3000;



app.use('/', express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

const csv = require('csvtojson');
var quesData;
var verbData;

csv().fromFile('questions.csv').then(jsonObj => {
    quesData = jsonObj.slice(0,87);
});

csv().fromFile('verbs.csv').then(jsonObj => {

    verbDataRaw = jsonObj.slice(0,87);
    verbData = [];

    for(i = 0; i < verbDataRaw.length; i++) {

        words = Object.values(verbDataRaw[i]);
    
        for (j=1; j < 7; j++) {
            let dict = {};
            let word = words[j-1];

            if (word !== '') {
                dict[word] = '' + j;
                verbData.push(dict);
            }
        }
    }
});


app.get('/api/level1', (req, res) => {

    res.send(quesData.slice(0,3));
});

app.get('/api/level2', (req, res) => {
    res.send(verbData.slice(0, 20));
});

app.get('/api/level3', (req, res) => {
    res.send(quesData);
});

app.get('/api/level4', (req, res) => {
    res.send(quesData);
});


exports.app = functions.https.onRequest(app);
