const express = require("express");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();
const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oli9n.mongodb.net/${process.env.DB_DATA_BASE}?retryWrites=true&w=majority`;
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  console.log(err);
  const serviceCollection = client
    .db(`${process.env.DB_DATA_BASE}`)
    .collection(`${process.env.DB_CLT_SERVICE}`);

  const adminCollection = client
    .db(`${process.env.DB_DATA_BASE}`)
    .collection(`${process.env.DB_CLT_ADMIN}`);

  const userServiceCollection = client
    .db(`${process.env.DB_DATA_BASE}`)
    .collection(`${process.env.DB_CLT_USER_SERVICE}`);

  const userContactCollection = client
    .db(`${process.env.DB_DATA_BASE}`)
    .collection(`${process.env.DB_CLT_USER_CONTACT}`);

  const reviewCollection = client
    .db(`${process.env.DB_DATA_BASE}`)
    .collection(`${process.env.DB_CLT_USER_REVIEWS}`);

  app.post("/addService", (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addUserOrder", (req, res) => {
    const UserOrder = req.body;
    userServiceCollection.insertOne(UserOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addUserContact", (req, res) => {
    const contact = req.body;
    userContactCollection.insertOne(contact).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    adminCollection.insertOne({ name, email }).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addReviews", (req, res) => {
    const review = req.body;
    reviewCollection.insertOne(review).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    serviceCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.patch("/updateStatus/:id", (req, res) => {
    console.log(req.body.value);
    userServiceCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { status: req.body.value },
        }
      )
      .then((result) => {
        console.log(result);
        res.send(result.modifiedCount > 0);
      });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/userServices", (req, res) => {
    userServiceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/userOrder", (req, res) => {
    userServiceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/placeService/:id", (req, res) => {
    serviceCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.delete("/deleteService/:id", (req, res) => {
    serviceCollection
      .findOneAndDelete({ _id: ObjectId(req.params.id) })
      .then((err, documents) => {
        res.send(!!documents.value);
      });
  });

  app.get("/admins", (req, res) => {
    adminCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admin) => {
      res.send(admin.length > 0);
    });
  });
});

app.listen(process.env.PORT || port);
