import React, { useState, useEffect } from 'react'
import DarkModeLogic from "../../../components/darkmodelogic";
import Lineloader from '../../../components/loaders/lineloader';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
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
var currentExtraGuest;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");

function AddExtraGuestCharge() {
  const [visible, setVisible] = useState(0);
  const [extraGuestCharges, setExtraGuestCharges] = useState([])
  const [packages, setPackages] = useState([])
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
      currentPackage = localStorage.getItem("packageId");
      setPackages( JSON.parse(localStorage.getItem("packages")));
      setVisible(1);
 }
  }
  firstfun();
  Router.push("./addextraguestcharge");
}, [])

  useEffect(()=>{ 
    setColor(DarkModeLogic(darkModeSwitcher))
   },[darkModeSwitcher])

   /** Function to cancel package mile **/
 const removeLOS = (index) => {
  const filteredLOS = LOSData.filter((i, id) => i.index !== index)
   setLOSData(filteredLOS)
  }   

  /** For Miles**/
  const LOSTemplate = {
    "max_age":"",
    "amount": "",
    "charge_type":"",
    "exclude_from_capacity":"" ,
    "count_as_base_occupant":"" ,
  }  

  /* Mapping Index of each mile*/
    const [LOSData, setLOSData] = useState([LOSTemplate]?.map((i, id) => { return { ...i, index: id } }))
  
 /** Function to add mile **/
 const addLOS = () => {
  setLOSData([...LOSData, LOSTemplate]?.map((i, id) => { return { ...i, index: id } }))
}
const onChange = (e, index, i) => {
  setLOSData(LOSData?.map((item, id) => {
    if (item.index === index) {
      item[i] = e.target.value
    }
    return item
  }))
}
const submitExtraGuestCharges = () => {
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
 {"property_extra_adult_guest": [{
     "property_id": currentProperty?.property_id,
     "adult_charges":extraGuestCharges?.adult_charges,
     "timestamp": currentDateTime,
     "status":"true"
   }]
 }
const url = '/api/ari/extra_guest_charges'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Adult Charges success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
       alert(response.data.extra_guest_id)
       submitExtraChargesLink(currentDateTime);
       submitPackagesLink(response.data.Extra_guest_id)
       extraGuestChild(response.data.Extra_guest_id)
 
     })
     .catch((error) => {
       toast.error("Adult Charges error", {
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

const submitExtraChargesLink = (currentDateTime) => {
  const final_data =  {"extra_guest_link": [{
     "property_id": currentProperty?.property_id,
     "action": "overlay",
     "timestamp": currentDateTime 
   }]
 }
 const url = '/api/ari/extra_guest_charges/extra_guest_link'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Extra Guest link success", {
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
       toast.error("Extra Guest  link error", {
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

const submitPackagesLink = (props) => {
  const final_data =  {"extra_guest_link": [{
     "extra_guest_id": props,
     "package_id":extraGuestCharges?.package_id 
   }]
 }
 const url = '/api/ari/extra_guest_charges/extra_guest_package_link'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Extra Guest  package link success", {
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
       toast.error("Extra Guest package link error", {
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

const extraGuestChild= (props) => {
  const data = LOSData?.map((i => {
    return {
    "extra_guest_id":props,
     "max_age": i?.max_age,
     "exclude_from_capacity":i?.end_date,
     "count_as_base_occupant":i?.count_as_base_occupant,
   }}))
 const final_data = { "extra_guest_child_link": data }
 const url = '/api/ari/extra_guest_charges/extra_guest_link'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Extra guest child link success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
    keys=[];
    
     })
     .catch((error) => {
       toast.error("Extra guest child link error", {
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
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../extraguestcharges" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{language?.ExtraGuestCols?.name}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.extraguestcharge}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
           
          <div className="mx-4">
                <div className="sm:flex">
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
            {language?.extraguestcharge}
            </h6>
            </div>
            </div>
                  
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.adult}  {language?.charges} {JSON.stringify(extraGuestCharges)}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                         onChange={
                            (e) => (
                              setExtraGuestCharges({ ...extraGuestCharges, adult_charges: e.target.value })
                            )
                          }
                        />
                         <p className="text-sm text-sm text-red-700 font-light">
                      {error?.adultcharges}</p></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.package} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                    onClick={(e) =>
                      setExtraGuestCharges({ ...extraGuestCharges, package_id: e.target.value })
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
                      {error?.package}</p></div>
                    </div>
                  </div>
                  </div>
                  </div>
                  </div>


                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                  <Button Primary={language?.AddLOS}  onClick={addLOS} />
                  </div>
                  <div className="pt-2">
              <div className=" md:px-4 mx-auto w-full">
              {LOSData?.map((LOSData, index) => (
              <>
                <div className={LOSData?.index === 0 ? "hidden":"block"}>
                        <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                          <button className={`${color?.cross} sm:inline-flex  ${color?.crossbg}
                     font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold 
                     rounded-lg text-sm px-1 py-1 text-center 
                     items-center mb-1 ml-16 ease-linear transition-all duration-150`}
                     onClick={() => removeLOS(LOSData?.index)} type="button" >
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
                       {language?.child}  {language?.age}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => onChange(e, LOSData?.index, 'max_age')}
                        />
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.max_age}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                     Exclude from capacity
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text} uppercase border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={e => onChange(e, LOSData?.index, 'exclude_from_capacity')}>
                     <option selected>{language?.select}</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                   
                   </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.exclude_from_capacity}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                      Charge Type
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text} uppercase border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={(e) => {onChange(e, LOSData?.index, 'charge_type')
                     e.target.value !== 'flat' ? keys.push(index): ""}}>
                     <option selected>{language?.select}</option>
                    <option value="flat">Flat</option>
                    <option value="discount">Discount</option>
                    <option value="percentage">Percentage</option>
                   
                   </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.charge_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                      Charges
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text" 
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => onChange(e, LOSData?.index, 'amount')}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.amount}</p>
                      </div>
                    </div>
                  </div>
                  { keys.includes(index)?
                 
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                     Count Base Component {JSON.stringify(LOSData)}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text} uppercase border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={e => onChange(e, LOSData?.index, 'count_as_base_component')}>
                     <option selected>{language?.select}</option>
                    <option value="never">Never</option>
                    <option value="preferred">Preferred</option>
                    <option value="always">Always</option>
                   
                   </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.count_as_base_component}</p>
                      </div>
                    </div>
                  </div>:<></>}
                  </div>
</>))} 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit} onClick={submitExtraGuestCharges} /> 
                
                  
                    </div>
                  </div>
                  </div>
            </div>
          </div>
    <Footer color={color} />
    </>
  )
}

export default AddExtraGuestCharge
AddExtraGuestCharge.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }