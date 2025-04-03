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

// Define a model for speckle_models (Will work on this if I had more time to define the data schema more strictly)
const speckleModelSchema = new mongoose.Schema({}, { strict: false });
const SpeckleModel = mongoose.model('SpeckleModel', speckleModelSchema, 'speckle_models');

// Error handling function
const handleError = (res, error, message) => {
  console.error(error);
  res.status(500).json({
    error: message,
    details: error.response?.data || error.message
  });
};

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
      const response = await axios.post(url, { objects: JSON.stringify(objectIds) }, { headers });
      res.json(response.data);
    } catch (error) {
      handleError(res, error, 'Failed to get object differences.');
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
    const response = await axios.post(url, req.file.buffer, { headers });
    res.json({ message: '✅ Objects uploaded successfully', data: response.data });
  } catch (error) {
    handleError(res, error, 'Failed to upload objects.');
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
    const downloadedObject = new SpeckleModel({ objectId, data: response.data });
    await downloadedObject.save();  // Store data in MongoDB
    res.json(response.data);  
  } catch (error) {
    handleError(res, error, 'Failed to download single object.');
  }
});

// ----------------------------------------
// 4. Download a List of Objects and Store in DB
// ----------------------------------------
router.post('/download/list', async (req, res) => {
  const { objectIds } = req.body;
  if (!objectIds || !Array.isArray(objectIds)) {
    return res.status(400).json({ error: 'objectIds must be an array' });
  }

  const url = `${CANONICAL_URL}/api/getobjects/${PROJECT_ID}`;
  try {
    const response = await axios.post(url, { objects: JSON.stringify(objectIds) }, { headers });
    const downloadDocument = { objectIds, objects: response.data, timestamp: new Date() };
    const savedDownload = await SpeckleModel.insertOne(downloadDocument);
    res.json({ message: "✅ Download saved as a single document in DB", data: savedDownload });
  } catch (error) {
    handleError(res, error, 'Failed to download and save list of objects.');
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
    const newModel = new Model({ objectId, projectId: PROJECT_ID, modelData: response.data });
    await newModel.save();
    res.json({ message: '✅ Object and children downloaded & saved!', modelId: newModel._id });
  } catch (error) {
    handleError(res, error, 'Failed to download object and its children.');
  }
});

// ----------------------------------------
// 6. Fetch Saved Model Data from MongoDB
// ----------------------------------------
router.get('/models/:modelId', async (req, res) => {
  const { modelId } = req.params;
  try {
    const model = await mongoose.connection.collection('speckle_models').findOne({ _id: new mongoose.Types.ObjectId(modelId) });
    if (!model) {
      return res.status(404).json({ error: 'Model not found.' });
    }
    res.json(model);
  } catch (error) {
    handleError(res, error, 'Failed to fetch model from MongoDB.');
  }
});

// ----------------------------------------
// 7. Fetch All Saved Model Data from MongoDB
// ----------------------------------------
router.get('/models', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const models = await mongoose.connection.collection('speckle_models').find().toArray();
    if (models.length === 0) {
      return res.status(404).json({ error: 'No models found.' });
    }
    res.json(models);
  } catch (error) {
    handleError(res, error, 'Failed to fetch models from MongoDB.');
  }
});

// Export the router
module.exports = router;
