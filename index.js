const bayes = require('./classifiers/npm-bayes');
const lr = require('./classifiers/npm-logisticRegression');
const nlp = require('./classifiers/node-nlp');

nlp.run();
// switch(process.argv[2]) {
//   case 'bayes':
//     console.log('Running Bayes Classifier...');
//     bayes.run();
//     break;
//   case 'lr':
//     console.log('Running Logistict Regression Classifier...');
//     lr.run();
//     break;
//   case 'nlp':
//     console.log('Running Node-NLP Manager...');
//     nlp.run();
//     break;
// }