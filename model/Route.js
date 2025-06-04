import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    distance: { type: String, required: true },
    duration: { type: String, required: true },
    stops: { type: [String], default: [] },
    description: { type: String },
    price: { type: String, required: true },
    popular: { type: Boolean, default: false },
    features: { type: [String], default: [] },
    category: {
      type: String,
      enum: ["hajj", "umrah", "airport"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true });

const Route = mongoose.model("Routess", routeSchema);
export default Route;
