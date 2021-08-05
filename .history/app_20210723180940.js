const express = require('express');
const app = express();
const port = 3000;;



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
    verbData = jsonObj.slice(0,87);
    newVerbs = [];

    for(i = 0; i < verbData.length; i++) {

        words = Object.values(verbData[i]);

        for (i=0; i < 6; i++) {
            word = words[i];
            dict = {word:''+i}
            newVerbs.push(dict);
        }
    }
    console.log(newVerbs);
});

// questions1 = ['question 1.1', 'question 1.2', 'question 1.3', 'question 1.4'];
// questions2 = ['question 2.1', 'question 2.2', 'question 2.3', 'question 2.4'];
// questions3 = ['question 3.1', 'question 3.2', 'question 3.3', 'question 3.4'];
// questions4 = ['question 4.1', 'question 4.2', 'question 4.3', 'question 4.4'];

app.get('/api/level1', (req, res) => {

    res.send(quesData.slice(0,3));
});

app.get('/api/level2', (req, res) => {
    res.send(quesData);
});

app.get('/api/level3', (req, res) => {
    res.send(quesData);
});

app.get('/api/level4', (req, res) => {
    res.send(quesData);
});



// quesData = quesData[10];
// quesData = quesData.map(x => x["Question"]);
// console.log(quesData);



