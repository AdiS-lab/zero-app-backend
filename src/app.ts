import express from 'express';

import router from './app.router';

const app = express();

const unused = 'HELLO WORLD';

// middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(router);

app.get('/ping', function (req, res) {
  res.send('pong');
});

export default app;
