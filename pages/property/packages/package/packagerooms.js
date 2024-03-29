import React, { useState, useEffect } from 'react'
import  Link  from 'next/link';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Button from '../../../../components/Button';
import Headloader from '../../../../components/loaders/headloader';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../../../components/Languages/en"
import french from "../../../../components/Languages/fr"
import arabic from "../../../../components/Languages/ar"
import Footer from "../../../../components/Footer";
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header'
import Router from "next/router";
import CheckboxLoader from '../../../../components/loaders/checkboxLoader';
var language;
var currentProperty;
const logger = require("../../../../services/logger"); 
var id=[];
var currentPackage;
var currentLogged;

function Packagerooms() {
  const [visible,setVisible]=useState(0) 
  const [allRooms, setAllRooms] = useState([])
  const[currentPackageRates,setCurrentPackageRates]= useState([])
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})
  
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
      Router.push("./packagerooms");
    },[]) 
  
   /* Edit Package Fetch Function */
  const fetchDetails = async  () => {
    const url = `/api/package/${currentPackage}`
     axios.get(url, { header: { "content-type": "application/json" } }).then
       ((response) => {
       logger.info("package success");
       setCurrentPackageRates(response.data)
       setVisible(1)
        })
       .catch((error) => {
        logger.info("Delete error")
       })
 
   }

    useEffect(() => {
      const fetchRooms = async () => {
        try {
          const url = `/api/rooms/${currentProperty.property_id}`;
          const response = await axios.get(url, {
            headers: { accept: "application/json" },
          });
          setAllRooms(response.data);
          console.log(JSON.stringify(allRooms));
          
        } catch (error) {
          if (error.response) {
          } else {
          }
        }
      };
      fetchDetails();
      fetchRooms();
    }, []);
    
      /* Edit Package Rate Function */
      const submitPackageRoomsEdit = () => {
     const url = `/api/package/${currentPackage}/rooms`
      axios.delete(url, { header: { "content-type": "application/json" } }).then
        ((response) => {
        logger.info("Delete success");
        submitUpdatedRooms();
        })
        .catch((error) => {
         logger.info("Delete error")
        })
  
    }
  
    const submitUpdatedRooms = () => {
      const datas = allRooms.filter(item => item.check === true)
      const post = datas.map(item => item.room_id)
      const roomData = post.map((item) => {
        return { "package_id": currentPackage, "room_id": item }
      })
      const finalData = {"package_room_link": roomData}
      const url = '/api/package/package_room_link'
      axios.put(url, finalData, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Package Rooms updated successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          Router.push("../package")
        })
        .catch((error) => {
         toast.error("Package Rooms update error! " , {
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
    <Header Primary={english?.Side2}/>
    <Sidebar  Primary={english?.Side2}/>
    <div id="main-content"
    className="bg-gray-50 px-4 py-2 pt-24 relative overflow-y-auto lg:ml-64">
     {/* Navbar */}
     <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
     <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../../../admin/AdminLanding":"../../landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
                </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
             <span  className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
             <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
             <div className={visible === 1 ? 'block' : 'hidden'}>
              <Link href="../../propertysummary">
              <a>  {currentProperty?.property_name}</a></Link></div></span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span  className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="../../packages"><a>{language?.packages}</a></Link>
            </span></div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 capitalize md:ml-2">
              <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                                <div className={visible === 1 ? 'block' : 'hidden'}>
                < Link href="../package"><a>{currentPackageRates?.package_name}</a></Link></div></span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.package} {language?.rooms}</span>
            </div>
          </li>
    </ol>
      </nav>

     {/*  Package Rooms Form */}
   <div className="bg-white shadow rounded-lg mt-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-4">
          {language?.package} {language?.rooms}
          <svg className="ml-2 h-6 mb-2 w-6 font-semibold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
        </h6>
        <div className={visible === 0 ? 'block' : 'hidden'}><CheckboxLoader/>
        <CheckboxLoader/><CheckboxLoader/></div>
                 <div className={visible === 1 ? 'block' : 'hidden'}>
        {allRooms?.map((item, index) => {
                return (
        
        <div className="flex flex-row ml-6 items-start" key={index}>
                <div className="flex items-center h-5">
                  <input
                   onClick={() => {
                    setAllRooms(allRooms?.map((i) => {
                      if (i?.room_id === item?.room_id) {
                        i.check = !i.check
                      }
                      return i
                    }))

                  }}
                    id="remember"
                    aria-describedby="remember"
                    name={"remember" +index}
                    type="checkbox" 
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                </div>
                <div className="text-sm ml-3">
                  <label className="text-sm font-semibold capitalize text-gray-700">
                    {item?.room_name} 
                  </label>
                </div>
               
              </div>
              )})}</div>


    <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Update} onClick={() => {submitPackageRoomsEdit();   
                    }} />
                
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
    </>
 
  )
}

export default Packagerooms
Packagerooms.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )


}