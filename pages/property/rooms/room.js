import React, {useEffect, useState } from 'react';
import axios from "axios";
import Link from "next/link";
import Button  from '../../../components/Button';
import english from "../../../components/Languages/en"
import Footer from "../../../components/Footer";
import Sidebar from '../../../components/Sidebar'
import Header from '../../../components/Header'
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar";
import Headloader from '../../../components/loaders/headloader';
import Imageloader from '../../../components/loaders/imageloader';
import Lineloader from '../../../components/loaders/lineloader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var language;
var currentProperty;
var currentroom;
var room;
import Router from 'next/router'
const logger = require("../../../services/logger");

function Room() {
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
/** Current Property Basic Details fetched from the local storage **/
currentroom =localStorage.getItem('RoomId');
/** Current Property Details fetched from the local storage **/
currentProperty = JSON.parse(localStorage.getItem("property"));
        } }
firstfun(); 
 Router.push("./room")   
  },[])

  const onChangePhoto = (e, i) => {
    setImage({ ...image, imageFile: e.target.files[0] })
}  
 
  const [allRoomDetails, setAllRoomDetails] = useState([])
  const [disp, setDisp] = useState(0);
  const [roomDetails, setRoomDetails] = useState([])
  const [allRoomRates, setAllRoomRates] = useState([])
  const [roomimages, setRoomimages] = useState({})
  const [addImage, setAddImage] = useState(0)
  const [roomtypes, setRoomtypes] = useState([])
  const [actionImage, setActionImage] = useState({})
  const [deleteImage, setdeleteImage] = useState(0)
  const [editImage, setEditImage] = useState(0)
  const [image, setImage] = useState({})
  const [services, setServices] = useState([])
  const [add, setAdd] = useState(0)
  const [enlargeImage, setEnlargeImage] = useState(0)
  const [actionEnlargeImage, setActionEnlargeImage] = useState({})
 
  /* Function for Edit Room Images*/
  const updateImageDetails = () => {
    console.log("Room Details:" +JSON.stringify(allRoomDetails));
    if (allRoomDetails.length !== 0){
    const final_data = {
      "image_id": actionImage?.image_id,
      "image_title": allRoomDetails.image_title,
      "image_description": allRoomDetails.image_description,
      "image_type": allRoomDetails.image_type
    }
    console.log("Final Data" +JSON.stringify(final_data))
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
        fetchDetails(); 
      Router.push("./room");
       setAllRoomDetails([])
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
        fetchImages();
        fetchDetails(); 
      Router.push("./room");
      })
      .catch((error) => {
        toast.error("Image delete error", {
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

  const fetchDetails = async () => {
    const url = `/api/${currentProperty.address_province.replace(/\s+/g, '-')}/${currentProperty.address_city}/${currentProperty.property_category}s/${currentProperty.property_id}/${currentroom}`
    console.log("url " +url)
    axios.get(url)
    .then((response)=>{setRoomDetails(response.data);
    logger.info("url  to fetch room hitted successfully");
    setVisible(1);
  })
    .catch((error)=>{logger.error("url to fetch room, failed")}); 
  }

  const fetchImages = async () => {
    const url = `/api/images/${currentProperty?.property_id}`
    console.log("url " +url)
    axios.get(url)
  .then((response)=>{setRoomimages(response.data);
   logger.info("url  to fetch room images hitted successfully")
   setVisibleImage(1);
  })
   
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
  
  /* Function to load Room Details when page loads*/
  useEffect(() => {
    fetchServices();
    fetchRoomtypes();
    fetchImages();
    fetchDetails();
  },[])

   /* Function to upload image*/
   const uploadImage = () => {
    const imageDetails = image.imageFile
    const formData = new FormData();
    formData.append("file", imageDetails);
    formData.append("upload_preset", "Travel2Kashmir")

    axios.post("https://api.cloudinary.com/v1_1/dvczoayyw/image/upload", formData)
        .then(response => {
           setImage({ ...image, image_link: response?.data?.secure_url })
        })
        .catch(error => {
            toast.error("Image Upload Error! ", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error('There was an error!', error);

        });

}

/* Function to add images*/
const submitAddImage = () => {
  if (actionImage.length !== 0){
  const imagedata = [{
       property_id: currentProperty?.property_id,
       image_link: image?.image_link,
       image_title: actionImage?.image_title,
       image_descripiton: actionImage?.image_description,
       image_category: "room"
   }]
   const finalImage = { "images": imagedata }
   console.log(JSON.stringify(finalImage))
  axios.post(`/api/gallery`, finalImage)
  .then(response => {
  
      toast.success("Image Added Successfully!", {   
           position: "top-center",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
       });
       setActionImage([])

       submitImageLink(response?.data?.image_id);
   })
   .catch(error => {
     toast.error(" Gallery Error", {
           position: "top-center",
           autoClose: 5000,
           hideProgressBar: false,
           closeOnClick: true,
           pauseOnHover: true,
           draggable: true,
           progress: undefined,
       });
   });
  }
}

const submitImageLink = (props) =>{
  const imagedata = [{
    image_id: props,
    room_id: currentroom
}]
const finalImage = { "room_images": imagedata }

axios.post('/api/room-images', finalImage, { header: { "content-type": "application/json" } }).then
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
        fetchImages(); 
        fetchDetails();
       
      Router.push("./room");
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

  /* Function for Update Room Description*/
  const submitRoomDescriptionEdit = () => {
    if (allRoomDetails.length !== 0){
    const final_data = {
      "room_id": currentroom,
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
        setDisp(1);
      fetchDetails(); 
     setAllRoomDetails([])
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
  }
  
   /* Function for Update Room Rates*/
   const submitRoomRatesEdit = () => {
    if (allRoomRates.length !== 0){  
    const final_data = {
      "room_id": currentroom,
      "baserate_currency": allRoomRates?.base_rate_currency,
      "baserate_amount": allRoomRates?.baserate_amount,
      "tax_currency":allRoomRates?.tax_rate_currency,
      "tax_amount": allRoomRates?.tax_amount,
      "otherfees_currency": allRoomRates?.other_fees_currency,
      "otherfees_amount": allRoomRates?.otherfees_amount,
      "un_rate_id": roomDetails?.unconditional_rates?.[0]?.un_rate_id
    }
 
    const url = '/api/unconditional_rates'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Room Rates Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchDetails(); 
      Router.push("./room");
        setAllRoomRates([])

      })
      .catch((error) => {
       toast.error("Room Rates Update Error! " , {
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
  }
  
  return (
    <>
    
<Header  Primary={english?.Side1}/>
    <Sidebar Primary={english?.Side1}/>
    <div id="main-content"
    className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
        {/* Header */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
           <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
         <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
           <Link href="../landing" >
              <a> {language?.home}</a>
            </Link></span>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
             <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
             <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                <div className={visible === 1 ? 'block' : 'hidden'}>
								 <Link href="../propertysummary" ><a>{currentProperty?.property_name}</a></Link></div></span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="../rooms"><a>{language?.propertyrooms}</a></Link></span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.edit} {language?.room}</span>
            </div>
          </li>
        </ol>
      </nav>
      {/* Title */}
      <div className=" pt-2">
        <h6 className="text-xl pb-4 flex mr-4 leading-none  pt-2 font-bold text-gray-800 ">
          {language?.edit} {language?.room} 
        </h6>
      
     
          {/* Room Description */}
        <div id='0' className={disp===0?'block':'hidden'}>
          <div className="bg-white shadow rounded-lg  my-2 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[59%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Room Description</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Room Gallery</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Room Rates</div>
            </div>
        </div>
            <h6 className="text-base  flex leading-none  pt-2 font-semibold text-gray-800 ">
              {language?.room} {language?.description}
            </h6>
            <div className="pt-6">
              <div className=" md:px-2 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {language?.room} {language?.name}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        defaultValue={roomDetails?.room_name}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_name: e.target.value })
                          )
                        }
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password">
                       {language?.room} {language?.type} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                        defaultValue={roomDetails?.room_type}
                        onClick={(e) => setAllRoomDetails({ ...allRoomDetails, room_type_id: e.target.value })}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                        <option value={roomDetails?.room_type}>{roomDetails?.room_type}</option>
                        {roomtypes?.map(i => {
                          return (
                            <option key={i} value={i.room_type_id}>{i.room_type_name}</option>)
                        }
                        )}
                      </select></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {language?.room} {language?.description}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <textarea rows="2" columns="50"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_description: e.target.value })
                          )
                        }
                        defaultValue={roomDetails?.room_description}
                      /></div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.room} {language?.capacity}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={roomDetails?.room_capacity}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_capacity: e.target.value })
                          )
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.maximum} {language?.number} {language?.of} {language?.occupants}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={roomDetails?.maximum_number_of_occupants}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, maximum_number_of_occupants: e.target.value })
                          )
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.minimum} {language?.number} {language?.of} {language?.occupants}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={roomDetails?.minimum_number_of_occupants}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, minimum_number_of_occupants: e.target.value })
                          )
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {language?.maximum} {language?.age} {language?.of} {language?.occupants}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={roomDetails?.minimum_age_of_occupants}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, minimum_age_of_occupants: e.target.value })
                          )
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {language?.room} {language?.length}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text" defaultValue={roomDetails?.room_length}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_length: e.target.value })
                          )
                        }
                      /></div></div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {language?.room} {language?.breadth}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={roomDetails?.room_width}
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_width: e.target.value })
                          )
                        }
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.room} {language?.height}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomDetails({ ...allRoomDetails, room_height: e.target.value })
                          )
                        }
                        defaultValue={roomDetails?.room_height} /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.room} {language?.area}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={roomDetails?.carpet_area} readOnly="readonly"
                      /></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {language?.room} {language?.volume}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        defaultValue={roomDetails?.room_volume} readOnly="readonly" />
                    </div></div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
             
                <Button Primary={language?.Next} onClick={()=>{submitRoomDescriptionEdit,setDisp(1)} }/> 
              </div> 
                </div>
              </div>
            </div>
          </div>
         </div>

          {/* Room Gallery */}
          <div id='1' className={disp===1?'block':'hidden'}>
          <div className="bg-white shadow rounded-lg sm:p-6 xl:p-8  2xl:col-span-2 my-3">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[59%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Room Description</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto"> Room Gallery </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Room Rates</div>
            </div>
           
        </div>
          <h6 className="text-base  flex leading-none mb-2 pt-2 font-semibold text-gray-800 ">
                 {language?.room}  {language?.gallery}
                </h6>
               
                <div className="sm:flex py-2">
                    <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 ml-5 sm:mb-0">
                        <form className="lg:pr-3" action="#" method="GET">
                            <label htmlFor="users-search" className="sr-only">{language?.search}</label>
                            <div className="mt-1 relative lg:w-64 xl:w-96">
                                <input type="text" name="email" id="users-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder={language?.searchforimages}>
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
                   
                        <Button Primary={language?.AddImage} onClick={() => setAddImage(1)}/>
                        <a href="#" className="w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                            <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
                            {language?.export}
                        </a>
                    </div>
                </div>
           
            <div className="flex flex-wrap" >
            <div className={visible === 0 ? 'block w-auto h-auto m-6 w-32 flex' : 'hidden'}><Imageloader /> <Imageloader /><Imageloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
              {roomDetails?.room_images?.map((item, index) => {
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
              })}</div>
            </div>
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={()=>{setDisp(2)}} />
                    </div>
          </div>
       </div>
      
      {/* Room Services Table */}
      <div className="bg-white hidden shadow rounded-lg p-4 sm:p-6 xl:p-8 my-3">
          <div className="mx-0 my-6">
            <h4 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {language?.room} {language?.services} </h4>     
            <div className="sm:flex">
              <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                <form className="lg:pr-3" action="#" method="GET">
                  <label htmlFor="users-search" className="sr-only">{language?.search}</label>
                  <div className="mt-1 relative lg:w-64 xl:w-96">
                    <input type="text" name="email" id="users-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder={language?.searchforservices}>
                    </input>
                  </div>
                </form>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                <button type="button"  onClick={() => setAdd(1)} className="w-1/2 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200  font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                  <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                  {language?.add} {language?.service}
                </button>
              </div>
            </div>
          </div>

          {/* Room Services Table */}
          {/* <div className="flex flex-col my-4">
            <div className="overflow-x-auto">
              <div className="align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden">
                  <table className="table-fixed min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        {language?.service} {language?.name}
                      </th>
                      <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        {language?.service} {language?.description}
                      </th>
                      <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        {language?.status}
                      </th>
                      <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        {language?.action}
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
                                                            {language?.active}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 whitespace-nowrap space-x-2">
                                                        <button type="button" 
                                                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font- font-semibold rounded-lg text-sm inline-flex items-center px-3 py-2 text-center">
                                                            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                                            {language?.delete} {language?.service}
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
          </div> */}
      </div>

      {/* Room Rates*/}
      <div id='2' className={disp===2?'block':'hidden'}>
      <div className="bg-white shadow rounded-lg  sm:p-6 xl:p-8  2xl:col-span-2 ">
      <div className="relative before:hidden  before:lg:block before:absolute before:w-[59%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
     <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Room Description</div>
            </div>
          
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">
               Room Gallery</div>
            </div>
           
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">3</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Room Rates</div>
            </div>
            
        </div>
            <h6 className="text-base  flex leading-none  pt-2 font-semibold text-gray-800 ">
              {language?.room} {language?.rates} 
            </h6>
            <div className="pt-6">
              <div className=" md:px-2 mx-auto w-full">
              <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.baserate} {language?.currency}
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setAllRoomRates({ ...allRoomRates, base_rate_currency: e.target.value })
                      )
                    }>
                    <option value="USD" >USD</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select></div>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.baserate} {language?.amount}
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={roomDetails?.unconditional_rates?.[0]?.baserate_amount}
                    onChange={
                      (e) => (
                        setAllRoomRates({ ...allRoomRates, baserate_amount: e.target.value })
                      )
                    }
                  /></div>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.taxrate} {language?.currency}
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setAllRoomRates({...allRoomRates, tax_rate_currency: e.target.value })
                      )
                    }>
                    <option value="USD" >USD</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select></div>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.taxrate} {language?.amount}
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={roomDetails?.unconditional_rates?.[0]?.tax_amount}
                    onChange={
                      (e) => (
                        setAllRoomRates({ ...allRoomRates, tax_amount: e.target.value,un_rate_id:allRoomDetails?.unconditional_rates?.[0]?.un_rate_id })
                      )
                    } /></div>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.other} {language?.capacity} {language?.currency}
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setAllRoomRates({ ...allRoomRates, other_fees_currency: e.target.value })
                      )
                    }>
                    <option value="USD" >USD</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select></div>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.other} {language?.charges} {language?.amount}
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={roomDetails?.unconditional_rates?.[0]?.otherfees_amount}
                    onChange={
                      (e) => (
                        setAllRoomRates({ ...allRoomRates, otherfees_amount: e.target.value })
                      )
                    } /></div>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
               
                <Button Primary={language?.Update}  onClick={() => {
                    submitRoomRatesEdit();
                    
                  }}/>
              </div>
            </div>
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
      {/* Modal Add */}
      <div className={addImage === 1 ? 'block' : 'hidden'}>
                <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                    <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
                        <div className="bg-white rounded-lg shadow relative">
                            <div className="flex items-start justify-between p-5 border-b rounded-t">
                                <h3 className="text-xl font-semibold">
                                    Add new image
                                </h3>
                                <button type="button"
                                    onClick={() => setAddImage(0)}
                                    className="text-gray-400 bg-transparent
                                 hover:bg-gray-200 
                                 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                            htmlFor="grid-password"
                                        >
                                            Image Upload
                                        </label>
                                        <div className="flex">
                                        <input
                                            type="file" name="myImage" accept="image/png, image/gif, image/jpeg, image/jpg"
                                            onChange={e => {
                                                onChangePhoto(e, 'imageFile');
                                              
                                            }}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full py-2 px-2.5"
                                            defaultValue="" />
                                           
                                    </div> 
                                    <div className="col-span-6 sm:col-span-3">
                                    <button className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-200  font-medium rounded-lg text-sm px-5 py-2 mt-2 text-center"
                                               onClick={uploadImage}>Upload</button></div>
                                    </div>
                                    <img className="py-2" src={image?.image_link} alt='ImagePreview' style={{ height: "80px", width: "600px" }} />
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                            htmlFor="grid-password"
                                        >
                                            Image Title
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => (setActionImage({ ...actionImage, image_title: e.target.value }))}
                                            className="shadow-sm py-2 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full px-2.5"
                                            placeholder="Image Title" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            className="text-sm font-medium text-gray-900 block mb-2"
                                            htmlFor="grid-password"
                                        >
                                            Image Description
                                        </label>
                                        <textarea rows="2" columns="60"
                                            onChange={(e) => (setActionImage({ ...actionImage, image_description: e.target.value }))}
                                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                            defaultValue="" />
                                    </div>
                                    
                                </div>
                            </div>
<div className="items-center p-6 border-t border-gray-200 rounded-b">
 <button
                                    onClick={()=>{submitAddImage(); setAddImage(0)}}
                                    className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    type="submit">Add image</button>
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
               <Button Primary={language?.Update}  onClick={updateImageDetails} />
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
                <Button Primary={language?.Delete} onClick={() => submitDelete()} />
                <Button Primary={language?.Cancel} onClick={() => setdeleteImage(0)} />
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
   </>
  )
}

export default Room
Room.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }
 