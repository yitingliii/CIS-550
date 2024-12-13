import React, { useState, useEffect } from "react";
import "../style/SearchPage.css";
import "../index.css";

// 改
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
      {/* 不要动 */}
      <div id="navbar">
        <ul>
          <li><a href="http://localhost:3000/">HomePage</a></li>
          <li>Sound Lab</li>
          <li>Genre</li>
          <li>Collaboration</li>
        </ul>
      </div>

    </div>
  );
}
