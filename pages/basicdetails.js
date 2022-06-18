import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Link from "next/link";
import Router from 'next/router'
import english from "../components/Languages/en"
import french from "../components/Languages/fr"
import arabic from "../components/Languages/ar"
var language;
var currentProperty;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../services/logger");

export default function BasicDetails() 
 {

  const [basicDetails, setBasicDetails] = useState([]);
 /** Fetching language from the local storage **/
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
 Router.push("/basicdetails");
},[])

const fetchBasicDetails = async () => { 
  const url = `/api/${currentProperty.address_province.replace(
    /\s+/g,
    "-"
  )}/${currentProperty.address_city}/${
    currentProperty.property_category
  }s/${currentProperty.property_id}`;  
  axios.get(url)
  .then((response)=>{setBasicDetails(response.data);
  logger.info("url  to fetch property details hitted successfully")})
  .catch((error)=>{logger.error("url to fetch property details, failed")});  
}
 /* Function call to fetch Current Property Details when page loads */
 useEffect(() => {
 
  fetchBasicDetails(); 
},[]);

  const current = new Date();
  let month = current.getMonth()+1;
  const descriptionDate = `${current.getDate()}/${month<+10?`0${month}`:`${month()+1}`}/${current.getFullYear()}`;
  const [allHotelDetails, setAllHotelDetails] = useState([])

  /* Edit Basic Details Function */
  const submitBasicEdit = () => {
    if (allHotelDetails.length !== 0){
    const final_data = {
         "property_id": currentProperty?.property_id,
         "property_name": allHotelDetails.property_name?.toLowerCase(),
         "property_category": allHotelDetails.property_category?.toLowerCase(),
         "property_brand": allHotelDetails.property_brand,
         "established_year": allHotelDetails.established_year,
         "star_rating": allHotelDetails.star_rating,
         "description_title": allHotelDetails.description_title,
         "description_body": allHotelDetails.description_body,
         "description_date": allHotelDetails.description_date
     }
    const url = '/api/basic'
     axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
         ((response) => {
             toast.success("Basic Details Updated Successfully!", {
                 position: "top-center",
                 autoClose: 5000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,
                 progress: undefined,
               });
               fetchBasicDetails(); 
               Router.push("/basicdetails");
              setAllHotelDetails([])
         })
         .catch((error) => {
            toast.error("Basic Details Update Error!", {
                 position: "top-center",
                 autoClose: 5000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,
                 progress: undefined,
               });      
         })
        }
 } 
 
  return (
      <div id="main-content"
      className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64" >
      {/* Navbar */}
      <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <Link href="/landing" className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">{basicDetails?.property_name}</span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.basicdetails}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Basic Details Form */}
      <div className=" bg-white shadow rounded-lg  px-12 sm:p-6 xl:p-8  2xl:col-span-2">
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
         {language?.basicdetails}
        
          <svg className="ml-2 h-6 mb-2 w-6 font-semibold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
        </h6>
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.propertyname} 
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={basicDetails?.property_name}
                    onChange={
                        (e) => (
                            setAllHotelDetails({ ...allHotelDetails, property_name: e.target.value })
                        )
                    }
                 />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password">
                   {language?.propertycategory}
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   defaultValue={basicDetails?.property_category}
                  onChange={
                    (e) => (
                        setAllHotelDetails({ ...allHotelDetails, property_category: e.target.value })
                    )
                }
                  >
                    <option defaultValue="hotel" >Hotel</option>
                    <option defaultValue="resort">Resort</option>
                    <option defaultValue="motel">Motel</option>
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.propertybrand}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={basicDetails?.property_brand}
                    onChange={
                        (e) => (
                            setAllHotelDetails({ ...allHotelDetails, property_brand: e.target.value })
                        )
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
                    {language?.establisheddate}
                  </label>
                  <input
                    type="Date"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={basicDetails?.established_year}
                    onChange={
                        (e) => (
                            setAllHotelDetails({ ...allHotelDetails, established_year: e.target.value })
                        )
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
                    {language?.starrating}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={basicDetails?.star_rating}
                    onChange={
                        (e) => (
                            setAllHotelDetails({ ...allHotelDetails, star_rating: e.target.value })
                        )
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
                    {language?.descriptiontitle}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={basicDetails?.description_title}
                    onChange={
                        (e) => (
                            setAllHotelDetails({ ...allHotelDetails, description_title: e.target.value })
                        )
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
                    {language?.description}
                  </label>
                  <textarea rows="5" columns="50"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                          setAllHotelDetails({ ...allHotelDetails, description_body: e.target.value })
                      )
                  }
                  defaultValue={basicDetails?.description_body} 
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.descriptiondate}
                  </label>

                  <input type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    
                   defaultValue={descriptionDate}
                 />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                <button
                  className="sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center 
                     items-center  mr-1 mb-1 ease-linear transition-all duration-150"
                  onClick={() => {
                    submitBasicEdit();
                  }}
                  type="button"
                >
                 {language?.update}
                </button>
              </div>  

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
  )
}



