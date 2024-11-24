//const { Pool, types } = require('pg');
//const config = require('./config.json')

//// Override the default parsing for BIGINT (PostgreSQL type ID 20)
//types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

//// Create PostgreSQL connection using database credentials provided in config.json
//// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
//const connection = new Pool({
//  host: config.rds_host,
//  user: config.rds_user,
//  password: config.rds_password,
//  port: config.rds_port,
//  database: config.rds_db,
//  ssl: {
//    rejectUnauthorized: false,
//  },
//});
//connection.connect((err) => err && console.log(err));

///******************
// * WARM UP ROUTES *
// ******************/

//// Route 1: GET /author/:type
//const author = async function(req, res) {
//  // TODO (TASK 1): replace the values of name and pennkey with your own
//  const name = 'Haorui Li';
//  const pennkey = 'haoruili';

//  // checks the value of type in the request parameters
//  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
//  if (req.params.type === 'name') {
//    // res.json returns data back to the requester via an HTTP response
//    res.json({ data: name });
//  } else if (req.params.type === 'pennkey') {
//    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back a JSON response with the pennkey
//    res.json({ data: pennkey });
//  } else {
//    res.status(400).json({});
//  }
//}

//// Route 2: GET /random
//const random = async function(req, res) {
//  // you can use a ternary operator to check the value of request query values
//  // which can be particularly useful for setting the default value of queries
//  // note if users do not provide a value for the query it will be undefined, which is falsey
//  const explicit = req.query.explicit === 'true' ? 1 : 0;

//  // Here is a complete example of how to query the database in JavaScript.
//  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
//  connection.query(`
//    SELECT *
//    FROM Songs
//    WHERE explicit <= ${explicit}
//    ORDER BY RANDOM()
//    LIMIT 1
//  `, (err, data) => {
//    if (err) {
//      // If there is an error for some reason, print the error message and
//      // return an empty object instead
//      console.log(err);
//      // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
//      // return type you may need to return an empty array [] instead.
//      res.json({});
//    } else {
//      // Here, we return results of the query as an object, keeping only relevant data
//      // being song_id and title which you will add. In this case, there is only one song
//      // so we just directly access the first element of the query results array (data.rows[0])

//      // TODO (TASK 3): also return the song title in the response
//      res.json({
//          song_id: data.rows[0].song_id,
//          title: data.rows[0].title
//      });
//    }
//  })
//}

///********************************
// * BASIC SONG/ALBUM INFO ROUTES *
// ********************************/

//// Route 3: GET /song/:song_id
//const song = async function (req, res) {
//    const song_id = req.params.song_id; // added

//  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
//  // Hint: unlike route 2, you can directly SELECT * and just return data.rows[0]
//  // Most of the code is already written for you, you just need to fill in the query
//    connection.query(`
//    SELECT song_id, album_id, title, number, duration, plays, danceability, energy, valence, 
//           tempo, key_mode, explicit
//    FROM Songs
//    WHERE song_id = $1
//  `, [song_id], (err, data) => { //[song_id] added
//    if (err) {
//      console.log(err);
//      res.json({});
//    } else {
//      res.json(data.rows[0]);
//    }
//  })
//}

//// Route 4: GET /album/:album_id
//const album = async function(req, res) {
//  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
//    // res.json({}); // replace this with your implementation

//    // Get album_id
//    const album_id = req.params.album_id;

//    // Query for all album info, based on album_id
//    connection.query(`
//    SELECT album_id, title, release_date, thumbnail_url
//    FROM Albums
//    WHERE album_id = $1
//  `, [album_id], (err, data) => {
//        // Use parameterized query to prevent SQL injection
//        if (err) {
//            console.log(err);
//            // return an empty object if sth wrong
//            res.json({});
//        } else {
//            res.json(data.rows[0]);
//        }
//    })
//}

//// Route 5: GET /albums
//const albums = async function(req, res) {
//  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
//  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
//  // res.json([]); // replace this with your implementation

//    connection.query(`
//    SELECT album_id, title, release_date, thumbnail_url
//    FROM Albums
//    ORDER BY release_date DESC
//    `, (err, data) => {
//        if (err) {
//            console.log(err);
//            res.json([]);
//        } else {
//            res.json(data.rows);
//            // Return all albums 
//            // as an array of objects
//        }
//    })
//}

//// Route 6: GET /album_songs/:album_id
//const album_songs = async function(req, res) {
//  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
//    // res.json([]); // replace this with your implementation

//    const { album_id } = req.params;

