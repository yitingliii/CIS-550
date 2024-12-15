import React, { useState, useEffect } from "react";
import "../style/SearchPage.css";
import "../index.css";

export default function SearchSong() {
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artistTracks, setArtistTracks] = useState([]); // State for artist tracks

  // Error states
  const [genreError, setGenreError] = useState("");
  const [artistError, setArtistError] = useState("");

  // States for searches
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreTerm, setGenreTerm] = useState("");
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
    setArtistTracks([]);
  
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
      // Get the actual track data from the nested rows
      const tracks = data.rows?.rows || [];
      setArtistTracks(tracks);
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
          <li><a href="http://localhost:3000/sound">Sound Lab</a></li>
          <li><a href="http://localhost:3000/genre">GenrePage</a></li>
          <li><a href="http://localhost:3000/collaboration">Collaboration</a></li>
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
              <option value="" disabled>Select a Genre</option>
              {Array.isArray(genres) &&
                genres.map((genre, index) => (
                  <option key={index} value={genre.genre_name}>
                    {genre.genre_name}
                  </option>
                ))}
            </select>

            <select
              id="genre-results-limit"
              value={genreTerm}
              onChange={(e) => setGenreTerm(e.target.value)}
            >
              <option value="" disabled>Select results limit</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
            </select>

            <div id="genre-form-buttons">
              <button type="submit">Search by Genre</button>
            </div>
          </form>
          {genreError && <div className="error-message">{genreError}</div>}
        </section>

        {/* Songs Table */}
        {songs.length > 0 && (
          <table className="results-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>URL</th>
                <th>Genre</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={index}>
                  <td>{song.title}</td>
                  <td>
                      {song.track_url ? (
                        <a
                          href={
                            song.track_url.startsWith("http")
                              ? song.track_url
                              : `https://${song.track_url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {song.track_url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  <td>{song.genre_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Section 2: Search by Artist */}
        <section id="search-artist">
          <h2>Search Songs by Artist</h2>
          <form onSubmit={handleSearchByArtist}>
            <select
              id="artist-select"
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
            >
              <option value="" disabled>Select an Artist</option>
              {Array.isArray(artists) &&
                artists.map((artist, index) => (
                  <option key={index} value={artist.artist_name}>
                    {artist.artist_name}
                  </option>
                ))}
            </select>

            <div id="artist-form-buttons">
              <button type="submit">Search by Artist</button>


            </div>
          </form>
          {artistError && <div className="error-message">{artistError}</div>}
        </section>

        {/* Artist Tracks Table */}
        {/* Artist Tracks Table */}
        {artistTracks.length > 0 && (
          <section id="artist-tracks">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Track URL</th>
                  <th>Artist URL</th>
                </tr>
              </thead>
              <tbody>
                {artistTracks.map((track, index) => (
                  <tr key={index}>
                    <td>{track.title || "N/A"}</td>
                    <td>
                      {track.track_url ? (
                        <a
                          href={
                            track.track_url.startsWith("http")
                              ? track.track_url
                              : `https://${track.track_url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {track.track_url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {track.artist_url ? (
                        <a
                          href={
                            track.artist_url.startsWith("http")
                              ? track.artist_url
                              : `https://${track.artist_url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {track.artist_url}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}


        

      </div>
    </div>
  );
}