import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Button from '../../../../components/Button';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../../../components/Languages/en"
import french from "../../../../components/Languages/fr"
import arabic from "../../../../components/Languages/ar";
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header'
import Footer from "../../../../components/Footer"
import Router from "next/router";
const logger = require("../../../../services/logger");
var language;
var currentProperty;
var currentPackage;

function Packagemiles() {
   /** Fetching language from the local storage **/
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
        currentPackage=localStorage.getItem('packageId')
      } 
    }
    firstfun();
    currentPackage=localStorage.getItem('packageId')
    Router.push("./packagemiles");
  },[]) 

  const [view, setView] = useState(0)
  const [updateMile, setUpdateMile] = useState(0)
  const [deleteMile, setDeleteMile] = useState(0)
  const [editMile, setEditMile] = useState({});
  const [mile, setMile] = useState([]);
  const [modified, setModified] = useState([])
  const [currentMiles, setCurrentMiles] = useState([])

 /* Edit Package Fetch Function */
 const fetchDetails = async  () => {
  const url = `/api/package/${currentPackage}`
   axios.get(url, { header: { "content-type": "application/json" } }).then
     ((response) => {
     logger.info("package success");
     setCurrentMiles(response.data)
     })
     .catch((error) => {
      logger.info("Delete error")
     })

 }
  useEffect(()=>{
  fetchDetails();
  },[])

    /* Function Edit Mile*/
  const submitMileEdit = (props) => { 
    if (mile.length !== 0){
    const final_data = {
       "mile_id": props,
       "number_of_miles": mile.number_of_miles,
       "provider": mile.provider
     }
   const url = '/api/package/package_miles'
     axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
       ((response) => {
         toast.success("Package Mile Updated Successfully!", {
           position: "top-center",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
         fetchDetails(); 
        Router.push("./packagemiles");
         setMile([])
       })
       .catch((error) => {
         toast.error("Package Miles Update Error! " , {
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
 
   const submitDelete = () => {
    const url = `/api/package/${editMile.mile_id}`
    axios.delete(url).then
       ((response) => {
         setDeleteMile(0)
         toast.success("Package Mile Deleted Successfully!", {
           position: "top-center",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
         fetchDetails(); 
        Router.push("./packagemiles");
       })
       .catch((error) => {
        toast.error("Package Miles Delete Error!", {
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
 
   /* Edit Basic Details Function */
   const submitMileAdd = () => {
    if (modified.length !== 0){
     const program = [{
     "package_id": currentPackage,
     "number_of_miles": modified.number_of_miles,
     "provider": modified.provider, 
     "status" :true
     }]
     const finalProgram = { "package_miles": program }
    const url = `/api/package/package_miles`
     axios.post(url, finalProgram, { header: { "content-type": "application/json" } })
     .then
         ((response) => {
             toast.success("Package Mile Added Successfully!", {
                 position: "top-center",
                 autoClose: 5000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,
                 progress: undefined,
               });
               fetchDetails(); 
               Router.push("./packagemiles");
            setModified([])
         })
         .catch((error) => {
            toast.error("Package Miles Add Error!", {
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
    <Header Primary={english?.Side2}/>
    <Sidebar  Primary={english?.Side2}/>
    <div id="main-content"
    className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
      {/* Navbar */}
    <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
            <span className="text-gray-700 text-sm font-medium hover:text-gray-900 capitalize ml-1 md:ml-2">
              <Link href="../../landing" >
          <a>  {language?.home}</a>
          </Link></span>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            <span className="text-gray-700 text-sm font-medium hover:text-gray-900 capitalize ml-1 md:ml-2">
            <Link href="../../propertysummary" ><a>{currentProperty?.property_name}</a></Link></span>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            <span className="text-gray-700 text-sm font-medium hover:text-gray-900 capitalize ml-1 md:ml-2">
            <Link href="../../packages"><a>{language?.packages}</a></Link></span>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            <span className="text-gray-700 text-sm font-medium hover:text-gray-900 capitalize ml-1 md:ml-2">
            <Link href="../package"><a>{currentMiles?.package_name}</a></Link></span>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.package} Miles</span>
          </div>
        </li>
      </ol>
    </nav>

    {/* Header */}
    <div className="mx-4">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{language?.package} {language?.miles}
      </h1>
      <div className="sm:flex">
        <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
          <form className="lg:pr-3" action="#" method="GET">
            <label htmlFor="users-search" className="sr-only">{language?.search}</label>
            <div className="mt-1 relative lg:w-64 xl:w-96">
              <input type="text" name="email" id="users-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder={language?.searchformiles}>
              </input>
            </div>
          </form>
          <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
            </span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            </span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            </span>
            <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
        <Button Primary={language?.AddMiles}  onClick={() => setView(1)} />
         <span className="w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
            <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
            {language?.export}
          </span>
        </div>
      </div>
    </div>
    
    {/* Elite Rewards Form */}
    <div className="flex flex-col my-4">
      <div className="overflow-x-auto">
        <div className="align-middle inline-block min-w-full">
          <div className="shadow overflow-hidden">
            <table className="table-fixed min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    {language?.number} {language?.of}  {language?.miles}
                  </th>
                  <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    {language?.miles} {language?.provider}
                  </th>
                  <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                   {language?.status}
                  </th>
                  <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    {language?.action}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {
                  currentMiles?.package_miles?.map((item,idx) => {
                    return (
                      <tr className="hover:bg-gray-100" key={idx}>
                        <td className="p-4 flex items-center whitespace-nowrap space-x-6
                                                   mr-12 lg:mr-0">
                          <td className="p-4 whitespace-nowrap capitalize text-base font-medium
                                                       text-gray-900">{item?.number_of_miles} </td>
                        </td>
                        <td className="p-4 whitespace-nowrap capitalize text-base font-medium
                                                   text-gray-900">{item?.provider} </td>
                        <td className="p-4 whitespace-nowrap text-base font-normal 
                                                  text-gray-900">
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-400 
                                                          mr-2"></div>
                            {language?.active}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap space-x-2">
                          <Button Primary={language?.EditMile}  onClick={() => { setUpdateMile(1); setEditMile(item);
                          }} />
                          <Button Primary={language?.DeleteMile}  onClick={() => {setDeleteMile(1); setEditMile(item);
                          }}  />
                              </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    {/* Modals Popups for Edit, Add and Delete Mile */}
    {/* Modal Edit */}
    <div className={updateMile === 1 ? 'block' : 'hidden'}>
      <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
        <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
          <div className="bg-white rounded-lg shadow relative">
            <div className="flex items-start justify-between p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold">
                {language?.edit} {language?.miles}
              </h3>
              <button type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 
                          rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setUpdateMile(0)} >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="first-name" className="text-sm font-medium text-gray-900 block mb-2">{language?.number} {language?.of} {language?.miles}</label>
                  <input type="text" id="last-name"
                    defaultValue={editMile?.number_of_miles}
                    onChange={(e) => (setMile({ ...mile, number_of_miles: e.target.value }))}
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="last-name" className="text-sm font-medium text-gray-900 block mb-2">{language?.miles} {language?.provider}</label>
                  <input type="text" id="last-name"
                    defaultValue={editMile?.provider}
                    onChange={(e) => (setMile({ ...mile, provider: e.target.value }))}
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />

                </div>
              </div>
            </div>
            <div className="items-center p-6 border-t border-gray-200 rounded-b">
             <Button Primary={language?.Update}   onClick={() => { setUpdateMile(0); submitMileEdit(editMile?.mile_id) }}/>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal Add */}
    <div className={view === 1 ? "block" : "hidden"}>
      <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
        <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
          <div className="bg-white rounded-lg shadow relative">
            <div className="flex items-start justify-between p-5 border-b rounded-t">
              <h3 className="text-xl font-semibold">
                {language?.add} {language?.new} {language?.miles}
              </h3>
              <button type="button" onClick={() => setView(0)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="first-name" className="text-sm font-medium text-gray-900 block mb-2">{language?.number} {language?.of} {language?.miles}</label>
                  <input type="text" name="last-name" id="last-name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e)=>{setModified({...modified,number_of_miles:e.target.value})}} required />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="last-name" className="text-sm font-medium text-gray-900 block mb-2">{language?.miles} {language?.provider}</label>
                  <input type="text" name="last-name" id="last-name"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" 
                    onChange={(e)=>{setModified({...modified,provider:e.target.value})}} required />
                </div>
              </div>
            </div>

            <div className="items-center p-6 border-t border-gray-200 rounded-b">
             <Button Primary={language?.Add}   onClick={submitMileAdd} />   
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal Delete */}
    <div className={deleteMile === 1 ? "block" : "hidden"}>
      <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full" >
        <div className="relative w-full max-w-md px-4 h-full md:h-auto">
          <div className="bg-white rounded-lg shadow relative">
            <div className="flex justify-end p-2">
              <button type="button" onClick={() => setDeleteMile(0)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
            <div className="p-6 pt-0 text-center">
              <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
               {language?.areyousureyouwanttodelete}</h3>
              <Button Primary={language?.Delete} onClick={() => submitDelete()}/>
              <Button Primary={language?.Cancel}    onClick={() => setDeleteMile(0)} />
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
      pauseOnHover /></div>
       <Footer/>
      </>
  )
}

export default Packagemiles
Packagemiles.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )


}