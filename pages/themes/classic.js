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
var i = 0;


function Themedefault() {
   const [phone, setPhone] = useState({});
   const [email, setEmail] = useState({});
   const [rooms, setRooms] = useState({});
   const [amenity, setAmenity] = useState(false);
   const [packages, setPackages] = useState(false);
   const [open, setOpen] = useState({
      "view": false,
      "id": ''
   });
   const [singleRoom, setSingleRoom] = useState(false);
   const [smSidebar, setSmSidebar] = useState(false)
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
               response.data.contacts.map(i => { if (i.contact_type === 'Email') { setEmail(i) } });
               console.log(response.data.contacts)
               logger.info("url  to fetch property details hitted successfully")
            })
            .catch((error) => { logger.error("url to fetch property details, failed") });
      }
      fetchHotelDetails();

   }, []);

   return (
      <>
         <div className="header w-full">
            <div className="container">
               <div className="header-logo">
                  <span className="material-icons-outlined header-logo-icon">
                     mode_of_travel</span> <span className='text-sky-600'>{allHotelDetails?.property_name}</span>
               </div>
              
               <div className="menu-toggle">
                 <button onClick={() => setSmSidebar(!smSidebar)} > <span className="material-icons-outlined"> menu </span></button>
               </div>
        
               <ul className="header-menu">
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-cyan-600 focus:border-cyan-600 block w-32 py-1 px-2">
                     <option value="en">English</option>
                     <option value="fr">French</option>
                     <option value="ar">Arabic</option>
                  </select>
                  <a
                     href="#home"
                     className="header-menu-item"
                  >Home</a
                  >
                  <a
                     href="#about"
                     className="header-menu-item"
                  >About</a
                  >
                  <a
                     href="#gallery"
                     className="header-menu-item"
                  >Gallery</a
                  >

                  <a
                     href="#rooms"
                     className="header-menu-item"
                  >Rooms</a
                  >
                  <a
                     href="#amenities"
                     className="header-menu-item"
                  >Amenities</a
                  >
                  <a
                     href="#packages"
                     className="header-menu-item"
                  >Packages</a
                  >
                  <a
                     href="#contactus"
                     className="header-menu-item"
                  >Contact us</a
                  >
                  <div className="header-menu-copyright">Made with Tailwind CSS</div>
               </ul>
              
            </div>

        <div className={smSidebar === true ? "block" : "hidden"}>       
          <aside id="sidebar" className="fixed  lg:hidden z-20 h-full top-14 right-0 h-min flex  flex-shrink-0 flex-col w-full transition-width duration-75" aria-label="Sidebar">
          <div className="relative  flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 bg-white divide-y space-y-1">
                <ul className="space-y-2 pb-2">

                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2">
                  <span className="ml-3 flex-1 whitespace-nowrap"> 
                  <a
                     href="#home"
                  > <button onClick={()=>{setSmSidebar(!smSidebar)}}>Home</button></a></span>
                  </li>
                  <hr/>
                    <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2">
                      <span className="ml-3 flex-1 whitespace-nowrap">
                      <a
                     href="#about"> <button onClick={()=>{setSmSidebar(!smSidebar)}}>About</button>
                       </a> </span>
                    </li>
                    <hr/>
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2">
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <a
                     href="#gallery">
                    <button onClick={()=>{setSmSidebar(!smSidebar)}}> Gallery</button></a>
                   </span>
                  </li>
                  <hr/> 
                 <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2">
                   <span className="ml-3 flex-1 whitespace-nowrap">
                   <a
                     href="#rooms"><button onClick={()=>{setSmSidebar(!smSidebar)}}>Rooms</button></a>
                    </span>
                  </li>
                  <hr/>
               <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2">
               <span className="ml-3 flex-1 whitespace-nowrap">
               <a href="#amenities"><button onClick={()=>{setSmSidebar(!smSidebar)}}>Amenities</button></a>
                    </span>
                  </li>
                  <hr/>
                <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2">
                   <span className="ml-3 flex-1 whitespace-nowrap">
                   <a
                     href="#packages"><button onClick={()=>{setSmSidebar(!smSidebar)}}> Packages</button></a>
                    </span>
                  </li>
                  <hr/>
                   <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2">
                     <span className="ml-3 flex-1 whitespace-nowrap">
                     <a
                     href="#contactus"><button onClick={()=>{setSmSidebar(!smSidebar)}}>Contact us </button></a>
                      </span>
                    </li> 
                </ul>
              </div>
            </div>
          </div>
        </aside>
        </div>
         </div>
        
         <div className="tour container">
            <div className="tour-head">
               <div id="home" className="tour-head-left">
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
            {/* Body */}
            <div className="tour-wrapper">
               <div className="tour-content">
                  {/* Slider */}
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
                  <div id="gallery" className="tour-content-block">
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
                  <div id="about" className="tour-content-block">
                     <div className="tour-content-title mb-8">
                        About</div>
                     <div className="tour-itinerary">
                        <div className="accordion">
                           {/* Rooms */}
                           <div id="rooms" className={singleRoom === false ? 'accordion-start accordion-panel' : 'accordion-start accordion-panel active'}>
                              <div className='accordion-trigger'>
                                 <button className='mb-6' onClick={() => setSingleRoom(!singleRoom)}>
                                    <div className='accordion-trigger'>
                                       Rooms to choose ({rooms.length})</div></button></div>
                              <div className={singleRoom === true ? 'block -mt-4 mb-4 ml-4' : 'hidden'}>
                                 {allHotelDetails?.rooms?.map((resource, idx) => {
                                    return (
                                       <div key={idx}>
                                          <p className='flex capitalize mt-4 py-1'>
                                             <div className="my-1.5 mr-1.5 -ml-2 border-gray-200 border-0 rounded-full  font-bold text-gray-600  bg-gray-200 flex items-center justify-center" style={{ height: "22px", width: "22px", fontSize: "14px" }}>{idx + 1}</div>
                                             <button className='text-gray-600 font-semibold' onClick={() => setOpen({ ...open, view: !open.view, id: idx })}>{resource?.room_name} </button>
                                             <button className='justify-end mr-1 ml-auto' onClick={() => setOpen({ ...open, view: !open.view, id: idx })}>
                                                {open?.view === true && open?.id === idx ?
                                                   <span className=' font-semibold text-gray-400  '>
                                                      - </span>
                                                   :
                                                   <span className=' font-semibold text-gray-400'>
                                                      + </span>}</button>
                                          </p>
                                          <div className={open?.view === true && open?.id === idx ? 'block' : 'hidden'}>
                                             {/* Room Description */}
                                             <div className="tour-content-block">
                                                <div className="tour-description">
                                                   {resource?.room_description}
                                                </div>
                                             </div>
                                             {/* Room Facilities */}
                                             <div className='tour-content-block1'>
                                                <div className='py-10'>
                                                   <div className="accordion-trigger">Room Facilities</div>

                                                   <div className="grid grid-flow-row-dense lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 mt-2 gap-3">
                                                      {resource.room_facilities.map((item, index) => {
                                                         return (
                                                            <span className='text-gray-700' key={index}>
                                                               <span>&#10004;
                                                                  {item?.service_name} </span></span>)
                                                      })}
                                                   </div>
                                                </div>
                                                </div>
                                             {/* Room Gallery */}
                                             <div className='tour-content-block1'>
                                                <div className='pb-8'>
                                                   <div className="accordion-trigger mb-4">Room Gallery</div>
                                                   <Carousel cols={3} rows={1} gap={10} loop>
                                                      {resource.room_images.map((resource, index) => {
                                                         return (
                                                            <Carousel.Item key={index} >
                                                               <img width="100%" style={{ height: "160px", marginBottom: "10px" }} src={resource?.image_link} />
                                                               <span className='text-gray-700' >{resource?.image_title}</span>
                                                            </Carousel.Item>
                                                         )
                                                      })}</Carousel></div></div>

                                             {/* Book Now Button */}
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
                           <div id="amenities" className={amenity === false ? 'accordion-start accordion-panel' : 'accordion-start accordion-panel active'}>
                              <div className='accordion-trigger'>
                                 <button className="mb-6" onClick={() => setAmenity(!amenity)}>
                                    <div className='accordion-trigger' > Property Amenities</div>
                                 </button></div>
                              <div className={amenity === true ? 'tour-content-block1 ' : 'hidden'}>
                                 <div className="grid mb-8 grid-flow-row-dense lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 gap-3">
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
                           <div id="packages" className={packages === false ? 'accordion-start accordion-panel' : 'accordion-start accordion-panel active'}>
                           <div className='accordion-trigger'>
                                 <button className="mb-6" onClick={() => setPackages(!packages)}>
                                    <div className='accordion-trigger' > Packages</div>
                                 </button></div>
                              <div className={packages === true ? 'block -mt-4 mb-4 ml-4' : 'hidden'}>
                                 {allHotelDetails?.packages?.map((resource, idx) => {
                                    return (
                                       <div key={idx}>
                                          <p className='flex capitalize mt-4 py-1'>
                                             <div className="my-1.5 mr-1.5 -ml-2 border-gray-200 border-0 rounded-full  font-bold text-gray-600  bg-gray-200 flex items-center justify-center" style={{ height: "22px", width: "22px", fontSize: "14px" }}>{idx + 1}</div>
                                             <button className='text-gray-600 font-semibold' onClick={() => setOpen({ ...open, view: !open.view, id: idx })}>{resource?.package_name} </button>
                                             <button className='justify-end mr-1 ml-auto' onClick={() => setOpen({ ...open, view: !open.view, id: idx })}>
                                                {open?.view === true && open?.id === idx ?
                                                   <span className=' font-semibold text-gray-400  '>
                                                      - </span>
                                                   :
                                                   <span className=' font-semibold text-gray-400'>
                                                      + </span>}</button>
                                          </p>
                                          <div className={open?.view === true && open?.id === idx ? 'block' : 'hidden'}>
                                             {/* Package Description */}
                                             <div className="tour-content-block">
                                                <div className="tour-description">
                                                   {resource?.package_description}
                                                   {resource?.refundable === "true"?
                                                   <p className='my-2'> <span className='text-gray-600 font-semibold'>Refundable till</span>  {resource?.refundable_until_days}days, {resource?.refundable_until_time}</p>:
                                                   <></>}
                                                </div>
                                             </div>
                                            
                                            {/* Package Services */}
                                            <div className='tour-content-block1'>
                                                <div className='py-10'>
                                                   <div className="accordion-trigger">Package Services</div>

                                                   <div className="grid grid-flow-row-dense lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 mt-2 gap-3">
                                                      {resource.package_services.map((item, index) => {
                                                         return (
                                                            <>
                                                            {item?.value=== true?<><span className='capitalize text-gray-700' key={index}>
                                                            <span>&#10004;
                                                               {item?.package_service_name.replace(
                                                               /\_+/g,
                                                        " ")} </span></span></>:<></>}
                                                        </>)
                                                      })}
                                                   </div>
                                                </div>
                                                </div>
                                                 {/* Package Rooms */}
                                            <div className='tour-content-block1'>
                                                <div className='py-10'>
                                                   <div className="accordion-trigger -mt-8">Package Rooms</div>

                                                      {resource.package_rooms.map((item, index) => {
                                                         return (
                                                            <span className='capitalize text-gray-700' key={index}>
                                                              {item?.room_name} </span>)
                                                      })}
                                                </div>
                                                </div>
                                             
                                             {/* itinerary */}
                                           
         <div className="tour-content-block mb-8">
         <div className="accordion-trigger mb-4">Itinerary</div>
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
                
                  <div className="accordion-panel  accordion-star pb-4">
                     <div className="accordion-trigger">
                        <span>Day 1:</span> Istanbul
                     </div>
                     <div className="accordion-content">
                        <p>
                           Istanbul, formerly known as Constantinople, is
                           the largest city in Turkey, serving as the
                           country`s economic, cultural and historic hub.
                           The city straddles the Bosporus strait, lying
                           in both Europe and Asia, and has a population
                           of over 15 million residents, comprising 19% of
                           the population of Turkey. Istanbul is the most
                           populous European city, and the world`s
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
                
                  <div className="accordion-panel pb-4">
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
                           Καλλίπολις (Kallípolis), meaning 'beautiful
                           city', the original name of the modern town of
                           Gelibolu. In antiquity, the peninsula was known
                           as the Thracian Chersonese.
                        </p>
                     </div>
                  </div>
                
                  <div className="accordion-panel pb-4">
                     <div className="accordion-trigger">
                        <span>Day 3:</span> Troy
                     </div>
                     <div className="accordion-content">
                        <p>
                           Troy or Ilium was an ancient city located at
                           Hisarlik in present-day Turkey, 30 kilometres
                           (19 mi) south-west of Çanakkale. It is known as
                           the setting for the Greek myth of the Trojan
                           War.
                        </p>
                        <p>
                           In Ancient Greek literature, Troy is portrayed
                           as a powerful kingdom of the Heroic Age, a
                           mythic era when monsters roamed the earth and
                           gods interacted directly with humans. The city
                           was said to have ruled the Troad until the
                           Trojan War led to its complete destruction at
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
                
                  <div className="accordion-panel pb-4">
                     <div className="accordion-trigger">
                        <span>Day 4:</span> Kusadasi
                     </div>
                     <div className="accordion-content">
                        <p>
                           Kuşadası is a large resort town on Turkey`s
                           Aegean coast, and the center of the seaside
                           district of the same name within Aydın
                           Province. Kuşadası is 95 km (59 mi) south of
                           İzmir, and about 60 km (37 mi) from Aydın. The
                           municipality`s primary industry is tourism. The
                           mayor of the district is Oğuzhan Turan.
                        </p>
                     </div>
                  </div>
            
                  <div className="accordion-panel pb-4">
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
                
                  <div className="accordion-panel pb-4">
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
                  
                  <div className="accordion-panel pb-4">
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
                           the nearby İztuzu Beach, a breeding ground for
                           the endangered loggerhead sea turtle species.
                           The incident created major international storm
                           when David Bellamy championed the cause of
                           conservationists such as June Haimoff, Peter
                           Günther, Nergis Yazgan, Lily Venizelos and
                           Keith Corbett. The development project was
                           temporarily stopped after Prince Philip called
                           for a moratorium and in 1988 the beach and its
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
                
                  <div className="accordion-panel pb-4">
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
               
                  
                  
               </div>
            </div>
         </div>
     

   {/* Book Now Button */}
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
                                 </div>)
                           })}
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
                  <div id="contactus" className="tour-content-block">
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
                              <input
                          type="date"
                          className="my-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-md focus:ring-cyan-600 focus:border-cyan-600  block w-100 px-1 py-1"/>
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
                              <input
                          type="date"
                          className="my-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-md focus:ring-cyan-600 focus:border-cyan-600  block w-100 px-1 py-1"/>
                                 
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
                              <input
                          type="number" min={1}
                          className="my-1 shadow-sm bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-md focus:ring-cyan-600 focus:border-cyan-600  block w-5/6 px-1 py-1"/>
                                 
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
    <footer className="bg-white mt-12 lg:mt:8 py-6">
    <div className="md:flex md:justify-between mx-6">
        <div className="mb-6 md:mb-0">
        <div className="header-logo px-8">
                  <span className="material-icons-outlined header-logo-icon">
                     mode_of_travel</span>
                    <span className='text-sky-600 text-xl'>{allHotelDetails?.property_name}</span>       
               </div>
               <div className='flex -mt-1 flex-col'>
               <span className='lg:px-20 px-16 text-sm text-gray-600'>{allHotelDetails?.address?.[i]?.address_street_address}, {allHotelDetails?.address?.[i]?.address_city}
               </span>
               <span className='lg:px-20 px-16 text-sm text-gray-600'> {allHotelDetails?.address?.[i]?.address_province}, {allHotelDetails?.address?.[i]?.address_zipcode} 
               </span>
               <span className='lg:px-20 px-16 text-sm text-gray-600 uppercase'>India
               </span></div>
        </div>
        <div className=" mt-2 grid grid-cols-2 gap-14 lg:gap-36 sm:grid-cols-3">
            <div>
                <h2 className="mb-2 font-semibold text-gray-400 uppercase">Quick Links</h2>
                <ul className="text-gray-600 ">
                    <li className="mb-2">
                        <a href="#home" className="hover:underline hover:text-gray-400  text-sm">Home</a>
                    </li>
                    <li className="mb-2">
                        <a href="#about" className="hover:underline hover:text-gray-400 text-sm">About</a>
                    </li>
                    <li className="mb-2"> 
                        <a href="#gallery" className="hover:underline hover:text-gray-400 text-sm">Gallery</a>
                    </li>
                    <li>
                        <a href="#contactus" className="hover:underline hover:text-gray-400 text-sm">Contact</a>
                    </li>
                </ul>
            </div>
            <div>
                <h2 className="mb-2 font-semibold  uppercase text-gray-400">Contact Us</h2>
                <ul className="text-gray-600">
                    <li className="flex mb-2 hover:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="mr-0.5 mt-1 w-3 h-3">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                     </svg>
                        <a href="#" className=" text-sm hover:underline">{phone.contact_data}</a>
                    </li>
                    <li className="flex hover:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mt-1 mr-0.5 w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>

                        <a href="#" className="text-sm hover:underline">{email?.contact_data}</a>
                    </li>
                </ul>
            </div>
            <div className='mr-8'>
                <h2 className="mb-2  font-semibold text-gray-400 uppercase  dark:text-white">Legal</h2>
                <ul className="text-gray-600">
                    <li className="mb-2 flex">
                        <a href="#" className="hover:underline hover:text-gray-400 text-sm">
                       Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline hover:text-gray-400 text-sm">Terms &amp; Conditions</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <hr className="my-6 border-gray-400 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <div className="sm:flex sm:items-center mx-2 sm:justify-between">
        <span className="text-sm text-white sm:text-center text-gray-600">© 2022 <a href="#" className="hover:underline">Powered By Travel2Kashmir</a>. All Rights Reserved.
        </span>
        <div className="flex mt-4 space-x-6  sm:justify-center sm:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-400 dark:hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                <span className="sr-only">Facebook page</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-400 dark:hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                <span className="sr-only">Instagram page</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-400 dark:hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                <span className="sr-only">Twitter page</span>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-400 dark:hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                <span className="sr-only">GitHub account</span>
                
   
            </a>
            <div className="flex space-x-4">
  </div>
        </div>
    </div>
</footer>
         
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