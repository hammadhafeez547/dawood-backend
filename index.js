import express from "express";
import cors from "cors";
import userRoutes from "./routers/auth.js";
import carRoutes from "./routers/car.js";
import fareRoutes from "./routers/fare.js";
import rideRoutes from "./routers/ride.js";
import serviceRoutes from "./routers/service.js";

import routeRoutes from "./routers/routes.js";

import authRoutes  from "./routers/user.js";


import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
// Response headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://dawood-frontends.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors({
  origin: [
    'https://dawood-frontends.vercel.app',
    'http://localhost:3000' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routes
app.use("/routes", routeRoutes);

app.use("/auth", userRoutes);
app.use("/cars", carRoutes);
app.use("/fare", fareRoutes);
app.use("/ride", rideRoutes)
app.use("/user", authRoutes);
app.use("/service", serviceRoutes);

app.get("/"  , (req , res)=>{
res.json({
    message : "kaisa ho bhai ",
})
    
})

const PORT = process.env.PORT || 5000;
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

