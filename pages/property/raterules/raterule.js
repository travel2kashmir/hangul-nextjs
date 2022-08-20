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
var res =[]
var resDev = []
var resCou = []
var resLang = []
const logger = require("../../../services/logger");

var currentraterule;
var language;
var currentProperty;

function Raterule() {

  const [countryData,setCountryData]=useState([])
  const [basicFlag,setBasicFlag]=useState([])
  const [languageData,setLanguageData]=useState([])
  const [finalLang,setFinalLang]=useState([])
  const [finalCountry,setFinalCountry]=useState([])
  const [finalDevice,setFinalDevice]=useState([])
  const [finalProgram,setFinalProgram]=useState([])
  const [rateRule, setRateRule] = useState([])
  const [discount, setDiscount] = useState([])
  const [programs, setPrograms] = useState([])
  const [allUserRateDetails, setAllUserRateDetails] = useState([])
  const [conditions, setConditions] = useState([])
  const [countr, setCountr] = useState([])
  const [lang, setLang] = useState([])
  const [userSign, setUserSign] = useState([])
  const [pro, setPro] = useState([])
  const [coun, setCoun] = useState([])
  const [mod, setMod] = useState([])
  const [disp, setDisp] = useState(0);
  const [checkDevice, setCheckDevice] = useState();
  const [checkLanguage, setCheckLanguage] = useState(false);
  const [checkCountry, setCheckCountry] = useState();
  const [checkProgram, setCheckProgram] = useState();
  const [checkPercentage, setCheckPercentage] = useState();
  const[userRateDetails, setUserRateDetails] = useState([])
  const [device, setDevice] = useState([{user_device:'tablet'}, {user_device:'mobile'},{user_device:'laptop'} ])
  var language_data=[];
  var country_data=[];
  var device_data=[];
  var program_data=[];
  
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
      
      }
    }
    firstfun();
    Router.push("./raterule")
  }, [])

   /* Function to load  when page loads*/
   useEffect(() => {
    fetchRateRule();
    fetchPrograms();
    createLanguages();
}, [])

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
        setBasicFlag([])
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
      "expiration_time":allUserRateDetails.expiration_time,
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
    if (lang.length != 0) {
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
        setMod([])
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
  }
 // Languages Edit Submit
  const submitLanguageEdit = () => { 
  const final_data = { "user_rate_language": finalLang }
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
       setFinalLang([]) 
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
        setFinalCountry([])
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
 // Device Edit Submit
  const submitDeviceEdit = () => {
    const final_data = { "user_rate_device": finalDevice }
    const url = "/api/rate_rule/user_rate_conditioning/rate_condition_user_device_link";
      axios
        .put(url, final_data, { 
          header: { "content-type": "application/json" } })
        .then((response) => {
          toast.success("Devices Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setDevice([])
          Router.push("./raterule");
        })
  
        .catch((error) => {
          toast.error("Devices Error", {
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

  // Device Edit Submit
  const submitProgramEdit = () => {
    const final_data = { "user_rate_program": finalProgram }
   const url = "/api/rate_rule/user_rate_conditioning/rate_condition_membership_link";
      axios
        .put(url, final_data, { 
          header: { "content-type": "application/json" } })
        .then((response) => {
          toast.success("Programs Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setFinalProgram([])
          Router.push("./raterule");
        })
  
        .catch((error) => {
          toast.error("Programs Error", {
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

    //User Signed In, Max percentage and Domestic Submit
    const submitAdditional = () => {
      const data = [{
        max_user_percentage:userRateDetails?.MaxUsersPercent,
        user_signed_in:userSign?.UserSignedIn,
        is_domestic: userSign?.IsDomestic,
        user_rate_condition_id:userSign?.UserRateCondition_id
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
          setBasicFlag([])
        
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
          setBasicFlag([])
        });
    
    };
    const submitDiscountEdit = () => {
      const final_data = {
        "user_rate_ineligiblity_id": rateRule?.user_rate_ineligiblity_id,
        "ineligiblity_type": discount?.ineligibility_type,
       
      }
      const url = "/api/rate_rule/rate_ineligiblity ";
        axios
          .put(url, final_data, { 
            header: { "content-type": "application/json" } })
          .then((response) => {
            toast.success("Rate Discount Updated Successfully!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setDiscount([])
            Router.push("./raterule");
          })
    
          .catch((error) => {
            toast.error("Rate Discount Error", {
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

  const devices = (dev) => { 
    dev.map(item => {
      var temp = {
        user_rate_condition_id: userSign?.UserRateCondition_id,
        user_device: item?.user_device
      }
      device_data.push(temp) } );
      setFinalDevice(device_data);
      
  }

  const program = (pro) => { 

   pro.map(item => {
       var temp = {
         user_rate_condition_id: userSign?.UserRateCondition_id,
         program_id: item.program_id
       }
       program_data.push(temp) } );
       setFinalProgram(program_data);  
   }

   const filterByDevices = () => {
   if(rateRule?.user_rate_condition?.[i]?.UserDeviceType != undefined) {
    setCheckDevice(true)
   resDev =  device?.filter(el => {
       return rateRule?.user_rate_condition?.[i]?.UserDeviceType.find(element => {
          return element.user_device === el.user_device;
       });
    });
  }
  else{
    resDev= []
  } 
    Router.push('./raterule')
   }

 const filterByProgram = () => {
  if(conditions?.MaxUsersPercent != undefined){
    setCheckPercentage(true)
  }
  if(rateRule?.user_rate_condition?.[i]?.PackageMembership != undefined) {
    
    setCheckProgram(true)
    res = programs.filter(el => {
     return rateRule?.user_rate_condition?.[i]?.PackageMembership.find(element => {
        return element.program_id === el.program_id;
     });
  });}
  else{
    res= []
  }
  filterByLanguage();
  Router.push('./raterule')
}

const filterByCountry = () => {
  if(rateRule?.user_rate_condition?.[i]?.UserCountry != undefined) {
  setCheckCountry(true)
  resCou = countryData.filter(el => {
   return rateRule?.user_rate_condition?.[i]?.UserCountry?.find(element => {
      return element.user_country === el.country_code;
   });
});
  }
  else{
  resCou= []
  }
Router.push('./raterule')
}

const filterByLanguage = () => {
  if(rateRule?.user_rate_condition?.[i]?.language != undefined) {
    setCheckLanguage(true)
  resLang = languageData.filter(el => {
    return rateRule?.user_rate_condition?.[i]?.language.find(element => {
      return element.LanguageCode === el.language_code;
   });
   
});
  }
  else{
    resLang= []
    }
Router.push('./raterule')
}


  const fetchRateRule = async () => {
    const url = `/api/rate_rule/${currentraterule}`
    console.log("url" + url)
    axios.get(url)
      .then((response) => {
       
        setRateRule(response.data);
        setAllUserRateDetails(response.data.conditional_rate)
        setConditions(response.data.user_rate_condition?.[i])
        setUserSign(response.data.user_rate_condition?.[i])
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

        {/** Discount (Rate Eligibility)  **/}
        <div id='0' className={disp===0?'block':'hidden'}>
        <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
        <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Rate Rule Description
             </div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Rate Rule Conditions</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rates</div>
            </div>

          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
         Rate Rule Description
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
                        },setBasicFlag(1))
                      }/>
                  </div>
                </div>
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
                    setDiscount({
                      ...discount,
                      ineligibility_type: e.target.value,
                    },setBasicFlag(1))}
                >
                  <option selected >{rateRule?.ineligiblity_type}</option>
                  <option value="exact">exact</option>
                  <option value="price_band">price band</option>
                  <option value="existence">existence</option>
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
                
                /></div></div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="text-sm font-medium text-gray-900 block"
                  htmlFor="grid-password">
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
                    },setMod(1))
                  }

                /></div></div>
              

                <div className="flex items-center justify-end space-x-2  sm:space-x-3 ml-auto">
                  <div className="relative w-full ml-4 mb-4">
                    <button
                      className="sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center 
                     items-center  mr-1 mb-1 ease-linear transition-all duration-150"
                     onClick={()=>{
                     filterByCountry();
                     filterByProgram();
                     filterByDevices();
                      filterByLanguage();
                   
                     if (basicFlag.length !== 0){
                        submitRatesEdit()
                      } 
                      if (mod.length !== 0){ 
                      submitRateMod();
                      }
                      if (discount.length !== 0){
                        submitDiscountEdit()
                      }
                      setDisp(1);
                     
                     }} type="button" >
                      {language?.next}</button>
                  </div>
                </div>
                <div>
                </div>
              </div>

            </div>

          </div>
        </div>
         </div>

        {/**Rate Condition **/}
        <div id='1' className={disp===1?'block':'hidden'}>
        <div className="bg-white  shadow rounded-lg mx-1 px-1 sm:p-6 xl:p-8 mt-3 2xl:col-span-2">
        <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">
                1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto"> Rate Rule Description</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">  2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Rate Rule Conditions</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
           
             <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rates </div>
            </div>
       </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900  mb-4">
            Rate Condition
          </h6>
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Rate Rule Conditions
                    </label>
                    <select
                      className="shadow-sm capitalize bg-gray-50 mb-1.5 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          UserRateCondition_op: e.target.value,
                        },setBasicFlag(1))
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
                        },setBasicFlag(1))
                      }
                  />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <h4 className="text-medium flex leading-none  pt-2 font-semibold text-gray-900 mb-2">
                      Conditions 
                    </h4></div>
                    </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3"></div>
                </div>

                <div className="lg:w-10/12  px-1">
                  <div className="relative w-full ">

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex  ">
                      <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                      checked={checkCountry === true}
                      onChange={()=>{setCheckCountry(!checkCountry)}} className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                        User Country 
                      </label> </span></div>
                      <div className="w-full lg:w-4/12 ">
                      <Multiselect
                      className="shadow-sm bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={countryData}
                      displayValue="country_name"
                      selectedValues={resCou}
                      onRemove={(event) => {country(event)}}
                      onSelect={(event) => {country(event) }} /></div>
                    </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" 
                        checked={checkDevice === true} 
                        onChange={()=>{setCheckDevice(!checkDevice)}}
                        className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                     <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                        User Device
                      </label> </span></div>

                      <div className="w-full lg:w-4/12 ">
                      <Multiselect
                      className="shadow-sm bg-gray-50   text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={device}
                      displayValue="user_device"
                      selectedValues={resDev}
                      onRemove={(event) => { devices(event) }}
                      onSelect={(event) => { devices(event) }} /></div>
                    </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex ">
                        <input id="checkbox-1"  checked={checkLanguage === true} 
                        onChange={()=>{setCheckLanguage(!checkLanguage)}} aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                        Language
                      </label> </span></div>
                      <div className="w-full lg:w-4/12 ">
                      <Multiselect
                      className="shadow-sm bg-gray-50   text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={languageData}
                      selectedValues={resLang}
                      displayValue="language_name"
                      onRemove={(event) => { languages(event) }}
                      onSelect={(event) => { languages(event) }} />
                      </div>
                      </div>


                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" 
                            checked={checkProgram === true}
                            onChange={()=>{setCheckProgram(!checkProgram)}}className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                     
                      <label
                        className="text-sm font-medium text-gray-900 mx-2 block "
                        htmlFor="grid-password"
                      >
                        Membership Program
                      </label> </span></div>
                      <div className="w-full lg:w-4/12 ">
                      <Multiselect
                      className="shadow-sm bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={programs}
                      displayValue="program_name"
                      selectedValues={res}
                      onRemove={(event) => {program(event)}}
                      onSelect= {(event)=>{program(event)}} /></div>
                      </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                         checked={checkPercentage === true}
                         onChange={()=>{setCheckPercentage(!checkPercentage)}}
                         className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                     
                      <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                       Maximum User Percentage 
                      </label> </span></div>

                      <div className="w-full lg:w-4/12 ">
                      <input type="text" 
                      className="shadow-sm bg-gray-50 border  border-gray-300 text-gray-900  rounded-lg 
                      focus:ring-cyan-600 focus:border-cyan-600 block w-full py-2 px-4 "
                      defaultValue={conditions?.MaxUsersPercent} 
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          MaxUsersPercent: e.target.value,
                        },setBasicFlag(1))
                      }/>
                      </div>
                        </div>

                    <div className='flex mb-2'>
                        <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" checked={ userSign?.UserSignedIn === true} onChange={()=>{setUserSign( { ...userSign, UserSignedIn: userSign?.UserSignedIn === true ? false : true})}}
                          aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                     
                      <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                        User Signed In
                      </label> </span></div>
                      <div className="w-full lg:w-4/12 ">
                     
                      <div className="form-check mx-2 my-4 form-check-inline">

                        <label htmlFor={`default-toggle`} className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" value={userSign?.UserSignedIn} checked={ userSign?.UserSignedIn === true}
                            onChange={(e) =>
                              setUserSign({ ...userSign, UserSignedIn: userSign?.UserSignedIn === true ? false : true },setBasicFlag(1))
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
                      </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex ">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"  
                        checked={ userSign?.IsDomestic === true}
                          onChange={()=>{setUserSign( { ...userSign, UserSignedIn: userSign?.IsDomestic === true ? false : true})}}
                          className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      
                      <label
                        className="text-sm mx-2 font-medium text-gray-900 block"
                        htmlFor="grid-password"
                      >
                        Is Domestic
                      </label>
                      </span>
                      
                      </div>
                      <div className="w-full lg:w-4/12 ">
                      <div className="flex">
                      <div className="form-check mx-2  form-check-inline">

                        <label htmlFor="default" className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" value={userSign?.IsDomestic} checked={ userSign?.IsDomestic === true}
                            onChange={(e) =>
                              setUserSign({ ...userSign, IsDomestic: userSign?.IsDomestic === true ? false : true },setBasicFlag(1))
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
                    </div> </div>

                  </div>
       </div>
        
        </div>
     
        </div>
        <div id="btn" className="flex items-center  justify-end sm:space-x-3 my-4 ml-auto">
              {Button !== 'undefined' ?
                <Button Primary={language?.Next} onClick={()=>{ 
                  if (basicFlag.length !== 0){
                    submitAdditional();
                  }
                  if (finalLang.length !== 0){
                    submitLanguageEdit()
                  }
                  if (finalCountry.length !== 0){
                    submitCountryEdit()
                  }
                  if (finalDevice.length !== 0){
                    submitDeviceEdit()
                  }
                  if (finalProgram.length !== 0){
                    submitProgramEdit()
                  }
                  setDisp(2);
                }} /> 
                : <></>
              }
            </div>
        </div>
        </div>

        {/** Rates **/}
        <div id='2' className={disp===2?'block':'hidden'}>
        <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8 mt-3 2xl:col-span-2">
        <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
               <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary"> 1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Rate Rule Description</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rate Rule Conditions</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
             
            3</button>
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
        </div></div>

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
