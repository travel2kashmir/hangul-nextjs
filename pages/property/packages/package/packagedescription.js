import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../../../components/Languages/en"
import french from "../../../../components/Languages/fr"
import arabic from "../../../../components/Languages/ar"
import Header from "../../../../components/SubStructure/Header"
import Footer from "../../../../components/Footer"
import Sidebar from "../../../../components/SubStructure/Sidebar"
import Router from "next/router";
const logger = require("../../../../services/logger");
var language;
var currentProperty;
var max_age=[];   
var final=[];
var currentPackage;

function Packagedescription() {
  const [disp, setDisp] = useState(0);

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
    Router.push("./packagedescription");
  },[]) 

  const [allPackageDetails, setAllPackageDetails] = useState([])
  const [packageDetails, setPackageDetails] = useState([])

  const fetchDetails = async () => {
    try {
        const url = `/api/package/${currentPackage}`
        const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
        setAllPackageDetails(response.data)
    }
    catch (error) {
        if (error.response) {
            toast.error("Package Error!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        } else {
            toast.error("Package Error!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
        }
    }

}
  useEffect(()=>{
  fetchDetails();
  },[])
    /* Edit Package Edit Function */
   const submitPackageEdit = () => {
    if (packageDetails.length !== 0){
    const final_data = {
          "package_id":allPackageDetails?.package_id,
          "package_name": packageDetails?.package_name,
          "package_description":packageDetails?.package_description,
          "charge_currency":packageDetails?.charge_currency,
          "refundable": packageDetails?.refundable,
          "refundable_until_days": packageDetails?.refundable_until_days,
          "refundable_until_time": packageDetails?.refundable_until_time,
          "max_number_of_intended_occupants": packageDetails?.max_number_of_intended_occupants,
          "max_number_of_adult_guest": packageDetails?.max_number_of_adult_guest
      }  
     const url = '/api/package/package_description'
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
          ((response) => {
            toast.success("Package Description Updated Successfully!", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                fetchDetails(); 
                Router.push("./packagedescription");
                setPackageDetails([])
          })
          .catch((error) => {
             toast.error("Package Description Update Error!", {
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
        else{
          toast.error("Please fill the package details", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }); 
        }
  }
  /** Function submit max age **/
  const submitAge = () =>{
    max_age.forEach((item)=>{
    const temp={
      package_id: packageId,
      max_age_of_child_guest:item
    }
   final.push(temp);
   });
   const final_data = {"max_age_child": final}
   const url = '/api/package/max_age_children'
      axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          logger.info("Package max age children success");
        })
        .catch((error) => {
          logger.error("Max age child error");
        }) 
    }
  return (
    <>
    <Header/>
    <Sidebar/>
    <div id="main-content"
      className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
      <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <svg
              className="w-5 h-5 mr-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
              <Link href="/landing">
                <a> {language?.home}</a>
              </Link>
            </span>
          </li>
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
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <Link href="../../propertysummary">
                  <a>{currentProperty?.property_name}</a>
                </Link>
              </span>
            </div>
          </li>
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
              <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">
                <Link href="../../packages">
                  <a>{language?.packages}</a>
                </Link>
              </span>
            </div>
          </li>
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
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <Link href="../package">
                  <a> {allPackageDetails?.package_name}</a>
                </Link>
              </span>
            </div>
          </li>
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
                className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  "
                aria-current="page"
              >
                {language?.package} {language?.description}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      {/* Package Details Form */}
      <div className="bg-white shadow rounded-lg mx-10 my-2 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
          {language?.package} {language?.description}
          <svg
            className="ml-2 h-6 mb-2 w-6 font-semibold"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            ></path>
          </svg>
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
                    {language?.package} {language?.name}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={allPackageDetails?.package_name}
                    onChange={(e) =>
                      setPackageDetails({
                        ...packageDetails,
                        package_name: e.target.value,
                      })
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
                    {language?.package} {language?.description}
                  </label>
                  <textarea
                    rows="2"
                    columns="50"
                    className="shadow-sm bg-gray-50 border capitalize border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={allPackageDetails?.package_description}
                    onChange={(e) =>
                      setPackageDetails({
                        ...packageDetails,
                        package_description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.paymentholder}
                  </label>
                  <select
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) =>
                      setPackageDetails({
                        ...packageDetails,
                        charge_currency: e.target.value,
                      })
                    }
                  >
                    <option value="web">Web</option>
                    <option value="hotel">Hotel</option>
                    <option value="installment">Installment</option>
                    <option value="deposit">Deposit</option>
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.refundable}
                  </label>
                  <select
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) =>
                      setPackageDetails({
                        ...packageDetails,
                        refundable: e.target.value,
                      })
                    }
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </div>
              {allPackageDetails?.refundable === "true" ? (
                <>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.refundable} {language?.till} {language?.days}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allPackageDetails?.refundable_until_days}
                        onChange={(e) =>
                          setPackageDetails({
                            ...packageDetails,
                            refundable_until_days: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.refundable} {language?.till} {language?.time}
                      </label>
                      <input
                        type="time" step="2"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allPackageDetails?.refundable_until_time}
                        onChange={(e) =>
                          setPackageDetails({
                            ...packageDetails,
                            refundable_until_time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.number} {language?.of} {language?.occupants}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) =>
                      setPackageDetails({
                        ...packageDetails,
                        max_number_of_intended_occupants: e.target.value,
                      })
                    }
                    defaultValue={
                      allPackageDetails?.max_number_of_intended_occupants
                    }
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.number} {language?.of} {language?.adult}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={allPackageDetails?.max_number_of_adult_guest}
                    onChange={(e) =>
                      setPackageDetails({
                        ...packageDetails,
                        max_number_of_adult_guest: e.target.value,
                      })
                    }
                  />
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
                    if(allPackageDetails?.max_number_of_intended_occupants-
                      allPackageDetails?.max_number_of_adult_guest >= 1)
                    setDisp(1);
                  }}
                  type="button"
                >
                 {language?.update}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div id='1' className={disp===1?'block':'hidden'}>
       {final=[]} {max_age=[]}
      {allPackageDetails?.max_number_of_intended_occupants-
                            allPackageDetails?.max_number_of_adult_guest >= 1 ? 
                            
                            <>
      <div className="bg-white shadow rounded-lg mx-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
         Maximum Age of Children
          <svg
            className="ml-2 h-6 mb-2 w-6 font-semibold"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            ></path>
          </svg>
        </h6>
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">
        
            <div className="w-full lg:w-6/12 px-4">
              {allPackageDetails?.max_age_children?.map((item, index) => {
                return (
                <div className="relative w-full mb-3" key={index}>
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                  {language?.maximum}  {language?.age}  {language?.of} {language?.child}
                  </label>   
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                     onChange={(e)=>
                      max_age[index]=e.target.value
                  }>
                     <option selected >{item?.max_age_of_child_guest} </option>
                    <option value="1" >1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5" >5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9" >9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
                 )
                })}
              </div>
              <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                <button
                  className="sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center 
                     items-center  mr-1 mb-1 ease-linear transition-all duration-150"
                  onClick={() => {
                    submitAge();
                  }}
                  type="button"
                >
                 {language?.update}
                </button>
              </div>   
            </div>
            </div>
            </div>
        </div>
        </>:
        <></>}
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
  );
}

export default Packagedescription