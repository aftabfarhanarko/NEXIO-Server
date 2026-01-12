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
        console.log("User Data From Frontend:", data);

        // check user already exists
        const emailQuery = { email: data.email };
        const isExgised = await userData.findOne(emailQuery);

        if (isExgised) {
          return res.send({
            message: "This user already exists. Please login.",
          });
        }

        // password handling
        let hashedPassword = null;

        // 👉 only email/password users will get hashed password
        if (data.providerId !== "firebase" && data.password) {
          hashedPassword = await bcrypt.hash(data.password, 10);
        }

        // final user object
        const savedUser = {
          email: data.email,
          name: data.displayName || "No Name",
          photoURL: data.photoURL || "",
          role: "user",
          providerId: data.providerId || "typed",
          userCreatAt: data.userCreatAt || new Date(),
          password: hashedPassword,
        };

        console.log("Saved User:", savedUser);

        const result = await userData.insertOne(savedUser);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Server not working");
      }
    });

    // singleUser?email=${user?.email}
    app.get("/singleUser", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const result = await userData.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.get("/singleUserRole", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const result = await userData.findOne(query);
      console.log(result);
      res.send({ role: result.role });
    });

    // ALl User
    app.get("/userAll", async (req, res) => {
      const result = await userData.find().toArray();
      res.send(result);
    });

    app.patch("/updeatRole", async (req, res) => {
      try {
        const { role, id } = req.body;

        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { role: role },
        };

        const result = await userData.updateOne(filter, updateDoc);
        res.send({
          success: true,
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: "Role update failed",
        });
      }
    });
    // Api is Prosued

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
