const fs = require('fs');
const path = require('path');
const textFilePath = path.join(__dirname, 'text.txt');
const readline = require('readline');

const closeScript = function() {
  console.log('\nSee you later');
  process.exit();
};

fs.writeFile(textFilePath, '', function (err) {
  if (err) throw err;
});

const reading = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

reading.question('Enter your text: ', (answer) => {
  if (answer === 'exit') {
    closeScript();
  } 
  fs.appendFile(textFilePath, answer, function (err) {
    if (err) throw err;
  });
  reading.close();
});

reading.on('SIGINT', () => {
  closeScript();
});



