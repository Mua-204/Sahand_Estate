import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [filePerc, setFilePerc] = useState(0);
  const [file, setFile] = useState(undefined); //to store my image file
  const [formData, setFormData] = useState({});
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


  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mt-7 mb-5">Profile</h1>
        <form className="flex flex-col gap-4">
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
              <span className="text-red-700">Error: Image Upload Unsuccessful</span>
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
            id="username"
            placeholder="username"
            className="border-none bg-slate-200 p-3 rounded-lg"
          />

          <input
            type="text"
            id="email"
            placeholder="email"
            className="border-none bg-slate-200 p-3 rounded-lg"
          />
          <input
            type="text"
            id="password"
            placeholder="password"
            className="border-none bg-slate-200 p-3 rounded-lg"
          />
          <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
            update
          </button>
        </form>

        <div className="flex justify-between mt-5">
          <span
            className="cursor-pointer text-red-700 hover:underline underline-offset-2"
            id="deleteAccount"
          >
            Delete Account
          </span>

          <span
            className="cursor-pointer text-red-700 hover:underline underline-offset-2"
            id="signOut"
          >
            Sign out
          </span>
        </div>
      </div>
    </>
  );
};

export default Profile;
