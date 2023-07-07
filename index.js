require('dotenv').config()
import cors from 'cors';
import express from 'express';

import routes from './routes';

const app = express();

// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// * Routes * //

app.use("/", (req, res, next) => res.status(200).json({ message: "WORKING" }))
app.use('/translate', routes.translate);

// * Start * //

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);
