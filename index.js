const natural = require('natural');
const readline = require('readline');
const u = require('./utils');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Enter command: ',
});

const classifier = new natural.BayesClassifier();

classifier.events.on('doneTraining', function (val) {
    console.log('Done Training.');
    const time = console.timeEnd('train');

    // UI
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
                    console.log(classifier.getClassifications(answer));
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
});

u.getMysqlData()
    .then(data => console.log(JSON.stringify(data, null, 2)));


// u.readFile('./weather_data_train.csv')
//     .then(doc => {
//         const temp = doc.split('\r');
//         console.time('train');
//         temp.forEach(s => {
//             const args = s.split(',');
//             classifier.addDocument(args[0], args[1]);
//         });

//         classifier.train();
//     });

// const addDocument = (line) => {
//     const args = line.split(',');
//     if (args.length !== 2) {
//         console.error('Message not in correct format');
//     } else {
//         classifier.addDocument(args[0], args[1]);
//     }
// };

    // setTimeout(() => {
    //     classifier.save('cb.json', (err, classifier) => {
    //         if (err) {
    //             console.log('Error: ', err);
    //         } else {
    //             console.log(JSON.stringify(classifier, null, 2));
    //         }
    //     });
    // }, 4000);