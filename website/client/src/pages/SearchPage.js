import React, { useState } from "react";
// import NavBar from "../components/navbar"; 
import "../style/SearchPage.css";
import "../index.css";

export default function SearchSong() {
  const [term, setTerm] = useState("");
  const [songs, setSongs] = useState([]);
  const [numResults, setNumResults] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSongs([]);
    setNumResults(0);

    if (!term) {
      setError("Please enter a genre name.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/tracks/genre/${term}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data. Please check the genre name.");
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
      <div id = 'navbar'>
        <ul>
          <li><a href='http://localhost:3000/'>HomePage</a></li>
          <li>Sound Lab</li>
          <li>Genre</li>
          <li>Collaboration</li>
        </ul>
      </div> 

      <div id="page-wrapper">
		
        <p>page</p>
		





	    </div>
    </div>
  );
}
