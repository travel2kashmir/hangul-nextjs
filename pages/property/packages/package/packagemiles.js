import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Button from '../../../../components/Button';
import 'react-toastify/dist/ReactToastify.css';
import LoaderTable from '../../loaderTable';
import Headloader from '../../../../components/loaders/headloader';
import english from "../../../../components/Languages/en"
import french from "../../../../components/Languages/fr"
import arabic from "../../../../components/Languages/ar";
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header'
import Footer from "../../../../components/Footer"
import Router from "next/router";
import Table from '../../../../components/Table';
const logger = require("../../../../services/logger");
var language;
var currentProperty;
var currentPackage;
var currentLogged;

function Packagemiles() {
  const [visible,setVisible]=useState(0) 
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
        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      } 
    }
    firstfun();
    currentPackage=localStorage.getItem('packageId')
    Router.push("./packagemiles");
  },[]) 

  const [gen, setGen] = useState([])
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
  var genData = [];
   axios.get(url, { header: { "content-type": "application/json" } }).then
     ((response) => {
     logger.info("package success");
     setCurrentMiles(response.data)
     {
      response.data?.package_miles?.map((item) => {
          var temp = {
              name: item?.number_of_miles,
              type: item?.provider,
              status: item?.status,
              id: item?.mile_id
          }
          genData.push(temp)
      })
      setGen(genData);

      setVisible(1)

  }
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
   
    const final_data = {
       "mile_id": props.id,
       "number_of_miles": props.name,
       "provider": props.type,
       "status": props.status
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
 
   const submitDelete = (props) => {
    const url = `/api/package/${props}`
    axios.delete(url).then
       ((response) => {
        
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
            <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../../../admin/AdminLanding":"../../landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
                </Link></span>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            <span className="text-gray-700 text-sm font-medium hover:text-gray-900 capitalize ml-1 md:ml-2">
            <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                                <div className={visible === 1 ? 'block' : 'hidden'}>
            <Link href="../../propertysummary" ><a>{currentProperty?.property_name}</a></Link>
            </div></span>
      
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            <span className="text-gray-700 text-sm font-medium hover:text-gray-90{JS0 capitalize ml-1 md:ml-2">
            <Link href="../../packages"><a>{language?.packages} </a></Link></span>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            <span className="text-gray-700 text-sm font-medium hover:text-gray-900 capitalize ml-1 md:ml-2">
            <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                                <div className={visible === 1 ? 'block' : 'hidden'}>
            <Link href="../package"><a>{currentMiles?.package_name} 
            </a></Link></div></span>
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

    <div className={visible === 0 ? 'block' : 'hidden'}><LoaderTable /></div>
                 <div className={visible === 1 ? 'block' : 'hidden'}>
    <Table  gen={gen} setGen={setGen}  
        add={()=> setView(1)} edit={submitMileEdit}
        delete={submitDelete} common={language?.common} cols={language?.MilesCols} name="Package Miles"/> 
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