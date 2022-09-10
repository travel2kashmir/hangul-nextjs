import React, { useState, useEffect } from "react";
import objChecker from "lodash"
import axios from 'axios';
import Link from "next/link";
import Headloader from "../../components/loaders/headloader";
import Reviewloader from "../../components/loaders/reviewloader";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Footer from '../../components/Footer';
import Loader from "../../components/loader";
import Button from "../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validateReview from '../../components/Validation/review'
var currentLogged;
var language;
var currentProperty;
import Router from 'next/router'
const logger = require("../../services/logger");

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [visible, setVisible] = useState(0);
  const [view, setView] = useState(0);
  const [del, setDel] = useState('');
  const [modelDel, setModelDel] = useState(0)
  const [error, setError] = useState({})
  const [edit, setEdit] = useState(0)
  const [active, setActive] = useState({})
  const [org, setOrg] = useState({})
  const delConfirm = () => {
    var url = `/api/${del}`;
    axios.delete(`${url}`).then((response) => {
      fetchReviews();
      toast.success("API: Review Deleted Sucessfully.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setModelDel(0)
    }).catch((error) => {
      toast.error("API: Review Delete Error!", {
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
        /** Current Property Details fetched from the local storage **/
        currentProperty = JSON.parse(localStorage.getItem("property"));
        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      }
    }
    firstfun();
    Router.push("./reviews");
  }, [])

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const url = `/api/${currentProperty.address_province.replace(
      /\s+/g,
      "-"
    )}/${currentProperty.address_city}/${currentProperty.property_category
      }s/${currentProperty.property_id}`;
    axios.get(url)
      .then((response) => {
        setReviews(response.data);
        logger.info("url  to fetch property details hitted successfully")
        setVisible(1);
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });
  }

  //functions to add review
  const reviewTemplate = {
    property_id: currentProperty?.property_id,
    review_link: '',
    review_title: '',
    review_author: '',
    review_rating: '',
    review_type: '',
    service_date: '',
    review_date: '',
    review_content: ''
  }
  const [review, setReview] = useState([reviewTemplate]?.map((i, id) => { return { ...i, index: id } }))

  const addReview = () => {
    setReview([...review, reviewTemplate]?.map((i, id) => { return { ...i, index: id } }))
  }
  function handleSubmit(e, index) {
    e.preventDefault()
    const reviewdata = review?.map((i => {
      return {
        property_id: currentProperty?.property_id,
        review_link: i.review_link,
        review_title: i.review_title,
        review_author: i.review_author,
        review_rating: i.review_rating,
        review_type: i.review_type,
        service_date: i.service_date,
        review_date: i.review_date,
        review_content: i.review_content
      }
    }))
    const validationResponse = validateReview(reviewdata);
    if (validationResponse === true) {
      const finalData = { reviews: reviewdata }
      console.log(JSON.stringify(finalData), 'finaldata')
      axios.post(`/api/review`, finalData,
        {
          headers: { 'content-type': 'application/json' }
        }).then(response => {
          console.log(response)
          fetchReviews();
          toast.success("API: Review Saved Sucessfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setView(0);
        })
        .catch(error => {
          console.log(JSON.stringify(error))
          toast.error("API: Review Add Error!", {
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
      setError(validationResponse)
    }
  }
  const onChange = (e, index, i) => {
    console.log(index, 'index')
    setReview(review?.map((item, id) => {
      if (item.index === index) {
        item[i] = e.target.value
      }
      return item
    }))
  }
  const removeReview = (index) => {
    console.log("index is" + index)
    const filteredReviews = review.filter((i, id) => i.index !== index)
    console.log("data sent to state " + JSON.stringify(filteredReviews))
    setReview(filteredReviews)
  }

  const handleEdit = () => {

    if (objChecker.isEqual(active, org)) {
      toast.warn('No changes in review! ', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else {
      const edited = [active]
      var res = validateReview(edited)
      console.log("validation res is " + res)
      if (res === true) {
        axios.put('/api/review', active, {
          headers: { 'content-type': 'application/json' }
        }).then(response => {
          console.log(response)
          fetchReviews();
          toast.success("API: Review Edited Sucessfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setActive({});
          setEdit(0);

        })
          .catch(error => {

            toast.error("API: Review Edit Error!", {
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
        setError(res)
      }
    }
  }

  return (
    <>
      <Header Primary={english?.Side} />
      <Sidebar Primary={english?.Side} />
      <div id="main-content"
        className="bg-gray-50 pt-24 relative overflow-y-auto lg:ml-64">
        {/* Navbar */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <svg
                className="w-5 h-5 mr-2.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>
                    <Link href="./propertysummary" >
                      <a>  {reviews?.property_name}</a>
                    </Link></div></span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span
                  className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  "
                  aria-current="page"
                >
                  {language?.reviews}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/* Header */}

        <div className="flex justify-between">
          <h1 className=" text-xl sm:text-2xl mx-2 font-semibold mb-2 text-gray-900">{language?.reviews} </h1>
          <div className="mx-8"> {currentLogged?.id.match(/admin.[0-9]*/) ? <Button Primary={language?.Add} onClick={(e) => { setView(1) }} /> : <></>}</div>
        </div>

        {/* Form Property Reviews */}

        {JSON.stringify(active)}
        <div>
          {reviews?.Reviews?.map((item, idx) => (
            <div className="bg-white shadow rounded-lg mx-4 mb-4 px-8 sm:p-6 xl:p-8  2xl:col-span-2" key={idx}>
              <div className="pt-2">
                <div className=" md:px-4 mx-auto w-full ">
                  <div className="border-b-2 py-8 border-cyan-600">

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xl sm:text-xl leading-none font-bold text-gray-900">{item?.review_author}
                          {/*Edit icon */}<button
                            onClick={() => { setActive(item); setOrg(item); setEdit(1); }}
                            className={currentLogged.id.match(/admin.[0-9]*/) ? `text-gray-500   ml-4 mr-2 hover:text-gray-900 
                                         cursor-pointer hover:bg-gray-100 rounded `: 'hidden'}>
                            <svg className=" h-5  w-5 font-semibold "
                              fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                          </button>
                          <button
                            onClick={() => { setDel(item?.review_id); setModelDel(1); }} className={currentLogged.id.match(/admin.[0-9]*/) ? `text-gray-500   ml-4 mr-2 hover:text-gray-900 
                                                cursor-pointer hover:bg-gray-100 rounded `: 'hidden'}>
                            <svg className="  w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                          </button>
                        </span>
                        <h3 className="text-base font-normal text-gray-500">{item?.review_date}</h3>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-end flex-1 mr-10 text-cyan-600 text-lg font-bold">
                          {[...Array(item?.review_rating)].map((elementInArray, index) => (
                            <div key={index}>
                              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-4 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                              </svg>
                            </div>
                          )
                          )
                          }
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 ">
                      {item?.review_content}
                    </p>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*model del */}
      <div className={modelDel === 1 ? 'block' : 'hidden'}>
        <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
          <div className="relative w-full max-w-md px-4 h-full md:h-auto">
            <div className="bg-white rounded-lg shadow relative">
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setModelDel(0)}
                  type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="delete-user-modal">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>

              <div className="p-6 pt-0 text-center">
                <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-base font-normal text-gray-500 mt-5 mb-6">
                  {language?.areyousureyouwanttodelete}
                </h3>
                <Button Primary={language?.Delete} onClick={() => delConfirm()} />
                <Button Primary={language?.Cancel} onClick={() => setModelDel(0)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add */}
      <div className={view === 1 ? "block" : "hidden"}>
        <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
          <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
            <div className="bg-white rounded-lg shadow relative m-4 px-4 py-6">
              <div className="flex items-start justify-between p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold">
                  {language?.addreview}
                </h3>
                <button type="button"
                  onClick={() => { setActive({}); setView(0); setError({}) }}
                  className="text-gray-400 bg-transparent
                                 hover:bg-gray-200 
                                 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              {
                review?.map((review, index) =>
                (<div key={review?.index} className='mt-4'>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.reviewlink}   <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={e => onChange(e, review?.index, 'review_link')}
                          placeholder="link of review" />
                        <p className=" peer-invalid:visible text-red-700 font-light">
                          {error?.review_link}
                        </p>

                      </div>

                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.reviewtitle}   <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={e => onChange(e, review?.index, 'review_title')}
                          placeholder="Review title"
                        />
                        <p className="peer-invalid:visible text-red-700 font-light">
                          {error?.review_title}
                        </p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.reviewauthor}   <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={e => onChange(e, review?.index, 'review_author')}
                          placeholder="Review Author"
                        />
                        <p className=" peer-invalid:visible text-red-700 font-light">
                          {error?.review_author}
                        </p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.reviewrating} <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={e => onChange(e, review?.index, 'review_rating')}
                          placeholder="Ratings"
                        />
                        <p className="peer-invalid:visible text-red-700 font-light">
                          {error?.review_rating}
                        </p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.reviewercategory}
                        </label>
                        <select
                          onChange={e => onChange(e, review?.index, 'review_type')}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                          <option selected>Select Reviewer Category</option>
                          <option value="user" >User</option>
                          <option value="editorial">Editorial</option>
                        </select>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.servicedate}
                        </label>
                        <input
                          type="date"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={e => onChange(e, review?.index, 'service_date')}
                        />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.reviewdate}<span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <input
                          type="date"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={e => onChange(e, review?.index, 'review_date')}
                        />
                        <p className="peer-invalid:visible text-red-700 font-light">
                          {error?.review_date}
                        </p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.reviewcontent}  <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <textarea rows="3" columns="60"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          onChange={e => onChange(e, review?.index, 'review_content')}
                        />
                        <p className="peer-invalid:visible text-red-700 font-light">
                          {error?.review_content}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/*commented might need them latter <div className="text-center flex justify-end">
           
           
            <button   
             className=" text-white bg-cyan-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" type="button"
             onClick={() => removeReview(review?.index)}
            >
              -Remove Review
            </button>
          </div>*/}
                </div>)
                )}

              <div className="text-center flex justify-end" style={{ marginTop: "10px" }}>

                {/*commented might need them latter <button
             className="
              text-white bg-cyan-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" type="button"
             onClick={addReview}
            >
              +Add Review
          </button>*/ }


                <Button Primary={language?.Submit} onClick={(e) => handleSubmit(e)} />

              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Modal Edit */}
      <div className={edit === 1 ? "block" : "hidden"}>
        <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
          <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
            <div className="bg-white rounded-lg shadow relative m-4 px-4 py-6">
              <div className="flex items-start justify-between p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold">
                  {language?.editreview}
                </h3>
                <button type="button"
                  onClick={() => { setEdit(0); setError({}); }}
                  className="text-gray-400 bg-transparent
                                 hover:bg-gray-200 
                                 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                </button>
              </div>
              <div className='mt-4'>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.reviewlink}  <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        onChange={e => setActive({ ...active, review_link: e.target.value })}
                        defaultValue={active?.review_link || ''} />
                      <p className=" peer-invalid:visible text-red-700 font-light">
                        {error?.review_link}
                      </p>

                    </div>

                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.reviewtitle}  <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        onChange={e => setActive({ ...active, review_title: e.target.value })}
                        defaultValue={active?.review_title || ''}
                      />
                      <p className="peer-invalid:visible text-red-700 font-light">
                        {error?.review_title}
                      </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.reviewauthor}  <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        onChange={e => setActive({ ...active, review_author: e.target.value })}
                        defaultValue={active?.review_author || ''}
                      />
                      <p className=" peer-invalid:visible text-red-700 font-light">
                        {error?.review_author}
                      </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.reviewrating}  <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        onChange={e => setActive({ ...active, review_rating: e.target.value })}
                        defaultValue={active?.review_rating || ''}
                      />
                      <p className="peer-invalid:visible text-red-700 font-light">
                        {error?.review_rating}
                      </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.reviewercategory}
                      </label>
                      <select
                        onChange={e => setActive({ ...active, review_type: e.target.value })}
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                        <option selected>{active?.review_type || 'select'}</option>
                        <option value="user" >User</option>
                        <option value="editorial">Editorial</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.servicedate}
                      </label>
                      <input
                        type="date"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        onChange={e => setActive({ ...active, service_date: e.target.value })}
                        defaultValue={active?.service_date || ''}
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.reviewdate} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <input
                        type="date"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        onChange={e => setActive({ ...active, review_date: e.target.value })}
                        defaultValue={active?.service_date || ''}
                      />
                      <p className="peer-invalid:visible text-red-700 font-light">
                        {error?.review_date}
                      </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.reviewcontent} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <textarea rows="3" columns="60"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        onChange={e => setActive({ ...active, review_content: e.target.value })}
                        defaultValue={active?.review_content || ''}
                      />
                      <p className="peer-invalid:visible text-red-700 font-light">
                        {error?.review_content}
                      </p>
                    </div>
                  </div>
                </div>

              </div>


              <div className="text-center flex justify-end" style={{ marginTop: "10px" }}>

                <Button Primary={language?.EditReview} onClick={(e) => handleEdit(e)} />

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
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
    </>)
}
export default Reviews
Reviews.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}