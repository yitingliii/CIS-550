import React, { useState, useEffect } from "react";
import "../style/SearchPage.css";
import "../index.css";

export default function SearchSong() {
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);

  // Error states for each section
  const [genreError, setGenreError] = useState("");
  const [artistError, setArtistError] = useState("");

  // States for Genre Search
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreTerm, setGenreTerm] = useState("");

  // State for Artist Search
  const [selectedArtist, setSelectedArtist] = useState("");

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("http://localhost:8080/genres");
        if (!response.ok) {
          throw new Error(`Failed to fetch genres. Status: ${response.status}`);
        }
        const data = await response.json();
        setGenres(data.rows); // Assuming genres are in `rows`
      } catch (error) {
        console.error("Error fetching genres:", error);
        setGenreError("Failed to load genres.");
      }
    };

    fetchGenres();
  }, []);

  // Fetch artists on mount
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch("http://localhost:8080/artists");
        if (!response.ok) {
          throw new Error(`Failed to fetch artists. Status: ${response.status}`);
        }
        const data = await response.json();

        // Assuming artists are in `rows`
        if (Array.isArray(data.rows)) {
          setArtists(data.rows);
        } else {
          throw new Error("Invalid response structure: Expected 'rows' to be an array");
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
        setArtistError("Failed to load artists.");
      }
    };

    fetchArtists();
  }, []);

  const handleSearchByGenre = async (e) => {
    e.preventDefault();
    setGenreError("");
    setSongs([]);
    if (!selectedGenre) {
      setGenreError("Please select a genre.");
      return;
    }
  
    if (!genreTerm) {
      setGenreError("Please select a results limit.");
      return;
    }

    try {
      const encodedGenre = encodeURIComponent(selectedGenre);
      const response = await fetch(
        `http://localhost:8080/genres/${encodedGenre}/tracks?limit=${genreTerm}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch songs by genre. Status: ${response.status}`);
      }
      const data = await response.json();
      setSongs(data); // Assuming data is an array of songs
    } catch (error) {
      console.error("Error fetching songs by genre:", error);
      setGenreError("Failed to load songs by genre.");
    }
  };

  const handleSearchByArtist = async (e) => {
    e.preventDefault();
    setArtistError("");
    setSongs([]);
    if (!selectedArtist) {
      setArtistError("Please select an artist.");
      return;
    }

    try {
      const encodedArtist = encodeURIComponent(selectedArtist);
      const response = await fetch(
        `http://localhost:8080/artists/${encodedArtist}/tracks`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch songs by artist. Status: ${response.status}`);
      }
      const data = await response.json();
      setSongs(data); // Assuming data is an array of songs
    } catch (error) {
      console.error("Error fetching songs by artist:", error);
      setArtistError("Failed to load songs by artist.");
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
        {/* Section 1: Search by Genre */}
        <section id="search-genre">
          <h2>Search Songs by Genre</h2>
          <form onSubmit={handleSearchByGenre}>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="" disabled>
                Select a Genre
              </option>
              {Array.isArray(genres) &&
                genres.map((genre) => (
                  <option key={genre.id} value={genre.genre}>
                    {genre.genre}
                  </option>
                ))}
            </select>

            <select
              id="genre-results-limit"
              value={genreTerm}
              onChange={(e) => setGenreTerm(e.target.value)}
            >
              <option value="" disabled>
                Select results limit
              </option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <div id="genre-form-buttons">
              <button type="submit">Search by Genre</button>
            </div>
          </form>
          {/* Display Genre Error Message */}
          {genreError && <div className="error-message">{genreError}</div>}
        </section>

        {/* Section 2: Search by Artist */}
        <section id="search-artist">
          <h2>Search Songs by Artist</h2>
          <form onSubmit={handleSearchByArtist}>
            <select
              id="artist-select"
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
            >
              <option value="" disabled>
                Select an Artist
              </option>
              {Array.isArray(artists) &&
                artists.map((artist) => (
                  <option key={artist.id} value={artist.artist}>
                    {artist.artist}
                  </option>
                ))}
            </select>

            <div id="artist-form-buttons">
              <button type="submit">Search by Artist</button>
            </div>
          </form>
          {/* Display Artist Error Message */}
          {artistError && <div className="error-message">{artistError}</div>}
        </section>

        {/* Songs Table */}
        {songs.length > 0 && (
          <table className="results-table">
            <thead>
              <tr>
                <th>Track ID</th>
                <th>Title</th>
                <th>URL</th>
                <th>Release Date</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
