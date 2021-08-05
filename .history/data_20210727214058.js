const csv = require("csvtojson");

const quesData = new Promise( (resolve, reject) => {
    csv().fromFile("questions.csv").then((jsonObj) => {
        resolve(jsonObj.slice(0, 87));
    });
});

const verbData = new Promise( (resolve, reject) => {

    csv().fromFile("verbs_phrases.csv").then((jsonObj) => {

        const verbDataRaw = jsonObj.slice(0, 87);
        const res = [];
        for (let i = 0; i < verbDataRaw.length; i++) {
            const words = Object.values(verbDataRaw[i]);
            for (let j=1; j < 7; j++) {
                let dict = {};
                let word = words[j-1];
                if (word !== "") {
                    dict[word] = "" + j;
                    res.push(dict);
                }
            }
        }

        resolve(res);
    });
});

// csv().fromFile("questions.csv").then((jsonObj) => {
//     jsonObj = jsonObj.slice(0, 87);
//     console.log(JSON.stringify(jsonObj));
// });

csv().fromFile("verbs.csv").then((jsonObj) => {

    const verbDataRaw = jsonObj.slice(0, 87);
    const res = [];
    for (let i = 0; i < verbDataRaw.length; i++) {
        const words = Object.values(verbDataRaw[i]);
        for (let j=1; j < 7; j++) {
            let dict = {};
            let word = words[j-1];
            if (word !== "") {
                dict[word] = "" + j;
                res.push(dict);
            }
        }
    }

    console.log(JSON.stringify(res));
});


module.exports = {
    quesData: quesData, 
    verbData: verbData
}

