const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const stylePath = path.join(__dirname, 'styles');
const styleCssPathNew = path.join(projectDir, 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const assetsDirNewCopy = path.join(projectDir, 'assets');

const templateHtmlPath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');

function createFolderWithCss() {
  fs.mkdir(projectDir, {recursive: true}, (err) => {
    if (err) throw err;

    fs.writeFile(styleCssPathNew, '', (err) => {
      if (err) throw err;
    });
  });
}

fsPromises.readdir(stylePath)
  .then((files) => {
    const cssFiles = files.filter((file) => path.parse(file).ext === '.css');

    return Promise.all(cssFiles.map((file) => fsPromises.readFile(path.join(stylePath, file), 'utf8')))
      .then((contents) => contents.join(''));
  })
  .then((mergedContent) => {
    return fsPromises.writeFile(styleCssPathNew, mergedContent, 'utf8');
  })
  .catch((err) => {
    console.error(err);
  });

async function copyDir(source, destination) {
  try {
    await fsPromises.mkdir(destination, { recursive: true });

    const files = await fsPromises.readdir(source, { withFileTypes: true });

    for (let file of files) {
      const sourcePath = path.join(source, file.name);
      const destPath = path.join(destination, file.name);

      if (file.isDirectory()) {
        await copyDir(sourcePath, destPath);
      } else {
        await fsPromises.copyFile(sourcePath, destPath);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function readFiles(folderPath) {
  try {
    const htmlParts = [];
    const dirents = await fsPromises.readdir(folderPath, {withFileTypes: true});
    for (const dirent of dirents) {
      if (dirent.isFile() && path.parse(dirent.name).ext === '.html') {
        const direntPath = path.join(folderPath, dirent.name);
        const fileName = path.parse(dirent.name).name;
        const htmlPart = {
          name: fileName,
          path: direntPath
        };
        htmlParts.push(htmlPart);
      }
    } 
    return htmlParts;
  } catch (err) {
    console.error(err);
  }
}

fsPromises.readFile(templateHtmlPath, 'utf8')
  .then(templateHtml => {
    return readFiles(componentsDir)
      .then(components => {
        const promises = components.map(comp => {
          return fsPromises.readFile(comp.path, 'utf8')
            .then(file => {
              templateHtml = templateHtml.replace(`{{${comp.name}}}`, file);
            });
        });
        return Promise.all(promises);
      })
      .then(() => {
        const outputPath = path.join(projectDir, 'index.html');
        return fsPromises.writeFile(outputPath, templateHtml, 'utf8');
      });
  });

createFolderWithCss();
copyDir(assetsDir, assetsDirNewCopy);