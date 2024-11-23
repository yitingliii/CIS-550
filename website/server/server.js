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

app.get('/tracks/genre/:genre', routes.getTracksByGenre);


