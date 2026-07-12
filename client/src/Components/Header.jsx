import React from "react";
import { Link } from "react-router";
import { FaSearch } from "react-icons/fa"
import { useSelector } from "react-redux";

const Header = () => {
  const {currentUser}=useSelector(state=> state.user)

  return (
    <>
      <header className="bg-slate-200 shadow-md select-none">
        <div className="flex max-w-6xl justify-between mx-auto items-center px-4 py-3">
          <Link to="/">
            <h1 className="flex flex-wrap sm:text-xl font-bold">
              <span className="text-slate-500">Sahand</span>
              <span className="text-slate-700">Estate</span>
            </h1>
          </Link>
          <form className="bg-slate-100 items-center rounded-lg p-3 flex">
            <input
              type="text"
              placeholder="Search..."
              className="focus:outline-none w-24 sm:w-64 bg-transparent font-medium"
            />
            <FaSearch className="text-slate-600" />
          </form>
          <ul className="flex gap-5 font-medium">
            <Link to="/">
              <li className="text-slate-700 hover:underline  hidden sm:inline decoration-2 decoration-slate-700">
                Home
              </li>
            </Link>
            <Link to="/about">
              <li className="text-slate-700 hover:underline  hidden sm:inline decoration-2 decoration-slate-700">
                About
              </li>
            </Link>
            <Link to="/profile">
              {currentUser ? (
                <img src={currentUser.avatar} className="rounded-full w-7 h-7 object-cover" alt="" />
              ) : (
                <li className="text-slate-700 hover:underline underline-offset-3 decoration-2 decoration-slate-700">
                  Sign in
                </li>
              )}
            </Link>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
