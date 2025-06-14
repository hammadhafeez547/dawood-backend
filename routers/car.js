import express from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Car from "../model/Cars.js";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======= Multer Configuration with Cloudinary =======
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'car-rentals',
    format: async (req, file) => file.mimetype.split('/')[1], // extracts jpg/png from mimetype
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return uniqueSuffix;
    },
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only .jpg, .jpeg, and .png formats are allowed"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// ======= Routes =======

// Add new car
router.post("/car-add", upload.single("image"), async (req, res) => {
  try {
    const {
      name,

      brand,
      luggage,
      startingPrice,
      passengers,
      modifyDate,
      rating,
      reviews,
      category,
      popular,
      description,
    } = req.body;

    if (!name || !brand || !luggage || !rating || !passengers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCar = new Car({
      name,
      
      brand,
      luggage,
      startingPrice,
      passengers,
      modifyDate,
      rating: parseFloat(rating),
      reviews: parseInt(reviews),
      category,
      popular: popular === "true",
      description,
      imageUrl: req.file ? req.file.path : null, // Cloudinary URL
      isAvailable: "Available",
    });

    await newCar.save();
    res.status(201).json({ message: "Car added successfully", car: newCar });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all cars
router.get("/all-cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cars" });
  }
});

// Get car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: "Error fetching car" });
  }
});

// Update car by ID
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (req.file) {
    updatedData.imageUrl = req.file.path; // Cloudinary URL
  }

  try {
    const updatedCar = await Car.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ message: "Error updating car", error: err });
  }
});

// Delete car by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ error: "Car not found" });
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting car" });
  }
});

export default router;