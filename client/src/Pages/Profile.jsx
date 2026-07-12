import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const {currentUser}=useSelector(state=> state.user)
  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mt-7 mb-5">Profile</h1>
        <form className="flex flex-col gap-4">
          <img
            src={currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 self-center mt-2 cursor-pointer object-cover"
          />
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
          <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
        </form>

        <div className='flex justify-between mt-5'>
          <span className='cursor-pointer text-red-700 hover:underline underline-offset-2' id='deleteAccount'>Delete Account</span>

          <span className='cursor-pointer text-red-700 hover:underline underline-offset-2' id='signOut'>Sign out</span>
        </div>
      </div>
    </>
  );
}

export default Profile