//    // Query for all songs from the specified album 
//    // ordered by track number (Ascending!)
//    connection.query(`
//    SELECT song_id, title, number, duration, plays
//    FROM Songs
//    WHERE album_id = $1
//    ORDER BY number ASC
//  `, [album_id], (err, data) => {
//        if (err) {
//            console.log(err);
//            res.json([]);
//        } else {
//            res.json(data.rows);
//            // Return all songs 
//            // as an array of objects
//        }
//    })
//}

///************************
// * ADVANCED INFO ROUTES *
// ************************/

//// Route 7: GET /top_songs
//const top_songs = async function (req, res) {
//    const page = req.query.page;
//    // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
//    // const pageSize = undefined;  // Correct! Yeah!
//    const pageSize = req.query.page_size ?? 10;

//    if (!page) {
//        // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
//        // Hint: you will need to use a JOIN to get the album title as well
//        // res.json([]); // replace this with your implementation    // Correct! Yeah!
//        connection.query(`
//      SELECT s.song_id, s.title, s.album_id, a.title AS album, s.plays
//      FROM Songs s
//      JOIN Albums a ON s.album_id = a.album_id
//      ORDER BY s.plays DESC
//    `, (err, data) => {
//            if (err) {
//                console.log(err);
//                res.json([]);
//            } else {
//                res.json(data.rows);
//            }
//        });
//    } else {
//        // TODO (TASK 10): reimplement TASK 9 with pagination
//        // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
//        // res.json([]); // replace this with your implementation // Cautin: offset produce rows starting from (offset+1)th row!
//        const offset = (page - 1) * pageSize;
//        connection.query(`
//      SELECT s.song_id, s.title, s.album_id, a.title AS album, s.plays
//      FROM Songs s
//      JOIN Albums a ON s.album_id = a.album_id
//      ORDER BY s.plays DESC
//      LIMIT $1 OFFSET $2
//     `, [pageSize, offset], (err, data) => {
//            if (err) {
//                console.log(err);
//                res.json([]);
//            } else {
//                res.json(data.rows);
//            }
//        })
//    }
//}

//// Route 8: GET /top_albums
//const top_albums = async function (req, res) {
//    // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
//    // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
//    // res.json([]); // replace this with your implementation
//    const page = req.query.page; // -------------------- START FROM HERE -----------------
//    const pageSize = req.query.page_size ?? 10;

//    if (!page) {
//        // Case 2: If page is not defined, return all albums ordered by total plays
//        connection.query(`
//            SELECT a.album_id, a.title, SUM(s.plays) AS plays
//            FROM Albums a
//            JOIN Songs s ON a.album_id = s.album_id
//            GROUP BY a.album_id
//            ORDER BY plays DESC
//        `, (err, data) => {
//            if (err) {
//                console.log(err);
//                res.json([]);
//            } else {
//                res.json(data.rows);
//            }
//        });
//    } else {
//        // Case 1: If page is defined, apply pagination
//        const offset = (page - 1) * pageSize;

//        connection.query(`
//            SELECT a.album_id, a.title, SUM(s.plays) AS plays
//            FROM Albums a
//            JOIN Songs s ON a.album_id = s.album_id
//            GROUP BY a.album_id
//            ORDER BY plays DESC
//            LIMIT $1 OFFSET $2
//        `, [pageSize, offset], (err, data) => {
//            if (err) {
//                console.log(err);
//                res.json([]);
//            } else {
//                res.json(data.rows);
//            }
//        })
//    }
//}

//// Route 9: GET /search_songs
//const search_songs = async function (req, res) {
//    // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
//    // Some default parameters have been provided for you, but you will need to fill in the rest
//    const title = req.query.title ?? '';  // Search query for song title
//    const durationLow = req.query.duration_low ?? 60;
//    const durationHigh = req.query.duration_high ?? 660;

//    // res.json([]); // replace this with your implementation    // --------- START FROM HERE --------

//    const playsLow = req.query.plays_low ?? 0;
//    const playsHigh = req.query.plays_high ?? 1100000000;
//    const danceabilityLow = req.query.danceability_low ?? 0;
//    const danceabilityHigh = req.query.danceability_high ?? 1;
//    const energyLow = req.query.energy_low ?? 0;
//    const energyHigh = req.query.energy_high ?? 1;
//    const valenceLow = req.query.valence_low ?? 0;
//    const valenceHigh = req.query.valence_high ?? 1;
//    const explicit = req.query.explicit;

//    let explicitFilter = '';
//    if (explicit !== 'true') {
//        explicitFilter = 'AND s.explicit = 0';
//    }

