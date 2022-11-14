import React, { useState, useEffect } from 'react';
import validateModificationsEdit from '../../../components/Validation/modificationedit';
import validateDates from '../../../components/Validation/Promotions/addpromotiondates';
import DatesTable from '../../../components/datestables';
import DarkModeLogic from "../../../components/darkmodelogic";
import Lineloader from '../../../components/loaders/lineloader';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import Multiselect from 'multiselect-react-dropdown';
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
var language;
var currentProperty;
var currentLogged;
var days_of_week =[];
var keys =[];
var currentPackage;
var i=0;
var currentModification;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validateModifications from '../../../components/Validation/modification';
const logger = require("../../../services/logger");

function Modification() {
  const [visible, setVisible] = useState(0);
  const [modification, setModification] = useState([])
  const [mod, setMod] = useState([]);
  const [pkg, setPkg] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [view, setView] = useState(0);
  const [rateRuleName, setRateRuleName] = useState({});
  const [gen, setGen] = useState([])
  const [rateRules, setRateRules] = useState([])
  const [modificationId, setModificationId] = useState()
  const [disp, setDisp] = useState(0);
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})
  const [error, setError] = useState({})

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
      currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
     
      currentModification = localStorage.getItem('modificationId');
      setVisible(1);
 }
  }
  firstfun();
  Router.push("./modification");
}, [])

useEffect(()=>{ 
  setColor(DarkModeLogic(darkModeSwitcher))
 },[darkModeSwitcher])

 useEffect(() => {
  const fetchPackages = async () => {
    try {
        const url = `/api/package/${currentProperty?.property_id}`
        const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
       setAllPackages(response.data) 
    }
    catch (error) {
        if (error.response) {
           } 
        else {
           }
    }

}
const fetchRateRules = async () => {
  try {
    var genData=[];
      const url = `/api/rate_rule/${currentProperty.property_id}`
      const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
     setRateRules(response.data)
     fetchModification(response.data)
  }
  catch (error) {

      if (error.response) {
          } 
      else {
      }
  }
}
fetchPackages();
fetchRateRules();
},[])

// Modification fetch details
const fetchModification = async (props) => {
  try {
      const url = `/api//ari/property_rate_modifications/${currentProperty?.property_id}/${currentModification}`
      const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
      setModification(response.data) 
     props.map(i => { if (i.rate_rule_id === response.data.rate_rule_id) { setRateRuleName(i) } }); 

  }
  catch (error) {
      if (error.response) {
         } 
      else {
         }
  }

}

useEffect(()=>{     
fetchModification();
},[])
 /** For Miles**/
 const checkInTemplate = {
  "modification_id":modificationId,
  "unit_of_time": "",
  "time":"" ,
  "min_max_msg": "" ,
  "pattern": "",
  "fixed_pattern":""
}  

/* Mapping Index of each mile*/
  const [checkInData, setCheckInData] = useState([checkInTemplate]?.map((i, id) => { return { ...i, index: id } }))

const addLOS = () => {
  setCheckInData([...checkInData, checkInTemplate]?.map((i, id) => { return { ...i, index: id } }))
}

