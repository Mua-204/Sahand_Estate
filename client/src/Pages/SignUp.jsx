import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import OAUTH from "../Components/OAUTH";

const SignUp = () => {
  // usestate Hooks
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  //useNavigate hook
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }
  // the HANDLESUBMIT function
  const handleSubmit = async (e) => {
    e.preventDefault();//to prevent refresh on submit

    // for the SIGNUP loading effect
    setLoading(true);


    //to stringify the formData and send it to the backend
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setError(null);
      setLoading(false);
      //using the useNavigate hook to navigate to the sign-in page after successful signup
      navigate("/sign-in");
     } catch (error) { 
       setError(error.message);
      setLoading(false);
    };
    
  };



  return (
    <>
      <div className="sign-up p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-bold my-7 ">Sign Up</h1>
        <form
          onSubmit={handleSubmit}
          action=" "
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="username"
            className="border p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          />
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
            {loading ? "Loading ..." : "Sign up"}
          </button>
          <OAUTH />
        </form>

        <div className="flex gap-2 mt-5">
          <p className="">Have an account?</p>
          <Link
            to="/sign-in"
            className="text-blue-700 hover:underline underline-offset-2 decoration-2"
          >
            Sign in
          </Link>
        </div>
        {error && <p className="text-red-600 mt-5">{error}</p>}
      </div>
    </>
  );
};

export default SignUp;
