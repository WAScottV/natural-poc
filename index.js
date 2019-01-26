const natural = require('natural');
const readline = require('readline');
const u = require('./utils');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Enter phrase: ',
});

const classifier = new natural.BayesClassifier();

classifier.events.on('doneTraining', function (val) {
    console.log('Done Training.');
    const time = console.timeEnd('train');

    // UI

    rl.prompt();

    rl.on('line', (input) => {
        if (input === '*') {
            rl.close();
            return;
        }
        try {
            console.log('Response: ', classifier.getClassifications(input));
        } catch (e) {
            console.log(e);
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Ending program...');
        process.exit(0);
    });
});

u.readFile('./weather_data_train.csv')
    .then(doc => {
        const temp = doc.split('\r');
        console.time('train');
        temp.forEach(s => {
            const args = s.split(',');
            classifier.addDocument(args[0], args[1]);
        });

        classifier.train();
    });

    // setTimeout(() => {
    //     classifier.save('cb.json', (err, classifier) => {
    //         if (err) {
    //             console.log('Error: ', err);
    //         } else {
    //             console.log(JSON.stringify(classifier, null, 2));
    //         }
    //     });
    // }, 4000);