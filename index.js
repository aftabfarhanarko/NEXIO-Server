const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

/* =======================
   Middlewares
======================= */
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});





//    Server Start Time
app.listen(port, () => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString();

  console.log(`🚀 Server started successfully`);
  console.log(`📅 Date: ${date}`);
  console.log(`⏰ Time: ${time}`);
  console.log(`🌐 Running on: http://localhost:${port}`);
});
