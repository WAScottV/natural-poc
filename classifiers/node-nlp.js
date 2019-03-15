const { NlpManager } = require('node-nlp');
const u = require('../utils');

const manager = new NlpManager({ languages: ['en'] });

module.exports.run = () => {
	u.getMysqlData()
		.then(response => {
			response.trainData.forEach(d => {
				manager.addDocument('en', d.phrase, d.classification);
			});

			manager.train()
				.then(() => {
					Promise.all(response.testData.map(d => {
						return manager.process('en', d.phrase)
							.then(response => {
								return {
									correct: response.intent === d.classification,
									assignedClass: response.intent,
									correctClass: d.classification,
									phrase: d.phrase,
								}
							});
					}))
					.then(results => {
						const resultsObj = { 
							correct: results.filter(r => r.correct).length, 
							incorrect: results.filter(r => !r.correct).length,
							results,
						};
						console.log(resultsObj);
					});
					// u.logResults(response.trainData, testResults);
				});
		})
		.catch(console.error);
};


// Train and save the model.
// (async () => {
// 	await manager.train();
// 	manager.save();
// 	const response = await manager.process('en', 'I have to go');
// 	console.log(response.intent);
// })();