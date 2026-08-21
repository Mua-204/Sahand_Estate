import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ContactLandLord({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

  const onChangeFnx = (e) => {
    setMessage(e.target.value);
  }
    //Useeffect to fetch the landlord data from the backend
    useEffect(() => { 
        const fetchLandlord = async () => { 
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);

            } catch (error) { 
                console.log(error);

            }
        }

        fetchLandlord();

    }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>

          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChangeFnx}
            className=" w-full border p-3 rounded-lg"
            placeholder="Enter your message"
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=${encodeURIComponent(
              `Regarding ${listing.name}`
            )}&body=${encodeURIComponent(message)}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

