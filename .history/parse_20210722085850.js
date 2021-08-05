const papa = require('papaparse');

var data;
pap.parse("questions.csv", {complete: (results, file) => {
    console.log("Parsing complete:", results, file);}});
