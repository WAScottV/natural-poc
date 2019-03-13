const natural = require('natural');
const readline = require('readline');
const u = require('./utils');
const fs = require('fs');
const cm = require('./confusionMatrix');

let testData = [];

const classifier = new natural.BayesClassifier();

classifier.events.on('doneTraining', (val) => {
    const testResults = { correct: 0, incorrect: 0, results: [] };
    testData.forEach(td => {
        const thisClass = classifier.classify(td.phrase);
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
    fs.writeFileSync('./results/test-results.json', Buffer.from(JSON.stringify(testResults)));
    cm.createCsvConfusionMatrix('./results/test-results.json', './results/matrix.csv');
    console.log('Correct: ', testResults.correct);
    console.log('Incorrect: ', testResults.incorrect);
});

u.getMysqlData()
    .then(response => {
        response.trainData.forEach(d => {
            classifier.addDocument(d.phrase, d.classifier);
        });
        testData = response.testData;
        classifier.train();
        fs.writeFile('./results/train.json', Buffer.from(JSON.stringify(response.trainData)), err => {
            if (err) console.error(err);
        });
    })
    .catch(console.error);