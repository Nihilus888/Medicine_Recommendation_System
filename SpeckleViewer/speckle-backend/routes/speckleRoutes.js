const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const Model = require('../models/Model');
const multer = require('multer'); // For file uploads
require('dotenv').config(); // Load env variables

const { PROJECT_ID, CANONICAL_URL, SPECKLE_TOKEN } = process.env;
const headers = {
  Authorization: `Bearer ${SPECKLE_TOKEN}`,
  Accept: 'application/json',
};

// Define a model for speckle_models
const speckleModelSchema = new mongoose.Schema({}, { strict: false }); // If you don't know the exact schema
const SpeckleModel = mongoose.model('SpeckleModel', speckleModelSchema, 'speckle_models');

// ----------------------------------------
// 🔍 1. Check if the Server Contains a List of Objects
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
      // Log the entire error to understand more
      console.error('Error response:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to get object differences.', details: error.response?.data || error.message });
    }
});

// ----------------------------------------
// ⬆️ 2. Upload a Batch of Objects
// ----------------------------------------
const upload = multer(); // Initialize multer for file uploads
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
    });
    res.json({ message: '✅ Objects uploaded successfully', data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to upload objects.' });
  }
});

// ----------------------------------------
// 📥 3. Download a Single Object
// ----------------------------------------
router.get('/download/single/:objectId', async (req, res) => {
  const { objectId } = req.params;
  const url = `${CANONICAL_URL}/objects/${PROJECT_ID}/${objectId}/single`;

  try {
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to download single object.' });
  }
});

// ----------------------------------------
// 📥 4. Download a List of Objects
// ----------------------------------------
router.post('/download/list', async (req, res) => {
  const { objectIds } = req.body; // Expects ["id1", "id2", "id3"]

  if (!objectIds || !Array.isArray(objectIds)) {
    return res.status(400).json({ error: "objectIds must be an array" });
  }

  const url = `${CANONICAL_URL}/api/getobjects/${PROJECT_ID}`;
  try {
    const response = await axios.post(url, {
      objects: JSON.stringify(objectIds),
    }, { headers });
    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to download list of objects.' });
  }
});

// ----------------------------------------
// 📥 5. Download an Object and All its Children
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
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to download object and its children.' });
  }
});

// ----------------------------------------
// 📤 6. Fetch Saved Model Data from MongoDB
// ----------------------------------------
router.get('/models/:modelId', async (req, res) => {
    const { modelId } = req.params;

    try {
        // Log the current database and collection to ensure you're accessing the correct one
        console.log("Connected to Database:", mongoose.connection.db.databaseName);
        console.log("Querying Collection:", "Speckle_Models"); // Your collection name

        // Fetch all documents in the 'Speckle_Models' collection
        const models = await mongoose.connection.collection('Speckle_Models').find().toArray(); // .toArray() to get all documents
        console.log("Fetched Models:", models);

        // Check if models exist
        if (!models || models.length === 0) {
            return res.status(404).json({ error: 'No models found in the collection.' });
        }

        // Return the models as a JSON response
        res.json(models);
    } catch (error) {
        console.error("Error fetching models:", error.message);
        res.status(500).json({ error: 'Failed to fetch models from MongoDB.' });
    }
});

// ----------------------------------------
// 📤 6. Fetch All Saved Model Data from MongoDB
// ----------------------------------------

router.get('/models', async (req, res) => {
    try {
        // Log database and collection
        console.log("Connected to Database:", mongoose.connection.db.databaseName);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available Collections:", collections);

        // Fetch all models from the 'Speckle_Models' collection
        const models = await mongoose.connection.collection('Speckle_Models').find().toArray();
        console.log("Fetched Models:", models);
        
        if (models.length === 0) {
            return res.status(404).json({ error: 'No models found.' });
        }

        // Return models as a JSON response
        res.json(models);
    } catch (error) {
        console.error("Error fetching models:", error.message);
        res.status(500).json({ error: 'Failed to fetch models from MongoDB.' });
    }
});
// Export the router
module.exports = router;
