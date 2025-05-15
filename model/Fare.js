import mongoose from "mongoose";


const routeSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car", // Referencing the Car model
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,

  },
  fare: {
    type: Number,
    
  },
  // Additional route-related fields can be added here
});

const Fare = mongoose.model("Fare", routeSchema);

export default Fare;