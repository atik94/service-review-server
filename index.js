const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z8kj7tg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("landryService").collection("services");
    // app.post("/services", async (req, res) => {
    //   const service = req.body;
    //   console.log(service);
    //   const result = await serviceCollection.insertOne(service);
    //   res.send(result);
    // });

    app.post("/services", async (req, res) => {
      const service = req.body;
      // users.push(user);
      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.send(result);
      //user._id = result.insertedId;
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("service review server is running");
});

app.listen(port, () => {
  console.log(`service review server running on port ${port}`);
});
