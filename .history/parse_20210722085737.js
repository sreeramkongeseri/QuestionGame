

var data;
Papa.parse("questions.csv", {complete: (results, file) => {
    console.log("Parsing complete:", results, file);}});
