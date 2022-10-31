import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Link from "next/link";
import axios from "axios";
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar';
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar";
import DarkModeLogic from "../../components/darkmodelogic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../services/logger");
import Router from "next/router";
var language;
var currentProperty;
var currentLogged;


function Ari() {
    const [allPackages, setAllPackages] = useState([])
    const[propertyAction,setPropertyAction] =useState('delta')
    const[notifType,setNotifType] =useState('delta')
    const[partnerKey,setPartnerKey] =useState()
    const [darkModeSwitcher, setDarkModeSwitcher] = useState()
    const [gen, setGen] = useState([])
    const [color, setColor] = useState({})
    const [viewTransaction, setViewTransaction] = useState(false)
    const [viewNotif, setViewNotif] = useState(false)
   

    useEffect(() => {
        const firstfun = () => {
            if (typeof window !== 'undefined') {
                var locale = localStorage.getItem("Language");
                const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
                const color = JSON.parse(localStorage.getItem("Color"));
                setColor(color);
                setDarkModeSwitcher(colorToggle);
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
                currentProperty = JSON.parse(localStorage.getItem('property'))
                currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
            }

        }
        firstfun();
        Router.push("./ari");
    }, [])

    useEffect(() => {
        fetchPackages();
        fetchPartnerKey();
    }
        , [])

    const fetchPackages = async () => {
            var genData = [];
            const url = `/api/package/${currentProperty?.property_id}`;
            axios.get(url)
                .then((response) => {
                    setAllPackages(response.data);
                 
                    {
                        response.data?.map((item) => {
                            var temp = {
                                name: item.package_name,
                                status: item.status,
                                id: item.package_id
                            }
                            genData.push(temp)
                        })
                        setGen(genData);
                     
                    }
                })
                .catch((error) => { logger.error("url to fetch property details, failed") });
        }
    const fetchPartnerKey = async () => {
        const url = `/api/ari/partner_property_key/${currentProperty?.property_id}`;
        axios.get(url)
            .then((response) => {
                setPartnerKey(response.data.partner_id);
            })
            .catch((error) => { logger.error("url to fetch package details, failed") });
    }

    useEffect(() => {
        setColor(DarkModeLogic(darkModeSwitcher))
    }, [darkModeSwitcher])
    
    const submitTransaction = () => {
        const current = new Date();
        const currentDateTime= current.toISOString();
        const final_data =  {"transaction": {
           "property_id": currentProperty?.property_id,
           "partner_key": partnerKey,
           "property_action": propertyAction,
           "datetime": currentDateTime 
         }
       }
         const url = '/api/ari/transaction'
         axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
           ((response) => {
             toast.success("Transaction success", {
               position: "top-center",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
             });
             setViewTransaction(false);
           })
           .catch((error) => {
             toast.error("Transaction error", {
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
     const submitNotif = () => {
        const current = new Date();
        const currentDateTime= current.toISOString();
        const final_data =  {"transaction":[ {
           "property_id": currentProperty?.property_id,
           "notif_type": notifType,
           "notif_scope": "ProductRate",
           "timestamp": currentDateTime,
           "msg_id":"msg"+currentProperty?.property_id
         }
        ]
       }
         const url = '/api/ari/rate_amount'
         axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
           ((response) => {
             toast.success("Rate amount notif success", {
               position: "top-center",
               autoClose: 5000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
             });
             setViewNotif(false);
           })
           .catch((error) => {
             toast.error("Rate amount notif error", {
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
     const addRoom = () =>{
       setViewTransaction(true)
     }
const addNotif = () =>{
    setViewNotif(true)
}
const currentPackage= (props) => {
    localStorage.setItem("PackageId", (props.id));
    Router.push("./ari/availability");
  };    
    return (
        <>
            <Header color={color} Primary={english?.Side} />
            <Sidebar color={color} Primary={english?.Side} />
            <div id="main-content"
                className={`${color?.greybackground}  pt-24 relative overflow-y-auto lg:ml-64`}>
                {/* Navbar */}
                <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                        <li className="inline-flex items-center">
                            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
                            </Link>
                      </li>
                      </div>
                      <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
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
                               
                                    <Link href="./propertysummary" >
                                        <a> {currentProperty?.property_name} 
                                        </a></Link>
                            </div>
                        </li></div>
                        <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
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
                                    className=" ml-1 md:ml-2 font-medium text-sm  "
                                    aria-current="page"
                                >
                                    ARI
                                </span>
                            </div>
                        </li></div>
                    </ol>
                </nav>
  
             <Table  gen={gen} setGen={setGen}  addNotif={addNotif} edit={currentPackage} lang={language}
           common={language?.common} cols={language?.PackageCols} color={color} add={addRoom}  name="ARI"/>


                <div className={viewTransaction === true ? 'block' : 'hidden'}>
                    <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                        <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
                            <div className={`${color?.whitebackground}  rounded-lg shadow relative`}>
                                <div className="flex items-start justify-between p-5 border-b rounded-t">
                                            <h3 className={ `${color?.text} text-xl font-semibold`}>
                                        {language?.generatetransaction}
                                    </h3>
                                    <button type="button"
                                        onClick={() => {
                                            setViewTransaction(false);
                                        }}
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="user-modal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <form id='editImage'>
                                        <div className="grid grid-cols-4 gap-6">
                                            <div className="col-span-6 sm:col-span-3 ">
                                                <label
                                                    className={ `${color?.text} text-sm mb-6  font-semibold  block mb-2`}
                                                    htmlFor="grid-password"
                                                >
                                                    {language?.action}
                                                </label>
                                                <div className="flex items-center mb-4" >
                                                    <input  id="disabled-radio-1" checked={propertyAction==="overlay"} onChange={()=>{setPropertyAction("overlay")}} type="radio" value="overlay" name="disabled-radio"  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="disabled-radio-1"  className={`${color?.text} ml-1 -mt-0.5 text-sm font-medium`}>{language?.replace}<span className='text-xs text-orange-500 px-1'>{language?.replacesub}</span></label>
                                                </div>
                                                <div className="flex items-center mb-4">
                                                    <input  checked={propertyAction==="delta"}  onChange={()=>{setPropertyAction("delta")}}  id="disabled-radio-2" type="radio" value="delta" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="disabled-radio-2"  className={`${color?.text} ml-1 -mt-0.5 text-sm font-medium`}>{language?.modify}<span className='text-xs text-orange-500 px-1'>{language?.modifysub}</span></label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                                    <button  onClick={submitTransaction} className="bg-gradient-to-r  sm:inline-flex  
            focus:ring-4 focus:ring-cyan-200 font-semibold bg-cyan-600 hover:bg-cyan-700 text-white
             rounded-lg text-sm px-5 py-2 text-center 
             items-center  mb-1 ease-linear transition-all duration-150">
                                       {language?.generate}
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <div className={viewNotif === true ? 'block' : 'hidden'}>
                    <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                        <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
                            <div className={`${color?.whitebackground} rounded-lg shadow relative`}>
                                <div className="flex items-start justify-between p-5 border-b rounded-t">
                                    <h3 className={ `${color?.text} text-xl font-semibold`}>
                                       {language?.addratenotif}

                                    </h3>
                                    <button type="button"
                                        onClick={() => {
                                            setViewNotif(false);
                                        }}
                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="user-modal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <form id='editImage'>
                                        <div className="grid grid-cols-4 gap-6">
                                            <div className="col-span-6 sm:col-span-8">
                                                <label
                                                    className={ `${color?.text} text-sm  font-semibold block mb-6`}
                                                    htmlFor="grid-password"
                                                >
                                                  {language?.action}
                                                </label>
                                                <div className="flex items-center mb-4" >
                                                    <input  id="disabled-radio-1" checked={notifType==="overlay"} onChange={()=>{setNotifType("overlay")}} type="radio" value="overlay" name="disabled-radio"  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="disabled-radio-1"  className={ `${color?.text} ml-1 -mt-0.5 text-sm font-medium`}>{language?.replace}
                                                    <span className='text-xs px-1 text-orange-500'>{language?.replacenotif}</span></label>
                                                </div>
                                                <div className="flex items-center mb-4">
                                                    <input  checked={notifType==="delta"}  onChange={()=>{setNotifType("delta")}}  id="disabled-radio-2" type="radio" value="delta" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="disabled-radio-2"  className={ `${color?.text} ml-1 -mt-0.5 text-sm font-medium `}>{language?.modify}<span className='text-xs px-1 text-orange-500'>
                                                       {language?.modifynotif}</span></label>
                                                </div>
                                                <div className="flex items-center mb-4">
                                                    <input  checked={notifType==="remove"}  onChange={()=>{setNotifType("remove")}}  id="disabled-radio-2" type="radio" value="delta" name="disabled-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                    <label htmlFor="disabled-radio-2"  className={ `${color?.text} ml-1 -mt-0.5 text-sm font-medium `}>
                                                        {language?.delete}
                                                        <span className='text-xs px-1 text-orange-500'>{language?.deletenotif}</span></label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                                    <button  onClick={submitNotif} className="bg-gradient-to-r  sm:inline-flex  
            focus:ring-4 focus:ring-cyan-200 font-semibold bg-cyan-600 hover:bg-cyan-700 text-white
             rounded-lg text-sm px-5 py-2 text-center 
             items-center  mb-1 ease-linear transition-all duration-150">
                                        {language?.add}
                                    </button>
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

            </div>
        </>
    )
}

export default Ari
Ari.getLayout = function PageLayout(page) {
    return (
      <>
        {page}
      </>
    )
  }