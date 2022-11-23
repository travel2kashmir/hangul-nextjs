const validateAddress = (data) =>{
    var error={};
    if(data.street_address==="")
    {
        error.street_address="The property name is required"
    }
    if(data.address_landmark==="")
    {
        error.address_landmark="The property category is required"
    }
    if(data.address_city==="")
    {
        error.address_city="The property brand is required"
    }
    if(data.address_province==="")
    {
        error.address_province="The established date is required"
    }
  
    if(data.address_latitude==="")
    {
        error.address_latitude="The star rating is required"
    }

   
    if(data?.address_latitude !="" || data?.address_latitude != undefined){
        if(!(/ ^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(data?.address_latitude))){
       {
           flag.push(false)
           error.address_latitude="Invalid latitude format."
       }
      }
      }

    if(data.address_longitude==='')
    {
        error.address_longitude="The description title is required"
    }

    if(data?.address_longitude !="" || data?.address_longitude != undefined){
        if(!(/ ^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(data?.address_longitude))){
       {
           flag.push(false)
           error.address_longitude="Invalid loaddress_longitude format."
       }
      }
    }

    if(data.address_zipcode==='')
    {
        error.address_zipcode="The description body is required"
    }

    if(data?.address_zipcode !="" || data?.address_zipcode != undefined){
        if(!(/ ^[0-9]{5}(?:-[0-9]{4})?$/.test(data?.address_zipcode))){
       {
           flag.push(false)
           error.address_zipcode="Invalid zipcode format."
       }
      }
      }

    if(data.address_precision==='')
    {
        error.address_precision="The description body is required"
    }
  
    if(data?.address_precision !="" || data?.address_precision != undefined){
        if(!(/^(?=(\D*\d\D*){0,5}$)-?\d*(\.\d{0,2})?$/.test(data?.address_precision))){
       {
           flag.push(false)
           error.address_precision="Invalid precision format."
       }
      }
      }
    if(data.address_country==='')
    {
        error.address_country="The description body is required"
    }
    return Object.keys(error).length===0 ? true : error;
    }
export default  validateAddress
