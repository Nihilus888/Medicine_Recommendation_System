// models/Model.js
const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  id: String,   
  name: String,
  visible: Boolean,
  elements: Array,
  __closure: Object,
  displayStyle: Object,
  speckle_type: String,
  applicationId: String,
  collectionType: String,
  totalChildrenCount: Number,
});

module.exports = mongoose.model('Model', modelSchema);