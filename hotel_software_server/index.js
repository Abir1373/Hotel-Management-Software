// Force Node.js to use Google and Cloudflare public DNS resolvers
require("node:dns").setServers(["8.8.8.8", "1.1.1.1"]);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

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
    const bannedGuestCollection = db.collection("Banned Guests");
    const foodMenuCollection = db.collection("Food Menu");
    const roomServiceCollection = db.collection("Room Services");
    const transportServiceCollection = db.collection("Transport Services");
    const laundryServiceCollection = db.collection("Laundry Services");
    const restaurantOrderCollection = db.collection("Restaurant Orders");
    const reservationCollection = db.collection("Reservations");
    const salaryStructureCollection = db.collection("Salary Structures");
    const payrollCollection = db.collection("Payrolls");
    const hotelCollection = db.collection("Hotels");

    // =========================================================
    // ROOT
    // =========================================================

    app.get("/", (req, res) => {
      res.send("Hotel Software Server is Running 🚀");
    });

    // =========================================================
    // EMPLOYEES
    // =========================================================

    // Add employee (with image upload)
    app.post("/employees", async (req, res) => {
      try {
        if (!req.files || !req.files.image) {
          return res.status(400).json({ message: "Profile photo is required" });
        }

        const image = req.files.image;

        // Validate image type
        if (!image.mimetype.startsWith("image/")) {
          return res
            .status(400)
            .json({ message: "Only image files are allowed" });
        }

        // Create upload folder if not exists
        const uploadDir = path.join(__dirname, "uploads", "employees");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Unique filename
        const uniqueName =
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(image.name);

        const uploadPath = path.join(uploadDir, uniqueName);
        await image.mv(uploadPath);

        // Employee data
        const employee = {
          FullName: req.body.FullName,
          EmployeeID: req.body.EmployeeID,
          Email: req.body.Email,
          Phone: req.body.Phone,
          NID: req.body.NID,
          Gender: req.body.Gender,
          Department: req.body.Department,
          Designation: req.body.Designation,
          JoiningDate: req.body.JoiningDate,
          EmploymentStatus: req.body.EmploymentStatus,
          Address: req.body.Address,
          Image: `/uploads/employees/${uniqueName}`,
          createdAt: new Date(),
        };

        const result = await employeeCollection.insertOne(employee);
        res.status(201).send(result);
      } catch (error) {
        console.error("Add employee error:", error);
        res.status(500).send({ message: "Failed to add employee" });
      }
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

    // Get available rooms by date range
    app.get("/rooms/available", async (req, res) => {
      try {
        const { arriving, departure } = req.query;

        if (!arriving || !departure) {
          return res.status(400).send({ message: "Dates required" });
        }

        // Check-ins that overlap selected dates
        const checkIns = await checkInCollection
          .find({
            checkInDate: { $lt: departure },
            checkOutDate: { $gt: arriving },
          })
          .toArray();

        // Reservations that overlap selected dates
        const reservations = await reservationCollection
          .find({
            arrivingDate: { $lt: departure },
            departureDate: { $gt: arriving },
            status: "Reserved",
          })
          .toArray();

        const blocked = [
          ...new Set([
            ...checkIns.map((c) => String(c.roomNumber)),
            ...reservations.map((r) => String(r.room?.roomNo || r.roomNo)),
          ]),
        ];

        const rooms = await roomCollection
          .find({
            roomNo: { $nin: blocked },
            roomStatus: { $ne: "Maintenance" },
          })
          .toArray();

        const grouped = {};
        rooms.forEach((room) => {
          const name = room.variantName || "Other";
          if (!grouped[name]) {
            grouped[name] = {
              variantName: room.variantName,
              baseRoomType: room.baseRoomType,
              price: room.price,
              maxOccupancy: room.maxOccupancy,
              bedType: room.bedType,
              amenities: room.amenities,
              description: room.description,
              image: room.image,
              rooms: [],
            };
          }
          grouped[name].rooms.push(room);
        });

        res.send({
          arriving,
          departure,
          totalAvailable: rooms.length,
          variants: Object.values(grouped),
        });
      } catch (error) {
        console.error("Available rooms error:", error);
        res.status(500).send({ message: "Failed to get available rooms" });
      }
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

      // Update room status to Occupied
      await roomCollection.updateOne(
        {
          roomNo: req.body.roomNumber,
          variantId: req.body.roomVariantId,
        },
        {
          $set: { roomStatus: "Occupied" },
        },
      );

      res.status(201).send(result);
    });

    app.get("/check-in", async (req, res) => {
      const result = await checkInCollection.find().toArray();
      res.send(result);
    });

    // GET /check-in/all-dues
    app.get("/check-in/all-dues", async (req, res) => {
      try {
        const checkIns = await checkInCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();

        const duesList = checkIns.map((checkIn) => {
          const roomDue = Number(checkIn.dueAmount) || 0;

          // Restaurant – only Due orders
          const restaurantDue = (checkIn.restaurantOrders || [])
            .filter((o) => o.paymentStatus === "Due")
            .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

          // Laundry – only Due
          const laundryDue = (checkIn.laundryOrders || [])
            .filter((o) => o.paymentStatus === "Due")
            .reduce((sum, o) => sum + (Number(o.totalCost) || 0), 0);

          // Transport – only Due
          const transportDue = (checkIn.transportOrders || [])
            .filter((o) => o.paymentStatus === "Due")
            .reduce((sum, o) => sum + (Number(o.fare) || 0), 0);

          const totalDue = roomDue + restaurantDue + laundryDue + transportDue;

          return {
            _id: checkIn._id,
            roomNumber: checkIn.roomNumber,
            guestName: checkIn.guestName,
            contactNumber: checkIn.contactNumber,
            checkInDate: checkIn.checkInDate,
            checkOutDate: checkIn.checkOutDate,
            roomDue,
            restaurantDue,
            laundryDue,
            transportDue,
            totalDue,
          };
        });

        // Optional: only show guests who have some due
        // const onlyWithDue = duesList.filter((d) => d.totalDue > 0);

        res.send(duesList);
      } catch (error) {
        console.error("Get all dues error:", error);
        res.status(500).send({ message: "Failed to get dues" });
      }
    });

    // Get single check-in
    app.get("/check-in/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid ID" });
      }

      const result = await checkInCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    app.patch("/check-in/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({
          message: "Invalid guest ID",
        });
      }

      const result = await checkInCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updateData,
        },
      );

      res.send(result);
    });

    // Banned Guest
    app.post("/banned-guests", async (req, res) => {
      const { checkinId } = req.body;

      // Find the check-in record
      const checkIn = await checkInCollection.findOne({
        _id: new ObjectId(checkinId),
      });

      if (!checkIn) {
        return res.status(404).send({
          message: "Check-in record not found",
        });
      }

      // Change check-in status to Ban
      const result2 = await checkInCollection.updateOne(
        { _id: new ObjectId(checkinId) },
        {
          $set: {
            status: "Ban",
          },
        },
      );

      // Insert complete guest information into banned guests
      const result = await bannedGuestCollection.insertOne({
        checkinId: checkIn._id,
        designation: checkIn.designation,
        guestName: checkIn.guestName,
        guestAddress: checkIn.guestAddress,
        nidNumber: checkIn.nidNumber,
        contactNumber: checkIn.contactNumber,
      });

      res.status(201).send({
        result,
        result2,
      });
    });

    app.delete("/banned-guests/:checkinId", async (req, res) => {
      const { checkinId } = req.params;

      const result = await bannedGuestCollection.deleteOne({
        checkinId: new ObjectId(checkinId),
      });

      const result2 = await checkInCollection.updateOne(
        { _id: new ObjectId(checkinId) },
        {
          $set: {
            status: "Normal",
          },
        },
      );

      res.send({
        result,
        result2,
      });
    });
    app.get("/banned-guests", async (req, res) => {
      const result = await bannedGuestCollection.find().toArray();

      res.send(result);
    });

    app.get("/banned-guests/check/:nidNumber", async (req, res) => {
      const { nidNumber } = req.params;

      const result = await bannedGuestCollection.findOne({
        nidNumber: nidNumber,
      });

      res.send({
        exists: !!result,
      });
    });

    // =========================================================
    // FOOD MENU
    // =========================================================

    // Add food item
    app.post("/food-menu", async (req, res) => {
      const foodItem = {
        ...req.body,
        createdAt: new Date(),
      };

      const result = await foodMenuCollection.insertOne(foodItem);
      res.status(201).send(result);
    });

    // Get all food items
    app.get("/food-menu", async (req, res) => {
      const result = await foodMenuCollection.find().toArray();
      res.send(result);
    });

    // Delete food item
    app.delete("/food-menu/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid food item ID" });
      }

      const result = await foodMenuCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    // Update food item
    app.patch("/food-menu/:id", async (req, res) => {
      const { id } = req.params;
      const { _id, ...updateData } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid food item ID" });
      }

      const result = await foodMenuCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );

      res.send(result);
    });

    // Room Services

    app.post("/room-service", async (req, res) => {
      const result = await roomServiceCollection.insertOne({
        ...req.body,
        createdAt: new Date(),
      });

      res.status(201).send(result);
    });

    // Get All Room Service History
    app.get("/room-service", async (req, res) => {
      const { active } = req.query;
      const filter = active ? { active_status: "active" } : {};
      const result = await roomServiceCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    // =========================================================
    // TRANSPORT SERVICE
    // =========================================================

    app.post("/transport-service", async (req, res) => {
      try {
        const transportData = {
          ...req.body,
          createdAt: new Date(),
        };

        // 1. Save the transport request
        const result =
          await transportServiceCollection.insertOne(transportData);

        // 2. Only if paymentStatus is "Due" → add to check-in
        if (req.body.paymentStatus === "Due" && req.body.checkinId) {
          const transportOrder = {
            orderId: result.insertedId,
            pickupLocation: req.body.pickupLocation || "",
            destination: req.body.destination || "",
            pickupDate: req.body.pickupDate || "",
            pickupTime: req.body.pickupTime || "",
            vehicleType: req.body.vehicleType || "",
            driverNumber: req.body.driverNumber || "",
            fare: Number(req.body.fare) || 0,
            paymentStatus: "Due",
            orderedAt: new Date(),
          };

          await checkInCollection.updateOne(
            { _id: new ObjectId(req.body.checkinId) },
            {
              $push: { transportOrders: transportOrder },
              $inc: { transportTotalAmount: transportOrder.fare },
            },
          );
        }

        res.status(201).send(result);
      } catch (error) {
        console.error("Transport service error:", error);
        res.status(500).send({ message: "Failed to create transport service" });
      }
    });

    // Get All Transport Service History
    app.get("/transport-service", async (req, res) => {
      const result = await transportServiceCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      res.send(result);
    });

    // =========================================================
    // LAUNDRY SERVICE
    // =========================================================

    app.post("/laundry-service", async (req, res) => {
      try {
        const laundryData = {
          ...req.body,
          createdAt: new Date(),
        };

        // 1. Save the laundry request
        const result = await laundryServiceCollection.insertOne(laundryData);

        // 2. Only if paymentStatus is "Due" → add to check-in
        if (req.body.paymentStatus === "Due" && req.body.checkinId) {
          const laundryOrder = {
            orderId: result.insertedId,
            clothItems: (req.body.clothItems || []).map((item) => ({
              clothName: item.clothName || "",
              quantity: Number(item.quantity) || 0,
              price: Number(item.price) || 0,
              totalPrice:
                (Number(item.quantity) || 0) * (Number(item.price) || 0),
            })),
            totalCost: Number(req.body.totalCost) || 0,
            laundryType: req.body.laundryType || "",
            pickupDate: req.body.pickupDate || "",
            deliveryDate: req.body.deliveryDate || "",
            assignedStaff: req.body.assignedStaff || "",
            specialInstructions: req.body.specialInstructions || "",
            paymentStatus: "Due",
            orderedAt: new Date(),
          };

          await checkInCollection.updateOne(
            { _id: new ObjectId(req.body.checkinId) },
            {
              $push: { laundryOrders: laundryOrder },
              $inc: { laundryTotalAmount: laundryOrder.totalCost },
            },
          );
        }

        res.status(201).send(result);
      } catch (error) {
        console.error("Laundry service error:", error);
        res.status(500).send({ message: "Failed to create laundry service" });
      }
    });

    // Get All Laundry Service History
    app.get("/laundry-service", async (req, res) => {
      const result = await laundryServiceCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    // =========================================================
    // RESTAURNT ORDERS
    // =========================================================

    app.post("/restaurant-orders", async (req, res) => {
      const orderData = req.body;

      // 1. Insert the restaurant order
      const result = await restaurantOrderCollection.insertOne(orderData);

      // 2. If order is linked to a check-in guest → update Check-In document
      if (orderData.checkInInfo && orderData.checkInInfo._id) {
        const checkInId = orderData.checkInInfo._id;

        const foodItemsToPush = (orderData.foodItems || []).map((item) => ({
          itemName: item.itemName,
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.price) || 0,
          totalPrice: (Number(item.quantity) || 0) * (Number(item.price) || 0),
          orderedAt: new Date(),
        }));

        const totalAmountToAdd = Number(orderData.totalAmount) || 0;

        const updateResult = await checkInCollection.updateOne(
          { _id: new ObjectId(checkInId) },
          {
            $push: {
              restaurantOrders: {
                orderId: result.insertedId,
                foodItems: foodItemsToPush,
                totalAmount: totalAmountToAdd,
                orderedAt: new Date(),
              },
            },
            $inc: {
              restaurantTotalAmount: totalAmountToAdd,
            },
          },
        );
      }

      res.send({
        success: true,
        message: "Restaurant order created successfully",
        insertedId: result.insertedId,
      });
    });

    // Get All Restaurant Orders History
    app.get("/restaurant-orders", async (req, res) => {
      const result = await restaurantOrderCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();

      res.send(result);
    });

    app.get("/restaurant-orders/:id", async (req, res) => {
      const result = await restaurantOrderCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
    // Update Restaurant Order (only foodItems + paymentStatus + totalAmount)
    app.patch("/restaurant-orders/:id", async (req, res) => {
      const id = req.params.id;
      const { foodItems, paymentStatus, totalAmount } = req.body;

      // 1. Get the existing order first
      const existingOrder = await restaurantOrderCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!existingOrder) {
        return res.status(404).send({ message: "Order not found" });
      }

      // 2. Update the restaurant order
      const result = await restaurantOrderCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            foodItems,
            paymentStatus,
            totalAmount,
          },
        },
      );

      // 3. If this order is linked to a check-in → update Check-In document
      if (existingOrder.checkInInfo && existingOrder.checkInInfo._id) {
        const checkInId = existingOrder.checkInInfo._id;
        const oldTotalAmount = Number(existingOrder.totalAmount) || 0;
        const newTotalAmount = Number(totalAmount) || 0;
        const difference = newTotalAmount - oldTotalAmount;

        // Prepare updated food items
        const updatedFoodItems = (foodItems || []).map((item) => ({
          itemName: item.itemName,
          quantity: Number(item.quantity) || 0,
          unitPrice: Number(item.price) || 0,
          totalPrice: (Number(item.quantity) || 0) * (Number(item.price) || 0),
          orderedAt: new Date(),
        }));

        // Update the specific order inside restaurantOrders array
        const updateResult = await checkInCollection.updateOne(
          {
            _id: new ObjectId(checkInId),
            "restaurantOrders.orderId": new ObjectId(id),
          },
          {
            $set: {
              "restaurantOrders.$.foodItems": updatedFoodItems,
              "restaurantOrders.$.totalAmount": newTotalAmount,
              "restaurantOrders.$.paymentStatus": paymentStatus,
            },
            $inc: {
              restaurantTotalAmount: difference, // adjust total by difference
            },
          },
        );
      }

      res.send(result);
    });

    // =========================================================
    // RESERVATIONS
    // =========================================================

    app.post("/reservations", async (req, res) => {
      try {
        const reservationData = {
          ...req.body,
          status: "Reserved",
          createdAt: new Date(),
        };

        const result = await reservationCollection.insertOne(reservationData);

        // Do NOT change roomStatus — availability is date-based only

        res.status(201).send(result);
      } catch (error) {
        console.error("Reservation error:", error);
        res.status(500).send({ message: "Failed to create reservation" });
      }
    });

    // Get all reservations
    app.get("/reservations", async (req, res) => {
      const result = await reservationCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();
      res.send(result);
    });

    // Delete a reservation
    app.delete("/reservations/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await reservationCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Reservation not found" });
        }

        res.send({
          success: true,
          message: "Reservation deleted successfully",
          deletedCount: result.deletedCount,
        });
      } catch (error) {
        console.error("Delete reservation error:", error);
        res.status(500).send({ message: "Failed to delete reservation" });
      }
    });

    // =========================================================
    // SALARY STRUCTURES
    // =========================================================

    // Create / Assign new salary structure
    app.post("/salary-structures", async (req, res) => {
      try {
        const salaryData = {
          ...req.body,
          createdAt: new Date(),
        };

        const result = await salaryStructureCollection.insertOne(salaryData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Salary structure error:", error);
        res.status(500).send({ message: "Failed to save salary structure" });
      }
    });

    // Get all salary structures
    app.get("/salary-structures", async (req, res) => {
      try {
        const result = await salaryStructureCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to get salary structures" });
      }
    });

    // Get salary structures by employee ID
    app.get("/salary-structures/employee/:employeeId", async (req, res) => {
      try {
        const { employeeId } = req.params;

        const result = await salaryStructureCollection
          .find({ employeeId })
          .sort({ createdAt: -1 })
          .toArray();

        res.send(result);
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Failed to get employee salary structures" });
      }
    });

    // Get single salary structure by ID
    app.get("/salary-structures/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid ID" });
        }

        const result = await salaryStructureCollection.findOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to get salary structure" });
      }
    });

    // Update salary structure
    app.patch("/salary-structures/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { _id, ...updateData } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid ID" });
        }

        const result = await salaryStructureCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData },
        );

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update salary structure" });
      }
    });

    // Delete salary structure
    app.delete("/salary-structures/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid ID" });
        }

        const result = await salaryStructureCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete salary structure" });
      }
    });

    app.post("/payrolls", async (req, res) => {
      try {
        const result = await payrollCollection.insertOne({
          ...req.body,
          createdAt: new Date(),
        });
        res.status(201).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to generate payroll" });
      }
    });

    // Get all payroll history
    app.get("/payrolls", async (req, res) => {
      try {
        const result = await payrollCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to get payroll history" });
      }
    });

    // =========================================================
    // HOTELS (Signup / Register Hotel)
    // =========================================================
    app.post("/hotels", async (req, res) => {
      try {
        // Check if logo is uploaded
        if (!req.files || !req.files.logo) {
          return res.status(400).json({ message: "Hotel logo is required" });
        }

        const logo = req.files.logo;

        // Validate file type
        if (!logo.mimetype.startsWith("image/")) {
          return res
            .status(400)
            .json({ message: "Only image files are allowed" });
        }

        // Create upload folder if not exists
        const uploadDir = path.join(__dirname, "uploads", "hotels");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const uniqueName =
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(logo.name);

        const uploadPath = path.join(uploadDir, uniqueName);
        await logo.mv(uploadPath);

        // ========== Hash Password ==========
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        // ===================================

        // Prepare hotel data
        const hotelData = {
          hotelName: req.body.hotelName,
          propertyType: req.body.propertyType,
          address: req.body.address,
          ownerName: req.body.ownerName,
          email: req.body.email,
          phone: req.body.phone,
          password: hashedPassword, // ← hashed password
          logo: `/uploads/hotels/${uniqueName}`,
          status: "pending",
          createdAt: new Date(),
        };

        const result = await hotelCollection.insertOne(hotelData);

        res.status(201).send(result);
      } catch (error) {
        console.error("Hotel signup error:", error);
        res.status(500).send({ message: "Failed to create hotel account" });
      }
    });

    // Get all hotels
    // Get all hotels (exclude password)
    app.get("/hotels", async (req, res) => {
      try {
        const result = await hotelCollection
          .find({}, { projection: { password: 0 } }) // ← hide password
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to get hotels" });
      }
    });

    // Approve / Update hotel status (safer version)
    app.patch("/hotels/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid hotel ID" });
        }

        // Only allow specific status values
        const allowedStatuses = ["Pending", "Approved", "Due", "Suspended"];
        if (status && !allowedStatuses.includes(status)) {
          return res.status(400).send({ message: "Invalid status value" });
        }

        const existing = await hotelCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!existing) {
          return res.status(404).send({ message: "Hotel not found" });
        }

        const result = await hotelCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: req.body },
        );

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update hotel" });
      }
    });

    // Delete hotel
    app.delete("/hotels/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid hotel ID" });
        }

        const result = await hotelCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete hotel" });
      }
    });

    // =========================================================
    // TRANSPORTATION SALES REPORT (Dedicated)
    // =========================================================

    app.get("/transportation-sales", async (req, res) => {
      try {
        const { fromDate, toDate, checkinId } = req.query;

        if (!fromDate || !toDate) {
          return res.status(400).send({
            message: "Both fromDate and toDate are required",
          });
        }

        const query = {
          pickupDate: {
            $gte: fromDate,
            $lte: toDate,
          },
        };

        // Optional checkinId filter
        if (checkinId) {
          query.checkinId = checkinId;
        }

        const result = await transportServiceCollection
          .find(query)
          .sort({ pickupDate: 1, pickupTime: 1 })
          .toArray();

        res.send(result);
      } catch (error) {
        console.error("Transportation sales report error:", error);
        res.status(500).send({
          message: "Failed to fetch transportation sales report",
        });
      }
    });

    // =========================================================
    // RESTAURANT SALES REPORT (Dedicated)
    // =========================================================

    app.get("/restaurant-sales", async (req, res) => {
      try {
        const { fromDate, toDate, checkinId } = req.query;

        if (!fromDate || !toDate) {
          return res.status(400).send({
            message: "Both fromDate and toDate are required",
          });
        }

        const query = {
          orderDate: {
            $gte: fromDate,
            $lte: toDate,
          },
        };

        // Optional checkinId filter
        if (checkinId) {
          query["checkInInfo._id"] = checkinId;
        }

        const result = await restaurantOrderCollection
          .find(query)
          .sort({ orderDate: 1, orderTime: 1 })
          .toArray();

        res.send(result);
      } catch (error) {
        console.error("Restaurant sales report error:", error);
        res.status(500).send({
          message: "Failed to fetch restaurant sales report",
        });
      }
    });

    // =========================================================
    // LAUNDRY SALES REPORT (Dedicated)
    // =========================================================

    app.get("/laundry-sales", async (req, res) => {
      try {
        const { fromDate, toDate, checkinId } = req.query;

        if (!fromDate || !toDate) {
          return res.status(400).send({
            message: "Both fromDate and toDate are required",
          });
        }

        const query = {
          pickupDate: {
            $gte: fromDate,
            $lte: toDate,
          },
        };

        // Optional checkinId filter
        if (checkinId) {
          query.checkinId = checkinId;
        }

        const result = await laundryServiceCollection
          .find(query)
          .sort({ pickupDate: 1 })
          .toArray();

        res.send(result);
      } catch (error) {
        console.error("Laundry sales report error:", error);
        res.status(500).send({
          message: "Failed to fetch laundry sales report",
        });
      }
    });

    // =========================================================
    // SALARY REPORT (Dedicated) - with Employee ID filter
    // =========================================================

    app.get("/salary-report", async (req, res) => {
      try {
        const { fromDate, toDate, employeeId } = req.query;

        if (!fromDate || !toDate) {
          return res.status(400).send({
            message: "Both fromDate and toDate are required",
          });
        }

        // Base query
        const query = {
          paidAt: {
            $gte: fromDate,
            $lte: toDate + "T23:59:59.999Z",
          },
        };

        // Add Employee ID filter if provided
        if (employeeId) {
          query.employeeID = employeeId; // using employeeID field (string)
          // If you want to filter by MongoDB _id instead, use:
          // query.employeeId = employeeId;
        }

        const payrolls = await payrollCollection
          .find(query)
          .sort({ paidAt: -1 })
          .toArray();

        // Fetch employee details
        const result = await Promise.all(
          payrolls.map(async (payroll) => {
            let employee = null;

            if (payroll.employeeId) {
              employee = await employeeCollection.findOne({
                _id: new ObjectId(payroll.employeeId),
              });
            }

            return {
              ...payroll,
              employeeDetails: employee || null,
            };
          }),
        );

        res.send(result);
      } catch (error) {
        console.error("Salary report error:", error);
        res.status(500).send({
          message: "Failed to fetch salary report",
        });
      }
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
