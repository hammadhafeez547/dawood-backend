import mongoose from "mongoose";

const transportOptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: String, required: true },
  perPerson: { type: Boolean, default: true },
  features: [String],
  
  vehicleType: String,
  capacity: String,
  duration: String,
  recommended: { type: Boolean, default: false },
});

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const routeInfoSchema = new mongoose.Schema({
  routeId: { type: String, required: true,unique: true },
  title: { type: String, required: true },
  category: String,
  distance: String,
  time: String,
  about: [String],
  journey: String,
});

const transportServiceSchema = new mongoose.Schema({
  routeInfo: routeInfoSchema,
  transportOptions: [transportOptionSchema],
  faqs: [faqSchema],
});
const Service = mongoose.model("ServiceRoute", transportServiceSchema);

export default Service;