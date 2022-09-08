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
var language;
var property_id = '';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");


function Addimages() {
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
    Router.push("./addimages");
  }, [])

const imageTemplate = {
    property_id: property_id,
    image_link: '',
    image_title: '',
    image_description: '',
    image_category: '',
    imageFile: ''
  }
  const [imageData, setImageData] = useState([imageTemplate]?.map((i, id) => { return { ...i, index: id } }))
  const validateImage = (imagedata) =>{
    let isValid = true;
    console.log(imagedata)
    isValid = imagedata.map((image)=>{
     
      for(let value in image){
       if(image[value]==="")
        {return `APP: ${value?.replace("_", " ")} is missing`}
      }
      if(image.image_title.length>50)
      {
        return `APP: Image title should be upto 50 characters only`
      }
      if(image.image_description.length>1000)
      {
        return `APP: Image description should be upto 1000 characters only`
      }
      })
    
      return isValid;
  }

  const handleSubmit = () => {
    const imagedata = imageData?.map((i => {
      return {
        property_id: property_id,
        image_link: i.image_link,
        image_title: i.image_title,
        image_descripiton: i.image_description,
        image_category: "outside"
      }
    }))
    const report = validateImage(imagedata);
    if(report === true )
    {
    const finalImage = { "images": imagedata }
   axios.post(`/api/gallery`, finalImage).then(response => {
     toast.success("API:"+JSON.stringify(response.data.message), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    }).catch(error => {
     toast.error("API:"+JSON.stringify(error.response.data), {
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
    else
    {
      toast.error(""+report, {
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

  const addPhotos = () => {
    setImageData([...imageData, imageTemplate]?.map((i, id) => { return { ...i, index: id } }))
  }

  const removeImage = (index) => {
    const filteredImages = imageData.filter((i, id) => i.index !== index)
    setImageData(filteredImages)
  }

  const onChange = (e, index, i) => {
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
        toast.error("Some thing went wrong in uploading photo\n ", {
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
  const onChangePhoto = (e, index, i) => {
    setImageData(imageData?.map((item, id) => {
      if (item.index === index) {
        item[i] = e.target.files[0]
      }
      return item
    }))
  }

 return (
    <div>
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
                <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.addimages}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div>
          <h3 className="text-xl font-semibold">{language?.addimages}</h3>
          <div className='float-right'>
            <button
              className="bg-blue-600 text-white active:bg-blueGray-600
               font-bold uppercase text-xs px-4 py-2 rounded shadow
                hover:shadow-md outline-none focus:outline-none mr-1 mb-4 ease-linear transition-all duration-150" type="button"
              onClick={addPhotos}
            >
              +Add Image
            </button>
          </div>
        </div>

      </div> <div className=' bg-gray-50 px-2 relative overflow-y-auto lg:ml-64'>
        {/* form */}

        {/* Modal Add */}
        {imageData?.map((imageData, index) => (
          <> <button
            className="float-right my-8 sm:inline-flex  text-gray-800  
        font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
        rounded-lg text-sm px-1 py-1 text-center 
        items-center mb-1 ml-16 ease-linear transition-all duration-150"
            type="button"
            onClick={() => removeImage(imageData?.index)}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
            </path></svg>
          </button>
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
                  <div className="col-span-6 sm:col-span-3">
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
                    onChange={e => onChange(e, imageData?.index, 'image_title')}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    placeholder="Image Title" />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.image} {language?.description}
                  </label>
                  <textarea rows="2" columns="60"
                    onChange={e => onChange(e, imageData?.index, 'image_description')}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue="" />
                </div>

              </div>
            </div></>
        ))}
        <div className="items-center p-6 border-t border-gray-200 rounded-b">


          <button
            className="float-right mt-4 bg-blue-600 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => {
              property_id != '' ? handleSubmit() :
              toast.error("Property Not Registered", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }}
            type="button"
          >
            Submit
          </button>

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
    </div>
  )
}

export default Addimages