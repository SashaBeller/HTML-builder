const fs = require('fs');
const path = require('path');
const textFilePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(textFilePath);
readStream.on('data', (chunk) => {
  console.log(chunk.toString());
});