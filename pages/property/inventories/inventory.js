import React,{useState, useEffect} from 'react'
import lang from '../../../components/GlobalData'
import { ToastContainer, toast } from 'react-toastify';
import Lineloader from '../../../components/loaders/lineloader';
import Multiselect from 'multiselect-react-dropdown';
import DarkModeLogic from '../../../components/darkmodelogic';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import Router from "next/router";
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar";
import Loader from '../../../components/loader';
import Button from "../../../components/Button";
import Footer from "../../../components/Footer";
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Headloader from '../../../components/loaders/headloader';
import Textboxloader from '../../../components/loaders/textboxloader';
import Link from "next/link";
import validateInventory from '../../../components/Validation/inventory';
var language;
var currentProperty;
var currentRoom;
var currentLogged;
var days_of_week=['M','T','W','T','F','S','U'];
const logger = require("../../../services/logger");

function Inventory() {
    const [darkModeSwitcher, setDarkModeSwitcher] = useState()
    const [inventory, setInventory] = useState([])
    const [gen, setGen] = useState([])
    const [visible, setVisible] = useState(0);
    const [error, setError] = useState({})
    const [color, setColor] = useState({})
    const [allRooms,setAllRooms]=useState([])
   

//fetch rooms with inventory
    const fetchInventoryRooms = async () => {
      const url = `/api/ari/inventory/${currentProperty?.property_id}`;
      axios.get(url)
          .then((response) => {
         fetchRooms(response.data);    
          })
          .catch((error) => { logger.error("url to fetch property details, failed") });
  }

  //fetch all rooms and filter rooms without inv  
  const fetchRooms = async (args) => {
   const url = `/api/rooms/${currentProperty?.property_id}`;
      axios.get(url)
          .then((response) => {
            var result = response?.data.filter(el => {
              return !args?.find(element => {
                 return el.room_id === element.room_id;
              });
           });
           
          setAllRooms(result);
          if(result.length===0){
            toast.warn("Inventory for all rooms registered ", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          })
          .catch((error) => { logger.error("url to fetch property details, failed") });
  }
  
    useEffect(() => {
        const firstfun = () => {
            if (typeof window !== 'undefined') {
                var locale = localStorage.getItem("Language");
                const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
                const color = JSON.parse(localStorage.getItem("Color"));
                setColor(color);
                setDarkModeSwitcher(colorToggle);
                if (locale === "ar") {
                    language = arabic;
                }
                if (locale === "en") {
                    language = english;
                }
                if (locale === "fr") {
                    language = french;
                }
                /** Current Property Basic Details fetched from the local storage **/
                currentProperty = JSON.parse(localStorage.getItem('property'))
                currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
                currentRoom = localStorage.getItem('RoomId');
                fetchInventoryRooms()
                
                setVisible(1);
            }
        }
        firstfun();
        Router.push("./inventory");
    }, [])
     
   
    useEffect(() => {
      setColor(DarkModeLogic(darkModeSwitcher))
  }, [darkModeSwitcher])

// Inventory
 const submitInventory = () => {
    const current = new Date();
    const currentDateTime= current.toISOString();
    const final_data =  {"property_inventory": [{
     "property_id": currentProperty?.property_id,
       "start_date":inventory?.start_date,
       "end_date": inventory?.end_date,
       "days_of_week":days_of_week.toString().replaceAll(',',''),
       "room_id":inventory?.room_id,
       "inventory_count":inventory?.inventory_count,
       "inventory_type": 2
     }]
   }
   const url = '/api/ari/inventory'
     axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
       ((response) => {
        toast.success("Inventory success", {
           position: "top-center",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
         });
       Router.push('../inventories')
       })
       .catch((error) => {
         toast.error("Inventory  error", {
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
// Days
const days = (days) => { 
    var days_present=['-','-','-','-','-','-','-'];
    days.map(day=>{ 
    if(day.day==='mon')
    {
    days_present[0]='m'
    }
    else if(day.day==='tue')
    {
    days_present[1]='t'
    }
    else if(day.day==='weds')
    {
    days_present[2]='w'
    }
    else if(day.day==='thur')
    {
    days_present[3]='t'
    }
    else if(day.day==='fri')
    {
    days_present[4]='f'
    }
    else if(day.day==='sat')
    {
    days_present[5]='s'
    }
    else if(day.day==='sun')
    {
    days_present[6]='s'
    }
    })
     days_of_week = days_present.toString().replaceAll(',','');
  }
  // Validate Inventory
const validationInventory = () => {
    var result = validateInventory(inventory,days_of_week)
       console.log("Result" +JSON.stringify(result))
       if(result===true)
       {
        submitInventory();
       }
       else
       {
        setError(result)
       }
      }
  return (
    <>
    <Header color={color} Primary={english?.Side} />
    <Sidebar color={color} Primary={english?.Side} />
    <div id="main-content"
          className={`${color?.greybackground} px-4 pt-24 relative overflow-y-auto lg:ml-64` }>
         {/* Navbar */}
         <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
              <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../../admin/AdminLanding" : "../landing"} 
                className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                </Link></div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../propertysummary" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{currentProperty?.property_name}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../inventories" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a> {language?.inventories}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page"> {language?.inventory}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>
         <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
            {language?.inventory}
            </h6>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.startdate}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="date"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setInventory({ ...inventory, start_date: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.start_date}</p></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                         {language?.enddate}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="date"
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                                setInventory({ ...inventory, end_date: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                       {language?.available} {language?.days}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect 
                      className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full`}
                      isObject={true}
                      options={lang?.DaysData}
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                      selectedValues={lang?.DaysData}
                     displayValue="day" />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.days}</p>
                       </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                       {language?.rooms}  {language?.count}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                                setInventory({ ...inventory, inventory_count: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.inventory_count}</p>
                      </div>
                    </div>
                  </div>
                 
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                       {language?.rooms}  
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                    onClick={(e) => (
                      setInventory({ ...inventory, room_id: e.target.value })
                  )
                    }
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  >
                     <option selected>Select rooms</option>
                    {allRooms?.map((i) => {
                      return (
                        <option key={i} value={i.room_id}>
                          {i.room_name}
                        </option>
                      );
                    })}
                  </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.inventory_count}</p>
                      </div>
                    </div>
                  </div>
                  
                 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit} onClick={validationInventory} /> 
                </div>
                
                  </div>
                  </div>
            </div>
         </div>
         
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


    <Footer color={color} Primary={english?.Side} />
    </>
  )
}

export default Inventory
Inventory.getLayout = function PageLayout(page) {
    return (
      <>
        {page}
      </>
    )
  }