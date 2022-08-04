import React, { useEffect, useState } from 'react'
import Link from "next/link";
var langs = require('langs');
import Multiselect from 'multiselect-react-dropdown';
import Button from '../../../components/Button';
import countries from "countries-list";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../../../components/Header'
import Sidebar from '../../../components/Sidebar'
import english from '../../../components/Languages/en'
import french from '../../../components/Languages/fr'
import arabic from '../../../components/Languages/ar'
import axios from "axios";
import Router from 'next/router';
var i = 0;
var j = 1;
var languageCodes;
const logger = require("../../../services/logger");

var currentraterule;
var language;
var currentProperty;

function Raterule() {
  const [countryData,setCountryData]=useState([])
  const [languageData,setLanguageData]=useState([])
  const [finalLang,setFinalLang]=useState([])
  const [finalCountry,setFinalCountry]=useState([])
  const [rateRule, setRateRule] = useState([])
  const [programs, setPrograms] = useState([])
  const [allUserRateDetails, setAllUserRateDetails] = useState([])
  const [conditions, setConditions] = useState([])
  const [countr, setCountr] = useState([])
  const [lang, setlang] = useState([])
  const [userSign, setUserSign] = useState([])
  const[userRateDetails, setUserRateDetails] = useState([])
  const [device, setDevice] = useState(['tablet', 'mobile', 'laptop'])
  var language_data=[];
  var country_data=[];
  
  const submitRatesEdit = () => {
    const data = [{
      user_rate_condition_op:userRateDetails?.UserRateCondition_op,
      description:userRateDetails?.Description,
      max_user_percentage:userRateDetails?.MaxUsersPercent,
      user_signed_in: userSign?.UserSignedIn,
      is_domestic: userSign?.IsDomestic,
      user_rate_condition_id: userSign?.UserRateCondition_id
  }];
  const final_data = { "user_rate_condition": data }
  const url = "/api/rate_rule/user_rate_conditioning";
    axios
      .put(url, final_data, { 
        header: { "content-type": "application/json" } })
      .then((response) => {
        toast.success("Rate rule Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
         
        Router.push("./raterule");
      })

      .catch((error) => {
        toast.error("Rate rule update Error2!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  
  };

  const submitLanguageEdit = () => { 
  const final_data = { "user_rate_language": finalLang }
  alert(JSON.stringify(final_data))
  const url = "/api/rate_rule/user_rate_conditioning/rate_condition_language_link";
    axios
      .put(url, final_data, { 
        header: { "content-type": "application/json" } })
      .then((response) => {
        toast.success("Languages Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        Router.push("./raterule");
      })

      .catch((error) => {
        toast.error("Languages Error", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  
  };
  // Country Edit Submit
   const submitCountryEdit = () => {
  const final_data = { "user_rate_country": finalCountry }
  alert(JSON.stringify(final_data))
  const url = "/api/rate_rule/user_rate_conditioning/rate_condition_user_country_link";
    axios
      .put(url, final_data, { 
        header: { "content-type": "application/json" } })
      .then((response) => {
        toast.success("Country Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
        Router.push("./raterule");
      })

      .catch((error) => {
        toast.error("Country Error", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  
  };
  // Languages JSON for Dropdown
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
// Languages JSON for Dropdown
  const createLanguages = () => {
   languageCodes = langs.all();
    languageCodes.map(code => {
      var temp = {
        language_name: code.name,
        language_code: code?.[j]
      }
    language_data.push(temp) } );
    setLanguageData(language_data);
    
  } 

  const languages = (lan) => { 
    lan.map(item => {
      var temp = {
        user_rate_condition_id: userSign?.UserRateCondition_id,
        language: item?.language_code
      }
      language_data.push(temp) } );
      setFinalLang(language_data);
      
  }


  const country = (cou) => { 
    cou.map(item => {
      var temp = {
        user_rate_condition_id: userSign?.UserRateCondition_id,
       user_country: item?.country_code
      }
      country_data.push(temp) } );
      setFinalCountry(country_data);
      
  }

  
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
        currentraterule = localStorage.getItem('RateRuleId');
        /** Current Property Details fetched from the local storage **/
        currentProperty = JSON.parse(localStorage.getItem("property"));
        createCountry();
        createLanguages();
      }
    }
    firstfun();
    Router.push("./raterule")
  }, [])

  const fetchRateRule = async () => {
    const url = `/api/rate_rule/${currentraterule}`
    console.log("url" + url)
    axios.get(url)
      .then((response) => {
        setRateRule(response.data);
        setAllUserRateDetails(response.data.conditional_rate)
        setConditions(response.data.user_rate_condition?.[j])
        setUserSign(response.data.user_rate_condition?.[j])
        logger.info("url  to fetch raterules hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch raterules, failed") });
  }

  const fetchPrograms = async () => {
    const url = `/api/package_membership/${currentProperty?.property_id}`
    console.log("url" + url)
    axios.get(url)
      .then((response) => {
        setPrograms(response.data);
        logger.info("url  to fetch programs hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch programs, failed") });
  }

  /* Function to load Room Details when page loads*/
  useEffect(() => {
    fetchRateRule();
    fetchPrograms();
  }, [])

  const [pro, setPro] = useState([])
  const [coun, setCoun] = useState([])
    
  /** Function to add mile **/
  const program = (item) => {
    setPro(item)
 }
   
   
   
  
  /* Edit Rate Details Function */
  const submitRateEdit = () => {
    var time;
    var temp = `2022-01-01 ` + allUserRateDetails?.refundable_until_time;
    time = new Date(temp.toString())
    const toTimestamp = (strDate) => {
      const dt = Date.parse(strDate);
      return dt / 1000;
    }
    const final_data = {
      "conditional_rate_id": allUserRateDetails?.conditional_rate_id,
      "base_rate_currency": allUserRateDetails?.base_rate_currency,
      "base_rate_amount": allUserRateDetails.base_rate_amount,
      "tax_amount": allUserRateDetails.tax_amount,
      "tax_currency": allUserRateDetails.tax_currency,
      "otherfees_currency": allUserRateDetails.otherfees_currency,
      "otherfees_amount": allUserRateDetails.otherfees_amount,
      "refundable": allUserRateDetails.refundable,
      "refundable_until_days": allUserRateDetails.refundable_until_days,
      "refundable_until_time": allUserRateDetails?.refundable_until_time ? time.getTime() : allUserRateDetails?.refundable_until_time,
      "otherfees_amount": allUserRateDetails.otherfees_amount,
      "expiration_time": toTimestamp(allUserRateDetails.expiration_time),
      "charge_currency": allUserRateDetails.charge_currency,
    }
    const url = '/api/rate_rule/conditional_rate'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then

      ((response) => {
        toast.success("User Rate Condition Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchRateRule();
        Router.push("./raterule");

      })
      .catch((error) => {

        toast.error("User Rate Condition Error!", {
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
  const submitRateMod = () => {
    const final_data = {
      "rate_modification_id": rateRule?.rate_modification_id,
      "hotel_amenity": rateRule?.hotel_amenity,
      "price_multiplier": rateRule?.price_multiplier,

    }
    const url = '/api/rate_rule/rate_modification'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then

      ((response) => {

        toast.success("User Rate Modification Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        Router.push("./raterule");

      })
      .catch((error) => {

        toast.error("User Rate Modification Error!", {
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

  return (
    <>
      <Header Primary={english?.Side1} />
      <Sidebar Primary={english?.Side1} />
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
                  <Link href="../raterules" >
                    <a> Rate Rules</a>
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
                  Edit Rate Rule
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/** Rate Condition **/}
        <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Rate Condition</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Rate Modification and Discount</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rates</div>
            </div>

          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
            Rate Condition
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
                      Program Name
                    </label>
                    <input type="text"
                      className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={rateRule?.user_rate_condition?.[i]?.MembershipProgram} 
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          MembershipProgram: e.target.value,
                        })
                      }/>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">

                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Rate Condition 
                    </label>
                    <select
                      className="shadow-sm capitalize bg-gray-50 mb-1.5 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          UserRateCondition_op: e.target.value,
                        })
                      }
                    >

                      <option selected >{rateRule?.user_rate_condition?.[i]?.UserRateCondition_op}</option>
                      <option value="all">All</option>
                      <option value="any">Any</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Rate Description

                    </label>
                    <textarea rows="2" columns="50"
                      className="shadow-sm bg-gray-50 capitalize border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={rateRule?.user_rate_condition?.[i]?.Description}
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          Description: e.target.value,
                        })
                      }

                    />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <h4 className="text-medium flex leading-none  pt-2 font-semibold text-gray-900 mb-2">
                      Conditions {JSON.stringify(userSign)}
                    </h4></div></div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3"></div>
                </div>

                <div className="w-full lg:w-3/12 px-1">
                  <div className="relative w-full ">
                    <div className='flex '>
                      <span className="flex mb-8 mx-2">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      </span>
                      <label
                        className="text-sm font-medium text-gray-900 block "
                        htmlFor="grid-password"
                      >
                        User Country 
                      </label>

                    </div>
                    <div className='flex'>
                      <span className="flex mb-10 mx-2">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      </span>
                      <label
                        className="text-sm font-medium text-gray-900 block mb-6"
                        htmlFor="grid-password"
                      >
                        User Device
                      </label>

                    </div>
                    <div className='flex'>
                      <span className="flex mb-10 mx-2">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      </span>
                      <label
                        className="text-sm font-medium text-gray-900 block mb-8"
                        htmlFor="grid-password"
                      >
                        Language
                      </label></div>
                    <div className='flex'>
                      <span className="flex mb-10 mx-2">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      </span>
                      <label
                        className="text-sm font-medium text-gray-900 block mb-8"
                        htmlFor="grid-password"
                      >
                        Membership Program
                      </label></div>
                    <div className='flex'>
                      <span className="flex mb-10 mx-2">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      </span>
                      <label
                        className="text-sm font-medium text-gray-900 block mb-8"
                        htmlFor="grid-password"
                      >
                        Maximum User Percentage
                      </label></div>
                    <div className='flex'>
                      <span className="flex mb-10 mx-2">
                        <input id="checkbox-1"
                          aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      </span>
                      <label
                        className="text-sm font-medium text-gray-900 block mb-8"
                        htmlFor="grid-password"
                      >
                        User Signed In
                      </label></div>
                    <div className='flex'>
                      <span className="flex mb-10 mx-2">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      </span>
                      <label
                        className="text-sm font-medium text-gray-900 block mb-8"
                        htmlFor="grid-password"
                      >
                        Is Domestic
                      </label></div>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 ">
                  <div className="relative w-full mr-8 -mt-2">

                    <Multiselect
                      className="shadow-sm bg-gray-50  mb-5 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={countryData}
                      displayValue="country_name"
                      onRemove={(event) => {country(event)}}
                      onSelect={(event) => {country(event) }} />
                    <Multiselect
                      className="shadow-sm bg-gray-50 my-5  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={false}
                      options={device}
                      onRemove={(event) => { event }}
                      onSelect={(event) => { event }} />
                    <Multiselect
                      className="shadow-sm bg-gray-50  my-5 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={languageData}
                      displayValue="language_name"
                      onRemove={(event) => { languages(event) }}
                      onSelect={(event) => { languages(event) }} />
                    <Multiselect
                      className="shadow-sm bg-gray-50  my-5 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={programs}
                      displayValue="program_name"
                      onRemove={(event) => {program(event)}}
                      onSelect= {(event)=>{program(event)}} />
                    <input type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={conditions?.MaxUsersPercent} 
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          MaxUsersPercent: e.target.value,
                        })
                      }/>
                    <div className="flex">
                      <div className="form-check mx-2 my-4 form-check-inline">

                        <label htmlFor={`default-toggle`} className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" value={userSign?.UserSignedIn} checked={ userSign?.UserSignedIn === true}
                            onChange={(e) =>
                              setUserSign({ ...userSign, UserSignedIn: userSign?.UserSignedIn === true ? false : true })
                            }
                            id={`default-toggle`} className="sr-only peer" />
                          <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                 peer-checked:after:translate-x-full 
                 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="form-check mx-2 my-4 form-check-inline">

                        <label htmlFor="default" className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" value={userSign?.IsDomestic} checked={ userSign?.IsDomestic === true}
                            onChange={(e) =>
                              setUserSign({ ...userSign, IsDomestic: userSign?.IsDomestic === true ? false : true })
                            }
                            id="default" className="sr-only peer" />
                          <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                 peer-checked:after:translate-x-full 
                 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2  sm:space-x-3 ml-auto">
                  <div className="relative w-full ml-4 mb-4">
                    <button
                      className="sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center mt-60 
                     items-center  mr-1 mb-1 ease-linear transition-all duration-150"
                     onClick={()=>{submitRatesEdit(),submitLanguageEdit(),submitCountryEdit()}} type="button" >
                      {language?.update}</button>
                  </div>
                </div>
                <div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/** Discount (Rate Eligibility) **/}
        <div className="bg-white  shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8 mt-3 2xl:col-span-2">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">
                1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Rate Condition</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rate Modification and Discount</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rates</div>
            </div>


          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900  mb-4">
            Rate Modification and Discount
          </h6>
          <div className="flex flex-wrap">

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="text-sm font-medium text-gray-900 block "
                  htmlFor="grid-password"
                >
                  Discount Type
                </label>
                <select
                  className="shadow-sm bg-gray-50 border mb-1.5 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={(e) =>
                    setAllHotelDetails({
                      ...allHotelDetails,
                      address_city: e.target.value,
                    })
                  }
                >
                  <option value="srinagar">{rateRule?.ineligiblity_reason}</option>
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
                  Hotel Amenity(Free Wifi)
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  defaultValue={rateRule?.hotel_amenity}
                  onChange={(e) =>
                    setRateRule({
                      ...rateRule,
                      hotel_amenity: e.target.value,
                    })
                  }

                /></div></div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="text-sm font-medium text-gray-900 block"
                  htmlFor="grid-password"
                >
                  Price Multiplier
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border my-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  defaultValue={rateRule?.price_multiplier}
                  onChange={(e) =>
                    setRateRule({
                      ...rateRule,
                      price_multiplier: e.target.value,
                    })
                  }

                /></div></div>

            <div id="btn" className="flex items-center justify-end  -mb-16 sm:space-x-3 ml-auto">
              {Button !== 'undefined' ?
                <Button Primary={language?.Update} onClick={submitRateMod} />
                : <></>
              }
            </div>
          </div>
        </div>

        {/** Rate Modification **/}
        <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8 mt-3 2xl:col-span-2">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"> 1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Rate Condition</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rate Modification and Discount</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">

              <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Rates </div>
            </div>


          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
            Rates
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
                      {language?.baserate} {language?.currency}
                    </label>
                    <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, base_rate_currency: e.target.value })
                        )
                      }>
                      <option selected>{allUserRateDetails?.base_rate_currency}</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.baserate} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.base_rate_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, base_rate_amount: e.target.value })
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
                      {language?.taxrate} {language?.currency}
                    </label>
                    <select className="shadow-sm ca bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, tax_currency: e.target.value })
                        )
                      }>
                      <option selected >{allUserRateDetails?.tax_currency}</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.taxrate} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.tax_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, tax_amount: e.target.value })
                        )
                      } />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.other} {language?.capacity} {language?.currency}
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, otherfees_currency: e.target.value })
                        )
                      }>
                      <option value="USD" >{allUserRateDetails?.otherfees_currency}</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.other} {language?.charges} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.otherfees_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, otherfees_amount: e.target.value })
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
                      Payment Holder
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, charges_currency: e.target.value })
                        )
                      }>
                      <option selected >{allUserRateDetails.charge_currency}</option>
                      <option value="web">Web</option>
                      <option value="hotel">Hotel</option>
                      <option value="installment">Installment</option>
                      <option value="deposit">Deposit</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Refundable
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, refundable: e.target.value })
                        )
                      }>
                      {allUserRateDetails?.refundable === "true"
                        ?
                        <option selected value={true}>Yes</option>
                        : <option value={false}>No</option>}

                      <option value={true}>Yes</option>
                      <option selected value={false}>No</option>
                    </select>
                  </div>
                </div>

                {allUserRateDetails?.refundable === "true" ? (
                  <>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                          Refundable until days
                        </label>
                        <input
                          type="text"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          defaultValue={allUserRateDetails?.refundable_until_days}
                          onChange={
                            (e) => (
                              setAllUserRateDetails({ ...allUserRateDetails, refundable_until_days: e.target.value })
                            )
                          } />
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                          Refundable until time
                        </label>
                        <input
                          type="time" step="2"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          defaultValue={allUserRateDetails?.refundable_until_time}
                          onChange={
                            (e) => (
                              setAllUserRateDetails({ ...allUserRateDetails, refundable_until_time: e.target.value })
                            )
                          } />
                      </div>
                    </div></>)
                  :
                  (<></>)}

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Expiration Timezone
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.expiration_time}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, expiration_time: e.target.value })
                        )
                      } />

                  </div>
                </div>
              </div>
              <div id="btn" className="flex items-center justify-end mt-2 space-x-2 sm:space-x-3 ml-auto">
                {Button !== 'undefined' ?
                  <Button Primary={language?.Update} onClick={submitRateEdit} />
                  : <></>
                }
              </div>

            </div>
          </div>



        </div>

        {/** Rates **/}
        <div className="bg-white shadow rounded-lg mt-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Rate Condition</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Rate Modification and Discount(Rate Eligibility)</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rates</div>
            </div>

          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
            Rates
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
                      {language?.baserate} {language?.currency}
                    </label>
                    <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, base_rate_currency: e.target.value })
                        )
                      }>
                      <option selected>{allUserRateDetails?.base_rate_currency}</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.baserate} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.base_rate_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, base_rate_amount: e.target.value })
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
                      {language?.taxrate} {language?.currency}
                    </label>
                    <select className="shadow-sm ca bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, tax_currency: e.target.value })
                        )
                      }>
                      <option selected >{allUserRateDetails?.tax_currency}</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.taxrate} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.tax_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, tax_amount: e.target.value })
                        )
                      } />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.other} {language?.capacity} {language?.currency}
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, otherfees_currency: e.target.value })
                        )
                      }>
                      <option value="USD" >{allUserRateDetails?.otherfees_currency}</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.other} {language?.charges} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.otherfees_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, otherfees_amount: e.target.value })
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
                      Payment Holder
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, charges_currency: e.target.value })
                        )
                      }>
                      <option selected >{allUserRateDetails.charge_currency}</option>
                      <option value="web">Web</option>
                      <option value="hotel">Hotel</option>
                      <option value="installment">Installment</option>
                      <option value="deposit">Deposit</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Refundable
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, refundable: e.target.value })
                        )
                      }>
                      {allUserRateDetails?.refundable === "true"
                        ?
                        <option selected value={true}>Yes</option>
                        : <option value={false}>No</option>}

                      <option value={true}>Yes</option>
                      <option selected value={false}>No</option>
                    </select>
                  </div>
                </div>

                {allUserRateDetails?.refundable === "true" ? (
                  <>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                          Refundable until days
                        </label>
                        <input
                          type="text"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          defaultValue={allUserRateDetails?.refundable_until_days}
                          onChange={
                            (e) => (
                              setAllUserRateDetails({ ...allUserRateDetails, refundable_until_days: e.target.value })
                            )
                          } />
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                          Refundable until time
                        </label>
                        <input
                          type="time" step="2"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          defaultValue={allUserRateDetails?.refundable_until_time}
                          onChange={
                            (e) => (
                              setAllUserRateDetails({ ...allUserRateDetails, refundable_until_time: e.target.value })
                            )
                          } />
                      </div>
                    </div></>)
                  :
                  (<></>)}

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Expiration Timezone
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.expiration_time}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, expiration_time: e.target.value })
                        )
                      } />

                  </div>
                </div>
              </div>
              <div id="btn" className="flex items-center justify-end mt-2 space-x-2 sm:space-x-3 ml-auto">
                {Button !== 'undefined' ?
                  <Button Primary={language?.Update} onClick={submitRateEdit} />
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


      </div>
    </>
  )
}

export default Raterule
