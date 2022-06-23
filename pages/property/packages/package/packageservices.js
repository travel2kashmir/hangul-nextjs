import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../../../components/Languages/en"
import french from "../../../../components/Languages/fr"
import arabic from "../../../../components/Languages/ar"
import Router from "next/router";
const logger = require("../../../../services/logger"); 
import Header from "../../../../components/SubStructure/Header"
import Footer from "../../../../components/Footer"
import Sidebar from "../../../../components/SubStructure/Sidebar"
var language;
var currentProperty;
var  currentPackageDetails;
var service_name=[];
var service_value=[];
var currentPackage;

function Packageservices() {
  const[packageServices,setPackageServices]= useState([])
  const[currentPackageDetails,setCurrentPackageDetails]= useState([])
  
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
          } 
        }
        firstfun();
        currentPackage=localStorage.getItem('packageId')
        Router.push("./packageservices");
      },[]) 

      const fetchPackageServices = async () => {
        const url = `/api/package/package_services_link/${currentPackage}`
        axios.get(url)
        .then((response)=>{setPackageServices(response.data);
          logger.info("url  to fetch package services hitted successfully")
        }
       )   
          .catch((error)=>{logger.error("url to fetch package services, failed")});  
        }
        const fetchDetails = async () => {
          try {
              const url = `/api/package/${currentPackage}`
              const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
              setCurrentPackageDetails(response.data)
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
      useEffect(() => {
      fetchPackageServices();
      fetchDetails(); 
      },[])

   /** Function package services **/
  const submitPackageServices = () =>{
var total={"package_services": packageServices}
const url = '/api/package/package_service_link'
    axios.put(url, total, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Package Services Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchPackageServices(); 
        Router.push("./packageservices");
      })
      .catch((error) => {
       toast.error("Package Services Update Error! " , {
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
    <Header/>
    <Sidebar/>
    <div
      id="main-content"
      className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64"
    >
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
              <Link href="../../landing">
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
                <Link href="/package">
                  <a> {currentPackageDetails?.package_name}</a>
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
                {language?.package} {language?.services}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-8">
          {language?.package} {language?.services}
        </h6>
        <span className="hidden">
          {(service_name.length = 0)}
          {(service_value.length = 0)}{" "}
        </span>
        {/* Packages Table */}
        <div className="flex flex-col my-4">
          {packageServices?.map((i) => {
            service_name.push(i.service_id);
            service_value.push(i.value);
          })}
          <div className="overflow-x-auto">
            <div className="align-middle inline-block min-w-full">
              <div className="shadow overflow-hidden">
                <table className="table-fixed min-w-full divide-y mx-8 divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="py-4 px-2 text-left text-xs font-semibold text-gray-500 uppercase"
                      >
                        {language?.service} {language?.name}
                      </th>
                      <th
                        scope="col"
                        className="py-4 px-2 text-left text-xs font-semibold text-gray-500 uppercase"
                      >
                        {language?.service} {language?.edit}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {packageServices?.map((item, idx) => (
                      <tr className="hover:bg-gray-100" key={idx}>
                        <td className="py-4 py-2 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                          <span className="py-4 px-2 whitespace-nowrap text-base font-medium capitalize text-gray-900">
                            {"  " +
                              item?.package_service_name?.replace(/_+/g, " ")}
                          </span>
                        </td>

                        <td className="px-2 py-4 whitespace-nowrap text-base font-normal text-gray-900">
                          <div className="flex">
                            <div className="form-check ml-4 form-check-inline">
                          
                              <label htmlFor={"default-toggle"+idx} className="inline-flex relative items-center cursor-pointer">
                              
                            <input type="checkbox" value={item?.value} checked={item.value===true}
                              onChange={() => {
                                setPackageServices(packageServices?.map((i) => {
                                  
                                  if (i?.service_id === item?.service_id) {
                                    i.value = !i.value
                                 }
                                  return i
                                }))
                             }}

                                 id={"default-toggle"+idx} className="sr-only peer"   />
                                
                                <div
                                 className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                                 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                                 peer-checked:after:translate-x-full 
                                 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>

                              </label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 justify-end space-x-2 sm:space-x-3 ml-auto">
          <button
            className="sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center 
                     items-center  mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => {
              submitPackageServices();
            }}
            type="button"
          >
            {language?.update}
          </button>
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
  );
}

export default Packageservices