//    connection.query(`
//        SELECT s.song_id, s.album_id, s.title, s.number, s.duration, s.plays,
//               s.danceability, s.energy, s.valence, s.tempo, s.key_mode, s.explicit
//        FROM Songs s
//        WHERE s.title LIKE '%' || $1 || '%'
//        AND s.duration BETWEEN $2 AND $3
//        AND s.plays BETWEEN $4 AND $5
//        AND s.danceability BETWEEN $6 AND $7
//        AND s.energy BETWEEN $8 AND $9
//        AND s.valence BETWEEN $10 AND $11
//        ${explicitFilter}
//        ORDER BY s.title ASC
//    `, [title, durationLow, durationHigh, playsLow, playsHigh, danceabilityLow, danceabilityHigh, energyLow, energyHigh, valenceLow, valenceHigh], (err, data) => {
//        if (err) {
//            console.log(err);
//            res.json([]);
//        } else {
//            res.json(data.rows);
//        }
//    })
//}


//module.exports = {
//  author,
//  random,
//  song,
//  album,
//  albums,
//  album_songs,
//  top_songs,
//  top_albums,
//  search_songs,
//}


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

// Route 6: Get Genres Ordered by IDs
function getGenresByID(req, res) {
    var query = `
    SELECT genre_id AS ID, genre_name AS Genre
    FROM bp_genre
    ORDER BY genre_id ASC;
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


// Route 7: Get Releases Ordered by IDs
function getReleasesByID(req, res) {
    var query = `
    SELECT DISTINCT release_id AS ID, release_title AS Title
    FROM bp_release
    ORDER BY release_id ASC;
    `;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving releases');
        } else {
            res.json(rows);
        }
    });
}


// Route 8: Get Tracks Ordered by IDs
function getTracksByID(req, res) {
    var query = `
    SELECT DISTINCT track_id AS ID, title AS Title
    FROM bp_track
    ORDER BY track_id ASC;
    `;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving tracks');
        } else {
            res.json(rows);
        }
    });
}




// Route 9: Get Tracks by Artist
function getTracksByArtist(req, res) {
    const artistName = req.params.artistName;
    var query = `
    SELECT bt.track_id, bt.title, bt.release_date
    FROM bp_track bt
    JOIN bp_release br ON bt.release_id = br.release_id
    JOIN bp_artist_release bar ON br.release_id = bar.release_id
    JOIN bp_artist ba ON bar.artist_id = ba.artist_id
    WHERE ba.artist_name = ?
    ORDER BY bt.title;
    `;
    connection.query(query, [artistName], function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving tracks by artist');
        } else {
            res.json(rows);
        }
    });
}

// Route 10: Get Total Tracks by Artist
function getTotalTracksByArtist(req, res) {
    const artistName = req.params.artistName;
    var query = `
    SELECT
        COUNT(*) OVER() AS total_tracks,
        bt.track_id,
        bt.title,
        bt.release_date,
        ba.artist_name
    FROM bp_track bt
    JOIN bp_release br ON bt.release_id = br.release_id
    JOIN bp_artist_release bar ON br.release_id = bar.release_id
    JOIN bp_artist ba ON bar.artist_id = ba.artist_id
    WHERE ba.artist_name = ?;
    `;
    connection.query(query, [artistName], function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving total tracks by artist');
        } else {
            res.json(rows);
        }
    });
}

// Route 11: Get Top Genres by Tracks for an Artist
function getTopGenresByTracksForArtist(req, res) {
    const artistName = req.params.artistName;
    var query = `
    SELECT bg.genre_name, COUNT(bt.track_id) AS track_count
    FROM bp_artist ba
    JOIN bp_artist_release bar ON ba.artist_id = bar.artist_id
    JOIN bp_release br ON bar.release_id = br.release_id
    JOIN bp_track bt ON br.release_id = bt.release_id
    JOIN bp_track_genre btg ON bt.track_id = btg.track_id
    JOIN bp_genre bg ON btg.genre_id = bg.genre_id
    WHERE ba.artist_name = ?
    GROUP BY bg.genre_name
    ORDER BY track_count DESC;
    `;
    connection.query(query, [artistName], function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving top genres by tracks for artist');
        } else {
            res.json(rows);
        }
    });
}

// Route 12: Get Top Audio Feature Profiles in Each Genre
function getTopAudioFeatureProfiles(req, res) {
    var query = `
    WITH GenreAudioFeatures AS (
        SELECT bg.genre_name, af.valence, af.energy, af.danceability, COUNT(*) AS profile_count
        FROM bp_genre bg
        JOIN bp_track_genre btg ON bg.genre_id = btg.genre_id
        JOIN bp_track bt ON bt.track_id = btg.track_id
        JOIN bp_track_audio_features btaf ON bt.track_id = btaf.track_id
        JOIN audio_features af ON btaf.isrc = af.isrc
        GROUP BY bg.genre_name, af.valence, af.energy, af.danceability
    ),
    RankedProfiles AS (
        SELECT genre_name, valence, energy, danceability, profile_count,
        RANK() OVER (PARTITION BY genre_name ORDER BY profile_count DESC) AS rank
        FROM GenreAudioFeatures
    )
    SELECT genre_name, valence, energy, danceability, profile_count
    FROM RankedProfiles
    WHERE rank <= 3
    ORDER BY genre_name, profile_count DESC;
    `;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving top audio feature profiles');
        } else {
            res.json(rows);
        }
    });
}

// Route 13: Get Releases with Multiple Authors
function getReleasesWithMultipleAuthors(req, res) {
    var query = `
    SELECT br.release_id, br.release_title, artist_data.artist_count, artist_data.artist_names
    FROM bp_release br
    JOIN (
        SELECT bar.release_id,
               COUNT(bar.artist_id) AS artist_count,
               STRING_AGG(ba.artist_name, ',') AS artist_names
        FROM bp_artist_release bar
        JOIN bp_artist ba ON bar.artist_id = ba.artist_id
        GROUP BY bar.release_id
        HAVING COUNT(bar.artist_id) > 1
    ) AS artist_data ON br.release_id = artist_data.release_id;
    `;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving releases with multiple authors');
        } else {
            res.json(rows);
        }
    });
}

// Route 14: Rank Tracks by Loudness
function rankTracksByLoudness(req, res) {
    var query = `
    SELECT bt.track_id, bt.title, bg.genre_name, af.loudness,
           DENSE_RANK() OVER (PARTITION BY bg.genre_id ORDER BY af.loudness DESC) AS loudness_rank
    FROM bp_track bt
    JOIN bp_genre bg ON bt.genre_id = bg.genre_id
    JOIN audio_features af ON bt.isrc = af.isrc
    WHERE af.loudness IS NOT NULL;
    `;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error ranking tracks by loudness');
        } else {
            res.json(rows);
        }
    });
}

// Route 15: Get Tracks with Above-Average Danceability
function getTracksAboveAverageDanceability(req, res) {
    var query = `
    WITH avg_danceability_genre AS (
        SELECT bg.genre_id, AVG(af.danceability) AS avg_danceability
        FROM bp_track bt
        JOIN bp_genre bg ON bt.genre_id = bg.genre_id
        JOIN audio_features af ON bt.isrc = af.isrc
        GROUP BY bg.genre_id
    )
    SELECT bt.track_id, bt.title, bg.genre_name, af.danceability
    FROM bp_track bt
    JOIN bp_genre bg ON bt.genre_id = bg.genre_id
    JOIN audio_features af ON bt.isrc = af.isrc
    JOIN avg_danceability_genre adg ON bt.genre_id = adg.genre_id
    WHERE af.danceability > avg_danceability;
    `;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving tracks with above-average danceability');
        } else {
            res.json(rows);
        }
    });
}

// Route 16: Get Songs Ordered by Release Date
function getSongsOrderedByReleaseDate(req, res) {
    var query = `
    WITH all_tracks AS (
        SELECT DISTINCT t.track_id, t.title, t.release_id, t.genre_id, t.release_date
        FROM bp_track t
    )
    SELECT a.title, r.release_title AS album_name, a.release_date, g.genre_name
    FROM all_tracks a
    JOIN bp_release r ON a.release_id = r.release_id
    JOIN bp_genre g ON a.genre_id = g.genre_id
    ORDER BY a.release_date DESC;
    `;

    console.log('Executing query:', query); // Debugging log
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err.message); // Improved error handling
            res.status(500).json({ error: 'Failed to retrieve songs ordered by release date', details: err.message });
        } else if (rows.length === 0) {
            res.status(404).send('No songs found');
        } else {
            console.log('Rows returned:', rows.length); // Debugging log
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
    getTracksByGenre: getTracksByGenre,
    getGenresByID: getGenresByID,
    getReleasesByID: getReleasesByID,
    getTracksByID: getTracksByID,
    getTracksByArtist: getTracksByArtist,
    getTotalTracksByArtist: getTotalTracksByArtist,
    getTopGenresByTracksForArtist: getTopGenresByTracksForArtist,
    getTopAudioFeatureProfiles: getTopAudioFeatureProfiles,
    getReleasesWithMultipleAuthors: getReleasesWithMultipleAuthors,
    rankTracksByLoudness: rankTracksByLoudness,
    getTracksAboveAverageDanceability: getTracksAboveAverageDanceability,
    getSongsOrderedByReleaseDate: getSongsOrderedByReleaseDate,
};
