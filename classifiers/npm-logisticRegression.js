const natural = require('natural');
const u = require('../utils');
const fs = require('fs');
const cm = require('../confusionMatrix');

module.exports.run = () => {
  const classifier = new natural.LogisticRegressionClassifier();

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