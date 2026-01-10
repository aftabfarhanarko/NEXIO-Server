const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const uri =
  "mongodb+srv://nexio-data:Rzqfzt5NiZeHzazd@clustermyfirstmongodbpr.2cecfoe.mongodb.net/?appName=ClusterMyFirstMongoDbProject";

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
    const appdata = allDB.collection("allApp");

    app.post("/users", async (req, res) => {
      try {
        const data = req.body;
        console.log("User Data From Frotedn", data);

        const email = { email: data.email };
        const isExgised = await userData.findOne(email);
        if (isExgised) {
          return res.send({
            message:
              "This User Data All ready Saved Data Baaase Please Login Now",
          });
        }

        const hashpassword = await bcrypt.hash(data.password, 10);
        const saved = {
          email: data.email,
          name: data.displayName,
          photoURL: data.photoURL,
          role: "user",
          userCreatAt: data.userCreatAt,
          password: hashpassword,
        };
        const result = await userData.insertOne(saved);
        console.log("Saved Data", result);

        res.send(result);
      } catch (err) {
        console.log(err);
        return res.send("Server not Wroking");
      }
    });

    app.get("/allapp", async (req, res) => {
      const { limit, skip } = req.query;
      const result = await appdata
        .find()
        .project()
        .limit(Number(limit))
        .skip(Number(skip))
        .toArray();
      const count = await appdata.countDocuments();
      res.send({ result, count });
    });

    app.get("/singleApp/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await appdata.findOne(query);
      res.send(result);
    });
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
