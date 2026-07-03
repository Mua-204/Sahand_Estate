import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res,next) => {
  //saving the request body from Insomnia to the database

    const { username, email, password } = req.body; //using destructuring to extract values from req.body objects
    const hashedPassword = bcrypt.hashSync(password, 10);
    
  const newUser = new User({ username, email, password:hashedPassword }); // distructing in a function parameter and also hashed the password b4 saving it to the database
  try {
    await newUser.save();
    //   res.send("Signup route reached!");
    res.status(201).json("User created successfully");
  } catch (error) {// res.status(500).json(error.message);
    
    next(error)//send the error to the error middleware in index.js
 }
};