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
    LIMIT 100;
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
    SELECT distinct artist_name
    FROM bp_track bt
    JOIN bp_release br ON bt.release_id = br.release_id
    JOIN bp_artist_release bar ON br.release_id = bar.release_id
   JOIN bp_artist ba ON bar.artist_id = ba.artist_id
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
    SELECT *
    FROM feature_names;
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
    SELECT genre_name
    FROM bp_genre;
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
    const limit = parseInt(req.query.limit) || 100;
  
    const query = `
    SELECT title, track_url, genre_name
    FROM bp_track bt
    JOIN bp_track_genre btg ON bt.track_id = btg.track_id
    JOIN bp_genre bg ON btg.genre_id = bg.genre_id
    WHERE bg.genre_name = $1
    ORDER BY bt.title
    LIMIT $2;
  `;
  
    console.log('Executing query with genre:', genre);
  
    connection.query(query, [genre, limit], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Failed to fetch tracks by genre.');
      }
      res.json(result.rows);
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
    ORDER BY release_id ASC
    Limit 100;
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
    ORDER BY track_id ASC
    LIMIT 100;
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
    SELECT title, track_url, artist_url
    FROM bp_track bt
    JOIN bp_release br ON bt.release_id = br.release_id
    JOIN bp_artist_release bar ON br.release_id = bar.release_id
    JOIN bp_artist ba ON bar.artist_id = ba.artist_id
    WHERE ba.artist_name = $1;
    `;
    connection.query(query, [artistName], function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err.stack); // Log error stack
            res.status(500).send('Error retrieving tracks by artist');
        } else {
            console.log('Query executed successfully. Rows:', rows); // Log results
            res.json({ rows });
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
  WHERE ba.artist_name ILIKE '%' || $1 || '%'
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
    ORDER BY genre_name, profile_count DESC
    Limit 10;
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
               STRING_AGG(ba.artist_name, ', ') AS artist_names
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
function rankTracksByEnergy(req, res) {
    var query = `
    SELECT bt.track_id, bt.title, bg.genre_name, af.energy,
           DENSE_RANK() OVER (PARTITION BY bg.genre_id ORDER BY af.loudness DESC) AS loudness_rank
    FROM bp_track bt
    JOIN bp_genre bg ON bt.genre_id = bg.genre_id
    JOIN audio_features af ON bt.isrc = af.isrc
    WHERE af.energy IS NOT NULL
    `; //jason改过 limit 10删了
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error ranking tracks by energy');
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
    WHERE af.danceability > avg_danceability
    LIMIT 100; 
    `;//jason改过 
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
    ORDER BY a.release_date DESC
    LIMIT 10;
    `;

    console.log('Executing query:', query); 
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err.message); 
            res.status(500).json({ error: 'Failed to retrieve songs ordered by release date', details: err.message });
        } else if (rows.length === 0) {
            res.status(404).send('No songs found');
        } else {
            console.log('Rows returned:', rows.length); 
            res.json(rows);
        }
    });
}
// Route 17: Get Random Songs from Unique Genres
function getRandomSongsByUniqueGenres(req, res) {
    const genreName = req.query.genreName; // Genre selected by the user
    const numSongs = parseInt(req.query.numSongs) || 5; // Default to 5 if not specified

    if (!genreName || numSongs > 10) {
        return res.status(400).send('Invalid genre or number of songs exceeds the limit (10)');
    }

    var query = `
    WITH RandomSongs AS (
      SELECT
          bt.track_id,
          bt.title,
          bg.genre_name,
          track_url,
          ROW_NUMBER() OVER (PARTITION BY bg.genre_id ORDER BY RANDOM()) AS row_num
      FROM bp_track bt
      JOIN bp_track_genre btg ON bt.track_id = btg.track_id
      JOIN bp_genre bg ON btg.genre_id = bg.genre_id
      WHERE bg.genre_name = $1
    )
    SELECT track_id, title, track_url
    FROM RandomSongs
    WHERE row_num <= $2;
    `;

    console.log('Executing query with genre:', genreName, 'and limit:', numSongs);

    connection.query(query, [genreName, numSongs], function (err, rows) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving random songs from the selected genre');
        } else if (rows.length === 0) {
            res.status(404).send('No songs found for the specified genre');
        } else {
            res.json(rows);
        }
    });
}//Kris 加的

//Route 18: Get tracks by artist and genre
function getTracksByArtistAndGenre(req, res) {
    const artistName = req.params.artistName;
    const genreName = req.params.genreName;
  
    const query = `
    SELECT bt.track_id, bt.title, bt.track_url
