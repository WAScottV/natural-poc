const natural = require('natural');
const readline = require('readline');
const u = require('./utils');
const fs = require('fs');
const cm = require('./confusionMatrix');

let trainData = [];
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
    fs.writeFile('./results/test-results.json', Buffer.from(JSON.stringify(testResults)), err => {
        if (err) console.error(err);
    });
    cm.createCsvConfusionMatrix('./results/test-results.json', './results/matrix.csv');
    console.log('Correct: ', testResults.correct);
    console.log('Incorrect: ', testResults.incorrect);
    // uiLoop();
});

u.getMysqlData()
    .then(response => {
        trainData = response.train
            .map(obj => ({ phrase: obj.Response, classifier: obj.Classifier }));
        testData = response.test
            .map(obj => ({ phrase: obj.Response, classifier: obj.Classifier }));

        trainData.forEach(d => {
            classifier.addDocument(d.phrase, d.classifier);
        });
        classifier.train();
        fs.writeFile('./results/train.json', Buffer.from(JSON.stringify(trainData)), err => {
            if (err) console.error(err);
        });
    })
    .catch(console.error);

const classifyData = () => {
    
}

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     prompt: 'Enter command: ',
// });

// const uiLoop = () => {
//     // commands
//     /*
//     + ==> add document
//     p ==> print training set
//     c ==> classify
//     * ==> exit
//     */

//    rl.prompt();

//    rl.on('line', (input) => {
//        switch (input) {
//            case '*':
//                rl.close();
//                break;
//            case 'c':
//                rl.question('Enter phrase: ', (answer) => {
//                    console.log(classifier.classify(answer));
//                    rl.prompt();
//                });
//                break;
//            default:
//                console.log('Unrecognized command.');
//                break;
//        }
//        rl.prompt();
//    }).on('close', () => {
//        console.log('Ending program...');
//        process.exit(0);
//    });
// };