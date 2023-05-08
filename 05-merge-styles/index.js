const fsPromises = require('fs').promises;
const path = require('path');

const stylesDirectory = path.join(__dirname, 'styles');
const projectDistDirectory = path.join(__dirname, 'project-dist');
let mergedFiles = '';

fsPromises.readdir(stylesDirectory)
  .then(files => files.filter(file => path.parse(file).ext === '.css'))
  .then(cssFiles => {
    return Promise.all(cssFiles.map(file => {
      const srcFilePath = path.join(stylesDirectory, file);

      return fsPromises.readFile(srcFilePath)
        .then(contents => {
          mergedFiles += contents;
        });
    }));
  })
  .then(() => {
    const destFilePath = path.join(projectDistDirectory, 'bundle.css');
    return fsPromises.writeFile(destFilePath, mergedFiles);
  })
  .catch(error => {
    console.error(error);
  });
