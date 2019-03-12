const ConfusionMatrix = require('ml-confusion-matrix');
const fs = require('fs');

const errCallback = (err) => {
  if (err) console.error(err);
};

fs.readFile('./results/incorrect.json', (err, data) => {
  const temp = Buffer.from(data);
  const obj = JSON.parse(temp.toString('utf8')).results;
  const trueLabels = obj.map(d => d.assignedClass);
  const predictedLabels = obj.map(d => d.correctClass);
  const CM2 = ConfusionMatrix.fromLabels(trueLabels, predictedLabels);
  const matrix = CM2.getMatrix();
  const labels = CM2.getLabels();
  console.log(printTables(CM2));

  fs.writeFileSync('./results/matrix.csv', '', errCallback);
  fs.appendFileSync('./results/matrix.csv', `,${labels.toString()}\n`);
  for (let i = 0; i < matrix.length; i++) {
    fs.appendFileSync('./results/matrix.csv', `${labels[i]},${matrix[i].toString()}\n`);
  }
});

const printTables = (CM2) => {
  const confusionTables = [];
  CM2.getLabels().forEach(l => {
    const table = CM2.getConfusionTable(l);
    confusionTables.push({
      label: l,
      truePositive: table[0][0],
      falseNegative: table[0][1],
      falsePositive: table[1][0],
      trueNegative: table[1][1],
    });
  });
  const results = confusionTables.sort((a, b) => (a.falseNegative + a.falsePositive) - (b.falseNegative + b.falsePositive));
  console.log(results);
};
