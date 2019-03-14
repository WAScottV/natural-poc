const { NlpManager } = require('node-nlp');
const u = require('./utils');

const manager = new NlpManager({ languages: ['en'] });

u.getMysqlData()
	.then(response => {
		response.trainData.forEach(d => {
			manager.addDocument('en', d.phrase, d.classifier);
		});
		manager.train()
			.then(() => {
				
			});
		// response.testData;
	})
	.catch(console.error);

// Train and save the model.
(async () => {
	await manager.train();
	manager.save();
	const response = await manager.process('en', 'I have to go');
	console.log(response.intent);
})();