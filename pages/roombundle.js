import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "./Languages/en";
import french from "./Languages/fr";
import arabic from "./Languages/ar";
import Router from "next/router";
var t;
var currentProperty;
var  currentPackageDetails;
const logger = require("../services/logger");

function Roombundle() {
  const [allRooms, setAllRooms] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const[roomBundle,setRoomBundle] = useState([])
  const[bundle,setBundle] = useState([])
    useEffect(()=>{
        const firstfun=()=>{
          if (typeof window !== 'undefined'){
            var locale = localStorage.getItem("Language"); 
            if (locale === "ar") {
            t = arabic;
            }
            if (locale === "en") {
            t = english;
            }
            if (locale === "fr") {
              t=french;
            }
            /** Current Property Basic Details fetched from the local storage **/
            currentProperty=JSON.parse(localStorage.getItem('property'))  
            currentPackageDetails=JSON.parse(localStorage.getItem('packageDescription'))
          } 
        }
        firstfun();
        Router.push("/roombundle");
      },[]) 
    
      useEffect(() => {
        const fetchRooms = async () => {
            try {
                const url = `/api/rooms/${currentProperty.property_id}`
                const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
               setAllRooms(response.data)
               
            }
            catch (error) {
    
                if (error.response) {
                    } 
                else {
                }
            }
        }
        fetchRooms();
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
      const fetchRoomBundle = async () => {
        try {
            const url = `/api/room_bundle/rb007`
            const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
           setRoomBundle(response.data) 
        }
        catch (error) {
            if (error.response) {
               } 
            else {
               }
        }

    }
    fetchRoomBundle();
    }
        ,[])
     /* Edit Package Edit Function */
   const submitPackageEdit = () => {
    const final_data = {
          "room_bundle_id":roomBundle?.room_bundle_id,
          "rate_master_id":roomBundle?.rate_master_id,
          "room_id": bundle?.room_id,
          "package_id":bundle?.package_id,
          "breakfast_included":bundle?.breakfast_included,
          "parking_included": bundle?.parking_included,
          "internet_included":bundle?.internet_included,
          "rate_master_id":bundle?.rate_master_id
      }  

     const url = '/api/package/room_bundle'
   
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
          ((response) => {
            logger.info("Room bundle updated successfully")
          })

          .catch((error) => {
             logger.error("Room bundle update error")     
          }) 
  }   
  const submitBundleRateEdit = () => {
    const final_data = {
      "base_rate_currency":bundle?.base_rate_currency,
      "rate_master_id":roomBundle?.rate_master_id,
      "base_rate_amount": bundle?.base_rate_amount,
      "tax_currency":bundle?.tax_currency,
      "tax_amount":bundle?.tax_amount,
      "other_fees_currency": bundle?.other_fees_currency,
      "other_fees_amount":bundle?.other_fees_amount,
      
  }  
  const url = '/api/package/rate_master'
  
  axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
  ((response) => {
    toast.success("Package Bundle  Updated Successfully!", {
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
     toast.error("Room Bundles Rates Update Error!", {
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
    <div id="main-content"
    className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
     <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
              <Link href="/landing" >
            <a> {t?.home}</a>
            </Link>
            </span>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <Link href="/propertysummary" ><a>{currentProperty?.property_name}</a></Link>
              </span>
            </div>
          </li>
         
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{t?.room} {t?.bundle}</span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
      <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
         {t?.room} {t?.bundle}
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
                    {t?.room} {t?.name} 
                  </label>
                  <select
                    onClick={(e) => setBundle({ ...bundle, room_id: e.target.value })}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900
                         sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                        <option value={roomBundle?.room_id}>{roomBundle?.room_name}</option>
                        {allRooms?.map(i => {
                          return (
                            <option key={i} value={i.room_id}>{i.room_name}</option>)
                        }
                        )}
                      </select>
                </div>
              </div>
              
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {t?.package} {t?.name} 
                    </label>
                  <select
                   onClick={(e) => setBundle({ ...bundle, package_id: e.target.value })}
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                      <option value={roomBundle?.package_id}>{roomBundle?.package_name}</option>
                      {allPackages?.map(i => {
                        return (
                          <option key={i} value={i.package_id}>{i.package_name}</option>)
                      }
                      )}
                    </select>
                </div>
              </div>
               
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {t?.baserate} 
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                 defaultValue={roomBundle?.base_rate_amount}
                 onChange={
                  (e) => (
                    setBundle({ ...bundle, base_rate_amount: e.target.value })
                  )
                }/> 
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {t?.baserate} {t?.currency}
                  </label>
                  <select className="shadow-sm bg-gray-50  border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  defaultValue = {roomBundle?.base_rate_currency}
                  onChange={
                      (e) => (
                        setBundle({ ...bundle, base_rate_currency: e.target.value })
                      )
                    }>
                    <option value="USD" >USD</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {t?.taxrate}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   defaultValue = {roomBundle?.tax_amount}
                   onChange={
                    (e) => (
                      setBundle({ ...bundle, tax_amount: e.target.value })
                    )
                  }
                /> 
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {t?.taxrate} {t?.currency}
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setBundle({ ...bundle, tax_currency: e.target.value })
                      )
                    }
                    >
                    <option selected >{roomBundle?.tax_currency}</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {t?.other} {t?.charges} {t?.rate} 
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setBundle({ ...bundle, other_fees_amount: e.target.value })
                      )
                    }
                defaultValue={roomBundle?.other_fees_amount}/> 
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {t?.other} {t?.charges} {t?.currency}
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setBundle({ ...bundle, other_fees_currency: e.target.value })
                      )
                    }>
                    <option selected >{roomBundle?.other_fees_currency}</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select>
                </div>
              </div>   
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                <label
                    className="text-medium font-bold text-gray-900 block mt-4 mb-2"
                    htmlFor="grid-password"
                  >
                    {t?.services} 
                  </label>
                 
                
                <div className="flex py-2 items-start">
                  <label className="text-sm  pr-2 font-semibold text-gray-700">
                    Breakfast Included
                  </label>
                  <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember" value={true}
                    
                    type="radio" onChange={
                      (e) => (
                        setBundle({ ...bundle, breakfast_included: e.target.value })
                      )
                    }
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                  <label className="text-sm font-semibold px-1 text-gray-700">
                 {t?.yes}
                  </label>
                  <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember" 
                    type="radio" 
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded" value={false}  
                    onChange={
                      (e) => (
                        setBundle({ ...bundle, breakfast_included: e.target.value })
                      )
                    } 
                    required
                  />
                  <label className="text-sm px-1 font-semibold text-gray-700">
                    {t?.no}
                  </label>  
                </div>
             
                <div className="flex py-2 items-start">
                  <label className="text-sm pr-2 font-semibold  text-gray-700">
                    Parking Included
                  </label>
                  <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember" value={true}
                    type="radio" 
                    onChange={
                      (e) => (
                        setBundle({ ...bundle, parking_included: e.target.value })
                      )
                    }
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                  <label className="text-sm px-1 font-semibold text-gray-700">
                  {t?.yes}
                  </label>
                  <input
                    id="remember"   onChange={
                      (e) => (
                        setBundle({ ...bundle, parking_included: e.target.value })
                      )
                    } 
                    aria-describedby="remember"
                    name="remember" value={false}
                    type="radio" 
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                  <label className="text-sm px-1 font-semibold text-gray-700">
                  {t?.no}
                  </label>
                 </div>
                
                 <div className="flex py-2 items-start">
                 <label className="text-sm pr-2  font-semibold text-gray-700">
                    Internet Included
                  </label> 
                  <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember" 
                    type="radio" value={true}
                    onChange={
                      (e) => (
                        setBundle({ ...bundle, internet_included: e.target.value })
                      )
                    }
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                  <label className="text-sm font-semibold px-1 text-gray-700">
                  {t?.yes}
                  </label>
                  <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember" 
                    type="radio" value={false}
                    onChange={
                      (e) => (
                        setBundle({ ...bundle, internet_included: e.target.value })
                      )
                    }
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                  <label className="text-sm px-1 font-semibold text-gray-700">
                  {t?.no}
                  </label>
                 </div>
              </div>
                    </div> 
                     </div> 
                     <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                <button
                  className="sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center 
                     items-center  mr-1 mb-1 ease-linear transition-all duration-150"
                  onClick={() => {
                  submitPackageEdit();
                    submitBundleRateEdit();
                  }}
                  type="button"
                >
                 {t?.update}
                </button>
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
    
  )
}

export default Roombundle