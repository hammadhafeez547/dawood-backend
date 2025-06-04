import express from "express";
import multer from "multer";
import Route from "../model/Route.js"


const router = express.Router();

// // === File Upload Setup ===
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // make sure uploads folder exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage });

// === Get All Routes ===
router.get("/all-routes", async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// === Add New Route ===
router.post("/route-add", async (req, res) => {
    try {
      const {
        name,
        distance,
        duration,
        price,
        description,
        popular,
        category,
        stops,
        features
      } = req.body;
  
      const newRoute = new Route({
        name,
        distance,
        duration,
        price,
        description,
        popular,       // already boolean if sent correctly
        category,
        stops,         // already an array if sent as ["Stop1", "Stop2"]
        features       // same here
      });
  
      await newRoute.save();
      res.status(201).json({ message: "Route created", route: newRoute });
    } catch (err) {
      res.status(500).json({ error: "Failed to add route: " + err.message });
    }
  });
  

// === Update Route ===
router.put("/:id", async (req, res) => {
  try {
    const updates = {
      ...req.body,
      popular: req.body.popular === "true",
      stops: req.body.stops ? JSON.parse(req.body.stops) : [],
      features: req.body.features ? JSON.parse(req.body.features) : [],
    };

    // if (req.file) {
    //   updates.imageUrl = req.file.filename;
    // }

    const updated = await Route.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ message: "Route updated", route: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update route" });
  }
});

// === Delete Route ===
router.delete("/:id", async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ message: "Route deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete route" });
  }
});

export default router;
