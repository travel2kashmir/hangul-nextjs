
import React from "react";
import Sidebar from "../components/Sidebar";
import Website_head from "../components/Website_head";
import { useState, useEffect } from "react";
import axios from 'axios';
import en from "../components/Languages/en"
import fr from "../components/Languages/fr"
import ar from "../components/Languages/ar"
import { useRouter } from "next/router";
const logger = require("../services/logger");
var language;
var currentUser;
var currentProperty;
var flag = false;

function page() {
  /** State to store Current Property Details **/
  var theme1 = "bg-red-200";
  var theme2 = "bg-rose-400";
  var theme3 = "bg-neutral-400";
  var theme4 = "bg-yellow-400";
  var theme5 = "bg-indigo-500";
  const [allHotelDetails, setAllHotelDetails] = useState([]);
  const [theme, setTheme] = useState(theme1)
  const [bgColor, setBgColor] = useState(theme)
  const [unique, setUnique] = useState(0)
  const [uri, setUri] = useState("")
  /** Router for Redirection **/
  const router = useRouter();
  const fetchLanguage = (lang) => {
    if (lang === "ar") {
      language = ar;
    }
    if (lang === "en") {
      language = en;
    }
    if (lang === "fr") {
      language = fr;
    }
    else {
      language = en;
    }
    
  }
  const fetchProperty = async (data) => {
    fetchLanguage(data?.language); 
    var url = `api/${data?.province.replaceAll(" ", "-")}/${data?.city.replaceAll(" ", "-")}/${data?.property_category}s/${data?.property_id}`
    setBgColor(data?.theme_id); setTheme(data?.theme_id);
    
    axios.get(url)
      .then((response) => {
        setAllHotelDetails(response.data);
        logger.info("url  to fetch property details hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });
  }

  const fetchHotelDetails = async () => {

    if (router?.query?.page) {
      var url;
      url = `/api/property_page/${router?.query?.page}`;
      axios.get(url)
        .then((response) => {
         fetchProperty(response.data);
          logger.info("url  to fetch property details hitted successfully")
        })
        .catch((error) => { logger.error("url to fetch property details, failed") });

    }
  
  }


  /* Function call to fetch Current Property Details when page loads */
  useEffect(() => {
    fetchHotelDetails();
  }, [router?.query?.page]);
{}
  return (
    <>{allHotelDetails.length===0?
      <div role="status" className="grid h-screen place-items-center bg-gray-300">
    <svg aria-hidden="true" className="mr-2 w-16 h-16 text-white animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>
:<div>
   <Website_head property_name={allHotelDetails?.property_name} />

   {/* Body */}
   <div
     id="main-content"
     className={`${bgColor} px-4 pt-24 relative overflow-y-auto `}
   >
     {/* Navbar */}


     <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-3">
       {/* Basic Details */}
       <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
         <div className="flex items-center justify-between mb-4">
           <div className="flex-shrink-0">
             <span className="text-xl sm:text-xl leading-none font-bold text-gray-800">
               {allHotelDetails?.property_name}
             </span>
             <h3 className="text-base font-normal text-gray-500">
               {allHotelDetails?.star_rating}-Star{" "}
               {allHotelDetails?.property_category}
             </h3>
           </div>
           <div className="flex items-center justify-end flex-1">
             <span
               className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"
             >
              
             </span>
           </div>
         </div>
         <p className="text-base font-semibold text-gray-500 truncate">
           {allHotelDetails?.description_title}
         </p>
         <p className="text-sm font-medium text-gray-90  line-clamp-10 ">
           {allHotelDetails?.description_body}
         </p>
       </div>

       {/* Address */}
       <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
         <div className="flex items-center justify-between mb-4">
           <div className="flex-shrink-0">
             <h3 className="text-base font-bold text-gray-900 mb-4">
               {language?.address}
             </h3>
           </div>
           <div className="flex items-center justify-end flex-1">
             <span
               className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"
             >
              
             </span>
           </div>
         </div>
         {allHotelDetails?.address?.map((item, idx) => {
           return (
             <div className="flex flex-wrap" key={idx}>
               <div className="w-full lg:w-6/12 sm:w-6/12 sm:px-4 lg:px-2">
                 <div className="relative w-full mb-2">
                   <label
                     className="text-xs font-semibold text-gray-500 block mb-1"
                     htmlFor="grid-password"
                   >
                     {language?.streetaddress}
                   </label>
                   <label
                     className="text-xs font-medium  text-gray-900 block mb-1"
                     htmlFor="grid-password"
                   >
                     {item.address_street_address}
                   </label>
                 </div>
               </div>

               <div className="w-full lg:w-6/12 sm:w-6/12 sm:px-4 lg:px-2">
                 <div className="relative w-full mb-2">
                   <label
                     className="text-xs font-semibold text-gray-500 block mb-1"
                     htmlFor="grid-password"
                   >
                     {language?.landmark}
                   </label>
                   <label
                     className="text-xs  font-medium  text-gray-900 block mb-1"
                     htmlFor="grid-password"
                   >
                     {item.address_landmark}
                   </label>
                 </div>
               </div>
               <div className="w-full lg:w-6/12 sm:w-6/12 sm:px-4 lg:px-2">
                 <div className="relative w-full mb-2">
                   <label
                     className="text-xs font-semibold text-gray-500 block mb-1"
                     htmlFor="grid-password"
                   >
                     {language?.province}
                   </label>
                   <label
                     className="text-xs  font-medium text-gray-900 block mb-1"
                     htmlFor="grid-password"
                   >
                     {item.address_province}
                   </label>
                 </div>
               </div>
               <div className="w-full lg:w-6/12 sm:w-6/12 sm:px-4 lg:px-2">
                 <div className="relative w-full mb-2">
                   <label
                     className="text-xs font-semibold text-gray-500 block mb-1"
                     htmlFor="grid-password"
                   >
                     {language?.latitude}
                   </label>
                   <label
                     className="text-xs  font-medium text-gray-900 block mb-1"
                     htmlFor="grid-password"
                   >
                     {item.address_latitude}
                   </label>
                 </div>
               </div>
               <div className="w-full lg:w-6/12 sm:w-6/12 sm:px-4 lg:px-2">
                 <div className="relative w-full mb-2">
                   <label
                     className="text-xs font-semibold text-gray-500 block mb-1"
                     htmlFor="grid-password"
                   >
                     {language?.longitude}
                   </label>
                   <label
                     className="text-xs  font-medium text-gray-900 block mb-1"
                     htmlFor="grid-password"
                   >
                     {item.address_longitude}
                   </label>
                 </div>
               </div>
               <div className="w-full lg:w-6/12 sm:w-6/12 sm:px-4 lg:px-2">
                 <div className="relative w-full mb-2">
                   <label
                     className="text-xs font-semibold text-gray-500 block mb-1"
                     htmlFor="grid-password"
                   >
                     {language?.postalcode}
                   </label>
                   <label
                     className="text-xs font-medium text-gray-900 block mb-1"
                     htmlFor="grid-password"
                   >
                     {item.address_zipcode}
                   </label>
                 </div>
               </div>
               <div className="w-full lg:w-6/12 sm:w-6/12 sm:px-4 lg:px-2">
                 <div className="relative w-full mb-2">
                   <label
                     className="text-xs font-semibold text-gray-500 block mb-1"
                     htmlFor="grid-password"
                   >
                     {language?.precision}
                   </label>
                   <label
                     className="text-xs font-semibold  text-gray-900 block mb-1"
                     htmlFor="grid-password"
                   >
                     {item.address_precision}
                   </label>
                 </div>
               </div>
               <div className="w-full lg:w-6/12 sm:w-6/12 sm:px-4 lg:px-2">
                 <div className="relative w-full mb-2">
                   <label
                     className="text-xs font-semibold text-gray-500 block mb-1"
                     htmlFor="grid-password"
                   >
                     {language?.countrycode}
                   </label>
                   <label
                     className="text-xs  font-medium text-gray-900 block mb-1"
                     htmlFor="grid-password"
                   >
                     {item.address_country}
                   </label>
                 </div>
               </div>
             </div>
           );
         })}
       </div>

       {/*Contact */}
       <div className="bg-white shadow rounded-lg px-2 py-4 sm:p-6 xl:py-8 xl:px-4 ">
         <div className="flex items-center justify-between mb-4">
           <div className="flex-shrink-0">
             <h3 className="text-base font-bold text-gray-900 mb-4">
               {language?.contact}
             </h3>
           </div>
           </div>
         <div className="align-middle inline-block  min-w-full">
           <div className="shadow overflow-hidden">
             <table className="table-fixed min-w-full divide-y divide-gray-200">
               <tbody className="bg-white divide-y divide-gray-200">
                 {allHotelDetails?.contacts?.map((item, idx) => {
                   return (
                     <tr className="hover:bg-gray-100" key={idx}>
                       <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                         <span className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">
                           {item?.contact_type}{" "}
                         </span>
                       </td>
                       <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">
                         {item?.contact_data}{" "}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         </div>
       </div>
     </div>

     <div className="mt-4 grid grid-flow-row-dense lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 gap-3">
       {/* Services */}
       <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
         <div className="flex items-center justify-between mb-4">
           <div className="flex-shrink-0">
             <h3 className="text-base font-bold text-gray-900 mb-4">
               {language?.services}
             </h3>
           </div>
          
         </div>
         <div className="flex flex-wrap">
           <span>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2 "
             >
               Air Conditioned
             </button>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Swimming Pool
             </button>
           </span>
           <br />
           <span>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Child Friendly
             </button>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Pets Allowed
             </button>
           </span>
           <br />
           <span>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Laundary Service
             </button>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Wifi
             </button>
           </span>
           <br />
           <span>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Smoke Free Property
             </button>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Spa
             </button>
           </span>
           <br />
           <span>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Bussiness Center
             </button>
             <button
               className="text-sm  font-semibold  text-cyan-700 
                         bg-gray-200 rounded-lg p-2 mx-1  mb-2"
             >
               Kitchen Available
             </button>
           </span>
         </div>
       </div>

       {/* Reviews */}
       <div className="col-span-2 bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
         <div className="flex items-center justify-between ">
           <div className="flex-shrink-0">
             <h3 className="text-base font-bold text-gray-900 mb-4">
               {language?.reviews}
             </h3>
           </div>
          
         </div>
         {allHotelDetails?.Reviews?.map((item, idx) => (
           <div key={idx}>
             <div className="flex items-center justify-between mb-2">
               <span className="text-sm leading-none font-semibold text-gray-800">
                 {item?.review_author}
               </span>

               <div className="flex-shrink-0">
                 <div className="flex items-center flex-1 justify-end px-2 text-yellow-400 text-sm font-bold">
                   {[...Array(item?.review_rating)].map(
                     (elementInArray, index) => (
                       <div key={index}>
                         <svg
                           aria-hidden="true"
                           focusable="false"
                           data-prefix="fas"
                           data-icon="star"
                           className="w-4 text-yellow-500 mr-1"
                           role="img"
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 576 512"
                         >
                           <path
                             fill="currentColor"
                             d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                           ></path>
                         </svg>
                       </div>
                     )
                   )}
                 </div>
               </div>
             </div>
             <p className="text-sm my-2 text-gray-600 line-clamp-2">
               {" "}
               {item?.review_content}{" "}
             </p>
           </div>
         ))}
       </div>
     </div>

     {/* Gallery */}
     <div className="mt-2 grid grid-flow-row-dense md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-3">
       <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
         <div className="flex items-center justify-between ">
           <div className="flex-shrink-0">
             <h3 className="text-base font-bold text-gray-900 mb-4">
               {language?.gallery}
             </h3>
           </div>
          
         </div>
         <div className=" flex-wrap container grid md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-3">
           {allHotelDetails?.images?.map((item, idx) => {
             return (
               <div
                 className="block text-blueGray-600 text-xs font-bold "
                 key={idx}
               >
                 <img
                   src={item?.image_link}
                   alt="property_image"
                   style={{ width: "400px", height: "180px" }}
                 />
               </div>
             );
           })}
         </div>
       </div>
     </div>

   </div>
 </div>
   
 } </>
  );
}
export default page;
page.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}
