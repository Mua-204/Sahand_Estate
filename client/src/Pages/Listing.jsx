import React,{useEffect, useState,useRef} from "react";

    

const Listing = () => {

 const fileRef = useRef();
 const [formData, setFormData] = useState({imageUrls:[],})
 const [imageUploadError, setImageUploadError] = useState(false);
 const [files, setFiles] = useState([]);
    const [uploading, setuploading] = useState(false);
  

  //handleImageSubmit function
    const handleImageSubmit = async (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setuploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++){
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((secure_url) => {
              setFormData((prev) => {
                return {
                  ...prev,
                  imageUrls: prev.imageUrls.concat(secure_url),
                };
              });
                setuploading(false);
                setImageUploadError(false) 
            setFiles([]);//ADDED THIS MYSELF TO AVOID DUPLICATION OF AN UPLOAD
            fileRef.current.value = "";//added this myself too
            })
                .catch((error) => {
                setImageUploadError('Image upload failed')
                setuploading(false)
            })
        }
        else {
            setImageUploadError('You can only upload 6 images per listing')
            setuploading(false);    

        }
       
    }
    
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
            imageUrls: formData.imageUrls.filter((url, indx) => indx !== index,)
        }))
    }
   

  return (
    <>
      <main className="p-3 max-w-4xl mx-auto mb-5">
        <h1 className="text-3xl font-bold text-center my-7">Create Listing</h1>
        <form
          action=""
          className="flex flex-col sm:max-w-[80%] mx-auto lg:max-w-none lg:flex-row gap-6"
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              className="border p-3 placeholder:text-gray-500 rounded-lg border-none bg-slate-200"
              id="name"
              placeholder="Place Name"
              maxLength="70"
              minLength="10"
              required
            />

            <textarea
              type="text"
              className=" p-3 placeholder:text-gray-500 rounded-lg border-none bg-slate-200"
              id="description"
              placeholder="Description"
              required
            />

            <input
              type="text"
              className=" p-3 placeholder:text-gray-500 rounded-lg border-none bg-slate-200"
              id="address"
              placeholder="Address"
              required
            />
            <div className="flex flex-wrap gap-7 font-medium mt-3">
              <div className="flex gap-2">
                <input type="checkbox" name="sale" id="sale" className="w-7" />
                <label htmlFor="sale">Promo deal</label>
              </div>
              <div className="flex gap-2">
                <input type="checkbox" name="rent" id="rent" className="w-7" />
                <label htmlFor="rent">Rent</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
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
                  id="furnished"
                  className="w-7"
                />
                <label htmlFor="furnished">Furnished</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  name="offer"
                  id="offer"
                  className="w-7"
                />
                <label htmlFor="offer">Offer</label>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-3">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="bedrooms"
                  name="bedroom"
                  className="p-2 border border-gray-800 font-medium text-[19px]  rounded-lg"
                  min="1"
                  max="4"
                  defaultValue="1"
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
                  name="bathrooms"
                  className="p-2 border border-gray-800 font-medium text-[19px]  rounded-lg"
                  min="1"
                  max="4"
                  defaultValue="1"
                  required
                />
                <label htmlFor="bathrooms" className=" font-semibold">
                  Bathrooms
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="regularPrice"
                  name="regularPrice"
                  className="p-2 border border-gray-800 font-medium text-[19px]  rounded-lg"
                  min="1"
                  max="4"
                  required
                />
                <div className="flex items-center gap-1 flex-col">
                  <p htmlFor="regularPrice" className=" font-semibold">
                    Regular price
                  </p>
                  <span className="text-xs">($ / Month)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  className="p-2 border border-gray-800 font-medium text-[19px]  rounded-lg"
                  min="1"
                  max="4"
                  required
                />
                <div className="flex items-center flex-col gap-1">
                  <p htmlFor="discountPrice" className=" font-semibold">
                    Discounted price
                  </p>
                  <span className="text-xs">($ / Month)</span>
                </div>
              </div>
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
                disabled={files.length === 0 || uploading}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-80"
              >
                {uploading?'Uploading':'Upload'}
              </button>
            </div>
            <p className="text-red-700 text-small">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url,index) => (
                <div key={url} className="flex justify-between p-3 border items-center rounded-lg">
                  <img
                    src={url}
                    alt="listing images"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                  <button onClick={()=>handleRemoveImage(index)}
                    type="button"
                    className="rounded-lg border bg-[#FEF5E6] hover:bg-[#72a1d6] hover:text-white p-3 text-red-600 uppercase "
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button className="p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 dispabled:opacity-60 ">
              Create listing
            </button>
          </div>
        </form>
      </main>
    </>
  );
};

export default Listing;
