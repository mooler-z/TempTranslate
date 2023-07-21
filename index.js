require('dotenv').config();
const cors = require('cors');
const express = require('express');

const translate = require('./routes/translate');
const question = require('./routes/question');
const app = express();

// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// * Routes * //

app.use('/translate', translate);
app.use('/question', question);

// * Start * //

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
