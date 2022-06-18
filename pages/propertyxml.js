import React, { useEffect, useState } from 'react';
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../components/Languages/en"
import french from "../components/Languages/fr"
import arabic from "../components/Languages/ar"
const logger = require("../services/logger");
var language;
var currentProperty;
var propertyxml;
var xml;
var format = require('xml-formatter');
import Router from 'next/router'

function Propertyxml() {
  const [hotelXML, setHotelXML] = useState();

  /** Use Effect to fetch details from the Local Storage **/
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
/** Current Property Basic Details fetched from the local storage **/
propertyxml =JSON.parse(localStorage.getItem('allPropertyDetails'))
/** Current Property Details fetched from the local storage **/
currentProperty = JSON.parse(localStorage.getItem("property"));
        } }
           firstfun(); 
           Router.push("/propertyxml")   
  },[])
    

  const call = () => {
    toast.success("Data Sent To Google SucessFully", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    const fetchXML = async () => {
      try {
        const url = `/api/${currentProperty.address_province.replace(
          /\s+/g,
          "-"
        )}/${currentProperty.address_city}/${
          currentProperty.property_category
        }s/${currentProperty?.property_id}/xml`;
        const response = await axios.get(url, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
        setHotelXML(response.data);
       
      } catch (error) {
        if (error.response) {
          logger.error("XML Fetching Failed");
        } else {
          logger.error("XML Fetching Failed");
        }
      }
    };
    fetchXML();
  },[]);

 

  return (
    <div>
      <div
        id="main-content"
        className="  bg-gray-50 pt-24 relative overflow-y-auto lg:ml-64"
      >
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
                href="/landing"
                className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"
              >
                <a>{language?.home} </a>
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
                <Link
                  href="/propertysummary"
                  className="text-gray-700 text-sm  capitalize font-medium hover:text-gray-900 ml-1 md:ml-2"
                >
                  <a>{propertyxml?.property_name}</a>
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
                <span
                  className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  "
                  aria-current="page"
                >
                  {language?.property} XML
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <h6 className="text-xl  flex leading-none pl-6 pt-2 pb-6 font-bold text-gray-900 ">
          {language?.property} XML
        </h6>

        {/* Property XML Form */}
        <div className="bg-white shadow rounded-lg mx-10 py-4 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
          {hotelXML ? (
            <>
              <div className="text-center flex justify-end">
                <button
                  className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 
                        focus:ring-cyan-200 font-semibold rounded-lg text-sm px-4 py-2 text-center items-center mr-3"
                  onClick={call}
                >
                  {language?.sendto} Google
                </button>
              </div>
              <div> 
              {hotelXML}

            </div>{" "}
            </>
          ) : (
            <h3>XML being fetched.Please wait.</h3>
          )}
        </div>
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

export default Propertyxml   