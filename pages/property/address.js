import React, { useEffect, useState } from "react";
import axios from "axios";
import DarkModeLogic from "../../components/darkmodelogic";
import objChecker from "lodash"
import Sidebar  from "../../components/Sidebar";
import Headloader from '../../components/loaders/headloader';
import Lineloader from '../../components/loaders/lineloader';
import Header  from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button";
var language;
var currentProperty;
const logger = require("../../services/logger");
import Link from "next/link";
import Router from 'next/router'
import Footer from '../../components/Footer';
import Loader from "../../components/loader";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
var i=0;
var currentLogged;
function Address() {
  const [visible,setVisible]=useState(0) 
  const [spinner, setSpinner] = useState(0)
  const [flag, setFlag] = useState([]);
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})

  useEffect(()=>{  
    const firstfun=()=>{  
      if (typeof window !== 'undefined'){ 
        var locale = localStorage.getItem("Language");
        var locale = localStorage.getItem("Language");
        const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
        const color = JSON.parse(localStorage.getItem("Color"));
         setColor(color);
         setDarkModeSwitcher(colorToggle)
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
    currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
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
    .then((response)=>{setAddress(response.data.address?.[i]);
      setAllHotelDetails(response.data.address?.[i])
    logger.info("url  to fetch property details hitted successfully")
     setVisible(1)})
    .catch((error)=>{logger.error("url to fetch property details, failed")});  
}


  useEffect(() => {
    fetchHotelDetails(); 
  },[]);
  useEffect(()=>{ 
    setColor(DarkModeLogic(darkModeSwitcher))
   },[darkModeSwitcher])
  /* Edit Address Function */
  const submitAddressEdit = () => {
    if(flag === 1){
      if(objChecker.isEqual(allHotelDetails,address)){
        toast.warn('No change in Address detected. ', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
          setFlag([])
      }
     else{
      setSpinner(1)
    const final_data = {
      address_id: address?.address_id,
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
        setSpinner(0)
        setFlag([])
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
        setSpinner(0)
        setFlag([])
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
    }
  };

  return (
    <>
   
     <Header color={color} Primary={english?.Side}/>
     <Sidebar color={color} Primary={english?.Side}/>
     
    <div id="main-content"
    className={`${color?.greybackground} px-4 py-2 pt-24 relative overflow-y-auto lg:ml-64`}>
      {/* Navbar */}
       {/* Navbar */}
       <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
              <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} 
                className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                </Link></div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.text} capitalize text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="./propertysummary" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{currentProperty?.property_name}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.address}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>

      {/* Update Address Form */}
      <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
        <h6 className={`${color?.text} text-xl  flex leading-none pl-6 pt-2 font-bold`}>
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
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.streetaddress}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={address?.address_street_address}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_street_address: e.target.value,
                          },setFlag(1))
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.landmark}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={address?.address_landmark}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_landmark: e.target.value,
                          },setFlag(1))
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.city}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_city: e.target.value,
                          },setFlag(1))
                        }
                      >
                        <option disabled selected>{address?.address_city}</option>
                        <option value="Baramulla">Baramulla</option>
                        <option value="Pahalgam">Pahalgam</option>
                        <option value="Gulmarg">Gulmarg</option>
                      </select>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.province}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_province: e.target.value,
                          },setFlag(1))
                        }
                      >
                         <option selected disabled>{address?.address_province}</option>
                        <option value="Jammu And Kashmir">Jammu and Kashmir</option>
                        <option value="Kargil">Kargil</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharastra">Maharastra</option>
                      </select></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.latitude}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                       type="text" 
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={address?.address_latitude}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_latitude: Number(e.target.value),
                          },setFlag(1))
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.longitude}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text" 
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={address?.address_longitude}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_longitude: Number(e.target.value),
                          },setFlag(1))
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.postalcode}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text" 
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={address?.address_zipcode}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_zipcode: Number(e.target.value),
                          },setFlag(1))
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.precision}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                       type="text"   
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={address?.address_precision}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_precision: Number(e.target.value)
                          },setFlag(1))
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.country}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}>
                      onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            address_country: e.target.value
                          },setFlag(1))
                        }
                        <option selected disabled>{address?.address_country}</option>
                        <option value="IN">India</option>
                        <option value="PK">Pakistan</option>
                        <option value="UN">United States of America</option>
                        <option value="UK">United Kingdom</option>
                      </select></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      </div></div>
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                   <div className={flag !== 1 && spinner === 0? 'block' : 'hidden'}>
                      <Button Primary={language?.UpdateDisabled}  /></div>
                    <div className={spinner === 0 && flag === 1 ? 'block' : 'hidden'}>
                      <Button Primary={language?.Update} onClick={submitAddressEdit} />
                     </div>
                     <div className={spinner === 1 && flag === 1? 'block' : 'hidden'}>
                   <Button Primary={language?.SpinnerUpdate} />
                       </div>
              </div>  
                </div>
              </div>
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
    <Footer/>
   
    </>
  );
}
export default Address;
Address.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }
