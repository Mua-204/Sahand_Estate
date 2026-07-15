import { errorHandler } from "./error.js";
import jwt  from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    //get the cookie from the browser
    const token = req.cookies.access_token;

    //Now to verify the User using the token we got from the browser
    if (!token) {
        return next(errorHandler(401,'Not Authorized'))
    }

    //handle verify callback// i separated it myself.
    const handleVerifyToken = (err, decodedUser) => {
//the "user" parameter above is actually the users ID

        if (err) {
            return next (errorHandler(403,'Invilid Token'))
        }
        req.user = decodedUser;//user data (THE id) from the cookie
        next() // calls the next  function in the ..ROUTE.JS FILE were it is being used
    }

    jwt.verify(token, process.env.JWT_SECRET,handleVerifyToken);
}