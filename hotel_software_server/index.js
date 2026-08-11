// Force Node.js to use Google and Cloudflare public DNS resolvers
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    app.get("/", (req, res) => {
      res.send("Hotel Software Server is Running 🚀");
    });

    // =========================================================
    // EMPLOYEES
    // =========================================================

    const employeeCollection = client
      .db("Hotel_Management_Software")
      .collection("Employees");

    // Add employee
    app.post("/employees", async (req, res) => {
      const employee = req.body;

      const result = await employeeCollection.insertOne(employee);

      res.status(201).send(result);
    });

    // Active employees
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

    // Inactive employees
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

    // Get employee by ID
    app.get("/employees/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid employee ID",
        });
      }

      const employee = await employeeCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(employee);
    });

    // Update employee
    app.patch("/employees/:id", async (req, res) => {
      const { id } = req.params;
      const { _id, ...updatedData } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid employee ID",
        });
      }

      const result = await employeeCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updatedData,
        },
      );

      res.send(result);
    });

    // =========================================================
    // ROOMS
    // =========================================================

    const roomCollection = client
      .db("Hotel_Management_Software")
      .collection("Rooms");

    // Add room
    app.post("/rooms", async (req, res) => {
      const room = req.body;

      const result = await roomCollection.insertOne(room);

      res.status(201).send(result);
    });

    // Get all rooms
    app.get("/rooms", async (req, res) => {
      const rooms = await roomCollection.find().toArray();

      res.send(rooms);
    });

    // IMPORTANT:
    // Specific routes MUST come before /rooms/:id

    // Get maintenance rooms
    app.get("/rooms/maintenance", async (req, res) => {
      const rooms = await roomCollection
        .find({
          RoomStatus: {
            $in: ["Maintenance", "In Progress"],
          },
        })
        .toArray();

      res.send(rooms);
    });

    // Get one maintenance room
    app.get("/rooms/maintenance/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room ID",
        });
      }

      const room = await roomCollection.findOne({
        _id: new ObjectId(id),
        RoomStatus: {
          $in: ["Maintenance", "In Progress"],
        },
      });

      res.send(room);
    });

    // Get room by ID
    // Keep this AFTER /rooms/maintenance
    app.get("/rooms/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room ID",
        });
      }

      const result = await roomCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // Update room
    app.patch("/rooms/:id", async (req, res) => {
      const { id } = req.params;

      // Prevent _id from being updated
      const { _id, ...updateData } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room ID",
        });
      }

      const result = await roomCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updateData,
        },
      );

      res.send(result);
    });

    // Delete room
    app.delete("/room-delete/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room ID",
        });
      }

      const result = await roomCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // =========================================================
    // MAINTENANCE HISTORY
    // =========================================================

    const maintenanceHistoryCollection = client
      .db("Hotel_Management_Software")
      .collection("Maintenance History");

    // Get all maintenance history
    app.get("/maintenance-history", async (req, res) => {
      const result = await maintenanceHistoryCollection.find().toArray();

      res.send(result);
    });

    // Get one maintenance history by ID
    app.get("/maintenance-history/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid maintenance history ID",
        });
      }

      const result = await maintenanceHistoryCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // ---------------------------------------------------------
    // Edit current room maintenance
    // When status becomes Available:
    // 1. Save maintenance data to history
    // 2. Clear maintenance fields from room
    // ---------------------------------------------------------

    app.patch("/edit-maintenance-history/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room ID",
        });
      }

      const { _id, ...cleanData } = req.body;

      let history_res = null;
      let room_res;

      if (cleanData.RoomStatus === "Available") {
        // Save maintenance information to history
        history_res = await maintenanceHistoryCollection.insertOne({
          ...cleanData,
          roomID: {
            id,
          },
          closedAt: new Date(),
        });

        // Reset maintenance information in room
        room_res = await roomCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: {
              RoomStatus: "Available",
              WorkBegins: null,
              WorkEnds: null,
              AssignedPerson: null,
              AssignedPersonNumber: null,
              MaintenanceCost: null,
            },
          },
        );
      } else {
        // Normal maintenance update
        room_res = await roomCollection.updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: cleanData,
          },
        );
      }

      res.send({
        history_res,
        room_res,
      });
    });

    // ---------------------------------------------------------
    // Edit an existing maintenance history record
    // ---------------------------------------------------------

    app.patch("/maintenance-history/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid maintenance history ID",
        });
      }

      const { _id, ...updateData } = req.body;

      const result = await maintenanceHistoryCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updateData,
        },
      );

      res.send(result);
    });

    // Delete maintenance history
    app.delete("/maintenance-history/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid maintenance history ID",
        });
      }

      const result = await maintenanceHistoryCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // =========================================================
    // MONGODB CONNECTION CHECK
    // =========================================================

    await client.db("admin").command({
      ping: 1,
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } finally {
    // Keep MongoDB connection open while server is running
    // await client.close();
  }
}

run().catch(console.dir);
