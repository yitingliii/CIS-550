import React, { useState, useEffect } from 'react';
import '../style/SoundPage.css';

export default function MusicInsights() {
  const [danceabilityRows, setDanceabilityRows] = useState([]);
  const [energyRows, setEnergyRows] = useState([]);
  const [filteredEnergyRows, setFilteredEnergyRows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [topN, setTopN] = useState(5);
  const [moodRows, setMoodRows] = useState([]);
  const [filteredMoodRows, setFilteredMoodRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedMood, setSelectedMood] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [instrumentalness, setInstrumentalness] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [valence, setValence] = useState(0);
  const [liveness, setLiveness] = useState(0);
  const [acousticness, setAcousticness] = useState(0);
  const [songs, setSongs] = useState([]);
  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors

      const queryParams = new URLSearchParams({
        instrumentalness: instrumentalness > 0 ? instrumentalness : undefined,
        energy: energy > 0 ? energy : undefined,
        valence: valence > 0 ? valence : undefined,
        liveness: liveness > 0 ? liveness : undefined,
        acousticness: acousticness > 0 ? acousticness : undefined,
      });

      const response = await fetch(
        `http://localhost:8080/songs/audio-features?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch songs. Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.rows && data.rows.length > 0) {
        setSongs(data.rows); // Use the `rows` property directly
      } else {
        setSongs([]); // Clear results if no rows found
        setError("No songs found matching the specified criteria.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch songs. Please try again later.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const clearFilters = () => {
    setInstrumentalness(0);
    setEnergy(0);
    setValence(0);
    setLiveness(0);
    setAcousticness(0);
    setSongs([]);
    setError("");
  };




  useEffect(() => {
    fetchDanceabilityData();
    fetchEnergyData();
    fetchSongsByMood();
  }, []);

  const fetchDanceabilityData = async () => {
    try {
      const response = await fetch("http://localhost:8080/tracks/above-average-danceability");
      if (!response.ok) throw new Error(`Failed to fetch danceability data. Status: ${response.status}`);
      const data = await response.json();

      const randomRows = data.rows.sort(() => 0.5 - Math.random()).slice(0, 5);
      setDanceabilityRows(randomRows);
    } catch (err) {
      console.error(err);
      setError("Failed to load danceability data.");
    }
  };

  const fetchEnergyData = async () => {
    try {
      const response = await fetch("http://localhost:8080/tracks/rank-by-energy");
      if (!response.ok) throw new Error(`Failed to fetch energy data. Status: ${response.status}`);
      const data = await response.json();

      setEnergyRows(data.rows || []);
      setFilteredEnergyRows(applyFilters(data.rows || [], selectedGenre, topN));

      const uniqueGenres = Array.from(new Set(data.rows.map((row) => row.genre_name)));
      setGenres(["All", ...uniqueGenres]);
    } catch (err) {
      console.error(err);
      setError("Failed to load energy data.");
    }
  };

  const fetchSongsByMood = async () => {
    try {
      const response = await fetch("http://localhost:8080/songs/mood");
      if (!response.ok) throw new Error(`Failed to fetch songs by mood. Status: ${response.status}`);
      const data = await response.json();
      setMoodRows(data || []);
      setFilteredMoodRows(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load songs by mood.");
    }
  };

  const handleGenreChange = (event) => {
    const genre = event.target.value;
    setSelectedGenre(genre);
    setFilteredEnergyRows(applyFilters(energyRows, genre, topN));
  };

  const handleTopNChange = (event) => {
    const n = parseInt(event.target.value, 10);
    setTopN(n);
    setFilteredEnergyRows(applyFilters(energyRows, selectedGenre, n));
  };

  const applyFilters = (rows, genre, n) => {
    let filtered = rows;

    if (genre !== "All") {
      filtered = rows.filter((row) => row.genre_name === genre);
    }

    return filtered.sort((a, b) => b.energy - a.energy).slice(0, n);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedRows = filteredMoodRows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredMoodRows.length / rowsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleMoodChange = (event) => {
    const mood = event.target.value;
    setSelectedMood(mood);
    setCurrentPage(1);

    if (mood === "All") {
      setFilteredMoodRows(moodRows);
    } else {
      const filtered = moodRows.filter((row) => row.mood === mood);
      setFilteredMoodRows(filtered);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
  return (
    <>
      <div id="sound-page-wrapper">
        <div id="navbar">
          <ul>
            <li><a href="/">HomePage</a></li>
            <li><a href="/search">Search Page</a></li>
            <li><a href="/genre">Genre Page</a></li>
            <li><a href="/collaboration">Collaboration</a></li>
          </ul>
        </div>
        <h1>Track Explorer</h1>
        <div id="page-wrapper">
          <div id="content-wrapper">
            {/* Left Panel */}
            <div className="panel">
            {/* Danceability Table */}
            <section className="table-section">
                <h2>Wanna Dance?</h2>
                {error ? (
                  <div className="error-message">{error}</div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Track Title</th>
                          <th>Genre</th>
                          <th>Danceability</th>
                        </tr>
                      </thead>
                      <tbody>
                        {danceabilityRows.length > 0 ? (
                          danceabilityRows.map((row, index) => (
                            <tr key={index}>
                              <td>{row.title}</td>
                              <td>{row.genre_name}</td>
                              <td>{row.danceability}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3">No data available.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <button className="refresh-button" onClick={fetchDanceabilityData}>
                      Refresh
                    </button>
                  </>
                )}
              </section>
     {/* Energy Table */}
     <section className="table-section">
                <h2>Hit The Gym!</h2>
                <div className="controls">
                  <label htmlFor="genreFilter">Select Genre: </label>
                  <select id="genreFilter" value={selectedGenre} onChange={handleGenreChange}>
                    {genres.map((genre, index) => (
                      <option key={index} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>

                  <div className="rows-per-page">
                    <label htmlFor="topN">Top Songs:</label>
                    <select id="topN" value={topN} onChange={handleTopNChange}>
                      <option value={1}>1</option>
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                </div>
                {error ? (
                  <div className="error-message">{error}</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Track Title</th>
                        <th>Genre</th>
                        <th>Energy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnergyRows.length > 0 ? (
                        filteredEnergyRows.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{row.title}</td>
                            <td>{row.genre_name}</td>
                            <td>{row.energy}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No data available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </section>
            </div>

            {/* Right Panel */}
            <div className="panel">
               {/* Songs by Mood Table */}
               <section className="table-section">
                <h2>How Are You Feeling?</h2>
                <div className="controls">
                  <label htmlFor="moodFilter">Filter by Mood: </label>
                  <select id="moodFilter" value={selectedMood} onChange={handleMoodChange}>
                    <option value="All">All</option>
                    <option value="Upbeat">Upbeat</option>
                    <option value="Melancholic">Melancholic</option>
                    <option value="Energetic">Energetic</option>
                    <option value="Calm">Calm</option>
                  </select>
                  <div className="rows-per-page">
                    <label htmlFor="rowsPerPage">Rows per page:</label>
                    <select id="rowsPerPage" value={rowsPerPage} onChange={handleRowsPerPageChange}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                    </select>
                  </div>
                </div>
                {filteredMoodRows.length === 0 && !error ? (
                  <div className="info-message">No songs available for the selected mood.</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : (
                  <>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Track Title</th>
                          <th>Valence</th>
                          <th>Energy</th>
                          <th>Mood</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedRows.map((row, index) => (
                          <tr key={index}>
                            <td>{row.title || "Unknown Title"}</td>
                            <td>{row.valence !== undefined ? row.valence.toFixed(3) : "N/A"}</td>
                            <td>{row.energy !== undefined ? row.energy.toFixed(3) : "N/A"}</td>
                            <td>{row.mood || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="pagination-controls">
                      <button disabled={currentPage === 1} onClick={handlePreviousPage}>
                        Previous
                      </button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button disabled={currentPage === totalPages} onClick={handleNextPage}>
                        Next
                      </button>
                    </div>
                  </>
                )}
              </section>
              <div className="table-section audio-feature-table">
  <header>
    <h2>It's Your Studio!</h2>
    <p>Use the text boxes below to filter songs based on their audio feature values.</p>
  </header>

  {/* Text Boxes for Filtering */}
  <div className="filter-container">
    <div className="filter-item">
      <label htmlFor="instrumentalness">Instrumentalness:</label>
      <input
        id="instrumentalness"
        type="number"
        min="0"
        max="1"
        step="0.01"
        value={instrumentalness}
        onChange={(e) => setInstrumentalness(parseFloat(e.target.value) || 0)}
      />
    </div>
    <div className="filter-item">
      <label htmlFor="energy">Energy:</label>
      <input
        id="energy"
        type="number"
        min="0"
        max="1"
        step="0.01"
        value={energy}
        onChange={(e) => setEnergy(parseFloat(e.target.value) || 0)}
      />
    </div>
    <div className="filter-item">
      <label htmlFor="valence">Valence:</label>
      <input
        id="valence"
        type="number"
        min="0"
        max="1"
        step="0.01"
        value={valence}
        onChange={(e) => setValence(parseFloat(e.target.value) || 0)}
      />
    </div>
    <div className="filter-item">
      <label htmlFor="liveness">Liveness:</label>
      <input
        id="liveness"
        type="number"
        min="0"
        max="1"
        step="0.01"
        value={liveness}
        onChange={(e) => setLiveness(parseFloat(e.target.value) || 0)}
      />
    </div>
    <div className="filter-item">
      <label htmlFor="acousticness">Acousticness:</label>
      <input
        id="acousticness"
        type="number"
        min="0"
        max="1"
        step="0.01"
        value={acousticness}
        onChange={(e) => setAcousticness(parseFloat(e.target.value) || 0)}
      />
    </div>
  </div>

  {/* Buttons for Filtering */}
  <div style={{ margin: "20px 0", textAlign: "center" }}>
    <button onClick={fetchSongs} style={{ marginRight: "10px" }}>
      {loading ? "Loading..." : "Search Songs"}
    </button>
    <button onClick={clearFilters} disabled={loading}>
      Clear Filters
    </button>
  </div>

  {/* Results Table */}
  <div className="results">
    {error ? (
      <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
    ) : songs.length > 0 ? (
      <table className="audio-feature-results">
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index}>
              <td>{song.title}</td>
              <td>
                {song.url ? (
                    <a
                    href={`http://${song.url.startsWith("http") ? song.url.slice(7) : song.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Listen
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      !loading && <p>No songs to display. Adjust your filters and try again.</p>
    )}
  </div>
</div>



            </div>
          </div>
        </div>
      </div>
    </>
  );
}