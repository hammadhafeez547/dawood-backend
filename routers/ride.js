// routes/booking.js
import express from "express"
import Ride from "../model/Ride.js"

const router = express.Router()

router.get("/", async (req, res) => {
  const bookings = await Ride.find().populate("car" , "name")
  res.json(bookings)
})
router.post("/booking-add", async (req, res) => {
  
    const { name, phone, pickup, drop, car , price } = req.body
    const newBooking = new Ride({ name, phone, pickup, drop, car, price, status: "confirmed" })
    await newBooking.save()
    res.json(newBooking)
  })
router.put("/:id/status", async (req, res) => {
  const { status } = req.body
  const updated = await Ride.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  )
  res.json(updated)
})

export default router
