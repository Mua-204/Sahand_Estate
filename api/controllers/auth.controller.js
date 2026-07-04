import User from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'

export const signup = async (req, res,next) => {

    const { username, email, password } = req.body; //using destructuring to extract values from req.body objects
    const hashedPassword = bcryptjs.hashSync(password, 10);
    
  const newUser = new User({ username, email, password:hashedPassword }); // distructing in a function parameter and also hashed the password b4 saving it to the database
  try {
    await newUser.save();
    //   res.send("Signup route reached!");
    res.status(201).json("User created successfully");
  } catch (error) {// res.status(500).json(error.message);
    
    next(error)//send the error to the error middleware in index.js
 }
};

//SIGNIN API
export const signin = async (req, res, next) => { 
  const { email, password } = req.body;

  try { 
    const validUser = await User.findOne({ email });

    //to validate user by email
    if (!validUser) return next(errorHandler(404, 'User not found!!'))
    
    //to compare password input from client with the one for the validated  user in mongo db
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if (!validPassword) return next(errorHandler(401, 'Wrong credential!!'))
  
    
    //to create cookies using jwt
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET,);
    const { password: pass, ...rest } = validUser._doc;


    //created the cookie and sent it to the client with the user data
    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
    
  } catch (error) {
    next(error);
  }
};