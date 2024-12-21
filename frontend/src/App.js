import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://urlbackend-plum.vercel.app";

const App = () => {
  const [longUrl, setLongUrl] = useState("");
  const [allUrls, setAllUrls] = useState([]);
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch all URLs on page load
  useEffect(() => {
    fetchAllUrls();
  }, []);

  const fetchAllUrls = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${API_BASE_URL}/allurls`);
      setAllUrls(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching all URLs:", err);
      setError("Failed to fetch URLs. Please try again.");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await axios.post(`${API_BASE_URL}/shorten`, {
        long_url: longUrl
      });
      setShortUrl(response.data.short_url);
      await fetchAllUrls(); // Refresh the URL list after successful shortening
      setLongUrl(""); // Clear input after successful submission
    } catch (err) {
      console.error("Error shortening URL:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderUrlList = () => {
    if (fetchLoading) return <p>Loading URLs...</p>;
    if (error) return <p className="error">{error}</p>;
    if (allUrls.length === 0) return <p>No URLs available.</p>;

    return allUrls.map((url, index) => (
      <div key={url._id || index} className="url-item">
        <ul>
          <li>
            <p>Long URL: {url.long_url}</p>
            <p>
              Short URL:{" "}

              <a href={`${API_BASE_URL}/${url.short_code}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {`${API_BASE_URL}/${url.short_code}`}
              </a>
            </p>
          </li>
        </ul>
      </div >
    ));
  };

  return (
    <div className="app">
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="url"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
          pattern="https?://.*"
          title="Please enter a valid URL starting with http:// or https://"
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
        {renderUrlList()}
      </div>
    </div>
  );
};

export default App;