const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion } = require("mongodb");

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

const uri = process.env.DATABASE_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const allDB = client.db("nxieoData");
    const userData = allDB.collection("users");

    app.post("/users", async (req, res) => {
      try {
        const data = req.body;
        const email = { email: data.email };
        const isExgised = await userData.findOne(email);
        if (isExgised) {
          return res.send({
            message:
              "This User Data All ready Saved Data Baaase Please Login Now",
          });
        }

        const password = await bcrypt.hash(data.password, 10);
        const result = await userData.insertOne({ ...data, password });

        res.send(result);
      } catch (err) {
        console.log(err);
        return res.send("Server not Wroking");
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

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