FROM bp_track bt
WHERE EXISTS (
  SELECT 1
  FROM bp_artist ba
  JOIN bp_artist_release bar ON ba.artist_id = bar.artist_id
  JOIN bp_release br ON bar.release_id = br.release_id
  JOIN bp_track_genre btg ON bt.track_id = btg.track_id
  JOIN bp_genre bg ON btg.genre_id = bg.genre_id
  WHERE ba.artist_name ILIKE '%' || $1 || '%'
    AND bg.genre_name = $2
    AND bt.release_id = br.release_id
)
    `;
  
    connection.query(query, [artistName, genreName], (err, rows) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Error retrieving tracks for artist and genre");
      } else if (rows.length === 0) {
        res.status(404).send("No tracks found for the specified artist and genre");
      } else {
        res.json(rows);
      }
    });
  }// Kris 加的


// Route 19: get song and mood based on audio features
function getSongsByMood(req, res) {
    const query = `
        SELECT 
            af.isrc AS song_id,
            bt.title AS title,
            af.valence AS valence,
            af.energy AS energy,
            CASE 
                WHEN af.valence > 0.5 AND af.energy > 0.5 THEN 'Upbeat'
                WHEN af.valence <= 0.5 AND af.energy <= 0.5 THEN 'Melancholic'
                WHEN af.energy > 0.5 THEN 'Energetic'
                ELSE 'Calm'
            END AS mood
        FROM audio_features af
        JOIN bp_track bt ON af.isrc = bt.isrc

    `;

    connection.query(query, (err, data) => {
        if (err) {
            console.error(err);
            res.json([]);
        } else {
            res.json(data.rows);
        }
    });
} //jason 加的

// Route 20: Get songs by specific audio feature values
function getSongsByAudioFeatures(req, res) {
    const {
        instrumentalness,
        energy,
        valence,
        liveness,
        acousticness,
    } = req.query;

    const filters = [];
    const params = [];

    if (instrumentalness) {
        filters.push('af.instrumentalness >= $' + (filters.length + 1));
        params.push(parseFloat(instrumentalness));
    }
    if (energy) {
        filters.push('af.energy >= $' + (filters.length + 1));
        params.push(parseFloat(energy));
    }
    if (valence) {
        filters.push('af.valence >= $' + (filters.length + 1));
        params.push(parseFloat(valence));
    }
    if (liveness) {
        filters.push('af.liveness >= $' + (filters.length + 1));
        params.push(parseFloat(liveness));
    }
    if (acousticness) {
        filters.push('af.acousticness >= $' + (filters.length + 1));
        params.push(parseFloat(acousticness));
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
        SELECT 
            bt.track_id AS id,
            bt.title AS title,
            bt.track_url AS url,
            af.instrumentalness,
            af.energy,
            af.valence,
            af.liveness,
            af.acousticness
        FROM audio_features af
        JOIN bp_track bt ON af.isrc = bt.isrc
        ${whereClause}
        limit 10
    `;

    console.log('Executing query:', query, 'with params:', params);

    connection.query(query, params, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving songs by audio features');
        } else if (rows.length === 0) {
            res.status(404).send('No songs found matching the specified audio features');
        } else {
            res.json(rows);
        }
    });
}
//jason 加的

// Route 21: Get Collaborations Between Artists and Shared Releases
function getCollaborativeReleases(req, res) {
    var query = `
    SELECT
        a1.artist_name AS artist,
        a2.artist_name AS collaborator,
        r.release_title AS release
    FROM
        bp_artist_release ar1
    JOIN
        bp_artist_release ar2
        ON ar1.release_id = ar2.release_id AND ar1.artist_id != ar2.artist_id
    JOIN
        bp_artist a1
        ON ar1.artist_id = a1.artist_id
    JOIN
        bp_artist a2
        ON ar2.artist_id = a2.artist_id
    JOIN
        bp_release r
        ON ar1.release_id = r.release_id
    WHERE
        a1.artist_name = 'Taylor Swift'
    ORDER BY
        collaborator, release;
    `;

    console.log('Executing query:', query);

    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving collaborative releases');
        } else {
            res.json(rows);
        }
    });
}// Haorui 新加的

// Route 21: Get all genres with their IDs
function getAllGenresWithIds(req, res) {
    var query = `
    SELECT genre_name AS Genre, genre_id AS ID
    FROM bp_genre
    ORDER BY ID;
  `;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error retrieving genres');
        } else {
            res.json(rows);
        }
    });
}// Kris 新加的


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
    rankTracksByEnergy,
    getTracksAboveAverageDanceability,
    getSongsOrderedByReleaseDate,
    getRandomSongsByUniqueGenres,
    getTracksByArtistAndGenre,
    getSongsByMood,
    getSongsByAudioFeatures,
    getCollaborativeReleases,
    getAllGenresWithIds
};
