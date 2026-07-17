import User from "../models/userModel.js";
import Listing from "../models/listingModel.js"
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
  res.json({ message: "Api is working" });
};

//The Update User API controller
export const UpdateUser = async (req, res, next) => {
  //1. "req.params.id" comes from the URL as stated in user.route.js. It is automatically stored there by Express whent the url.route is visited
  //2. "req.user.id" was created by me after i confirmed that the token that came with the request was created by my JWT_SECRET. Check "../utils/verifyUser.js" file.
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account!!"));
  }
  try {
    if (req.body.password) {
      //to hash the password if it was changed
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    //To update the users data in Mongo db
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    //separate the password from other inputs
    const { password: pass, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//The delete User API controller

export const DeleteUser = async (req, res, next)=> {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can only delete your own account'));
  }
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie('access_token')

    res.status(200).json('User has been Deleted!')

   } catch (error) {
    next(error)
  }

};

//The getUserListings API controller

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    console.log(req.params.id)
    try {
      const listings = await Listing.find({ userRef: req.params.id })
      res.status(200).json(listings)
    
    } catch (error) {
      next(error)    
    }
  } else {
    return next(errorHandler(401,'You can only view your own listings!!'))
  }
  
};