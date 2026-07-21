import express from 'express';

import router from './app.router';

const app = express();

const unused = 'HELLO WORLD';
const unused1 = 'HELLO WORLD';
const unused2 = 'HELLO WORLD';
const unused3 = 'HELLO WORLD';

// middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(router);

app.get('/ping', function (req, res) {
  res.send('pong');
});

export default app;
