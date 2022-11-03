import React, { useState, useEffect } from 'react'
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

function Promotion() {
  const [visible, setVisible] = useState(0);
  const [view, setView] = useState(0);
  const [gen, setGen] = useState([])
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
  Router.push("./promotion");
}, [])

useEffect(()=>{ 
  setColor(DarkModeLogic(darkModeSwitcher))
 },[darkModeSwitcher])

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
  const fetchPromotion = async () => {
    try {
        const url = `/api//ari/promotions/${currentProperty?.property_id}/${currentPromotion}`
        const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
        setPromotion(response.data) 
         setCountry(
            lang?.CountryData.filter(el => {
            return response?.data?.countries?.find(element => {
               return element.country_code === el.country_code;
            });
         }));
        setDevice( lang?.DeviceData?.filter(el => {
          return  response?.data?.devices?.find(element => {
             return element.device === el.user_device;
          });
       })); 
          
    }
    catch (error) {
        if (error.response) {
           } 
        else {
           }
    }

}
fetchPromotion();
filterByCountry();
  },[])

  const checkInGen = () => {
    var genData = [];
    promotion?.dates?.map((item) => {
      if(item?.type === "check_in"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.date_id
      }
    
      genData.push(temp)}
  })
  setGen(genData);
  }
  const checkOutGen = () => {
    var genData = [];
    promotion?.dates?.map((item) => {
      if(item?.type === "check_out"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.date_id
      }
    
      genData.push(temp)}
  })
  setGen(genData);
  }
  const BookingGen = () => {
    var genData = [];
    promotion?.dates?.map((item) => {
      if(item?.type === "booking"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.date_id
      }
    
      genData.push(temp)}
  })
  setGen(genData);
  }
  
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
Router.push('./promotion')
}

  return (
    <div>
       <Header color={color} Primary={english.Side1} />
    <Sidebar color={color} Primary={english.Side1} />
    <div id="main-content"
          
          className={(disp === 2 || disp === 3 || disp === 4)  ? `${color?.whitebackground}  pt-24 relative overflow-y-auto lg:ml-64` :
          ` ${color?.greybackground} pt-24 px-4 relative overflow-y-auto lg:ml-64` }
        >
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
                           defaultValue={promotion?.promotion_name}
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
                            action: e.target.value,
                          })
                        }
                      >
                        <option disabled selected>{promotion?.stacking_type}</option>
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
                      selectedValues={promotion?.packages}
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
                        <option disabled selected>{JSON.stringify(promotion?.countries?.[i]?.country_action) === "true"?
                        "Include" : "Exclude"}</option>
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
                     <option selected >{promotion?.discount?.[i]?.discount_type} </option>
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
                           defaultValue={promotion?.discount?.[i]?.discount}
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
                           defaultValue={promotion?.discount?.[i]?.applied_nights}
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
                           defaultValue={promotion?.free_nights?.[i]?.stay_nights}
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
                           defaultValue={promotion?.free_nights?.[i]?.discount_nights}
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
                           defaultValue={promotion?.free_nights?.[i]?.discount_percentage}
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
                     <option selected >{promotion?.free_nights?.[i]?.free_night_selection} </option>
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
                     <option selected >{promotion?.free_nights?.[i]?.repeat} </option>
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
                          defaultValue={promotion?.inventory_min}
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
                          defaultValue={promotion?.inventory_max}
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
                          defaultValue={promotion?.length_of_stay_min}
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
                        defaultValue={promotion?.length_of_stay_max}
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
                     <option selected readOnly >{promotion?.min_amount_before_discount} </option>
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
                          defaultValue={promotion?.occupancy_min}
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
                         defaultValue={promotion?.occupancy_max}
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
                    <Button Primary={language?.Next} onClick={()=>{setDisp(2);checkInGen()}} /> 
                </div>
                
                  </div>
                  </div>
                  </div>
            </div>
            </div>

            {/* Check In */}
            <div id='2' className={disp===2?'block':'hidden'}>
        
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
     
          {/* Card CheckIn Table */}
          <DatesTable gen={gen} setGen={setGen} color={color}  common={language?.common} cols={language?.CheckInCols}
        name="Check In" add={()=> setView(1)}/> 
            <div className="flex items-center justify-end space-x-2 mr-4 mb-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={()=>{setDisp(3);checkOutGen()}} /> 
                </div>
            </div>
           
          
           {/* Check Out*/}
           <div id='3' className={disp===3?'block':'hidden'}>
          
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
       {/* Card CheckOut Table */}
       <DatesTable gen={gen} setGen={setGen} color={color}  common={language?.common} cols={language?.CheckInCols}
         add={()=> setView(1)} name="Check Out"/> 
            <div className="flex items-center justify-end space-x-2 mr-4 mb-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={()=>{setDisp(4);BookingGen()}} /> 
                </div>
          </div>
            {/* Booking Date*/}
            <div id='4' className={disp===4?'block':'hidden'}>
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
       {/* Card Booking Table */}
       <DatesTable gen={gen} setGen={setGen} color={color}  common={language?.common} cols={language?.CheckInCols}
        name="Booking"  add={()=> setView(1)}/> 
            <div className="flex items-center justify-end space-x-2 mr-4 mb-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit} onClick={()=>{setDisp(4);BookingGen()}} /> 
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
           {/* Modal Add */}
        <div className={view === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className={`bg-white rounded-lg shadow relative`}>
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">{language?.add} {language?.new}
                  {disp===2 ? ' Check In' : disp===4 ? ' Check Out' : ' Booking'}</h3>
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
                      <input type="text"
                   className={`shadow-sm capitalize ${color?.whitebackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5`}></input>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.enddate} 
                      </label>
                      <input type="text"
                      className={`shadow-sm capitalize ${color?.whitebackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5`}></input>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm capitalize font-medium text-gray-900 block mb-2`}
                      >
                        {language?.days} 
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
                    </div>
                  </div>
                </div>
                </form>

                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                     
                      <Button Primary={language?.Add} />
                   
                       
                </div>
              </div>
            </div>
          </div>
        </div>

          </div>
          <div className={(disp === 0 || disp === 1)  ? 'block' :'hidden'}>
          <Footer color={color}  Primary={english.Side}  delete={submitPromotionDelete}/>
          </div>
    </div>
  )
}

export default Promotion
Promotion.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }