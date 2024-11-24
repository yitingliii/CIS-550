const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get('/genres', routes.getAllGenres);
app.get('/tracks/genre/:genre', routes.getTracksByGenre);
app.get('/albums', getAllAlbums);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
