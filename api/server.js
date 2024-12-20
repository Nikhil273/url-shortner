const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortid = require("shortid");
const URL = require("../Backend/models/url");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors({
  origin: "http://localhost:3000",  // You can specify the frontend origin here
  methods: "GET,POST",              // Allow only GET and POST methods
  allowedHeaders: "Content-Type",   // Allow only Content-Type header
}));
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

mongoose.connect(process.env.URL, {
  family: 4
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Create a short URL
app.post("/shorten", async (req, res) => {
  console.log("Request Body:", req.body); // Check if data is coming through
  const { long_url } = req.body;
  const short_code = shortid.generate();
  const newURL = new URL({ long_url, short_code });

  try {
    await newURL.save();
    res.json({ short_url: `http://localhost:8080/${short_code}` });
  } catch (err) {
    console.error("Error while saving to DB:", err);
    res.status(500).json({ error: "An error occurred while creating the short URL." });
  }
});

app.get("/allurls", async (req, res) => {
  try {
    const urls = await URL.find();
    res.json(urls);
  } catch (err) {
    console.error("Error finding URLs:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect to the original URL
app.get("/:short_code", async (req, res) => {
  const { short_code } = req.params;

  try {
    const url = await URL.findOne({ short_code });

    if (url) {
      return res.redirect(url.long_url);
    } else {
      return res.status(404).json({ error: "Short URL not found" });
    }
  } catch (err) {
    console.error("Error finding URL:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
app.get("/", (req, res) => {
  res.send("API is Working!");
})

// Start the server
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

