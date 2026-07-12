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
    if (!validPassword) return next(errorHandler(401, 'Invalid credential!!'))
  
    
    //to create token using jwt
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET,);
    const { password: pass, ...rest } = validUser._doc;


    //created the cookie and sent it to the client with the user data
    res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//GOOGLE OAUTH API
export const google = async (req, res, next) => {
  try {
    //checking if the user exist in the database
    const user = await User.findOne({ email: req.body.email });
    
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;


      //create the cookie
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      //To register a new user

      //Since the data/object from the google account doesn't have a password, we need to generate a random password for users signing in with google to actually store the datas in mongo db as the PASSWORD input in the User model is required

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      //to remove the white space in the username that google provides and to also make it unique
      const finalUsername =
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);

      //to generate a new users data
      const newUser = new User({
        username: finalUsername,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      //To  peaste/store the new user's data in my database (mongo db)
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }

    

  } catch (error) {
    next(error);
  }
};