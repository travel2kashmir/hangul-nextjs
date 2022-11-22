import React, { useState, useEffect } from 'react'
import DarkModeLogic from "../../../components/darkmodelogic";
import Lineloader from '../../../components/loaders/lineloader';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import Multiselect from 'multiselect-react-dropdown';
import validateAvailability from '../../../components/Validation/availability/availability';
import validateRestriction from '../../../components/Validation/availability/restriction';
import validateLOS from '../../../components/Validation/availability/los';
import lang from '../../../components/GlobalData'
import axios from 'axios';
import Link from "next/link";
import Router from 'next/router'
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Button from "../../../components/Button";
import Footer from '../../../components/Footer';
import Headloader from '../../../components/loaders/headloader';
import Textboxloader from '../../../components/loaders/textboxloader';
var language;
var currentProperty;
var currentLogged;
var days_of_week='mtwtfsu';
var keys =[];
var currentPackage;
var availabilityId;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");

function AddAvailability() {
  const [visible, setVisible] = useState(0);
  const [availability, setAvailability] = useState([])
  const [disp, setDisp] = useState(0);
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})
  const [error, setError] = useState({})
  const [packages,setPackages]=useState([])
/** Fetching language from the local storage **/
useEffect(() => {
  const firstfun = () => {
    if (typeof window !== 'undefined') {
      var locale = localStorage.getItem("Language");
      const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
      const color = JSON.parse(localStorage.getItem("Color"));
       setColor(color);
       setDarkModeSwitcher(colorToggle)
      if (locale === "ar") {
        language = arabic;
      }
      if (locale === "en") {
        language = english;
      }
      if (locale === "fr") {
        language = french;

      }
      /** Current Property Details fetched from the local storage **/
      currentProperty = JSON.parse(localStorage.getItem("property"));
      currentPackage = localStorage.getItem('PackageId');
      currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      fetchAvailability();
      setVisible(1);
 }
  }
  firstfun();
  Router.push("./addavailability");
}, [])

const fetchAvailability = async () => {
  try {
      var genData = [];
      const url = `/api/ari/property_availability/${currentProperty.property_id}`
      const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
      fetchPackages(response?.data);
  }  
  catch (error) {

      if (error.response) {
      }
      else {
      }
  }
}

