// Force Node.js to use Google and Cloudflare public DNS resolvers
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  Timestamp,
} = require("mongodb");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.port || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dmnxhxd.mongodb.net/?appName=Cluster0`;

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
    await client.connect();

    app.get("/", (req, res) => {
      res.send("Hotel Software Server is Running 🚀");
    });

    // code starts from here

    // Employee Database Management

    const employeeCollection = client
      .db("Hotel_Management_Software")
      .collection("Employees");

    app.post("/employees", async (req, res) => {
      const employee = req.body;
      const result = await employeeCollection.insertOne(employee);
      res.status(201).send(result);
    });

    app.get("/employees/active", async (req, res) => {
      const employees = await employeeCollection
        .find({
          EmploymentStatus: {
            $in: ["Active", "On Leave"],
          },
        })
        .toArray();

      res.send(employees);
    });
    app.get("/employees/inactive", async (req, res) => {
      const employees = await employeeCollection
        .find({
          EmploymentStatus: {
            $in: ["Resigned", "Terminated"],
          },
        })
        .toArray();

      res.send(employees);
    });

    app.get("/employees/:id", async (req, res) => {
      const id = req.params.id;

      const employee = await employeeCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(employee);
    });

    app.patch("/employees/:id", async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      // Prevent updating the _id field
      delete updatedData._id;

      const result = await employeeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );

      res.send(result);
    });

    // Rooms

    const roomCollection = client
      .db("Hotel_Management_Software")
      .collection("Rooms");

    app.post("/rooms", async (req, res) => {
      const room = req.body;
      const result = await roomCollection.insertOne(room);
      res.status(201).send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
