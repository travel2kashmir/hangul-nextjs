import React from 'react'
import objChecker from "lodash";
import DarkModeLogic from "../../components/darkmodelogic";
import { useState, useEffect } from "react";
import axios from 'axios';
import Sidebar  from "../../components/Sidebar";
import Header  from "../../components/Header";
import Button from "../../components/Button";
import Link from "next/link";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Footer from '../../components/Footer';
import Loader from "../../components/loaders/imageloader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Headloader from '../../components/loaders/headloader';
import Textboxloader from '../../components/loaders/textboxloader';
const logger = require("../../services/logger");
var language;
var currentProperty;
var currentLogged;
import Router from 'next/router'


function Gallery() {
    const [visible,setVisible]=useState(0)
    const [darkModeSwitcher, setDarkModeSwitcher] = useState()
    const [color, setColor] = useState({})
    const [allHotelDetails, setAllHotelDetails] = useState([])
    const [spinner, setSpinner] = useState(0)
    const [spin, setSpin] = useState(0)
    const [gallery, setGallery] = useState([])
    const [image, setImage] = useState({})
    const [editImage, setEditImage] = useState(0)
    const [deleteImage, setdeleteImage] = useState(0)
    const [actionImage, setActionImage] = useState({})
    const [updateImage, setUpdateImage] = useState({})
    const [flag, setFlag] = useState([])
    const [addImage, setAddImage] = useState(0)
    const [enlargeImage, setEnlargeImage] = useState(0)
    const [actionEnlargeImage, setActionEnlargeImage] = useState({})

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
        Router.push("./gallery");
    }, [])

    /* Function call to fetch Current Property Details when page loads */
    const fetchHotelDetails = async () => {
        const url = `/api/${currentProperty.address_province.replace(
            /\s+/g,
            "-"
        )}/${currentProperty.address_city}/${currentProperty.property_category
            }s/${currentProperty.property_id}`;
        axios.get(url)
            .then((response) => {
                setGallery(response.data);
                logger.info("url  to fetch property details hitted successfully")
                setVisible(1)
            })
            .catch((error) => { logger.error("url to fetch property details, failed") });
    }  

    useEffect(() => {
        fetchHotelDetails();
    }, []);

    useEffect(()=>{ 
        setColor(DarkModeLogic(darkModeSwitcher))
       },[darkModeSwitcher])

    const onChangePhoto = (e, i) => {
        setImage({ ...image, imageFile: e.target.files[0] })
    }
    
    /* Function to upload image*/
    const uploadImage = () => {
        setSpin(1);
        const imageDetails = image.imageFile
        const formData = new FormData();
        formData.append("file", imageDetails);
        formData.append("upload_preset", "Travel2Kashmir")

        axios.post("https://api.cloudinary.com/v1_1/dvczoayyw/image/upload", formData)
            .then(response => {
                setImage({ ...image, image_link: response?.data?.secure_url })
                setSpin(0);
            })
            .catch(error => {
                setSpin(0)
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
        if (flag === 1) {
        if (actionImage.length !== 0) {
            setSpinner(1)
            const imagedata = [{
                property_id: currentProperty?.property_id,
                image_link: image.image_link,
                image_title: actionImage.image_title,
                image_descripiton: actionImage.image_description,
                image_category: "outside"
            }]
            const finalImage = { "images": imagedata }
            axios.post(`/api/gallery`, finalImage).then(response => {
                setSpinner(0)
                toast.success("Image Added Successfully!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
                );
               
                fetchHotelDetails();
                document.getElementById('addgallery').reset()
                Router.push("./gallery");
                setAddImage(0)
         }).catch(error => {
                setSpinner(0)
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
    }

    /* Function to edit images*/
    const updateImageDetails = () => {
        if (flag === 1) {
            if(objChecker.isEqual(actionImage,updateImage)){
                toast.warn('No change in Image Details detected. ', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                    setAllHotelDetails([])
                    
            }
            else{
            setSpinner(1)
            const final_data = {
                "image_id": actionImage?.image_id,
                "image_title": actionImage.image_title,
                "image_description": actionImage.image_description,
                "image_type": actionImage.image_type
            }
            const url = '/api/images'
            axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
                ((response) => {
                    setSpinner(0);
                    setEditImage(0);
                    toast.success("Gallery Updated Successfully!", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    document.getElementById('editImage').reset();
                    fetchHotelDetails();
                    setAllHotelDetails([])
                    setActionImage({})
                    Router.push("./gallery");
                })
                .catch((error) => {
                    setSpinner(0)
                    toast.error("Gallery Update Error! ", {
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
    }

    /* Function to delete images*/
    const submitDelete = () => {
        setSpinner(1)
        const url = `/api/${actionImage.image_id}`
        axios.delete(url).then
            ((response) => {
                setSpinner(0)
                setdeleteImage(0)
                toast.success("Image Deleted Successfully", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                fetchHotelDetails();
                Router.push("./gallery");

            })
            .catch((error) => {
                setSpinner(0);
                toast.error("Gallery Delete Error!", {
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
     <Header color={color} Primary={english.Side}/>
     <Sidebar  color={color} Primary={english.Side}/>
        <div id="main-content"
            className={`${color?.greybackground} px-4 pt-24 py-2 relative overflow-y-auto lg:ml-64`}>
            {/* Navbar */}
            <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
              <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} 
                className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                </Link></div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.text} capitalize text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="./propertysummary" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{currentProperty?.property_name}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.textgray} capitalize text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.gallery}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>

            {/* Header */}
            <div className={`${color?.whitebackground} shadow rounded-lg  px-12 p-6  -mb-4 sm:p-6 xl:p-8  2xl:col-span-2`} >
                <h6 className={`text-xl mb-2 flex leading-none pl-4 pt-2 font-bold ${color?.text}`}>
                    {language?.gallery}
                </h6>
                <div className="sm:flex">
                    <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 ml-5 sm:mb-0">
                        <form className="lg:pr-3" action="#" method="GET">
                            <label htmlFor="users-search" className="sr-only">{language?.search}</label>
                            <div className="mt-1 relative lg:w-64 xl:w-96">
                                <input type="text" name="email" id="users-search" className={`${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`} placeholder={language?.searchforimages}>
                                </input>
                            </div>
                        </form>
                        <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                            <a href="#" className={`${color?.textgray} hover:${color?.text} cursor-pointer p-1 ${color?.hover} rounded inline-flex justify-center`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                            </a>
                            <a href="#" className={`${color?.textgray} hover:${color?.text} cursor-pointer p-1 ${color?.hover} rounded inline-flex justify-center`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            </a>
                            <a href="#" className={`${color?.textgray} hover:${color?.text} cursor-pointer p-1 ${color?.hover} rounded inline-flex justify-center`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            </a>
                            <a href="#" className={`${color?.textgray} hover:${color?.text} cursor-pointer p-1 ${color?.hover} rounded inline-flex justify-center`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                        <Button Primary={language?.Add} onClick={() => setAddImage(1)} />
                        <a href="#" className={`w-1/2 ${color?.text} ${color?.whitebackground} border border-gray-300  ${color?.hover}  focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto`}>
                            <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
                            Import
                        </a>
                    </div>
                </div>
                {/* Gallery Form */}
                <div className={visible===0?'block w-auto px-4 h-auto m-6 flex':'hidden'}>
                    <Loader/><Loader/><Loader/></div> 
               <div className={visible===1?'block':'hidden'}>
                <div className="flex-wrap container grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery?.images?.map((item, idx) => {
                        return (
                            <div className="block text-blueGray-600 text-xs  mt-6 font-bold " key={idx} >
                                <button onClick={() => { setEnlargeImage(1); setActionEnlargeImage(item) }}>
                                     <img src={item.image_link} alt='pic_room' style={{ height: "250px", width: "450px" }} />
                                </button>
                                <table>
                                    <tr className="pt-1">
                                        <td >
                                            <span className={`pl-1 ${color?.text} text-sm`}>{item?.image_title}</span>

                                        </td>
                                        <td className="flex justify-end">
                                            <button
                                                onClick={() => { setEditImage(1); setActionImage(item);setUpdateImage(item) }}
                                                className={`text-gray-500   hover:${color?.text}
                                         cursor-pointer ${color?.hover} rounded`}>
                                                <svg className=" h-5  w-5 font-semibold "
                                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                                            </button>
                                            <button
                                                onClick={() => { setdeleteImage(1); setActionImage(item) }} className={`text-gray-500   hover:${color?.text}
                                                cursor-pointer ${color?.hover} rounded`}>
                                                <svg className="  w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        )
                    }
                    )
                    }

                </div>
                </div>
            </div>
            {/* Modal Image Enlarge */}
            <div className={enlargeImage === 1 ? 'block' : 'hidden'}>
                <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl sm:inset-0 bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                    <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
                        <div className={` ${color.tableheader} rounded-lg shadow relative`}>
                            <div className="flex justify-between p-5 border-b rounded-t">
                                <h3 className={`text-xl ${color?.text} font-semibold`}>
                                    {actionEnlargeImage.image_title}
                                </h3>
                                <button type="button"
                                    onClick={() => setEnlargeImage(0)}
                                    className={`text-gray-400 bg-transparent  ${color.sidebar} hover:${color?.text} rounded-lg text-sm
                                     p-1.5 ml-auto inline-flex items-center`} data-modal-toggle="user-modal">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button> </div>
                            <div> <img src={actionEnlargeImage.image_link} alt='pic_room' style={{ height: "350px", width: "650px" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal edit */}
            <div className={editImage === 1 ? 'block' : 'hidden'}>
                <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                    <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
                        <div className={`${color?.whitebackground} rounded-lg shadow relative`}>
                            <div className="flex items-start justify-between p-5 border-b rounded-t">
                                <h3 className={`${color?.text} text-xl font-semibold`}>
                                    {language?.edit} {language?.image} 
                                  
                                </h3>
                                <button type="button"
                                    onClick={() => {
                                        document.getElementById('editImage').reset();
                                        setEditImage(0);}}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="user-modal">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                            <form id='editImage'>
                                  <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <img src={actionImage?.image_link} alt='property_image' height={"200"} width={"400"} />
                                    </div> <div className="col-span-6 sm:col-span-3">
                                        <label
                                            className={`text-sm ${color?.text} font-medium  block mb-2`}
                                            htmlFor="grid-password"
                                        >
                                            {language?.image} {language?.description}
                                        </label>
                                        <textarea rows="6" columns="60"

                                            className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg 
                                            focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                            onChange={
                                                (e) => (
                                                    setActionImage({
                                                        ...actionImage,
                                                        image_description: e.target.value
                                                    },setFlag(1))
                                                )
                                            }
                                            defaultValue={actionImage?.image_description}
                                        />
                                    </div> <div className="col-span-6 sm:col-span-3">
                                        <label
                                            className={`text-sm ${color?.text} font-medium  block mb-2`}
                                            htmlFor="grid-password"
                                        >
                                            {language?.image} {language?.titl}
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={actionImage?.image_title}
                                            onChange={
                                                (e) => (
                                                    setActionImage({
                                                        ...actionImage,
                                                        image_title: e.target.value
                                                    },setFlag(1))
                                                )
                                            }
                                            className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                            placeholder="Image Title" />
                                    </div>

                                </div>
                                </form>
                            </div>
                            <div className="items-center p-6 border-t border-gray-200 rounded-b">
                            <div className={flag !== 1 && spinner === 0? 'block' : 'hidden'}>
                      <Button Primary={language?.UpdateDisabled}  /></div>
                    <div className={spinner === 0 && flag === 1 ? 'block' : 'hidden'}>
                      <Button Primary={language?.Update} onClick={updateImageDetails} />
                     </div>
                     <div className={spinner === 1 && flag === 1? 'block' : 'hidden'}>
                   <Button Primary={language?.SpinnerUpdate} />
                            </div>
                            
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Add */}
            <div className={addImage === 1 ? 'block' : 'hidden'}>
                <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                    <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
                        <div className={`${color?.whitebackground} rounded-lg shadow relative`}>
                            <div className="flex items-start justify-between p-5 border-b rounded-t">
                                <h3 className={`${color?.text} text-xl font-semibold`}>
                                    {language?.addnewimage}
                                </h3>
                                <button type="button"
                                    onClick={() =>{
                                        document.getElementById('addgallery').reset()
                                        setAddImage(0);
                                    } }
                                    className="text-gray-400 bg-transparent
                                 hover:bg-gray-200 
                                 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                                <form id='addgallery'>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            className={`text-sm ${color?.text} font-medium  block mb-2`}
                                            htmlFor="grid-password"
                                        >
                                            {language?.imageupload}
                                        </label>
                                        <div className="flex">
                                            <input
                                                type="file" name="myImage" accept="image/png, image/gif, image/jpeg, image/jpg"
                                                onChange={e => {
                                                    onChangePhoto(e, 'imageFile');

                                                }}
                                                className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg 
                                                focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                              defaultValue="" />

                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            {spin === 0 ?
                                            <Button Primary={language?.Upload} onClick={uploadImage} />:
                                            <Button Primary={language?.SpinnerUpload} />
                                                    }</div>
                                    </div>
                                    <img className={`py-2 ${color?.text}`} src={image.image_link} alt='ImagePreview' style={{ height: "80px", width: "600px" }} />
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            className={`text-sm ${color?.text} font-medium  block mb-2`}
                                            htmlFor="grid-password"
                                        >
                                            {language?.image} {language?.titl}
                                        </label>
                                        <input
                                            type="text"
                                            onChange={(e) => (setActionImage({ ...actionImage, image_title: e.target.value },setFlag(1)))}
                                            className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg 
                                            focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}placeholder="Image Title" />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label
                                            className={`text-sm ${color?.text} font-medium  block mb-2`}
                                            htmlFor="grid-password"
                                        >
                                            {language?.image} {language?.description}
                                        </label>
                                        <textarea rows="2" columns="60"
                                            onChange={(e) => (setActionImage({ ...actionImage, image_description: e.target.value },setFlag(1)))}
                                            className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg 
                                            focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                            defaultValue="" />
                                    </div>

                                </div>
                            </div>
                            </form>
                            <div className="items-center p-6 border-t border-gray-200 rounded-b">
                     <div className={flag !== 1 && spinner === 0? 'block' : 'hidden'}>
                      <Button Primary={language?.AddDisabled}  /></div>
                    <div className={spinner === 0 && flag === 1 ? 'block' : 'hidden'}>
                      <Button Primary={language?.Add} onClick={() => { submitAddImage();}} />
                     </div>
                     <div className={spinner === 1 && flag === 1? 'block' : 'hidden'}>
                   <Button Primary={language?.SpinnerAdd} />
                       </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Delete */}
            <div className={deleteImage === 1 ? 'block' : 'hidden'}>
                <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                    <div className="relative w-full max-w-md px-4 h-full md:h-auto">
                        <div className={`rounded-lg shadow relative ${color?.whitebackground}`}>
                            <div className="flex justify-end p-2">
                                <button
                                    onClick={() => setdeleteImage(0)}
                                    type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="delete-user-modal">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>

                            <div className="p-6 pt-0 text-center">
                                <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h3 className={`text-base font-normal ${color?.deltext} mt-5 mb-6`}>
                                    {language?.areyousureyouwanttodelete}
                                </h3>
                               
                               {spinner === 0 ?
                                <>
                                <Button Primary={language?.Delete} onClick={() => submitDelete()}/>
                                <Button Primary={language?.Cancel}   onClick={() => setdeleteImage(0)}/>
                               </>
                              :
                               <Button Primary={language?.SpinnerDelete} />}
                              
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
    <Footer  color={color} Primary={english.Side}/>  
     </>
    )
}

export default Gallery
Gallery.getLayout = function PageLayout(page) {
    return (
      <>
        {page}
      </>
    )
  }
  