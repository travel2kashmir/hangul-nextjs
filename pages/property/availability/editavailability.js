import React, { useState, useEffect } from 'react'
import objChecker from "lodash";
import Table from '../../../components/Table';
import LoaderTable from '../loaderTable'
import DarkModeLogic from "../../../components/darkmodelogic";
import Lineloader from '../../../components/loaders/lineloader';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import Multiselect from 'multiselect-react-dropdown';
import validateAvailability from '../../../components/Validation/availability/availability';
import validateRestriction from '../../../components/Validation/availability/restriction';
import validateLOS from '../../../components/Validation/availability/los';
import lang from '../../../components/GlobalData'
import axios from 'axios';
import Link from "next/link";
import Router from 'next/router'
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Button from "../../../components/Button";
import Footer from '../../../components/Footer';
import Headloader from '../../../components/loaders/headloader';
import Textboxloader from '../../../components/loaders/textboxloader';
var language;
var currentProperty;
var currentLogged;
var days_of_week;
var keys = [];
var currentPackage;
var availabilityId;
var genData = [];
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");

function AddAvailability() {
  const [visible, setVisible] = useState(0);
  const [availability, setAvailability] = useState([])
  const [avl, setAvl] = useState([])
  const [orgAvl, setOrgAvl] = useState([])
  const [los, setLos] = useState([])
  const [orgLos, setOrgLos] = useState([])
  const [losLen, setLosLen] = useState(0);
  const [res, setRes] = useState([])
  const [resLen, setResLen] = useState(0)
  const [orgRes, setOrgRes] = useState([]);
  const [disp, setDisp] = useState(0);
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})
  const [error, setError] = useState({})
  const [selecteddays, setSelectedDays] = useState([])
  const [gen, setGen] = useState([])
  const [viewEdit, setViewEdit] = useState(0)
  const [view, setView] = useState(0)
  const [spinner, setSpinner] = useState(0)

  /** Fetching language from the local storage **/
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
        availabilityId = localStorage.getItem('availabilityId');
        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
        fetchAvailability();

      }
    }
    firstfun();
    Router.push("./editavailability");
  }, [])
  const createDays = (days) => {
    var day = [];
    for (let item in days) {
      if (days[item] !== '-') {
        switch (item) {
          case '0': day.push({ day: "mon" });
            break;
          case '1': day.push({ day: "tue" })
            break;
          case '2': day.push({ day: "weds" })
            break;
          case '3': day.push({ day: "thurs" })
            break;
          case '4': day.push({ day: "fri" })
            break;
          case '5': day.push({ day: "sat" })
            break;
          case '6': day.push({ day: "sun" })
            break;
          default:
        }
      }

    }
    setSelectedDays(day)
  }
  function fetchAvailability() {
    const url = `/api/ari/property_availability/${currentProperty?.property_id}/${availabilityId}`;
    axios.get(url).then((response) => {
      setAvailability(response.data)
      var temp = {
        "start_date": response.data.start_date,
        "end_date": response.data.end_date,
        "days_of_week": response.data.days_of_week,
        "room_id": response.data.room_id,
        "package_id": response.data.package_id
      }
      setAvl(temp);
      setOrgAvl(temp);
      createDays(response.data.days_of_week);
      console.log(response?.data?.length_of_stay)
      setLosLen(response?.data?.length_of_stay?.length)
      setRes(response?.data?.restrictions?.[0]);
      setResLen(response?.data?.restrictions?.length)
      setOrgRes(response?.data?.restrictions?.[0])
      response?.data?.length_of_stay?.map((item) => {
        var temp = {
          name: item.min_max_msg,
          max_age: item.min_max_msg,
          id: item.avl_los_id,
          status: true
        }
        genData.push(temp)
      })
      setGen(genData);
      setVisible(1);
    })


  }
  useEffect(() => {
    setColor(DarkModeLogic(darkModeSwitcher))
  }, [darkModeSwitcher])

  // Availability
  const submitAvailability = () => {
    const final_data = {
      "availability": {
        "property_id": currentProperty?.property_id,
        "availability_id": availability.availability_id,
        "package_id": currentPackage,
        "start_date": avl?.start_date,
        "end_date": avl?.end_date,
        "days_of_week": days_of_week
      }
    }
    const url = '/api/ari/property_availability/property_availability';
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Availability Edit success", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setError([])
        setOrgAvl(avl)
        setSpinner(0);
      })
      .catch((error) => {
        toast.error("Availability error", {
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

  // Restriction
  const data = () => {
    const final_data = {
      "availability_res": [{
        "availability_id": availabilityId,
        "restriction_status": res?.restriction_status,
        "restriction_type": res?.restriction_type,
        "min_advance_booking": res?.min_advance_booking,
        "max_advance_booking": res?.max_advance_booking,
        "avl_res_id": res?.avl_res_id
      }]
    }
    if (resLen === 1) {
      const url = '/api/ari/property_availability/property_availability_restrictions'
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Restriction Update success", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setOrgRes(res);
          setError([]);
          setSpinner(0)
        })
        .catch((error) => {
          toast.error("Restriction error", {
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
      const url = '/api/ari/property_availability/property_availability_restrictions'
      axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Restriction Added success", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setOrgRes(res);
          setError([]);
          setSpinner(0);
          setDisp(2);
        })
        .catch((error) => {
          toast.error("Restriction error", {
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

  //Edit los
  const submitEditLOS = () => {
    const data =
    {
      "availability_id": availability?.availability_id,
      "unit_of_time": "Days",
      "time": los?.time,
      "min_max_msg": los?.min_max_msg,
      "pattern": los?.time,
      "fixed_pattern": los?.fixed_pattern,
      "avl_los_id": los?.avl_los_id
    }
    const final_data = { "LOS": data }
    const url = '/api/ari/property_availability/property_availability_los'
    if (losLen != 0 && losLen != undefined) {
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("LOS Edit success", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          try {
            var temp = [{
              name: los.min_max_msg,
              max_age: los.min_max_msg,
              id: los.avl_los_id,
              status: true
            }]
            var filtered_data = gen.filter((i) => i.id != los.avl_los_id)
            var fitered_los = availability?.length_of_stay.filter(i => i.avl_los_id != los.avl_los_id)
            var filtered_los_final = fitered_los.concat([los])
            console.log('final los' + JSON.stringify(filtered_los_final));
            setGen(filtered_data.concat(temp));
            setAvailability({ ...availability, length_of_stay: filtered_los_final })
            setError({});
            document.getElementById('editLOSform').reset();
            fetchAvailability();
            setViewEdit(0);
          } catch (error) {

          }
        })
        .catch((error) => {
          toast.error("LOS error", {
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
      axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("LOS Edit success", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          var temp = [{
            name: los.min_max_msg,
            max_age: los.min_max_msg,
            id: los.avl_los_id,
            status: true
          }]
          var filtered_data = gen.filter((i) => i.id != los.avl_los_id)
          setGen(filtered_data.concat(temp));
          keys = [];
          setError({});
          document.getElementById('editLOSform').reset();
          setSpinner(0);
          setViewEdit(0);
        })
        .catch((error) => {
          toast.error("LOS error", {
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

  //los
  const submitLOS = () => {
    const data =
    {
      "availability_id": availability?.availability_id,
      "unit_of_time": "Days",
      "time": los?.time,
      "min_max_msg": los?.min_max_msg,
      "pattern": los?.time,
      "fixed_pattern": los?.fixed_pattern,

    }
    const final_data = { "LOS": data }
    const url = '/api/ari/property_availability/property_availability_los'
    axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        console.log(JSON.stringify(response?.data))
        toast.success("LOS Add successful", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        try {

          var temp = [{
            name: los.min_max_msg,
            max_age: los.min_max_msg,
            id: response?.data?.los_avl_id,
            status: true
          }]
          //create object to be put in avlablity
          var for_avl = [{
            "availability": availability?.availability_id,
            "avl_los_id": response?.data?.los_avl_id,
            "time": los.time,
            "unit_of_time": "Days",
            "min_max_msg": los.min_max_msg,
            "pattern": los.pattern,
            "fixed_pattern": los.fixed_pattern
          }]
          //make length of stay a single object
          var avl_los = availability.length_of_stay.concat(for_avl);
          //put object in state
          setAvailability({ ...availability, length_of_stay: avl_los })
          var filtered_data = gen.filter((i) => i.id != los.avl_los_id)
          setGen(filtered_data.concat(temp));
          setError({});
          setLos([]);
          document.getElementById('addlosform').reset();
          setSpinner(0);
          setView(0);
        } catch (error) {
          console.log(error)
        }

      })
      .catch((error) => {
        toast.error("LOS Add error", {
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


  //delete los
  const losDelete = (props) => {
    const url = `/api/ari/property_availability/property_availability_los/${props}`;
    axios
      .delete(url)
      .then((response) => {
        toast.success("API: Property Availability Los delete Success!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const temp = gen.filter(i => i.id != props)
        setGen(temp);

      })
      .catch((error) => {
        toast.error("API: Availability LOS delete error!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  // Days
  const days = (days) => {
    var days_present = ['-', '-', '-', '-', '-', '-', '-'];
    days.map(day => {

      if (day.day === 'mon') {
        days_present[0] = 'm'
      }
      else if (day.day === 'tue') {
        days_present[1] = 't'
      }
      else if (day.day === 'weds') {
        days_present[2] = 'w'
      }
      else if (day.day === 'thur') {
        days_present[3] = 't'
      }
      else if (day.day === 'fri') {
        days_present[4] = 'f'
      }
      else if (day.day === 'sat') {
        days_present[5] = 's'
      }
      else if (day.day === 'sun') {
        days_present[6] = 's'
      }
    })
    days_of_week = days_present.toString().replaceAll(',', '');
  }
  // Validate Availability
  const validationAvailability = () => {
    if (objChecker.isEqual(avl, orgAvl)) {

      toast.warn('APP: No change in Availability. ', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

      });
      setSpinner(0);
    }
    else {
      var result = validateAvailability(avl, days_of_week)
      if (result === true) {
        submitAvailability();
      }
      else {
        setError(result)
        setSpinner(0);
      }
    }

  }
  // Validate Restriction
  const validationRestriction = () => {
    if (objChecker.isEqual(res, orgRes)) {
      toast.warn('APP: No change in Restrictions. ', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

      });
      setSpinner(0);
    }
    else {
      var result = validateRestriction(res)
      if (result === true) {
        data();
      }
      else {
        setError(result)
        setSpinner(0);
      }
    }

  }
  // Validation LOS
  const validationLOS = () => {
    if (objChecker.isEqual(los, orgLos)) {
      toast.warn('APP: No change in Length of stay. ', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

      });
      setSpinner(0);
    }
    else {
      var data = [los]
      var result = validateLOS(data)
      if (result === true) {
        submitEditLOS();
      }
      else {
        setError(result[0])
        setSpinner(0);
      }
    }
  }

  //validation post los
  const validationPostLOS = () => {
    var data = [los]
    var result = validateLOS(data)
    if (result === true) {
      submitLOS();
    }
    else {
      setError(result[0])
      setSpinner(0);
    }
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
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"}
                  className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                </Link></div>
            </li>
            <li>
              <div className="flex items-center">
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
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
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../availability" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a> {language?.availability}</a>
                  </Link>
                  </div></div>

              </div>
            </li>
            <li>
              <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.edit} {language?.availability}</span>
                </div>
              </div>
            </li>
          </ol>
        </nav>
        {/* Availability */}
        <div id='0' className={disp === 0 ? 'block' : 'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[55%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`} >{language?.availability}</div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color?.widget} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.restriction}</div>
              </div>

              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.lengthofstay}</div>
              </div>



            </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
              {language?.availability}
            </h6>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.days}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <Multiselect
                          className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                          isObject={true}
                          options={lang?.DaysData}
                          onRemove={(event) => { days(event) }}
                          onSelect={(event) => { days(event) }}
                          selectedValues={selecteddays}
                          displayValue="day"

                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.days}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.startdate}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="date"
                          defaultValue={avl?.start_date}
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAvl({ ...avl, start_date: e.target.value })
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
                        {language?.enddate}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="date"
                          defaultValue={avl?.end_date}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setAvl({ ...avl, end_date: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.end_date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-24">

                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-24">

                    </div>
                  </div>


                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <div className={spinner === 1 ? 'block' : 'hidden'}>
                      <Button Primary={language?.SpinnerUpdate} />
                    </div>
                    <div className={spinner === 0 ? 'block' : 'hidden'}>
                      <Button Primary={language?.Update} onClick={() => { setSpinner(1); validationAvailability(); }} />
                    </div>
                    <Button Primary={language?.Next} onClick={() => setDisp(1)} />
                  </div>


                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restriction */}
        <div id='1' className={disp === 1 ? 'block' : 'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[55%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.availability}</div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.restriction}</div>
              </div>
              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.lengthofstay}</div>
              </div>


            </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
              {language?.restriction}
            </h6>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.restriction} {language?.Status}<span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setRes({ ...res, restriction_status: e.target.value })
                            )
                          }>
                          <option selected >{res?.restriction_status === true ? "Active" : "Inactive"} </option>
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.restriction_status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.restriction} {language?.type} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setRes({ ...res, restriction_type: e.target.value })
                            )}>
                          <option selected >{res?.restriction_type} </option>
                          <option value="arrival" >Arrival- (It prevents itineraries with a check-in date during the Start and End date range).</option>
                          <option value="departure">Departure-  (It prevents itineraries with a check-out date during the Start and End date range).</option>
                          <option value="master">Master- (It indicates whether the room rate is available for booking on the date).</option>
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.minadvbooking} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="number" min={1}
                          defaultValue={res?.min_advance_booking}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setRes({ ...res, min_advance_booking: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.min_advance_booking}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.maxadvbooking} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="number" min={1}
                          defaultValue={res?.max_advance_booking}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setRes({ ...res, max_advance_booking: e.target.value })
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.max_advance_booking}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-4">

                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-4">

                    </div>
                  </div>


                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Previous} onClick={() => setDisp(0)} />
                    <div className={spinner === 1 ? 'block' : 'hidden'}>
                      <Button Primary={language?.SpinnerUpdate} />
                    </div>
                    <div className={spinner === 0 ? 'block' : 'hidden'}>
                      <Button Primary={resLen === 1 ? language?.Update : language?.Submit} onClick={() => { setSpinner(1); validationRestriction() }} />
                    </div>

                    <Button Primary={language?.Next} onClick={() => setDisp(2)} />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOS */}
        <div id='2' className={disp === 2 ? 'block' : 'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[55%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.availability}</div>
              </div>

              <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.restriction}</div>
              </div>
              <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.lengthofstay}</div>
              </div>
            </div>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className={visible === 0 ? 'block' : 'hidden'}><LoaderTable /></div>
                <div className={visible === 1 ? 'block' : 'hidden'}>
                  <Table
                    gen={gen}
                    setGen={setGen}
                    add={() => setView(1)}
                    edit={(props) => {
                      var temp = availability?.length_of_stay.filter(i => i.avl_los_id === props.id)
                      setLos(temp[0])
                      setOrgLos(temp[0])
                      setViewEdit(1);
                    }}
                    delete={losDelete}
                    common={language?.common}
                    color={color}
                    cols={language?.ResCols}
                    name="Packages"
                    mark="ExtraChild" />
                </div>

                <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                  <Button Primary={language?.Previous} onClick={() => setDisp(1)} />
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
                  <h3 className="text-xl font-semibold"> {language?.length_of_stay}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setError({});
                      document.getElementById('editLOSform').reset();
                      setViewEdit(0);

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
                <form id='editLOSform'>
                  <>

                    <div className="flex flex-wrap" key={0}>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                            htmlFor="grid-password"
                          >
                            {language?.minmaxmessage}<span style={{ color: "#ff0000" }}>*</span>
                          </label>
                          <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                          <div className={visible === 1 ? 'block' : 'hidden'}>
                            <select className={`shadow-sm ${color?.greybackground} ${color?.text} uppercase border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                              onChange={
                                (e) => {
                                  setLos({ ...los, min_max_msg: e.target.value })
                                  // e.target.value === 'FullPatternLOS' ? keys.push(index) : "";
                                }
                              }>
                              <option selected>{los?.min_max_msg} </option>
                              <option value="SetMaxLOS">Max LOS</option>
                              <option value="SetMinLOS">Min LOS</option>
                              <option value="SetForwardMaxStay">Forward Max Stay</option>
                              <option value="SetForwardMinStay">Forward Min Stay</option>
                              <option value="FullPatternLOS">Full Pattern LOS</option>
                            </select>
                            <p className="text-sm text-sm text-red-700 font-light">
                              {error?.min_max_msg}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label className={`text-sm font-medium ${color?.text} block mb-2`}
                            htmlFor="grid-password">
                            {language?.numberofdays}<span style={{ color: "#ff0000" }}>*</span>
                          </label>
                          <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                          <div className={visible === 1 ? 'block' : 'hidden'}>
                            <input
                              type="text"
                              defaultValue={los?.time}
                              className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                              onChange={
                                (e) => {
                                  setLos({ ...los, time: e.target.value, pattern: e.target.value });
                                  //setLos({ ...los, pattern: e.target.value });
                                }
                              }
                            />
                            <p className="text-sm text-sm text-red-700 font-light">
                              {error?.time}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        {los?.min_max_msg === "FullPatternLOS" ?
                          <div className="relative w-full mb-3">
                            <label className={`text-sm font-medium ${color?.text} block mb-2`}
                              htmlFor="grid-password">
                              {language?.pattern}<span style={{ color: "#ff0000" }}>*</span>
                            </label>
                            <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                            <div className={visible === 1 ? 'block' : 'hidden'}>
                              <input
                                type="text"
                                defaultValue={los?.fixed_pattern}
                                className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                onChange={
                                  (e) => (
                                    setLos({ ...los, fixed_pattern: e.target.value })
                                  )
                                }
                              />
                              <p className="text-sm text-sm text-red-700 font-light">
                                {error?.fixed_pattern}</p>
                              <span className='text-orange-500 text-xs'>
                                {language?.patterndes}</span>

                            </div>

                          </div> : <></>}



                      </div>
                    </div>
                  </>
                </form>
                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                  <Button Primary={language?.Update} onClick={() => validationLOS()} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Add */}
        <div className={view === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className={`bg-white rounded-lg shadow relative`}>
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold"> {language?.length_of_stay}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('addlosform').reset();
                      setError({});
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
                <form id='addlosform' className='mt-2'>
                  <>
                    <div className="flex flex-wrap" key={0}>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                            htmlFor="grid-password"
                          >
                            {language?.minmaxmessage}<span style={{ color: "#ff0000" }}>*</span>
                          </label>
                          <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                          <div className={visible === 1 ? 'block' : 'hidden'}>
                            <select className={`shadow-sm ${color?.greybackground} ${color?.text} uppercase border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                              onChange={
                                (e) => {
                                  setLos({ ...los, min_max_msg: e.target.value })
                                  // e.target.value === 'FullPatternLOS' ? keys.push(index) : "";
                                }
                              }>
                              <option selected>Select </option>
                              <option value="SetMaxLOS">Max LOS</option>
                              <option value="SetMinLOS">Min LOS</option>
                              <option value="SetForwardMaxStay">Forward Max Stay</option>
                              <option value="SetForwardMinStay">Forward Min Stay</option>
                              <option value="FullPatternLOS">Full Pattern LOS</option>
                            </select>
                            <p className="text-sm text-sm text-red-700 font-light">
                              {error?.min_max_msg}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label className={`text-sm font-medium ${color?.text} block mb-2`}
                            htmlFor="grid-password">
                            {language?.numberofdays}<span style={{ color: "#ff0000" }}>*</span>
                          </label>
                          <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                          <div className={visible === 1 ? 'block' : 'hidden'}>
                            <input
                              type="text"
                              placeholder="Enter number of days"
                              className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                              onChange={
                                (e) => {
                                  setLos({ ...los, time: e.target.value });

                                }
                              }
                            />
                            <p className="text-sm text-sm text-red-700 font-light">
                              {error?.time}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        {los?.min_max_msg === "FullPatternLOS" ?
                          <div className="relative w-full mb-3">
                            <label className={`text-sm font-medium ${color?.text} block mb-2`}
                              htmlFor="grid-password">
                              {language?.pattern}<span style={{ color: "#ff0000" }}>*</span>
                            </label>
                            <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                            <div className={visible === 1 ? 'block' : 'hidden'}>
                              <input
                                type="text"
                                placeholder="Enter pattern"
                                className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                                onChange={
                                  (e) => {
                                    setLos({ ...los, fixed_pattern: e.target.value, pattern: los?.time })

                                  }
                                }
                              />
                              <p className="text-sm text-sm text-red-700 font-light">
                                {error?.fixed_pattern}</p>
                              <span className='text-orange-500 text-xs'>
                                {language?.patterndes}</span>

                            </div>

                          </div> : <></>}
                      </div>
                    </div>
                  </>
                </form>

                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                  <Button Primary={language?.Add} onClick={validationPostLOS} />
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
      <Footer color={color} />
    </>
  )
}

export default AddAvailability
AddAvailability.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )


}