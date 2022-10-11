import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from 'axios';
import Link from "next/link";
import DarkModeLogic from "../../components/darkmodelogic";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Router, { useRouter } from "next/router";
const logger = require("../../services/logger");
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button";
import Footer from '../../components/Footer';
import Loader from "../../components/loader";
import Carousal from "../template/carousal";
var language;
var currentUser;
var currentProperty;
var currentLogged;

function PropertySummary() {
  /** State to store Current Property Details **/
  const [allHotelDetails, setAllHotelDetails] = useState([]);
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
   const [color, setColor] = useState({})
   const[modeChanger,setModeChanger] = useState("")


    /** Router for Redirection **/
  const router = useRouter();
  useEffect(() => {
   
    firstfun();
    fetchHotelDetails();
    router.push("./propertysummary");
  }, [])

 useEffect(()=>{ 
  setColor(DarkModeLogic(darkModeSwitcher))
 },[darkModeSwitcher])

 const firstfun = () => {
  if (typeof window !== 'undefined') {
    var locale = localStorage.getItem("Language");
    const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
      const color = JSON.parse(localStorage.getItem("Color"));
     setColor(color);
     setDarkModeSwitcher(colorToggle)
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
const changeTheme = (props) => {
    localStorage.setItem("Mode", props)
   }

  /* Function call to fetch Current Property Details when page loads */
  
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

   


 
  return (
    <div>
      <Header color={color} Primary={english?.Side} />
      <Sidebar color={color} Primary={english?.Side} />
      {/* Body */}
      <div id="main-content"
         className={`${color?.greybackground} px-4 pt-24 relative overflow-y-auto lg:ml-64` }
 >
        {/* Navbar */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                <svg
                  className="w-5 h-5 mr-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../admin/AdminLanding":"./landing"} className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className={`${color?.textgray} text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2`}>
                  {allHotelDetails?.property_name} 
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div>
        </div>

        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-3">
          {/* Basic Details */}
          <div className={`${color?.whitebackground} shadow rounded-lg p-4  sm:p-6 xl:p-8`} >
          <div className="flex items-center justify-between ">
              <div className="flex-shrink-0">
                <h3 className={ `${color?.text} text-base font-bold  mb-4`}>
                {allHotelDetails?.property_name}
                </h3>
              </div>
              <div className="flex items-center justify-end flex-1">
                <span className="text-sm font-sans underline decoration-cyan-600
                             font-semibold text-cyan-600
                              rounded-lg p-2">
                  <Link href="./basicdetails"><a>{language?.seemore}</a></Link>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between ">
            <span className={`${color?.text} text-sm leading-none font-semibold `}>
              {allHotelDetails?.description_title}
            </span>
            <div className="flex-shrink-0">
                    <div className="flex items-center flex-1 justify-end px-2 text-yellow-400 text-sm font-bold">
                      {[...Array(allHotelDetails?.star_rating)].map(
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
                  </div></div>
            <p className={`${color?.textgray} text-sm my-2 line-clamp-10`}>
              {allHotelDetails?.description_body}
            </p>
          </div>

          {/* Address */}
          <div className={`${color?.whitebackground} shadow rounded-lg p-4  sm:p-6 xl:p-8`}>
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
              <h3 className={`${color?.text} text-base font-bold  mb-4`}>
                  {language?.address}
                </h3>
              </div>
              <div className="flex items-center justify-end flex-1">
                <span
                  className="text-sm font-sans underline decoration-cyan-600
                             font-semibold text-cyan-600
                              rounded-lg p-2"
                >
                  <Link href="./address">
                    <a>{language?.seemore}</a>
                  </Link>
                </span>
              </div>
            </div>
            <div className="align-middle inline-block min-w-full">
              <div className="overflow-hidden">
                <table className="table-fixed min-w-full  ">
                  <tbody>
                    {allHotelDetails?.address?.map((item, idx) => {
                      return (
                        <>
                        <tr key={idx}>
                          <td className="p-1 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold`}>
                            {language?.address}
                            </td>
                          </td>
                          <td className= {`${color?.textgray} p-1 whitespace-wrap text-sm my-2`} >
                          {item.address_street_address}{" "}
                          </td>
                        </tr> 
                        <tr key={idx}>
                          <td className="p-1 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold`}>
                            {language?.landmark}
                            </td>
                          </td>
                          <td className= {`${color?.textgray} p-1 whitespace-wrap text-sm my-2`}>
                          {item.address_landmark}{" "}
                          </td>
                        </tr>
                        <tr key={idx}>
                          <td className="p-1 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold `}>
                            {language?.postalcode}
                            </td>
                          </td>
                          <td className=  {`${color?.textgray} p-1 whitespace-wrap text-sm my-2`} >
                          {item.address_zipcode}{" "}
                          </td>
                        </tr>
                        <tr key={idx}>
                          <td className="flex p-1 items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold`}>
                            {language?.province}
                            </td>
                          </td>
                          <td className=  {`${color?.textgray} p-1 whitespace-wrap text-sm my-2`} >
                          {item.address_city}{" "}
                          </td>
                        </tr>
                        <tr key={idx}>
                          <td className="p-1 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold`}>
                            {language?.countrycode}
                            </td>
                          </td>
                          <td className=  {`${color?.textgray} p-1 whitespace-wrap text-sm my-2`}>
                          {item.address_country}{" "}
                          </td>
                        </tr>
                        <tr key={idx}>
                          <td className="p-1 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold`}>
                            {language?.latitude}
                            </td>
                          </td>
                          <td className=  {`${color?.textgray} p-1 whitespace-wrap text-sm my-2`} >
                          {item.address_latitude}{" "}
                          </td>
                        </tr>
                        <tr key={idx}>
                          <td className="p-1 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold `}>
                            {language?.longitude}
                            </td>
                          </td>
                          <td className=  {`${color?.textgray} p-1 whitespace-wrap text-sm my-2`}>
                          {item.address_longitude}{" "}
                          </td>
                        </tr>
                        <tr key={idx}>
                          <td className="p-1 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold `}>
                            {language?.precision}
                            </td>
                          </td>
                          <td className= {`${color?.textgray} p-1 whitespace-wrap text-sm my-2`}>
                          {item.address_precision}{" "}
                          </td>
                        </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/*Contact */}
          <div className={`${color?.whitebackground} shadow rounded-lg  p-4 sm:p-6 xl:py-8 xl:px-4`}>
            <div className="flex items-center justify-between ">
              <div className="flex-shrink-0">
                <h3 className={`${color?.text} text-base font-bold  mb-4`}>
                  {language?.contact}
                </h3>
              </div>
              <div className="flex items-center justify-end flex-1">
                <span
                  className="text-sm font-sans underline decoration-cyan-600
                             font-semibold text-cyan-600
                              rounded-lg p-2"
                >
                  {" "}
                  <Link href="./contact"><a>{language?.seemore}</a></Link>
                </span>
              </div>
            </div>
            <div className="align-middle inline-block  min-w-full">
              <div className="overflow-hidden">
                <table className="table-fixed min-w-full  ">
                  <tbody>
                    {allHotelDetails?.contacts?.map((item, idx) => {
                      return (
                        <tr key={idx}>
                          <td className=" flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                            <td className={`${color?.text} p-2 whitespace-wrap text-sm leading-none font-semibold`}>
                              {item?.contact_type}{" "}
                            </td>
                          </td>
                          <td className={`${color?.textgray} p-2 whitespace-wrap text-sm my-2`}>
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
    {/* Gallery */}
    <div className="mt-2 grid  grid-flow-row-dense pb-2 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-3">
          <div className= {`${color?.whitebackground} shadow rounded-lg p-4 xl:p-8`}>
            <div className="flex items-center justify-between ">
              <div className="flex-shrink-0">
                <h3 className={`${color?.text} text-base font-bold  mb-4`}>
                  {language?.gallery}
                </h3>
              </div>
              <div className="flex items-center justify-end flex-1">
                <span
                  className="text-sm font-sans underline decoration-cyan-600
                             font-semibold text-cyan-600
                              rounded-lg p-2"
                >
                  <Link href="./gallery"><a>{language?.seemore}</a></Link>
                </span>
              </div>
            </div>
            <div className=" flex-wrap container ">
              {/*grid md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 {allHotelDetails?.images?.map((item, idx) => {
                return (
                  <div
                    className="block text-blueGray-600 text-xs font-bold "
                    key={idx}
                  >
                    <img
                      src={item?.image_link}
                      alt="property_image"
                      style={{ width: "450px", height: "180px" }}
                    />
                  </div>
                );
              })} */}
              <Carousal images={allHotelDetails?.images}/>
            </div>
          </div>
        </div>




          <div className=" grid grid-flow-row-dense lg:grid-cols-3 md:grid-cols-1  sm:grid-cols-1 gap-3">
          {/* Services */}
          <div className={`${color?.whitebackground} shadow rounded-lg  p-4 sm:p-6 xl:p-8`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-shrink-0">
                <h3 className={`${color?.text} text-base font-bold mb-4`}>
                  {language?.services}
                </h3>
              </div>
              <div className="flex items-center justify-end">
                <span
                  className="text-sm font-sans underline decoration-cyan-600
                             font-semibold text-cyan-600
                              rounded-lg p-2"
                >
                  <Link href="./services"><a>{language?.seemore}</a></Link>
                </span>
              </div>
            </div>
            <div className="flex flex-wrap">
             
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
             
            </div>
          </div>
        
            
          {/* Reviews */}
          <div className={ `${color?.whitebackground} col-span-2  shadow rounded-lg p-4 sm:p-6 xl:p-8`}>
            <div className="flex items-center justify-between ">
              <div className="flex-shrink-0">
                <h3 className={`${color?.text} text-base font-bold  mb-4`}>
                  {language?.reviews}
                </h3>
              </div>
              <div className="flex items-center justify-end flex-1">
                <span
                  className="text-sm font-sans underline decoration-cyan-600
                             font-semibold text-cyan-600
                              rounded-lg p-2"
                >
                  <Link href="./reviews"><a>{language?.seemore}</a></Link>
                </span>
              </div>
            </div>
            {allHotelDetails?.Reviews?.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`${color?.text} text-sm leading-none font-semibold`}>
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
                <p className= {`${color?.textgray} text-sm my-2  line-clamp-2`}>
                  {" "}
                  {item?.review_content}{" "}
                </p>
              </div>
            ))}
          </div>
          </div>

       

      
      {/* Toast Container */}
      <ToastContainer position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
</div>
      <Footer color={color}/>
    </div>

  );
}
export default PropertySummary;
PropertySummary.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}