import express, { Router } from "express"
import Fare from "../model/Fare.js"; 

const router = express.Router();

router.get("/:carId", async (req, res) => {
    const { carId } = req.params
    const fares = await Fare.find({ car: carId })
    res.json(fares)
  })
  
  router.get("/", async (req, res) => {
    const fares = await Fare.find();
    res.json(fares)
  })
  // POST new fare
  router.post("/", async (req, res) => {
    const { car, from, to, fare } = req.body
    const newFare = new Fare({ car, from, to, fare })
    await newFare.save()
    res.json(newFare)
  })
  
  router.post("/bulk", async (req, res) => {
    try {
      const fares = await Fare.insertMany(req.body);
      res.status(201).json(fares);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // PUT update fare
  router.put("/:id", async (req, res) => {
    const { fare } = req.body
    const updated = await Fare.findByIdAndUpdate(req.params.id, { fare }, { new: true })
    res.json(updated)
  })
  
  export default router;
