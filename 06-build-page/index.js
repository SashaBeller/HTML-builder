const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const stylePath = path.join(__dirname, 'styles');
const styleCssPathNew = path.join(projectDir, 'style.css');
const assetsDir = path.join(__dirname, 'assets');
const assetsDirNewCopy = path.join(projectDir, 'assets');

const templateHtml = path.join(__dirname, 'template.html');
const articlesPath = path.join(__dirname, 'components', 'articles.html');
const footerPath = path.join(__dirname, 'components', 'footer.html');
const headerPath = path.join(__dirname, 'components', 'header.html');

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

Promise.all([
  fsPromises.readFile(templateHtml, 'utf8'),
  fsPromises.readFile(headerPath, 'utf8'),
  fsPromises.readFile(articlesPath, 'utf8'),
  fsPromises.readFile(footerPath, 'utf8'),
])
  .then(([html, header, articles, footer]) => {
    const result = html
      .replace('{{header}}', header)
      .replace('{{articles}}', articles)
      .replace('{{footer}}', footer);

    const outputPath = path.join(projectDir, 'index.html');
    return fsPromises.writeFile(outputPath, result, 'utf8');
  })
  .catch((err) => {
    console.error(err);
  });


createFolderWithCss();
copyDir(assetsDir, assetsDirNewCopy);