const express = require('express')
const app = express()
const port = 3000


app.use('/', express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})


questions1 = ['question 1.1', 'question 1.2', 'question 1.3', 'question 1.4'];
questions2 = ['question 2.1', 'question 2.2', 'question 2.3', 'question 2.4'];
questions3 = ['question 3.1', 'question 3.2', 'question 3.3', 'question 3.4'];
questions4 = ['question 4.1', 'question 4.2', 'question 4.3', 'question 4.4'];

app.get('/api/level1', (req, res) => {
    res.send(questions1);
});

app.get('/api/level2', (req, res) => {
    res.send(questions2);
});

app.get('/api/level3', (req, res) => {
    res.send(questions3);
});

app.get('/api/level4', (req, res) => {
    res.send(questions4);
});

const csv = require('csvtojson');
var quesData;

csv().fromFile('questions.csv').then(jsonObj => {
    quesData = jsonObj;
    console.log(quesData[10]);
});

// quesData = quesData[10];
// quesData = quesData.map(x => x["Question"]);
// console.log(quesData);



