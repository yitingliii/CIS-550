import React, { useState, useEffect } from "react";
import "../style/Collaboration.css"; // Scoped styles for this page

export default function CollaborativeReleases() {
  const [collaborations, setCollaborations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minArtists, setMinArtists] = useState(2);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]); // State for favorites

  // Fetch data from API
  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const response = await fetch("http://localhost:8080/releases-with-multiple-authors");
        if (!response.ok) {
          throw new Error(`Failed to fetch collaborations: ${response.status}`);
        }
        const data = await response.json();
        setCollaborations(data.rows || []); // Use data.rows if API returns a nested structure
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching collaborations:", error);
        setError("Failed to load collaborations. Please try again later.");
      }
    };

    fetchCollaborations();
  }, []);

  // Filter data
  const filteredCollaborations = collaborations.filter(
    (collab) =>
      collab.artist_count >= minArtists &&
      (collab.release_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collab.artist_names?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Toggle favorite status
  const toggleFavorite = (collab) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((favorite) => favorite.release_id === collab.release_id)) {
        return prevFavorites.filter((favorite) => favorite.release_id !== collab.release_id);
      } else {
        return [...prevFavorites, collab];
      }
    });
  };

  return (
    <>
      {/* Navigation Bar */}
      <div id="navbar">
        <ul>
          <li><a href="http://localhost:3000/">HomePage</a></li>
          <li><a href="http://localhost:3000/search">Search Page</a></li>
          <li><a href="http://localhost:3000/genre">Genre Page</a></li>
          <li><a href="http://localhost:3000/sound">Sound Lab</a></li>
        </ul>
      </div>

      <div id="collaborative-releases-page">
        <header>
          <h1>Collaborative Music</h1>

        </header>

        {/* Filters Section */}
        <div id="filters">
          <input
            type="text"
            placeholder="Search by title or artist"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="number"
            min="2"
            placeholder="Minimum Artists"
            value={minArtists}
            onChange={(e) => setMinArtists(Number(e.target.value))}
          />
        </div>

        {/* Favorites Section */}
        <div id="favorites-section">
          <h2>Favorites</h2>
          {favorites.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Release Title</th>
                  <th>Number of Collaborators</th>
                  <th>Artists</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((favorite) => (
                  <tr key={favorite.release_id}>
                    <td>{favorite.release_title || "N/A"}</td>
                    <td>{favorite.artist_count || "N/A"}</td>
                    <td>{favorite.artist_names || "N/A"}</td>
                    <td>
                      <button onClick={() => toggleFavorite(favorite)}>
                        Remove from Favorites
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No favorite collaborations added yet.</p>
          )}
        </div>

        {/* Table Section */}
        <div id="table-container">
          {error ? (
            <div className="error-message">{error}</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Release Title</th>
                  <th>Number of Collaborators</th>
                  <th>Artists</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCollaborations.length > 0 ? (
                  filteredCollaborations.map((collab) => (
                    <tr key={collab.release_id}>
                      <td>{collab.release_title || "N/A"}</td>
                      <td>{collab.artist_count || "N/A"}</td>
                      <td>{collab.artist_names || "N/A"}</td>
                      <td>
                        <button onClick={() => toggleFavorite(collab)}>
                          {favorites.some((favorite) => favorite.release_id === collab.release_id)
                            ? "Remove from Favorites"
                            : "Add to Favorites"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No collaborations found matching the criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
