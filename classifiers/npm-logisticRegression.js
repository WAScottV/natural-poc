const natural = require('natural');
const u = require('../utils');
const fs = require('fs');
const cm = require('../confusionMatrix');

module.exports.run = () => {
  const classifier = new natural.LogisticRegressionClassifier();

  u.getMysqlData()
    .then(response => {
      response.trainData.forEach(d => {
        classifier.addDocument(d.phrase, d.classification);
      });
      
      classifier.train();
      
      const results = response.testData.map(d => {
        const assigned = classifier.classify(d.phrase);
        return {
          correct: assigned === d.classification,
          assignedClass: assigned,
          correctClass: d.classification,
          phrase: d.phrase,
        }
      });

      const resultsObj = { 
        correct: results.filter(r => r.correct).length, 
        incorrect: results.filter(r => !r.correct).length,
        results,
      };
      
      u.logResults(response.trainData, resultsObj);
    })
    .catch(console.error);
};