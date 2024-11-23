import React, { useState, useEffect } from "react";
import "../style/SearchPage.css";
import "../index.css";

export default function SearchSong() {
  const [genres, setGenres] = useState([]); 
  const [selectedGenre, setSelectedGenre] = useState(""); 
  const [songs, setSongs] = useState([]);
  const [numResults, setNumResults] = useState(0);
  const [error, setError] = useState("");
  const [term, setTerm] = useState(""); 

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:8080/genres"); // API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch genres");
        }
        const data = await response.json();
        setGenres(data);
        setSelectedGenre(data[0]?.Genre || ""); // Default to the first genre
      } catch (err) {
        console.error(err);
        setError("Failed to load genres");
      }
    };

    fetchGenres();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSongs([]);
    setNumResults(0);

    if (!selectedGenre) {
      setError("Please select a genre.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/tracks/genre/${selectedGenre}`);
      if (!response.ok) {
        throw new Error("Failed to fetch songs");
      }
      const data = await response.json();
      setSongs(data);
      setNumResults(data.length);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };


  return (
    <div>
      {/* Navigation Bar */}
      <div id="navbar">
        <ul>
          <li><a href="http://localhost:3000/">HomePage</a></li>
          <li>Sound Lab</li>
          <li>Genre</li>
          <li>Collaboration</li>
        </ul>
      </div>

      {/* Page Wrapper */}
      <div id="page-wrapper">
          {/* Search Form */}
          <form id="search-form" onSubmit={handleSubmit}>
            <label htmlFor="genre-select"></label>

            {/* Dropdown for Genre Selection */}
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {genres.map((genre) => (
                <option key={genre.ID} value={genre.Genre}>
                  {genre.Genre}
                </option>
              ))}
            </select>

            {/* Input for Results Limit */}
            <input
              type="number"
              placeholder="5 results"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />

            {/* Search Button */}
            <button type="submit">Search</button>
          </form>

          {/* Error Message */}
          {error && <p className="error">{error}</p>}

          {/* Results Message */}
          {numResults > 0 && (
            <p>
              Found <span id="num-results">{numResults}</span> result(s).
            </p>
          )}

          {/* Search Results */}
          {/* <div id="search-results">
              {songs.map((song) => (
                <div key={song.track_id} className="song-item">
                  <h3>{song.title}</h3>
                  <p>Release Date: {song.release_date}</p>
                  <a href={song.track_url} target="_blank" rel="noopener noreferrer">
                    Listen
                  </a>
                </div>
              ))}
            </div>
            <div id="search-results">
              <table id="results-table">
                <thead>
                  <tr>
                    <th>Track ID</th>
                    <th>Title</th>
                    <th>URL</th>
                    <th>Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.length > 0 ? (
                    songs.map((song) => (
                      <tr key={song.track_id}>
                        <td>{song.track_id}</td>
                        <td>{song.title}</td>
                        <td>
                          <a
                            href={song.track_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Listen
                          </a>
                        </td>
                        <td>{song.release_date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No results found. Try a different genre or limit.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> */}

        </div>
      </div>
  );
}
