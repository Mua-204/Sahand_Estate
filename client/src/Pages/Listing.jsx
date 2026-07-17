import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'

// Imports from swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle'

const Listing = () => {
    SwiperCore.use([Navigation])
    const params = useParams()
    const [listing, setListing] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        const fetchListing = async () => {
            try {
                setloading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setloading(false);
                    return;
                }
                setListing(data);
                setloading(false);
                setError(false)
            } catch (err) {
                setError(true);
                setloading(false);
            }
        };

        fetchListing();
    }, [params.listingId]);


    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}
            {listing && !loading && !error && (
                <>
                <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div className='h-137.5 m-2' style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover'}}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                </>
            )}
        </main>
    );
}

export default Listing
