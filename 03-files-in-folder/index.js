const fsPromises = require('fs/promises');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

async function listFiles(folderPath) {
  try {
    const dirents = await fsPromises.readdir(folderPath, {withFileTypes: true});
    for (const dirent of dirents) {
      if (dirent.isFile()) {
        const direntPath = path.join(folderPath, dirent.name);
        const fileName = path.parse(dirent.name).name;
        const fileExt = path.parse(dirent.name).ext.substring(1);
        const fileSize = (await fsPromises.stat(direntPath)).size / 1000 + 'kb';
        console.log(fileName + ' - ' + fileExt + ' - ' + fileSize);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listFiles(secretFolder);