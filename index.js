require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wh888.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  // await client.connect();
  console.log("📍Database connection established");
  try {
    const db = client.db("dragon_news");
    const categoriesCollection = db.collection("categories");
    const newsCollection = db.collection("news");
    // get all news
    app.get("/all-news", async (req, res) => {
      const allNews = await newsCollection.find({}).toArray();
      res.send({ status: true, message: "success", data: allNews });
    });

    // get specific news
    app.get("/news/:id", async (req, res) => {
      const id = req.params.id;
      const news = await newsCollection.findOne({ _id: ObjectId(id) });
      res.send({ status: true, message: "success", data: news });
    });

    // get all categories
    app.get("/categories", async (req, res) => {
      const categories = await categoriesCollection.find({}).toArray();
      res.send({ status: true, message: "success", data: categories });
    });

    // get specific categories
    app.get("/news", async (req, res) => {
      const name = req.query.category;
      let newses = [];
      if (name == "all-news") {
        newses = await newsCollection.find({}).toArray();
        return res.send({ status: true, message: "success", data: newses });
      }
      newses = await newsCollection
        .find({ category: { $regex: name, $options: "i" } })
        .toArray();
      res.send({ status: true, message: "success", data: newses });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to the Dragon News Server!");
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
