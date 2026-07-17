import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import {Link} from 'react-router-dom'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser ,loading,error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  //my UseState hooks
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePerc, setFilePerc] = useState(0);
  const [file, setFile] = useState(undefined); //to store my image file
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingDeleteError, setListingDeleteError] = useState(false);
  

  //Cloudinary
  const CLOUD_NAME = "adamcpye"; //my CLOUD_NAME in cloudinary
  const UPLOAD_PRESET = "sahand_estate_profile_images"; //my UPLOAD_PRESET name in cloudinary

  const fileRef = useRef(null);

  //useEffect to see changes in the file usestate and to post the image file to firebase/cloudinary
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  //TO Handle Upload function //Using CLOUDINARY
  const handleFileUpload = async (file) => {
    try {
      //use the default javascript FORMDATA method to store some omy inputs
      const data = new FormData();

      //temporarily store my image file in the default javascript FORMDATA method
      data.append("file", file);

      //temporarily store my Cloudinary UPLOAD_PRESET in the default javascript FORMDATA method
      data.append("upload_preset", UPLOAD_PRESET);

      //temporarily store my Cloudinary Cloud_name in the default javascript FORMDATA method
      data.append("cloud_name", CLOUD_NAME);

      setFilePerc("Uploading Image...");

      //Upload all the data stored in the default javascript FORMDATA method to cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/adamcpye/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      //receiving the response from cloudinary
      const uploadedImage = await res.json();

      if (res.ok) {
        //save the image in my formData USESTATE i created initially
        setFormData((prev) => ({
          ...prev,
          avatar: uploadedImage.secure_url,
        }));
        //Handle the file percentage after the image url is gotten
        setFilePerc(100);
      } else if (!res.ok) {
        throw new Error(uploadedImage.error.message);
      }
    } catch (error) {
      console.log(error);
      setFileUploadError(true);
    }
  };

  //To handle change
  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  //To handle Update submition
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data= await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  };

  //TO HANDLE DELETE USER DATA FROM MONGO DB
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
     const  res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: 'DELETE'
    });
      const data = await res.json();
      if (data.success===false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data))
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  //To handle SIGN-OUT
  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart())
      const res = await fetch('/api/auth/signout', {
        method: 'GET',
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(signoutUserFailure(data.message));
        return;
        
      }
      dispatch(signoutUserSuccess(data))
      
    } catch (error) {
        dispatch(signoutUserFailure(data.message));
      
    }
  };
  // to handle showing  a User's Listings
  const handleShowListing = async () => {
    // console.log(currentUser)
    setShowListingError(false)
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success===false) {
        setShowListingError(data.message)
        return;
      }
      setUserListings(data);
      setShowListingError(false);
    } catch (error) {
      setShowListingError(true);
    }
  }

  //to handle delete listing
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method:'DELETE'
      })
      const data = await res.json();
      if (data.success==false) {
        console.log(data.message)
        setListingDeleteError(true)
        return;
      }

      setUserListings((prev) => prev.filter((listing)=>listing._id !== listingId))
    } catch (error) {
      setListingDeleteError(error.message)
    }
  }

  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mt-7 mb-5">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className=" rounded-full h-25 m-auto  w-25 flex justify-center overflow-hidden mt-2">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="profile"
              className="rounded-full h-24 w-24 self-center cursor-pointer object-cover"
            />
          </div>

          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error: Image Upload Unsuccessful
              </span>
            ) : filePerc !== 0 && filePerc !== 100 ? (
              <span className="text-slate-700">{filePerc}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-600">
                Image Successfully Uploaded{" "}
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            onChange={handleChange}
            id="username"
            defaultValue={currentUser.username}
            placeholder="username"
            className="border-none bg-slate-200 p-3 rounded-lg"
          />

          <input
            type="email"
            onChange={handleChange}
            id="email"
            defaultValue={currentUser.email}
            placeholder="email"
            className="border-none bg-slate-200 p-3 rounded-lg"
          />
          <input
            type="password"
            onChange={handleChange}
            id="password"
            placeholder="password"
            className="border-none bg-slate-200 p-3 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-80"
          >
            {loading ? "Loading" : "Update"}
          </button>

          {/* The create lising link */}
          <Link
            className="bg-green-700 p-3 rounded-lg uppercase text-white text-center hover:opacity-80"
            to={"/create-listing"}
          >
            Create Listing
          </Link>
        </form>

        <div className="flex justify-between mt-5">
          <span
            className="cursor-pointer text-red-700 hover:underline underline-offset-2"
            id="deleteAccount"
            onClick={handleDeleteUser}
          >
            Delete Account
          </span>

          <span
            className="cursor-pointer text-red-700 hover:underline underline-offset-2"
            id="signOut"
            onClick={handleSignOut}
          >
            Sign out
          </span>
        </div>
        <p className="mt-5 text-red-700">{error ? error : ""}</p>
        <p className="mt-5 text-green-700 font-medium">
          {updateSuccess ? "User Updated Successful" : ""}
        </p>

        <button
          onClick={userListings.length<=0?handleShowListing:()=>setUserListings([])}
          className="text-green-700 w-full hover:underline underline-offset-2"
        >
          Show Listings
        </button>

        {/* showing users listings */}

        <p className="text-red-700 mt-3 text-center">
          {showListingError && "Error showing listings"}
        </p>

          {userListings && userListings.length > 0 && (
            <div className=" flex flex-col gap-5 bg-slate-200 rounded-lg px-4 pb-4">
              <h1   className="text-2xl text-center mt-7 font-bold underline underline-offset-2">
                Your Listings
              </h1>
              {userListings.map((listItems) => {
                return (
                  <div
                    key={listItems._id}
                    className="border rounded-lg p-3 flex justify-between items-center gap-4"
                  >
                    <Link to={`/listing/${listItems._id}`}>
                      <img
                        src={listItems.imageUrls[0]}
                        className="h-16 w-16 object-contain "
                        alt="listing image cover"
                      />
                    </Link>
                    <Link
                      className="text-slate-700 flex-1 font-semibold hover:underline truncate underline-offset-2"
                      to={`/listing/${listItems._id}`}
                    >
                      <p>{listItems.name}</p>
                    </Link>
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleListingDelete(listItems._id)}
                        className="uppercase text-red-700 hover:underline underline-offset-2"
                      >
                        Delete
                      </button>
                      <Link to={`/update-listing/${listItems._id}`}>
                        <button className="text-green-700 uppercase hover:underline underline-offset-2">
                          edit
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </>
  );
};

export default Profile;
