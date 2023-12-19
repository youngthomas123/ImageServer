const fs = require('fs');

function doesImageExist(imagePath)
{
    try 
    {
      // Check if the file exists using fs.statSync
      fs.statSync(imagePath);
      return true; // File exists
    } 
    catch (err) 
    {
      if (err.code === 'ENOENT') 
      {
        return false; // File doesn't exist
      }
      // Handle other errors if needed
      throw err;
    }
}

function deleteImageIfExists(imagePath)
{
   
    if(doesImageExist(imagePath))
    {
        fs.unlinkSync(imagePath);
    }

}

function deleteImagesIfTheyExist(imagePaths)
{
  imagePaths.array.forEach(imagePath => {
    deleteImageIfExists(imagePath);
  });
}



module.exports = {
    doesImageExist,
    deleteImageIfExists,
    deleteImagesIfTheyExist
  };
  