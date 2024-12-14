import React from 'react';
import '../index.css';
import '../style/HomePage.css';
import { Link } from 'react-router-dom';




export default function HomePage() {
    console.log('Rendering HomePage');
    return (
      <div id="main_content">
        <div id="column_one">
        <Link to="/search" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="options" id="recommendation">
            <h2>Track Finder</h2>
        </div>
        </Link>
  
          <a href="/genre" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="options" id="search">
              <h2>Genre Explorer</h2>
            </div>
          </a>
        </div>
  
        <div id="title">
          <h1>Welcome to Song Search!</h1>
        </div>
  
        <div id="column_two">
          <a href="/sound" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="options">
              <h2>The Sound Lab</h2>
            </div>
          </a>
  
          <div className="options" id="tbd">
          <a href="/collaboration" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>Collaborative Creations</h2>
          </a>
          </div>
        </div>

      </div>
    );
  }