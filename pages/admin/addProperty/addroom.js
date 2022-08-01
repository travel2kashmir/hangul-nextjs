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
import Addroommain from '../../property/rooms/addroom';
var language;
var property_id = '';
var flag = true;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");

function Addroom() {
  const [allRoomDetails, setAllRoomDetails] = useState([])
  const [roomtypes, setRoomtypes] = useState({})
  const [image, setImage] = useState([])
  const [actionImage, setActionImage] = useState([])
  const [services, setServices] = useState([])
  const [roomId, setRoomId] = useState([])
  const [add, setAdd] = useState(0)
  const [disp, setDisp] = useState(0);
  const [modified, setModified] = useState({})
  const [allRoomRates, setAllRoomRates] = useState([])
  const fetchRoomtypes = async () => {
    const url = `/api/room-types`
    axios.get(url)
      .then((response) => {
        setRoomtypes(response.data);
        logger.info("url  to fetch roomtypes hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch roomtypes, failed") });
  }
  const fetchServices = async () => {
    const url = `/api/${property_id}`
    axios.get(url)
      .then((response) => {
        setServices(response.data);
        logger.info("url  to fetch roomtypes hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch roomtypes, failed") });
  }

  /** To fetch room types **/
  useEffect(() => {
    fetchRoomtypes();
    fetchServices();
  }, [])



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
    Router.push("./addroom");
  }, [])

  /*For Room Description*/
  const [allRoomDes, setAllRoomDes] = useState(
    {
      room_name: '',
      property_id: property_id,
      room_description: '',
      room_capacity: '',
      maximum_number_of_occupants: '',
      minimum_number_of_occupants:'',
      minimum_age_of_occupants: '',
      room_length: '',
      room_width: '',
      room_height: ''
    }
  );

  /*Validate Room description */
  const ValidateRoom = () => {
    if(JSON.stringify(property_id).toUpperCase() != 'NULL')
    {
      return `APP: Property Not Registered`
    }
    
    //detect empty values
    for (let item in allRoomDes) {
      if (allRoomDes[item] === '') {
        return `APP:insert value of ${item?.replace("_", " ")}`
      }
    }
    //to check valid value of fields
    for (let item in allRoomDes) {
      switch (item) {
        case "room_name":
          if (allRoomDes[item].length > 50) {
            flag = `APP:Room name should be less than 50 characters`
          }
          break
        case "room_description":
          if (allRoomDes[item].length > 1000) {
            flag = `APP:Room description should be less than 1000 characters`
          }
          break
        case "room_capacity":
          let num = parseInt(allRoomDes[item])
          alert("capacity" + num)
          if (isNaN(num)) {
            flag = `APP:Room capacity should be number`
          }
          else {
            let regexPattern = /^-?[0-9]+$/;
            let result = regexPattern.test(allRoomDes[item]);
            if (result) {
              if (num <= 0) {
                flag = `APP:Room capacity should be greater than zero`
              }
            }
            else {
              flag = `APP:Room capacity should be integer number`
            }
          }
          break
        case "maximum_number_of_occupants":
          alert("occupants" + parseInt(allRoomDes[item]))
          if (isNaN(parseInt(allRoomDes[item]))) {
            flag = `APP:Maximum number of occupants should be number`
          }
          else {
            let regexPattern = /^-?[0-9]+$/;
            let result = regexPattern.test(allRoomDes[item]);
            if (result) {
              if (num <= 0) {
                flag = `APP:Maximum number of occupants should be greater than zero`
              }
            }
            else {
              flag = `APP:Maximum number of occupants should be integer number`
            }
          }
          break
        case "minimum_number_of_occupants":
          if (isNaN(parseInt(allRoomDes[item]))) {
            flag = `APP:Minimum number of occupants should be number`
          }
          if (parseInt(allRoomDes[item]) < 0) {

            flag = `APP:The Minimum number of occupants must be greater than zero`
          }
          break

          case "minimum_age_of_occupants":
            if (isNaN(parseInt(allRoomDes[item]))) {
              flag = `APP:Minimum age should be number`
            }
            if (parseInt(allRoomDes[item]) < 0) {
  
              flag = `APP:The minimum age of occupants must be greater than zero`
            }
            break
  
          case "room_length":
          if (isNaN(parseInt(allRoomDes[item]))) {
            flag = `APP:Room length should be number`
          }
          if (parseInt(allRoomDes[item]) <= 0) {
            flag = `APP:room length should be greater than zero`
          }
          break
        case "room_width":
          if (isNaN(parseInt(allRoomDes[item]))) {
            flag = `APP:Room width should be number`
          }
          if (parseInt(allRoomDes[item]) <= 0) {
            flag = `APP:room width should be greater than zero`
          }
          break
        case "room_height":
          if (isNaN(parseInt(allRoomDes[item]))) {
            flag = `APP:Room height should be number`
          }
          if (parseInt(allRoomDes[item]) <= 0) {
            flag = `APP:Room height should be greater than zero`
          }
          break
        default:
      }
    }

    return (flag === true ? true : flag)
  }

  /**  Submit Function for Room Description **/
  function submitRoomDescription(e) {
    const report = ValidateRoom()
    if (report === true) {
      e.preventDefault()
      const finalData = { ...allRoomDes, status: true }
      axios.post('/api/room', JSON.stringify(finalData),
        {
          headers: { 'content-type': 'application/json' }
        })
        .then(response => {
          toast.success("Room created successfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setRoomId(response.data.room_id)
          setAllRoomDes([]);
          setDisp(1);
        })
        .catch(error => {
          toast.error("Room Description Error! ", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        )
    }
    else {
      toast.error(report, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  /** For Images**/
  const imageTemplate = {
    property_id: property_id,
    image_link: '',
    image_title: '',
    image_description: '',
    image_category: '',
    imageFile: ''
  }

  /* Mapping Index of each image*/
  const [imageData, setImageData] = useState([imageTemplate]?.map((i, id) => { return { ...i, index: id } }))

  /** Function to add room images**/
  const addPhotos = () => {
    setImageData([...imageData, imageTemplate]?.map((i, id) => { return { ...i, index: id } }))
  }
  /** Function to cancel room images**/
  const removeImage = (index) => {
    const filteredImages = imageData.filter((i, id) => i.index !== index)
    setImageData(filteredImages)
  }
  const onChangePhoto = (e, i) => {
    setImage({ ...image, imageFile: e.target.files[0] })
  }

  /** Function to upload room images**/
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
        toast.error("Room error", {
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

  /** Function to submit room images **/
  const submitRoomImages = () => {
    if (actionImage.length !== 0) {
      const imagedata = [{
        /* To be fetched from context */
        property_id: property_id,
        image_link: image.image_link,
        image_title: actionImage.image_title,
        image_descripiton: actionImage.image_description,
        image_category: "room"
      }]
      const finalImage = { "images": imagedata }
      axios.post(`/api/gallery`, finalImage).then(response => {

        const image_data = { "image_id": response.data.image_id, "room_id": roomId }
        const final = { "room_images": [image_data] }
        axios.post('/api/room-images', final, {
          headers: { 'content-type': 'application/json' }
        }).then(response => {
          toast.success(JSON.stringify(response.data.message), {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setActionImage([]);
          setDisp(2);
        })
          .catch(error => {
            toast.error("Gallery error", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      }).catch(error => {
        toast.error("Gallery error!", {
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

    else {
      toast.error("Please fill the room image details ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  /* Add Existing Services*/
  const submitServices = (e) => {
    e.preventDefault()
    const datas = services.filter(i => i.check === true)
    const post = datas.map(i => i.add_service_id)
    const serviceData = post.map((i) => {
      return { "room_id": roomId, add_service_id: i }
    })
    const final = { "additional_services_link": serviceData }
    axios.post('/api/additional_services_link', final, {
      headers: { 'content-type': 'application/json' }
    }).then(response => {
      toast.success(JSON.stringify(response.data.message), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    })
      .catch(error => {
        toast.error("Services error! ", {
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

  /*Function to add new additional room service*/
  const newAdditionalService = () => {
    const final_data = {
      "additional_service": [{
        "property_id": currentProperty?.property_id,
        "add_service_name": modified.add_service_name,
        "add_service_comment": modified.add_service_comment,
        "status": true
      }]
    }
    const url = '/api/additional_services'
    axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Room Services Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const url2 = '/api/additional_services_link'
        const final_data2 = {
          "additional_service_link": [{
            "room_id": roomId,
            "add_service_id": response.data.add_service_id
          }]
        }
        axios.post(url2, final_data2, { header: { "content-type": "application/json" } }).then
          ((response) => {
            toast.success("Link Updated Successfully!", {
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
            toast.error("Some thing went wrong in Additional Services\n " + JSON.stringify(error.response.data), {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          })
      })
      .catch((error) => {
        toast.error("Some thing went wrong in Contacts\n " + JSON.stringify(error.response.data), {
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

  /* Function for Room Rates*/
  const submitRoomRates = () => {
    if (allRoomRates.length !== 0) {
      const final_data = {
        "room_id": roomId,
        "baserate_currency": allRoomRates?.base_rate_currency,
        "baserate_amount": allRoomRates?.baserate_amount,
        "tax_currency": allRoomRates?.tax_rate_currency,
        "tax_amount": allRoomRates?.tax_amount,
        "otherfees_amount": allRoomRates?.otherfees_amount,
        "otherfees_currency": allRoomRates?.otherfees_currency,
        "un_rate_id": allRoomRates?.un_rate_id
      }
      const url = '/api/room_unconditional_rates'
      axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Room Rates Added Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setAllRoomRates([])
        })
        .catch((error) => {
          toast.error("Room Rates  Error! ", {
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
    else {
      toast.error("Please fill the room rates details", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }


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
                <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.addroom}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div>
          <h3 className="text-xl font-semibold">{language?.addnewroom}</h3>

        </div>
      </div> <div className=' bg-gray-50 px-2 relative overflow-y-auto lg:ml-64'>
        {/* Room Forms */}
        {/* Room Description */}
        <div id='0' className={disp === 0 ? 'block' : 'hidden'}>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
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
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={e => setAllRoomDes({ ...allRoomDes, room_name: e.target.value, property_id: property_id })}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password">
                        {language?.room} {language?.type}
                      </label>
                      <select
                        onChange={(e) => setAllRoomDes({ ...allRoomDes, room_type_id: e.target.value })}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                        {roomtypes.length === undefined ? <option value="loading">Loading values</option> :
                          <>{roomtypes?.map(i => {
                            return (
                              <option key={i.room_type_id} value={i.room_type_id}>{i?.room_type_name}</option>)
                          }
                          )}</>}
                      </select>
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
                      <textarea rows="2" columns="50"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={(e) => { setAllRoomDes({ ...allRoomDes, room_description: e.target.value }); }}
                      />
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
                      <input
                        type="text" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={e => setAllRoomDes({ ...allRoomDes, room_capacity: e.target.value })}
                      />
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
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={e => setAllRoomDes({ ...allRoomDes, maximum_number_of_occupants: e.target.value })}
                      />
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
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={e => setAllRoomDes({ ...allRoomDes, minimum_number_of_occupants: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.minimum} {language?.age} {language?.of} {language?.occupants}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={e => setAllRoomDes({ ...allRoomDes, minimum_age_of_occupants: e.target.value })}
                      />
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
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={e => setAllRoomDes({ ...allRoomDes, room_length: e.target.value })}
                      /></div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.room} {language?.breadth}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={e => setAllRoomDes({ ...allRoomDes, room_width: e.target.value })}
                      />
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
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={e => setAllRoomDes({ ...allRoomDes, room_height: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit} onClick={(e) => {
                      submitRoomDescription(e)
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Room Gallery*/}
        <div id='1' className={disp === 1 ? 'block' : 'hidden'}>
          <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
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
            <div className="mx-4">
              <div className="sm:flex">
                <h6 className="text-base  flex leading-none  pt-2 font-semibold text-gray-800 ">
                  Room Gallery
                </h6> <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                  <Button Primary={language?.AddImage} onClick={addPhotos} />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className=" md:px-2 mx-auto w-full">
                <div>
                  {imageData?.map((imageData, index) => (<>
                    <div className={imageData?.index === 0 ? "hidden" : "block"}>
                      <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                        <button className="sm:inline-flex  text-gray-800  
                    font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
                    rounded-lg text-sm px-1 py-1 text-center 
                    items-center mb-1 ml-16 ease-linear transition-all duration-150"
                          onClick={() => removeImage(imageData?.index)} type="button" >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                      </div></div>
                    <div className="flex flex-wrap" key={index}>

                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="text-sm font-medium text-gray-900 block mb-2"
                            htmlFor="grid-password"
                          >
                            Image Upload
                          </label>
                          <div className="flex">
                            <input
                              type="file" accept="image/png, image/gif, image/jpeg, image/jpg"
                              onChange={e => {
                                onChangePhoto(e, 'imageFile');

                              }}
                              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block py-2 w-full px-2.5"
                              defaultValue="" />
                          </div>
                          <div className="col-span-6 sm:col-span-3">
                            <button className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-200  font-medium rounded-lg text-sm px-5 py-2 mt-2 text-center"
                              onClick={uploadImage}>Upload</button></div>
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full ">
                          <img className="py-2" src={image.image_link} alt='ImagePreview' style={{ height: "150px", width: "400px" }} />

                        </div></div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label className="text-sm font-medium text-gray-900 block mb-2"
                            htmlFor="grid-password">
                            Image Title
                          </label>
                          <input type="text" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={(e) => (setActionImage({ ...actionImage, image_title: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4 pb-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="text-sm font-medium text-gray-900 block mb-2"
                            htmlFor="grid-password"
                          >
                            Image Description
                          </label>
                          <textarea rows="2" columns="50"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={(e) => (setActionImage({ ...actionImage, image_description: e.target.value }))}
                          />
                        </div>
                      </div>



                    </div></>))}
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit}
                      onClick={() => property_id != '' ? submitRoomImages() : toast.error("Property Not Registered", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Room Services */}
        {/* <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4">
              {/* <div className="mx-0 my-6">
                <h4 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Room Services</h4>
                <div className="sm:flex">
                  <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                    <form className="lg:pr-3" action="#" method="GET">
                      <label htmlFor="users-search" className="sr-only">Search</label>
                      <div className="mt-1 relative lg:w-64 xl:w-96">
                        <input type="text" name="email" id="users-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Search for services">
                        </input>
                      </div>
                    </form>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                    <button type="button" onClick={() => setAdd(1)} className="w-1/2 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200  font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                      <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                      Add service
                    </button>
                  </div>
                </div>
              </div> */}

        {/* Room Services Table */}
        {/* <div className="flex flex-col my-4">
                <div className="overflow-x-auto">
                  <div className="align-middle inline-block min-w-full">
                    <div className="shadow overflow-hidden">
                      <table className="table-fixed min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                              Service Name
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                              Service Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {services?.map(i,index => {
                            return (
                              <tr className="hover:bg-gray-100" key={index}>
                                <td className="p-4 w-4">
                                  <div className="flex items-center">
                                    <input id="checkbox-1"
                                      onClick={() => {
                                        setServices(services.map((item) => {
                                          if (item.add_service_id === i.add_service_id) {
                                            item.check = !item.check
                                          }
                                          return item
                                        }))
                                      }}
                                      aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                                    <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                                  </div>
                                </td>
                                <td className="p-4 flex items-center whitespace-nowrap space-x-6
                                                     mr-12 lg:mr-0">
                                  <td className="p-4 whitespace-nowrap text-base font-medium
                          text-gray-900">{i?.add_service_name}</td>
                                </td>
                                <td className="p-4 capitalize whitespace-wrap text-xs font-medium text-gray-900">
                                  {i?.add_service_comment}
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
              <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                <button className="sm:inline-flex  text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center
                     items-center mb-1 ease-linear transition-all duration-150"
                  onClick={submitServices} type="button" >
                  Submit</button>
              </div> 

            </div> */}
        {/* Room Rates*/}
        <div id='2' className={disp === 2 ? 'block' : 'hidden'}>
          <div className="bg-white mt-4 shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
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
                      <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomRates({ ...allRoomRates, base_rate_currency: e.target.value })
                          )
                        }>
                        <option value="USD" >USD</option>
                        <option value="INR">INR</option>
                        <option value="Euro">Euro</option>
                      </select>
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
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomRates({ ...allRoomRates, baserate_amount: e.target.value })
                          )
                        }
                      />
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
                      <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomRates({ ...allRoomRates, tax_rate_currency: e.target.value })
                          )
                        }>
                        <option value="USD" >USD</option>
                        <option value="INR">INR</option>
                        <option value="Euro">Euro</option>
                      </select>
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
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomRates({ ...allRoomRates, tax_amount: e.target.value, un_rate_id: allRoomDetails?.unconditional_rates?.[0]?.un_rate_id })
                          )
                        } />
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
                      <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomRates({ ...allRoomRates, otherfees_currency: e.target.value })
                          )
                        }>
                        <option value="USD" >USD</option>
                        <option value="INR">INR</option>
                        <option value="Euro">Euro</option>
                      </select>

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
                      <input
                        type="text"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setAllRoomRates({ ...allRoomRates, otherfees_amount: e.target.value })
                          )
                        } />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit}
                      onClick={() => property_id != '' ? submitRoomRates() : toast.error("Property Not Registered", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })} />
                  </div>
                </div>
              </div>
            </div>
          </div>
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

export default Addroom