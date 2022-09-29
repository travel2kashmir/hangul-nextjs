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
var phone;
var currentUser;
var currentProperty;
var currentLogged;
var i = 0;


function Themedefault() {
   const [phone, setPhone] = useState({});
   const [rooms, setRooms] = useState({});
   const [amenity, setAmenity] = useState(false);
   const [open, setOpen] = useState({
      "view": false,
      "id": ''
   });
   const [singleRoom, setSingleRoom] = useState(false);
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
      router.push("./classic");
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
               setRooms(response.data.rooms)
               response.data.contacts.map(i => { if (i.contact_type === 'Phone') { setPhone(i) } });
               console.log(response.data.contacts)
               logger.info("url  to fetch property details hitted successfully")
            })
            .catch((error) => { logger.error("url to fetch property details, failed") });
      }
      fetchHotelDetails();

   }, []);

   return (
      <>
         <div className="header">
            <div className="container">
               <div className="header-logo">
                  <span className="material-icons-outlined header-logo-icon">
                  mode_of_travel</span>{allHotelDetails?.property_name}
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
                  >Home</a
                  >
                  <a
                     href="https://codepen.io/tangoren/pen/jOajGGv"
                     className="header-menu-item"
                     target="_blank"
                     rel="noopener noreferrer"
                  >Gallery</a
                  >
                  <a
                     href="https://www.linkedin.com/in/tangoren/"
                     className="header-menu-item"
                     target="_blank"
                     rel="noopener noreferrer"
                  >About</a
                  >
                  <a
                     href="https://www.linkedin.com/in/tangoren/"
                     className="header-menu-item"
                     target="_blank"
                     rel="noopener noreferrer"
                  >Contact us</a
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
            <div className="tour-overview-item"><span>{allHotelDetails?.star_rating} star</span> Accommodation</div>
            <div className="tour-overview-item">
               <span className="material-icons-outlined"> star </span>
               <span>4.7</span> ({allHotelDetails?.Reviews?.length})
            </div>
         </div>
      </div>
   </div>

            <div className="tour-wrapper">
               <div className="tour-content">
                  <div className="tour-hero">
                     <Swiper spaceBetween={30}
                        centeredSlides={true}
                        autoplay={{
                           delay: 2500,
                           disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                        className="mySwiper">
                        {allHotelDetails?.images?.map((resource, index) => {
                           return (<SwiperSlide key={index}>
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
                        <Carousel cols={2} rows={1} gap={10} loop>
                           {allHotelDetails?.images?.map((resource, index) => {
                              return (
                                 <Carousel.Item key={index} >
                                    <img width="100%" style={{ height: "300px" }} src={resource?.image_link} /></Carousel.Item>
                              )
                           })}</Carousel>
                     </div>
                  </div>
                  {/* About */}
                  <div id="#about" className="tour-content-block">
                     <div className="tour-content-title mb-8">
                        About</div>
                     <div className="tour-itinerary">
                        <div className="accordion">
                           {/* Rooms */}
                           <div className={singleRoom === false ? 'accordion-start accordion-panel' : 'accordion-start accordion-panel active'}>
                              <div className='accordion-trigger'>
                                 <button className='mb-6' onClick={() => setSingleRoom(!singleRoom)}>
                                    <div className='accordion-trigger'>
                                       Rooms to choose ({rooms.length})</div></button></div>
                              <div className={singleRoom === true ? 'block -mt-4 mb-4 ml-4' : 'hidden'}>
                                 {allHotelDetails?.rooms?.map((resource, idx) => {
                                    return (
                                       <div key={idx}>
                                          <p className='flex mb-2 capitalize py-1'>
                                             <div className=" mt-1 mr-1 -ml-2 border-gray-600 border-0 rounded-full text-lg text-gray-50  font-semibold bg-gray-600 flex items-center justify-center" style={{ height: "20px", width: "20px", fontSize: "12px" }}>{idx + 1}</div>
                                             <button className='text-lg text-gray-600 font-semibold' onClick={() => setOpen({ ...open, view: !open.view, id: idx })}>{resource?.room_name} </button>
                                             <button className='justify-end mr-1 ml-auto' onClick={() => setOpen({ ...open, view: !open.view, id: idx })}>
                                                {open?.view === true && open?.id === idx ?
                                                   <span className=' font-semibold text-gray-400  '>
                                                      - </span>
                                                   :
                                                   <span className=' font-semibold text-gray-400'>
                                                      + </span>}</button>
                                          </p>
                                          <div className={open?.view === true && open?.id === idx ? 'block' : 'hidden'}>
                                             <div className="tour-content-block">
                                                <div className="tour-description mt-4">
                                                   {resource?.room_description}
                                                </div>
                                             </div>
                                             {/* Room Facilities */}
                                             <div className='tour-content-block1'>
                                                <div className='py-10'>
                                                   <div className="accordion-trigger">Room Facilities</div>

                                                   <div className="grid grid-flow-row-dense lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 gap-3">
                                                      {resource.room_facilities.map((item, index) => {
                                                         return (
                                                            <span className='text-gray-700' key={index}>
                                                               <span>&#10004;
                                                                  {item?.service_name} </span></span>)
                                                      })}
                                                      </div>
                                                </div></div>
                                             {/* Room Gallery */}
                                             <div className='tour-content-block1'>
                                                <div className='pb-8'>
                                                   <div className="accordion-trigger mb-4">Room Gallery</div>
                                                   <Carousel cols={3} rows={1} gap={10} loop>
                                                      {resource.room_images.map((resource, index) => {
                                                         return (
                                                            <Carousel.Item key={index} >
                                                               <img width="100%" style={{ height: "160px" }} src={resource?.image_link} />
                                                               <span className='text-gray-700' >{resource?.image_title}</span>
                                                            </Carousel.Item>
                                                         )
                                                      })}</Carousel></div></div>
                                             <div className='flex pb-8'>
                                                <div className='mr-2 ml-auto justify-end'>
                                                   <button className='bg-green-600 sm:inline-flex text-white
            focus:ring-4 focus:ring-green-200 font-semibold text-white 
             rounded-lg text-sm px-4 py-2.5 text-center 
                ease-linear transition-all duration-150'>
                                                      Book now
                                                   </button></div>
                                             </div></div>
                                       </div>)
                                 })}

                              </div>
                           </div>
                           {/* Amenity */}
                           <div className={amenity === false ? 'accordion-start accordion-panel' : 'accordion-start accordion-panel active'}>
                              <div className='accordion-trigger'>
                                 <button className="mb-6" onClick={() => setAmenity(!amenity)}>
                                    <div className='accordion-trigger' > Property Amenities</div>
                                 </button></div>
                              <div className={amenity === true ? 'tour-content-block1 ' : 'hidden'}>
                                 <div className="grid mb-6 grid-flow-row-dense lg:grid-cols-4 md:grid-cols-1 sm:grid-cols-1 gap-3">
                                    {allHotelDetails?.services?.map((item, idx) => {
                                       return (
                                          <span className='text-gray-700 capitalize' key={idx}>
                                             <span>&#10004;
                                                {item?.local_service_name} </span>
                                          </span>)
                                    })}</div>
                              </div>
                           </div>

                           {/* Packages */}
                           <div className="accordion-panel">
                              <button onClick={() => setAmenity(!amenity)}>  <div className="accordion-trigger">
                                 Packages
                              </div></button>
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

                  {/*  Reviews */}
                  <div className="tour-content-block">
                     <div className="tour-content-title">Customer Reviews</div>
                     <div className="tour-reviews">
                        <div className="tour-reviews-feedback">
                        {allHotelDetails?.Reviews?.map((item, idx) => {
                                       return (
                           <div className="tour-reviews-feedback-item" key={idx}>
                              <div className="tour-reviews-feedback-content">
                                 
                                 <div className="tour-reviews-feedback-content-inner">
                                    <div className="tour-reviews-feedback-title">
                                       {item?.review_author}
                                    </div>
                                    <div className="tour-reviews-feedback-text">
                                      {item?.review_title}
                                    </div>
                                 </div>
                              </div>
                              <div className="tour-reviews-feedback-rating capitalize">{item?.review_rating}</div>
                           </div>)})}
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
                  {/* Booking */}
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
                                 {phone?.contact_data}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               {/* content  */}
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
                                    calendar_month
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
                                    event_available
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
         {/* Footer */}
         <div className="footer">
            <div className="container">
               <div className="footer-inner">
                  <div className="footer-content">
                     Powered by Travel2Kashmir
                  </div>
                  <div className="footer-menu">
                     <a
                        href="https://github.com/tangoren/tailwind-css-travel-booking"
                        className="footer-menu-item"
                        target="_blank"
                        rel="noopener noreferrer"
                     >Home</a
                     >
                     <a
                        href="https://codepen.io/tangoren/pen/jOajGGv"
                        className="footer-menu-item"
                        target="_blank"
                        rel="noopener noreferrer"
                     >Gallery</a
                     >
                     <a
                        href="https://www.linkedin.com/in/tangoren/"
                        className="footer-menu-item"
                        target="_blank"
                        rel="noopener noreferrer"
                     >About</a
                     >
                     <a
                        href="https://www.linkedin.com/in/tangoren/"
                        className="footer-menu-item"
                        target="_blank"
                        rel="noopener noreferrer"
                     >Contact us</a
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