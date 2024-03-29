import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import validateContact from "../../components/Validation/contact";
import validateContactEdit from "../../components/Validation/contactedit";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import Table from "../../components/Table";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../components/Header";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import objChecker from "lodash"
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
var language;
var currentProperty;
var propertyName;
import Headloader from "../../components/loaders/headloader";
import DarkModeLogic from "../../components/darkmodelogic";
import Router from 'next/router'
import LoaderTable from "./loaderTable";
const logger = require("../../services/logger");
var currentLogged;

function Contact() {
  const [gen, setGen] = useState([]) 
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [error, setError] = useState({})
  const [color, setColor] = useState({})
  const [spinner, setSpinner] = useState(0)
  const [spin, setSpin] = useState(0)
  const [visible,setVisible]=useState(0) 
  const [deleteContact, setDeleteContact] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [view, setView] = useState(0);
  const [flag, setFlag] = useState([]);
  const [contact, setContact] = useState([]);
 
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

    Router.push("./contact");
  }, [])

  /* Function Add Contact*/
  function submitContactAdd() {
    if(flag === 1){
    setSpinner(1)
   
    if (contact.contact_type!==undefined) {
      const contactdata = [{
        property_id: currentProperty?.property_id,
        contact_type: contact?.contact_type,
        contact_data: contact?.contact_data,
        status: true
      }];
      const finalContact = { contacts: contactdata };
      axios
        .post(`/api/contact`,finalContact, {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          setSpinner(0)
          toast.success("API:Contact Added Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          document.getElementById('addcontactform').reset();
          setView(0)
          fetchHotelDetails();
          Router.push("./contact");
          setContact([]);
          setError({});
          setFlag([]);
        })
        .catch((error) => {
          setSpinner(0)
          toast.error("API:Contact Add Error!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setView(0)
          setFlag([]);
        });
    }
  }
  }

 /* Function Edit Contact*/
 const submitContactEdit = (props,noChange) => {
  if(objChecker.isEqual(props,noChange)){
    toast.warn('No change in contacts detected. ', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }
  else{
    setError({})
    var result = validateContactEdit(props)
       if(result===true)
       {
        submitContactAdd();
      
  const final_data = {
    contact_id: props.id,
    contact_data: props.type,
    status: props.status
  };
  const url = "/api/contact";
  axios
    .put(url, final_data, { header: { "content-type": "application/json" } })
    .then((response) => {
    toast.success("API:Contact Updated Successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetchHotelDetails(); 
      Router.push("./contact");
    })
    .catch((error) => {
      setSpinner(0)
      toast.error("API:Contact Update Error!", {
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
    toast.warn(result?.type, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    
   setError(result)
  }
  }
};

// Fetch Hotel Details
  const fetchHotelDetails = async () => {
    var genData = [];
    const url = `/api/${currentProperty.address_province.replace(
      /\s+/g,
      "-"
    )}/${currentProperty.address_city}/${currentProperty.property_category
      }s/${currentProperty.property_id}`;
    axios.get(url)
      .then((response) => {
        setContacts(response.data.contacts);
        propertyName=response.data.property_name;
        {
          response.data?.contacts?.map((item) => {
            var temp = {
              name: item.contact_type,
              type: item.contact_data,
              status: item.status,
              id: item.contact_id
            }
            genData.push(temp)
          })
          setGen(genData);
        }
        setVisible(1);
 })
      .catch((error) => { logger.error("url to fetch property details, failed") });


  }

  useEffect(() => {
    fetchHotelDetails();

  }, []);

  useEffect(()=>{ 
    setColor(DarkModeLogic(darkModeSwitcher))
   },[darkModeSwitcher])


   // Add Validation Contact Delete
  const submitContactDelete = (props) => {
   const url = `/api/${props}`;
    axios
      .delete(url)
      .then((response) => {
        setSpin(0);
        toast.success("API:Contact Deleted Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchHotelDetails(); 
        setDeleteContact(0)
        Router.push("./contact");
      })
      .catch((error) => {
        toast.error("API:Contact Delete Error!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setDeleteContact(0)
      });
  };

   // Add Validation Contact
   const validationContact = () => {
    setError({})
    var result = validateContact(contact)
    console.log("Result" +JSON.stringify(result))
       if(result===true)
       {
        submitContactAdd();
       }
       else
       {
        setError(result)
       }
}

  return (
    <>

     <Header  color={color} Primary={english?.Side} />
     <Sidebar color={color} Primary={english?.Side} Type={currentLogged?.user_type}/>
     
      <div
        id="main-content"
        className={`${color?.whitebackground} pt-24 relative overflow-y-auto lg:ml-64`}>
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
                <div className={`${color?.text} text-base font-medium capitalize  inline-flex items-center`}>
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
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.contact}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>
        {/* Header */}
        <div className={visible === 0 ? 'block' : 'hidden'}><LoaderTable /></div>
         <div className={visible === 1 ? 'block' : 'hidden'}>
        <Table  gen={gen} setGen={setGen} add={()=> setView(1)} edit={submitContactEdit} 
        delSpin={language?.SpinnerDelete} saveSpinner={language?.SpinnerSave} spinner={spinner}
        setSpinner={setSpinner} color={color}
        spin={spin} 
        delete={submitContactDelete} common={language?.common} cols={language?.ContactCols}
        name="Contact"/> 
        </div>

      

        {/* Modal Add */}
        <div className={view === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className={`${color?.whitebackground} rounded-lg shadow relative`}>
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className={`${color?.text} text-xl font-semibold`}>{language?.add} {language?.new} {language?.contact}</h3>
                  <button
                    type="button"
                    onClick={() =>{
                      document.getElementById('addcontactform').reset();
                      setContact([]);
                      setError({});
                      setView(0);
                    } }
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                  <form id='addcontactform'>
                <div className="p-6 space-y-6" >
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className={`text-sm ${color?.text} font-medium  block mb-2`}
                      >
                        {language?.contact} {language?.type}
                        <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <select
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            contact_type: e.target.value,
                          },setFlag(1))
                        }
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg 
                        focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                      >
                        <option selected disabled>Select contact type</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="website">Website</option>
                        <option value="toll free number">
                          Toll Free number
                        </option>
                        <option value="tdd number">TDD number</option>
                      </select>
                      <p className="text-sm text-sm text-red-700 font-light">
                          {error?.contact_type}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="last-name"
                        className={`text-sm ${color?.text} font-medium  block mb-2`}>
                        {language?.contact} {language?.value}
                        <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            contact_data: e.target.value,
                          },setFlag(1))
                        }

                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg 
                        focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        required
                      />
                      <p className="text-sm text-sm text-red-700 font-light">
                          {error?.contact_data}</p>
                    </div>
                  </div>
                </div>
                </form>

                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                      <div className={flag !== 1 && spinner === 0? 'block' : 'hidden'}>
                      <Button Primary={language?.AddDisabled}  /></div>
                    <div className={spinner === 0 && flag === 1 ? 'block' : 'hidden'}>
                      <Button Primary={language?.Add} onClick={() => { validationContact(contact) }} />
                     </div>
                     <div className={spinner === 1 && flag === 1? 'block' : 'hidden'}>
                   <Button Primary={language?.SpinnerAdd} />
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

      </div>

    </>


  );
}

export default Contact
Contact.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }

