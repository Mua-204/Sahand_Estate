import Listing from '../models/listingModel.js'
import { errorHandler } from '../utils/error.js';

//CREATE listing API Controller
export const CreateListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);

        return res.status(201).json(listing);

        
    } catch (error) {
        next(error)
    }
};

//DELETE listing API Controller
export const deleteListing = async (req, res, next) => {
    //to check if listing exists
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404,'Listing not found'))
    }
    console.log(listing)


    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401,'You can only delete your own listings!!'))
    }
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing Deleted')

    } catch (error) {
        next(error)
    }
}

//UPDATE listing API Controller

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    //To check if listing actually exists
    if (!listing) {
        return next(errorHandler(404,'Listing not found'))
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401,'You can only update your own listings'))
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,req.body,{new:true}
    );

        res.status(200).json(updatedListing)
    } catch (err) {
        return next(error)
    }

}

//GET listing API Controller
export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'));
        };

        res.status(200).json(listing);
        
    } catch (error) {
        next(error);
   }
 };