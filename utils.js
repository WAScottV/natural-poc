const fs = require('fs');
const request = require('request');

module.exports.readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
};

module.exports.getMysqlData = () => {
    return new Promise((resolve, reject) => {
        request.get('http://localhost:3000/data', {
            qs: {
                pct: '0.8',
                res_col: '1',
                seed: '1',
            }
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                const bodyObj = JSON.parse(body);
                const trainData = bodyObj.train
                    .map(obj => ({ phrase: obj.Response, classifier: obj.Classifier }));
                const testData = bodyObj.test
                    .map(obj => ({ phrase: obj.Response, classifier: obj.Classifier }));
                resolve({ trainData, testData });
            }
        });
    });
};