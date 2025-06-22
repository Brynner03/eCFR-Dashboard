const express = require("express");
const app = express();
const cors = require("cors");
const { seed } = require("./seed");

const port = process.env.PORT || 3000;

seed();
app.use(cors());
app.use(express.json());

// API Routes

app.get("/", (req, res) => res.json({ message: "Server Works" }));

module.exports = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
