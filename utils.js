const fs = require('fs');
const request = require('request');
const cm = require('./confusionMatrix');

module.exports.readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
};

module.exports.getMysqlData = () => {
    return new Promise((resolve, reject) => {
        request.get('http://localhost:3000/data', {
            qs: {
                pct: '0.8',
                res_col: '1',
                seed: '1',
            }
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                const bodyObj = JSON.parse(body);
                const trainData = bodyObj.train
                    .map(obj => ({ phrase: obj.Response, classification: obj.Classifier }));
                const testData = bodyObj.test
                    .map(obj => ({ phrase: obj.Response, classification: obj.Classifier }));
                resolve({ trainData, testData });
            }
        });
    });
};

module.exports.classifyTestData = (fnContext, classifierFn, testData, parseFn) => {
    const testResults = { correct: 0, incorrect: 0, results: [] };
    testData.forEach(td => {
        let thisClass = classifierFn.call(fnContext, td.phrase);
        if (parseFn) {
            thisClass = parseFn(thisClass);
        }
        let correct = false;
        if (thisClass === td.classifier) {
            testResults.correct++;
            correct = true;
        } else {
            testResults.incorrect++;
        }
        testResults.results.push({
            correct,
            phrase: td.phrase, 
            correctClass: td.classifier, 
            assignedClass: thisClass,
        });
    });
    return testResults;
};

module.exports.logResults = (trainData, testResults) => {
    fs.writeFileSync('./results/train.json', Buffer.from(JSON.stringify(trainData)));
    fs.writeFileSync('./results/test-results.json', Buffer.from(JSON.stringify(testResults)));
    cm.createCsvConfusionMatrix('./results/test-results.json', './results/matrix.csv');
    console.log('Correct: ', testResults.correct);
    console.log('Incorrect: ', testResults.incorrect);
};