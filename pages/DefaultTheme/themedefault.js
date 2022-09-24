import { useState, useRef, useEffect } from 'react'
import data from './data.json'
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
    router.push("./themedefault");
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
            <div className="tour-overview-item">
               <span className="material-icons-outlined"> star </span>
               <span>4.7</span> (55 reviews)
            </div>
         </div>
      </div>
   </div>
  
   <div className="tour-wrapper">
      <div className="tour-content">
         <div className="tour-hero">
            <div className="tour-image"></div>
         </div>
         
         <div className="tour-content-block">
            <div className="tour-description">
              {allHotelDetails?.description_body}
            </div>
         </div>
      
         <div className="tour-content-block">
            <div className="tour-content-title">Gallery</div>
            <div className="relative overflow-hidden">
        <div className="flex justify-between absolute top left  h-full">
          <button
            onClick={movePrev}
            className=" text-white w-10 justify-start  h-full text-center opacity-75 hover:bg-gray-400  disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
          
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-20 -ml-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="sr-only">Prev</span>
          </button>
          <button
            onClick={moveNext}
            className=" text-white w-10 h-full justify-end text-center opacity-75 hover:bg-gray-400 disabled:opacity-25 disabled:cursor-not-allowed z-10 p-0 m-0 transition-all ease-in-out duration-300"
           
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-20 -ml-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="sr-only">Next</span>
          </button>
        </div>
      
                        <div className="swiper-image">
        <div
          ref={carousel}
          className="carousel-container relative flex gap-1 overflow-hidden scroll-smooth snap-x snap-mandatory touch-pan-x z-0"
        >
          {allHotelDetails?.images?.map((resource, index) => {
            return (
              <div
                key={index}
                className="carousel-item text-center rounded-lg relative w-64 h-56 snap-start"
              >
                <a
                  href={resource.image_link}
                  className="h-full w-full aspect-square  block bg-origin-padding  bg-left-top bg-cover bg-no-repeat z-0"
                  style={{ backgroundImage: `url(${resource.image_link || ''})` }}
                >
                  <span className="w-full aspect-square tour-image hidden">
                  <img
                    src={resource.image_link || ''}
                    alt={resource.image_title}
                    
                  /></span>
                </a>
                
                <a
                  href={resource.image_link}
                  className="h-full w-full aspect-square  block absolute top-0 left-0 transition-opacity duration-300 opacity-0 hover:opacity-100 bg-gray-300 z-10"
                >
                  <h3 className="text-white py-6 px-3 mx-auto text-xl">
                    {resource.image_title}
                  </h3>
                </a>
              </div>
            );
          })}
        </div></div>
      </div>
         </div>
       
         <div className="tour-content-block">
            <div className="tour-content-title mb-8">Itinerary</div>
            <div className="tour-itinerary">
               <div className="accordion">
                  <div
                     className="accordion-panel accordion-introduction active"
                     >
                     <div className="accordion-trigger">Introduction</div>
                     <div className="accordion-content">
                        <p>
                           Start and end in Istanbul! With the Explorer
                           tour Best of Turkey by Land, you have a 9 days
                           tour package taking you through Istanbul,
                           Turkey and 11 other destinations in Turkey.
                           Best of Turkey by Land includes accommodation
                           in a hotel as well as an expert guide, meals,
                           transport and more.
                        </p>
                     </div>
                  </div>
                 
                  <div className="accordion-panel accordion-start">
                     <div className="accordion-trigger">
                        <span>Day 1:</span> Istanbul
                     </div>
                     <div className="accordion-content">
                        <p>
                           Istanbul, formerly known as Constantinople, is
                           the largest city in Turkey, serving as the
                           country economic, cultural and historic hub.
                           The city straddles the Bosporus strait, lying
                           in both Europe and Asia, and has a population
                           of over 15 million residents, comprising 19% of
                           the population of Turkey. Istanbul is the most
                           populous European city, and the world
                           15th-largest city.
                        </p>
                        <p>
                           The city was founded as Byzantium (Byzantion)
                           in the 7th century BC by Greek settlers from
                           Megara. In 330 CE, the Roman emperor
                           Constantine the Great made it his imperial
                           capital, renaming it first as New Rome (Nova
                           Roma)and then as Constantinople
                           (Constantinopolis) after himself. The city grew
                           in size and influence, eventually becoming a
                           beacon of the Silk Road and one of the most
                           important cities in history.
                        </p>
                     </div>
                  </div>
                 
                  <div className="accordion-panel">
                     <div className="accordion-trigger">
                        <span>Day 2:</span> Gallipoli
                     </div>
                     <div className="accordion-content">
                        <p>
                           The Gallipoli peninsula is located in the
                           southern part of East Thrace, the European part
                           of Turkey, with the Aegean Sea to the west and
                           the Dardanelles strait to the east.
                        </p>
                        <p>
                           Gallipoli is the Italian form of the Greek name
                           Καλλίπολις (Kallípolis), meaning beautiful
                           city, the original name of the modern town of
                           Gelibolu. In antiquity, the peninsula was known
                           as the Thracian Chersonese.
                        </p>
                     </div>
                  </div>
                 
                  <div className="accordion-panel">
                     <div className="accordion-trigger">
                        <span>Day 3:</span> Troy
                     </div>
                     <div className="accordion-content">
                        <p>
                           Troy or Ilium was an ancient city located at
                           Hisarlik in present-day Turkey, 30 kilometres
                           (19 mi) south-west of Çanakkale. It is known as
                           the setting htmlFor the Greek myth of the Trojan
                           War.
                        </p>
                        <p>
                           In Ancient Greek literature, Troy is portrayed
                           as a powerful kingdom of the Heroic Age, a
                           mythic era when monsters roamed the earth and
                           gods interacted directly with humans. The city
                           was said to have ruled the Troad until the
                           Trojan War led to its comptempe destruction at
                           the hands of the Greeks. The story of its
                           destruction was one of the cornerstones of
                           Greek mythology and literature, featuring
                           prominently in the Iliad and the Odyssey, as
                           well as numerous other poems and plays. Its
                           legacy played a large role in Greek society,
                           with many prominent families claiming descent
                           from those who had fought there. In the Archaic
                           era, a new city was built at the site where
                           legendary Troy was believed to have stood. In
                           the Classical era, this city became a tourist
                           destination, where visitors would leave
                           offerings to the legendary heroes.
                        </p>
                     </div>
                  </div>
                  <div className="accordion-panel">
                     <div className="accordion-trigger">
                        <span>Day 4:</span> Kusadasi
                     </div>
                     <div className="accordion-content">
                        <p>
                           Kuşadası is a large resort town on Turkey
                           Aegean coast, and the center of the seaside
                           district of the same name within Aydın
                           Province. Kuşadası is 95 km (59 mi) south of
                           İzmir, and about 60 km (37 mi) from Aydın. The
                           municipality primary industry is tourism. The
                           mayor of the district is Oğuzhan Turan.
                        </p>
                     </div>
                  </div>
                
                  <div className="accordion-panel">
                     <div className="accordion-trigger">
                        <span>Day 5:</span> Fethiye
                     </div>
                     <div className="accordion-content">
                        <p>
                           Fethiye, formerly Makri (Greek: Μάκρη), is a
                           city and district of Muğla Province in the
                           Aegean Region of Turkey. It is one of the
                           prominent tourist destinations in the Turkish
                           Riviera. In 2019 its population was 162,686.
                        </p>
                     </div>
                  </div>
                 
                  <div className="accordion-panel">
                     <div className="accordion-trigger">
                        <span>Day 6:</span> Oludeniz
                     </div>
                     <div className="accordion-content">
                        <p>
                           Ölüdeniz is a small neighbourhood and beach
                           resort in the Fethiye district of Muğla
                           Province, on the Turquoise Coast of
                           southwestern Turkey, at the conjunction point
                           of the Aegean and Mediterranean sea. It is
                           located 14 km (9 mi) to the south of Fethiye,
                           near Mount Babadağ.
                        </p>
                     </div>
                  </div>
                 
                  <div className="accordion-panel">
                     <div className="accordion-trigger">
                        <span>Day 7:</span> Dalyan
                     </div>
                     <div className="accordion-content">
                        <p>
                           Dalyan is a town in Muğla Province located
                           between the districts of Marmaris and Fethiye
                           on the south-west coast of Turkey. The town is
                           an independent municipality, within the
                           administrative district of Ortaca.
                        </p>
                        <p>
                           Dalyan achieved international fame in 1987 when
                           developers wanted to build a luxury hotel on
                           the nearby İztuzu Beach, a breeding ground htmlFor
                           the endangered loggerhead sea turtle species.
                           The incident created major international storm
                           when David Bellamy championed the cause of
                           conservationists such as June Haimoff, Peter
                           Günther, Nergis Yazgan, Lily Venizelos and
                           Keith Corbett. The development project was
                           temporarily stopped after Prince Philip called
                           htmlFor a moratorium and in 1988 the beach and its
                           hinterland were declared a protected area, viz.
                           Köyceğiz-Dalyan Special Environmental
                           Protection Area.
                        </p>
                        <p>
                           Life in Dalyan revolves around the Dalyan Çayı
                           River which flows past the town. The boats that
                           ply up and down the river, navigating the maze
                           of reeds, are the preferred means of transport
                           to local sites.
                        </p>
                     </div>
                  </div>
                 <div className="accordion-panel">
                     <div className="accordion-trigger">
                        <span>Day 8:</span> Cappadocia
                     </div>
                     <div className="accordion-content">
                        <p>
                           Cappadocia is a historical region in Central
                           Anatolia, largely in the Nevşehir, Kayseri,
                           Aksaray, Kırşehir, Sivas and Niğde provinces in
                           Turkey.
                        </p>
                        <p>
                           Since the late 300s BC the name Cappadocia came
                           to be restricted to the inland province
                           (sometimes called Great Cappadocia), Upper
                           Cappadocia, which alone will be the focus of
                           this article. Lower Cappadocia is focused to
                           elsewhere.
                        </p>
                        <p>
                           According to Herodotus, in the time of the
                           Ionian Revolt (499 BC), the Cappadocians were
                           reported as occupying a region from Mount
                           Taurus to the vicinity of the Euxine (Black
                           Sea). Cappadocia, in this sense, was bounded in
                           the south by the chain of the Taurus Mountains
                           that separate it from Cilicia, to the east by
                           the upper Euphrates, to the north by Pontus,
                           and to the west by Lycaonia and eastern
                           Galatia.
                        </p>
                     </div>
                  </div>
             <div className="accordion-panel">
                     <div className="accordion-trigger">
                        <span>Day 9:</span> Istanbul
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
           <div className="tour-content-block">
            <div className="tour-content-title">Customer Reviews</div>
            <div className="tour-reviews">
               <div className="tour-reviews-feedback">
                  <div className="tour-reviews-feedback-item">
                     <div className="tour-reviews-feedback-content">
                       
                        <div className="tour-reviews-feedback-content-inner">
                           <div className="tour-reviews-feedback-title">
                              Itinerary
                           </div>
                           <div className="tour-reviews-feedback-text">
                              Excellent
                           </div>
                        </div>
                     </div>
                     <div className="tour-reviews-feedback-rating">4.8</div>
                  </div>
                  <div className="tour-reviews-feedback-item">
                     <div className="tour-reviews-feedback-content">
                        <div className="tour-reviews-feedback-icon">
                           <span className="material-icons-outlined">
                           record_voice_over
                           </span>
                        </div>
                        <div className="tour-reviews-feedback-content-inner">
                           <div className="tour-reviews-feedback-title">
                              Guide
                           </div>
                           <div className="tour-reviews-feedback-text">
                              Excellent
                           </div>
                        </div>
                     </div>
                     <div className="tour-reviews-feedback-rating">4.9</div>
                  </div>
                  <div className="tour-reviews-feedback-item">
                     <div className="tour-reviews-feedback-content">
                        <div className="tour-reviews-feedback-icon">
                           <span className="material-icons-outlined">
                           directions_bus
                           </span>
                        </div>
                        <div className="tour-reviews-feedback-content-inner">
                           <div className="tour-reviews-feedback-title">
                              Transport
                           </div>
                           <div className="tour-reviews-feedback-text">
                              Excellent
                           </div>
                        </div>
                     </div>
                     <div className="tour-reviews-feedback-rating">4.9</div>
                  </div>
                  <div className="tour-reviews-feedback-item">
                     <div className="tour-reviews-feedback-content">
                        <div className="tour-reviews-feedback-icon">
                           <span className="material-icons-outlined">
                           hotel
                           </span>
                        </div>
                        <div className="tour-reviews-feedback-content-inner">
                           <div className="tour-reviews-feedback-title">
                              Accommodation
                           </div>
                           <div className="tour-reviews-feedback-text">
                              Excellent
                           </div>
                        </div>
                     </div>
                     <div className="tour-reviews-feedback-rating">4.5</div>
                  </div>
                  <div className="tour-reviews-feedback-item">
                     <div className="tour-reviews-feedback-content">
                        <div className="tour-reviews-feedback-icon">
                           <span className="material-icons-outlined">
                           restaurant
                           </span>
                        </div>
                        <div className="tour-reviews-feedback-content-inner">
                           <div className="tour-reviews-feedback-title">
                              Food
                           </div>
                           <div className="tour-reviews-feedback-text">
                              Excellent
                           </div>
                        </div>
                     </div>
                     <div className="tour-reviews-feedback-rating">4.5</div>
                  </div>
                  <div className="tour-reviews-feedback-item">
                     <div className="tour-reviews-feedback-content">
                        <div className="tour-reviews-feedback-icon">
                           <span className="material-icons-outlined">
                           support
                           </span>
                        </div>
                        <div className="tour-reviews-feedback-content-inner">
                           <div className="tour-reviews-feedback-title">
                              Tour Operator
                           </div>
                           <div className="tour-reviews-feedback-text">
                              Travel Walk
                           </div>
                        </div>
                     </div>
                     <div className="tour-reviews-feedback-rating">4.5</div>
                  </div>
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