import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Multiselect from 'multiselect-react-dropdown';
import validateRateConditions from '../../../components/Validation/AddRateRules/RateConditions';
import Button from '../../../components/Button';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../../../components/Header'
import Sidebar from '../../../components/Sidebar';
import Headloader from '../../../components/loaders/headloader';
import Lineloader from '../../../components/loaders/lineloader';
import Textboxloader from '../../../components/loaders/textboxloader'
import english from '../../../components/Languages/en';
import lang from "../../../components/GlobalData"
import french from '../../../components/Languages/fr'
import arabic from '../../../components/Languages/ar'
import axios from "axios";
import Router from 'next/router';
var currentLogged;
var i = 0;
var j = 1;
var res =[]
var resDev = []
var resCou = []
var resLang = []
const logger = require("../../../services/logger");

var currentraterule;
var language;
var currentProperty;

function Raterule() {
  const [visible,setVisible]=useState(0) 
  const [error, setError] = useState({})
  const [err, setErr] = useState({})
  const [basicFlag,setBasicFlag]=useState([])
  const [flag,setFlag]=useState([])
  const [finalLang,setFinalLang]=useState([])
  const [finalCountry,setFinalCountry]=useState([])
  const [finalDevice,setFinalDevice]=useState([])
  const [finalProgram,setFinalProgram]=useState([])
  const [editLang,setEditLang]=useState([])
  const [editCountry,setEditCountry]=useState([])
  const [editDevice,setEditDevice]=useState([])
  const [editProgram,setEditProgram]=useState([])
  const [rateRule, setRateRule] = useState([])
  const [discount, setDiscount] = useState([])
  const [programs, setPrograms] = useState([])
  const [allUserRateDetails, setAllUserRateDetails] = useState([])
  const [conditions, setConditions] = useState([])
  const [userSign, setUserSign] = useState([])
 const [mod, setMod] = useState([])
  const [disp, setDisp] = useState(0);
  const [checkDevice, setCheckDevice] = useState(false);
  const [checkLanguage, setCheckLanguage] = useState(false);
  const [checkCountry, setCheckCountry] = useState(false);
  const [checkProgram, setCheckProgram] = useState(false);
  const [checkPercentage, setCheckPercentage] = useState(false);
  const[userRateDetails, setUserRateDetails] = useState([])
  const [rooms,setRooms]=useState([])

 var language_data=[];
  var country_data=[];
  var device_data=[];
  var program_data=[];
  const [isRatePresent,setIsRatePresent]=useState(false)
  
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
        /** Current Property Basic Details fetched from the local storage **/
        currentraterule = localStorage.getItem('RateRuleId');
        /** Current Property Details fetched from the local storage **/
        currentProperty = JSON.parse(localStorage.getItem("property"));
        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      
      }
    }
    firstfun();
    fetchRooms()
    Router.push("./raterule")
  }, [])

/* fetch rooms of this property */
  const fetchRooms = async () => {
    try {
      var genData=[];
        const url = `/api/rooms/${currentProperty.property_id}`
        const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
       setRooms(response.data)
    }
    catch (error) {

        if (error.response) {
            } 
        else {
        }
    }
}
 
/* Function to load  when page loads*/
useEffect(() => {
    fetchRateRule();
    fetchPrograms();
}, [])

