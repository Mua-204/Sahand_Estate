import React from "react";
import { Link } from "react-router-dom";
import SignIn from "./SignIn";

const SignUp = () => {
  return (
    <>
      <div className="sign-up p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-bold my-7 ">Sign Up</h1>
        <form action=" " className="flex flex-col gap-4">
          <input type="text" placeholder="username" className="border p-3 rounded-lg" id="usernam" />
          <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" />
          <input type="password" placeholder="Password" className="border p-3 rounded-lg" id="password" />
          <button className="uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-75 disabled:opacity-60">Sign up</button>
        </form>

        <div className="flex gap-2 mt-5" >
          <p className="">Have an account?</p>
          <Link to="/sign-in" className="text-blue-700 hover:underline underline-offset-2 decoration-2">Sign in</Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
