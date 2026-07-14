


//How my code would look with FIREBASE STORAGE

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';//SAHANDS FIREBASE APPROACH 
import { app } from '../firebase.js'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [file, setFile] = useState(undefined); //to store my image file
  const [formData, setFormData] = useState({});
  const [filePerc,setFilePerc]=useState(0)

  const fileRef = useRef(null);

  //useEffect to see changes in the file usestate and to post the image file to firebase/cloudinary
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // TO Handle Upload function//SAHANDS APPROACH
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    //upload task
    const uploadTask = uploadBytesResumable(storageRef, file);

    //To track the state change
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },

      //callback function
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
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
              src={currentUser.avatar}
              alt="profile"
              className="rounded-full h-24 w-24 self-center cursor-pointer object-cover"
            />
          </div>
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
}

export default Profile
