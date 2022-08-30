import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import CurrencyList from 'currency-list'
import Headloader from '../../../components/loaders/headloader';
import Lineloader from '../../../components/loaders/lineloader';
import Sidebar  from "../../../components/Sidebar";
import Header  from "../../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var currency = require('currency-codes');
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar";
import countries from "countries-list";
import Router from "next/router";
import Button from '../../../components/Button';
var langs = require('langs');
var language;
var currentProperty;
var currentLogged;
var language_data=[];
var country_data=[];
var currency_data=[];
var j = 1;
var sale_id;
const logger = require("../../../services/logger");

function Addpointofsale() {
  const [disp, setDisp] = useState(0);
  const [visible, setVisible] = useState(0);
  const [sales, setSales] = useState([]);
  const [device, setDevice] = useState([{user_device:'tablet'}, {user_device:'mobile'},{user_device:'laptop'} ])
  const [allbundles,setAllBundles]=useState([])
  const [languageData,setLanguageData]=useState([])
  const [currencyData,setCurrencyData]=useState([])
  const [countryData,setCountryData]=useState([])
  const [countryCheck, setCountryCheck] = useState(false);
  const [languageCheck, setLanguageCheck] = useState(false);
  const [deviceCheck, setDeviceCheck] = useState(false);
  const [siteCheck, setSiteCheck] = useState(false);
  const [currencyCheck, setCurrencyCheck] = useState(false);
  const [error, setError] = useState({})

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
        /** Current Property Basic Details fetched from the local storage **/
        currentProperty = JSON.parse(localStorage.getItem('property'));
       currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
     }
    }
    firstfun();
    createLanguages();
  }, [])

