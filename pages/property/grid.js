import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Button from "../../components/Button";
import { ToastContainer, toast } from "react-toastify";
import Header from "../../components/Header";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
var language;
var currentProperty;
import Router from 'next/router'
const logger = require("../../services/logger");
var low=1,high=3;


function Contact() {

  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [gen, setGen] = useState([])
  const [allHotelDetails, setAllHotelDetails] = useState([]);
  const [view, setView] = useState(0);
  const [updateContact, setUpdateContact] = useState({
    "edit": 0,
    "id": ''
  });
  const [deleteContact, setDeleteContact] = useState(0);
  const [viewDel, setViewDel] = useState(0);
  const [editContact, setEditContact] = useState({});
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState([]);
 
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


      }
    }
    firstfun();

    Router.push("./grid");
  }, [])
  /* Function Add Contact*/
  function submitContactAdd(e) {
    e.preventDefault();
    if (contact.length !== 0) {
      const contactdata = [{
        property_id: currentProperty?.property_id,
        contact_type: contact?.contact_type,
        contact_data: contact?.contact_data,
        status: true
      }];
      const finalContact = { contacts: contactdata };
      axios
        .post(`/api/contact`, JSON.stringify(finalContact), {
          headers: { "content-type": "application/json" },
        })
        .then((response) => {
          toast.success("Contact Added Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setView(0)
          fetchHotelDetails();
          Router.push("./grid");
          setContact([])
        })
        .catch((error) => {
          toast.error("Contact Add Error!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setView(0)
        });
    }
  }

  function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 1; i < tr.length; i++) {
      td = tr[i];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

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
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });


  }
  useEffect(() => {
    fetchHotelDetails();

  }, []);

  const handlecheckbox = (e) => {
    const { name, checked } = e.target;
    setViewDel(1);
    if (name === "allSelect") {
      let tempCon = gen.map((item) => {
        return {...item, isChecked: checked }
      });
      setGen(tempCon)
      console.log(contacts)
    }
    else {
      let tempCon = contacts.map((item) =>
        item.contact_id === name ? {...item, isChecked: checked } : item
      );
      setContacts(tempCon)
      console.log(contacts)
    }
  }

  const allDelete = async () => {
    console.log(contacts)
    const checked= contacts.filter(i=>i.isChecked===true).map(j=>{return(j.contact_id)})
  }

  
    const displayData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return gen.slice(start, start + itemsPerPage);
      }, [page,gen]);

  return (
    <>

      <Header Primary={english?.Side} />
      <Sidebar Primary={english?.Side} />
      <div
        id="main-content"
        className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64"
      >
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
              <Link
                href="./landing"
                className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"
              >
                <a>{language?.home}</a>
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
                  <Link href="./propertysummary">
                    <a>{contacts?.property_name}</a>
                  </Link></span>
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
                  {language?.contact}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/* Header */}
        <div className="mx-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{language?.contact}
          </h1>
          <div className="sm:flex">
            <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
              <form className="lg:pr-3" action="#" method="GET">
                <label htmlFor="users-search" className="sr-only">{language?.search}</label>
                <div className="mt-1 relative lg:w-64 xl:w-96">
                  <input type="text" name="email" id="myInput" onKeyUp={myFunction}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder={language?.search}>
                  </input>
                </div>
              </form>
              <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                </span>
                {viewDel === 1 ?
                  <button onClick={allDelete} data-tooltip="Delete" aria-label="Delete" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                  </button>
                  
                  : <></>}

                <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                </span>
                <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
              <Button Primary={language?.AddContact} onClick={() => setView(1)} />
              <span className="w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
                Import
              </span>
            </div>
          </div>
        </div>
        {/* Contact Table */}
        <div className="flex flex-col mt-8">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden">
              <table className="table data table-fixed min-w-full divide-y divide-gray-200" id="myTable">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input id="checkbox-all" aria-describedby="checkbox-1" type="checkbox"
                          name="allSelect" checked={contacts?.filter(item => item?.isChecked !== true).length < 1}
                          onChange={(e) => { handlecheckbox(e); setViewDel(1); }}
                          className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                         rounded"  />
                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                      </div>
                    </th>
                    <th scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                    <th scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200" id="TableList" >
                  {displayData?.map((item, idx) => (
                    <>
                      {updateContact?.edit === 1 && updateContact?.id === idx ?
                        <>
                          <tr className="hover:bg-gray-100">
                            <td className="p-4 w-4">
                              <span className="flex items-center">
                                <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                                <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                              </span>
                            </td>
                            <td className="data p-4 text-left text-sm font-semibold  ">
                              {item?.name}</td>
                            <td className="data p-4 text-left text-sm font-semibold  ">
                              <input type="text" className="shadow-sm bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5" defaultValue={item?.type}></input> </td>

                            <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                              <div className="flex">
                                <div className="form-check mx-2 form-check-inline">

                                  <label htmlFor={"default-toggle"} className="inline-flex relative items-center cursor-pointer">
                                    <input type="checkbox" value={item?.status} checked={item.status === true}

                                      id={"default-toggle"} className="sr-only peer" />
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
                            <td className="p-4 whitespace-nowrap space-x-2">
                              <button className="bg-gradient-to-r bg-green-600 hover:bg-green-700 text-white  sm:inline-flex  font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all duration-150" >Save</button>
                              <button className="bg-gradient-to-r bg-gray-400 hover:bg-gray-500 text-white sm:inline-flex font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all duration-150"
                                onClick={() => { setUpdateContact({ ...updateContact, edit: 0, id: '' }) }}>Cancel</button>
                            </td>
                          </tr>
                        </> :
                        <>
                          <tr>
                            <td className="p-4 w-4">
                              <span className="flex items-center">
                                <input id="checkbox-1" name={item.contact_id} checked={item.isChecked || false}
                                  onChange={(e) => { handlecheckbox(e); setViewDel(1); }}
                                  aria-describedby="checkbox-1" type="checkbox"
                                  className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4
                            w-4 rounded" />
                                <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                              </span>
                            </td>
                            <td className="data p-4 text-left text-sm font-semibold  ">
                              {item?.name}
                            </td>
                            <td className="data p-4 text-left text-sm font-semibold  ">
                              {item?.type}
                            </td>
                            {item?.status == true ?
                              <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                <span className="flex items-center">
                                  <span className="h-2.5 w-2.5 capitalize rounded-full bg-green-400 mr-2"></span>
                                  Active
                                </span>
                              </td> :
                              <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                <span className="flex items-center">
                                  <span className="h-2.5 w-2.5 capitalize rounded-full bg-red-600 mr-2"></span>
                                  Inactive
                                </span>
                              </td>}
                              <td className="p-4 whitespace-nowrap space-x-2"> 
                            <button className="bg-gradient-to-r bg-cyan-600 hover:bg-cyan-700 text-white  sm:inline-flex  
            font-semibold
           rounded-lg text-sm px-5 py-2 text-center 
           items-center ease-linear transition-all duration-150"
                             onClick={(item) => { setEditContact(item); setUpdateContact({ ...updateContact, edit: 1, id: idx }) }}>Edit</button>
                            <button className="bg-gradient-to-r bg-red-600 hover:bg-red-700 text-white  sm:inline-flex  
          font-semibold
           rounded-lg text-sm px-5 py-2 text-center 
           items-center ease-linear transition-all duration-150" >Delete</button>
</td>
                          </tr>
                        </>}
                    </>
                  ))
                  }
                </tbody>
              </table>
            </div>
          </div></div></div>

        <div className="bg-white sticky sm:flex items-center w-full sm:justify-between bottom-0 right-0 border-t border-gray-200 p-4">
          <div className="flex items-center mb-4 sm:mb-0">
            <button onClick={() =>{ 
               {
                if(low > 1)
              {setPage(page-1);
              low=low-3;
              high=high-3;
              }}}}className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            </button>
            <button  onClick={() => {
              if((low+2) < contacts.length){
              low=high+1;
              high=low+2;
              setPage(page+1);} 
              }} className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center mr-2">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
            </ button>
            <span className="text-sm font-normal text-gray-500">Showing <span className="text-gray-900 font-semibold">{low} to {high>contacts.length?contacts.length:high}</span> of <span className="text-gray-900 font-semibold">{contacts.length}</span></span>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() =>{ 
               {
                if(low > 1)
              {setPage(page-1);
              low=low-3;
              high=high-3;
              }}}} className="flex-1 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center">
          <svg className="-ml-1 mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
           Previous </button>
            <button onClick={() => {
              if((low+2) < contacts.length){
              low=high+1;
              high=low+2;
              setPage(page+1);} 
              }} className="flex-1 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center">
             Next
              <svg className="-mr-1 ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
           </button>
          </div>
        </div>


        {/* Modals Popups for Edit, Add and Delete Contact */}
        {/* Modal Edit */}
        <div className={updateContact === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className="bg-white rounded-lg shadow relative">
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">Edit contact</h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 
                            rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    onClick={() => setUpdateContact(0)}
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
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium text-gray-900 block mb-2"
                      >
                        {language?.contact} {language?.type}
                      </label>
                      <select
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            contact_type: e.target.value,
                          })
                        }
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      >
                        <option selected>{editContact?.name}</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="website">Website</option>
                        <option value="toll free number">Toll Free number</option>
                        <option value="tdd number">TDD number</option>
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
                        id="last-name"
                        defaultValue={editContact?.type}
                        onChange={(e) =>
                          setAllHotelDetails({
                            ...allHotelDetails,
                            contact_data: e.target.value,
                          })
                        }
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                  <Button Primary={language?.Update} onClick={() => {
                    submitContactEdit(editContact?.id)
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Add */}
        <div className={view === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className="bg-white rounded-lg shadow relative">
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">{language?.add} {language?.new} {language?.contact}</h3>
                  <button
                    type="button"
                    onClick={() => setView(0)}
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
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            contact_type: e.target.value,
                          })
                        }
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      >
                        <option selected>Select contact type</option>
                        <option value="phone">Phone</option>
                        <option value="email">Email</option>
                        <option value="website">Website</option>
                        <option value="toll free number">
                          Toll Free number
                        </option>
                        <option value="tdd number">TDD number</option>
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
                        name="last-name"
                        id="last-name"
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            contact_data: e.target.value,
                          })
                        }

                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                  <Button Primary={language?.Add} onClick={(e) => { submitContactAdd(e) }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Delete */}
        <div className={deleteContact === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-md px-4 h-full md:h-auto">
              <div className="bg-white rounded-lg shadow relative">
                <div className="flex justify-end p-2">
                  <button
                    type="button"
                    onClick={() => setDeleteContact(0)}
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

                <div className="p-6 pt-0 text-center">
                  <svg
                    className="w-20 h-20 text-red-600 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                    {language?.areyousureyouwanttodelete}
                  </h3>
                  <Button Primary={language?.Delete} onClick={(e) => {
                    submitDelete(editContact?.id);
                  }} />
                  <Button Primary={language?.Cancel} onClick={() => setDeleteContact(0)} />
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