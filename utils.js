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
        request.get('http://localhost:3000', (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
};