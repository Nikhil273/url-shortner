const mongoose = require("mongoose");

// Define the URL schema
const urlSchema = new mongoose.Schema({
  long_url: { type: String, required: true },
  short_code: { type: String, unique: true },
});

// Create the model
const URL = mongoose.model("URL", urlSchema);

// Export the model
module.exports = URL;
