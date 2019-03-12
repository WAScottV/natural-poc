const natural = require('natural');
const readline = require('readline');
const u = require('./utils');
const fs = require('fs');

let trainData = [];
let testData = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Enter command: ',
});

const classifier = new natural.BayesClassifier();

classifier.events.on('doneTraining', function (val) {
    console.timeEnd('train');
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
    fs.writeFile('./results/incorrect.json', Buffer.from(JSON.stringify(testResults.results.filter(r => !r.correct))), err => {
        if (err) console.error(err);
    });
    console.log('Correct: ', testResults.correct);
    console.log('Incorrect: ', testResults.incorrect);
    // uiLoop();
});

u.getMysqlRandomData()
    .then(response => {
        trainData = response.train
            .map(obj => ({ phrase: obj.Response, classifier: obj.Classifier }));
        testData = response.test
            .map(obj => ({ phrase: obj.Response, classifier: obj.Classifier }));

        console.time('train'); // begin timer for training
        trainData.forEach(d => {
            classifier.addDocument(d.phrase, d.classifier);
        });
        classifier.train();
        fs.writeFile('./results/train.json', Buffer.from(JSON.stringify(trainData)), err => {
            if (err) console.error(err);
        });
    })
    .catch(console.error);

const uiLoop = () => {
    // commands
    /*
    + ==> add document
    p ==> print training set
    c ==> classify
    * ==> exit
    */

   rl.prompt();

   rl.on('line', (input) => {
       switch (input) {
           case '*':
               rl.close();
               break;
           case 'c':
               rl.question('Enter phrase: ', (answer) => {
                   console.log(classifier.classify(answer));
                   rl.prompt();
               });
               break;
           default:
               console.log('Unrecognized command.');
               break;
       }
       rl.prompt();
   }).on('close', () => {
       console.log('Ending program...');
       process.exit(0);
   });
};