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



function addadditionalservices() {
    const serTemp = {
        add_service_name: '',
        add_service_comment: '',
        status: true ,
        property_id: property_id
      }

    const [ser, setSer] = useState([serTemp]?.map((i, id) => { return { ...i, index: id } }))

      const addSer = () => {
        setSer([...ser, serTemp]?.map((i, id) => { return { ...i, index: id } }))
      }
    
      const onChange = (e, index, i) => {
        console.log(index, 'index')
        setContact(ser?.map((item, id) => {
          if (item.index === index) {
            item[i] = e.target.value?.toLowerCase();
          }
          return item
        }))
      }
    
      const removeSer = (index) => {
        console.log("index is" + index)
        const filteredSer = ser.filter((i, id) => i.index !== index)
        console.log("data sent to state " + JSON.stringify(filteredSer))
        setSer(filteredSer)
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
    Router.push("./addadditionalservices");
    
  }, [])


  return (<>
    <Header Primary={english?.Sideadmin} />
    <Sidebar Primary={english?.Sideadmin} />
    <div id="main-content"
      className=" bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64" >
      <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
            <Link href="../AdminLanding" className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
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
        <div className='float-right'>
            <button
              className="bg-blue-600 text-white active:bg-blueGray-600
               font-bold uppercase text-xs px-4 py-2 rounded shadow
                hover:shadow-md outline-none focus:outline-none mr-1 mb-4 ease-linear transition-all duration-150" type="button"
              onClick={()=>addSer()}
            >
              +Add Service {property_id}
            </button>
          </div>
       </div>
    </div><div className='bg-gray-50 shadow rounded-lg  px-12 sm:p-6 xl:p-8  2xl:col-span-2'>
       <div className='bg-white px-2 relative overflow-y-auto lg:ml-64'>
        {ser?.map((item, index) => (
          <div className='' key={index}>
            <button
              className="float-right my-8 sm:inline-flex  text-gray-800  
            font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
            rounded-lg text-sm px-1 py-1 text-center 
            items-center mb-1 ml-16 ease-linear transition-all duration-150"
              type="button"
              onClick={() => removeSer(item?.index)}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
              </path></svg>
            </button>
            <div className="p-6 space-y-6" >
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    {language?.service} {language?.name}
                  </label>
                  <input type='text'
                    onChange={e => onChange(e, item?.index, 'add_service_name')}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  />
                    
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    {language?.service} {language?.description}
                  </label>
                  <input
                    type="text"
                    name="service_description"
                    id="contact_date"
                    onChange={e => onChange(e, item?.index, 'add_service_comment')}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
            </div>
          </div>))}

        <div className="items-center p-6 border-t border-gray-200 rounded-b">
          <button
            className="float-right mt-4 bg-blue-600 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={(e) => JSON.stringify(property_id).toUpperCase() != 'NULL' ? handleSubmit(e) : toast.error("APP: Property Not Registered", {
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
    </div> 

    </>
  )
}

export default addadditionalservices