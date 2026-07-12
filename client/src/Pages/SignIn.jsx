import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAUTH from "../Components/OAUTH";

const SignIn = () => {
  // usestate Hooks
  const [formData, setFormData] = useState({});

  //using the useSelector hook to get the current user from the redux store
  const { loading, error } = useSelector((state) => state.user);

  //useNavigate hook
  const navigate = useNavigate();

  //using the useDispatch hook to dispatch actions to the redux store
  const dispatch = useDispatch();

  // the HANDLECHANGE function
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    //A CHANGE I MADE BY MYSELF: I added this line to clear the error message when the user starts typing in the input fields
    error && dispatch(signInFailure(null));
  };

  // the HANDLESUBMIT function
  const handleSubmit = async (e) => {
    e.preventDefault(); //to prevent refresh on submit

    // for the SIGNUP loading effect
    dispatch(signInStart());

    //to stringify the formData and send it to the backend
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        //send message to the redux store ('userSlice.js) using the signInFailure action
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      //using the useNavigate hook to navigate to the sign-in page after successful signup
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <div className="sign-up p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-bold my-7 ">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          action=" "
          className="flex flex-col gap-4"
        >
          {/* <input
            type="text"
            placeholder="username"
            className="border p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          /> */}
          <input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg"
            id="password"
            onChange={handleChange}
          />
          <button
            type="submit"
            disabled={loading}
            className="uppercase bg-slate-700 text-white p-3 rounded-lg hover:opacity-75 disabled:opacity-60"
          >
            {loading ? "Loading ..." : "Sign in"}
          </button>
          <OAUTH />
        </form>

        <div className="flex gap-2 mt-5">
          <p className="">Don't have an account?</p>
          <Link
            to="/sign-up"
            className="text-blue-700 hover:underline underline-offset-2 decoration-2"
          >
            Sign up
          </Link>
        </div>
        {error && <p className="text-red-600 mt-5">{error}</p>}
      </div>
    </>
  );
};

export default SignIn;
