import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  brand: {
    type: String,
    required: true,
  },
  startingPrice : {
    type : String ,
  },
  
   description: {
    type: String,
    required: true,
  },
   reviews: {
    type : Number , 
   },
   rating: {
    type: String,
    required: true,
    unique: true,
  },
   
  luggage : {
    type : String,
  },
  passengers: {
    type: Number,
    required: true,
  },
modifyDate: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    
  },
  popular : {
    type : String ,
  }
 ,
  isAvailable: {
    type: String,
    default: "Available",
    enum : ["Booked" , "Not Available" , "Available"]
  },
  imageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
  ,
 
});

const Car = mongoose.model("cars", carSchema);
export default Car;
