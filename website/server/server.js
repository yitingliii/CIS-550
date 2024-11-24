const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

//  Add more routes.
app.get('/albums', routes.getAllAlbums); // wrong
app.get('/artists', routes.getAllArtists); // wrong
app.get('/audio-features', routes.getAllAudioFeatures);
app.get('/genres', routes.getAllGenres);
app.get('/genres/:genre/tracks', routes.getTracksByGenre); // wrong
app.get('/genres-by-id', routes.getGenresByID);
app.get('/releases-by-id', routes.getReleasesByID); // wrong
app.get('/tracks-by-id', routes.getTracksByID); 
app.get('/artists/:artistName/tracks', routes.getTracksByArtist); 
app.get('/artists/:artistName/total-tracks', routes.getTotalTracksByArtist); 
app.get('/artists/:artistName/top-genres', routes.getTopGenresByTracksForArtist); 
app.get('/audio-feature-profiles', routes.getTopAudioFeatureProfiles);
app.get('/releases-with-multiple-authors', routes.getReleasesWithMultipleAuthors);
app.get('/tracks/rank-by-loudness', routes.rankTracksByLoudness);
app.get('/tracks/above-average-danceability', routes.getTracksAboveAverageDanceability);
app.get('/tracks/ordered-by-release-date', routes.getSongsOrderedByReleaseDate);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
