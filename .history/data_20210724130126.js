const csv = require("csvtojson");
var quesData = new Promise( (resolve, reject) => {
    csv().fromFile("questions.csv").then((jsonObj) => {
        resolve(jsonObj.slice(0, 87));
    });
});

var verbData = new Promise( (resolve, reject) => {
    csv().fromFile("verbs.csv").then((jsonObj) => {
    
        const verbDataRaw = jsonObj.slice(0, 87);
        for (let i = 0; i < verbDataRaw.length; i++) {
            const words = Object.values(verbDataRaw[i]);
    
            for (let j=1; j < 7; j++) {
                let dict = {};
                let word = words[j-1];
                if (word !== "") {
                    dict[word] = "" + j;
                    verbData.push(dict);
                }
            }
        }
    });
});








module.exports = {
    quesData: quesData, 
    verbData: verbData
}