//submit rate add
const submitRateAdd = () => {
  if(validationRates(allUserRateDetails)) {
  var time;
var temp = `2022-01-01 ` + allUserRateDetails?.refundable_until_time;
   time = new Date(temp.toString())
  const final_data = {
    "base_rate_currency": allUserRateDetails?.base_rate_currency,
    "base_rate_amount": allUserRateDetails.base_rate_amount,
    "tax_amount": allUserRateDetails.tax_amount,
    "tax_currency": allUserRateDetails.tax_currency,
    "otherfees_currency": allUserRateDetails.otherfees_currency,
    "otherfees_amount": allUserRateDetails.otherfees_amount,
    "refundable": allUserRateDetails.refundable,
    "refundable_until_days": allUserRateDetails.refundable_until_days,
    "refundable_until_time": allUserRateDetails?.refundable_until_time ? time.getTime() : allUserRateDetails?.refundable_until_time,
    "otherfees_amount": allUserRateDetails.otherfees_amount,
    "expiration_time":allUserRateDetails.expiration_time,
    "charge_currency": allUserRateDetails.charge_currency,
    "rate_rule_id": rateRule.rate_rule_id,
    "status": true
  }
  const url = '/api/rate_rule/conditional_rate'
  axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
    ((response) => {
      toast.success("API:User Rate Condition added Successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      const room_data ={
        "rate_rule":[{
        "conditional_rate_id": response.data.conditional_rate_id,
        "room_id": allUserRateDetails.room_id 
      }]}
      const url = '/api/rate_rule/conditional_rate/conditional_rate_room_link'
      axios.post(url,room_data, { header: { "content-type": "application/json" } }).then
  
        ((response) => {
          toast.success("API:User Rate Condition added Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          
    })
    .catch((error) => {

      toast.error("API: Conditional Rates Error!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });})
      Router.push("../raterules");
    })

    .catch((error) => {
      toast.error("API:User Rate Condition Error!", {
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

/**  Delete Rate Rules **/
// Delete Country
const deleteCountry = () =>{
  const url = `/api/rate_rule/user_rate_condition/${userSign?.UserRateCondition_id}/countries`;
  axios
    .delete(url, { 
      header: { "content-type": "application/json" } })
    .then((response) => {
      toast.success("API:Country delete success!", {
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
    .catch((error) => {
      toast.error("API:Country delete error!", {
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
// Delete Device
const deleteDevice = () =>{
  const url = `/api/rate_rule/user_rate_condition/${userSign?.UserRateCondition_id}/devices`;
  axios
  .delete(url, { 
    header: { "content-type": "application/json" } })
  .then((response) => {
    toast.success("API:Device delete success!", {
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
  .catch((error) => {
    toast.error("API:Device delete error!", {
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
// Delete Program
const deleteProgram = () =>{
  const url = `/api/rate_rule/user_rate_condition/${userSign?.UserRateCondition_id}/memberships`;
  axios
  .delete(url, { 
    header: { "content-type": "application/json" } })
  .then((response) => {
    toast.success("API:Program delete success!", {
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
  .catch((error) => {
    toast.error("API:Program delete error!", {
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
// Delete Language
const deleteLanguage = () =>{
  const url = `/api/rate_rule/user_rate_condition/${userSign?.UserRateCondition_id}/languages`;
  axios
  .delete(url, { 
    header: { "content-type": "application/json" } })
  .then((response) => {
    toast.success("API:Language delete success!", {
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
  .catch((error) => {
    toast.error("API:Language delete error!", {
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

//urc update
const submitRateUpdate = () =>{
  if (validationRateDescription(rateRule)){ 
  const data = {
    rate_rule_name:rateRule?.rate_rule_name,
   rate_rule_id: rateRule?.rate_rule_id
};

const url = "/api/rate_rule/rate_rules";
  axios
    .put(url,data, { 
      header: { "content-type": "application/json" } })
    .then((response) => {
      toast.success("API:API: Rate rule Updated Successfully!", {
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
    .catch((error) => {
      toast.error("API:API: Rate rule update Error!", {
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
   /* Edit Rate Details Function */
const submitRateEdit = () => {
 if(validationRates(allUserRateDetails)) {
var time;
    var temp = `2022-01-01 ` + allUserRateDetails?.refundable_until_time;
    time = new Date(temp.toString())
    const toTimestamp = (strDate) => {
      const dt = Date.parse(strDate);
      return dt / 1000;
    }
    const final_data = {
      "conditional_rate_id": allUserRateDetails?.conditional_rate_id,
      "base_rate_currency": allUserRateDetails?.base_rate_currency,
      "base_rate_amount": allUserRateDetails.base_rate_amount,
      "tax_amount": allUserRateDetails.tax_amount,
      "tax_currency": allUserRateDetails.tax_currency,
      "otherfees_currency": allUserRateDetails.otherfees_currency,
      "otherfees_amount": allUserRateDetails.otherfees_amount,
      "refundable": allUserRateDetails.refundable,
      "refundable_until_days": allUserRateDetails.refundable_until_days,
      "refundable_until_time": allUserRateDetails?.refundable_until_time ? time.getTime() : allUserRateDetails?.refundable_until_time,
      "otherfees_amount": allUserRateDetails.otherfees_amount,
      "expiration_time":allUserRateDetails.expiration_time,
      "charge_currency": allUserRateDetails.charge_currency,
    }
    const url = '/api/rate_rule/conditional_rate'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("API:Rates updated successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setError({})
        Router.push("./raterule");
      })
      .catch((error) => {
        toast.error("API:API: User Rate Condition Error!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setError({})
      })

  } } 
 /* Edit Rate Modification Function */
  const submitRateMod = () => {
   if(validationRateModification(rateRule) === true){
    if (mod.length != 0) {
    const final_data = {
      "rate_modification_id": rateRule?.rate_modification_id,
      "hotel_amenity": rateRule?.hotel_amenity,
      "price_multiplier": rateRule?.price_multiplier,
 }
    const url = '/api/rate_rule/rate_modification'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("API: User rate modification updated successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setMod([])
       setErr({})

      })
      .catch((error) => {
        toast.error("API: User rate modification error.", {
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
 // Languages Edit Submit
  const submitLanguageEdit = () => { 
  const final_data = { "user_rate_language": finalLang }
  const url = "/api/rate_rule/user_rate_conditioning/rate_condition_language_link";
    axios
      .put(url, final_data, { 
        header: { "content-type": "application/json" } })
      .then((response) => {
        toast.success("API:Languages Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
       setFinalLang([]) 
        Router.push("./raterule");
      })

      .catch((error) => {
        toast.error("API:Languages Error", {
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
  // Country Edit Submit
   const submitCountryEdit = () => {
  const final_data = { "user_rate_country": finalCountry }
  const url = "/api/rate_rule/user_rate_conditioning/rate_condition_user_country_link";
    axios
      .put(url, final_data, { 
        header: { "content-type": "application/json" } })
      .then((response) => {
        toast.success("API:Country Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFinalCountry([])
        Router.push("./raterule");
      })

      .catch((error) => {
        toast.error("API:Country Error", {
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

 // Device Edit Submit
  const submitDeviceEdit = () => {
    const final_data = { "user_rate_device": finalDevice }
    const url = "/api/rate_rule/user_rate_conditioning/rate_condition_user_device_link";
      axios
        .put(url, final_data, { 
          header: { "content-type": "application/json" } })
        .then((response) => {
          toast.success("API:Devices Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setFinalDevice([])
          Router.push("./raterule");
        })
        .catch((error) => {
          toast.error("API:Devices Error", {
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

  //Program Edit Submit
  const submitProgramEdit = () => {
    const final_data = { "user_rate_program": finalProgram }
   const url = "/api/rate_rule/user_rate_conditioning/rate_condition_membership_link";
      axios
        .put(url, final_data, { 
          header: { "content-type": "application/json" } })
        .then((response) => {
          toast.success("API:Programs Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setFinalProgram([])
          Router.push("./raterule");
        })
  
        .catch((error) => {
          toast.error("API:Programs Error", {
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

    //User Signed In, Max percentage and Domestic Submit
    const submitAdditional = () => {
     const data = [{
        max_user_percentage:userRateDetails?.max_user_percentage,
        user_rate_condition_op:userRateDetails?.user_rate_condition_op,
        description:userRateDetails?.description,
        offer_name: rateRule?.rate_rule_name,
        user_signed_in:userSign?.user_signed_in,
        is_domestic: userSign?.is_domestic,

        user_rate_condition_id:userSign?.user_rate_condition_id
    }];
    const final_data = { "user_rate_condition": data }
    const url = "/api/rate_rule/user_rate_conditioning";
      axios
        .put(url, final_data, { 
          header: { "content-type": "application/json" } })
        .then((response) => {
          toast.success("API:Rate rule Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setBasicFlag([])
          setError({})
          setFlag([])
        })
  
        .catch((error) => {
          toast.error("API:Rate rule update Error", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setBasicFlag([])
          setFlag([])
        });
      
    };

    const submitDiscountEdit = () => {
      if (validationRateDescription(rateRule)){ 
      const final_data = {
        "user_rate_ineligiblity_id": rateRule?.user_rate_ineligiblity_id,
        "ineligiblity_type": discount?.ineligibility_type,
       "ineligiblity_reason":rateRule?.rate_rule_name, 
      }
      const url = "/api/rate_rule/rate_ineligiblity ";
        axios
          .put(url, final_data, { 
            header: { "content-type": "application/json" } })
          .then((response) => {
            toast.success("API:Rate Discount Updated Successfully!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setDiscount([])
            setError({});
          })
          .catch((error) => {
            toast.error("API:Rate Discount Error", {
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
    };

 
  const languages = (lan) => { 
    lan.map(item => {
      var temp = {
        user_rate_condition_id: userSign?.user_rate_condition_id,
        language: item?.language_code
      }
      language_data.push(temp) } );
      setEditLang(language_data);
      setFinalLang(language_data);
      setFlag(1);
  }

  const country = (cou) => { 
    cou.map(item => {
      var temp = {
        user_rate_condition_id: userSign?.user_rate_condition_id,
       user_country: item?.country_code
      }
      country_data.push(temp) } );
      setEditCountry(country_data);
      setFinalCountry(country_data);
      setFlag(1);
  }

  const devices = (dev) => { 
    dev.map(item => {
      var temp = {
        user_rate_condition_id: userSign?.user_rate_condition_id,
        user_device_type: item?.user_device
      }
      device_data.push(temp) } );
      setEditDevice(device_data)
      setFinalDevice(device_data);
      setFlag(1);
  }

  const program = (pro) => { 
   pro.map(item => {
       var temp = {
         user_rate_condition_id: userSign?.user_rate_condition_id,
         always_eligible_membership_id: item.program_id
       }
       program_data.push(temp) } );
       setEditProgram(program_data)
      setFinalProgram(program_data);  
      setFlag(1);
   }

   const filterByDevices = () => {
   if(rateRule?.user_rate_condition?.[i]?.UserDeviceType != undefined) {
    setCheckDevice(true)
   resDev =  lang?.DeviceData?.filter(el => {
       return rateRule?.user_rate_condition?.[i]?.UserDeviceType.find(element => {
          return element.user_device === el.user_device;
       });
    });
    setFinalDevice(resDev)
  }
  else{
    resDev= []
  } 
    Router.push('./raterule')
   }

 const filterByProgram = () => {
  if(conditions?.max_user_percentage != undefined){
    setCheckPercentage(true)
  }
  if(rateRule?.user_rate_condition?.[i]?.PackageMembership != undefined) {
    setCheckProgram(true)
    res = programs.filter(el => {
     return rateRule?.user_rate_condition?.[i]?.PackageMembership.find(element => {
        return element.program_id === el.program_id;
     });
  });
setFinalProgram(res)
}
  else{
    res= []
  }
  filterByLanguage();
  Router.push('./raterule')
}

const filterByCountry = () => {
  if(rateRule?.user_rate_condition?.[i]?.UserCountry != undefined) {
  setCheckCountry(true)
  resCou = lang?.CountryData.filter(el => {
   return rateRule?.user_rate_condition?.[i]?.UserCountry?.find(element => {
      return element.user_country === el.country_code;
   });
});
setFinalCountry(resCou)
  }
  else{
  resCou= []
  }
Router.push('./raterule')
}

const filterByLanguage = () => {
  if(rateRule?.user_rate_condition?.[i]?.language != undefined) {
  setCheckLanguage(true)
  resLang = lang?.LanguageData.filter(el => {
    return rateRule?.user_rate_condition?.[i]?.language.find(element => {
      return element.LanguageCode === el.language_code;
   });
   
});
setFinalLang(resLang)
  }
  else{
    resLang= []
    }
Router.push('./raterule')
}

  const fetchRateRule = async () => {
    const url = `/api/rate_rule/${currentraterule}`
    console.log("url" + url)
    axios.get(url)
      .then((response) => {
        setRateRule(response.data);

        setUserRateDetails(response.data.user_rate_condition?.[i])
        var keys= Object.keys(response.data)
       for(let item in keys){
        if(keys[item]==='conditional_rate') { setIsRatePresent(true)
        setAllUserRateDetails(response.data?.conditional_rate)
      break;}
      else{
        setAllUserRateDetails({
          "rate_rule_id": "",
          "conditional_rate_id": "",
          "base_rate_currency": "",
          "base_rate_amount": "",
          "tax_amount": "",
          "tax_currency": "",
          "otherfees_currency": "",
          "otherfees_amount": "",
          "refundable": "",
          "refundable_until_days": "",
          "refundable_until_time": "",
          "expiration_time": "",
          "charge_currency": "",
          "room_id": ""
        })
      }
    }
       
        setConditions(response.data.user_rate_condition?.[i])
        setUserSign(response.data.user_rate_condition?.[i])
        
        setVisible(1)
        logger.info("url  to fetch raterules hitted successfully")
       
      })
    
      .catch((error) => { logger.error("url to fetch raterules, failed") });
  }

  const fetchPrograms = async () => {
    const url = `/api/package_membership/${currentProperty?.property_id}`
    console.log("url" + url)
    axios.get(url)
      .then((response) => {
        setPrograms(response.data);
        logger.info("url  to fetch programs hitted successfully")
       
      })
      .catch((error) => { logger.error("url to fetch programs, failed") });
  }
//Rate Description
// Validation Function
const validationRateDescription = (data) => {
  var Result = checkRateDescription(data);
  if (Result === true){
   return true;
  }
  else{
   setError(Result);
   return false;

  }

}
//Checking Form Data for rate Description
const checkRateDescription = (data) => {
 var error={};
 if(data?.rate_rule_name === "" ||  data.rate_rule_name === undefined){
   error.rate_rule_name = "This field is required."
 }
return Object.keys(error).length === 0 ? true :  error;

}
//Rate Modification
const validationRateModification = (data) => {
  var Result = checkRateModification(data);
  if (Result === true){
   return true;
  }
  else{
   setErr(Result);
   return false;

  }

}
//Checking Form Data for rate Description
const checkRateModification = (data) => {
 var error={};
if(data?.price_multiplier === "" ||  data.price_multiplier === undefined){
  error.price_multiplier = "This field is required."
}
 if((!data?.price_multiplier.match(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/) && (data?.price_multiplier != "" &&  data.price_multiplier != undefined))){
   error.price_multiplier = "This field accept possitive and decimal values only."
 }
return Object.keys(error).length === 0 ? true :  error;

}

//Rates
// Validation Function
const validationRates = (data) => {
  var Result = checkRates(data);
  if (Result === true){
   return true;
  }
  else{
   setError(Result);
   return false;
  }
}

//Checking Form Data for Rates
const checkRates = (data) => {
 var error={};
 if(data?.base_rate_currency === "" ||  data?.base_rate_currency === undefined){
  error.base_rate_currency = "This field is required."
}
 if(data?.base_rate_amount === "" ||  data?.base_rate_amount === undefined){
  error.base_rate_amount = "This field is required."
}
if(data?.tax_currency === "" ||  data?.tax_currency === undefined){
  error.tax_currency = "This field is required."
}
  if(data?.room_id === "" ||  data?.room_id === undefined){
    error.room_id = "This field is required."
}
if(data?.tax_amount === "" ||  data?.tax_amount === undefined){
  error.tax_amount = "This field is required."
}
if(data?.refundable === "" ||  data?.refundable === undefined){
  error.refundable = "This field is required."
}
  if(data?.room_id === "" ||  data?.room_id === undefined){
    error.room_id = "This field is required."
}
if(data?.otherfees_currency === "" ||  data?.otherfees_currency === undefined){
  error.otherfees_currency = "This field is required."
}
if(data?.otherfees_amount === "" ||  data?.otherfees_amount === undefined){
  error.otherfees_amount = "This field is required."
}
if(data?.charge_currency === "" ||  data?.charge_currency === undefined){
  error.charge_currency = "This field is required."
}
if(data?.expiration_time === "" ||  data?.expiration_time === undefined){
  error.expiration_time = "This field is required."
}
 if((!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.base_rate_amount)) && 
 (data?.base_rate_amount != "" &&  data?.base_rate_amount != undefined))){
   error.base_rate_amount = "This field accept possitive and decimal values only."
 }
 if((!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.tax_amount)) && 
 (data?.tax_amount != "" &&  data?.tax_amount != undefined))){
  error.tax_amount = "This field accept possitive and decimal values only."
}
if((!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.otherfees_amount)) && 
(data?.otherfees_amount != "" &&  data?.otherfees_amount != undefined))){
  error.otherfees_amount = "This field accept possitive and decimal values only."
}

if(data?.refundable === "true"){
  if(data.refundable_until_days === "" || data.refundable_until_days === undefined)
  {
    error.refundable_until_days="This field is required"
  }
  if(data.refundable_until_time === "" || data.refundable_until_time === undefined)
  {
    error.refundable_until_time="This field is required"
  }
}
if((!(/^([1-9]+[0-9]*)$/.test(data?.refundable_until_days)) &&
 (data?.refundable_until_days != "" &&  data?.refundable_until_days != undefined))){
  error.refundable_until_days = "This field accept possitive values only."
}
 
return Object.keys(error).length === 0 ? true :  error;

}

// Validation Function for Rate Conditions
const validationRateCondition = () => {
  if(flag !== 1){
      toast.warn('Please, select at least one condition', {
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
  setError([]);
    var validateData=[{
    "country":
    {
      "checkCountry" :checkCountry,
      "finalCountry":finalCountry,
       "selectedCountry":resCou
    } ,
    "device":
    {
      "checkDevice" : checkDevice,
      "finalDevice":finalDevice ,
      "selectedDevice":resDev
    },
    "program":
    {
      "checkProgram" :checkProgram,
      "finalProgram":finalProgram,
      "selectedProgram":res
    },
    "language":
    {
      "checkLanguage" : checkLanguage,
      "finalLang":finalLang,
      "selectedLanguage":resLang
    },
    "additional":
    {
      "checkPercentage" : checkPercentage,
      "finalMaxUsersPercentage": userRateDetails.max_user_percentage,
      "domestic":userSign?.user_signed_in,
     "description":userRateDetails.description,
      "signed": userSign?.isDomestic
    }
    }
    ]
   var result = validateRateConditions(validateData)
   console.log("Result" +JSON.stringify(result))
   if(result===true)
   {
    //db request
    if(checkCountry === true && editCountry?.length !== 0){
      submitCountryEdit();
    }
    if(checkDevice === true && editDevice?.length !== 0){
      submitDeviceEdit()
    }
    if(checkLanguage === true && editLang?.length !== 0){
      submitLanguageEdit();
    }
    if(checkProgram === true && editProgram?.length !== 0){
      submitProgramEdit() 
    }
    if (basicFlag.length !== 0){
      submitAdditional();
    }
    if(rateRule?.user_rate_condition?.[i]?.UserDeviceType != undefined && checkDevice == false){
    deleteDevice()
  }
  if(rateRule?.user_rate_condition?.[i]?.UserCountry != undefined && checkCountry == false){
    deleteCountry()
  } 
  if(rateRule?.user_rate_condition?.[i]?.language != undefined && checkLanguage == false){
    deleteLanguage()
  }
  if(rateRule?.user_rate_condition?.[i]?.PackageMembership != undefined && checkProgram == false){
    deleteProgram()
  } 
   }
   else
   {
    setError(result)
   }
  }
 
}
  return (
    <>
      <Header Primary={english?.Side1} />
      <Sidebar Primary={english?.Side1} />
      <div id="main-content"
        className="  bg-gray-50 px-4 pt-24 py-2 relative overflow-y-auto lg:ml-64">
        {/* Navbar */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../../admin/AdminLanding" : "../landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
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
                  <Link href="../propertysummary" >
                    <a> {currentProperty?.property_name}</a>
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
                <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                  <Link href="../raterules" >
                    <a>{language?.raterules}</a>
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
                  {language?.editraterules}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/** Discount (Rate Eligibility)  **/}
        <div id='0' className={disp===0?'block':'hidden'}>
        <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
        <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.rateruledescription}
             </div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.ratecondition}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> {language?.rates}</div>
            </div>

          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
          {language?.rateruledescription} 
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
                      {language?.programname}
                      <span style={{ color: "#ff0000" }}>*</span>
                     </label>
 <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <input type="text"
                      className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={rateRule?.rate_rule_name} 
                      required
                      onChange={(e) =>
                        setRateRule({
                          ...rateRule,
                          rate_rule_name: e.target.value,
                        },setBasicFlag(1))
                      }/>

               <p className="text-sm text-red-700 font-light">
               {error?.rate_rule_name}
            </p></div>
                  </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="text-sm font-medium text-gray-900 block mb-2"
                  htmlFor="grid-password"
                >
                 {language?.discounttype}
                 <span style={{ color: "#ff0000" }}>*</span>
                 </label>

                <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                <select
                  className="shadow-sm bg-gray-50 border mb-1.5 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={(e) =>
                    setDiscount({
                      ...discount,
                      ineligibility_type: e.target.value,
                    },setBasicFlag(1))}
                >
                  <option selected disabled>{rateRule?.ineligiblity_type?.replace('_',' ')}</option>
                  <option value="exact">exact</option>
                  <option value="price_band">price band</option>
                  <option value="existence">existence</option>
             </select></div>
              </div>
            </div> 
           <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="text-sm font-medium text-gray-900 block mb-2"
                  htmlFor="grid-password"
                >
                    {language?.hotelamenity}
                    <span style={{ color: "#ff0000" }}>*</span>
                  </label>

                <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  defaultValue={rateRule?.hotel_amenity}
                readOnly
                />
                </div>
                </div>
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="text-sm font-medium text-gray-900 block"
                  htmlFor="grid-password">
                    {language?.pricemultiplier}
                    <span style={{ color: "#ff0000" }}>*</span>
                 </label>
                <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                <input
                  type="text"
                  className=" shadow-sm bg-gray-50 border my-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  defaultValue={rateRule?.price_multiplier}
                  onChange={(e) =>
                    setRateRule({
                      ...rateRule,
                      price_multiplier: e.target.value,
                    },setMod(1))
                  }
                />
              <p className="text-sm text-red-700 font-light">{err?.price_multiplier}</p>
                 </div>
                 </div>
                 </div>
             <div className="flex items-center justify-end space-x-2  sm:space-x-3 ml-auto">
                  <div className="relative w-full ml-4 mb-4">
                  <Button Primary={language?.Next} 
                     onClick={()=>{
                      setUserRateDetails({
                        ...userRateDetails,
                        max_user_percentage:conditions.max_user_percentage});
                     filterByCountry();
                     filterByProgram();
                     filterByDevices();
                      filterByLanguage();
                     setDisp(1)
                     
                     }}/>
                      <Button Primary={language?.Update}
                     onClick={()=>{
                      setUserRateDetails({
                        ...userRateDetails,
                        max_user_percentage:conditions.max_user_percentage});
                     filterByCountry();
                     filterByProgram();
                     filterByDevices();
                      filterByLanguage();
                   
                     if (basicFlag.length !== 0){
                        submitRateUpdate();
                        submitDiscountEdit();
                      } 
                      if (mod.length !== 0){ 
                      submitRateMod();
                      }
                      if (discount.length !== 0){
                        submitDiscountEdit()
                      }
                     
                     }} 
                   />
                  </div>
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>
        </div>
         </div>

        {/**Rate Condition **/}
        <div id='1' className={disp===1?'block':'hidden'}>
        <div className="bg-white  shadow rounded-lg mx-1 px-1 sm:p-6 xl:p-8 mt-3 2xl:col-span-2">
        <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">
                1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.rateruledescription}</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">  2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.ratecondition}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
           
             <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.rates} </div>
            </div>
       </div>
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-4">
        {language?.ratecondition}
        </h6>
          <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
             {language?.ratecondition}<span style={{ color: "#ff0000" }}>*</span>

                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <select
                      className="shadow-sm capitalize bg-gray-50 mb-1.5 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          user_rate_condition_op: e.target.value,
                        },setBasicFlag(1))
                      }>  
                      <option selected disabled >{userRateDetails.user_rate_condition_op}</option>
                      <option value="all">{language?.all}</option>
                      <option value="any">{language?.any}</option>
                      <option value="none">{language?.none}</option>
                    </select>
                    </div>
                  </div>
           </div>
                
          <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                       {language?.ratedescription} 
                       <span style={{ color: "#ff0000" }}>*</span>
                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Textboxloader/></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <textarea rows="2" columns="50"
                      className="peer shadow-sm bg-gray-50 capitalize border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      defaultValue={userRateDetails?.description}
                       
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          description: e.target.value,
                        },setBasicFlag(1))
                      }
                  />

                     <p className="text-sm text-red-700 font-light">
                     {error?.description}

            </p></div>
                  </div>
          </div>
           <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
            <h4 className="text-medium flex leading-none  pt-2 font-semibold text-gray-900 mb-2">

                   {language?.conditions} 

                    </h4></div>
            </div>

            <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
            </div>
             </div>

            <div className="lg:w-10/12  px-1">
                  <div className="relative w-full ">
                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex  ">
                      <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                      checked={checkCountry === true}
                      onChange={()=>{setCheckCountry(!checkCountry),setFlag(1)}} className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                        {language?.usercountry} 
                      </label> </span></div>
                      <div className="w-full lg:w-4/12 ">
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect
                      className="shadow-sm bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={lang?.CountryData}
                      displayValue="country_name"
                      selectedValues={resCou}
                      onRemove={(event) => {country(event)}}
                      onSelect={(event) => {country(event) }} />
                       <p className="text-red-700 text-sm font-light">
                      {error?.country}</p></div></div>
                    </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" 
                        checked={checkDevice === true} 
                        onChange={()=>{setCheckDevice(!checkDevice),setFlag(1)}}
                        className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                     <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                       {language?.userdevice}  
                      </label> </span></div>

                      <div className="w-full lg:w-4/12 ">
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect
                      className="shadow-sm bg-gray-50   text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={lang?.DeviceData}
                      displayValue="user_device"
                      selectedValues={resDev}
                      onRemove={(event) => { devices(event) }}
                      onSelect={(event) => { devices(event) }} />
                       <p className="text-red-700 text-sm font-light">
                      {error?.device}</p></div></div>
                    </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex ">
                        <input id="checkbox-1"  checked={checkLanguage === true} 
                        onChange={()=>{setCheckLanguage(!checkLanguage),setFlag(1)}} aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                        {language?.language}  
                      </label> </span></div>
                      <div className="w-full lg:w-4/12 ">
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect
                      className="shadow-sm bg-gray-50   text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={lang?.LanguageData}
                      selectedValues={resLang}
                      displayValue="language_name"
                      onRemove={(event) => { languages(event) }}
                      onSelect={(event) => { languages(event) }} />
                       <p className="text-red-700 text-sm font-light">
                      {error?.language}</p></div>
                      </div>
                      </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" 
                            checked={checkProgram === true}
                            onChange={()=>{setCheckProgram(!checkProgram),setFlag(1)}}className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                     <label className="text-sm font-medium text-gray-900 mx-2 block "
                        htmlFor="grid-password">
                          {language?.membershipprogram}</label> </span></div>
                      <div className="w-full lg:w-4/12 ">
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect
                      className="shadow-sm bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full "
                      isObject={true}
                      options={programs}
                      displayValue="program_name"
                      selectedValues={res}
                      onRemove={(event) => {program(event)}}
                      onSelect= {(event)=>{program(event)}} />
                       <p className="text-red-700 text-sm font-light">
                      {error?.program}</p></div></div>
                      </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                         checked={checkPercentage === true}
                         onChange={()=>{setCheckPercentage(!checkPercentage),setFlag(1)}}
                         className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"> {language?.maxuserpercentage}</label> 
                        </span></div>
                      <div className="w-full lg:w-4/12 ">
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input type="text" 
                      className="peer shadow-sm bg-gray-50 border  border-gray-300 text-gray-900  rounded-lg 
                      focus:ring-cyan-600 focus:border-cyan-600 block w-full py-2 px-4 "
                      defaultValue={conditions?.max_user_percentage} 
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          max_user_percentage: e.target.value,
                        },setBasicFlag(1),setFlag(1))
                      }/>

                       <p className=" text-sm text-red-700 font-light">
                       {error?.maxuserspercent}
 </p></div>
                      </div>
                        </div> 

                    <div className='flex mb-2'>
                        <div className="w-full lg:w-3/12 ">
                      <span className="flex">

                        <input id="checkbox-1" checked={ userSign.user_signed_in === true} 
                        onChange={(e) =>
                          setUserSign({ ...userSign, user_signed_in: !userSign?.user_signed_in },setBasicFlag(1),setFlag(1))
                        }
              aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                     
                      <label
                        className="text-sm font-medium mx-2 text-gray-900 block "
                        htmlFor="grid-password"
                      >
                        {language?.usersignedin}
                      </label> </span></div>
                      <div className="w-full lg:w-4/12 ">
                     
                      <div className="form-check mx-2 form-check-inline">
                          
                        <label htmlFor={`default-toggle`} className="inline-flex relative items-center cursor-pointer">

                          <input type="checkbox" value={userSign.user_signed_in} 
                          checked={ userSign?.user_signed_in === true}
                            onChange={(e) =>
                              setUserSign({ ...userSign, user_signed_in: !userSign?.user_signed_in },setBasicFlag(1),setFlag(1))
 }
                            id={`default-toggle`} className="sr-only peer" />
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
                      </div>

                    <div className='flex mb-2'>
                    <div className="w-full lg:w-3/12 ">
                      <span className="flex ">
                        <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"  
                        checked={userSign?.is_domestic === true}
                          onChange={()=>{setUserSign( { ...userSign, is_domestic:!userSign?.is_domestic}),setFlag(1),setBasicFlag(1)}}
                          className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                        <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                      
                      <label
                        className="text-sm mx-2 font-medium text-gray-900 block"
                        htmlFor="grid-password"
                      >
                         {language?.isdomestic} 
                      </label>
                      </span>
                      
                      </div>
                      <div className="w-full lg:w-4/12 ">
                      <div className="flex">
                      <div className="form-check mx-2 form-check-inline">

                        <label htmlFor="default" className="inline-flex relative items-center cursor-pointer">
                          <input type="checkbox" value={userSign?.is_domestic} 
                          checked={userSign.is_domestic === true}
                            onChange={(e) =>
                              setUserSign({ ...userSign, is_domestic: !userSign?.is_domestic},setBasicFlag(1),setFlag(1))
                            }
                            id="default" className="sr-only peer" />
                          <div
                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                 peer-checked:after:translate-x-full 
                 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div> </div>

                  </div>
       </div>
        
            </div>
     
        </div>       
        <div id="btn" className="flex items-center  justify-end sm:space-x-3 my-4 ml-auto">
        <Button Primary={language?.Previous}   onClick={() => {setDisp(0);}} />
        <Button Primary={language?.Update} onClick={()=>{validationRateCondition();}}/> 
        <Button Primary={language?.Next}   onClick={() => {setDisp(2);}} />    
        </div>
        </div>
        </div>

        {/** Rates **/}
        <div id='2' className={disp===2?'block':'hidden'}>
        <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8 mt-3 2xl:col-span-2">
        <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.rateruledescription}</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">  {language?.ratecondition}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
          
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">
            3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">  {language?.rates}</div>
            </div>
       </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
          {language?.rates} 
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
                      {language?.baserate} {language?.currency} <span style={{ color: "#ff0000" }}>*</span>
                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => {  
                          setAllUserRateDetails({ ...allUserRateDetails, base_rate_currency: e.target.value })
                      }
         }>{allUserRateDetails?.base_rate_currency === ""
                      ?
                      <option selected disabled>{language?.select}</option>:
                      <option selected disabled>{allUserRateDetails?.base_rate_currency}</option>}
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                    <p className="text-sm text-red-700 font-light">
                      {error?.base_rate_currency}
                      </p></div>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.baserate} {language?.amount} <span style={{ color: "#ff0000" }}>*</span>

                       </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                     <div className={visible === 1 ? 'block' : 'hidden'}>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.base_rate_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, base_rate_amount: e.target.value })
                        )
                      }
                    />

                      <p className="text-sm text-red-700 font-light">
                      {error?.base_rate_amount}
                      </p></div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.taxrate} {language?.currency} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <select className="shadow-sm ca bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, tax_currency: e.target.value })
                        )
                      }>
                        
                        {allUserRateDetails?.tax_currency === ""
                      ? <option selected disabled >{language?.select}</option>:
                      <option selected disabled >{allUserRateDetails?.tax_currency}</option>}
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                    <p className="text-sm text-red-700 font-light">
                      {error?.tax_currency}
                      </p></div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.taxrate} {language?.amount}
                      <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                   <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <input
                      type="text"
                      className=" shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.tax_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, tax_amount: e.target.value })
                        )
                      } />
                        <p className="text-sm text-red-700 font-light">
                        {error?.tax_amount}</p></div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.other} {language?.capacity} {language?.currency} <span style={{ color: "#ff0000" }}>*</span>

                      </label>
 <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, otherfees_currency: e.target.value })
                        )
                      }>

                        {allUserRateDetails?.otherfees_currency === ""
                      ? <option selected disabled >{language?.select}</option>:
                      <option selected disabled >{allUserRateDetails?.otherfees_currency}</option>}
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                    <p className="text-sm text-red-700 font-light">
                      {error?.otherfees_currency}
                      </p></div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.other} {language?.charges} {language?.amount} <span style={{ color: "#ff0000" }}>*</span>

                      </label>
 <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <input
                      type="text"
                      className="peer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.otherfees_amount}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, otherfees_amount: e.target.value })
                        )
                      }
                    />

                      <p className="text-sm text-red-700 font-light">
                      {error?.otherfees_amount}
</p></div>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password" >
                        {language?.paymentholder}
                         <span style={{ color: "#ff0000" }}>*</span>
                     </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => {
                          setAllUserRateDetails({ ...allUserRateDetails, charge_currency: e.target.value })
                        }
                      }>
                  {allUserRateDetails?.charge_currency === ""
                      ? <option selected disabled >{language?.select}</option>:
                      <option selected disabled >{allUserRateDetails.charge_currency}</option>}
                      <option value="web">  {language?.web}</option>
                          <option value="hotel">  {language?.hotel}</option>
                      <option value="installment">  {language?.installment}</option>
                      <option value="deposit">  {language?.deposit}</option>
                    </select>
                    <p className="text-sm text-red-700 font-light">
                      {error?.charge_currency}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                       {language?.refundable} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>

                      <div className={visible === 1 ? 'block' : 'hidden'}>

                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, refundable: e.target.value })
                        )
                      }>
                       {allUserRateDetails?.refundable === ""?
                        <>
                        <option selected disabled>  {language?.select}</option>
                        <option value={true}> {language?.yes}</option>
                         <option value={false}> {language?.no}</option>
                         </>:
                         <>
                      {allUserRateDetails?.refundable === "true"
                        ?
                        <>
                        <option selected disabled value={true}>  {language?.yes}</option>
                         <option value={false}> {language?.no}</option>
                         </>
                       : 
                        <>
                      <option value={true}> {language?.yes}</option>
                      <option disabled selected value={false}> {language?.no}</option>
                      </>
                     }</>}
                        </select>
                        <p className="text-sm text-red-700 font-light">
                      {error?.refundable}
                      </p></div></div>
                        </div>

                {allUserRateDetails?.refundable === "true" ? (
                  <>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                            {language?.refundable} {language?.till} {language?.days} 
                            <span style={{ color: "#ff0000" }}>*</span>

                              </label>
<div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="text"
                          className="peer shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          defaultValue={allUserRateDetails?.refundable_until_days}
                          
                        onChange={
                            (e) => (
                              setAllUserRateDetails({ ...allUserRateDetails, refundable_until_days: e.target.value })
                            )
                          } />

                          <p className="text-sm text-red-700 font-light">
                         {error?.refundable_until_days}
  </p></div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                        {language?.refundable} {language?.till} {language?.time}
                        <span style={{ color: "#ff0000" }}>*</span>
                        </label>
                        <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="time" step="2"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          defaultValue={allUserRateDetails?.refundable_until_time}
                          onChange={
                            (e) => (
                              setAllUserRateDetails({ ...allUserRateDetails, refundable_until_time: e.target.value })
                            )
                          } />
                            <p className="text-sm text-red-700 font-light">
                         {error?.refundable_until_time}
  </p></div>
                      </div>
                    </div></>)
                  :
                  (<>
                </>)}

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password">
                     {language?.expirationtimezone}
                      <span style={{ color: "#ff0000" }}>*</span>
                   </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <input
                      type="datetime-local"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.expiration_time}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, expiration_time: e.target.value })
                        )

                      } /> <p className="text-sm text-red-700 font-light"> {error?.expiration_time}</p>
                  </div>
                  </div>
                </div>
                      
                 {JSON.stringify(isRatePresent)==="false"?
                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password">
                       {language?.room} <span style={{ color: "#ff0000" }}>*</span>
                      </label>
                      <select
                        onClick={(e) => setAllUserRateDetails({ ...allUserRateDetails, room_id: e.target.value })}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                  <option selected disabled>{language?.select}</option>
                         {rooms?.map(i => {
                          return (
                            <option key={i} value={i.room_id}>{i.room_name}</option>)
                        }
                        )}
                      </select>
                      <p className="text-sm text-red-700 font-light"> {error?.room_id}</p>
                    </div>
                  </div>:<></>
                      }
              </div>
              <div id="btn" className="flex items-center justify-end mt-2 space-x-2 sm:space-x-3 ml-auto">
              <Button Primary={language?.Previous}   onClick={() => {setDisp(1);}} />
                {Button !== 'undefined' ?
                  <Button Primary={language?.Update} onClick={isRatePresent?submitRateEdit:submitRateAdd} />
                  : <></>
                }
              </div>

            </div>
          </div>
        </div></div>

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
    </>
  )
}

export default Raterule