/** Function to add mile **/
const addCheckIn = () => {
setCheckInData([...checkInData, checkInTemplate]?.map((i, id) => { return { ...i, index: id } }))
}
 // Modification
 const submitModificationsEdit = () => {
  var k =new Date()
  var day=k.getDate();
  var month=k.getMonth()+1  
  k.getFullYear()
  var year=k.getFullYear()
  var hr=k.getHours()
  var min=k.getMinutes()
  var sec=k.getSeconds()
 var msec=k.getMilliseconds()
  var currentDateTime=`${year}-${month}-${day} ${hr}:${min}:${sec}.${msec}`;
  const final_data = 
 {"property_modification": [{
     "modification_id": currentModification,
     "modification_name":modification?.modification_name,
     "rate_rule_id":modification?.rate_rule_id,
     "timestamp": currentDateTime,
     "booking_window_min":modification?.booking_window_min,
     "booking_window_max":modification?.booking_window_max,
     "length_of_stay_min": modification?.length_of_stay_min,
     "length_of_stay_max": modification?.length_of_stay_max,
     "occupancy_min": modification?.occupancy_min,
     "occupancy_max":modification?.occupancy_max,
     "amount_before_discount":modification?.amount_before_discount,
     "availability":modification?.min_amount_before_discount
   }]
 }
 alert(JSON.stringify(final_data))
  const url = '/api/ari/property_rate_modifications'
   axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Modification success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
       setMod([])
       setDisp(1)
     })
     .catch((error) => {
       toast.error("Modification error", {
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

// Packages
const packages = () => { 
  var final_package_data=[]
  modification?.packages.map(item => {
    var temp = {
      modification_id: currentModification,
      package_id: item?.package_id
    }
    final_package_data.push(temp) } );
    submitPackages(final_package_data)
    
}

// Packages
const submitPackages = (props) => {
  const final_data =  {"property_rate_modification_packages": props }
  alert(JSON.stringify(final_data));
   const url = '/api/ari/property_rate_modifications/property_rate_modifications_packages'
   axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Packages success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
    setPkg([]);
    setDisp(1)
     })
     .catch((error) => {
       toast.error("Packages error", {
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


// Validation Modification
const validationModification = () => {
  var result = validateModificationsEdit(modification)
     console.log("Result" +JSON.stringify(result))
     if(result===true)
     {
      if(mod === 1){
      submitModificationsEdit();
      checkInGen();
      }
      if(pkg === 1){
       packages();
       checkInGen();
        }
     }
     else
     {
      setError(result)
     }
 }



   const checkInGen = () => {
    var genData = [];
    modification?.dates?.map((item) => {
      if(item?.type === "check_in"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.mod_date_id
      }
    
      genData.push(temp)}
  })
  setGen(genData);
  setDisp(1);
  }
  const checkOutGen = () => {
    var genData = [];
    modification?.dates?.map((item) => {
      if(item?.type === "check_out"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.mod_date_id
      }
    
      genData.push(temp)}
  })
  setGen(genData);
  setDisp(2);
  }

  const BookingGen = () => {
    var genData = [];
    modification?.dates?.map((item) => {
      if(item?.type === "booking"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.mod_date_id
      }
      genData.push(temp)}
  })
  setGen(genData);
  setDisp(3);
  }


 const days = (days) => { 
  var days_present=['-','-','-','-','-','-','-'];
  days.map(day=>{
  
  if(day.day==='mon')
  {
  days_present[0]='M'
  }
  else if(day.day==='tue')
  {
  days_present[1]='T'
  }
  else if(day.day==='weds')
  {
  days_present[2]='W'
  }
  else if(day.day==='thur')
  {
  days_present[3]='T'
  }
  else if(day.day==='fri')
  {
  days_present[4]='F'
  }
  else if(day.day==='sat')
  {
  days_present[5]='S'
  }
  else if(day.day==='sun')
  {
  days_present[6]='U'
  }
  })
   days_of_week = days_present.toString().replaceAll(',','');
   
}

const validationAddmodificationDates = () => {
  var result = validateDates(modification,days_of_week)
     console.log("Result" +JSON.stringify(result))
     if(result===true)
     {
      if(disp === 1){
        submitDates("check_in")}
        if(disp === 2){
          submitDates("check_out")} 
          if(disp === 3){
            submitDates("booking")} 
     }
     else
     {
      setError(result)
     }
}

const submitDates= (check_in) => {
  const data =
   [{"modification_id":currentModification,
     "start_date": modification?.start_date,
     "end_date": modification?.end_date,
     "days_of_week": days_of_week,
     "type": check_in
   }]
 const final_data = { "property_modifications_rates": data }

 const url = '/api/ari/property_rate_modifications/property_rate_modifications_dates'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Dates success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
     days_of_week=[];
    setView(0);
    if(disp === 1){
      checkInGen();
    }
    if(disp === 1){
      checkOutGen();
    }
    if(disp === 3){
      BookingGen();
    }
     })
     .catch((error) => {
       toast.error("Dates error", {
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

//Submit Date Delete
const submitmodificationDelete = (props) => {
 alert(JSON.stringify(gen))
  alert(props)
  const url = `/api/ari/property_rate_modifications/property_rate_modifications_dates/${props}`;
   axios
     .delete(url)
     .then((response) => {
       toast.success("API:Date Deleted Successfully!", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
       fetchModification();
       if(disp === 1){
        checkInGen();
        setDisp(1);
        Router.push('./modification')
       }
       if(disp === 2){
        checkOutGen();
       }
       if(disp === 3){
        BookingGen();
       }
     })
     .catch((error) => {
       toast.error("API:Date Delete Error!", {
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
  return (
    <>
     <Header color={color} Primary={english.Side1} />
    <Sidebar color={color} Primary={english.Side1} />

    <div id="main-content"
          className={`${color?.greybackground} px-4 pt-24 relative overflow-y-auto lg:ml-64`}>
        
         {/* Navbar */}
         <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
              <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "../landing"} 
                className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                </Link></div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../propertysummary" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
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
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../modifications" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a> {language?.ratemodifications}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.ratemodification}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>

          {/* modification */}
          <div id='0' className={disp===0?'block':'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[62%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`} >{language?.modification}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color?.widget} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkin}</div>
            </div>
          
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.booking}</div>
            </div>
           
        </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
        {language?.modification} 
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
                       {language?.modification} {language?.name}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          defaultValue={modification?.modification_name}
                          onChange={
                            (e) => (
                              setModification({ ...modification, modification_name: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.modification_name}</p></div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.raterule}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                        className={`shadow-sm ${color?.greybackground} border capitalize border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                      onChange={(e) =>
                          setModification({
                            ...modification,
                           rate_rule_id: e.target.value,
                          },setMod(1))
                        }
                      >
                         <option selected disabled>{rateRuleName?.rate_rule_name}</option>
                    {rateRules?.map((i) => {
                      return (
                        <option key={i} value={i.rate_rule_id}>
                          {i.rate_rule_name}
                        </option>
                      );
                    })}
                      </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.raterule}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.packages}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect 
                      className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      options={allPackages}
                      onRemove={(e)   =>
                        setModification({
                          ...modification,
                       packages: e,
                        })}
                      onSelect={(e)   =>
                        setModification({
                          ...modification,
                       packages: e,
                        },setPkg(1))}
                      selectedValues={modification?.packages}
                    displayValue="package_name"
                    
                      />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.packages}</p>
                      </div>
                    </div>
                  </div>
                
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.losmin}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text" 
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={modification?.length_of_stay_min}
                          onChange={
                            (e) => (
                             setModification({ ...modification,length_of_stay_min: e.target.value },setMod(1))
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.length_of_stay_min}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.losmax} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text" 
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={modification?.length_of_stay_max} 
                        onChange={
                            (e) => (
                             setModification({ ...modification, length_of_stay_max: e.target.value },setMod(1))
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.length_of_stay_max}</p>
                      </div>
                    </div>
                  </div>
                
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.bookingwindowmin} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={modification?.booking_window_min}  
                        onChange={
                            (e) => (
                             setModification({ ...modification, booking_window_min: e.target.value },setMod(1))
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.booking_window_min}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.bookingwindowmax} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={modification?.booking_window_max}
                        onChange={
                            (e) => (
                             setModification({ ...modification, booking_window_max: e.target.value },setMod(1))
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.booking_window_max}</p>
                      </div>
                    </div>
                  </div>
                 
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.minamountbeforediscount} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={modification?.amount_before_discount} 
                        onChange={
                            (e) => (
                             setModification({ ...modification, amount_before_discount: e.target.value },setMod(1))
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.min_amount_before_discount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.availability} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                   onClick={(e) => setModification({ ...modification, availability: e.target.value },setMod(1))}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                      <option selected disabled >{JSON.stringify(modification?.availability) === true ? "Yes" : "No" }</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                      
                    </select>
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.availability}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-24">
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-24">
                   </div>
                  </div>

                 <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                 <Button Primary={language?.Skip} onClick={()=>{
                     checkInGen()}}/> 
                    <Button Primary={language?.Update} onClick={()=>{ validationModification();
                     }}/> 
                </div>

                </div>
                  </div>
                  </div>
            </div>
            </div>

           {/* Check In  */}
           <div id='1' className={disp===1?'block':'hidden'}>
           <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.modification} {checkInData?.days_of_week}</div>
            </div>
          
              
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkin} </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.booking} {language?.date}</div>
            </div>
           
        </div>
          {/* Card CheckIn Table */}
          <DatesTable gen={gen} setGen={setGen} color={color}  common={language?.common} cols={language?.CheckInCols}
        name={language?.checkin} delete={submitmodificationDelete} add={()=> setView(1)}/> 
            <div className="flex items-center justify-end space-x-2 mr-4 mb-2 sm:space-x-3 ml-auto">
                  <Button Primary={language?.Next} onClick={()=>{setDisp(2);checkOutGen()}} /> 
                </div>
            </div>

            {/* Check Out */}
            <div id='2' className={disp===2?'block':'hidden'}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.modification}</div>
            </div>
          
             
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.checkin} </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>   {language?.booking} {language?.date}</div>
            </div>
           
        </div>

       {/* Card CheckOut Table */}
       <DatesTable gen={gen} setGen={setGen} color={color}  common={language?.common} cols={language?.CheckInCols}
         add={()=> setView(1)} delete={submitmodificationDelete} name={language?.checkout}/> 
            <div className="flex items-center justify-end space-x-2 mr-4 mb-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={()=>{setDisp(3);BookingGen()}} /> 
                </div>
            </div>
          
           {/* Booking */}
           <div id='3' className={disp===3?'block':'hidden'}>
           <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.modification}</div>
            </div>
          
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.checkin} </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.booking} {language?.date}</div>
            </div>
           
        </div>
       {/* Card Booking Table */}
       <DatesTable gen={gen} setGen={setGen} color={color}  common={language?.common} cols={language?.CheckInCols}
        name={language?.booking}  add={()=> setView(1)}/> 
            
            </div>

         {/* Modal Add */}
         <div className={view === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className={`bg-white rounded-lg shadow relative`}>
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">{language?.add} {language?.new} {" "}
                  {disp===1 ? language?.checkin : disp===2 ?  language?.checkout : language?.booking}</h3>
                  <button
                    type="button"
                    onClick={() =>{
                      setView(0);
                    } }
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                  <form id='addcontactform'>
                <div className="p-6 space-y-6" >
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.startdate} 
                      </label>
                      <input type="date"
                      onChange={
                        (e) => (
                         setModification({ ...modification, start_date: e.target.value })
                        )
                      }
                   className={`shadow-sm  ${color?.whitebackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5`}></input>
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.start_date}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm capitalize font-medium text-gray-900 block mb-2`}
                      >
                        {language?.enddate} 
                      </label>
                      <input type="date"
                       onChange={
                        (e) => (
                         setModification({ ...modification, end_date: e.target.value })
                        )
                      }
                      className={`shadow-sm ${color?.whitebackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5`}></input>
                   
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p> </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm capitalize font-medium text-gray-900 block mb-2`}
                      >
                        {language?.days} {days_of_week}
                      </label>
                      <Multiselect 
                      className={`fixed shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      
                      options={lang?.DaysData}
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                     displayValue="day"
                    
                      />
                       <p className="text-sm text-sm text-red-700 font-light">
                      {error?.days_of_week}</p>
                    </div>
                  </div>
                </div>
                </form>

                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                     
                      <Button Primary={language?.Add} onClick={()=>{validationAddmodificationDates()
                      }} />
                   
                       
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
   <div className={(disp === 0)  ? 'block' :'hidden'}>
          <Footer color={color}  Primary={english.Side}  />
          </div>
    </>
  )
}

export default Modification
Modification.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }