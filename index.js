const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, MongoCursorInUseError, ObjectId } = require("mongodb");
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
    const reviewCollection = client.db("landryService").collection("reviews");
    //Add service api
    app.post("/services", async (req, res) => {
      const service = req.body;
      // users.push(user);
      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.send(result);
    });
    // Get service api
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).sort({ title: -1 });
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });
    //Review api
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
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
