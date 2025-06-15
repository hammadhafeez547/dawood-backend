// models/Booking.js
import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  pickup: { type: String, required: true },
  drop: { type: String, required: true },
  price: { type: String, required: true },
    car: { type: String, required: true },

  // car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "confirmed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Ride =  mongoose.model("Booking", bookingSchema)
export default Ride;