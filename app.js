
const express = require('express');
const endpoints = require('./src/endpoints'); // Import the endpoints file
const cors = require('cors'); // Import the cors module
const multer = require('multer');



const app = express();

// Other middleware and configurations...
app.use(cors());

app.use(express.json());



// Use the endpoints defined in endpoints.js
app.use('/', endpoints);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

