import React, { useEffect, useState } from 'react';
import Sidebar  from "../../components/Sidebar";
import Header  from "../../components/Header";
import axios from "axios";
import Link from "next/link";
import Table  from '../../components/Table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "../../components/Button";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Footer from '../../components/Footer';
import Loader from "../../components/loader";
var language;
var currentProperty;
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
        } }
           firstfun(); 
           Router.push("./rooms")   
  },[])

    const[gen,setGen] = useState([])
    const [allrooms, setAllRooms] = useState([])
    const [deleteRoom, setDeleteRoom] = useState(0)
    const [actionRoom,setActionRoom]=useState({});
 
    /**Function to save Current property to be viewed to Local Storage**/
  const currentRoom = (props) => {
    alert("Props" +props?.id);
    localStorage.setItem("RoomId", (props.id));
    Router.push("./rooms/room");
  };

  const fetchRooms = async () => {
    try {
      var genData=[];
        const url = `/api/rooms/${currentProperty.property_id}`
        const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
       setAllRooms(response.data)
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
      setVisible(1)
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
    <div className={visible===0?'block':'hidden'}><Loader/></div>
<div className={visible===1?'block':'hidden'}>
     <Header Primary={english?.Side}/>
    <Sidebar  Primary={english?.Side}/>
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
              href="./landing"
              className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"
            >
              <a>{language?.home}</a>
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
              <Link href="./propertysummary" >
               <a> {currentProperty?.property_name}</a>
              </Link></span>
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
<Table  gen={gen} setGen={setGen} add={addRoom} 
      edit={currentRoom}
        delete={deleteRooms} common={language?.common} cols={language?.RoomCols} name="Rooms"/>

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
                 <Button Primary={language?.Delete}   onClick={()=>{deleteRooms();setDeleteRoom(0)}}/>
                 <Button Primary={language?.Cancel}    onClick={()=>setDeleteRoom(0)}/>

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