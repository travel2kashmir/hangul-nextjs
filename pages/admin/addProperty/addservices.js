import React, { useState, useEffect } from 'react';
import Header from "../../../components/Header";
import axios from 'axios';
import Link from "next/link";
import Router from 'next/router'
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Button from "../../../components/Button";
import Sidebar from "../../../components/Sidebar";
var language;
var property_id = '';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");

function Addservices() {
  var signal= true;
  const [services,setServices]=useState([])
  const [finalServices,setFinalServices]=useState([])
  //creates json to be edited and sent to db
  const makefinal = (arg) =>{
    var intermediate=[]
    arg.map((item,index)=>{
      var temp={"service_id":item.service_id,
        "property_id":property_id,
        "local_service_name":item.service_name,
        "service_value":"no",
        "service_comment":"",
        "status":true,
        "index":index
    }
    intermediate.push(temp)
  })
    setFinalServices(intermediate)
  }
  //fetches all services
  const fetchServices = () => {
    const url=`/api/services`;
    axios.get(url).then((response)=>
    {
      setServices(response.data)
      logger.info("All services fetched")
      makefinal(response.data)
   
    }).catch(error=>{
      logger.error(error)
    })
  }
//first thing to run in page
useEffect(() => {
    const firstfun = () => {
      if (typeof window !== 'undefined') {
        var locale = localStorage.getItem("Language");
        if (locale === "ar") {
          language = arabic;
        }
        if (locale === "en") {
          language = english;
        }
        if (locale === "fr") {
          language = french;

        }
      }
    }
    firstfun();
    property_id = localStorage.getItem("property_id")
    Router.push("./addservices");
    fetchServices();
  }, [])
  
  
  return (
    <>
    <Header Primary={english?.Sideadmin} />
    <Sidebar Primary={english?.Sideadmin} />
    <div id="main-content"
      className=" bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64" >
      <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
            <Link href="../adminLanding" className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
            </Link>
          </li>

          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.addservices}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div>
        <h3 className="text-xl font-semibold">{language?.addnewservices}</h3>
       
      </div>
    </div> <div className=' bg-gray-50 px-2 relative overflow-y-auto lg:ml-64'>
    <div className="flex flex-col mt-8">
                <div className="overflow-x-auto">
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden">
     <table className="table data table-fixed min-w-full divide-y divide-gray-200" id="serviceTable">
      <thead className="bg-gray-100">
        <tr >
          <td>Service Name</td>
          <td>Service Description</td>
          <td>Service Value</td>
          <td>Comment</td>
          <td>Status</td>
        </tr>
      </thead> 
      <tbody className="bg-white divide-y divide-gray-200" id="TableList">
        {services.map((item,idx)=>{ return(
           <tr key={idx}>
           <td>{item?.service_name?.replaceAll("_"," ")}</td>
           <td>{item?.service_description}</td>
           <td>
           {(() => {
      switch (item?.service_id) {
          case 'ser0016': return (<div>
              {/*Kitchen Availability*/}
              <select 
              onChange={(e) => {
                setFinalServices(finalServices?.map((i) => {
                  if (i?.service_id === item?.service_id) {
                    i.service_value = e.target.value
                  }
                  return i
                }))
              }}
              className="shadow-sm bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5">
                  <option select>Select</option>
                  <option value="Available in all rooms">Available in all rooms</option>
                  <option value="Available in some rooms">Available in some rooms</option>
                  <option value="Not available">Not available</option>
              </select>
          </div>)
          case 'ser0017': return (<div>
              {/*Parking Type*/}
              <select
              onChange={(e) => {
                setFinalServices(finalServices?.map((i) => {
                  if (i?.service_id === item?.service_id) {
                    i.service_value = e.target.value
                  }
                  return i
                }))
              }}
              className="shadow-sm bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5" >
                  <option select>Select</option>
                  <option value="No payment required">No Payment Required</option>
                  <option value="Paid">Paid</option>
                  <option value="Not available">Not available</option>
              </select>
          </div>)
          case 'ser0020': return (<div>
              {/*Swimming Pool*/}
              <select 
              onChange={(e) => {
                setFinalServices(finalServices?.map((i) => {
                  if (i?.service_id === item?.service_id) {
                    i.service_value = e.target.value
                  }
                  return i
                }))
              }} className="shadow-sm bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5" >
                  <option select>Select</option>
                  <option value="Indoors">Indoors</option>
                  <option value="Outdoors">Outdoors</option>
                  <option value="Indoors and outdoors">Indoors and Outdoors</option>
                  <option value="Not available">Not available</option>
              </select>
          </div>)
          case 'ser0022': return (<div>
              {/*Wifi Type*/}
              <select
              onChange={(e) => {
                setFinalServices(finalServices?.map((i) => {
                  if (i?.service_id === item?.service_id) {
                    i.service_value = e.target.value
                  }
                  return i
                }))
              }}
              className="shadow-sm bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5">
                  <option select>Select</option>
                  <option value="No payment required">No Payment Required</option>
                  <option value="Paid">Paid</option>
                  <option value="Not available">Not available</option>
                  <option value="Not available">Not available</option>
              </select>
          </div>)
          default: return ( <div className="form-check mx-2 form-check-inline">

          <label htmlFor={`default-toggle${idx}`} className="inline-flex relative items-center cursor-pointer">
              <input type="checkbox" value={true} 
                  onChange={(e) => {
                    setFinalServices(finalServices?.map((i) => {
                      if (i?.service_id === item?.service_id) {
                        i.service_value = e.target.value
                      }
                      return i
                    }))
                  }}
                  id={`default-toggle${idx}`} className="sr-only peer" />
              <div
                  className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                     dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                     peer-checked:after:translate-x-full 
                     peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                     after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                      after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                       </label>
                    </div>)
                    }
                   })()}
            {JSON.stringify(item.service_value)}


            </td>
           <td><input type='text' defaultValue='comment'/></td>
           <td><input type='text' defaultValue='status'/></td>
         </tr>
        )
         
        })}
      </tbody>
     </table>
     </div></div></div></div>
      <div className="items-center p-6 border-t border-gray-200 rounded-b">
        <button
          className="float-right mt-4 bg-blue-600 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          onClick={() => property_id != '' ? console.log(JSON.stringify(finalServices)) : toast.error("Property Not Registered", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })}
          type="button"
        >
          Submit
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
  </>
  
  )
}

export default Addservices