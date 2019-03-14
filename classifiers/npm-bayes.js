const natural = require('natural');
const u = require('../utils');

const classifier = new natural.BayesClassifier();

module.exports.run = () => {
  u.getMysqlData()
    .then(response => {
      response.trainData.forEach(d => {
        classifier.addDocument(d.phrase, d.classifier);
      });
      classifier.train();
      const testResults = u.classifyTestData(classifier, classifier.classify, response.testData);
      u.logResults(response.trainData, testResults);
    })
    .catch(console.error);
};
