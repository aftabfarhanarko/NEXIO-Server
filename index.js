import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

/* =======================
   Middlewares
======================= */
app.use(cors());
app.use(express.json());

/* =======================
   Routes
======================= */
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/hash-password", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    res.json({ hashedPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/compare-password", async (req, res) => {
  try {
    const { password, hashedPassword } = req.body;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    res.json({ match: isMatch });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =======================
   Server Start
======================= */
app.listen(process.env.PORT, () => {
  const now = new Date();

  console.log("🚀 Server started successfully");
  console.log(`📅 Date: ${now.toLocaleDateString()}`);
  console.log(`⏰ Time: ${now.toLocaleTimeString()}`);
  console.log(`🌐 Running on: http://localhost:${process.env.PORT}`);
});
