import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // For navigation
import "../style/GenrePage.css";
import "../index.css";

export default function GenrePage() {
  const [topGenres, setTopGenres] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(""); // For artist input
  const [randomSongs, setRandomSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(""); // For genre dropdown
  const [numSongs, setNumSongs] = useState(""); // For number of songs
  const [genres, setGenres] = useState([]); // List of genres for dropdown
  const [artistError, setArtistError] = useState("");
  const [genreError, setGenreError] = useState("");
  const [genreTracks, setGenreTracks] = useState([]); // Tracks for clicked genre
  const [clickedGenre, setClickedGenre] = useState(""); // Name of clicked genre
  const history = useHistory(); // For navigation

  // Fetch genres for the dropdown on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:8080/genres-with-ids");
        if (!response.ok) {
          throw new Error(`Failed to fetch genres. Status: ${response.status}`);
        }
        const data = await response.json();
        setGenres(data.rows); 
      } catch (error) {
        console.error("Error fetching genres:", error);
        setGenreError("Failed to load genres.");
      }
    };

    fetchGenres();
  }, []);


  // Fetch top genres for the artist entered by the user
  const fetchTopGenresByArtist = async (e) => {
    e.preventDefault();
    setArtistError("");
    setTopGenres([]);
    if (!selectedArtist.trim()) {
      setArtistError("Please enter an artist name.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/artists/${encodeURIComponent(selectedArtist)}/top-genres`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch top genres. Status: ${response.status}`);
      }
      const data = await response.json();
      setTopGenres(data.rows); // Use data.rows if the genres are inside rows
    } catch (error) {
      console.error("Error fetching top genres for artist:", error);
      setArtistError("Failed to load top genres for artist.");
    }
  };

  // Fetch tracks for clicked genre
  const fetchTracksForGenre = async (genreName) => {
    setClickedGenre(genreName);
    setGenreTracks([]);
    try {
      const response = await fetch(
        `http://localhost:8080/artists/${encodeURIComponent(selectedArtist)}/genres/${encodeURIComponent(genreName)}/tracks`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch tracks for genre. Status: ${response.status}`);
      }
      const data = await response.json();
      setGenreTracks(data.rows);
    } catch (error) {
      console.error("Error fetching tracks for genre:", error);
      setGenreError("Failed to load tracks for genre.");
    }
  };

  // Fetch random songs for Genre of the Day
  const fetchRandomSongs = async (e) => {
    e.preventDefault();
    setGenreError("");
    setRandomSongs([]);
    if (!selectedGenre.trim()) {
      setGenreError("Please select a genre.");
      return;
    }
    if (!numSongs || isNaN(numSongs) || numSongs > 10 || numSongs < 1) {
      setGenreError("Please enter a valid number of songs (1-10).");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/random-songs?genreName=${encodeURIComponent(selectedGenre)}&numSongs=${numSongs}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch random songs. Status: ${response.status}`);
      }
      const data = await response.json();
      setRandomSongs(data.rows);
    } catch (error) {
      console.error("Error fetching random songs:", error);
      setGenreError("Failed to load songs for the selected genre.");
    }
  };

  // Navigate back to the main menu
  const handleBackToMenu = () => {
    history.push("/"); // Navigate back to the main menu
  };

  return (
    <div>
      {/* Navigation Bar */}
      <div id="navbar">
        <ul>
          <li><a href="http://localhost:3000/">HomePage</a></li>
          <li><a href="http://localhost:3000/sound">Sound Lab</a></li>
          <li><a href="http://localhost:3000/search">Track Finder</a ></li>
          <li><a href="http://localhost:3000/collaboration">Collaboration</a></li>
        </ul>
      </div>

      {/* Page Wrapper */}
      <div id="page-wrapper">
        <section id="top-genres">
          <h2>🎤 Top Genres for Artist</h2>

          <form onSubmit={fetchTopGenresByArtist}>
            <input 
              type="text" 
              id="artist-input" 
              value={selectedArtist} 
              onChange={(e) => setSelectedArtist(e.target.value)} 
              placeholder="Enter artist name" 
            />
            <div id="artist-form-buttons">
              <button type="submit">Fetch Top Genres</button>
            </div>
          </form>

          {/* Display Artist Error Message */}
          {artistError && <div className="error-message">{artistError}</div>}

          {/* Display top genres */}
          {topGenres.length > 0 ? (
            <ul>
              {topGenres.map((genre, index) => (
                <li
                  key={index}
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => fetchTracksForGenre(genre.genre_name)}
                >
                  {genre.genre_name} ({genre.track_count} tracks)
                </li>
              ))}
            </ul>
          ) : (
            <div className="loading-message">No genres found for this artist.</div>
          )}

          {/* Display Tracks for Selected Genre */}
          {genreTracks.length > 0 && (
            <section id="genre-tracks">
              <h3>Tracks for Genre: {clickedGenre}</h3>
              <ul>
                {genreTracks.map((track, index) => (
                  <li key={index}>
                    <a
                      href={`http://${track.track_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {track.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
{/* Genre of the Day */}
<section id="genre-of-the-day">
  <h2 className="section-title">🎶 Genre of the Day</h2>
  <form className="genre-form" onSubmit={fetchRandomSongs}>
    <div className="genre-form-group">
      <select
        id="genre-select"
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
      >
        <option value="" disabled>
          Select a Genre
        </option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.genre}>
            {genre.genre}
          </option>
        ))}
      </select>
    </div>
    <div className="genre-form-group">
      <input
        type="number"
        id="num-songs-input"
        value={numSongs}
        onChange={(e) => setNumSongs(e.target.value)}
        placeholder="Number of Songs (max 10)"
      />
    </div>
    <button type="submit" className="fetch-songs-button">
      Fetch Songs
    </button>
  </form>
  {genreError && <div className="error-message">{genreError}</div>}
  {randomSongs.length > 0 && (
    <div id="random-songs-list">
      <p className="random-songs-message">
        🎵 These are your songs for today! You can go to Track Finder to listen to them!
      </p>
      <ul className="song-list">
        {randomSongs.map((song, index) => (
          <li key={index} className="song-item">
            <a
              href={`http://${song.track_url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="song-link"
            >
              {song.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )}
</section>

        {/* Back to Main Menu */}
        <div id="back-menu-wrapper">
          <button id="back-menu-button" onClick={handleBackToMenu}>
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}