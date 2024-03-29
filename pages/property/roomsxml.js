import React, { useState, useEffect} from 'react'
import axios from 'axios'
import Link from "next/link";
import Router from "next/router";
import Sidebar  from "../../components/Sidebar";
import Header  from "../../components/Header";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar";
const logger = require("../../services/logger");
import Footer from '../../components/Footer';
import Loader from '../../components/loader';
var language;
var currentProperty;
var currentLogged;
function Roomsxml() {
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
       
       /** Current Property Details fetched from the local storage **/
       currentProperty = JSON.parse(localStorage.getItem("property"));
       currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      } 
    }
    firstfun();
    Router.push("./roomsxml");
  },[]) 
  const [allrooms, setAllRooms] = useState([])
 /**Function to save Current property to be viewed to Local Storage**/
  const RoomXML = ({ item }) => {
    localStorage.setItem("roomxml", JSON.stringify(item));
  };
   
    useEffect(() => {
      const fetchRooms = async () => {
          try {
             const url = `/api/rooms/${currentProperty.property_id}`
              const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
            setAllRooms(response.data) 
            setVisible(1)
          } 
          catch (error) {
              if (error.response) {
                 } 
              else {
              }
          }
      }
      fetchRooms();
  }
      ,[])
    
  return (
    <><div className={visible===0?'block':'hidden'}><Loader/></div>
    <div className={visible===1?'block':'hidden'}>
     <Header Primary={english?.Side}/>
    <Sidebar  Primary={english?.Side}/>
    <div  id="main-content"
    className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
   {/* Navbar */}
   <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            <span  className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                            <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../admin/AdminLanding":"./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
                </Link></span>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            <span  className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                            <Link href="./propertysummary">
                            <a>{currentProperty?.property_name}</a>
                        </Link></span>
                        </div>
                    </li>
                    
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            <span className="text-gray-400 ml-1 md:ml-2
                             font-medium text-sm  " aria-current="page">
                                 {language?.property} {language?.rooms}</span>
                        </div>
                    </li>
                </ol>
            </nav>
            {/* Header */}
            <div className="mx-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{language?.property} {language?.rooms}</h1>
                <div className="sm:flex">
                    <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                        <form className="lg:pr-3" action="#" method="GET">
                            <label htmlFor="users-search" className="sr-only">{language?.search}</label>
                            <div className="mt-1 relative lg:w-64 xl:w-96">
                                <input type="text" name="email" id="users-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder={language?.searchforrooms}>
                                </input>
                            </div>
                        </form>
                        <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                            <a href="#" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                       
                        <a href="#" className="w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                            <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
                           {language?.export}
                        </a>
                    </div>
                </div>
            </div>
            {/* Card Rooms Table */}
            <div className="flex flex-col my-4">
                <div className="overflow-x-auto">
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            {language?.room} {language?.name}
                                        </th>
                                        <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                           {language?.room} {language?.type}
                                        </th>
                                        <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                            {language?.Status}
                                        </th>
                                        <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                           {language?.action}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allrooms?.map((item, index) => (
                                        <tr className="hover:bg-gray-100" key={index}>
                                            <td className="p-4 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                                                <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{item?.room_name} </td>
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{item?.room_type_name} </td>
                                            <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                                <div className="flex items-center">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                                                   {language?.active}
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap space-x-2"> 
                                          
                                                    <button type="button"
                                                     className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font- font-semibold rounded-lg text-sm inline-flex items-center px-3 py-2 text-center"
                                                    onClick={() => {
                                                     RoomXML({ item}),
                                                    Router.push("./roomsxml/roomxml");
                                                    }} data-modal-toggle="edit-user-modal"
                                                     >
                                                  {language?.view} XML
                                                    </button>
                                              </td>
                                        </tr>
                                    )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       <Footer/>
       </div> </>
    )

}

export default Roomsxml
Roomsxml.getLayout = function PageLayout(page){
    return(
      <>
      {page}
      </>
    )
    }