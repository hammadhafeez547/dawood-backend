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
// ✅ Best order
const allowedOrigins = [
  "http://localhost:3000",
  "https://dawood-frontends.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman or curl (no origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS: Not allowed by policy"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));


// // ✅ Custom headers
// app.use((req, res, next) => {
//   const allowedOrigins = ['http://localhost:3000', 'https://dawood-frontends.vercel.app'];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

// ✅ Then JSON parsers
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
    message : "Hello from Dawood's backend server",
})
    
})

const PORT = process.env.PORT || 5000;
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

