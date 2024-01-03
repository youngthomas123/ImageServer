const express = require('express');
const path = require('path'); // Import the path module
const router = express.Router();
const multer = require('multer');
const logic = require('./logic'); // Import the logic file

//single file storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const { url } = req;
      let uploadPath = '';
  
      if (url === '/upload/ProfilePic') {
        uploadPath = 'Images/ProfilePic';
      } else if (url === '/upload/MainPropertyPic') {
        uploadPath = 'Images/MainPropertyPic';
      } else {
        // Handle other cases or provide a default folder
        uploadPath = 'Images';
      }
  
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
     
      const timestamp = Date.now(); // Current timestamp
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
      const newFilename = `${timestamp}${randomNumber}${path.extname(file.originalname)}`;
      cb(null, newFilename);

    
    },
  });
  const upload = multer({ storage });


  //multi file storage config
  const multiStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/PropertyPhoto');
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now(); // Current timestamp
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
      const newFilename = `${timestamp}${randomNumber}${path.extname(file.originalname)}`;
      cb(null, newFilename);
    },
  });
  
  const uploadMultiple = multer({ storage: multiStorage }).array('image', 10); // Use 'image' as the field name
    




// Static images start
router.get('/', (req, res) => {
  res.send('Image server');
});

router.get('/Images/FrontPageImage', (req, res) => {
  const imagePath = path.join(__dirname, '..', 'Images', 'FrontPageImage.jpg');
// Send the image file as a response
res.sendFile(imagePath);
});


router.get('/Images/NotFound', (req, res) => {
    const imagePath = path.join(__dirname, '..', 'Images', 'NotFound.jpg');
  // Send the image file as a response
  res.sendFile(imagePath);
  });


  router.get('/Images/ProfilePlaceHolder', (req, res) => {
    const imagePath = path.join(__dirname, '..', 'Images', 'ProfilePlaceHolder.jpeg');
  // Send the image file as a response
  res.sendFile(imagePath);
  });

  router.get('/Images/HousePlaceHolder', (req, res) => {
    const imagePath = path.join(__dirname, '..', 'Images', 'HousePlaceHolder.png');
  // Send the image file as a response
  res.sendFile(imagePath);
  });



  // Static images end

router.get('/Images/ProfilePic/:imageName', (req, res) =>{
    const { imageName } = req.params;
    
    const imagePath = path.join(__dirname, '..', 'Images', 'ProfilePic', imageName);
    if(logic.doesImageExist(imagePath))
    {
     res.sendFile(imagePath);
    }
    else
    {
        res.redirect('/Images/ProfilePlaceHolder');
    }
    
})

router.get('/Images/MainPropertyPic/:imageName', (req, res) =>{
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, '..', 'Images', 'MainPropertyPic', imageName);
    if(logic.doesImageExist(imagePath))
    {
      res.sendFile(imagePath);
    }
    else
    {
      res.redirect('/Images/NotFound');
    }
    
})

router.get('/Images/PropertyPhoto/:imageName', (req, res) =>{
    const { imageName } = req.params;
    const imagePath = path.join(__dirname, '..', 'Images', 'PropertyPhoto', imageName);
    if(logic.doesImageExist(imagePath))
    {
      res.sendFile(imagePath);
    }
    else
    {
      res.redirect('/Images/NotFound');

    }
    
})



router.post('/upload/ProfilePic', upload.single('image'), async (req, res) => {
    try 
    {
      // If successfully uploaded and the deletion was successful, send a success response
      const imageURL = `http://localhost:3000/Images/ProfilePic/${req.file.filename}`;
      res.status(200).send(imageURL);
    } 
    catch (error)
    {
      // If any error occurs during the deletion or upload process, handle it here
      console.error(error);
      res.status(500).send('Error uploading image to ProfilePic folder!');
    }
  });

  router.post('/delete/ProfilePic', async (req, res) => {
    const imageUrl = req.body.imageUrl; // Assuming the image URL is sent as 'imageUrl' in the request body
  
    if (!imageUrl) 
    {
      return res.status(200).send('No image URL provided');
    }
  
    try 
    {
      // Extract filename from the URL to construct the path for deletion
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      const imagePath = path.join(__dirname, '..', 'Images/ProfilePic', filename);
  
      // Attempt to delete the image based on the constructed path
      await logic.deleteImageIfExists(imagePath);
      res.status(200).send('Image deleted successfully');
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send('Error deleting image');
    }
  });
  


  router.post('/upload/MainPropertyPic', upload.single('image'), async (req, res) =>{
    try 
    {
      // If successfully uploaded and the deletion was successful, send a success response
      const imageURL = `http://localhost:3000/Images/MainPropertyPic/${req.file.filename}`;
      res.status(200).send(imageURL);
    } 
    catch (error)
    {
      // If any error occurs during the deletion or upload process, handle it here
      console.error(error);
      res.status(500).send('Error uploading image to ProfilePic folder!');
    }
  });

  router.post('/delete/MainPropertyPic', async (req, res) => {
    const imageUrl = req.body.imageUrl; // Assuming the image URL is sent as 'imageUrl' in the request body
  
    if (!imageUrl) 
    {
      return res.status(200).send('No image URL provided');
    }
  
    try 
    {
      // Extract filename from the URL to construct the path for deletion
      const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      const imagePath = path.join(__dirname, '..', 'Images/MainPropertyPic', filename);
  
      // Attempt to delete the image based on the constructed path
      await logic.deleteImageIfExists(imagePath);
      res.status(200).send('Image deleted successfully');
    } 
    catch (error) 
    {
      console.error(error);
      res.status(500).send('Error deleting image');
    }
  });







  router.post('/upload/PropertyPhoto', (req, res) => {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        // Handle multer error
        console.log(err);
        return res.status(500).send('Error uploading files');
      }
  
      try 
      {
       
        const uploadedFiles = req.files; // Access uploaded files information from req object
        const imageURLs = uploadedFiles.map(file => `http://localhost:3000/Images/PropertyPhoto/${file.filename}`);
  
        res.status(200).json({ imageURLs }); // Send array of image URLs as JSON response
      }
       catch (error)
      {
        console.error(error);
        res.status(500).send('Error processing uploaded images');
      }
    });
  });


  router.post('/delete/PropertyPhoto', (req, res) => {
    try {
      const imageUrls  = req.body.imageUrls; // Assuming the URLs are provided in the 'imageUrls' array within the request body
  
      if (!imageUrls || !Array.isArray(imageUrls)) 
      {
        console.log(imageUrls)
        return res.status(400).send('Invalid image URLs provided');
      }
  
      const imageDeletionPromises = imageUrls.map(async (url) => {
        // Extract filename from the URL to construct the path for deletion
        const filename = url.substring(url.lastIndexOf('/') + 1);
        const imagePath = path.join(__dirname, '..', 'Images/PropertyPhoto', filename);
  
        // Perform deletion logic for each URL provided
        await logic.deleteImageIfExists(imagePath);
      });
  
      // Wait for all deletion promises to complete
      Promise.all(imageDeletionPromises)
        .then(() => {
          res.status(200).send('Images deleted successfully');
        })
        .catch((deleteError) => {
          console.error(deleteError);
          res.status(500).send('Error deleting images');
        });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  





  


// Export the router containing the endpoints
module.exports = router;

