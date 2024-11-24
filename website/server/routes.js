const { Pool, types } = require('pg');
const config = require('./config.json')
types.setTypeParser(20, val => parseInt(val, 10)); 

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
// Test connection
connection.query('SELECT 1 AS result', (err, rows) => {
  if (err) {
      console.error('Database connection failed:', err.stack);
  } else {
      console.log('Database connection successful. Test query result:', rows);
  }
});


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
  console.log('Executing query:', query);
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
    WHERE bg.genre_name = '${genre}'
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
    getAllAlbums,
    getAllArtists,
    getAllAudioFeatures,
    getAllGenres,
    getTracksByGenre,
    getGenresByID,
    getReleasesByID,
    getTracksByID,
    getTracksByArtist,
    getTotalTracksByArtist,
    getTopGenresByTracksForArtist,
    getTopAudioFeatureProfiles,
    getReleasesWithMultipleAuthors,
    rankTracksByLoudness,
    getTracksAboveAverageDanceability,
    getSongsOrderedByReleaseDate,
};
