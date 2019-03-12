const ConfusionMatrix = require('ml-confusion-matrix');
const fs = require('fs');

module.exports.createCsvConfusionMatrix = (sourceFilePath, destFilePath) => {
  fs.readFile(sourceFilePath, (err, data) => {
    const obj = JSON.parse(Buffer.from(data).toString('utf8')).results.filter(r => !r.correct);
    const trueLabels = obj.map(d => d.assignedClass);
    const predictedLabels = obj.map(d => d.correctClass);
    const CM2 = ConfusionMatrix.fromLabels(trueLabels, predictedLabels);
    const matrix = CM2.getMatrix();
    const labels = CM2.getLabels();
  
    fs.writeFileSync(destFilePath, '');
    fs.appendFileSync(destFilePath, `,${labels.toString()}\n`);
    for (let i = 0; i < matrix.length; i++) {
      fs.appendFileSync(destFilePath, `${labels[i]},${matrix[i].toString()}\n`);
    }
  });
}



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
