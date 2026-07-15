import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from './routes/listing.route.js'

import cookieParser from "cookie-parser";


dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("Database connected successfully");

  app.listen(3000, () => {
    console.log("Server is running on port 3000!!!!");
  });
}).catch((err) => {
  console.log("Database connection failed:", err);
})

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);


//creating a MIDDLEWARE to handle errors
app.use((err, req, res, next) => {
  //the next argument is used to pass the error to the next middleware

  const statusCode = err.statusCode || 500;//statusCode is used to set the status code of the response.
  const message = err.message || 'internal server error';
  
  res.status(statusCode).json({
    success: false,
    statusCode,
     message
  });
})