import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../../../components/Button';
import english from "../../../../components/Languages/en"
import french from "../../../../components/Languages/fr"
import arabic from "../../../../components/Languages/ar"
import Header from "../../../../components/Header"
import Loader from "../../../../components/loader";
import Footer from "../../../../components/Footer"
import Sidebar from "../../../../components/Sidebar"
import Router from "next/router";
var language;
const logger = require("../../../../services/logger");
var currentProperty;
var currentPropertyCredit;
var currentPackage;
var i=0;

function Propertycredit() {
  const [visible,setVisible]=useState(0) 
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
    Router.push("./propertycredit");
  },[]) 
  const [propertycredit, setPropertyCredit] = useState([]);
  const [currentPropertyCredit, setCurrentPropertyCredit] = useState([]);
  /* Function Edit Property Credit*/
  const submitPropertyCreditEdit = () => {
    if (propertycredit.length !== 0){
    const final_data = {
      "property_credit_id": currentPackage,
      "property_credit_currency": propertycredit.property_credit_currency,
      "property_credit_amount": propertycredit.property_credit_amount
    }
  
   const url = '/api/package/package_property_credit'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Property Credit Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setPropertyCredit([])
        fetchDetails(); 
        Router.push("../package")
      })
      .catch((error) => {
       toast.error("Property Credit Error!", {
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
  /* Edit Package Fetch Function */
  const fetchDetails = async  () => {
    const url = `/api/package/${currentPackage}`
     axios.get(url, { header: { "content-type": "application/json" } }).then
       ((response) => {
       logger.info("package success");
       setCurrentPropertyCredit(response.data)
       setVisible(1)
       })
       .catch((error) => {
        logger.info("Delete error")
       })
 
   }
  useEffect(()=>{
  fetchDetails();
  },[])
  return (
    <><div className={visible===0?'block':'hidden'}><Loader/></div>
    <div className={visible===1?'block':'hidden'}>
    <Header Primary={english?.Side2}/>
    <Sidebar  Primary={english?.Side2}/>
    <div  id="main-content"
    className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
       {/* Navbar */}
       <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
              <Link href="../../landing" >
              <a>{language?.home}</a>
            </Link></span>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="../../propertysummary" ><a>{currentProperty?.property_name}</a></Link>
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="../../packages"><a>{language?.packages}</a></Link>
           </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href='../package'>
                <a>{currentPropertyCredit?.package_name}</a></Link>
            </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.propertycredit}</span>
            </div>
          </li>
        </ol>
      </nav>
      
      <div className="bg-white shadow rounded-lg mt-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
      {/* Header */}
     <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
          {language?.propertycredit}
          <svg className="ml-2 h-6 mb-2 w-6 font-semibold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
        </h6>

        {/* Body */}
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                   {language?.creditcurrency}
                  </label>
                  <select
                    className="shadow-sm bg-gray-50 border  border-gray-
                     text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                      focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => (setPropertyCredit({ ...propertycredit, property_credit_currency: e.target.value }))}>
                    <option selected >{currentPropertyCredit?.package_property_credit?.[i]?.property_credit_currency}</option>
                    <option value="INR" >INR</option>
                    <option value="Dollar">Dollar</option>
                    <option value="Euro" >Euro</option>

                  </select>

                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.creditamount}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900
                 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600
                  block w-full p-2.5"
                    defaultValue={currentPropertyCredit?.package_property_credit?.[i]?.property_credit_amount}
                    onChange={(e) => (setPropertyCredit({ ...propertycredit, property_credit_amount: e.target.value }))} />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                       <Button Primary={language?.Update}  onClick={submitPropertyCreditEdit}  />
                
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
      <Footer/>
     </div> </>
  )
}

export default Propertycredit
Propertycredit.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )


}