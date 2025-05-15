import express from "express";
import Service from "../model/Service.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const route = new Service(req.body);
    await route.save();
    res.status(201).json({ message: "Route added successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Failed to add route", error: error.message });
  }
});

router.get("/:Id", async (req, res) => {
  try {
    console.log(req.params.Id)
    const Id = req.params.Id;
    const routes = await Service.findById(Id);
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch routes", error: error.message });
  }
});
// GET: Get all routes
router.get("/", async (req, res) => {
  try {
    const routes = await Service.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch routes", error: error.message });
  }
});

export default router;
