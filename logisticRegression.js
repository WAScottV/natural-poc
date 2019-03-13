const natural = require('natural');
const u = require('./utils');
const fs = require('fs');
const cm = require('./confusionMatrix');

let trainData = [];
let testData = [];

const classifier = new natural.LogisticRegressionClassifier();

u.getMysqlData()
    .then(response => {
        trainData = response.train
            .map(obj => ({ phrase: obj.Response, classifier: obj.Classifier }));
        testData = response.test
            .map(obj => ({ phrase: obj.Response, classifier: obj.Classifier }));

        trainData.forEach(d => {
            classifier.addDocument(d.phrase, d.classifier);
        });
        fs.writeFileSync('./results/train.json', Buffer.from(JSON.stringify(trainData)));
        classifier.train();
        const testResults = { correct: 0, incorrect: 0, results: [] };
        testData.forEach(td => {
            try {
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
            } catch (e) {
                console.log(testResults);
                throw e;
            }
        });
        fs.writeFile('./results/test-results.json', Buffer.from(JSON.stringify(testResults)), err => {
            if (err) console.error(err);
        });
        cm.createCsvConfusionMatrix('./results/test-results.json', './results/matrix.csv');
        console.log('Correct: ', testResults.correct);
        console.log('Incorrect: ', testResults.incorrect);

    })
    .catch(console.error);

// classifier.events.on('doneTraining', (val) => {
//     console.log('done training');
// });