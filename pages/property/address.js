import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button";
var language;
var currentProperty;
const logger = require("../../services/logger");
import Link from "next/link";
import Router from 'next/router'
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"


function Address() {
  const Primary ={
    label: language?.update,
     color: "bg-cyan-600 text-white  hover:bg-cyan-700",
     
}
  useEffect(()=>{  
    const firstfun=()=>{  
      if (typeof window !== 'undefined'){ 
        var locale = localStorage.getItem("Language");
        if (locale === "ar") {
        language = arabic;
        }
        if (locale === "en") {
        language=english;
        }
        if (locale === "fr") {
          language = french;   
        } 
    /** Current Property Details fetched from the local storage **/
    currentProperty = JSON.parse(localStorage.getItem("property"));
      } 
    }
    firstfun();
   Router.push("./address");
  },[])

  const [allHotelDetails, setAllHotelDetails] = useState([]);
  const [address, setAddress] = useState([]);
  /* Function call to fetch Current Property Details when page loads */
  const fetchHotelDetails = async () => { 
    const url = `/api/${currentProperty.address_province.replace(
      /\s+/g,
      "-"
    )}/${currentProperty.address_city}/${
      currentProperty.property_category
    }s/${currentProperty.property_id}`;  
    axios.get(url)
    .then((response)=>{setAddress(response.data);
    logger.info("url  to fetch property details hitted successfully")})
    .catch((error)=>{logger.error("url to fetch property details, failed")});  
}
  useEffect(() => {
    fetchHotelDetails(); 
  },[]);

  /* Edit Address Function */
  const submitAddressEdit = () => {
    if (allHotelDetails.length !== 0){
    const final_data = {
      address_id: address?.address[0]?.address_id,
      address_street_address: allHotelDetails.address_street_address,
      address_longitude: allHotelDetails.address_longitude,
      address_latitude: allHotelDetails.address_latitude,
      address_landmark: allHotelDetails.address_landmark,
      address_city: allHotelDetails.address_city?.toLowerCase(),
      address_precision: allHotelDetails.address_precision,
      address_zipcode: allHotelDetails.address_zipcode,
      address_province: allHotelDetails.address_province?.toLowerCase(),
      address_country: allHotelDetails.address_country,
    };
    const url = "/api/address";
    axios
      .put(url, final_data, { header: { "content-type": "application/json" } })
      .then((response) => {
        toast.success("Address Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchHotelDetails(); 
        Router.push("./address");
        setAllHotelDetails([])
      })
      .catch((error) => {
        toast.error("Address Update Error!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    }
  };

  return (
    <div id="main-content"
    className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
      {/* Navbar */}
      <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <svg
              className="w-5 h-5 mr-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <Link
              href="./landing"
              className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"
            >
              <a>{language?.home}</a>
            </Link>
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
              <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="./propertysummary" >
              <a>  {address?.property_name} </a>
              </Link></span>
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
              <span
                className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  "
                aria-current="page"
              >
                {language?.address}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Update Address Form */}
      <div className="bg-white shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2">
        <h6 className="text-xl  flex leading-none pl-6 pt-2 font-bold text-gray-900 ">
          {language?.address}
          <svg
            className="ml-2 h-6 mb-2 w-6 font-semibold"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            ></path>
          </svg>
        </h6>
        {address?.address?.map((item, idx) => {
          return (
            <div className="pt-6" key={idx}>
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.streetaddress}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={item.address_street_address}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_street_address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.landmark}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={item.address_landmark}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_landmark: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.city}
                      </label>
                      <select
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_city: e.target.value,
                          })
                        }
                      >
                        <option value="srinagar">Srinagar</option>
                        <option value="baramulla">Baramulla</option>
                        <option value="budgam">Budgam</option>
                        <option value="pahalgam">Pahalgam</option>
                        <option value="gulmarg">Gulmarg</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {language?.province}
                      </label>
                      <select
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_province: e.target.value,
                          })
                        }
                      >
                        <option value="jammu and kashmir">
                          Jammu and Kashmir
                        </option>
                        <option value="kargil">Kargil</option>
                        <option value="delhi">Delhi</option>
                        <option value="maharastra">Maharastra</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.latitude}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900
                     sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600
                      block w-full p-2.5"
                        defaultValue={item.address_latitude}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_latitude: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.longitude}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={item.address_longitude}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_longitude: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.postalcode}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={item.address_zipcode}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_zipcode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.precision}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={item.address_precision}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_precision: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.country}
                      </label>
                      <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
                        <option value="IN">India</option>
                        <option value="PK">Pakistan</option>
                        <option value="UN">United States of America</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                  <Button Primary={Primary}  onClick={submitAddressEdit}/>
              </div>  
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Address;
