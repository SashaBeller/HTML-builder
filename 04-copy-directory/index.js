const fsPromises = require('fs/promises');
const path = require('path');

const filesOrigPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'copiedFiles');

async function copyFiles() {
  try {
    
    const dirExist = await fsPromises.access(filesCopyPath)
      .then(() => true)
      .catch(() => false);

    // delete the existing copied directory
    if (dirExist) {
      await fsPromises.rm(filesCopyPath, { recursive: true });
    }

    //create a new dir
    await fsPromises.mkdir(filesCopyPath, { recursive: true }, (err) => {
      if (err) throw err;
    });
    
    //copy every file from orig to copy dir
    const files = await fsPromises.readdir(filesOrigPath);
    for (const file of files) {
      const origFile = path.join(filesOrigPath, file);
      const copyFile = path.join(filesCopyPath, file);
      await fsPromises.copyFile(origFile, copyFile);
    }
  }
  
  catch (err) {
    console.error(err);
  }
}

copyFiles(filesOrigPath, filesCopyPath);