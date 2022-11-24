const validateAddress = (data) =>{
    var error={};
    var flag=[]
    var final_flag=true;
    
    if(data.street_address==="")
    {
        error.street_address="App: The street address is required"
    }

    if(data.address_landmark==="")
    {
        error.address_landmark="App: The address landmark is required"
    }

    if(data.address_city==="")
    {
        error.address_city="App: The address city is required"
    }

    if(data.address_province==="")
    {
        error.address_province="App: The address province is required"
    }
  
    if(data.address_latitude==="")
    {
        error.address_latitude="App: The address latitude is required"
    }


    if(data.address_longitude==='')
    {
        error.address_longitude="App: The address longitude is required"
    }


    if(data.address_zipcode==='')
    {
        error.address_zipcode="App: The address zipcode is required"
    }


    if(data.address_precision==='')
    {
        error.address_precision="App: The address precision is required"
    }
  
    if(data?.address_precision !="" || data?.address_precision != undefined){
        if(!(/^(?=(\D*\d\D*){0,5}$)-?\d*(\.\d{0,2})?$/.test(data?.address_precision))){
       {
           flag.push(false)
           error.address_precision="App: Invalid address precision format."
       }
      }
      }

   

     //check latitudes 
     if(data.address_latitude !==""){
  if ((data?.address_latitude < -90) || (data?.address_latitude > 90)) {
    return 'APP: The value of latitude should be between -90 to +90'
  }
}
  //check longitude 
  if(data.address_longitude !==''){
if ((data?.address_longitude < -180) || (data?.address_longitude > 180)) {
    return 'APP: The value of latitude should be between -180 to +180'
  }
}
  //check zip code
  if(data.address_zipcode !==''){
  if ((!data.address_zipcode.match('^[1-9][0-9]{5}$'))) {
    return 'APP: Please Enter Valid Indian Zip code'
  }
}
  //check precision
  if(data.address_precision!==''){
  if (data.address_precision < 0 || data.address_precision > 1000) {
    return 'APP: Precision should be between 0-1000'
  }
}
    return Object.keys(error).length===0 ? true : error;
    }
export default  validateAddress
