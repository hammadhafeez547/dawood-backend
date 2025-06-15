import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import "dotenv/config";

// Routers
import userRoutes from "./routers/auth.js";
import carRoutes from "./routers/car.js";
import fareRoutes from "./routers/fare.js";
import rideRoutes from "./routers/ride.js";
import serviceRoutes from "./routers/service.js";
import routeRoutes from "./routers/routes.js";
import authRoutes from "./routers/user.js";

const app = express();

// CORS Config (Postman and your frontend)
const allowedOrigins = [
  "http://localhost:3000",
  "https://dawood-frontends.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/routes", routeRoutes);
app.use("/auth", userRoutes);
app.use("/cars", carRoutes);
app.use("/fare", fareRoutes);
app.use("/ride", rideRoutes);
app.use("/user", authRoutes);
app.use("/service", serviceRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Dawood's backend server" });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
