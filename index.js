const natural = require('natural');
const readline = require('readline');
const u = require('./utils');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Enter phrase: ',
});

const classifier = new natural.BayesClassifier();

classifier.events.on('trainedWithDocument', function (obj) {
    console.log(obj);
    console.log('You may now input data');
    /* {
    *   total: 23 // There are 23 total documents being trained against
    *   index: 12 // The index/number of the document that's just been trained against
    *   doc: {...} // The document that has just been indexed
    *  }
    */
 });

classifier.addDocument('i am long qqqq', 'buy');
classifier.addDocument('buy the q\'s', 'buy');
classifier.addDocument('short gold', 'sell');
classifier.addDocument('sell gold', 'sell');
 
classifier.train();

rl.prompt();

rl.on('line', (input) => {
    if (input === '*') {
        rl.close();
        return;
    }
    try {
        console.log('Response: ', classifier.classify(input));
    } catch (e) {
        console.log(e);
    }
    rl.prompt();
}).on('close', () => {
    console.log('Ending program...');
    process.exit(0);
});

// u.readFile('./weather_data_train.csv')
//     .then(doc => {
//         var temp = doc.split('\r');
//         for (let i = 0; i < 2; i++) {
//             classifier.addDocument(temp[i].split(','));
//             console.log('add');
//         }
//         // temp.forEach(s => {
//         //     classifier.addDocument(s.split(','));
//         // });
//         console.log('train');
//         classifier.train();
//     });