import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";

const UpdateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const fileRef = useRef();
  //The USESTATE hooks
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
    const [uploading, setuploading] = useState(false);
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => { 
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);

            const data = await res.json();

            if (data.success === false) {
                console.log(data.message);
            }
            setFormData(data);
        }
        
        fetchListing();
    },[])
  //handleImageSubmit function
  const handleImageSubmit = async (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setuploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((secure_url) => {
          setFormData((prev) => {
            return {
              ...prev,
              imageUrls: prev.imageUrls.concat(secure_url),
            };
          });
          setuploading(false);
          setImageUploadError(false);
          setFiles([]); //ADDED THIS MYSELF TO AVOID DUPLICATION OF AN UPLOAD
          fileRef.current.value = ""; //added this myself too
        })
        .catch((error) => {
          setImageUploadError("Image upload failed");
          setuploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setuploading(false);
    }
  };

  //Handling the upload to cloudinary
  const storeImage = async (file) => {
    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "sahand_estate_listing_images");
    data.append("cloud_name", "adamcpye");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/adamcpye/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const uploadedImage = await res.json();

    if (!res.ok) {
      throw new Error(uploadedImage.error.message);
    }

    return uploadedImage.secure_url;
  };

  //to delete an inintially uploaded image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: formData.imageUrls.filter((url, indx) => indx !== index),
    }));
  };

  //Function that handles Input changes
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData((prev) => ({ ...prev, type: e.target.id }));
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
    }
    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  //Function to handle the create listing. that is function to post the 'formData' inputs to mongo DB
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Ensure an image must be uploaded b4 creating a list
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }
      // ensure that if there is an offer, regularPrice must be less than discounted price
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount Price must be less than regular Price");
      }

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = await res.json();

      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        }
        
        //Navigate/move into the Listing Page
    //   navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <main className="p-3 max-w-4xl mx-auto mb-5">
        <h1 className="text-3xl font-bold text-center my-7">Update  Listing</h1>
        <form
          onSubmit={handleSubmit}
          action=""
          className="flex flex-col sm:max-w-[80%] mx-auto lg:max-w-none lg:flex-row gap-6"
        >
          <div className="flex flex-col gap-4 flex-1">
            {/* Text Inputs */}
            <input
              type="text"
              className="border p-3 placeholder:text-gray-500 rounded-lg border-none bg-slate-200"
              id="name"
              placeholder="Place Name"
              maxLength="70"
              minLength="10"
              required
              onChange={handleChange}
              value={formData.name}
            />

            <textarea
              type="text"
              className=" p-3 placeholder:text-gray-500 rounded-lg border-none bg-slate-200"
              id="description"
              placeholder="Description"
              required
              onChange={handleChange}
              value={formData.description}
            />

            <input
              type="text"
              className=" p-3 placeholder:text-gray-500 rounded-lg border-none bg-slate-200"
              id="address"
              placeholder="Address"
              required
              onChange={handleChange}
              value={formData.address}
            />
            <div className="flex flex-wrap gap-7 font-medium mt-3">
              {/* Type input */}
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  name="sale"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                  id="sale"
                  className="w-7"
                />
                <label htmlFor="sale">Sell</label>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                  name="rent"
                  id="rent"
                  className="w-7"
                />
                <label htmlFor="rent">Rent</label>
              </div>
              {/* Amenities inputs */}
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={handleChange}
                  checked={formData.parking}
                  name="parking"
                  id="parking"
                  className="w-7"
                />
                <label htmlFor="parking">Parking Spot</label>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  name="furnished"
                  onChange={handleChange}
                  checked={formData.furnished}
                  id="furnished"
                  className="w-7"
                />
                <label htmlFor="furnished">Furnished</label>
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={handleChange}
                  checked={formData.offer}
                  name="offer"
                  id="offer"
                  className="w-7"
                />
                <label htmlFor="offer">Offer</label>
              </div>
            </div>
            {/* ROOMS and PRICE inputs */}
            <div className="flex flex-wrap gap-6 mt-3">
              {/* ROOMS inputs */}
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="bedrooms"
                  onChange={handleChange}
                  value={formData.bedrooms}
                  name="bedroom"
                  className="p-2 border border-gray-800 font-medium text-[19px]  rounded-lg"
                  min="1"
                  max="4"
                  required
                />
                <label htmlFor="bedrooms" className=" font-semibold">
                  Bedroom
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="bathrooms"
                  onChange={handleChange}
                  value={formData.bathrooms}
                  name="bathrooms"
                  className="p-2 border border-gray-800 font-medium text-[19px]  rounded-lg"
                  min="1"
                  max="4"
                  required
                />
                <label htmlFor="bathrooms" className=" font-semibold">
                  Bathrooms
                </label>
              </div>
              {/* THE PRICES */}

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="regularPrice"
                  onChange={handleChange}
                  value={formData.regularPrice}
                  name="regularPrice"
                  className="p-2 border border-gray-800 font-medium text-[19px]  rounded-lg"
                  min="50"
                  max="1000"
                  required
                />
                <div className="flex items-center gap-1 flex-col">
                  <p htmlFor="regularPrice" className=" font-semibold">
                    Regular price
                  </p>
                  <span className="text-xs">($ / Month)</span>
                </div>
              </div>
              {formData.offer && (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="discountPrice"
                    onChange={handleChange}
                    value={formData.discountPrice}
                    name="discountPrice"
                    className="p-2 border border-gray-800 font-medium text-[19px]  rounded-lg"
                    min="0"
                    max="10000"
                    required
                  />
                  <div className="flex items-center flex-col gap-1">
                    <p htmlFor="discountPrice" className=" font-semibold">
                      Discounted price
                    </p>
                    <span className="text-xs">($ / Month)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* second side */}
          <div className="flex flex-col flex-1 gap-4 mt-3 lg:mt-0">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>

            {/* Image Input */}
            <div className="flex gap-4">
              <input
                type="file"
                ref={fileRef}
                onChange={(e) => setFiles(e.target.files)}
                id="images"
                className="border-gray-300 p-3 rounded w-full border"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                disabled={files.length === 0 || uploading || loading}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-80"
              >
                {uploading ? "Uploading" : "Upload"}
              </button>
            </div>
            <p className="text-red-700 text-small">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center rounded-lg"
                >
                  <img
                    src={url}
                    alt="listing images"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    type="button"
                    className="rounded-lg border bg-[#FEF5E6] hover:bg-[#72a1d6] hover:text-white p-3 text-red-600 uppercase "
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button
              type="submit"
              disabled={loading || uploading}
              className="p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 dispabled:opacity-60 disabled:cursor-not-allowed "
            >
              {loading ? "Updating..." : "Update listing"}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </div>
        </form>
      </main>
    </>
  );
};

export default UpdateListing;
