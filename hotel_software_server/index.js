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
    const checkOutCollection = db.collection("Checkout List");
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
    const expenseCategoryCollection = db.collection("Expense Categories");
    const expenseEntryCollection = db.collection("Expense Entries");

    // =========================================================
    // ROOT
    // =========================================================

    app.get("/", (req, res) => {
      res.send("Hotel Software Server is Running 🚀");
    });

    // =========================================================
    // DASHBOARD STATS
    // =========================================================
    app.get("/dashboard/stats", async (req, res) => {
      try {
        // Current Guests (still in CheckInList)
        const currentGuests = await checkInCollection.countDocuments({
          status: { $ne: "Checked Out" },
        });

        // Current Employees (Active + On Leave)
        const currentEmployees = await employeeCollection.countDocuments({
          EmploymentStatus: { $in: ["Active", "On Leave"] },
        });

        // Rooms
        const totalAvailableRooms = await roomCollection.countDocuments({
          roomStatus: "Available",
        });
        const totalOccupiedRooms = await roomCollection.countDocuments({
          roomStatus: "Occupied",
        });

        // Current Month Earning (from Checkout List)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
        );

        const thisMonthCheckouts = await checkOutCollection
          .find({
            checkedOutAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          })
          .toArray();

        const currentMonthEarning = thisMonthCheckouts.reduce((sum, item) => {
          return sum + (Number(item.totalCharges) || 0);
        }, 0);

        res.send({
          currentGuests,
          currentEmployees,
          totalAvailableRooms,
          totalOccupiedRooms,
          currentMonthEarning,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).send({ message: "Failed to get dashboard stats" });
      }
    });

    // =========================================================
    // CUSTOMERS PER MONTH (Bar Chart)
    // =========================================================
    app.get("/dashboard/customers-per-month", async (req, res) => {
      try {
        const checkouts = await checkOutCollection.find().toArray();

        // Group by Year-Month
        const monthlyCount = {};

        checkouts.forEach((item) => {
          const date = new Date(item.checkedOutAt || item.createdAt);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          monthlyCount[key] = (monthlyCount[key] || 0) + 1;
        });

        // Sort by month
        const sortedKeys = Object.keys(monthlyCount).sort();

        const categories = sortedKeys.map((key) => {
          const [year, month] = key.split("-");
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return `${monthNames[parseInt(month) - 1]} ${year}`;
        });

        const seriesData = sortedKeys.map((key) => monthlyCount[key]);

        res.send({
          categories,
          series: [
            {
              name: "Customers",
              data: seriesData,
            },
          ],
        });
      } catch (error) {
        console.error("Customers per month error:", error);
        res.status(500).send({ message: "Failed to get customers data" });
      }
    });

    // =========================================================
    // REVENUE BY SERVICE (Pie Chart)
    // =========================================================
    app.get("/dashboard/revenue-by-service", async (req, res) => {
      try {
        // From Checkout List (more accurate after checkout)
        const checkouts = await checkOutCollection.find().toArray();

        let restaurantRevenue = 0;
        let laundryRevenue = 0;
        let transportRevenue = 0;
        let roomRevenue = 0;

        checkouts.forEach((item) => {
          // Room
          roomRevenue += Number(item.actualRoomCharge || item.totalAmount || 0);

          // Restaurant
          (item.restaurantOrders || []).forEach((order) => {
            restaurantRevenue += Number(order.totalAmount || 0);
          });

          // Laundry
          (item.laundryOrders || []).forEach((order) => {
            laundryRevenue += Number(order.totalCost || 0);
          });

          // Transport
          (item.transportOrders || []).forEach((order) => {
            transportRevenue += Number(order.fare || 0);
          });
        });

        res.send({
          labels: ["Room", "Restaurant", "Laundry", "Transport"],
          series: [
            roomRevenue,
            restaurantRevenue,
            laundryRevenue,
            transportRevenue,
          ],
        });
      } catch (error) {
        console.error("Revenue by service error:", error);
        res.status(500).send({ message: "Failed to get revenue data" });
      }
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
    // =========================================================
    // CHECK-IN (with NID + Person image upload)
    // =========================================================
    app.post("/check-in", async (req, res) => {
      try {
        // ========== Validate images ==========
        if (!req.files || !req.files.nidImage || !req.files.personImage) {
          return res.status(400).json({
            message: "Both NID image and Person image are required",
          });
        }

        const nidImage = req.files.nidImage;
        const personImage = req.files.personImage;

        // Validate file types
        if (
          !nidImage.mimetype.startsWith("image/") ||
          !personImage.mimetype.startsWith("image/")
        ) {
          return res.status(400).json({
            message: "Only image files are allowed",
          });
        }

        // ========== Create upload folder ==========
        const uploadDir = path.join(__dirname, "uploads", "check-in");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // ========== Generate unique filenames ==========
        const nidUniqueName =
          Date.now() +
          "-nid-" +
          Math.round(Math.random() * 1e9) +
          path.extname(nidImage.name);

        const personUniqueName =
          Date.now() +
          "-person-" +
          Math.round(Math.random() * 1e9) +
          path.extname(personImage.name);

        // ========== Move files ==========
        await nidImage.mv(path.join(uploadDir, nidUniqueName));
        await personImage.mv(path.join(uploadDir, personUniqueName));

        // ========== Prepare check-in data ==========
        const checkInData = {
          // Guest Info
          guestName: req.body.guestName,
          guestAddress: req.body.guestAddress,
          contactNumber: req.body.contactNumber,
          designation: req.body.designation,
          nidNumber: req.body.nidNumber || "",

          // Images
          nidImage: `/uploads/check-in/${nidUniqueName}`,
          personImage: `/uploads/check-in/${personUniqueName}`,

          // Room Info
          roomVariantId: req.body.roomVariantId,
          roomVariantName: req.body.roomVariantName,
          roomNumber: req.body.roomNumber,
          pricePerNight: Number(req.body.pricePerNight) || 0,

          // Stay Info
          checkInDate: req.body.checkInDate,
          checkInTime: req.body.checkInTime,
          checkOutDate: req.body.checkOutDate,
          numberOfNights: Number(req.body.numberOfNights) || 0,
          numberOfGuests: Number(req.body.numberOfGuests) || 0,

          // Payment Info
          totalAmount: Number(req.body.totalAmount) || 0,
          advancePayment: Number(req.body.advancePayment) || 0,
          dueAmount: Number(req.body.dueAmount) || 0,

          specialRequests: req.body.specialRequests || "",
          status: req.body.status || "Normal",

          // Initialize service arrays
          restaurantOrders: [],
          restaurantTotalAmount: 0,
          laundryOrders: [],
          laundryTotalAmount: 0,
          transportOrders: [],
          transportTotalAmount: 0,

          createdAt: new Date(),
        };

        // ========== Insert into database ==========
        const result = await checkInCollection.insertOne(checkInData);

        // ========== Update room status to Occupied ==========
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
      } catch (error) {
        console.error("Check-in error:", error);
        res.status(500).send({ message: "Failed to check in guest" });
      }
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
          paymentStatus: orderData.paymentStatus,
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
        const { fromDate, toDate, contactNumber } = req.query;

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

        // Optional contact number filter
        if (contactNumber) {
          query.contactNumber = contactNumber;
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
        const { fromDate, toDate, contactNumber } = req.query;

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

        // Optional contact number filter
        if (contactNumber) {
          query["checkInInfo.contactNumber"] = contactNumber;
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
        const { fromDate, toDate, contactNumber } = req.query;

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

        // Optional contact number filter
        if (contactNumber) {
          query.contactNumber = contactNumber;
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
    // EXPENSE CATEGORY
    // =========================================================

    // Add new expense category
    app.post("/expense-categories", async (req, res) => {
      try {
        const { categoryName } = req.body;

        if (!categoryName || categoryName.trim() === "") {
          return res.status(400).send({ message: "Category name is required" });
        }

        // Check if category already exists
        const exists = await expenseCategoryCollection.findOne({
          categoryName: categoryName.trim(),
        });

        if (exists) {
          return res.status(400).send({ message: "Category already exists" });
        }

        const result = await expenseCategoryCollection.insertOne({
          categoryName: categoryName.trim(),
          createdAt: new Date(),
        });

        res.status(201).send(result);
      } catch (error) {
        console.error("Add expense category error:", error);
        res.status(500).send({ message: "Failed to add category" });
      }
    });

    // Get all expense categories
    app.get("/expense-categories", async (req, res) => {
      try {
        const result = await expenseCategoryCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to get categories" });
      }
    });

    // ====================== Expense Entries ======================
    // POST new expense entry
    app.post("/expense-entries", async (req, res) => {
      try {
        const expense = req.body;

        // Optional: add createdAt timestamp
        expense.createdAt = new Date();

        const result = await expenseEntryCollection.insertOne(expense);
        res.send(result);
      } catch (error) {
        console.error("Add expense entry error:", error);
        res.status(500).send({ message: "Failed to add expense entry" });
      }
    });

    // Expense Overview Report
    app.get("/expense-overview", async (req, res) => {
      try {
        const { fromDate, toDate, categoryName } = req.query;

        if (!fromDate || !toDate) {
          return res.status(400).send({
            message: "Both fromDate and toDate are required",
          });
        }

        const query = {
          expenseDate: {
            $gte: fromDate,
            $lte: toDate,
          },
        };

        // Optional category filter
        if (categoryName) {
          query.categoryName = categoryName;
        }

        const result = await expenseEntryCollection
          .find(query)
          .sort({ expenseDate: 1 })
          .toArray();

        res.send(result);
      } catch (error) {
        console.error("Expense overview report error:", error);
        res.status(500).send({
          message: "Failed to fetch expense overview report",
        });
      }
    });

    // =========================================================
    // CHECKOUT (Move data to Checkout List + mark all as Paid)
    // =========================================================
    app.post("/check-out/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid check-in ID" });
        }

        // 1. Get the full check-in document
        const checkIn = await checkInCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!checkIn) {
          return res.status(404).send({ message: "Check-in record not found" });
        }

        if (checkIn.status === "Checked Out") {
          return res.status(400).send({ message: "Guest already checked out" });
        }

        const {
          actualCheckoutDate,
          actualNights,
          actualRoomCharge,
          restaurantDue,
          laundryDue,
          transportDue,
          totalCharges,
          advancePayment,
          finalAmount,
          isRefund,
        } = req.body;

        // ====================== 2. Prepare Checkout Data ======================
        const checkoutData = {
          ...checkIn, // copy everything from check-in
          _id: undefined, // remove old _id so MongoDB creates a new one
          originalCheckInId: checkIn._id, // keep reference

          // Override with actual checkout values
          status: "Checked Out",
          actualCheckoutDate:
            actualCheckoutDate || new Date().toISOString().split("T")[0],
          actualNights: Number(actualNights) || checkIn.numberOfNights,
          actualRoomCharge: Number(actualRoomCharge) || checkIn.totalAmount,
          restaurantDue: Number(restaurantDue) || 0,
          laundryDue: Number(laundryDue) || 0,
          transportDue: Number(transportDue) || 0,
          totalCharges: Number(totalCharges) || 0,
          advancePayment: Number(advancePayment) || checkIn.advancePayment,
          finalAmount: Number(finalAmount) || 0,
          isRefund: Boolean(isRefund),
          checkedOutAt: new Date(),

          // Mark all nested orders as Paid
          restaurantOrders: (checkIn.restaurantOrders || []).map((order) => ({
            ...order,
            paymentStatus: "Paid",
            foodItems: (order.foodItems || []).map((item) => ({
              ...item,
              paymentStatus: "Paid",
            })),
          })),
          laundryOrders: (checkIn.laundryOrders || []).map((order) => ({
            ...order,
            paymentStatus: "Paid",
          })),
          transportOrders: (checkIn.transportOrders || []).map((order) => ({
            ...order,
            paymentStatus: "Paid",
          })),
        };

        delete checkoutData._id; // safety

        // ====================== 3. Insert into Checkout List ======================
        const insertResult = await checkOutCollection.insertOne(checkoutData);

        // ====================== 4. Mark all related orders as Paid ======================

        // Restaurant Orders
        if (checkIn.restaurantOrders?.length > 0) {
          const restaurantOrderIds = checkIn.restaurantOrders
            .map((o) => o.orderId)
            .filter(Boolean);

          if (restaurantOrderIds.length > 0) {
            await restaurantOrderCollection.updateMany(
              {
                _id: { $in: restaurantOrderIds.map((id) => new ObjectId(id)) },
              },
              { $set: { paymentStatus: "Paid" } },
            );
          }
        }

        // Laundry Orders
        if (checkIn.laundryOrders?.length > 0) {
          const laundryOrderIds = checkIn.laundryOrders
            .map((o) => o.orderId)
            .filter(Boolean);

          if (laundryOrderIds.length > 0) {
            await laundryServiceCollection.updateMany(
              { _id: { $in: laundryOrderIds.map((id) => new ObjectId(id)) } },
              { $set: { paymentStatus: "Paid" } },
            );
          }
        }

        // Transport Orders
        if (checkIn.transportOrders?.length > 0) {
          const transportOrderIds = checkIn.transportOrders
            .map((o) => o.orderId)
            .filter(Boolean);

          if (transportOrderIds.length > 0) {
            await transportServiceCollection.updateMany(
              { _id: { $in: transportOrderIds.map((id) => new ObjectId(id)) } },
              { $set: { paymentStatus: "Paid" } },
            );
          }
        }

        // ====================== 5. Free the room ======================
        await roomCollection.updateOne(
          { roomNo: checkIn.roomNumber },
          { $set: { roomStatus: "Available" } },
        );

        // ====================== 6. Delete from Check-In collection ======================
        await checkInCollection.deleteOne({ _id: new ObjectId(id) });

        res.send({
          success: true,
          message: "Checkout completed successfully",
          checkoutId: insertResult.insertedId,
        });
      } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).send({
          message: "Failed to complete checkout",
          error: error.message,
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
