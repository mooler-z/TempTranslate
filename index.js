require('dotenv').config();
const cors = require('cors');
const express = require('express');

const translate = require('./routes/translate');
const question = require('./routes/question');
const transcribe = require('./routes/transcribe');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require('./utils/midMulter');


// Third-Party Middleware

app.use(cors());

// Built-In Middleware
let writeWave = require('./utils/writeWav');

// * Routes * //
app.use('/translate', translate);
app.use('/question', question);
app.use('/transcribe', multer.single('file'), writeWave, transcribe);

// * Start * //

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
