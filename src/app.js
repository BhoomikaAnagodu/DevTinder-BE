const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Server Started!");
});

app.get("/test", (req, res) => {
  res.send("Hello from the server..!");
});

app.get("/hello", (req, res) => {
  res.send("Bhoomika is here");
});

app.listen(port, () => {
  console.log(`Server running on port --- ${port}`);
});
