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
var languageCodes;
const logger = require("../../../services/logger");
var currentraterule;
var language;
var currentProperty;
var language_data=[];
var final_language_data=[];
var country_data=[];
var final_country_data=[];
var final_device_data=[];
var final_program_data=[];

function Addraterule() {
    const [allUserRateDetails, setAllUserRateDetails] = useState([])
    const [rateRuleId, setRateRuleId] = useState([])
    const [rateModificationId, setRateModificationId] = useState([])
    const [rateIneligiblityId, setRateIneligiblityId] = useState([])
    const [userRateConditionId, setUserRateConditionId] = useState([])
    const [conditionalRateId, setConditionalRateId] = useState([])
    const [device, setDevice] = useState([{user_device:'tablet'}, {user_device:'mobile'},{user_device:'laptop'} ])
    const [countryCheck, setCountryCheck] = useState(false);
    const [languageCheck, setLanguageCheck] = useState(false);
    const [deviceCheck, setDeviceCheck] = useState(false);
    const [basicFlag,setBasicFlag]=useState([])
    const [disp,setDisp]=useState(0)
    const [programCheck, setProgramCheck] = useState(false);
    const [finalLang,setFinalLang]=useState([])
    const [finalCountry,setFinalCountry]=useState([])
    const [finalDevice,setFinalDevice]=useState([])
    const [finalProgram,setFinalProgram]=useState([])
    const [percentageCheck, setPercentageCheck] = useState(false);
    const [userSignedIn, setUserSignedIn] = useState(false);
    const [isDomestic, setIsDomestic] = useState(false);
    const [signedCheck, setSignedCheck] = useState(false);
    const [domesticCheck, setDomesticCheck] = useState(false);
    const [countryData,setCountryData]=useState([])
    const [programs, setPrograms] = useState([])
    const [languageData,setLanguageData]=useState([])
    const [rooms,setRooms]=useState([])

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
         }
        }
        firstfun();
        Router.push("./addraterule")
        createCountry();
        createLanguages();
      }, [])

      useEffect(() => {
       fetchPrograms();
       fetchRooms();
    }, [])


    const fetchRooms = async () => {
      try {
        var genData=[];
          const url = `/api/rooms/${currentProperty.property_id}`
          const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
         setRooms(response.data)
      }
      catch (error) {
  
          if (error.response) {
              } 
          else {
          }
      }
  }
     // Rates Submit
      const submitRateAdd = () => {
        var time;
        var temp = `2022-01-01 ` + allUserRateDetails?.refundable_until_time;
        time = new Date(temp.toString())
        const toTimestamp = (strDate) => {
          const dt = Date.parse(strDate);
          return dt / 1000;
        }
        const final_data = {
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
          "rate_rule_id": rateRuleId,
          "status": true
        }
       
        const url = '/api/rate_rule/conditional_rate'
        axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
    
          ((response) => {
            toast.success("User Rate Condition added Successfully!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          
            const room_data ={
              "rate_rule":[{
              "conditional_rate_id": response.data.conditional_rate_id,
              "room_id": allUserRateDetails.room_id,
              
            }]}
          
            const url = '/api/rate_rule/conditional_rate/conditional_rate_room_link'
            axios.post(url,room_data, { header: { "content-type": "application/json" } }).then
        
              ((response) => {
                toast.success("User Rate Condition added Successfully!", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                
          })
          .catch((error) => {
    
            toast.error(" Conditional Rates Error!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });})
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
      
     //Rate Modification Submit
      const submitRateModAdd = () => {
       const final_data = {
          "hotel_amenity": "free_wifi",
          "price_multiplier": allUserRateDetails?.price_multiplier,
          "modification_name":allUserRateDetails?.program
     }
       
        const url = '/api/rate_rule/rate_modification'
        axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
    
          ((response) => {
    
            toast.success("User Rate Modification Added Successfully!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setRateModificationId(response.data.rate_modification_id);   
            
    
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
      
      //Rate rule Id generation
      const submitRateRule = () => {
        const final_data = {
          "rate_rule":[{
           "rate_ineligiblity_id": rateIneligiblityId,
           "rate_modification_id": rateModificationId,
           "property_id": currentProperty?.property_id,
           "status": true,
           "rate_rule_name": allUserRateDetails?.program
        }
        ] 
         }
         const url = '/api/rate_rule/rate_rule'
         axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
           toast.success("Rate Rule Successfully!", {
               position: "top-center",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
             });
            setRateRuleId(response.data.rate_rule_id);
     
           setDisp(2);
           })
           .catch((error) => {
     
             toast.error("Rate Rule Error!", {
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
      
       //Rate rule Id generation
       const submitRateRuleLink = () => {
        const final_data = {
          "rate_rule_link":[{
           "rate_rule_id": rateRuleId,
           "user_rate_condition_id": userRateConditionId
        }
        ] 
         }
        const url = '/api/rate_rule/rate_rule_rate_condition_link'
         axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     
           ((response) => {
     
             toast.success("Rate Rule Link Successfully!", {
               position: "top-center",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
             });
            setRateRuleId(response.data.rate_rule_id);
           
     
           })
           .catch((error) => {
     
             toast.error("Rate Rule Link Error!", {
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
       
      // Rate Discount Submit
      const submitDiscountAdd = () => {
        const final_data = {
          "ineligiblity_type": allUserRateDetails?.ineligibility_type,
           "ineligiblity_reason": allUserRateDetails?.program  
        }
      const url = "/api/rate_rule/rate_ineligiblity ";
          axios
            .post(url, final_data, { 
              header: { "content-type": "application/json" } })
            .then((response) => {
              toast.success("Rate Discount added successfully!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              setRateIneligiblityId(response.data.user_rate_ineligiblity_id);
              setDisp(1);
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
        
      //Rate Condition Submit
        const submitRateConditionAdd = () => {
          const final_data = {
          "user_rate_condition" :  [
              {
             "description": allUserRateDetails?.Description,
             "offer_name": allUserRateDetails?.program,
             "user_rate_condition_op" :allUserRateDetails?.UserRateCondition_op
          }
          ] 
          }
         const url = "/api/rate_rule/user_rate_condition";
            axios.post(url, final_data, { 
                header: { "content-type": "application/json" } })
              .then((response) => {
                toast.success("User Rate Condition added successfully!", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
             setUserRateConditionId(response.data?.user_rate_condition_id)
            
              }
              )
        
              .catch((error) => {
                toast.error("User Rate Condition Error", {
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

          //Language Submit
          const submitLanguageAdd = () => { 
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
                 final_language_data=[]
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
             const submitCountryAdd = () => {
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
                  final_country_data=[]
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
            const submitDeviceAdd = () => {
              const final_data = { "user_rate_device": finalDevice }
             const url = "/api/rate_rule/user_rate_conditioning/rate_condition_user_device_link";
                axios
                  .put(url, final_data, { 
                    header: { "content-type": "application/json" } })
                  .then((response) => {
                    toast.success("Devices Added Successfully!", {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    setDevice([])
                    final_device_data=[]
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
          
            // Program Edit Submit
            const submitProgramAdd = () => {
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
                  final_program_data= []
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
                  max_user_percentage:allUserRateDetails?.MaxUsersPercent,
                  user_signed_in: userSignedIn,
                  is_domestic: isDomestic,
                  user_rate_condition_id: userRateConditionId
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
          // Country JSON for Dropdown   
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
          // Programs JSON for Dropdown
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
          //Languages
          const languages = (lan) => { 
            lan.map(item => {
              var temp = {
                user_rate_condition_id: userRateConditionId,
                language: item?.language_code
              }
              final_language_data.push(temp) } );
              setFinalLang(final_language_data);
          }
        // Country
          const country = (cou) => { 
           cou.map(item => {
              var temp = {
                user_rate_condition_id:  userRateConditionId,
               user_country: item.country_code
              }
             final_country_data.push(temp) } );
              setFinalCountry(final_country_data);
              
          }
        //Devices
          const devices = (dev) => { 
           dev.map(item => {
              var temp = {
                user_rate_condition_id: userRateConditionId,
                user_device_type: item?.user_device
              }
              final_device_data.push(temp) } );
              setFinalDevice(final_device_data);
              
          }
         //Programs
          const program = (pro) => {   
            pro.map(item => {
               var temp = {
                 user_rate_condition_id: userRateConditionId,
                 always_eligible_membership_id: item.program_id
               }
               final_program_data.push(temp) } );
               setFinalProgram(final_program_data);  
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
                    <a>Rate Rules</a>
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
                  Add Rate Rules 
                </span>
              </div>
            </li>
          </ol>
        </nav>
        
         {/** Rate Rule Description  **/}
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
                      onChange={(e) =>
                        setAllUserRateDetails({
                          ...allUserRateDetails,
                          program: e.target.value,
                        })
                      }/>
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
                        setAllUserRateDetails({
                          ...allUserRateDetails,
                          UserRateCondition_op: e.target.value,
                        })
                      }
                    >

                      <option selected >Select</option>
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
                      required=""
                      onChange={(e) =>
                        setAllUserRateDetails({
                          ...allUserRateDetails,
                          Description: e.target.value,
                        })
                      }

                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="text-sm font-medium text-gray-900 block  mb-2 "
                  htmlFor="grid-password"
                >
                  Discount Type
                </label>
                <select
                  className="shadow-sm bg-gray-50 border mb-1.5 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={(e) =>
                    setAllUserRateDetails({
                      ...allUserRateDetails,
                      ineligibility_type: e.target.value,
                    })}
                >
                  <option selected >Select</option>
                  <option value="exact">exact- A discount percentage</option>
                  <option value="price_band">price band- A discount range</option>
                  <option value="existence">existence- A non-specific limit</option>
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
                defaultValue={"free_wifi"}

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
                 onChange={(e) =>
                    setAllUserRateDetails({
                      ...allUserRateDetails,
                      price_multiplier: e.target.value,
                    })
                  }

                /></div></div>
              

                <div className="flex items-center justify-end space-x-2  sm:space-x-3 ml-auto">
                  <div className="relative w-full ml-4 mb-4">
                  <Button Primary={language?.Next} onClick = {()=>{
                 submitRateModAdd();
                 submitRateConditionAdd();
                 submitDiscountAdd();
                }}/>  
                  </div>
                </div>
                <div>
                </div>
              </div>

            </div>

          </div>
        </div>
         </div>
 
          {/** Rate Rule Conditions  **/}
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
            Rate Rule Conditions
          </h6>
          <div className="flex flex-wrap">
           <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3"></div>
                </div>

                <div className="lg:w-10/12  px-1">
                  <div className="relative w-full ">

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex  ">
                      <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" 
                      onClick={() => {setCountryCheck(!countryCheck)}} checked={countryCheck === true}
                      className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
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
                     onRemove={(event) => {country(event)}}
                      onSelect={(event) => {country(event) }} /></div>
                    </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" 
                         onClick={() => {setDeviceCheck(!deviceCheck)}} checked={deviceCheck === true}
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
                     onRemove={(event) => { devices(event) }}
                      onSelect={(event) => { devices(event) }} /></div>
                    </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex ">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" 
                         onClick={() => {setLanguageCheck(!languageCheck)}} checked={languageCheck === true}
                        className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
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
                     displayValue="language_name"
                      onRemove={(event) => { languages(event) }}
                      onSelect={(event) => { languages(event) }} />
                      </div>
                      </div>


                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                         onClick={() => {setProgramCheck(!programCheck)}} checked={programCheck === true}
                        className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" 
                         className="sr-only">checkbox</label>
                     
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
                      onRemove={(event) => {program(event)}}
                      onSelect= {(event)=>{program(event)}} /></div>
                      </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                         onClick={() => {setPercentageCheck(!percentageCheck)}} checked={percentageCheck === true} className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
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
                     
                      onChange={(e) =>
                        setAllUserRateDetails({
                          ...allUserRateDetails,
                          MaxUsersPercent: e.target.value,
                        })
                      }/>
                      </div>
                        </div>

                    <div className='flex mb-2'>
                        <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1"
                          aria-describedby="checkbox-1" type="checkbox"
                          onClick={() => {setSignedCheck(!signedCheck)}} 
                          className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
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
                          <input type="checkbox" value={userSignedIn} 
                            onChange={(e) =>
                              setUserSignedIn( (!userSignedIn) ,setBasicFlag(1))
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
                        <input id="checkbox-1" aria-describedby="checkbox-1"
                         onClick={() => {setDomesticCheck(!domesticCheck)}}  type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
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
                          <input type="checkbox" value={isDomestic} 
                            onChange={(e) =>
                              setIsDomestic((!isDomestic),setBasicFlag(1))
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
                  if(basicFlag?.length != 0){
                  submitAdditional();}
                  submitRateRule();
                if(countryCheck === true){
                  submitCountryAdd();
                }
                if(deviceCheck === true){
                 submitDeviceAdd(); 
                }
                if(languageCheck === true){
                 submitLanguageAdd(); 
                }
                if(programCheck === true){
                 submitProgramAdd();
                }
               }
              } /> 
                : <></>
              }
            </div>
        </div>
         </div>

          {/** Rate Rule Rates  **/}
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
           Rate Rule Rates
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
                      <option selected>Select</option>
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
                      <option selected >Select</option>
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
                      <option value="USD" >Select</option>
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
                          setAllUserRateDetails({ ...allUserRateDetails, charge_currency: e.target.value })
                        )
                      }>
                      <option selected >Select</option>
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
                        <option selected>Select</option> 
                    
                        <option value={true}>Yes</option>
                         <option value={false}>No</option>
                    
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
                      type="datetime-local"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.expiration_time}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, expiration_time: e.target.value })
                        )
                      } />

                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password">
                       {language?.room}
                      </label>
                      <select
                        onClick={(e) => setAllUserRateDetails({ ...allUserRateDetails, room_id: e.target.value })}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                        <option selected >Select </option>
                        {rooms?.map(i => {
                          return (
                            <option key={i} value={i.room_id}>{i.room_name}</option>)
                        }
                        )}
                      </select>
                    </div>
                  </div>
              </div>
              <div id="btn" className="flex items-center justify-end mt-2 space-x-2 sm:space-x-3 ml-auto">
                {Button !== 'undefined' ?
                  <Button Primary={language?.Submit}  onClick={()=>{submitRateAdd(); submitRateRuleLink(); }}/>
                  : <></>
                }
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
   
        </div></>
  )
}

export default Addraterule