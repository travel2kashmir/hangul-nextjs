import React, { useState, useEffect } from 'react';
import Header from "../../../components/Header";
import axios from 'axios';
import Link from "next/link";
import Router from 'next/router'
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Button from "../../../components/Button";
import Sidebar from "../../../components/Sidebar";
var language;
var currentProperty;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");


function AddBasicDetails() {
  const [basicDetails, setBasicDetails] = useState([]);
  const [allHotelDetails, setAllHotelDetails] = useState({
    property_name: '',
    property_category: '',
    property_brand: '',
    established_year: '',
    star_rating: '',
    description_title: '',
    description_body: '',
    description_date: '',
    status: true
  });
  const [address, setAddress] = useState({
    address_street_address: '',
    address_landmark: '',
    address_city: '',
    address_province: '',
    address_latitude: '',
    address_longitude: '',
    address_zipcode: '',
    address_precision: '',
    address_country: ''
  });
  const [basic, setBasic] = useState(0);
  /** Fetching language from the local storage **/
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
      }
    }
    firstfun();

    Router.push("./addbasicdetails");
    setAllHotelDetails({ ...allHotelDetails, description_date: current })
  }, [])

  //finding current date 
  var current = new Date();
  let month = current.getMonth() + 1;
  var descriptionDate = `${current.getDate()}/${month < +10 ? `0${month}` : `${month + 1}`}/${current.getFullYear()}`;

  const validateBasicDetails = (allHotelDetails, address) => {
    console.log("address present"+address.length === undefined )
    if (address.length === undefined) {
      //detect empty values in basic details
      for (let item in allHotelDetails) {
        if ((allHotelDetails[item] === '') && (item != "description_date") && (item != "property_brand")) {
          return `APP:insert value of ${item?.replace("_", " ")}`
        }
      }
      //check  date  established 
      if ((allHotelDetails?.established_year.slice(0, 4) > current.getFullYear())) {
        return 'APP: Established year is greater than current year'
      }
      //check star rating
      if ((parseInt(allHotelDetails.star_rating) < 0) || (parseInt(allHotelDetails.star_rating) > 7) || (allHotelDetails.star_rating === '')) {
        return 'APP: Enter star rating between 0 to 7'
      }
      return true;
    }

    return true
    
  }
