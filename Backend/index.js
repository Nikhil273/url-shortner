const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortid = require("shortid");
const URL = require("./models/url");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
app.use(cors({
  origin: [
    'https://url-shortner-git-main-nikhil273s-projects.vercel.app',
    'http://192.168.1.30:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
// Add this after your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});
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
    res.json({ short_url: `https://urlbackend-plum.vercel.app/${short_code}` });
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
  console.log("Server running on https://urlbackend-plum.vercel.app");
});

