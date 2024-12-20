import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [longUrl, setLongUrl] = useState("");
  const [allurls, setAllUrls] = useState([]); // Initialize as an array
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all URLs on page load
  useEffect(() => {
    const fetchAllUrls = async () => {
      try {
        const response = await axios.get("https://urlbackend-plum.vercel.app/allurls");
        setAllUrls(response.data);
      } catch (err) {
        console.error("Error fetching all URLs:", err);
        setError("Failed to fetch URLs. Please try again.");
      }
    };

    fetchAllUrls();
  }, []); // Empty dependency array to run only on page load

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");
    console.log("Designed & Developed by Nikhil Maurya.");

    try {
      // Send request to the backend
      const response = await axios.post("https://urlbackend-plum.vercel.app/shorten", { long_url: longUrl });
      setShortUrl(response.data.short_url);

      // Fetch updated list of all URLs after shortening
      // const allUrlsResponse = await axios.get("https://urlbackend-plum.vercel.app/allurls");
      // setAllUrls(allUrlsResponse.data); // Update state with the retrieved URLs
    } catch (err) {
      // Handle errors if any
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {shortUrl && (
        <div className="result">
          <p>Your short URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
      <hr />
      <div className="showall">
        <h2>All URLs</h2>
        {allurls.length > 0 ? (
          allurls.map((url, index) => (
            <div key={index}>
              <ul>
                <li>
                  <p>Long URL: {url.long_url}</p>
                  <p>
                    Short URL:{" "}
                    <a
                      href={`https://urlbackend-plum.vercel.app/${url.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`https://urlbackend-plum.vercel.app/${url.short_code}`}
                    </a>
                  </p>
                </li>
              </ul>

            </div>
          ))
        ) : (
          <p>No URLs available.</p>
        )}
      </div>
    </div>
  );
};

export default App;
