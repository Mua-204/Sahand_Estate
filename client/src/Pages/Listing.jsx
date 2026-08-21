import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ContactLandlord from '../Components/ContactLandlord';
import { useSelector } from 'react-redux';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";

// Imports from swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle'

const Listing = () => {
    SwiperCore.use([Navigation])
    const params = useParams()
    const [listing, setListing] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

    //React Redux UseSelector
    const { currentUser } = useSelector((state) => state.user);


  // console.log("Current User:", currentUser);
  // console.log("lising:", listing);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setloading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setloading(false);
                    return;
                }
                setListing(data);
                setloading(false);
                setError(false)
            } catch (err) {
                setError(true);
                setloading(false);
            }
        };

        fetchListing();
    }, [params.listingId]);


    return (
      <main>
        {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
        {error && (
          <p className="text-center my-7 text-2xl text-red-700">
            Something went wrong
          </p>
        )}
        {listing && !loading && !error && (
          <>
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-137.5 m-2"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
              <FaShare
                className="text-slate-500"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              />
            </div>
            {copied && (
              <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                {" "}
                Link copied!{" "}
              </p>
            )}

            {/*  */}
            <div className="flex flex-col max-w-4xl mx-auto p-3 mb-7 mt-4 gap-4">
              <p className="text-2xl font-semibold">
                {listing.name} - &#x20A6;{" "}
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
                {listing.type === "rent" && " / month"}
              </p>
              <p className="flex items-center mt-3 gap-2 text-slate-600 font-medium text-md">
                <FaMapMarkerAlt className="text-green-700" />
                {listing.address}
              </p>
              <div className="flex gap-4">
                <p className="bg-red-900 w-full max-w-50 text-white text-center p-1 rounded-md">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </p>
                {listing.offer && (
                  <p className="bg-green-900 w-full max-w-50 text-white text-center p-1 rounded-md">
                    &#x20A6;{+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>

              <p className="text-slate-800">
                <span className="font-semibold text-black">Description - </span>
                {listing.description}
              </p>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds `
                    : `${listing.bedrooms} bed `}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths `
                    : `${listing.bathrooms} bath `}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaParking className="text-lg" />
                  {listing.parking ? "Parking spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-1 whitespace-nowrap ">
                  <FaChair className="text-lg" />
                  {listing.furnished ? "Furnished" : "Unfurnished"}
                </li>
              </ul>

              {currentUser &&
                currentUser._id !== listing.userRef &&
                !contactLandlord && (
                  <div className="mt-6 mx-7 space-y-4">
                    {/* Contact Landlord */}
                    <button
                      onClick={() => setContactLandlord(true)}
                      className="flex items-center justify-center w-full gap-2
                 p-3 bg-slate-700 text-white font-semibold
                 rounded-lg shadow-sm
                 hover:bg-slate-800 transition duration-200"
                    >
                      Contact Landlord
                    </button>

                    {/* WhatsApp Contact */}
                    <button
                      onClick={() => setContactLandlord(true)}
                      className="flex items-center justify-center w-full gap-3 p-3 bg-green-600 text-white font-semibold rounded-lg shadow-sm  hover:bg-green-700 transition duration-200"
                    >
                      <span className="flex items-center justify-center w-8 h-8 bg-white rounded-full p-1">
                        <img
                          src="https://res.cloudinary.com/adamcpye/image/upload/v1787282090/whatsapp-vector-logo-icon-logotype-vector-social-media_901408-406_ynesbd.jpg"
                          alt="WhatsApp logo"
                          className="w-full h-full object-contain rounded-full"
                        />
                      </span>

                      <span>Landlord WhatsApp Contact</span>
                    </button>
                  </div>
                )}
              
              {contactLandlord && <ContactLandlord listing={listing } />}
            </div>
          </>
        )}
      </main>
    );
}

export default Listing

