const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const Model = require('../models/Model');
const multer = require('multer'); 
require('dotenv').config(); 

const { PROJECT_ID, CANONICAL_URL, SPECKLE_TOKEN } = process.env;
const headers = {
  Authorization: `Bearer ${SPECKLE_TOKEN}`,
  Accept: 'application/json',
};

// Define a model for speckle_models
const speckleModelSchema = new mongoose.Schema({}, { strict: false }); // If you don't know the exact schema
const SpeckleModel = mongoose.model('SpeckleModel', speckleModelSchema, 'speckle_models');

// ----------------------------------------
// 1. Check if the Server Contains a List of Objects
// ----------------------------------------
router.post('/diff', async (req, res) => {
    const { objectIds } = req.body;
    
    if (!objectIds || !Array.isArray(objectIds)) {
      return res.status(400).json({ error: 'objectIds must be an array' });
    }

    try {
      const url = `${CANONICAL_URL}/api/diff/${PROJECT_ID}`;
      const response = await axios.post(
        url,
        { objects: JSON.stringify(objectIds) },
        {
          headers: {
            Authorization: `Bearer ${SPECKLE_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get object differences.', details: error.response?.data || error.message });
    }
});

// ----------------------------------------
// 2. Upload a Batch of Objects
// ----------------------------------------
const upload = multer(); 
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const url = `${CANONICAL_URL}/objects/${PROJECT_ID}`;
  try {
    const response = await axios.post(url, req.file.buffer, {
      headers: {
        ...headers,
        'Content-Type': 'application/json', // Or 'application/gzip' if gzipped
      },
    })
    res.json({ message: '✅ Objects uploaded successfully', data: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload objects.' });
  }
});

// ----------------------------------------
//  3. Download a Single Object
// ----------------------------------------
router.get('/download/single/:projectId/:objectId', async (req, res) => {

  const { projectId, objectId } = req.params;
  const url = `${CANONICAL_URL}/objects/${projectId}/${objectId}/single`;

  try {
    const response = await axios.get(url, { headers });
    
    // Create a single document 
    const downloadedObject = new SpeckleModel({
      objectId: objectId,
      data: response.data,  
    });

    // Store data in MongoDB
    await downloadedObject.save();  

    res.json(response.data);  
  } catch (error) {
    res.status(500).json({ error: 'Failed to download single object.' });
  }
});


// ----------------------------------------
// 4. Download a List of Objects and Store in DB
// ----------------------------------------
router.post('/download/list', async (req, res) => {
  const { objectIds } = req.body; // Expects ["id1", "id2", "id3"]

  if (!objectIds || !Array.isArray(objectIds)) {
    return res.status(400).json({ error: "objectIds must be an array" });
  }

  const url = `${CANONICAL_URL}/api/getobjects/${PROJECT_ID}`;
  try {
    // Fetch the objects
    const response = await axios.post(url, {
      objects: JSON.stringify(objectIds),
    }, { headers });

    const objects = response.data;

    // Create a single document with all objects
    const downloadDocument = {
      objectIds: objectIds,      
      objects: objects,          
      timestamp: new Date(),     
    };

    // Insert the single document into MongoDB
    const savedDownload = await SpeckleModel.insertOne(downloadDocument);
    res.json({ message: "✅ Download saved as a single document in DB", data: savedDownload });
  } catch (error) {
    res.status(500).json({ error: 'Failed to download and save list of objects.' });
  }
});

// ----------------------------------------
// 5. Download an Object and All its Children
// ----------------------------------------
router.get('/download/:objectId', async (req, res) => {
  const { objectId } = req.params;
  const url = `${CANONICAL_URL}/objects/${PROJECT_ID}/${objectId}`;

  try {
    const response = await axios.get(url, { headers });

    // Save to MongoDB
    const newModel = new Model({
      objectId,
      projectId: PROJECT_ID,
      modelData: response.data,
    });
    await newModel.save();

    res.json({ message: '✅ Object and children downloaded & saved!', modelId: newModel._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to download object and its children.' });
  }
});

// ----------------------------------------
// 6. Fetch Saved Model Data from MongoDB
// ----------------------------------------
router.get('/models/:modelId', async (req, res) => {
  const { modelId } = req.params;

  try {

    // Corrected usage of mongoose.Types.ObjectId with 'new'
    const model = await mongoose.connection.collection('speckle_models').findOne({ _id: new mongoose.Types.ObjectId(modelId) });

    // Log the fetched model

    // Check if model exists
    if (!model) {
      return res.status(404).json({ error: 'Model not found.' });
    }

    // Return the model as a JSON response
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch model from MongoDB.' });
  }
});

// ----------------------------------------
// 7. Fetch All Saved Model Data from MongoDB
// ----------------------------------------
router.get('/models', async (req, res) => {
    try {
        // Log database and collection
        const collections = await mongoose.connection.db.listCollections().toArray();

        // Fetch all models from the 'Speckle_Models' collection
        const models = await mongoose.connection.collection('speckle_models').find().toArray();

        if (models.length === 0) {
            return res.status(404).json({ error: 'No models found.' });
        }

        // Return models as a JSON response
        res.json(models);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch models from MongoDB.' });
    }
});
// Export the router
module.exports = router;
