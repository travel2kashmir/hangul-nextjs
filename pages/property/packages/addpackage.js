import React, { useEffect, useState } from 'react'
import validateRoomGallery from '../../../components/Validation/addroomGallery';
import Link from "next/link";
import axios from "axios";
import packageDescripitonValidation from '../../../components/Validation/packages/packageDescriptionValidation';
import lang from '../../../components/GlobalData'
import Multiselect from 'multiselect-react-dropdown';
import Button from '../../../components/Button';
import Sidebar from '../../../components/Sidebar'
import Header from '../../../components/Header'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar";
import Footer from "../../../components/Footer"
import Router from "next/router";
const logger = require("../../../services/logger");  
var language;
var currentProperty;
var currentPackageDetails;
var max_age=[];
var final=[];
var currentLogged;
var days_of_week;

function Addpackage() {
  const [errorDescription,setErrorDescription]=useState([])
  const [packageId, setPackageId] = useState()
 const [service, setService] = useState([])
 const [image, setImage] = useState({})
 const [darkModeSwitcher, setDarkModeSwitcher] = useState()
 const [color, setColor] = useState({})
  const [actionImage, setActionImage] = useState({})
 const [allRooms, setAllRooms] = useState([])
 
  const [meals, setMeals] = useState({})

  const [allPackageDetails, setAllPackageDetails] = useState( {
    "property_id": '',
  "package_name": '',
  "package_description":'',
  "charge_currency":'',
  "refundable": '',
  "refundable_until_days": '',
  "refundable_until_time": '',
  "max_number_of_intended_occupants": '',
  "max_number_of_adult_guest":'',
  "check_in":'',
  "check_out":'',
  "status":''})

  const [disp, setDisp] = useState(0);
  const [error, setError] = useState({})
  const[packageServices,setPackageServices]= useState([])

  useEffect(()=>{
    const firstfun=()=>{
      if (typeof window !== 'undefined'){
        var locale = localStorage.getItem("Language"); 
        var locale = localStorage.getItem("Language");
        const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
        const color = JSON.parse(localStorage.getItem("Color"));
        setColor(color);
        if (locale === "ar") {
        language = arabic;
        }
        if (locale === "en") {
        language=english;
        }
        if (locale === "fr") {
          language = french;
        }
        /** Current Property Basic Details fetched from the local storage **/
        currentProperty=JSON.parse(localStorage.getItem('property'))  
        currentPackageDetails=JSON.parse(localStorage.getItem('packageDescription'))
        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      } 
    }
    firstfun();
    Router.push("./addpackage");
  },[]) 

  // Package Services
const fetchPackageServices = async () => {
    const url = `/api/package/package_services`
    axios.get(url)
    .then((response)=>{response.data.map(i=>i.value=false);
     setPackageServices(response.data);
      logger.info("url  to fetch package services hitted successfully")})
      .catch((error)=>{logger.error("url to fetch package services, failed")}); 
      
}

  useEffect(() => {
    fetchPackageServices(); 
  },[])
  
  useEffect(() => {
    const fetchRooms = async () => {
        try {
            const url = `/api/rooms/${currentProperty.property_id}`
            const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
           setAllRooms(response.data)
           
        }
        catch (error) {

            if (error.response) {
                } 
            else {
            }
        }
    }
    fetchRooms();
}
    ,[])
 
    useEffect(() => {
      setColor(DarkModeLogic(darkModeSwitcher))
    }, [darkModeSwitcher])

   /** Function submit max age **/
  const submitAge = (props) =>{
    if (max_age.length !== 0){ 
  max_age.forEach((item)=>{
  const temp={
    package_id: props,
    max_age_of_child_guest:item
  }
 final.push(temp);
 });
 const final_data = {"max_age_child": final}
 const url = '/api/package/max_age_children'
    axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        logger.info("Package max age children success");
        setDisp(2);   
      } 
     )
      .catch((error) => {
        logger.error("Max age child error");
      }) 
  }
}

   /** Function package services **/
   const submitPackageServices = () => {
    packageServices.map(
      (i)=>(i.status=i.value,i.package_id=packageId)
    )
    var total = { "package_services": packageServices }
    
    const url = '/api/package/package_service_link'
    axios.post(url, total, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Package services added successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchPackageServices();
      
      })
      .catch((error) => {
        toast.error("Package Services Add Error! ", {
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
   const submitPackageRates= () => {
    if (allPackageDetails.length !== 0){
    const final_data = {
      "package_id": packageId,
      "base_rate_currency": allPackageDetails?.base_rate_currency,
      "base_rate_amount": allPackageDetails?.base_rate_amount,
      "start_date": allPackageDetails?.start_date,
      "end_date": allPackageDetails?.end_date,
      "days_of_week": days_of_week,
      "tax_rate_currency":allPackageDetails?.tax_rate_currency,
      "tax_rate_amount":allPackageDetails?.tax_rate_amount,
      "other_charges_amount": allPackageDetails?.other_charges_amount,
      "other_charges_currency": allPackageDetails?.other_charges_currency
    }
    const url = '/api/package/package_rate'
    axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Package rates added successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setAllPackageDetails([])     
        })
        .catch((error) => {
          toast.error("Package Rates Add Error! ", {
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

   /** Function submit Package Description **/
  const submitPackageDescription = () => {
    if(allPackageDetails != 0){
    const final_data = {
          "property_id": currentProperty?.property_id,
          "package_name": allPackageDetails?.package_name,
          "package_description":allPackageDetails?.package_description,
          "charge_currency":allPackageDetails?.charge_currency,
          "refundable": allPackageDetails?.refundable,
          "refundable_until_days": allPackageDetails?.refundable_until_days,
          "refundable_until_time": allPackageDetails?.refundable_until_time,
          "max_number_of_intended_occupants": allPackageDetails?.max_number_of_intended_occupants,
          "max_number_of_adult_guest":allPackageDetails?.max_number_of_adult_guest,
          "check_in":allPackageDetails?.check_in,
          "check_out":allPackageDetails?.check_out,
          "status":true
        }  
       const result=packageDescripitonValidation(final_data,max_age)
        if(result === true){
          const url = '/api/package/package_description'
      axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
          ((response) => {
            logger.info("Package description success");
                setPackageId(response?.data?.package_id);
                if(allPackageDetails?.max_number_of_intended_occupants-
                  allPackageDetails?.max_number_of_adult_guest >= 1)
                 { 
                  submitAge(response.data.package_id);
                  setDisp(2);
                  setErrorDescription({});
                }
                else{
                  setDisp(2);
                  setErrorDescription({});
                }    
          }  
          )
          .catch((error) => {
            toast.error("Package Description Add Error! ", {
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
        else{
          setErrorDescription(result)
        }
     
        }
        else{
          toast.error("Please fill the package description", {
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

  /** Function submit Package Rooms **/
  const submitPackageRooms = () => {
    if (allRooms.length !== 0){
  const datas = allRooms.filter(item => item.check === true)
  const post = datas.map(item => item.room_id)
  const roomData = post.map((item) => {
    return { "package_id": packageId, "room_id": item }
  })
  const finalData = {"package_room-link": roomData}
  axios.post(`/api/package/package_room_link`, finalData).then(response => {
    logger.info("Package rooms success");
    setDisp(3);
  }).catch(error => {
    logger.error("Package rooms error");
  });
  }
}
   /** Function to cancel package mile **/
   const removeMile = (index) => {
    const filteredMiles = mileData.filter((i, id) => i.index !== index)
     setMileData(filteredMiles)
    }   

    /** For Miles**/
    const milesTemplate = {
      package_id: packageId,
      number_of_miles: '',
      miles_provider: '',
    }  
  
    /* Mapping Index of each mile*/
      const [mileData, setMileData] = useState([milesTemplate]?.map((i, id) => { return { ...i, index: id } }))
    
   /** Function to add mile **/
   const addMiles = () => {
    setMileData([...mileData, milesTemplate]?.map((i, id) => { return { ...i, index: id } }))
  }

   /** Function to cancel room images **/
   const removeProgram = (index) => {
    const filteredPrograms = programData.filter((i, id) => i.index !== index)
     setProgramData(filteredPrograms)
    }   

    /** For Miles**/
    const programTemplate = {
      package_id: packageId,
      program_name: '',
      program_level: '',
    }  
  
    
/* Mapping Index of each mile*/
const [programData, setProgramData] = useState([programTemplate]?.map((i, id) => { return { ...i, index: id } }))
    
   /** Function to add mile **/
   const addProgram = () => {
    setProgramData([...programData, programTemplate]?.map((i, id) => { return { ...i, index: id } }))
  }

   /** Function to submit package miles **/
   const submitPackageMiles = () => {
    if(allPackageDetails != 0){
    const packagemiledata = [{
       /* To be fetched from context */
       package_id: packageId,
       number_of_miles:allPackageDetails?.number_of_miles,
       provider: allPackageDetails?.provider,
       status:true
     }]
     const finalImage = { "package_miles": packagemiledata }

   axios.post(`/api/package/package_miles`, finalImage).then(response => {
      toast.success("Package miles added successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setDisp(4);
      setAllPackageDetails([])
    
     }).catch(error => {
      toast.error("Package miles add error! ", {
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

   /** For Additional Services**/
   const serviceTemplate = {
    package_id: packageId,
   add_package_service_name: '',
   add_package_service_description: '',
  }  

   /* Mapping Index of each mile*/
   const [serviceData, setServiceData] = useState([serviceTemplate]?.map((i, id) => { return { ...i, index: id } }))

    
    const addService = () => {
      setServiceData([...serviceData, serviceTemplate]?.map((i, id) => { return { ...i, index: id } }))
    }

   /** Function to cancel room images **/
   const removeService = (index) => {
    const filteredServices = serviceData.filter((i, id) => i.index !== index)
     setServiceData(filteredServices)
    }   

     /** Function to submit package miles **/
 const submitAdditionalPackageServices = () => {
  if(service.length !== 0){
  const servicedata = [{
     /* To be fetched from context */
     package_id:packageId,
    add_package_service_name:service?.add_package_service_name,
    add_package_service_description:service?.add_package_service_description,
    status:true
   }]
   const finalProgram = { "additional_package_services": servicedata }
  axios.post(`/api/package/additional_package_services`, finalProgram)
  .then((response) => {
    toast.success("Additional package services added successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
   Router.push('../packages') 
  
  })
  .catch((error) => {
    toast.error("Additional package services error! ", {
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
  else{
    toast.success("Package added successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    Router.push('../packages') 
  }
 }

 /** Function to submit package miles **/
 const submitPackageProgram = () => {
  if(allPackageDetails != 0){
  const programdata = [{
     /* To be fetched from context */
    program_name:allPackageDetails?.program_name ,
    program_level:allPackageDetails?.program_level
   }]
   const finalProgram = { "program_membership_master": programdata }
  axios.post(`/api/package/package_membership_master`, finalProgram).then(response => {
    console.log("Package Program Master Success!")
     const program_data = { "program_id": response.data.program_id, "package_id": packageId, status:true}
     const final = { "package_program": [program_data] }
     axios.post('/api/package/package_membership_link', final, {
       headers: { 'content-type': 'application/json' }
     }).then(response => {
      toast.success("Package programs added successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setDisp(5);
      setAllPackageDetails([])
      
     })
       .catch(error => {
        toast.error("Package programs add error! ", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
       });
   });
  }
 }

 /* Function for Package Property Credit */
 const submitPackagePropertyCredit= () => {
  if(allPackageDetails != 0){
  const current_data = [{
    "package_id": packageId,
    "property_credit_currency": allPackageDetails?.property_credit_currency,
    "property_credit_amount": allPackageDetails?.property_credit_amount
  }]
  const final_data= {"property_credit": current_data}
  const url = '/api/package/package_property_credit'
  axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
    ((response) => {
      toast.success("Package credit added successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
       setAllPackageDetails([]);
       setDisp(6);
    })
    .catch((error) => {
      toast.error("Package credit add error! ", {
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

 const days = (days) => { 
  var days_present=['-','-','-','-','-','-','-'];
  days.map(day=>{
  
  if(day.day==='mon')
  {
  days_present[0]='m'
  }
  else if(day.day==='tue')
  {
  days_present[1]='t'
  }
  else if(day.day==='weds')
  {
  days_present[2]='w'
  }
  else if(day.day==='thur')
  {
  days_present[3]='t'
  }
  else if(day.day==='fri')
  {
  days_present[4]='f'
  }
  else if(day.day==='sat')
  {
  days_present[5]='s'
  }
  else if(day.day==='sun')
  {
  days_present[6]='s'
  }
  })
   days_of_week = days_present.toString().replaceAll(',','');
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
          "package_id": packageId
        }
      }))
      const final = { "package_image-link": images }
      axios.post('/api/package/package_image-link', final, {
        headers: { 'content-type': 'application/json'}
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

/* Function for Package Property Credit */
const submitPackageMeals= () => {
 
  const current_data = [{
    "package_id": packageId,
    "meal_type": meals?.meal_type,
    "included": meals?.included,
    "buffet": meals?.buffet,
    "in_room": meals?.in_room,
    "in_private_space": meals?.in_private_space,

  }]
  const final_data= {"package_meals": current_data}
  const url = '/api/package/package_meals'
  axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
    ((response) => {
      toast.success("Package meals add success.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
       setAllPackageDetails([]);
       setDisp(6);
    })
    .catch((error) => {
      toast.error("Package meals add error! ", {
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
    <Header Primary={english?.Side1}/>
    <Sidebar  Primary={english?.Side1}/>
    <div id="main-content"
    className="bg-gray-50 py-2 px-4 pt-24 relative overflow-y-auto lg:ml-64">
     <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
              <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../../admin/AdminLanding":"../landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
                </Link>
            </span>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <Link href="../propertysummary" ><a>{currentProperty?.property_name}</a></Link>
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">
               <Link href="../packages"><a>{language?.packages}</a></Link></span>
            </div>      
          </li>
         
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">Add {language?.package} </span>
            </div>
          </li>
        </ol>
      </nav>
     
     {/* Package Details Form */}
     <div id='0' className={disp===0?'block':'hidden'}>
     <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
     <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.packagedescription}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.miles}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.elite} {language?.membership}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.property} {language?.credit}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">6</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.services}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">7</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Additional Package Services</div>
            </div>
        </div>
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
         {language?.package} {language?.description}
         </h6>
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.package} {language?.name}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={
                    (e) => (
                        setAllPackageDetails({ ...allPackageDetails, package_name: e.target.value })
                    )
                }
               />
                </div>
                <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.package_name}</p>
                
              </div>
              
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.package} {language?.description}
                  </label>
                  <textarea rows="2" columns="50"
                    className="shadow-sm bg-gray-50 border capitalize border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                          setAllPackageDetails({ ...allPackageDetails, package_description: e.target.value })
                      )
                  }
                    />
                </div>
                <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.package_description}</p>
                
              </div>

              <div className="w-full lg:w-6/12 px-4">  
                <div className="relative w-full mb-3">
                  <label className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password">
                    {language?.paymentholder}
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                     onChange={
                      (e) => (
                          setAllPackageDetails({ ...allPackageDetails, charge_currency: e.target.value })
                      )
                  }>
                     <option selected >Select charge currency</option>
                    <option value="web" >Web</option>
                    <option value="hotel">Hotel</option>
                    <option value="installment">Installment</option>
                    <option value="deposit">Deposit</option>
                  </select>
                </div>
                <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.charge_currency}</p>
                
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                  {language?.refundable} 
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                    (e) => (
                        setAllPackageDetails({ ...allPackageDetails, refundable: e.target.value })
                    )
                }>
                     <option Selected >Select refundable</option>
                    <option value={true} >Yes</option>
                    <option value= {false}>No</option>
                  </select>
                </div>
                <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.refundable}</p>
                
              </div>
               {allPackageDetails?.refundable==='true'?
               <>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                   {language?.refundable} {language?.till} {language?.days}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                     onChange={
                      (e) => (
                          setAllPackageDetails({ ...allPackageDetails,refundable_until_days: e.target.value })
                      )
                  }/>
                     
                </div>
                <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.refundable_until_days}</p>
                
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                 {language?.refundable} {language?.till} {language?.time}
                  </label>
                  <input
                    type="time" step="2"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    
                    onChange={
                      (e) => (
                          setAllPackageDetails({ ...allPackageDetails, refundable_until_time: e.target.value })
                      )
                  }
                  />
                </div>   
                <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.refundable_until_time}</p>
                
              </div>
              </>:<></>}

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                  {language?.number} {language?.of} {language?.occupants}
                  </label>
                  <input
                    type="number" 
                   
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                          setAllPackageDetails({ ...allPackageDetails,max_number_of_intended_occupants: e.target.value })
                      )
                  }
                   />
                </div>
                <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.max_number_of_intended_occupants}</p>
                
              </div>
              
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                   {language?.number} {language?.of} {language?.adult}
                   </label>
                  <input
                     type="number" 
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => {
                          setAllPackageDetails({ ...allPackageDetails,max_number_of_adult_guest: e.target.value })                          
                      }
                  }/>
                </div>
                <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.max_number_of_adult_guest}</p>
                
              </div>
              
             
    
     
       {allPackageDetails?.max_number_of_intended_occupants-
                            allPackageDetails?.max_number_of_adult_guest >= 1 ? 
              <> 
                  {final=[]} 
                  { errorDescription?.max_age==='' || undefined?
                  max_age=[]:''}
              {[...Array(allPackageDetails?.max_number_of_intended_occupants-
                            allPackageDetails?.max_number_of_adult_guest)]
                            ?.map((item, index) => ( 
                      
              <div className="w-full lg:w-6/12 px-4" key={index}>
              <div className="relative w-full mb-3">
                <label
                  className="text-sm font-medium text-gray-900 block mb-2"
                  htmlFor="grid-password"
                >
                 Maximum Age Of Child
                 </label>
                 <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                     onChange={(e)=>{
                     max_age[index]=e.target.value
                     }
                  }>
                     <option selected disabled>Select </option>
                    <option value="1" >1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5" >5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9" >9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
              </div><p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.max_age}</p>
            </div>
             ))}
            </>
            :<></>}

            {/*Check in */}
            <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.checkin}  {language?.time}
                  </label>
                  <input type="time" name="time" step="2"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={
                    (e) => (
                        setAllPackageDetails({ ...allPackageDetails, check_in: e.target.value })
                    )
                } />
                 </div>
                 <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.check_in}</p>
              </div>

               {/*Check out */}
            <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.checkout} {language?.time}
                  </label>
                  <input type="time" name="time" step="2"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={
                    (e) => {
                      
                        setAllPackageDetails({ ...allPackageDetails, check_out: e.target.value })
                    }
                } />
                 </div>
                 <p className="text-sm text-sm text-red-700 font-light">
                {errorDescription?.check_out}</p>
              </div>


<div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
 <Button Primary={language?.Next} onClick={() => { submitPackageDescription(); }}/>  
   </div>
   </div>
          </div>
        </div>
      </div>
      </div>

    
     {/* package rooms and rates Form */}
     <div id='2' className={disp===2?'block':'hidden'}>
     <div className="bg-white shadow rounded-lg mt-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
     <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
     <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.packagedescription}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto"> {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.miles}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.elite} {language?.membership}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.property} {language?.credit}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">6</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.services}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">7</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Additional Package Services</div>
            </div>
        </div>
        
        <h6 className="text-xl flex leading-none pb-4 pl-6 pt-2 font-bold text-gray-900 mb-2">
          {language?.rooms} and Rates
         </h6>
         {allRooms?.map((item, index) => {
                return (
                    <div className="flex flex-row ml-6 items-start" key={index}>
                <div className="flex items-center h-5">
                  <input
                   onClick={() => {
                    setAllRooms(allRooms?.map((i) => {
                      if (i?.room_id === item?.room_id) {
                        i.check = !i.check
                      }
                      return i
                    }))

                  }}
                    id="remember"
                    aria-describedby="remember"
                    name={"remember" +index}
                    type="checkbox"
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                </div>
                <div className="text-sm ml-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {item?.room_name} -{item?.room_type_name}
                  </label>
                </div>
               
              </div>
              )})}
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.startdate}
                  </label>
                  <input
                    type="date"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setAllPackageDetails({ ...allPackageDetails, start_date: e.target.value })
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
                    {language?.enddate}
                  </label>
                  <input
                    type="date"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setAllPackageDetails({ ...allPackageDetails, end_date: e.target.value })
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
                    {language?.days}
                  </label>
                  <Multiselect
                      className="shadow-sm bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={lang?.DaysData}
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                     displayValue="day"
                      />
                </div>
              </div>
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
                        setAllPackageDetails({ ...allPackageDetails, base_rate_currency: e.target.value })
                      )
                    }>
                     <option selected >Select Baserate currency</option>
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
                        setAllPackageDetails({ ...allPackageDetails, base_rate_amount: e.target.value })
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
                        setAllPackageDetails({ ...allPackageDetails, tax_rate_currency: e.target.value })
                      )
                    }>
                   <option selected >Select Taxrate currency</option>
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
                        setAllPackageDetails({ ...allPackageDetails, tax_rate_amount: e.target.value })
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
                    {language?.other} {language?.other} {language?.currency} 
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setAllPackageDetails({ ...allPackageDetails, other_charges_currency: e.target.value })
                      )
                    }>
                   <option selected >Select other charges currency</option>
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
                        setAllPackageDetails({ ...allPackageDetails, other_charges_amount: e.target.value })
                      )
                    } />
                </div>
              </div> 

              <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next}  
                                        onClick={() => {
                    
                                          if (allRooms.length !== 0){
                                          submitPackageRates();}
                                          if(allRooms.length !== 0){
                                          submitPackageRooms();}
                                        }}             /> 
                </div>

            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Package Miles */}
      <div id='3' className={disp===3?'block':'hidden'}>
      <div className="bg-white shadow rounded-lg mt-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
      <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
     <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.packagedescription}</div>
            </div>
          
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div>
           
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">3</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto"> {language?.package} {language?.miles}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.elite} {language?.membership}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.property} {language?.credit}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">6</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.services}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">7</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Additional Package Services</div>
            </div>
        </div>
          <div className="mx-4">
                <div className="sm:flex">
                  <h6 className="text-base  flex leading-none  pt-2 font-semibold text-gray-800 ">
                    {language?.package} {language?.miles}
                  </h6> <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                    
                    <Button Primary={language?.AddMiles}  onClick={addMiles} />
                  </div>
                </div>
              </div>
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
          {mileData?.map((mileData, index) => (
              <>
              <div className={mileData?.index === 0 ? "hidden":"block"}>
                        <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                          <button className="sm:inline-flex  text-gray-800  
                     font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
                     rounded-lg text-sm px-1 py-1 text-center 
                     items-center mb-1 ml-16 ease-linear transition-all duration-150"
                     onClick={() => removeMile(mileData?.index)} type="button" >
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
                    {language?.number} {language?.of} {language?.miles}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setAllPackageDetails({ ...allPackageDetails, number_of_miles: e.target.value })
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
                    {language?.miles} {language?.provider}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setAllPackageDetails({ ...allPackageDetails,provider: e.target.value })
                      )
                    } />
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                </div>
              </div>
            </div> </>))}      
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
           <Button Primary={language?.Skip}   onClick={() => {setDisp(4);}} />
            <Button Primary={language?.Next} onClick={() => {submitPackageMiles() }}/> 
           </div>
          </div>
        </div>
      </div>
      </div>

      {/* Elite Membership */}
      <div id='4' className={disp===4?'block':'hidden'}>
      <div className="bg-white shadow rounded-lg mt-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
      <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
     <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.packagedescription}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                {language?.package} {language?.miles}</div>
            </div>
            
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                 <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">5</button>
                 <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.elite} {language?.membership}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">6</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.property} {language?.credit}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">7</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.services}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">7</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Additional Package Services</div>
            </div>
        </div>
        <div className="mx-4">
                <div className="sm:flex">
                  <h6 className="text-base  flex leading-none  pt-2 font-semibold text-gray-800 ">
                  {language?.elite} {language?.membership}
                  </h6> <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                  <Button Primary={language?.AddProgram} onClick={addProgram} />
                    </div>
                </div>
              </div>

        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
          {programData?.map((programData, index) => (
            <>
             <div className={programData?.index === 0 ? "hidden":"block"}>
                       <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                         <button className="sm:inline-flex  text-gray-800  
                    font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
                    rounded-lg text-sm px-1 py-1 text-center 
                    items-center mb-1 ml-16 ease-linear transition-all duration-150"
                    onClick={() => removeProgram(programData?.index)} type="button" >
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
                    {language?.program} {language?.name}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setAllPackageDetails({ ...allPackageDetails, program_name: e.target.value })
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
                    {language?.program} {language?.level}
                  </label>
                  <select  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setAllPackageDetails({ ...allPackageDetails, program_level: e.target.value })
                      )
                    }
                     >
                      <option selected >Select Program Name</option>
                      <option value="gold" >Gold</option>
                      <option value="silver">Silver</option>
                      <option value="platinium" >Platinium</option>
                      <option value="diamond">Diamond</option>
                      <option value="titanium">Titanium</option>
                      <option value="ambassador">Ambassador</option>
                    </select>
               
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                </div>
              </div>
            </div>
            
            </>
            ))}
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
           <Button Primary={language?.Skip} onClick={() => { setDisp(5); }} />
           <Button Primary={language?.Next}   onClick={() => {  submitPackageProgram();}} /> 
       </div>
          </div>
        </div>
      </div>
      </div>

       {/* Property Credit */}
       <div id='5' className={disp===5?'block':'hidden'}>
       <div className="bg-white shadow rounded-lg mt-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
       <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
       <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.packagedescription}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div> 
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.miles}</div>
            </div> 
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.elite} {language?.membership}</div>
            </div>
           
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                 <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">5</button>
                 <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">
                 {language?.property} {language?.credit}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">6</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.services}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">7</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Additional Package Services</div>
            </div>
        </div>
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
          {language?.property} {language?.credit}
        </h6>
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.credit} {language?.currency}
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={
                    (e) => (
                      setAllPackageDetails({ ...allPackageDetails, property_credit_currency: e.target.value })
                    )
                  }   >
                     <option selected >Select Credit Currency</option>
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
                    {language?.credit} {language?.amount}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setAllPackageDetails({ ...allPackageDetails, property_credit_amount: e.target.value })
                      )
                    } />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
               <Button Primary={language?.Skip} onClick={() => { setDisp(6); }} />
                    <Button Primary={language?.Next}   onClick={() => {submitPackagePropertyCredit(); }} />
                </div>
            </div>
          </div>
        </div>
      </div>
      </div>

       {/* Package Services */}
       <div id='6' className={disp===6?'block':'hidden'}>
       <div className="bg-white shadow rounded-lg mt-2 mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
       <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
     <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.packagedescription}</div>
            </div>
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.miles}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.elite} {language?.membership}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.property} {language?.credit}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">6</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.package} {language?.services}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">7</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Additional Package Services</div>
            </div>
        </div>   
      <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-8">
         {language?.package} {language?.services}
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
                      {packageServices?.map((item, idx) => (
                        <tr className="hover:bg-gray-100" key={idx}>
                          <td className="py-4 py-2 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                            <span className="py-4 px-2 whitespace-nowrap text-base font-medium capitalize text-gray-900">
                              {"  " +
                                item?.package_service_name?.replace(/_+/g, " ")}
                            </span>
                          </td>

                          <td className="px-2 py-4 whitespace-nowrap text-base font-normal text-gray-900">
                            <div className="flex">
                              <div className="form-check ml-4 form-check-inline">

                                <label htmlFor={"default-toggle" + idx} className="inline-flex relative items-center cursor-pointer">
                                    {item?.value}
                                  <input type="checkbox" value={item?.value}
                                    onChange={() => {
                                      setPackageServices(packageServices?.map((i) => {

                                        if (i?.package_service_id === item?.package_service_id) {
                                          i.value = !i.value
     
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
                   <Button Primary={language?.Next}  onClick={() => {submitPackageServices();setDisp(7); }}       /> 
                </div>
         </div>
         </div>
         
          {/* Additional Package Services */}
       <div id='7' className={disp===7?'block':'hidden'}>
         <div className="bg-white shadow rounded-lg mt-2 mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
         <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
     <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.packagedescription}</div>
            </div>
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.miles}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.elite} {language?.membership}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.property} {language?.credit}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">6</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                {language?.package} {language?.services}
                 </div>
            </div>

            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">7</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto"> Additional Package Services</div>
            </div>
        </div> 
         <div className="mx-4">
                <div className="sm:flex">
                  <h6 className="text-base  flex leading-none  pt-2 font-semibold text-gray-800 ">
                 Additional Package Services
                  </h6> <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                    <button type="button" onClick={addService}
                      className="w-1/2 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200  font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                      <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                      {language?.add} {language?.service}
                    </button>
                  </div>
                </div>
              </div>
              <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
          {serviceData?.map((serviceData, index) => (
            <>
             <div className={serviceData?.index === 0 ? "hidden":"block"}>
                       <div className="flex items-center justify-end space-x-2 sm:space-x-1 ml-auto">
                         <button className="sm:inline-flex  text-gray-800  
                    font-semibold border  focus:ring-4 focus:ring-cyan-200 font-semibold bg-gray-200
                    rounded-lg text-sm px-1 py-1 text-center 
                    items-center mb-1 ml-16 ease-linear transition-all duration-150"
                    onClick={() => removeService(serviceData?.index)} type="button" >
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
                    {language?.service} {language?.name}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setService({...service, add_package_service_name: e.target.value })
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
                    {language?.service} {language?.description}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                   onChange={
                      (e) => (
                        setService({...service, add_package_service_description: e.target.value })
                      )
                    } /> 
               
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                </div>
              </div>
            </div>
            
            </>
            ))}
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                       <Button Primary={language?.Submit}  
                           onClick={() => {
                            submitAdditionalPackageServices();
                          
                         }}     /> 
                    </div>
          </div>
        </div>
              </div>
       </div>

         {/* Room Gallery */}
          <div id='8' className={disp === 8 ? 'block' : 'hidden'}>
            <div className={`${color?.whitebackground} shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4`}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
             <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.packagedescription}</div>
            </div>
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.miles}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.elite} {language?.membership}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.property} {language?.credit}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">6</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                {language?.package} {language?.services}
                 </div>
            </div>

            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">7</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto"> Additional Package Services</div>
            </div>
        </div> 
              <div className="mx-4">
                <div className="sm:flex">
                  <h6 className={`${color?.text} text-base  flex leading-none  pt-2 font-semibold `}>
                   Package Gallery
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
 
      {/* Package Meals */}
      <div id='9' className={disp === 9 ? 'block' : 'hidden'}>
            <div className={`${color?.whitebackground} mt-4 shadow rounded-lg p-4 sm:p-6 xl:p-8`}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[84%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
             <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.packagedescription}</div>
            </div>
                <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.package} {language?.rooms} {language?.and} {language?.rates}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.package} {language?.miles}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.elite} {language?.membership}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.property} {language?.credit}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">6</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                {language?.package} {language?.services}
                 </div>
            </div>

            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">7</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto"> Additional Package Services</div>
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
                         Meal Type
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals, meal_type: e.target.value })
                            )
                          }>
                          <option selected disabled>{language?.select}</option>
                          <option value="breakfast">Breakfast</option>
                          <option  value="dinner">Dinner</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.meal_type}</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                         Included
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals, included: e.target.value })
                            )
                          }>
                          <option selected disabled>{language?.select}</option>
                          <option value={true}>Yes</option>
                          <option  value={false}>No</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.included}</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                         Buffet
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals,buffet: e.target.value })
                            )
                          }>
                          <option selected disabled>{language?.select}</option>
                          <option value={true}>Yes</option>
                          <option  value={false}>No</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.buffet}</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                         In Room
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals, in_room: e.target.value })
                            )
                          }>
                          <option selected disabled>{language?.select}</option>
                          <option value={true}>Yes</option>
                          <option  value={false}>No</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.in_room}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                        Private Space
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals, in_private_space: e.target.value })
                            )
                          }>
                          <option selected disabled>{language?.select}</option>
                          <option value={true}>Yes</option>
                          <option  value={false}>No</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.in_private_space}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                      <Button Primary={language?.Submit} onClick={submitPackageMeals} />
                    </div>
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
      <Footer/>
      </>
  )
}

export default Addpackage
Addpackage.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )


}