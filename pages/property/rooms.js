import React, { useEffect, useState } from 'react';
import Sidebar  from "../../components/Sidebar";
import Header  from "../../components/Header";
import axios from "axios";
import Link from "next/link";
import Table  from '../../components/Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar";
import LoaderTable from "./loaderTable";
import Headloader from "../../components/loaders/headloader";
var language;
var currentProperty;
var currentLogged;
import Router from "next/router";

function Rooms() {
  const [visible,setVisible]=useState(0) 
   /** Use Effect to fetch details from the Local Storage **/
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
        } }
           firstfun(); 
           Router.push("./rooms")   
  },[])

    const[gen,setGen] = useState([])
    const [allrooms, setAllRooms] = useState([])
 
    /**Function to save Current property to be viewed to Local Storage**/
  const currentRoom = (props) => {
    localStorage.setItem("RoomId", (props.id));
    Router.push("./rooms/room");
  };

  const fetchRooms = async () => {
    try {
      var genData=[];
        const url = `/api/rooms/${currentProperty.property_id}`
        const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
       setAllRooms(response.data)
       setVisible(1)
      response?.data?.map((item)=>{
        var temp={
          name:item.room_name,
          type:item.room_type_name,
          status:item.status,
          id:item.room_id
        }
        genData.push(temp)
        }
      )
      setGen(genData);
      
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
     const deleteRooms = (props) =>{
    const url=`/api/${props?.id}`
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
       Router.push("./rooms");
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
       
    const addRoom = () =>{
              Router.push("./rooms/addroom")
    }
    
  return (
    <>
   
     <Header Primary={english?.Side}/>
    <Sidebar  Primary={english?.Side}/>
    <div id="main-content"
    className="  bg-white pt-24 relative overflow-y-auto lg:ml-64">

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
            <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../admin/AdminLanding":"./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
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
              <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
              <div className={visible === 1 ? 'block' : 'hidden'}>
              <Link href="./propertysummary" >
               <a> {currentProperty?.property_name}</a>
              </Link></div></span>
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
                {language?.rooms} 
              </span>
            </div>
          </li>
        </ol>
      </nav>
      
{/* Rooms Table */}
<div className={visible === 0 ? 'block' : 'hidden'}><LoaderTable /></div>
 <div className={visible === 1 ? 'block' : 'hidden'}>
<Table  gen={gen} setGen={setGen} add={addRoom} 
      edit={currentRoom}
        delete={deleteRooms} common={language?.common} cols={language?.RoomCols} name="Rooms"/>
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
export default Rooms
Rooms.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }
