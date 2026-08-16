// Force Node.js to use Google and Cloudflare public DNS resolvers
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
const port = process.env.port || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

    // =========================================================
    // ALL COLLECTIONS
    // =========================================================

    const db = client.db("Hotel_Management_Software");

    const employeeCollection = db.collection("Employees");
    const roomCollection = db.collection("Rooms");
    const maintenanceHistoryCollection = db.collection("Maintenance History");
    const roomVariantCollection = db.collection("Room Variants");
    const checkInCollection = db.collection("CheckInList");

    // =========================================================
    // ROOT
    // =========================================================

    app.get("/", (req, res) => {
      res.send("Hotel Software Server is Running 🚀");
    });

    // =========================================================
    // EMPLOYEES
    // =========================================================

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

    // Get maintenance rooms
    app.get("/rooms/maintenance", async (req, res) => {
      const rooms = await roomCollection
        .find({
          roomStatus: {
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
        roomStatus: {
          $in: ["Maintenance", "In Progress"],
        },
      });

      res.send(room);
    });

    // Get room by ID
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

    //edit maintenance history
    app.patch("/edit-maintenance-history/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room ID",
        });
      }

      const { _id, ...cleanData } = req.body;

      // Update room
      const room_res = await roomCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: cleanData,
        },
      );

      let history_res = null;

      // Save maintenance history only when maintenance is completed
      if (cleanData.roomStatus === "Available") {
        history_res = await maintenanceHistoryCollection.insertOne({
          ...cleanData,
          roomID: new ObjectId(id),
          closedAt: new Date(),
        });
      }

      res.send({
        success: true,
        message: "Room updated successfully",
        history_res,
        room_res,
      });
    });

    // Change an existing maintenance history record
    app.patch("/change-maintenance-history/:id", async (req, res) => {
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

      res.send({
        success: true,
        message: "Maintenance history updated successfully",
        result,
      });
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
    // ROOM VARIANTS
    // =========================================================

    // Add room variant
    app.post("/add-room-variant", async (req, res) => {
      if (!req.files || !req.files.image) {
        return res.status(400).json({ message: "Image is required" });
      }

      const image = req.files.image;

      if (!image.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ message: "Only image files are allowed" });
      }

      const uploadDir = path.join(__dirname, "uploads", "room-variants");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(image.name);

      const uploadPath = path.join(uploadDir, uniqueName);
      await image.mv(uploadPath);

      const roomVariant = {
        variantName: req.body.variantName,
        baseRoomType: req.body.baseRoomType,
        price: Number(req.body.price),
        maxOccupancy: Number(req.body.maxOccupancy),
        bedType: req.body.bedType || "",
        amenities: req.body.amenities || "",
        description: req.body.description || "",
        image: `/uploads/room-variants/${uniqueName}`,
        createdAt: new Date(),
      };

      const result = await roomVariantCollection.insertOne(roomVariant);
      res.status(201).json(result);
    });

    // Get all room variants
    app.get("/room-variants", async (req, res) => {
      const result = await roomVariantCollection.find().toArray();
      res.send(result);
    });

    // Get single room variant by ID  ← THIS WAS MISSING
    app.get("/room-variants/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room variant ID",
        });
      }

      const result = await roomVariantCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!result) {
        return res.status(404).send({
          message: "Room variant not found",
        });
      }

      res.send(result);
    });

    // Update room variant
    app.patch("/room-variants/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room variant ID",
        });
      }

      const existingVariant = await roomVariantCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingVariant) {
        return res.status(404).send({
          message: "Room variant not found",
        });
      }

      const oldVariantName = existingVariant.variantName;

      const updateData = {
        variantName: req.body.variantName,
        baseRoomType: req.body.baseRoomType,
        price: Number(req.body.price),
        maxOccupancy: Number(req.body.maxOccupancy),
        bedType: req.body.bedType || "",
        amenities: req.body.amenities || "",
        description: req.body.description || "",
      };

      // If a new image was uploaded
      if (req.files && req.files.image) {
        const image = req.files.image;

        if (!image.mimetype.startsWith("image/")) {
          return res
            .status(400)
            .json({ message: "Only image files are allowed" });
        }

        const uploadDir = path.join(__dirname, "uploads", "room-variants");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uniqueName =
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(image.name);

        const uploadPath = path.join(uploadDir, uniqueName);
        await image.mv(uploadPath);

        updateData.image = `/uploads/room-variants/${uniqueName}`;
      }

      // 1. Update the variant itself
      const result = await roomVariantCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );

      // 2. Update related rooms
      const roomsUpdateData = {
        variantName: updateData.variantName,
        baseRoomType: updateData.baseRoomType,
        price: updateData.price,
        maxOccupancy: updateData.maxOccupancy,
        bedType: updateData.bedType,
        amenities: updateData.amenities,
        description: updateData.description,
      };

      if (updateData.image) {
        roomsUpdateData.image = updateData.image;
      }

      await roomCollection.updateMany(
        { variantName: oldVariantName },
        { $set: roomsUpdateData },
      );

      res.send(result);
    });

    // Delete room variant
    app.delete("/room-variants/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid room variant ID",
        });
      }

      const existingVariant = await roomVariantCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingVariant) {
        return res.status(404).send({
          message: "Room variant not found",
        });
      }

      const variantName = existingVariant.variantName;

      // 1. Delete the variant itself
      const result = await roomVariantCollection.deleteOne({
        _id: new ObjectId(id),
      });

      // 2. Delete all rooms under this variant
      await roomCollection.deleteMany({
        variantName: variantName,
      });

      res.send(result);
    });

    // Get rooms by variant ID
    app.get("/rooms/variant/:variantId", async (req, res) => {
      const { variantId } = req.params;

      const rooms = await roomCollection
        .find({
          variantId: variantId,
        })
        .toArray();

      res.send(rooms);
    });

    // Check-Ins
    app.post("/check-in", async (req, res) => {
      const checkInData = {
        ...req.body,
        createdAt: new Date(),
      };

      const result = await checkInCollection.insertOne(checkInData);
      res.status(201).send(result);
    });

    app.get("/check-in", async (req, res) => {
      const result = await checkInCollection.find().toArray();
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
  }
}

run().catch(console.dir);
