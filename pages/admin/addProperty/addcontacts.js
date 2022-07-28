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

function Addcontacts() {
  const conTemp = {
    contact_type: '',
    contact_data: '',
    property_id: property_id
  }

  const [contact, setContact] = useState([conTemp]?.map((i, id) => { return { ...i, index: id } }))

  const addContact = () => {
    setContact([...contact, conTemp]?.map((i, id) => { return { ...i, index: id } }))
  }

  const onChange = (e, index, i) => {
    console.log(index, 'index')
    setContact(contact?.map((item, id) => {
      if (item.index === index) {
        item[i] = e.target.value?.toLowerCase();
      }
      return item
    }))
  }

  const removeContact = (index) => {
    console.log("index is" + index)
    const filteredContact = contact.filter((i, id) => i.index !== index)
    console.log("data sent to state " + JSON.stringify(filteredContact))
    setContact(filteredContact)
  }

  const dataValidation = ({ contactdata }) => {
    let rep = 0;
    let repeat = false;
    const phoneTypePresent = contactdata.find(i => i.contact_type === 'phone') ? true : false
    for (let key in contactdata) {
      let item = contactdata[key]
      rep = 0
      for (let innerItem in contactdata) {
        if (contactdata[innerItem].contact_type === item.contact_type) {
          rep = rep + 1;
        }
      }
      if (rep > 1) {
        repeat = true
        console.log(repeat)
      }

    }
    var check = '';
    var statement = contactdata?.map((item) => {
      if (item?.contact_data.length === 0) {
        check = `APP: ${item.contact_type.replace("_", " ")} is empty`
      }
    })

    for (let idx in contactdata) {
      var contact = contactdata[idx].contact_type;

      switch (contact) {

        case 'email':
          let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/g;
          if (!contactdata[idx].contact_data.match(regex))
            return 'APP: Enter Valid Email Address'
          break;
        case 'website':
          regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
          if (!contactdata[idx].contact_data.match(regex))
            return 'APP: Enter valid website in format of http://www.someaddress.something';
          break;

        default:
      }
    }
 if (check.length != 0)
      return check
    else if ((repeat === false) && (phoneTypePresent === true))
      return (true)
    else if ((repeat === true) && (phoneTypePresent === false))
      return ("APP: phone number absent and some Contact type being repeated")
    else if (repeat === true)
      return ("APP: Some contact type being repeated")
    else if (phoneTypePresent === false)
      return ("APP: phone number missing")
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log({ contact })
    const contactdata = contact?.map((i => {
      return {
        property_id: property_id,
        contact_type: i.contact_type,
        contact_data: i.contact_data,
        status: true
      }
    }))
    console.log(contactdata)
    let report = dataValidation({ contactdata })
    if (report === true) {
      const finalContact = { contacts: contactdata }
      console.log(JSON.stringify(finalContact) + "sent details")
      axios.post(`/api/contact`, finalContact,
        {
          headers: { 'content-type': 'application/json' }
        }).then(response => {
          console.log(response.data)
          toast.success(JSON.stringify("Contact Saved Sucessfully"), {
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
          error.message === 'Request failed with status code 500' ?
            toast.error("Server Not Responding", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
            : toast.error("Contacts Not Saved", {
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
    Router.push("./addcontacts");
  }, [])

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
                <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.addcontacts}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div>
          <h3 className="text-xl font-semibold">{language?.add}  {language?.contact}</h3>
          <div className='float-right'>
            <button
              className="bg-blue-600 text-white active:bg-blueGray-600
               font-bold uppercase text-xs px-4 py-2 rounded shadow
                hover:shadow-md outline-none focus:outline-none mr-1 mb-4 ease-linear transition-all duration-150" type="button"
              onClick={addContact}
            >
              +Add Contact {property_id}
            </button>
          </div>
        </div>
      </div> <div className=' bg-gray-50 px-2 relative overflow-y-auto lg:ml-64'>
        {contact?.map((contact, index) => (
          <div className='' key={index}>
            <button
              className="float-right my-8 sm:inline-flex  text-gray-800  
            font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
            rounded-lg text-sm px-1 py-1 text-center 
            items-center mb-1 ml-16 ease-linear transition-all duration-150"
              type="button"
              onClick={() => removeContact(contact?.index)}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
              </path></svg>
            </button>
            <div className="p-6 space-y-6" >
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    {language?.contact} {language?.type}
                  </label>
                  <select
                    onChange={e => onChange(e, contact?.index, 'contact_type')}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  >
                    <option defaultValue="">Select contact type</option>
                    <option defaultValue="phone">Phone</option>
                    <option defaultValue="email">Email</option>
                    <option defaultValue="website">Website</option>
                    <option defaultValue="toll free number">
                      Toll Free number
                    </option>
                    <option defaultValue="tdd number">TDD number</option>
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="text-sm font-medium text-gray-900 block mb-2"
                  >
                    {language?.contact} {language?.value}
                  </label>
                  <input
                    type="text"
                    name="contact_data"
                    id="contact_date"
                    onChange={e => onChange(e, contact?.index, 'contact_data')}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
            </div>
          </div>))}

        <div className="items-center p-6 border-t border-gray-200 rounded-b">
          <button
            className="float-right mt-4 bg-blue-600 text-white active:bg-blueGray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={(e) => property_id != '' ? handleSubmit(e) : toast.error("APP: Property Not Registered", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })}
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
    </>
  )
}

export default Addcontacts
