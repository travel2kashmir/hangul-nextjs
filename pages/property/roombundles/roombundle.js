import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import Button from '../../../components/Button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Sidebar from '../../../components/Sidebar'
import Header from '../../../components/Header'
import Footer from "../../../components/Footer"
import Router from "next/router";
var language;
var currentProperty;
var  currentPackageDetails;
var currentPackage;
const logger = require("../../../services/logger");

function Roombundle() {
  const [allRooms, setAllRooms] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const[roomBundle,setRoomBundle] = useState([])
  const[bundle,setBundle] = useState([])
  const[rate,setRate] = useState([])
  const[flag,setFlag] = useState([])
 

    useEffect(()=>{
        const firstfun=()=>{
          if (typeof window !== 'undefined'){
            var locale = localStorage.getItem("Language"); 
            if (locale === "ar") {
            language = arabic;
            }
            if (locale === "en") {
            language=english;
            }
            if (locale === "fr") {
              language = french;
            }
            /** Current Property Basic Details fetched from the local storage **/
            currentProperty=JSON.parse(localStorage.getItem('property'))  
            currentPackageDetails=JSON.parse(localStorage.getItem('packageDescription'))
            currentPackage=JSON.parse(localStorage.getItem('currentPackage'))
          } 
        }
        firstfun();
        Router.push("./roombundle");
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
            const url = `/api/room_bundle/${currentPackage}`
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
    if (bundle.length !== 0 || flag.length !== 0){
    const final_data = {
          "room_bundle_id":roomBundle?.room_bundle_id,
          "rate_master_id":roomBundle?.rate_master_id,
          "room_id": bundle?.room_id,
          "package_id":bundle?.package_id,
          "breakfast_included":roomBundle?.breakfast_included,
          "parking_included":roomBundle?.parking_included,
          "internet_included":roomBundle?.internet_included,
          "rate_master_id":bundle?.rate_master_id
      }  
     
     const url = '/api/package/room_bundle'
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
            setBundle([])
            setFlag([])
          })
          .catch((error) => {
            toast.error("Room Bundles Update Error!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });   
          }) }
        
  }   

   /* Edit Bundle Rate Function */
  const submitBundleRateEdit = () => {
    if (rate.length !== 0){
    const final_data = {
      "base_rate_currency":rate?.base_rate_currency,
      "rate_master_id":roomBundle?.rate_master_id,
      "base_rate_amount": rate?.base_rate_amount,
      "tax_currency":rate?.tax_currency,
      "tax_amount":rate?.tax_amount,
      "other_fees_currency": rate?.other_fees_currency,
      "other_fees_amount":rate?.other_fees_amount,
      
  }  
  
  const url = '/api/package/rates_master'
  axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
  ((response) => {
    toast.success("Package Room Bundle Updated Successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setRate([])
  })
  .catch((error) => {
     toast.error("Room  Bundle Update Error!", {
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

  return (
    <>
    <Header  Primary={english?.Side1}/>
    <Sidebar  Primary={english?.Side1}/>
    <div id="main-content"
    className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
     <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
              <Link href="../landing" >
            <a> {language?.home}</a>
            </Link>
            </span>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <Link href="../propertysummary" ><a>{currentProperty?.property_name}</a></Link>
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <Link href="../allroombundles" ><a>Room Bundles </a></Link>
              </span>
            </div>
          </li>
         
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.room} {language?.bundle}</span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
      <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
         {language?.room} {language?.bundle} 
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
                    {language?.room} {language?.name} 
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
                    {language?.package} {language?.name} 
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
                    {language?.baserate} 
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                 defaultValue={roomBundle?.base_rate_amount}
                 onChange={
                  (e) => (
                    setRate({ ...rate, base_rate_amount: e.target.value })
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
                    {language?.baserate} {language?.currency}
                  </label>
                  <select className="shadow-sm bg-gray-50  border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  defaultValue = {roomBundle?.base_rate_currency}
                  onChange={
                      (e) => (
                        setRate({ ...rate, base_rate_currency: e.target.value })
                      )
                    }>
                    <option selected> {roomBundle?.base_rate_currency}</option>
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
                    {language?.taxrate}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   defaultValue = {roomBundle?.tax_amount}
                   onChange={
                    (e) => (
                      setRate({ ...rate, tax_amount: e.target.value })
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
                    {language?.taxrate} {language?.currency}
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setRate({ ...rate, tax_currency: e.target.value })
                      )
                    }
                    >
                    <option selected >{roomBundle?.tax_currency}</option>
                    <option value="USD">USD</option>
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
                    {language?.other} {language?.charges} {language?.rate} 
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setRate({ ...rate, other_fees_amount: e.target.value })
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
                    {language?.other} {language?.charges} {language?.currency}
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setRate({ ...rate, other_fees_currency: e.target.value })
                      )
                    }>
                    <option selected >{roomBundle?.other_fees_currency}</option>
                    <option value="USD">USD</option>
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
                    {language?.services} 
                  </label>
                  <div className="flex flex-row ml-6 items-start" >
                <div className="flex items-center h-5">
                  <input  value={roomBundle?.parking_included} checked={roomBundle?.parking_included === true}
                  
                  onChange={()=>(setRoomBundle({...roomBundle,parking_included:!roomBundle.parking_included},setFlag(1)))}
                    id="remember"
                    aria-describedby="remember"
                    name={"remember"}
                    type="checkbox" 
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                </div>
                <div className="text-sm ml-3">
                  <label className="text-sm font-semibold capitalize text-gray-700">
                Parking Included 
                  </label>
                </div>
               
              </div>
              <div className="flex flex-row ml-6 items-start" >
                <div className="flex items-center h-5">
                  <input 
                  checked={roomBundle?.breakfast_included === true}
                  onChange={()=>(setRoomBundle({...roomBundle,breakfast_included:!roomBundle.breakfast_included},setFlag(1)))}
                    id="remember"
                    aria-describedby="remember"
                    name={"remember"}
                    type="checkbox" 
                    className="bg-gray-50
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                </div>
                <div className="text-sm ml-3">
                  <label className="text-sm font-semibold capitalize text-gray-700">
               Breakfast Included 
                  </label>
                </div>
               
              </div>
              <div className="flex flex-row ml-6 items-start">
                <div className="flex items-center h-5">
                  <input value={roomBundle?.internet_included} 
                  checked={roomBundle?.internet_included === true}
                  onChange={()=>(setRoomBundle({...roomBundle,internet_included:!roomBundle.internet_included},setFlag(1)))}
                    id="remember"
                    aria-describedby="remember"
                    name={"remember" } 
                    type="checkbox" 
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                </div>
                <div className="text-sm ml-3">
                  <label className="text-sm font-semibold capitalize text-gray-700">
               Internet Included  
                  </label>
                </div>
               
              </div>
                </div>  
                
               
              </div>
                    </div> 
                     </div> 
                     <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
               
                <Button Primary={language?.Update}    onClick={() => { submitPackageEdit();  submitBundleRateEdit(); }} /> 
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
      <Footer/>
    </>  
  )
}

export default Roombundle
Roombundle.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )


}