//validate Address
const validateAddress = () => {
    console.log("checking address")
    //detect empty values in address
  for (let item in address) {
    if (address[item] === '') {
      console.log(item)
      return `APP:insert value of ${item?.replace("_", " ")}`
    }
  }

  //check latitudes 
  if ((address?.address_latitude < -90) || (address?.address_latitude > 90)) {
    return 'APP: The value of latitude should be between -90 to +90'
  }
  //check longitude 

  if ((address?.address_longitude < -180) || (address?.address_longitude > 180)) {
    return 'APP: The value of latitude should be between -180 to +180'
  }
  //check zip code
  if ((!address.address_zipcode.match('^[1-9][0-9]{5}$'))) {
    return 'APP: Please Enter Valid Indian Zip code'
  }
  //check precision
  if (address.address_precision < 0 || address.address_precision > 1000) {
    return 'APP: Precision should be between 0-1000'
  }
  return true;
  
}

  //to send data to database
  const submitBasic = () => {

    const valid = validateAddress(allHotelDetails, address);
    if (valid === true) {
      const propertydata = { "address": [address] }
      const finalData = { ...allHotelDetails, ...propertydata }
      console.log(JSON.stringify(finalData), 'finaldata')
      axios.post('/api/basic', finalData).then((response) => {
        localStorage.setItem("property_id", JSON.stringify(response?.data?.property_id));
        toast.success("API: Property Added Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        Router.push('../AdminLanding')
      }).catch((e) => {
        console.log(JSON.stringify(e));
        toast.error(`API: ${e.message}`, {
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
    else {
      toast.error(valid, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  return (
    <>
    <div className="flex backdrop-blur-sm bg-black/5 overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center h-modal sm:h-full" id="user-modal">
        <div className="relative w-full max-w-5xl px-4 h-full md:h-auto">
        <button
          className="float-right my-8 sm:inline-flex  text-gray-800  
            font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
            rounded-lg text-sm px-1 py-1 text-center 
            items-center mb-1 ml-16 mr-4 ease-linear transition-all duration-150"
          type="button"
          onClick={() => Router.push('../AdminLanding')}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
          </path></svg>
        </button>

        <div className={basic === 0 ? "block " : "hidden"}>
          <div className=" bg-white shadow rounded-lg py-12  px-12 sm:p-6 xl:p-8  2xl:col-span-2 ">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[45%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.basicdetails}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.address}</div>
            </div>
        </div>
            <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
              {language?.basicdetails}

              <svg className="ml-2 h-6 mb-2 w-6 font-semibold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
            </h6>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.propertyname}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllHotelDetails({ ...allHotelDetails, property_name: e.target.value })
                          )
                        }
                      />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                      <label className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password">
                        {language?.propertycategory}
                      </label>
                      <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                        onChange={
                          (e) => (
                            setAllHotelDetails({ ...allHotelDetails, property_category: e.target.value })
                          )
                        }
                      >
                        <option defaultValue="" >Select</option>
                        <option defaultValue="hotel" >Hotel</option>
                        <option defaultValue="resort">Resort</option>
                        <option defaultValue="motel">Motel</option>
                      </select>
                    </div>
                  

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.propertybrand}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllHotelDetails({ ...allHotelDetails, property_brand: e.target.value })
                          )
                        }
                      />
                    </div>
                  

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.establisheddate}
                      </label>
                      <input
                        type="Date"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllHotelDetails({ ...allHotelDetails, established_year: e.target.value })
                          )
                        }
                      />
                    </div>
                 

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.starrating}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="7"
                        pattern="\[0-7]"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => {
                            if (e.target.value >= 0 && e.target.value <= 7)
                              setAllHotelDetails({ ...allHotelDetails, star_rating: e.target.value })
                            else
                              e.target.value = 0
                          }
                        }
                      />
                    </div>
                  

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.descriptiontitle}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllHotelDetails({ ...allHotelDetails, description_title: e.target.value })
                          )
                        }
                      />
                    </div>
                 

                    <div className="col-span-6 sm:col-span-3">
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
                      />
                    </div>
                  
                </div>
              </div>
           
            <div className='float-right -mt-4'>
              <Button className="float-right" Primary={language?.Submit} onClick={() => {validateBasicDetails(allHotelDetails,address)=== true? setBasic(1): alert((validateBasicDetails(allHotelDetails,address)))}} />
            </div>
          </div>
        </div>

         {/*Address Form*/}
         <div className={basic === 1 ? "block" : "hidden"}>
        <div className=" bg-white shadow rounded-lg  px-12 sm:p-6 xl:p-8  2xl:col-span-2 ">
        <div className="relative before:hidden  before:lg:block before:absolute before:w-[45%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.basicdetails}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.address}</div>
            </div>
          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
              {language?.address}

              <svg className="ml-2 h-6 mb-2 w-6 font-semibold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
            </h6>
            <div className="p-6 space-y-6 -my-8">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.streetaddress}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={(e) =>
                        setAddress({
                          ...address,
                          address_street_address: e.target.value,
                        })
                      }
                    />
                  </div>
              
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.landmark}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={(e) =>
                        setAddress({
                          ...address,
                          address_landmark: e.target.value,
                        })
                      }
                    />
                  </div>
                
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.city}
                    </label>
                    <select
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          address_city: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="srinagar">Srinagar</option>
                      <option value="baramulla">Baramulla</option>
                      <option value="budgam">Budgam</option>
                      <option value="pahalgam">Pahalgam</option>
                      <option value="gulmarg">Gulmarg</option>
                    </select>
                  </div>
               
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.province}
                    </label>
                    <select
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          address_province: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="jammu and kashmir">Jammu and Kashmir</option>
                      <option value="kargil">Kargil</option>
                      <option value="delhi">Delhi</option>
                      <option value="maharastra">Maharastra</option>
                    </select>
                  </div>
               
                  <div className="col-span-6 sm:col-span-3">
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

                      onChange={(e) =>
                        setAddress({
                          ...address,
                          address_latitude: e.target.value,
                        })
                      }
                    />
                  </div>
             
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.longitude}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={(e) =>
                        setAddress({
                          ...address,
                          address_longitude: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.postalcode}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={(e) =>
                        setAddress({
                          ...address,
                          address_zipcode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="lg:col-span-6 col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.precision}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={(e) =>
                        setAddress({
                          ...address,
                          address_precision: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.country}
                    </label>
                    <select
                      onChange={(e) => setAddress({ ...address, address_country: e.target.value })}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
                      <option value="">Select</option>
                      <option value="IN">India</option>
                      <option value="PK">Pakistan</option>
                      <option value="UN">United States of America</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
               
                <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                <Button Primary={
                    {
                      label: "<-Edit Basic Details",
                      color: "bg-cyan-600 hover:bg-cyan-700 text-white",
                    }} onClick={() => setBasic(0)} />
                
                  {Button !== 'undefined' ?
                    <Button Primary={language?.Submit} onClick={submitBasic} />
                    : <></>
                  }
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

        </div></div></>
 )
}

export default AddBasicDetails
AddBasicDetails.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}