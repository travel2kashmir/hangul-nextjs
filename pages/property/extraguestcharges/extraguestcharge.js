import React, { useState, useEffect } from 'react'
import validateExtraGuestEdit from '../../../components/Validation/ExtraGuestCharges/editextraguest';
import DarkModeLogic from "../../../components/darkmodelogic";
import Lineloader from '../../../components/loaders/lineloader';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import lang from '../../../components/GlobalData'
import axios from 'axios';
import Link from "next/link";
import Router from 'next/router'
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Table from '../../../components/Table';
import Button from "../../../components/Button";
import Footer from '../../../components/Footer';
import Headloader from '../../../components/loaders/headloader';
var language;
var currentProperty;
var currentLogged;
var days_of_week = [];
var keys = [];
var currentPackage;
var i = 0;
var currentExtraGuest;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");

function ExtraGuestCharge() {
  const [visible, setVisible] = useState(0);
  const [gen, setGen] = useState([])
  const [disp, setDisp] = useState(0);
  const [view, setView] = useState(0);
  const [viewEdit, setViewEdit] = useState(0);
  const [extraGuestCharges, setExtraGuestCharges] = useState([])
  const [extraGuestChild, setExtraGuestChild] = useState([])
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})
  const [error, setError] = useState({})
  const [flag, setFlag] = useState([])

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
        currentExtraGuest = localStorage.getItem("extraGuestId")

      }
    }
    firstfun();
    Router.push("./extraguestcharge");
  }, [])

  useEffect(() => {
    setColor(DarkModeLogic(darkModeSwitcher))
  }, [darkModeSwitcher])


  useEffect(() => {
    const fetchExtraGuestCharge = async () => {
      var genData = [];
      try {
        const url = `/api/ari/extra_guest_charges/${currentProperty?.property_id}/${currentExtraGuest}`
        const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
        setExtraGuestCharges(response.data)

        {
          response.data?.children_charges?.map((item) => {
            if((item?.amount !== undefined) || (item?.amount !== "")){
            var temp = {
              name: item.max_age,
              id: item.extra_guest_id,
              charge_type: "flat",
              amount: item?.amount,
              status: item?.exclude_from_capacity,
            } 

            }
            if((item?.discount_amount !== undefined) || (item?.discount_amount !== "")){
              var temp = {
                name: item.max_age,
                id: item.extra_guest_id,
                charge_type: "discount",
                amount: item?.discount_amount,
                count_as_base_occupant:item?.count_as_base_occupant,
                status: item?.exclude_from_capacity,
              } 
  
              }
              if((item?.percentage !== undefined) || (item?.percentage !== "")){
                var temp = {
                  name: item.max_age,
                  id: item.extra_guest_id,
                  charge_type: "percentage",
                  amount: item?.percentage,
                  count_as_base_occupant:item?.count_as_base_occupant,
                  status: item?.exclude_from_capacity,
                } 
    
                }
            genData.push(temp)
          })
          setGen(genData);
          setVisible(1);

        }
      }
      catch (error) {
        if (error.response) {
        }
        else {
        }
      }

    }


    fetchExtraGuestCharge();
  }, [])

  const submitAdultCharges = () => {
    const final_data =
    {
      "extra_guest_charges": [{
        "extra_guest_id": currentExtraGuest,
        "adult_charges": extraGuestCharges?.adult_charges,
        "status": extraGuestCharges?.status,
      }]
    }
    alert(JSON.stringify(final_data))
    const url = '/api/ari/extra_guest_charges'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Adult charges success", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFlag([])

      })
      .catch((error) => {
        toast.error("Adult Charges error", {
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

  const validationExtraGuestCharges = () => {

    var result = validateExtraGuestEdit(extraGuestCharges)
    if (result === true) {
      submitAdultCharges();
    }
    else {
      setError(result)
    }
  }

  const addChildGuest = () => {
    setView(1);
  }

  /* Delete Package Function*/
  const deleteChildGuests = (props) => {
    const url = `/api/ari/extra_guest_charges/${props}`
    axios.delete(url).then((response) => {
      toast.success(("Extra guest charge Deleted Successfully!"), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetchPackages();
      fetchExtraGuestCharges();
      Router.push("./extraguestcharges");
    })
      .catch((error) => {
        toast.error(("Extra guest charges Delete Error!"), {
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

  /**Function to save Current property to be viewed to Local Storage**/
  const currentChildGuest = (props) => {
    alert(JSON.stringify(props))
    setExtraGuestChild(props)
    setViewEdit(1);
  };

  // Add Extra Guest Child
  const submitExtraGuestChildAdd = () => {
    let data = [];
    if (extraGuestChild.charge_type === 'amount') {
      data = {
        "extra_guest_id": currentExtraGuest,
        "max_age": extraGuestChild?.max_age,
        "amount": extraGuestChild?.amount,
        "exclude_from_capacity": extraGuestChild?.exclude_from_capacity

      }
    }
    else if (extraGuestChild.charge_type === 'discount_amount') {
      data = {
        "extra_guest_id": currentExtraGuest,
        "max_age": extraGuestChild?.max_age,
        "discount_amount": extraGuestChild?.amount,
        "exclude_from_capacity": extraGuestChild?.exclude_from_capacity,
        "count_as_base_occupant": extraGuestChild?.count_as_base_occupant,
      }

    }
    else if (extraGuestChild.charge_type === 'percentage') {
      data = {
        "extra_guest_id": currentExtraGuest,
        "max_age": extraGuestChild?.max_age,
        "percentage": extraGuestChild?.amount,
        "exclude_from_capacity": extraGuestChild?.exclude_from_capacity,
        "count_as_base_occupant": extraGuestChild?.count_as_base_occupant,
      }
    }
    const final_data = { "extra_guest_child_link": [data] }
    const url = '/api/ari/extra_guest_charges/extra_guest_child_link'
    axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Extra guest child link success", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setView(0);
        setExtraGuestChild([]);
      })
      .catch((error) => {
        toast.error("Extra guest child link error", {
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
      <Header color={color} Primary={english.Side1} />

      <Sidebar color={color} Primary={english.Side1} />
      <div id="main-content"
        className={`${color?.greybackground} px-4 pt-24 relative overflow-y-auto lg:ml-64`}>
        {/* Navbar */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "../landing"}
                  className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                </Link></div>
            </li>
            <li>
              <div className="flex items-center">
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../propertysummary" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{currentProperty?.property_name} </a>
                  </Link>
                  </div></div>

              </div>
            </li>
            <li>
              <div className="flex items-center">
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../extraguestcharges" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a> {language?.ExtraGuestCols?.name}</a>
                  </Link>
                  </div></div>

              </div>
            </li>
            <li>
              <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.extraguestcharge}</span>
                </div>
              </div>
            </li>
          </ol>
        </nav>

        {/* Promotion */}
        <div id='0' className={disp === 0 ? 'block' : 'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[40%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`} >{language?.adult} {language?.charges}</div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color?.widget} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.childguestcharge}</div>
              </div>
            </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
              {language?.extraguestcharge}
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
                        {language?.adult} {language?.charges}
                        <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          defaultValue={extraGuestCharges?.adult_charges}
                          onChange={
                            (e) => (
                              setExtraGuestCharges({ ...extraGuestCharges, adult_charges: e.target.value }, setFlag(1))
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.adult_charges}</p></div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-20">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.Status}
                        <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <div className="flex my-4">
                          <div className="form-check form-check-inline">

                            <label htmlFor={`default`} className="inline-flex relative items-center cursor-pointer">
                              <input type="checkbox" checked={extraGuestCharges?.status === "true"} value={extraGuestCharges?.status}
                                onChange={(e) => (setExtraGuestCharges({ ...extraGuestCharges, status: !extraGuestCharges.status }, setFlag(1)))}
                                id={`default`} className="sr-only peer" />
                              <div
                                className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                               dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                               peer-checked:after:translate-x-full 
                               peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                               after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                after:transition-all dark:border-gray-600 peer-checked:bg-blue-600`}></div>
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>


                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Update} onClick={() => { if (flag.length !== 0) { validationExtraGuestCharges() } }} />
                    <Button Primary={language?.Next} onClick={() => { setDisp(1) }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id='1' className={disp === 1 ? 'block' : 'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[40%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">
                  1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`} >{language?.adult} {language?.charges}</div>
              </div>
              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className={`${color?.widget} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.childguestcharge}</div>
              </div>
            </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
               {language?.childguestcharge}
            </h6>
            <Table
              gen={gen}
              setGen={setGen}
              add={addChildGuest}
              edit={currentChildGuest}
              delete={deleteChildGuests}
              common={language?.common}
              color={color}
              cols={language?.ExtraGuestCols}
              name="Packages" />
          </div>
        </div>

      </div>
      {/* Modal Add */}
      <div className={view === 1 ? "block" : "hidden"}>
        <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
          <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
            <div className={`bg-white rounded-lg shadow relative`}>
              <div className="flex items-start justify-between p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold">{language?.add} {language?.extrachildguest}</h3>
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('addcontactform').reset();
                    setView(0);
                  }}
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
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.child}  {language?.age}
                      </label>
                      <input
                        type="number" min={1}
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={
                          (e) => (
                            setExtraGuestChild({ ...extraGuestChild, max_age: e.target.value }, setFlag(1))
                          )
                        }
                      />
                      <p className="text-sm text-sm text-red-700 font-light">
                        {error?.max_age}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.excludefromcapacity}
                      </label>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={
                          (e) => (
                            setExtraGuestChild({ ...extraGuestChild, exclude_from_capacity: e.target.value }, setFlag(1))
                          )
                        } >
                        <option selected>{language?.select}</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>

                      </select>
                      <p className="text-sm text-sm text-red-700 font-light">
                        {error?.exclude_from_capacity}</p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.chargetype}
                      </label>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={
                          (e) => (
                            setExtraGuestChild({ ...extraGuestChild, charge_type: e.target.value }, setFlag(1))
                          )
                        }
                      >
                        <option selected>{language?.select}</option>
                        <option value="amount">Flat</option>
                        <option value="discount_amount">Discount</option>
                        <option value="percentage">Percentage</option>
                      </select>
                      <p className="text-sm text-sm text-red-700 font-light">
                        {error?.charge_type}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.charges} {JSON.stringify(extraGuestChild)}
                      </label>
                      <input
                        type="text"
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={
                          (e) => (
                            setExtraGuestChild({ ...extraGuestChild, amount: e.target.value }, setFlag(1))
                          )
                        }
                      />
                      <p className="text-sm text-sm text-red-700 font-light">
                        {error?.amount}</p>

                    </div>
                    {extraGuestChild?.charge_type !== "amount" ?
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className={`text-sm font-medium text-gray-900 block mb-2`}
                        >
                          {language?.countbasecomponent}
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}

                          onChange={
                            (e) => (
                              setExtraGuestChild({ ...extraGuestChild, count_as_base_occupant: e.target.value }, setFlag(1))
                            )
                          } />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.count_as_base_occupant}</p>

                      </div> : <></>}
                  </div>
                </div>
              </form>

              <div className="items-center p-6 border-t border-gray-200 rounded-b">
                <Button Primary={language?.Add} onClick={submitExtraGuestChildAdd} />


              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Edit */}
         <div className={viewEdit === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className={`bg-white rounded-lg shadow relative`}>
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">{language?.Edit} {language?.new} {language?.extrachildcharge}</h3>
                  <button
                    type="button"
                    onClick={() =>{
                      setViewEdit(0)
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
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.child}  {language?.age}
                      </label>
                      <input
                        type="number" min={1}
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        defaultValue={extraGuestChild?.max_age}
                        onChange={
                          (e) => (
                            setExtraGuestChild({ ...extraGuestChild, max_age: e.target.value }, setFlag(1))
                          )
                        }
                      />
                      <p className="text-sm text-sm text-red-700 font-light">
                        {error?.max_age}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.excludefromcapacity}
                      </label>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={
                          (e) => (
                            setExtraGuestChild({ ...extraGuestChild, exclude_from_capacity: e.target.value }, setFlag(1))
                          )
                        } >
                        <option selected disabled> {extraGuestChild?.exclude_from_capacity}</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>

                      </select>
                      <p className="text-sm text-sm text-red-700 font-light">
                        {error?.exclude_from_capacity}</p>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.chargetype}
                      </label>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={
                          (e) => (
                            setExtraGuestChild({ ...extraGuestChild, charge_type: e.target.value }, setFlag(1))
                          )
                        }
                      >
                        <option selected disabled >{language?.select}</option>
                        <option value="amount">Flat</option>
                        <option value="discount_amount">Discount</option>
                        <option value="percentage">Percentage</option>
                      </select>
                      <p className="text-sm text-sm text-red-700 font-light">
                        {error?.charge_type}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.charges} {JSON.stringify(extraGuestChild)}
                      </label>
                      <input
                        type="text"
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                       
                       defaultValue={extraGuestCharges?.amount}
                        onChange={
                          (e) => (
                            setExtraGuestChild({ ...extraGuestChild, amount: e.target.value }, setFlag(1))
                          )
                        }
                      />
                      <p className="text-sm text-sm text-red-700 font-light">
                        {error?.amount}</p>

                    </div>
                    {extraGuestChild?.charge_type !== "amount" ?
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last-name"
                          className={`text-sm font-medium text-gray-900 block mb-2`}
                        >
                          {language?.countbasecomponent}
                        </label>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                             defaultValue={extraGuestChild?.count_as_base_occupant}
                          onChange={
                            (e) => (
                              setExtraGuestChild({ ...extraGuestChild, count_as_base_occupant: e.target.value }, setFlag(1))
                            )
                          } />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.count_as_base_occupant}</p>

                      </div> : <></>}
                  </div>
                </div>
                </form>

                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                     
                   
                      <Button Primary={language?.Edit}  />
                   
                    
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
      <Footer color={color} />
    </>
  )
}

export default ExtraGuestCharge