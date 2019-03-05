const natural = require('natural');
const readline = require('readline');
const u = require('./utils');

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
    // testData.forEach(td => {
    //     classifier.classify();
    // });
    uiLoop();
});

u.getMysqlRandomData()
    .then(response => {
        trainData = response.train
            .map(obj => ({ r: obj.Response, c: obj.Classifier }));
        testData = response.test
            .map(obj => ({ r: obj.Response, c: obj.Classifier }));

        console.time('train'); // begin timer for training
        trainData.forEach(d => {
            classifier.addDocument(d.r, d.c);
        });
        classifier.train();
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