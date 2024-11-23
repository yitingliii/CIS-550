var config = require('./config.js');
var mysql = require('mysql');
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS
var connection = mysql.createPool(config);

const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* ---- (Dashboard) ---- */
// Route 1: Get all the albums
function getAllAlbums(req, res) {
  var query = `
    SELECT release_id AS ID, release_title AS Album, release_url AS URL
    FROM bp_release
    ORDER BY Album ASC;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving albums');
    } else {
      res.json(rows); 
    }
  });
}

// Route 2: Get all artist
function getAllArtists(req, res) {
  var query = `
    SELECT artist_id AS ID, artist_name AS Artist, artist_url AS URL
    FROM bp_artist
    ORDER BY Artist ASC;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving artists');
    } else {
      res.json(rows);
    }
  });
}

// Route 3: Get all audio features 
function getAllAudioFeatures(req, res) {
  var query = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'audio_features'
      AND ordinal_position > 1
    ORDER BY column_name ASC;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving audio features');
    } else {
      res.json(rows);
    }
  });
}
 // Route 4: Get all genres
 function getAllGenres(req, res) {
  var query = `
    SELECT genre_name AS Genre, genre_id AS ID
    FROM bp_genre
    ORDER BY genre_name ASC;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving genres');
    } else {
      res.json(rows);
    }
  });
}

// Route 5: Get tracks given specific genre
function getTracksByGenre(req, res) {
  const genre = req.params.genre; 

  var query = `
    SELECT bt.track_id, bt.title, bt.track_url, bt.release_date
    FROM bp_track bt
    JOIN bp_track_genre btg ON bt.track_id = btg.track_id
    JOIN bp_genre bg ON btg.genre_id = bg.genre_id
    WHERE bg.genre_name = ?
    ORDER BY bt.title;
  `;

  connection.query(query, [genre], function (err, rows, fields) {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving tracks for the specified genre');
    } else {
      res.json(rows);
    }
  });
}





// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllAlbums: getAllAlbums,
  getAllArtists: getAllArtists,
  getAllAudioFeatures: getAllAudioFeatures,
  getAllGenres: getAllGenres,

}