import React, { useEffect, useState } from 'react';
import validateRoomRates from '../../../components/Validation/addroomRates';
import validateRoom from '../../../components/Validation/addroomdescription';
import validateRoomGallery from '../../../components/Validation/addroomGallery';
import validateBedData from '../../../components/Validation/addroomBedData';
import Multiselect from 'multiselect-react-dropdown';
import lang from '../../../components/GlobalData'
import DarkModeLogic from "../../../components/darkmodelogic";
import axios from "axios";
import Headloader from '../../../components/loaders/headloader';
import Lineloader from '../../../components/loaders/lineloader';
import Button from '../../../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Footer from "../../../components/Footer"
import Sidebar from '../../../components/Sidebar'
import Header from '../../../components/Header'
var language;
var currentProperty;
var addroom;
import Router from 'next/router'
const logger = require("../../../services/logger");
var currentLogged;

function Addroom() {
  const [allRoomDetails, setAllRoomDetails] = useState([])
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})
  const [visible, setVisible] = useState(0)
  const [roomtypes, setRoomtypes] = useState({});
  const [image, setImage] = useState({})
  const [actionImage, setActionImage] = useState({})
  const [services, setServices] = useState([])
  const [roomId, setRoomId] = useState([])
  const [finalView, setFinalView] = useState([])
  const [add, setAdd] = useState(0)
  const [disp, setDisp] = useState(0);
  const [modified, setModified] = useState({})
  const [error, setError] = useState({})
  const [allRoomRates, setAllRoomRates] = useState([])

  /** Use Effect to fetch details from the Local Storage **/
  useEffect(() => {
    const firstfun = () => {
      if (typeof window !== 'undefined') {
        var locale = localStorage.getItem("Language");
        const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
        const color = JSON.parse(localStorage.getItem("Color"));
        setColor(color);
        setDarkModeSwitcher(colorToggle)
        if (locale === "ar") {
          language = arabic;
        }
        if (locale === "en") {
          language = english;
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
    Router.push("./addroom")
  }, [])
 

  // Room Types
  const fetchRoomtypes = async () => {
    const url = `/api/room-types`
    axios.get(url)
      .then((response) => {
        setRoomtypes(response.data);
        logger.info("url  to fetch roomtypes hitted successfully")
        setVisible(1)
      })
      .catch((error) => { logger.error("url to fetch roomtypes, failed") });
  }
  // Image Template
  const imageTemplate = {
    property_id: currentProperty?.property_id,
    image_link: '',
    image_title: '',
    image_description: '',
    image_category: '',
    imageFile: ''
  }
  // Images Mapping
  const [imageData, setImageData] = useState([imageTemplate]?.map((i, id) => { return { ...i, index: id } }))

  const addPhotos = () => {
    setImageData([...imageData, imageTemplate]?.map((i, id) => { return { ...i, index: id } }))
  }

  const removeImage = (index) => {
    const filteredImages = imageData.filter((i, id) => i.index !== index)
    setImageData(filteredImages)
  }

  const onChangePhoto = (e, index, i) => {
    setImageData(imageData?.map((item, id) => {
      if (item.index === index) {
        item[i] = e.target.files[0]
      }
      return item
    }))
  }

  const onChangeImage = (e, index, i) => {
    setImageData(imageData?.map((item, id) => {
      if (item.index === index) {
        item[i] = e.target.value
      }
      return item
    }))
  }

  const uploadImage = (index) => {
    const imageDetails = imageData?.find(i => i.index === index)?.imageFile
    const formData = new FormData();
    formData.append("file", imageDetails);
    formData.append("upload_preset", "Travel2Kashmir")
    axios.post("https://api.cloudinary.com/v1_1/dvczoayyw/image/upload", formData)
      .then(response => {
        const newData = imageData?.map((i) => {
          if (i.index === index) {
            i.image_link = response?.data?.secure_url
          }
          return i
        })
        setImageData(newData)
      })
      .catch(error => {
        toast.error("Error uploading photo\n ", {
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
  // Room Services
  const fetchServices = async () => {
    const url = `/api/all_room_services`
    axios.get(url)
      .then((response) => {
        setServices(response.data);
        logger.info("url  to fetch roomtypes hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch roomtypes, failed") });
  }

  /** To fetch room types and room services **/
  useEffect(() => {
    fetchRoomtypes();
    fetchServices();
  }, [])

  /*For Room Description*/
  const [allRoomDes, setAllRoomDes] = useState([]);

  useEffect(() => {
    setColor(DarkModeLogic(darkModeSwitcher))
  }, [darkModeSwitcher])

  /**  Submit Function for Room Description **/
  function submitRoomDescription() {
    setError({});
    if (allRoomDes.length !== 0) {
      const finalData = { ...allRoomDes, status: true, property_id:currentProperty?.property_id }
      axios.post('/api/room', JSON.stringify(finalData), { headers: { 'content-type': 'application/json' } })
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
          submitBed(response.data.room_id)
          submitView(response.data.room_id)
          setAllRoomDes([]);
          setDisp(2);
          setError({});
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
        else{
          toast.error("Please fill the room details ", {
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
  
    

  /** For Bed**/
  const BedTemplate = {
    "length": "",
    "width": ""
  }

  /* Mapping Index of each Bed*/
  const [BedData, setBedData] = useState([BedTemplate]?.map((i, id) => { return { ...i, index: id } }))

  /** Function to add Bed **/
  const addBed = () => {
    setBedData([...BedData, BedTemplate]?.map((i, id) => { return { ...i, index: id } }))
  }

  /** Function to on change for Bed **/
  const onChange = (e, index, i) => {
    setBedData(BedData?.map((item, id) => {
      if (item.index === index) {
        item[i] = e.target.value
      }
      return item
    }))
  }

  /** Function to cancel package mile **/
  const removeBed = (index) => {
    const filteredBed = BedData.filter((i, id) => i.index !== index)
    setBedData(filteredBed)
  }

  // Bed Data Submit
  const submitBed = (props) => {
    const current = new Date();
    const currentDateTime = current.toISOString();
    const data = BedData?.map((i => {
      return {
        "room_id": props,
        "length": i?.length,
        "width": i?.width,
        "unit": "cm",
        "timestamp": currentDateTime

      }
    }))
    const final_data = { "beds": data }

    const url = '/api/bed_details'
    axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Bed add success", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setError({});
      })
      .catch((error) => {
        toast.error("Bed add error", {
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

  // View Submit
  const submitView = (props) => {
    const data = finalView?.map((i => {
      return {
        "room_id": props,
        "view": i?.view
      }
    }))
    const final_data = { "room_views": data }
    const url = '/api/room_views'
    axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("View add success.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setError({});
      })
      .catch((error) => {
        toast.error("View add error.", {
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



  /** Function to submit room images **/
  const submitRoomImages = () => {
    const imagedata = imageData?.map((i => {
      return {
        property_id: currentProperty?.property_id,
        image_link: i.image_link,
        image_title: i.image_title,
        image_description: i.image_description,
        image_category: "outside"
      }
    }))
   var result = validateRoomGallery(imagedata);
   if (result === true) {
      const finalImage = { "images": imagedata }
      axios.post(`/api/gallery`, finalImage).then(response => {
        const images = imageData?.map((i => {
          return {
            "image_id": response.data.image_id,
            "room_id": roomId
          }
        }))
        const final = { "room_images": images }
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
          setError({});
          setDisp(4);
        })
          .catch(error => {
            toast.error("Gallery error.", {
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
        toast.error("Gallery link error.", {
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
      setError(result)
    }
  }

  /*Function to add room service*/
  const submitServices = () => {
    services.map(
      (i) => (i.room_id = roomId, i.status = i.service_value)
    )
    services.map(
      (i) => {
        if (JSON.stringify(i.service_value) !== "true") {
          return (

            i.service_value = false,
            i.status = false
          )
        }
      }
    )
    var total = { "room_services": services }
    const url = '/api/room_facilities'
    axios.post(url, total, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Room services add success.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setDisp(3);
      })
      .catch((error) => {
        toast.error("Room Services add error. ", {
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
        "baserate_currency": allRoomRates?.currency,
        "baserate_amount": allRoomRates?.baserate_amount,
        "tax_currency": allRoomRates?.currency,
        "tax_amount": allRoomRates?.tax_amount,
        "otherfees_amount": allRoomRates?.otherfees_amount,
        "otherfees_currency": allRoomRates?.currency,
      }
      const url = '/api/room_unconditional_rates'
      axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Room rates added successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setAllRoomRates([]);
          setError({});
          Router.push("../rooms")
        })
        .catch((error) => {
          toast.error("Room rates  error! ", {
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

  //Views
  const views = (viewData) => {
    setFinalView([]);
    var final_view_data = []
    viewData.map(item => {
      var temp = {
        view: item?.view.replaceAll(" ","")
      }
      final_view_data.push(temp)
    });
    setFinalView(final_view_data);
  }

  // Validate Room Description
  const validationRoomDescription = () => {
    var result = validateRoom(allRoomDes, finalView)
    console.log("Result" + JSON.stringify(result))
    if (result === true) {
      if (allRoomDes?.room_type_id === 'rt001' || allRoomDes?.room_type_id === 'rt002' || allRoomDes?.room_type_id === 'rt003' || allRoomDes?.room_type_id === 'rt004'
        || allRoomDes?.room_type_id === 'rt005') {
        setDisp(1);
        setError({});
      }
      else {
        submitRoomDescription();
      }
    }
    else {
      setError(result)
    }
  }

  // Validate Beds Data
  const validationBedData = () => {
    var result = validateBedData(BedData)
    console.log("Result" + JSON.stringify(result))
    if (result === true) {
      submitRoomDescription();
    }
    else {
      setError(result)
    }
  }

  // Validate Rates
  const validationRates = () => {
    var result = validateRoomRates(allRoomRates)
    console.log("Result" + JSON.stringify(result))
    if (result === true) {
      submitRoomRates();
    }
    else {
      setError(result)
    }
  }

  return (
    <>
      <Header Primary={english?.Side1} color={color} />
      <Sidebar Primary={english?.Side1} color={color} Type={currentLogged?.user_type} />

      <div id="main-content"
        className={`${color?.greybackground} px-4 pt-24 relative overflow-y-auto lg:ml-64`}>

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
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../propertysummary" className={`text-gray-700 text-sm ml-1 md:ml-2  font-medium hover:${color?.text} `}>
                    <a>{currentProperty?.property_name}</a>
                  </Link>
                  </div></div>

              </div>
            </li>
            <li>
              <div className="flex items-center">
                <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../rooms" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{language?.rooms}</a>
                  </Link>
                  </div></div>

              </div>
            </li>
            <li>
              <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.addroom}</span>
                </div>
              </div>
            </li>
          </ol>
        </nav>

        {/* Title */}
        <div className=" pt-2 ">

          <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6 pb-2 font-bold`}>
            {language?.add} {language?.room}
          </h6>

          {/* Room Forms */}
          {/* Room Description */}
          <div id='0' className={disp === 0 ? 'block' : 'hidden'}>
            <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
              <div className="relative before:hidden  before:lg:block before:absolute before:w-[64%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                  <div className={`${color.crossbg} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>Room Description</div>
                </div>

                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                  <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.room} {language?.services}</div>
                </div>
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                  <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.room} {language?.gallery}</div>
                </div>
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                  <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.room} {language?.rates}</div>
                </div>
              </div>
              <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
                {language?.room} {language?.description}
              </h6>
              <div className="pt-6">
                <div className=" md:px-2 mx-auto w-full">
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.room} {language?.name}
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => setAllRoomDes({ ...allRoomDes, room_name: e.target.value })}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.room_name}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password">
                          {language?.room} {language?.type}
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                        <div className={visible === 1 ? 'block' : 'hidden'}>
                          <select
                            onClick={(e) => setAllRoomDes({ ...allRoomDes, room_type: e.target.value })}
                            className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`} >
                            {roomtypes.length === undefined ? <option value="loading">Loading values</option> :
                              <>
                                <option selected disabled>{language?.select}</option>
                                {roomtypes?.map(i => {
                                  return (

                                    <option key={i.room_type_id} value={i.room_type_id}>{i?.room_type_name.replaceAll("_", " ")}</option>)
                                }
                                )}</>}
                          </select>
                          <p className="text-sm text-sm text-red-700 font-light">
                            {error?.room_type}</p></div>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.room} {language?.description}
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <textarea rows="2" columns="50"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={(e) => { setAllRoomDes({ ...allRoomDes, room_description: e.target.value }); }}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.room_description}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.room} {language?.capacity}
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text" className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => setAllRoomDes({ ...allRoomDes, room_capacity: e.target.value })}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.room_capacity}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.maximum} {language?.number} {language?.of} {language?.occupants}
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => setAllRoomDes({ ...allRoomDes, maximum_number_of_occupants: e.target.value })}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.maximum_number_of_occupants}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.minimum} {language?.number} {language?.of} {language?.occupants}
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => setAllRoomDes({ ...allRoomDes, minimum_number_of_occupants: e.target.value })}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.minimum_number_of_occupants}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.minimum} {language?.age} {language?.of} {language?.occupants}
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => setAllRoomDes({ ...allRoomDes, minimum_age_of_occupants: e.target.value })}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.minimum_age_of_occupants}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password">
                          Views from Room
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                        <div className={visible === 1 ? 'block' : 'hidden'}>
                          <Multiselect
                            className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                            isObject={true}
                            options={lang?.Views}
                            onRemove={(event) => { views(event) }}
                            onSelect={(event) => { views(event) }}
                            displayValue="view"
                          />
                          <p className="text-sm text-sm text-red-700 font-light">
                            {error?.view}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.room} {language?.length}(in feet)
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => setAllRoomDes({ ...allRoomDes, room_length: e.target.value })}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.room_length}</p></div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.room} {language?.breadth}(in feet)
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => setAllRoomDes({ ...allRoomDes, room_width: e.target.value })}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.room_width}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.room} {language?.height}(in feet)
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={e => setAllRoomDes({ ...allRoomDes, room_height: e.target.value })}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.room_height}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password">
                          Room Style
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                        <div className={visible === 1 ? 'block' : 'hidden'}>
                          <select className={`shadow-sm ${color?.greybackground} capitalize border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                            onChange={
                              (e) => (
                                setAllRoomDes({ ...allRoomDes, room_style: e.target.value })
                              )
                            }
                          >
                            <option selected disabled >{language?.select}</option>
                            <option value="western">Western</option>
                            <option value="japanese">Japanese</option>
                            <option value="japanese_western">Japanese Western</option>
                          </select>
                          <p className="text-sm text-sm text-red-700 font-light">
                            {error?.room_style}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password">
                          Is Room Shared?
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                        <div className={visible === 1 ? 'block' : 'hidden'}>
                          <select className={`shadow-sm ${color?.greybackground} capitalize border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                               onChange={
                              (e) => (
                                setAllRoomDes({ ...allRoomDes, is_room_sharing: e.target.value })
                              )
                            }
                          >
                            <option selected disabled >{language?.select}</option>
                            <option value="shared" >Yes</option>
                            <option value="private">No</option>
                          </select>
                          <p className="text-sm text-sm text-red-700 font-light">
                            {error?.is_room_sharing}</p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password">
                          Is Room?
                          <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                        <div className={visible === 1 ? 'block' : 'hidden'}>
                          <select className={`shadow-sm ${color?.greybackground} capitalize border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}

                            onChange={
                              (e) => (
                                setAllRoomDes({ ...allRoomDes, is_room: e.target.value })
                              )
                            }
                          >
                            <option selected disabled >{language?.select}</option>
                            <option value="outdoor" >Indoor</option>
                            <option value="indoor">Outdoor</option>
                          </select>
                          <p className="text-sm text-sm text-red-700 font-light">
                            {error?.is_room}</p>
                        </div>
                      </div>
                    </div>

              </div>
            </div>
          </div>
        <div className="flex items-center mt-2 justify-end space-x-2 sm:space-x-3 ml-auto">
         {allRoomDes?.room_type_id === 'rt001' || allRoomDes?.room_type_id === 'rt002' || allRoomDes?.room_type_id === 'rt003'|| allRoomDes?.room_type_id === 'rt004'
           || allRoomDes?.room_type_id === 'rt005' ?
                <Button Primary={language?.Next}    onClick={(e)=>{
                     validationRoomDescription()}}/>   :   
                       <Button Primary={language?.Submit} onClick={(e)=>{
                       validationRoomDescription()}}/>}
         </div>
        </div>
       </div>
       
       {/* Room Beds */}
       <div id='1' className={disp===1?'block':'hidden'}>
       <div className="bg-white shadow rounded-lg mt-2 mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
       <div className="relative before:hidden  before:lg:block before:absolute before:w-[64%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className={`${color.crossbg} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>Room Description</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.room} {language?.services}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.room} {language?.gallery}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.room} {language?.rates}</div>
            </div>
        </div>
      <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-4">
         {language?.room}  {language?.description} 
         </h6>
         {allRoomDes?.room_type_id === 'rt001' || allRoomDes?.room_type_id === 'rt002' || allRoomDes?.room_type_id === 'rt003'|| allRoomDes?.room_type_id === 'rt004'
           || allRoomDes?.room_type_id === 'rt005' ?
           <>
           {allRoomDes?.room_type_id !== 'rt001' ?
          <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                  <Button Primary={language?.AddLOS}  onClick={addBed} />
                  </div>:<></>}
                  
           <div className="pt-2">
              <div className=" md:px-4 mx-auto w-full">
              {BedData?.map((BedData, index) => (
              <>
                <div className={BedData?.index === 0 ? "hidden":"block"}>
                        <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                          <button className={`${color?.cross} sm:inline-flex  ${color?.crossbg}
                     font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold 
                     rounded-lg text-sm px-1 py-1 text-center 
                     items-center mb-1 ml-16 ease-linear transition-all duration-150`}
                                onClick={() => removeBed(BedData?.index)} type="button" >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap" key={index}>

                            <div className="w-full lg:w-6/12 px-4">
                              <div className="relative w-full mb-3">
                                <label
                                  className={`text-sm  font-medium ${color?.text} block mb-2`}
                                  htmlFor="grid-password"
                                >
                                  Bed {language?.Length}(in cm)
                                  <span style={{ color: "#ff0000" }}>*</span>
                                </label>
                                <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                                <div className={visible === 1 ? 'block' : 'hidden'}>
                                  <input
                                    type="text"
                                    className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                    onChange={e => onChange(e, BedData?.index, 'length')}
                                  />
                                  <p className="text-sm text-sm text-red-700 font-light">
                                    {error?.[index]?.length}</p>
                                </div>
                              </div>
                            </div>

                            <div className="w-full lg:w-6/12 px-4">
                              <div className="relative w-full mb-3">
                                <label className={`text-sm font-medium ${color?.text} block mb-2`}
                                  htmlFor="grid-password">
                                  Bed Width(in cm)
                                  <span style={{ color: "#ff0000" }}>*</span>
                                </label>
                                <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                                <div className={visible === 1 ? 'block' : 'hidden'}>
                                  <input
                                    type="text"
                                    className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                    onChange={e => onChange(e, BedData?.index, 'width')}
                                  />
                                  <p className="text-sm text-sm text-red-700 font-light">
                                    {error?.[index]?.width}</p>
                                </div>
                              </div>
                            </div>

                          </div>
                        </>))}
                      <div className="flex items-center mt-2 justify-end space-x-2 sm:space-x-3 ml-auto">
                        <Button Primary={language?.Submit} onClick={() => {
                          validationBedData()
                        }} />
                      </div>

                    </div>
                  </div>
                </> : <>
                </>
              }
            </div>
          </div>

          {/* Room Services */}
          <div id='2' className={disp === 2 ? 'block' : 'hidden'}>
            <div className="bg-white shadow rounded-lg mt-2 mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
              <div className="relative before:hidden  before:lg:block before:absolute before:w-[64%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                  <div className={`lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto ${color.widget}`}> {language?.room} {language?.description}</div>
                </div>

                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary"
                  >2</button>
                  <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>
                    {language?.room} {language?.services}</div>
                </div>

                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                  <div className={`lg:w-32 font-medium ${color.crossbg} text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.room} {language?.gallery}</div>
                </div>
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                  <div className={`lg:w-32 font-medium ${color.crossbg} text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.room} {language?.rates}</div>
                </div>

              </div>
              <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-8">
                {language?.room} {language?.services}
              </h6>
              <div className="flex flex-col my-4">
                <div className="overflow-x-auto">
                  <div className="align-middle inline-block min-w-full">
                    <div className="shadow overflow-hidden">
                      <table className="table-fixed min-w-full divide-y mx-8 divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th
                              scope="col"
                              className="py-4 px-2 text-left text-xs font-semibold text-gray-500 uppercase"
                            >
                              {language?.service} {language?.name}
                            </th>
                            <th
                              scope="col"
                              className="py-4 px-2 text-left text-xs font-semibold text-gray-500 uppercase"
                            >
                              {language?.service} {language?.edit}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {services?.map((item, idx) => (
                            <tr className="hover:bg-gray-100" key={idx}>
                              <td className="py-4 py-2 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                                <span className="py-4 px-2 whitespace-nowrap text-base font-medium capitalize text-gray-900">
                                  {"  " +
                                    item?.service_name?.replace(/_+/g, " ")}
                                </span>
                              </td>

                              <td className="px-2 py-4 whitespace-nowrap text-base font-normal text-gray-900">
                                <div className="flex">
                                  <div className="form-check ml-4 form-check-inline">

                                    <label htmlFor={"default-toggle" + idx} className="inline-flex relative items-center cursor-pointer">
                                      {item?.service_value}
                                      <input type="checkbox" value={item?.service_value}
                                        onChange={() => {
                                          setServices(services?.map((i) => {

                                            if (i?.service_id === item?.service_id) {
                                              i.service_value = !i.service_value

                                            }
                                            return i
                                          }))
                                        }}
                                        id={"default-toggle" + idx} className="sr-only peer" />
                                      <div
                                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                                 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                                 peer-checked:after:translate-x-full 
                                 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>

                                    </label>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-4 justify-end space-x-2 sm:space-x-3 ml-auto">
                <Button Primary={language?.Submit} onClick={() => { submitServices() }} />
              </div>
            </div>

          </div>

          {/* Room Gallery */}
          <div id='3' className={disp === 3 ? 'block' : 'hidden'}>
            <div className={`${color?.whitebackground} shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4`}>
              <div className="relative before:hidden  before:lg:block before:absolute before:w-[64%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                  <div className={`lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto ${color.widget}`}> {language?.room} {language?.description}</div>
                </div>

                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                  >2</button>
                  <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>
                    {language?.room} {language?.services}</div>
                </div>

                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary"
                  >3</button>
                  <div className={`lg:w-32 font-medium ${color.crossbg} text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.room} {language?.gallery}</div>
                </div>
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                  <div className={`lg:w-32 font-medium ${color.crossbg} text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.room} {language?.rates}</div>
                </div>

              </div>
              <div className="mx-4">
                <div className="sm:flex">
                  <h6 className={`${color?.text} text-base  flex leading-none  pt-2 font-semibold `}>
                    Room Gallery
                  </h6> <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                  </div>
                  {/* <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Add} onClick={addPhotos} />
                  </div> */}
                </div>
              </div>

              <div className="pt-6">
                <div className=" md:px-2 mx-auto w-full">
                  <div>
                    {imageData?.map((imageData, index) => (
                      <> 
                      {/* <button
                        className="float-right my-8 sm:inline-flex  text-gray-800  
        font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
        rounded-lg text-sm px-1 py-1 text-center 
        items-center mb-1 ml-16 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => removeImage(imageData?.index)}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                        </path></svg>
                      </button> */}
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <label
                                className="text-sm font-medium text-gray-900 block mb-2"
                                htmlFor="grid-password"
                              >
                                {language?.imageupload}
                              </label>
                              <div className="flex">
                                <input
                                  type="file" name="myImage" accept="image/png, image/gif, image/jpeg, image/jpg"
                                  onChange={e => {
                                    onChangePhoto(e, imageData?.index, 'imageFile')
                                  }}
                                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full py-2 px-2.5"
                                  defaultValue="" />
                                 
                              </div>
                              <div className="col-span-6 mt-2 sm:col-span-3">
                              <p className="text-sm text-sm text-red-700 font-light">
                                {error?.[index]?.image_link}</p>
                                <Button Primary={language?.Upload} onClick={() => uploadImage(imageData?.index)} /></div>
                            </div>
                            <img className="py-2" src={imageData?.image_link} alt='ImagePreview' style={{ height: "80px", width: "600px" }} />
                            <div className="col-span-6 sm:col-span-3">
                              <label
                                className="text-sm font-medium text-gray-900 block mb-2"
                                htmlFor="grid-password"
                              >
                                {language?.image} {language?.titl}
                              </label>
                              <input
                                type="text"
                                onChange={e => onChangeImage(e, imageData?.index, 'image_title')}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                placeholder="Image Title" />
                              <p className="text-sm text-sm text-red-700 font-light">
                                {error?.[index]?.image_title}</p>
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                              <label
                                className="text-sm font-medium text-gray-900 block mb-2"
                                htmlFor="grid-password"
                              >
                                {language?.image} {language?.description}
                              </label>
                              <textarea rows="2" columns="60"
                                onChange={e => onChangeImage(e, imageData?.index, 'image_description')}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                defaultValue="" />
                               <p className="text-sm text-sm text-red-700 font-light">
                                {error?.[index]?.image_description}</p>
                            
                            </div>

                          </div>
                        </div></>
                    ))}
                    <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                      <Button Primary={language?.Submit} onClick={submitRoomImages} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Rates */}
          <div id='4' className={disp === 4 ? 'block' : 'hidden'}>
            <div className={`${color?.whitebackground} mt-4 shadow rounded-lg p-4 sm:p-6 xl:p-8`}>
              <div className="relative before:hidden  before:lg:block before:absolute before:w-[64%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                  <div className={`lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto ${color.widget}`}> {language?.room} {language?.description}</div>
                </div>

                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400"
                  >2</button>
                  <div className={`${color.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>
                    {language?.room} {language?.services}</div>
                </div>

                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                  <div className={`lg:w-32 font-medium ${color.crossbg} text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.room} {language?.gallery}</div>
                </div>
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                  <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary"
                  >4</button>
                  <div className={`lg:w-32 font-medium ${color.crossbg} text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.room} {language?.rates}</div>
                </div>

              </div>
              <h6 className={`${color?.text} text-base  flex leading-none  pt-2 font-semibold`}>
                {language?.room} {language?.rates}
              </h6>
              <div className="pt-6">
                <div className=" md:px-2 mx-auto w-full">
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.currency}
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAllRoomRates({ ...allRoomRates, currency: e.target.value })
                            )
                          }>
                          <option selected disabled>{language?.select}</option>
                          {lang?.CurrencyData?.map(i => {
                            return (

                              <option key={i.currency_code} value={i.currency_code}>{i?.currency_name}</option>)
                          }
                          )}
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.currency}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.baserate} {language?.amount}
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAllRoomRates({ ...allRoomRates, baserate_amount: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.baserate_amount}</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.taxrate} {language?.amount}
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAllRoomRates({ ...allRoomRates, tax_amount: e.target.value, un_rate_id: allRoomDetails?.unconditional_rates?.[0]?.un_rate_id })
                            )
                          } />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.tax_amount}</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                          {language?.other} {language?.charges} {language?.amount}
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAllRoomRates({ ...allRoomRates, otherfees_amount: e.target.value })
                            )
                          } />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.otherfees_amount}</p>
                      </div>

                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                      <Button Primary={language?.Submit} onClick={validationRates} />
                    </div>
                  </div>
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

      <Footer Primary={english?.Side1} color={color} />

    </>
  )
}

export default Addroom
Addroom.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )


}

