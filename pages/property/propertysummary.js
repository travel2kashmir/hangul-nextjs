import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from 'axios';
import Link from "next/link";
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
var language;
var currentUser;
var currentProperty;

function PropertySummary() {
  /** State to store Current Property Details **/
  var theme1 = "bg-sky-50";
  var theme2 = "bg-lime-50";
  var theme3 = "bg-rose-50";
  var theme4 = "bg-orange-50";
  var theme5 = "bg-indigo-50";
  const [allHotelDetails, setAllHotelDetails] = useState([]);
  const [themes, setThemes] = useState(false)
  const [theme, setTheme] = useState(theme1)
  const [themeName, setThemeName] = useState()
  const [bgColor, setBgColor] = useState(theme1)
  const [uri, setUri] = useState("")
  const [visible,setVisible]=useState(0) 

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
      }
    }
    firstfun();
    router.push("./propertysummary");
  }, [])

  const initialtheme = () => {
    var url;
    url = `/api/property_page/${allHotelDetails?.property_name.replaceAll(' ', '-')}-${currentProperty.address_city}`;
    axios.get(url)
      .then((response) => {
        setTheme(response.data.theme_id);
        setBgColor(response.data.theme_id);
        switch (response.data.theme_id) {
          case "bg-sky-50":
            setThemeName("Theme 1");
            break;
          case "bg-lime-50":
            setThemeName("Theme 2");
            break;
          case "bg-rose-50":
            setThemeName("Theme 3");
            break;
          case "bg-orange-50":
            setThemeName("Theme 4");
            break;
          case "bg-indigo-50":
            setThemeName("Theme 5");
            break;
          default: setThemeName(response.data.theme_id)
}
        logger.info("url  to fetch property details hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });

  }
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
    if (allHotelDetails.length === 0) fetchHotelDetails();
    if (allHotelDetails.length != 0){initialtheme();setVisible(1)} 
  }, [allHotelDetails]);

  const sendLink = () => {
    const data = {
      uuid: `${allHotelDetails?.property_name.replaceAll(' ', '-')}-${currentProperty.address_city}`,
      property_id: currentProperty.property_id,
      address_id: allHotelDetails.address[0].address_id,
      theme_id: theme,
      lang: localStorage?.getItem("Language")
    }

    axios.post('/api/property_page', data).then(
      (response) => {
        toast.success("Page Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        initialtheme();
        Router.push("./propertysummary");
      }).catch((error) => toast.error("Unique URL Update Error!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }))
  }

  return (
    <div>
      <div className={visible===0?'block':'hidden'}><Loader/></div>
    <div className={visible===1?'block':'hidden'}>
      <Header Primary={english?.Side} />
      <Sidebar Primary={english?.Side} />
      {/* Body */}
      <div
        id="main-content"
        className={`${bgColor} px-4 pt-24 relative overflow-y-auto lg:ml-64`}
      >
        {/* Navbar */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <div className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
                <svg
                  className="w-5 h-5 mr-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                <Link href="./landing">
                  <a>{language?.home}</a>
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
                <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">
                  {allHotelDetails?.property_name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div>
        </div>

        {/* Themes Active and Link */}
        <div className="flex my-2" >
          {/* Theme Dropdown and Save  */}
          <div>

            <span className="flex items-center">
              <span className="h-2.5 w-2.5 capitalize rounded-full bg-green-400 mx-2"></span>
              <span className="text-base font-semibold mr-4 text-gray-700">{themeName} </span>
            </span>
          </div>


          {/* Link */}
          <div className="flex items-center justify-end space-x-1 mr-2 sm:space-x-2 ml-auto">
            <span> Click here</span>
            <span className="text-cyan-800 underline">
              <Link href={`https://hangul-v3.herokuapp.com/${allHotelDetails?.property_name?.replaceAll(' ', '-')}-${currentProperty?.address_city}`}>
               <a target="_blank"> {`https://hangul-v3.herokuapp.com/${allHotelDetails?.property_name?.replaceAll(' ', '-')}-${currentProperty?.address_city}`.toLowerCase()}</a></Link>
            </span>

          </div>

        </div>

        {/* Themes Selection*/}
        <div className="flex" >
          <h6 className="text-xl pb-4 flex mr-4 leading-none  pt-2 font-bold text-gray-800 ">
            {language?.propertysummary}
          </h6>
          <div className="flex items-center justify-end space-x-1  sm:space-x-2 ml-auto">
            <div>
              <button onClick={() => { setThemes(!themes) }} className="text-cyan-600 sm:text-xs bg-white hover:bg-gray-50 
                    focus:ring-4 focus:outline-none focus:ring-gray-200 font-semibold rounded-lg text-sm px-4 py-2.5 
                         text-center inline-flex items-center"
                      type="button">Select Theme <svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" stroke-Linejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <div className={themes === true ? 'block' : 'hidden'}>
                <div className="z-10 w-40 absolute bg-white rounded overflow-hidden divide-y divide-gray-100 shadow dark:bg-gray-700">
                  <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => { setBgColor(theme1); setTheme(theme1); setThemeName("Theme-1");setThemes(!themes) }} >Theme-1</button>
                    </li>
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => { setBgColor(theme2); setTheme(theme2); setThemeName("Theme-2"); setThemes(!themes) }} >Theme-2</button>
                    </li>
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => { setBgColor(theme3); setTheme(theme3); setThemeName("Theme-3"); setThemes(!themes) }} >Theme-3</button>
                    </li>
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => { setBgColor(theme4); setTheme(theme4); setThemeName("Theme-4"); setThemes(!themes) }} >Theme-4</button>
                    </li>
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => { setBgColor(theme5); setTheme(theme5); setThemeName("Theme-5"); setThemes(!themes) }} >Theme-5</button>
                    </li>
                  </ul>
                </div></div></div>

            <div>
              <button className="bg-cyan-600 text-sm text-center hover:bg-cyan-700 text-white mr-2 py-2 px-4 rounded" onClick={() => {
                setUri(`${allHotelDetails?.property_name.replaceAll(' ', '-')}-${currentProperty.address_city}`.toLowerCase());
                sendLink();
              }}
              >Save</button>

            </div>
          </div>
        </div>

        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-3">
          {/* Basic Details */}
          <div className="bg-white shadow rounded-lg p-4  sm:p-6 xl:p-8 ">
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
                  <Link href="./basicdetails"><a>{language?.seemore}</a></Link>
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
                  <Link href="./address">
                    <a>{language?.seemore}</a>
                  </Link>
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
        <div className="mt-2 grid grid-flow-row-dense pb-2 md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-3">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
            <div className="flex items-center justify-between ">
              <div className="flex-shrink-0">
                <h3 className="text-base font-bold text-gray-900 mb-4">
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
    <Footer/>
    </div>
  );
}
export default PropertySummary;
PropertySummary.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }