import express from "express";
const app = express();
import router from './core/router'


app.get("/ping", function (req, res) {
  res.send("pong");
});

app.use('/api', router)

export default app;
