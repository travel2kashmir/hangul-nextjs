import React, { useEffect, useState } from 'react';
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "./Languages/en";
import french from "./Languages/fr";
import arabic from "./Languages/ar";
var t;
var currentProperty;
import Router  from "next/router";

function Rooms() {
  
   /** Use Effect to fetch details from the Local Storage **/
   useEffect(()=>{  
    const firstfun=()=>{
        if (typeof window !== 'undefined'){
          var locale = localStorage.getItem("Language");
          if (locale === "ar") {
          t = arabic;
          }
          if (locale === "en") {
          t = english;
          }
          if (locale === "fr") {
            t=french;
          } 

/** Current Property Details fetched from the local storage **/
currentProperty = JSON.parse(localStorage.getItem("property"));
        } }
           firstfun(); 
           Router.push("/rooms")   
  },[])

    const [allrooms, setAllRooms] = useState([])
    const [deleteRoom, setDeleteRoom] = useState(0)
    const [actionRoom,setActionRoom]=useState({});
    
    /**Function to save Current property to be viewed to Local Storage**/
  const CurrentRoom = (roomId ) => {
    localStorage.setItem("RoomId", (roomId));
  };

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
    useEffect(() => {
       
        fetchRooms();
    }
        ,[])
    
     /* Delete Room Function*/
     const deleteRooms = () =>{
    const url=`/api/${actionRoom?.room_id}`
    axios.delete(url).then((response)=>{
       toast.success(("Room Deleted Successfully!"), {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
       fetchRooms(); 
       Router.push("/rooms");
       })
        .catch((error)=>{ 
         toast.error(("Room Delete Error!"), {
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
    <div id="main-content"
    className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">

       {/* Navbar */}
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
            <Link
              href="/landing"
              className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"
            >
              <a>{t?.home}</a>
            </Link>
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
              <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                {currentProperty?.property_name}
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
                {t?.rooms} 
              </span>
            </div>
          </li>
        </ol>
      </nav>
   
 {/* Header */}
 <div className="mx-4">
 <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{t?.property} {t?.rooms}</h1>
 <div className="sm:flex">
     <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
         <form className="lg:pr-3" action="#" method="GET">
             <label htmlFor="users-search" className="sr-only">{t?.search}</label>
             <div className="mt-1 relative lg:w-64 xl:w-96">
                 <input type="text" name="email" id="users-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Search for rooms">
                 </input>
             </div>
         </form>
        
         <div className="sm:hiddenflex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
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
      < span className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200  font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:auto "  >
             <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
             <Link href="/addroom"> 
             <a>{t?.add} {t?.room} </a>
        </Link>
         </span>
         <span className="  w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
             <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
             {t?.export}
         </span>
     </div>
 </div>
</div>

{/* Rooms Table */}
<div className="flex flex-col my-4">
 <div className="overflow-x-auto">
     <div className="align-middle inline-block min-w-full">
         <div className="shadow overflow-hidden">
             <table className="table-fixed min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-100">
                     <tr>
                         <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                             {t?.room} {t?.name}
                         </th>
                         <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                             {t?.room} {t?.type}
                         </th>
                         <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                             {t?.status}
                         </th>
                         <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                             {t?.action}
                         </th>
                     </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                     {allrooms?.map((allrooms,index) => (
                         <tr className="hover:bg-gray-100" key={index}>
                             <td className="p-4 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                                 <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{allrooms?.room_name} </td>
                             </td>
                             <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{allrooms?.room_type_name} </td>
                             <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                 <div className="flex items-center">
                                     <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                                    {t?.active}
                                 </div>
                             </td>
                             <td className="p-4 whitespace-nowrap space-x-2"> 
                                
                                     <button type="button" data-modal-toggle="edit-user-modal"
                                         onClick={() => {
                                          CurrentRoom(allrooms?.room_id),
                                         Router.push("/room");
                                         }}  className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font- font-semibold rounded-lg text-sm inline-flex items-center px-3 py-2 text-center">
                                         <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                                         {t?.edit} {t?.room}
                                     </button>
                                 <button type="button" onClick={()=>{
                                         setDeleteRoom(1);
                                         setActionRoom(allrooms);
                                         }} data-modal-toggle="delete-user-modal" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font- font-semibold rounded-lg text-sm inline-flex items-center px-3 py-2 text-center">
                                     <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                    {t?.delete} {t?.room}
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

{/* Modal Delete */}
<div className={deleteRoom===1?"block":"hidden"}>
<div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full" >
 <div className="relative w-full max-w-md px-4 h-full md:h-auto">
     <div className="bg-white rounded-lg shadow relative">
         <div className="flex justify-end p-2">
             <button type="button" onClick={()=>setDeleteRoom(0)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
             </button>
         </div>

         <div className="p-6 pt-0 text-center">
             <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                 Are you sure you want to delete this room?</h3>
             <button 
             onClick={()=>{deleteRooms();setDeleteRoom(0)}}
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                 Yes, I`m sure
             </button>
             <button 
             onClick={()=>setDeleteRoom(0)} className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center" data-modal-toggle="delete-user-modal">
                 No, cancel
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

)
}
export default Rooms