import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import About from './Pages/About'
import Profile from './Pages/Profile'
import SignIn from './Pages/SignIn'
import SignUp from './Pages/SignUp'
import Create_Listing from './Pages/CreateListing.jsx'
import UpdateListing from './Pages/UpdateListing.jsx'
import Header from './Components/Header'
import PrivateRoute from "./Components/PrivateRoute.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-listing" element={<Create_Listing />} />
            <Route path="/create-listing" element={<Create_Listing />} />
            {/* The part [:listingId] is called a route parameter (or URL parameter).
            The : tells React Router: "This part of the URL is dynamic. Whatever appears here, save it under the name listingId." */}
            <Route
              path="/update-listing/:listingId"
              element={<UpdateListing />}
            />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
