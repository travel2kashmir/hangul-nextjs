import { useState, useRef, useEffect } from 'react'
import Carousel from 'better-react-carousel'
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";
import axios from 'axios';
const logger = require("../../services/logger");
import Router, { useRouter } from "next/router";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
var language;
var currentUser;
var currentProperty;
var currentLogged;
var i =0;

function Themedefault() {
      const maxScrollWidth = useRef(0);
      const [currentIndex, setCurrentIndex] = useState(0);
      const [amenity, setAmenity] = useState(false);
      const [room, setRoom] = useState(false);
      const carousel = useRef(null);
      const [allHotelDetails, setAllHotelDetails] = useState([]);

 /** Router for Redirection **/
  const router = useRouter();
  useEffect(() => {
    const firstfun = () => {
      if (typeof window !== 'undefined') {
        var locale = localStorage.getItem("Language");
        if (locale === "ar") {
          language = arabic;
        }
        if (locale === "en") {
          language = english;
        }
        if (locale === "fr") {
          language = french;
        }
        currentUser = JSON.parse(localStorage.getItem("Signin Details"));
        /** Current Property Details fetched from the local storage **/
        currentProperty = JSON.parse(localStorage.getItem("property"));
        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      }
    }
    firstfun();
    router.push("./classictheme");
  }, [])

  /* Function call to fetch Current Property Details when page loads */
  useEffect(() => {
    const fetchHotelDetails = async () => {
      const url = `/api/${currentProperty.address_province.replace(
        /\s+/g,
        "-"
      )}/${currentProperty.address_city}/${currentProperty.property_category
        }s/${currentProperty.property_id}`;
      axios.get(url)
        .then((response) => {
          setAllHotelDetails(response.data);

          logger.info("url  to fetch property details hitted successfully")
        })
        .catch((error) => { logger.error("url to fetch property details, failed") });
    }

    fetchHotelDetails();

  }, []);

      const movePrev = () => {
        if (currentIndex > 0) {
          setCurrentIndex((prevState) => prevState - 1);
        }
      };
    
      const moveNext = () => {
        if (
          carousel.current !== null &&
          carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
        ) {
          setCurrentIndex((prevState) => prevState + 1);
        }
      };
    
      const isDisabled = (direction) => {
        if (direction === 'prev') {
          return currentIndex <= 0;
        }
    
        if (direction === 'next' && carousel.current !== null) {
          return (
            carousel.current.offsetWidth * currentIndex >= maxScrollWidth.current
          );
        }
    
        return false;
      };
    
      useEffect(() => {
        if (carousel !== null && carousel.current !== null) {
          carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
        }
      }, [currentIndex]);
    
      useEffect(() => {
        maxScrollWidth.current = carousel.current
          ? carousel.current.scrollWidth - carousel.current.offsetWidth
          : 0;
      }, []);


  return (
    <>
        <div className="header">
   <div className="container">
      <div className="header-logo">
         <span className="material-icons-outlined header-logo-icon">
         </span>{allHotelDetails?.property_name}
      </div>
    
      <div className="menu-toggle">
         <span className="material-icons-outlined"> menu </span>
      </div>
     
      <ul className="header-menu">
      <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-cyan-600 focus:border-cyan-600 block w-32 py-1 px-2">
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="ar">Arabic</option>
                      </select>
         <a
            href="https://github.com/tangoren/tailwind-css-travel-booking"
            className="header-menu-item"
            target="_blank"
            rel="noopener noreferrer"
            >GitHub</a
            >
         <a
            href="https://codepen.io/tangoren/pen/jOajGGv"
            className="header-menu-item"
            target="_blank"
            rel="noopener noreferrer"
            >CodePen</a
            >
         <a
            href="https://www.linkedin.com/in/tangoren/"
            className="header-menu-item"
            target="_blank"
            rel="noopener noreferrer"
            >LinkedIn</a
            >
         <div className="header-menu-copyright">Made with Tailwind CSS</div>
      </ul>
    
   </div>
</div>

<div className="tour container">
   <div className="tour-head">
      <div className="tour-head-left">
         <div className="tour-title">
           {allHotelDetails?.description_title}
         </div>
         <div className="tour-overview">
            <div className="tour-overview-item">
               {allHotelDetails?.property_category} in <span>{allHotelDetails?.address?.[i]?.address_city}</span>
            </div>
            <div className="tour-overview-item"><span>{allHotelDetails?.star_rating} Star</span> Accommodation</div>  
        
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-4 text-yellow-500" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                              </svg>
                              
            <div className="tour-overview-item">   <span>4.7</span> (55 reviews)</div>
          
         </div>
      </div>
   </div>
  
   <div className="tour-wrapper">
      <div className="tour-content">
         <div className="tour-hero">
         <Swiper
               spaceBetween={30}
               centeredSlides={true}
               autoplay={{
                   delay: 2500,
                   disableOnInteraction: false,
               }}
               navigation={true}
               modules={[Autoplay, Pagination, Navigation]}
               className="mySwiper">
               {allHotelDetails?.images?.map((resource, index) => {
                return(<SwiperSlide key={index}>
                    <img
                        className="object-fill w-full h-96"
                        src={resource?.image_link}
                        alt="image slide 1"
                    />

                </SwiperSlide>
                )
                
               })}
            </Swiper>
         </div>
         
         <div className="tour-content-block">
            <div className="tour-description">
              {allHotelDetails?.description_body}
            </div>
         </div>
      {/* Gallery */}
         <div className="tour-content-block">
            <div className="tour-content-title">Gallery</div>
            <div className="relative overflow-hidden">
           <Carousel cols={2} rows={1} gap={10}  loop>
                     {allHotelDetails?.images?.map((resource, index) => {
            return (
               <Carousel.Item key={index} >
                  <img width="100%" style={{height:"300px"}} src={resource?.image_link} /></Carousel.Item>
                  )})}</Carousel>
      </div>
         </div>
        {/* About */}
         <div className="tour-content-block">
            <div className="tour-content-title mb-8">About</div>
            <div className="tour-itinerary">
               <div className="accordion">
                  {/* Rooms */}
                  <div className="accordion-panel accordion-start active">
                     <div className="accordion-trigger mb-8"><button onClick={()=>setRoom(!room)}>Rooms</button></div>
                    
                     <div className={room===true?'block accordion-content ':'hidden'}>
                        <div className='flex py-2'>
                        <div className="font-semibold">Four Categories to choose from:</div>
                        <div className='mr-2 ml-auto justify-end'>
                        <button   className='bg-green-600 sm:inline-flex text-white
            focus:ring-4 focus:ring-green-200 font-semibold text-white ml-96
             rounded-lg text-sm px-2 py-1 text-center 
                ease-linear transition-all duration-150'>
                Book now
            </button></div>
            </div>
                     <Carousel cols={4} rows={1} gap={10}  loop>
                     {allHotelDetails?.images?.map((resource, index) => {
            return (
               <Carousel.Item key={index} >
               <img width="100%" style={{height:"160px"}} src={resource?.image_link} />
               <span className='text-gray-700' >{resource?.image_title}</span>
               <p>{resource?.image_description}</p>
               </Carousel.Item>
               )})}</Carousel>
                     </div>
                  </div>
                 {/* Amenity */}
                  <div className="accordion-panel accordion-start active">
                 <div className="accordion-trigger mb-8">
                 <button onClick={()=>setAmenity(!amenity)}>Property Amenities</button>
                     </div>
                     <div className={amenity ===true ?'block accordion-content':'hidden'}>
                     {allHotelDetails?.services?.map((item, idx) => {
                        return (
                        <p className='flex capitalize' key={idx}>
                        <span>&#10004;
                          {item?.local_service_name} </span>
                        </p>)})}  
                    </div>
                  </div>
                 {/* Packages */}
             <div className="accordion-panel">
                     <div className="accordion-trigger">
                        Packages 
                      
                     </div>
                     <div className="accordion-content">
                        <p>
                           Our trip will end after we say goodbye to our
                           new friends over breakfast, bid you safe
                           travels, and check-out of the hotel.
                        </p>
                     </div>
                  </div>
                
               </div>
            </div>
         </div>
            {/* Reviews */}
           <div className="tour-content-block">
            <div className="tour-content-title">Customer Reviews</div>
            <div className="tour-reviews">
               <div className="tour-reviews-feedback">
               {allHotelDetails?.Reviews?.map((resource, index) => {
            return (
                  <div className="tour-reviews-feedback-item" key={index}>
                     <div className="tour-reviews-feedback-content">
                       
                        <div className="tour-reviews-feedback-content-inner">
                           <div className="tour-reviews-feedback-title">
                              {resource?.review_author}
                           </div>
                           <div className="tour-reviews-feedback-text">
                           {resource?.review_content}
                           </div>
                        </div>
                     </div>
                     <div className="tour-reviews-feedback-rating px-4">{resource?.review_rating}</div>
                  </div>
            )})} 
               </div>
               <div className="tour-reviews-overall">
                  <div className="tour-reviews-content">
                     <div className="tour-reviews-overall-title">
                        Overall Rating
                     </div>
                     <div className="tour-reviews-overall-text">
                        Excellent
                     </div>
                     <div className="tour-reviews-overall-rating">4.7</div>
                  </div>
               </div>
            </div>
         </div>
        
         <div className="tour-content-block">
            <div className="tour-help">
               <div className="tour-help-inner">
                  <div className="tour-help-content">
                     <div className="tour-help-title">Need Help Booking?</div>
                     <div className="tour-help-text">
                        Call our customer services team on the number
                        below to speak to one of our advisors who will
                        help you with all of your holiday needs.
                     </div>
                  </div>
                  <div className="tour-help-call">
                     <span className="material-icons-outlined"> call </span>
                     <div className="tour-help-call-text">
                        +90 362 555 1919
                     </div>
                  </div>
               </div>
            </div>
         </div>
        
      </div>
     
      <div className="tour-sidebar">
         <div className="tour-receipt">
            <div className="tour-receipt-head">
               <div className="tour-amount">
                  <span className="tour-amount-old">$119</span> $109
                  <span>/night</span>
               </div>
               <div className="tour-discount">-10%</div>
            </div>
            <div className="tour-receipt-select">
               <div className="tour-receipt-select-top">
                  <div className="tour-receipt-select-item">
                     <div className="tour-receipt-select-icon">
                        <span className="material-icons-outlined">
                        <input type="Date"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full py-2"
                        />
                        </span>
                     </div>
                     <div className="tour-receipt-select-content">
                        <div className="tour-receipt-select-title">
                           07 May
                        </div>
                        <div className="tour-receipt-select-text">
                           Check in
                        </div>
                     </div>
                  </div>
                  <div className="tour-receipt-select-item">
                     <div className="tour-receipt-select-icon">
                        <span className="material-icons-outlined">
                        <input type="Date"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full py-2"
                        />
                        </span>
                     </div>
                     <div className="tour-receipt-select-content">
                        <div className="tour-receipt-select-title">
                           16 May
                        </div>
                        <div className="tour-receipt-select-text">
                           Check out
                        </div>
                     </div>
                  </div>
               </div>
               <div className="tour-receipt-select-bottom">
                  <div className="tour-receipt-select-item">
                     <div className="tour-receipt-select-icon">
                        <span className="material-icons-outlined">
                        person_outline
                        </span>
                     </div>
                     <div className="tour-receipt-select-content">
                        <div className="tour-receipt-select-title">
                           3 Guests
                        </div>
                        <div className="tour-receipt-select-text">Guests</div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="tour-receipt-detail">
               <div className="tour-receipt-detail-item">
                  <div className="tour-receipt-detail-title">
                     $119 x 9 nights
                  </div>
                  <div className="tour-receipt-detail-price">$1,071</div>
               </div>
               <div className="tour-receipt-detail-item">
                  <div className="tour-receipt-detail-title">
                     10% campaign discount
                  </div>
                  <div className="tour-receipt-detail-price">-$175</div>
               </div>
               <div className="tour-receipt-detail-item">
                  <div className="tour-receipt-detail-title">Service fee</div>
                  <div className="tour-receipt-detail-price">$0</div>
               </div>
               <div
                  className="tour-receipt-detail-item tour-receipt-detail-total"
                  >
                  <div className="tour-receipt-detail-title">Total</div>
                  <div className="tour-receipt-detail-price">$1,246</div>
               </div>
            </div>
            <div className="tour-receipt-button">
               <button className="tour-favorite">
               <span className="material-icons-outlined">
               favorite_border
               </span>
               </button>
               <button className="tour-reserve">Book Now</button>
            </div>
         </div>
      </div>
      
   </div>

</div>

<div className="footer">
   <div className="container">
      <div className="footer-inner">
         <div className="footer-content">
            A simple travel booking template made with Tailwind CSS
         </div>
         <div className="footer-menu">
            <a
               href="https://github.com/tangoren/tailwind-css-travel-booking"
               className="footer-menu-item"
               target="_blank"
               rel="noopener noreferrer"
               >GitHub</a
               >
            <a
               href="https://codepen.io/tangoren/pen/jOajGGv"
               className="footer-menu-item"
               target="_blank"
               rel="noopener noreferrer"
               >CodePen</a
               >
            <a
               href="https://www.linkedin.com/in/tangoren/"
               className="footer-menu-item"
               target="_blank"
               rel="noopener noreferrer"
               >LinkedIn</a
               >
         </div>
      </div>
   </div>
</div>

<div className="header-menu-overlay"></div>

    </>
  );
  }


export default Themedefault
Themedefault.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}