//  Fetch Room Bundles
  const fetchBundles = async () => {
    const url = `/api/room_bundle/${currentProperty.property_id}`;
    axios.get(url)
      .then((response) => {
        setAllBundles(response.data);
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });
  }
  // Languages for Drop Down
  const createLanguages = () => {
    var languageCodes = langs.all();
    console.log(languageCodes)
     languageCodes.map(code => {
       var temp = {
         language_name: code.name,
         language_code: code?.[j]
       }
     language_data.push(temp) } );
     setLanguageData(language_data);   
   }
   // Languages for Dropdown 
   const createCurrency = () => {
    var cc=currency.data;
    cc?.map(code => {
       var temp = {
         currency_code: code.code,
         currency_name: code?.currency
       }
     currency_data.push(temp) } );
     setCurrencyData(currency_data);  
   }
   // Country for Dropdown   
   const createCountry = () => {
    var countryCodes = Object.keys(countries.countries);
      countryCodes.map(code => {
        var temp = {
          country_name: countries.countries[code].name,
          country_code: code
        }
      country_data.push(temp) } );
      setCountryData(country_data);
    }
  //  To Fetch Room Bundles
   useEffect(() => {
    fetchBundles();
    createCountry();
  }
    , [])

    // Point of Sale Add Function
    const submitPointofsale = () => {
    createCurrency();
    if (validationPOS(sales)){ 
        const final_data ={
          property_id: currentProperty?.property_id,
          rate_master_id:sales?.rate_master_id,
          display_name: sales?.display_name,
          display_language: sales?.display_language,
          url:sales?.url,
          status: true
        };
        const url = "/api/point_of_sale";
        axios
          .post(url, final_data, {
            header: { "content-type": "application/json" },
          })
          .then((response) => {
            toast.success("Point of sale added successfully.", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            sale_id = response.data.sale_id;
           setSales([])
           setDisp(1);
          })
          .catch((error) => {
            toast.error("Point of sale add error.", {
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

 // Validation Function
  const validationPOS = (sales) => {
    var Result = checkPOSData(sales);
    if (Result === true){
     return true;
    }
    else{
     setError(Result);
     return false;

    }

 }
// Validation Function
const validationMatchStatus = (sales) => {
  var Result = checkMatchStatusData(sales);
  if (Result === true){
   return true;
  }
  else{
   setError(Result);
   return false;

  }

}
  //Checking Form Data for Validations
  const checkPOSData = (sales) => {
    var error={};
    if(sales?.display_name === "" || sales?.display_name === undefined){
      error.display_name = "The point of sale name field is required."
    }
    if(sales?.display_language === "" || sales?.display_language === undefined){
      error.display_language = "This point of sale language field is required."
    }
    if(sales?.rate_master_id === "" || sales?.rate_master_id === undefined){
      error.rate_master_id = "This is required."
    }
    if(sales?.url === "" || sales?.url === undefined){
      error.url = "This field is required."
    }
    if((!sales?.url?.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) && (sales.url != "" &&  sales.url != undefined))){
      error.url = "The url has invalid format."
    } 
    
   return Object.keys(error).length === 0 ? true :  error;

   }
   //Checking Form Data for Validations
  const checkMatchStatusData = (sales) => {
    var error={};
   
    if(sales?.match_status_name === "" || sales?.match_status_name === undefined){
      error.match_status_name = "This field is required."
    } 
    if(sales?.match_status === "" || sales?.match_status === undefined){
      error.match_status = "This field is required."
    }   
   return Object.keys(error).length === 0 ? true :  error;

   }
     // Point of Sale Add Function
  const submitMatchstatus = () =>
   { if (validationMatchStatus(sales)){ 
    if(countryCheck || currencyCheck || languageCheck || deviceCheck || siteCheck === true){
      const data =[{
        match_status: sales?.match_status,
          match_status_name:sales?.match_status_name,
          country: sales?.country,
          language: sales?.language,
          device:sales?.device,
          currency:sales?.currency,
          site_type: sales?.site_type  
      }];
      const final_data={match_status: data}
      const url = "/api/point_of_sale/match_status";
      axios
        .post(url, final_data, {
          header: { "content-type": "application/json" },
        })
        .then((response) => {
          toast.success("Match Status added successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          const datas = [{
             match_status_id:response.data.match_status_id,
            sale_id:sale_id
            }];
            const final_datas={pos_match_status_link: datas}
           const url = "/api/point_of_sale/pos_match_status_link";
            axios
              .post(url, final_datas, {
                header: { "content-type": "application/json" },
              })
              .then((response) => {
                toast.success("Match Status added successfully!", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              setSales([])
              Router.push("../pointofsales")
              })
              .catch((error) => {
                toast.error("POS link error!", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              });
          
         
        })
        .catch((error) => {
          toast.error("Match Status Add Error!", {
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
      else{
        toast.error("Please select at least one condition", {
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
  };

  return (
    <>
      <Header Primary={english?.Side} />
      <Sidebar Primary={english?.Side} />
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
                href="../landing"
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
                  <Link href="../propertysummary" >
                    <a> {currentProperty?.property_name}</a>
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
                <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                  <Link href="../pointofsales" >
                    <a> Point of Sales</a>
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
                  Add Point of Sale
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/* Point of Sale */}
        <div id='0' className={disp === 0 ? 'block' : 'hidden'}>
          <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[39%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Point of Sale</div>
              </div>

              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Match Status</div>
              </div>
            </div>
            <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
              Point of Sale
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
                        Point of Sale Name
                      </label>
                      <input
                        type="text"
                        className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setSales({ ...sales, display_name: e.target.value })
                          )
                        } />
                         <p className="text-red-700 font-light">
                   {error?.display_name}
            </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        Point of Sale Language
                      </label>
                      <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setSales({ ...sales, display_language: e.target.value })
                          )
                        }>
                        <option selected>Select</option>
                        {languageData?.map(i => {
                          return (
                            <option key={i} value={i.language_code}>{i.language_name}</option>)
                        }
                        )}

                      </select>
                      <p className="text-red-700 font-light">
                   {error?.display_language}
            </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        Room Bundle
                      </label>
                      <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setSales({ ...sales, rate_master_id: e.target.value })
                          )
                        }>
                        <option selected>Select</option>
                        {allbundles?.map(i => {
                          return (
                            <option key={i} value={i.rate_master_id}>{i.package_name}- {i.room_name}</option>)
                        }
                        )}

                      </select>
                      <p className="text-red-700 font-light">
                   {error?.rate_master_id}
            </p>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        Point of Sale URL
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setSales({ ...sales, url: e.target.value })
                          )
                        } />
                         <p className="text-red-700 font-light">
                   {error?.url}
            </p>
                    </div>
                  </div>

                  <div id="btn" className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    {Button !== 'undefined' ?
                      <Button Primary={language?.Next} onClick={() => { submitPointofsale() }} />
                      : <></>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id='1' className={disp === 1 ? 'block' : 'hidden'}>
          <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[39%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">  1</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Point of Sale</div>
              </div>

              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Match Status</div>
              </div>
            </div>
            <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
              Match Status
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
                        Match Status Name
                      </label>
                      <input
                        type="text"
                        className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setSales({ ...sales, match_status_name: e.target.value })
                          )
                        } />
                         <p className="text-red-700 font-light">
                   {error?.match_status_name}
            </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        Match Status
                      </label>
                      <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setSales({ ...sales, match_status: e.target.value })
                          )
                        }>
                        <option selected>Select</option>
                        <option value="yes">Yes</option>
                        <option value="never">Never</option>
                      </select>
                      <p className="text-red-700 font-light">
                   {error?.match_status}
            </p>
                    </div>
                  </div>
                </div>
                <div className="flex mx-2 flex-wrap my-4">
                  <div className="lg:w-10/12  px-1">
                    <div className="relative w-full ">

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex  ">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setCountryCheck(!countryCheck) }} checked={countryCheck === true}
                              className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 my-2 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                              Country
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300
                      text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setSales({ ...sales, country: e.target.value })
                              )
                            }>
                            <option selected>Select</option>
                            {countryData?.map(i => {
                              return (
                                <option key={i} value={i.country_code}>{i.country_name}</option>)
                            }
                            )}

                          </select>
                        </div>
                      </div>

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setDeviceCheck(!deviceCheck) }} checked={deviceCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                              Device
                            </label> </span></div>

                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setSales({ ...sales, device: e.target.value })
                              )
                            }>
                            <option selected>Select</option>
                            {device?.map(i => {
                              return (
                                <option key={i} value={i.user_device}>{i.user_device}</option>)
                            }
                            )}

                          </select></div>
                      </div>

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex ">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setLanguageCheck(!languageCheck) }} checked={languageCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                              Language
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setSales({ ...sales, language: e.target.value })
                              )
                            }>
                            <option selected>Select</option>
                            {languageData?.map(i => {
                              return (
                                <option key={i} value={i.language_code}>{i.language_name}</option>)
                            }
                            )}

                          </select>
                        </div>
                      </div>
                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setCurrencyCheck(!currencyCheck) }} checked={currencyCheck === true}
                              className="bg-gray-50 border-gray-300 focus:ring-3 my-2 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1"
                              className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium my-1 text-gray-900 mx-2 block "
                              htmlFor="grid-password"
                            >
                              Currency
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setSales({ ...sales, currency: e.target.value })
                              )
                            }>
                            <option selected>Select</option>
                            {currencyData?.map(i => {
                              return (
                                <option key={i} value={i.currency_code}>{i.currency_name}</option>)
                            }
                            )}

                          </select></div>
                      </div>
                      <div className='flex my-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setSiteCheck(!siteCheck) }} checked={siteCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1"
                              className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium my-1 text-gray-900 mx-2 block "
                              htmlFor="grid-password"
                            >
                              Site Type
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setSales({ ...sales, site_type: e.target.value })
                              )
                            }>
                            <option selected>Select</option>
                            <option value="localuniversal">Google</option>
                            <option value="mapresults">Google Maps</option>
                            <option value="placepage">Place page</option>
                          </select></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div></div>
            <div id="btn" className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
              {Button !== 'undefined' ?
                <Button Primary={language?.Submit} onClick={() => { submitMatchstatus() }} />
                : <></>
              }
            </div>
          </div></div>
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
    </>
  )
}

export default Addpointofsale