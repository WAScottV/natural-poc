
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