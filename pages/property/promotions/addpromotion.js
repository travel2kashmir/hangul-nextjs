import React, { useState, useEffect } from 'react'
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
import Textboxloader from '../../../components/loaders/textboxloader';
var language;
var currentProperty;
var currentLogged;
var days_of_week;
var keys =[];
var currentPackage;
var resCou = []
var i=0;
var currentPromotion;
var availabilityId;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");

function Addpromotion() {
  const [visible, setVisible] = useState(0);
  const [promotion, setPromotion] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const [country,setCountry]=useState([])
  const [device,setDevice]=useState([])
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
      currentPackage = localStorage.getItem('PackageId');
      currentPromotion = localStorage.getItem('promotionId');
      currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      setVisible(1);
 }
  }
  firstfun();
  Router.push("./addpromotion");
}, [])

useEffect(()=>{ 
  setColor(DarkModeLogic(darkModeSwitcher))
 },[darkModeSwitcher])

 // Promotion
 const submitPromotion = () => {
  const current = new Date();
  const currentDateTime= current.toISOString();
  const final_data =  {"property_promotion": [{
     "property_id": currentProperty?.property_id,
     "stacking_type":promotion?.stacking_type,
     "stay_dates_application": "all",
     "timestamp": currentDateTime 
   }]
 }
   const url = '/api/ari/promotions'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Promotion success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
      submitPromotionLink();
     })
     .catch((error) => {
       toast.error("Promotion error", {
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
//Promotion Link
const submitPromotionLink = () => {
  const current = new Date();
  const currentDateTime= current.toISOString();
  const final_data =  {"property_promotion_link": [{
     "property_id": currentProperty?.property_id,
     "promotion_message_id": "promo" +currentProperty?.property_id,
     "action": "delta",
     "timestamp": currentDateTime 
   }]
 }
   const url = '/api/ari/promotions/property_promotion_link'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Property promotion success", {
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
       toast.error("Property promotion error", {
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

//Devices
const devices = (dev) => { 
  setFinalDevice([]);
  final_device_data=[]
 dev.map(item => {
    var temp = {
      promotion_id: promotionId,
      user_device_type: item?.user_device
    }
    final_device_data.push(temp) } );
    alert(JSON.stringify(final_device_data))
    setFinalDevice(final_device_data);
    
}

/** Function to cancel package mile **/
const removecheckIn = (index) => {
  const filteredCheckIn = checkInData.filter((i, id) => i.index !== index)
   setCheckInData(filteredCheckIn)
  }
  
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
  fetchPackages();
 
filterByCountry();
  },[])

   /** For Miles**/
   const checkInTemplate = {
    "availability_id":availabilityId,
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

const filterByCountry = () => {
  if(  promotion?.countries != undefined) {
 resCou = lang?.CountryData.filter(el => {
   return promotion?.countries?.find(element => {
      return element.country_code === el.country_code;
   });
});
setCountry(resCou)
  }
  else{
  resCou= []
  }
Router.push('./addpromotion')
}

  return (
    <div>
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
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../promotions" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{language?.promotions}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.promotion}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>
          {/* Promotion */}
          <div id='0' className={disp===0?'block':'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`} >{language?.promotion}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color?.widget} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotionduration}</div>
            </div>
          
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>   Check In </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>Check Out</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> Booking Date</div>
            </div>
           
        </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
        {language?.promotion} 
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
                       {language?.promotion} {language?.name}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion, promotion_name: e.target.value })
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
                        {language?.stackingtype}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                        className={`shadow-sm ${color?.greybackground} border capitalize border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={(e) =>
                          setPromotion({
                            ...promotion,
                           stacking_type: e.target.value,
                          })
                        }
                      >
                        <option disabled selected>{language?.select}</option>
                        <option value="any">Any</option>
                        <option value="base">Base</option>
                        <option value="none">None</option>
                        <option value="second">Second</option>
                      </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.devices}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect 
                      className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      selectedValues={device}
                      options={lang?.DeviceData}
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                      
                     displayValue="user_device"
                    
                      />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p>
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
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                    displayValue="package_name"
                    
                      />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.country}  {language?.type}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={(e) =>
                          setPromotion({
                            ...promotion,
                            action: e.target.value,
                          })
                        }
                      >
                        <option disabled selected>{language?.select}</option>
                        <option value="true">Include</option>
                        <option value="false">Exclude</option>
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.country}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect 
                      className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      options={lang?.CountryData}
                      selectedValues={country}
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                      displayValue="country_name"
                    
                      />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.days}</p>
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
                    <Button Primary={language?.Next} onClick={()=>{setDisp(1)}}/> 
                </div>
                
                  </div>
                  </div>
                  </div>
            </div>
            </div>

           {/* Discount */}
           <div id='1' className={disp===1?'block':'hidden'}>
            <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion}</div>
            </div>
          
             <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>
                   {language?.promotion} {language?.discount}
                </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>   Check In </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>Check Out</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> Booking Date</div>
            </div>
           
           
        </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
           {language?.promotion} {language?.duration} 
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
                        {language?.discount} {language?.type}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                       onChange={
                      (e) => (
                         setPromotion({ ...promotion, restriction_status: e.target.value })
                      )
                  }>
                     <option selected disabled >{language?.select} </option>
                    <option value="discount_nights">Discount Percentage</option>
                    <option value="fixed_amount_per_night">Fixed Amount per night</option>
                    <option value="fixed_amount">Fixed Amount</option>
                   </select>
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_status}</p>
                       </div>
                    </div>
                  </div>
                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.discount} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion, promotion_name: e.target.value })
                            )
                          }
                        />
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_status}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.appliednights} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion, promotion_name: e.target.value })
                            )
                          }
                        />
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
                       Free Stay Nights
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion, promotion_name: e.target.value })
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       Free Discount Nights
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                         onChange={
                            (e) => (
                              setPromotion({ ...promotion, promotion_name: e.target.value })
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       Free Nights Discount Percentage
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion, promotion_name: e.target.value })
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                 
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       Free Night Selection
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={
                      (e) => (
                         setPromotion({ ...promotion, restriction_type: e.target.value })
                      )}>
                     <option selected disabled >{language?.select} </option>
                    <option value="cheapest" >Cheapest
                   </option>
                    <option value="last">Last
                    </option>
                  
                    </select>
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       Free Nights Repeat
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={
                      (e) => (
                         setPromotion({ ...promotion, restriction_type: e.target.value })
                      )}>
                     <option selected disabled >{language?.select} </option>
                    <option value="true" >Yes
                   </option>
                    <option value="false">No
                    </option>
                  
                    </select>
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.inventorycountmin} {language?.percentage}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, min_advance_booking: e.target.value })
                            )
                          }
                        />
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
                       {language?.inventorycountmax} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                         className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, min_advance_booking: e.target.value })
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
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
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                         onChange={
                            (e) => (
                             setPromotion({ ...promotion, min_advance_booking: e.target.value })
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
                        {language?.losmax} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, max_advance_booking: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.max_advance_booking}</p>
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
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={
                      (e) => (
                         setPromotion({ ...promotion, restriction_type: e.target.value })
                      )}>
                     <option selected readOnly >{language?.select} </option>
                    <option value="arrival" >Arrival</option>
                    <option value="departure">Departure
                   </option>
                    <option value="master">Master</option>
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
                        {language?.occupancymin}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                         className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, min_advance_booking: e.target.value })
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
                        {language?.occupancymax} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                         onChange={
                            (e) => (
                             setPromotion({ ...promotion, max_advance_booking: e.target.value })
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
                    <Button Primary={language?.Next} onClick={()=>{setDisp(2)}} /> 
                </div>
                
                  </div>
                  </div>
                  </div>
            </div>
            </div>

            {/* Check In */}
            <div id='2' className={disp===2?'block':'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion} {language?.duration}</div>
            </div>
           
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>   Check In </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>Check Out</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> Booking Date</div>
            </div>
           
        </div>
        <div className="mx-4">
                <div className="sm:flex">
               <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
                Check In
               </h6>
          
                  <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                    
                    <Button Primary={language?.AddLOS}  onClick={addCheckIn} />
                  </div>
                </div>
              </div>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
              {checkInData?.map((checkInData, index) => (
              <>
                <div className={checkInData?.index === 0 ? "hidden":"block"}>
                        <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                          <button className={`${color?.cross} sm:inline-flex  ${color?.crossbg}
                     font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold 
                     rounded-lg text-sm px-1 py-1 text-center 
                     items-center mb-1 ml-16 ease-linear transition-all duration-150`}
                     onClick={() => removecheckIn(checkInData?.index)} type="button" >
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
                      Check in Start Date
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="date" 
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion,time: e.target.value })
                            )
                          }
                        />
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.min_max_msg}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                       Check in End Date
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="date" 
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion,time: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                    Days Available
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion,checkin_daysofweek: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.time}</p>
                      </div>
                    </div>
                  </div>
                 
                  </div>
</>))} 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next}onClick={()=>{setDisp(3)}}  /> 
                
                  
                    </div>
                  </div>
                  </div>
             


            </div>
            </div>
          
           {/* Check Out*/}
           <div id='3' className={disp===3?'block':'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion} {language?.duration}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>   Check In </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>Check Out</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> Booking Date</div>
            </div>
           
        </div>
        <div className="mx-4">
                <div className="sm:flex">
               <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
               Check Out
         </h6>
          
                  <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                    
                    <Button Primary={language?.AddLOS}  onClick={addCheckIn} />
                  </div>
                </div>
              </div>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
              {checkInData?.map((checkInData, index) => (
              <>
                <div className={checkInData?.index === 0 ? "hidden":"block"}>
                        <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                          <button className={`${color?.cross} sm:inline-flex  ${color?.crossbg}
                     font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold 
                     rounded-lg text-sm px-1 py-1 text-center 
                     items-center mb-1 ml-16 ease-linear transition-all duration-150`}
                     onClick={() => removecheckIn(checkInData?.index)} type="button" >
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
                      Check out Start Date
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="date" 
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion,time: e.target.value })
                            )
                          }
                        />
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.min_max_msg}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                     Check out End Date
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="date" 
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion,time: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                    Days Available
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion,checkin_daysofweek: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.time}</p>
                      </div>
                    </div>
                  </div>
                 
                  </div>
</>))} 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={()=>{setDisp(4)}} /> 
                
                  
                    </div>
                  </div>
                  </div>
             


            </div>
            </div>
            {/* Booking Date*/}
            <div id='4' className={disp===4?'block':'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion}</div>
            </div>
           <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion} {language?.duration}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>   Check In </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>Check Out</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">5</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> Booking Date</div>
            </div>
           
        </div>
        <div className="mx-4">
                <div className="sm:flex">
               <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
               Booking Date
         </h6>
          
                  <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                    
                    <Button Primary={language?.AddLOS}  onClick={addCheckIn} />
                  </div>
                </div>
              </div>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
              {checkInData?.map((checkInData, index) => (
              <>
                <div className={checkInData?.index === 0 ? "hidden":"block"}>
                        <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                          <button className={`${color?.cross} sm:inline-flex  ${color?.crossbg}
                     font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold 
                     rounded-lg text-sm px-1 py-1 text-center 
                     items-center mb-1 ml-16 ease-linear transition-all duration-150`}
                     onClick={() => removecheckIn(checkInData?.index)} type="button" >
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
                      Booking Start Date
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="date" 
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion,time: e.target.value })
                            )
                          }
                        />
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.min_max_msg}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                       Booking End Date
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="date" 
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion,time: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                    Days Available
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion,checkin_daysofweek: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.time}</p>
                      </div>
                    </div>
                  </div>
                 
                  </div>
</>))} 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit}  /> 
                
                  
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
    </div>
  )
}

export default Addpromotion