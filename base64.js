const fs = require('fs');

const Base64 = function Base64() {

  this.encode = function (file) {
    let data = fs.readFileSync(file);
    return new Buffer(data).toString('base64');
  }

  this.decode = function (base64str, file) {
    let data = new Buffer.from(base64str, 'base64');
    fs.writeFileSync(file, data);
    console.log(`File ${file} written!`);
  }
};

module.exports = new Base64();