const fetchPackages = (args) =>{
  const url = `/api/package/${currentProperty?.property_id}`;
  axios.get(url).then((response)=>{
    var result = response?.data.filter(el => {
      return !args?.find(element => {
         return el.package_id === element.package_id;
      });
   });
   setPackages(result)
  if(result.length===0){
    toast.warn("Inventory for all rooms registered ", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  } 
})
}
useEffect(()=>{ 
  setColor(DarkModeLogic(darkModeSwitcher))
 },[darkModeSwitcher])

// Availability
 const submitAvailability = () => {
  const final_data =  {"availability": {
    "property_id":currentProperty?.property_id,
     "package_id": availability?.package_id,
     "start_date": availability?.start_date ,
     "end_date": availability?.start_date ,
     "days_of_week": days_of_week.toString().replaceAll(',',''),
     "status": true
   }
 }
 const url = '/api/ari/property_availability/property_availability'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
      availabilityId=response?.data?.availability_id;
       toast.success("Availability success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
      setDisp(1);
     })
     .catch((error) => {
       toast.error("Availability error", {
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

// Restriction
const submitRestriction = () => {
  const final_data =  {"availability_res": [{
    "availability_id":availabilityId,
     "restriction_status":availability?.restriction_status ,
     "restriction_type": availability?.restriction_type ,
     "min_advance_booking": availability?.min_advance_booking ,
     "max_advance_booking": availability?.max_advance_booking 
   }]
 }
 const url = '/api/ari/property_availability/property_availability_restrictions'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Restriction success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
      setDisp(2);
     })
     .catch((error) => {
       toast.error("Restriction error", {
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

// Restriction
const submitLOS= () => {
  const data = LOSData?.map((i => {
    return {
    "availability_id":availabilityId,
     "unit_of_time": "Days",
     "time":i?.time ,
     "min_max_msg": i?.min_max_msg ,
     "pattern": i?.time,
     "fixed_pattern": i?.fixed_pattern 
   }}))
 const final_data = { "LOS": data }
 const url = '/api/ari/property_availability/property_availability_los'
 console.log(final_data)
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("LOS success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
     keys=[];
     Router.push('../availability')
     })
     .catch((error) => {
       toast.error("LOS error", {
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

// Days
const days = (days) => { 
  var days_present=['-','-','-','-','-','-','-'];
  days.map(day=>{
  
  if(day.day==='mon')
  {
  days_present[0]='m'
  }
  else if(day.day==='tue')
  {
  days_present[1]='t'
  }
  else if(day.day==='weds')
  {
  days_present[2]='w'
  }
  else if(day.day==='thur')
  {
  days_present[3]='t'
  }
  else if(day.day==='fri')
  {
  days_present[4]='f'
  }
  else if(day.day==='sat')
  {
  days_present[5]='s'
  }
  else if(day.day==='sun')
  {
  days_present[6]='s'
  }
  })
   days_of_week = days_present.toString().replaceAll(',','');
}
// Validate Availability
const validationAvailability = () => {
var result = validateAvailability(availability,days_of_week)
   console.log("Result" +JSON.stringify(result))
   if(result===true)
   {
    submitAvailability();
   }
   else
   {
    setError(result)
   }
  }
// Validate Restriction
  const validationRestriction = () => {
    var result = validateRestriction(availability)
       console.log("Result" +JSON.stringify(result))
       if(result===true)
       {
        submitRestriction();
       }
       else
       {
        setError(result)
       }
  } 
// Validation LOS
  const validationLOS = () => {
  var result = validateLOS(LOSData)
    console.log("Result" + JSON.stringify(result))
    if (result === true) {
      submitLOS();
    }
    else {
      setError(result)
    }
  } 
 /** Function to cancel package mile **/
 const removeLOS = (index) => {
  const filteredLOS = LOSData.filter((i, id) => i.index !== index)
   setLOSData(filteredLOS)
  }   

  /** For Miles**/
  const LOSTemplate = {
    "time":"",
    "min_max_msg":"",
    "pattern": "",
    "fixed_pattern": ""
  }  

  /* Mapping Index of each mile*/
    const [LOSData, setLOSData] = useState([LOSTemplate]?.map((i, id) => { return { ...i, index: id } }))
  
 /** Function to add mile **/
 const addLOS = () => {
  setLOSData([...LOSData, LOSTemplate]?.map((i, id) => { return { ...i, index: id } }))
}

const onChange = (e, index, i) => {
  console.log(index, 'index')
  setLOSData(LOSData?.map((item, id) => {
    if (item.index === index) {
      item[i] = e.target.value;
    }
    return item
  }))
}
  return (
    <>
    <Header color={color} Primary={english.Side1} />
    <Sidebar color={color} Primary={english.Side1} />
    <div id="main-content"
          className={`${color?.greybackground} px-4 pt-24 relative overflow-y-auto lg:ml-64` }>
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
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
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
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../availability" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a> {language?.availability}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.add} {language?.availability}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>
          {/* Availability */}
          <div id='0' className={disp===0?'block':'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[55%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`} >{language?.availability}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color?.widget} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.restriction}</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.lengthofstay}</div>
            </div>
          
        </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
            {language?.availability}
            </h6>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.days}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect 
                      className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      options={lang?.DaysData}
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                      selectedValues={lang?.DaysData}
                     displayValue="day"
                    
                      />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.days}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.startdate}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="date"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAvailability({ ...availability, start_date: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.start_date}</p></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.enddate}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="date"
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAvailability({ ...availability, end_date: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-24">


                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.packages}<span style={{ color: "#ff0000" }}>*</span>
                      </label>

                    <select
                    onClick={(e) =>
                      setAvailability({ ...availability, package_id: e.target.value })
                    }
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  >
                     <option selected>Select package</option>
                    {packages?.map((i) => {
                      return (
                        <option key={i} value={i.package_id}>
                          {i.package_name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-sm text-sm text-red-700 font-light">
                      {error?.package}</p>
                  </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-24">
                      
                    </div>
                  </div>
                  
                 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={validationAvailability} /> 
                </div>
                
                  </div>
                  </div>
                  </div>
            </div>
            </div>

           {/* Restriction */}
           <div id='1' className={disp===1?'block':'hidden'}>
            <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[55%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.availability}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.restriction}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.lengthofstay}</div>
            </div>
          
           
        </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
           {language?.restriction}
            </h6>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.restriction} {language?.Status}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                       onChange={
                      (e) => (
                          setAvailability({ ...availability, restriction_status: e.target.value })
                      )
                  }>
                     <option selected >Select </option>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                   </select>
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_status}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.restriction} {language?.type}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={
                      (e) => (
                          setAvailability({ ...availability, restriction_type: e.target.value })
                      )}>
                     <option selected >Select </option>
                    <option value="arrival" >Arrival- (It prevents itineraries with a check-in date during the Start and End date range).</option>
                    <option value="departure">Departure- (It prevents itineraries with a check-out date during the Start and End date range).</option>
                    <option value="master">Master- (It indicates whether the room rate is available for booking on the date).</option>
                    </select>
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.minadvbooking}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAvailability({ ...availability, min_advance_booking: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.min_advance_booking}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.maxadvbooking} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAvailability({ ...availability, max_advance_booking: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.max_advance_booking}</p>
                      </div>
                    </div>
                  </div>
                
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-4">
                      
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-4">
                      
                    </div>
                  </div>
                  
                 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={validationRestriction} /> 
                </div>
                
                  </div>
                  </div>
                  </div>
            </div>
            </div>

            {/* LOS */}
            <div id='2' className={disp===2?'block':'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[55%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.availability}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.restriction}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.lengthofstay}</div>
            </div>
          
           
        </div>
        <div className="mx-4">
                <div className="sm:flex">
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
            {language?.lengthofstay}
            </h6>
          
                  <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                    
                    <Button Primary={language?.AddLOS}  onClick={addLOS} />
                  </div>
                </div>
              </div>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
              {LOSData?.map((item, index) => (
              <>
                <div className={item?.index === 0 ? "hidden":"block"}>
                        <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                          <button className={`${color?.cross} sm:inline-flex  ${color?.crossbg}
                     font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold 
                     rounded-lg text-sm px-1 py-1 text-center 
                     items-center mb-1 ml-16 ease-linear transition-all duration-150`}
                     onClick={() => removeLOS(item?.index)} type="button" >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                  </div>
                  </div>
                  <div className="flex flex-wrap" key={index}>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                            htmlFor="grid-password"
                          >
                            {language?.minmaxmessage}<span style={{ color: "#ff0000" }}>*</span>
                          </label>
                          <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                          <div className={visible === 1 ? 'block' : 'hidden'}>
                            <select className={`shadow-sm ${color?.greybackground} ${color?.text} uppercase border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                              onChange={
                                (e) => {
                                  onChange(e, item?.index, 'min_max_msg');
                                e.target.value === 'FullPatternLOS' ? keys.push(index) : "";
                                }
                              }>
                              <option selected>Select </option>
                              <option value="SetMaxLOS">Max LOS</option>
                              <option value="SetMinLOS">Min LOS</option>
                              <option value="SetForwardMaxStay">Forward Max Stay</option>
                              <option value="SetForwardMinStay">Forward Min Stay</option>
                              <option value="FullPatternLOS">Full Pattern LOS</option>
                            </select>
                            <p className="text-sm text-sm text-red-700 font-light">
                              {error[index]?.min_max_msg}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label className={`text-sm font-medium ${color?.text} block mb-2`}
                            htmlFor="grid-password">
                            {language?.numberofdays}<span style={{ color: "#ff0000" }}>*</span>
                          </label>
                          <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                          <div className={visible === 1 ? 'block' : 'hidden'}>
                            <input
                              type="number" min={1}
                              placeholder="Enter number of days"
                              className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                              onChange={
                                (e) => {
                                  onChange(e, item?.index, 'time');
                                }
                              }
                            />
                            <p className="text-sm text-sm text-red-700 font-light">
                              {error[index]?.time}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        {LOSData[index]?.min_max_msg === "FullPatternLOS" ?
                          <div className="relative w-full mb-3">
                            <label className={`text-sm font-medium ${color?.text} block mb-2`}
                              htmlFor="grid-password">
                              {language?.pattern}<span style={{ color: "#ff0000" }}>*</span>
                            </label>
                            <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                            <div className={visible === 1 ? 'block' : 'hidden'}>
                              <input
                                type="text"
                                placeholder="Enter pattern"
                                className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                onChange={
                                  (e) => {
                                    onChange(e, item?.index, 'fixed_pattern');
                                  }
                                }
                              />
                              <p className="text-sm text-sm text-red-700 font-light">
                                {error[index]?.fixed_pattern}</p>
                              <span className='text-orange-500 text-xs'>
                                {language?.patterndes}</span>

                            </div>

                          </div> : <></>}
                      </div>
                    </div>
</>))} 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit} onClick={validationLOS} /> 
                
                  
                    </div>
                  </div>
                  </div>
             


            </div>
            </div>

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
     <Footer color={color} />
    </>
  )
}

export default AddAvailability
AddAvailability.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )


}