import React, {useEffect, useState } from 'react';
import axios from "axios";
import Link from "next/link";
import english from "./Languages/en";
import french from "./Languages/fr";
import arabic from "./Languages/ar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/router";
const logger = require("../services/logger");

function Room() {
  /** Fetching language from the local storage **/
  let locale = localStorage.getItem("Language");

  var t;
  if (locale === "ar") {
    t = arabic;
  }
  if (locale === "en") {
    t = english;
  }
  if (locale === "fr") {
    t = french;
  }
  const [allRoomDetails, setAllRoomDetails] = useState([])
  const [roomfacilities, setRoomfacilities] = useState({})
  const [roomimages, setRoomimages] = useState({})
  const [roomtypes, setRoomtypes] = useState([])
  const [actionImage, setActionImage] = useState({})
  const [deleteImage, setdeleteImage] = useState(0)
  const [editImage, setEditImage] = useState(0)
  const [services, setServices] = useState([])
  const [add, setAdd] = useState(0)
  const [enlargeImage, setEnlargeImage] = useState(0)
  const [actionEnlargeImage, setActionEnlargeImage] = useState({})

  let currentProperty=JSON.parse(localStorage.getItem('property'))

  /** Current Property Services fetched from the local storage **/
  let currentroom = JSON.parse(localStorage.getItem("room"));

  /* Function for Edit Room Images*/
  const updateImageDetails = () => {
    const final_data = {
      "image_id": actionImage?.image_id,
      "image_title": allRoomDetails.image_title,
      "image_description": allRoomDetails.image_description,
      "image_type": allRoomDetails.image_type
    }
   const url = '/api/images'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        setEditImage(0);
        toast.success("Room Image Details Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      })
      .catch((error) => {
        toast.error("Room Gallery Update Error!", {
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

  /* Function for Delete Room Images*/
  const submitDelete = () => {
    const url = `/api/${actionImage.image_id}`
    axios.delete(url).then
      ((response) => {
       setdeleteImage(0)
        toast.success("Image deleted successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      })
      .catch((error) => {
        toast.error("Some thing went wrong in Delete\n " + JSON.stringify(error.response.data), {
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

  /** Router for Redirection **/
  const router = useRouter();

  /* Function to load Room Details when page loads*/
  useEffect(() => {
    const fetchDetails = async () => {
      const url = `/api/${currentProperty.address_province.replace(/\s+/g, '-')}/${currentProperty.address_city}/${currentProperty.property_category}s/${currentProperty.property_id}/${currentroom.room_id}`
      console.log("url " +url)
      axios.get(url)
      .then((response)=>{setAllRoomDetails(response.data);
      logger.info("url  to fetch room hitted successfully")})
      .catch((error)=>{logger.error("url to fetch room, failed")}); 
    }
    const fetchRoomfacilities = async () => {
      const url = `/api/room-services/${currentProperty?.property_id}`
      console.log("url " +url)
      axios.get(url)
    .then((response)=>{setRoomfacilities(response.data);
     logger.info("url  to fetch room services hitted successfully")})
     .catch((error)=>{logger.error("url to fetch room services, failed")}); 
    }
    const fetchImages = async () => {
      const url = `/api/images/${currentProperty?.property_id}`
      console.log("url " +url)
      axios.get(url)
    .then((response)=>{setRoomimages(response.data);
     logger.info("url  to fetch room images hitted successfully")})
     .catch((error)=>{logger.error("url to fetch room images, failed")}); 
    }
    const fetchRoomtypes = async () => {
      const url = `/api/room-types`
      console.log("url " +url)
      axios.get(url)
    .then((response)=>{setRoomtypes(response.data);
     logger.info("url  to fetch room types hitted successfully")})
     .catch((error)=>{logger.error("url to fetch roomtypes, failed")}); 
    }
    const fetchServices = async () => {
      const url = `/additional_services/${currentProperty?.property_id}`
      axios.get(url)
    .then((response)=>{setServices(response.data);
     logger.info("url  to fetch room types hitted successfully")})
     .catch((error)=>{logger.error("url to fetch roomtypes, failed")}); 
    }
    fetchServices();
    fetchRoomtypes();
    fetchImages();
    fetchDetails();
    fetchRoomfacilities();
  },)

  /* Function for Update Room Description*/
  const submitRoomDescriptionEdit = () => {
    const final_data = {
      "room_id": currentroom?.room_id,
      "room_name": allRoomDetails.room_name,
      "room_type_id": allRoomDetails.room_type_id,
      "room_description": allRoomDetails.room_description,
      "room_capacity": allRoomDetails.room_capacity,
      "maximum_number_of_occupants": allRoomDetails.maximum_number_of_occupants,
      "minimum_number_of_occupants": allRoomDetails.minimum_number_of_occupants,
      "minimum_age_of_occupants": allRoomDetails.minimum_age_of_occupants,
      "room_length": allRoomDetails.room_length,
      "room_width": allRoomDetails.room_width,
      "room_height": allRoomDetails.room_height
    }

    const url = '/api/room'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Room Details Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      })
      .catch((error) => {
       toast.error("Room Description Update Error! " , {
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
        {/* Header */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
           <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
           <Link href="/userlanding" className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
               {t.home}
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <Link href="/property-summary" className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">Taj Vivanta</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <Link href="/property-rooms" className="text-gray-400 ml-1 md:ml-2 font-medium
               text-sm  " aria-current="page">{t.propertyrooms}</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{t.edit} {t.room}</span>
            </div>
          </li>
        </ol>
      </nav>
      {/* Title */}
      <div className=" pt-2 px-4">
        <h6 className="text-xl pb-4 flex mr-4 leading-none  pt-2 font-bold text-gray-800 ">
          {t.edit} {t.room}
        </h6>
       {/* Room Forms */}
       <div className="w-full grid grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-4">
          {/* Room Description */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
            <h6 className="text-base  flex leading-none  pt-2 font-semibold text-gray-800 ">
              Room Description
            </h6>
            <div className="pt-6">
              <div className=" md:px-2 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {t.room} {t.name}
                      </label>
                      <input
                        type="text"
                        defaultValue={allRoomDetails?.room_name}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_name: e.target.value })
                          )
                        }
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password">
                       {t.room} {t.type}
                      </label>
                      <select
                        defaultValue={allRoomDetails?.room_type_name}
                        onClick={(e) => setAllRoomDetails({ ...allRoomDetails, room_type_id: e.target.value })}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                        <option value={allRoomDetails?.room_type_id}>{allRoomDetails?.room_type}</option>
                        {roomtypes?.map(i => {
                          return (
                            <option key={i} value={i.room_type_id}>{i.room_type_name}</option>)
                        }
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {t.room} {t.description}
                      </label>
                      <textarea rows="2" columns="50"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_description: e.target.value })
                          )
                        }
                        defaultValue={allRoomDetails?.room_description}
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {t.room} {t.capacity}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allRoomDetails?.room_capacity}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_capacity: e.target.value })
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {t.maximum} {t.number} {t.of} {t.occupants}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allRoomDetails?.maximum_number_of_occupants}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, maximum_number_of_occupants: e.target.value })
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {t.minimum} {t.number} {t.of} {t.occupants}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allRoomDetails?.minimum_number_of_occupants}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, minimum_number_of_occupants: e.target.value })
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {t.maximum} {t.age} {t.of} {t.occupants}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allRoomDetails?.minimum_age_of_occupants}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, minimum_age_of_occupants: e.target.value })
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {t.room} {t.length}
                      </label>
                      <input
                        type="text" defaultValue={allRoomDetails?.room_length}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_length: e.target.value })
                          )
                        }
                      /></div>
                  </div>

                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {t.room} {t.breadth}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allRoomDetails?.room_width}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_width: e.target.value })
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {t.room} {t.height}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_height: e.target.value })
                          )
                        }
                        defaultValue={allRoomDetails?.room_height} />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {t.room} {t.area}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allRoomDetails?.carpet_area} readOnly="readonly"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {t.room} {t.volume}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={allRoomDetails?.room_volume} readOnly="readonly" />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-2">
                    <div className="relative w-full mb-3"></div></div>
                  <div className="w-full lg:w-4/12 px-2">
                    <div className="relative w-full ml-4 mb-1"></div></div>
                  <div className="w-full lg:w-2/12 pr-4 pt-2">
                    <div className="relative w-full mb-4">
                      <button className="sm:inline-flex  text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center 
                     items-center mb-1 ease-linear transition-all duration-150"
                        onClick={submitRoomDescriptionEdit} type="button" >
                       {t.update}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Gallery */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 my-3">
            <h6 className="text-base  flex leading-none  pt-2 font-semibold text-gray-800 ">
             {t.room} {t.gallery}
            </h6>
            <div className="flex flex-wrap" >
              {allRoomDetails?.room_images?.map((item, index) => {
                return (
                  <div className="block text-blueGray-600 text-xs pt-2 px-2 " key={index}>
                   <button onClick={()=>{setEnlargeImage(1); setActionEnlargeImage(item)}}><img src={item.image_link} alt='pic_room'  height= {170} width={210} />
                   </button> 
                    <table>
                      <tr>
                        <td className="flex justify-end">
                          <button onClick={() => { setEditImage(1); setActionImage(item) }} className="text-gray-500  mt-1 hover:text-gray-900 
                                           cursor-pointer p-1 hover:bg-gray-100 rounded ">
                            <svg className=" h-5  w-5 font-semibold "
                              fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                          </button>
                          <button onClick={() => { setdeleteImage(1); setActionImage(item) }} className="text-gray-500 mt-1 hover:text-gray-900
                                           cursor-pointer p-1 hover:bg-gray-100 rounded">
                            <svg className="  w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                          </button>
                        </td>
                      </tr>
                    </table>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Room Services Table */}
      <div className="bg-white shadow rounded-lg p-4 mx-4 sm:p-6 xl:p-8 my-3">
          <div className="mx-0 my-6">
            <h4 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {t.room} {t.services} </h4>     
            <div className="sm:flex">
              <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                <form className="lg:pr-3" action="#" method="GET">
                  <label htmlFor="users-search" className="sr-only">{t.search}</label>
                  <div className="mt-1 relative lg:w-64 xl:w-96">
                    <input type="text" name="email" id="users-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder={t.searchforservices}>
                    </input>
                  </div>
                </form>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                <button type="button"  onClick={() => setAdd(1)} className="w-1/2 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200  font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                  <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                  {t.add} {t.service}
                </button>
              </div>
            </div>
          </div>

          {/* Room Services Table */}
          <div className="flex flex-col my-4">
            <div className="overflow-x-auto">
              <div className="align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden">
                  <table className="table-fixed min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t.service} {t.name}
                      </th>
                      <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t.service} {t.description}
                      </th>
                      <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t.status}
                      </th>
                      <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        {t.action}
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {services?.map(i => {
                      return (
                        <tr className="hover:bg-gray-100" key={i}>
                          <td className="p-4 flex items-center whitespace-nowrap space-x-6
                                                     mr-12 lg:mr-0">
                            <td className="p-4 whitespace-nowrap text-base font-medium
                          text-gray-900">{i?.add_service_name}</td>
                          </td>
                          <td className="p-4 capitalize whitespace-wrap text-xs font-medium text-gray-900">
                            {i?.add_service_comment}
                          </td>
                          <td className="p-4 whitespace-nowrap text-base font-normal 
                                                    text-gray-900">
                                                        <div className="flex items-center">
                                                            <div className="h-2.5 w-2.5 rounded-full bg-green-400 
                                                            mr-2"></div>
                                                            {t.active}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap space-x-2">
                                                        <button type="button" 
                                                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font- font-semibold rounded-lg text-sm inline-flex items-center px-3 py-2 text-center">
                                                            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                                            {t.delete} {t.service}
                                                        </button>
                                                    </td>
                        </tr>
                      )
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
      </div>

       {/* Modal Image Enlarge */}
       <div className={enlargeImage === 1 ? 'block' : 'hidden'}>
             <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl sm:inset-0 bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                    <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
                        <div className="bg-gray-100 rounded-lg shadow relative">
                            <div className="flex justify-between p-5 border-b rounded-t">
                            <h3 className="text-xl font-semibold">
                            {actionEnlargeImage.image_title}     
                                </h3>
                              <button type="button"
                                    onClick={() => setEnlargeImage(0)}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="user-modal">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button> </div>
                                <div> <img src={actionEnlargeImage.image_link} alt='pic_room'  height={350} width={650} />
                               </div>   
                          </div>
                    </div>
                </div> 
            </div>

      {/* Modal edit */}
      <div className={editImage === 1 ? 'block' : 'hidden'}>
        <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
          <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
            <div className="bg-white rounded-lg shadow relative">
              <div className="flex items-start justify-between p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold">
                  Edit image
                </h3>
                <button type="button"
                  onClick={() => setEditImage(0)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="user-modal">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <img src={actionImage?.image_link} alt='pic_room' style={{ height: "200px", width: "400px" }} />
                  </div> <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Image description
                    </label>
                    <textarea rows="6" columns="60"

                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllRoomDetails({
                            ...allRoomDetails,
                            image_description: e.target.value
                          })
                        )
                      }
                      defaultValue={actionImage?.image_description}
                    />
                  </div> <div className="col-span-6 sm:col-span-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Image title
                    </label>
                    <input
                      type="text"
                      defaultValue={actionImage?.image_title}
                      onChange={
                        (e) => (
                          setAllRoomDetails({
                            ...allRoomDetails,
                            image_title: e.target.value
                          })
                        )
                      }
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      placeholder="Image Title" />
                  </div>

                </div>
              </div>
              <div className="items-center p-6 border-t border-gray-200 rounded-b">
                <button
                  onClick={updateImageDetails}
                  className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  type="submit">Edit image</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Delete */}
      <div className={deleteImage === 1 ? 'block' : 'hidden'}>
        <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
          <div className="relative w-full max-w-md px-4 h-full md:h-auto">
            <div className="bg-white rounded-lg shadow relative">
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setdeleteImage(0)}
                  type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="delete-user-modal">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>

              <div className="p-6 pt-0 text-center">
                <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                  Are you sure you want to delete {actionImage?.image_title} image?
                </h3>
                <button onClick={() => submitDelete()} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                  Yes, I`m sure
                </button>
                <button
                  onClick={() => setdeleteImage(0)}
                  className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center" data-modal-toggle="delete-user-modal">
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

export default Room