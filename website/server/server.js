const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

//  Add more routes.
app.get('/albums', routes.getAllAlbums); // 
app.get('/artists', routes.getAllArtists); // 写了 yiting
app.get('/audio-features', routes.getAllAudioFeatures);
app.get('/genres', routes.getAllGenres); // 写了 yiting
app.get('/genres/:genre/tracks', routes.getTracksByGenre);  // 写了没成功 yiting
app.get('/genres-by-id', routes.getGenresByID);
app.get('/releases-by-id', routes.getReleasesByID); // 
app.get('/tracks-by-id', routes.getTracksByID); // 


app.get('/audio-feature-profiles', routes.getTopAudioFeatureProfiles); // 
app.get('/releases-with-multiple-authors', routes.getReleasesWithMultipleAuthors);


// Update speed
app.get('/tracks/rank-by-energy', routes.rankTracksByEnergy); //  jason改过
app.get('/tracks/above-average-danceability', routes.getTracksAboveAverageDanceability); // 
app.get('/tracks/ordered-by-release-date', routes.getSongsOrderedByReleaseDate); // 





app.get('/artists/:artistName/tracks', routes.getTracksByArtist); // 写了没成功 yiting

//app.get('/artists/:artistName/total-tracks', routes.getTotalTracksByArtist); 
app.get('/artists/:artistName/top-genres', routes.getTopGenresByTracksForArtist); //Kris用的
app.get('/random-songs', routes.getRandomSongsByUniqueGenres); // Kris 新加的
app.get('/artists/:artistName/genres/:genreName/tracks', routes.getTracksByArtistAndGenre); // Kris 新加的

app.get('/songs/mood', routes.getSongsByMood); // jason 新加的
app.get('/songs/audio-features', routes.getSongsByAudioFeatures); // jason 新加的

app.get('/genres-with-ids', routes.getAllGenresWithIds); // Kris 新加的

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
