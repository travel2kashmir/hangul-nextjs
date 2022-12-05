const validateBedAdd = (data) => {
    var error={};
     var flag=[]
     var final_flag=true;
  
    var flag = []
    var final_flag = true;
    
      if (data?.length === "" || data?.length === undefined) {
        flag.push(false)
        error.length = "The bed length is required."
      }
      if (data?.width === "" || data?.width === undefined) {
        flag.push(false)
        error.width= "The bed width is required."
      }
      if(data?.length != "" && data?.length != undefined)
      {
         if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.length))){
          flag.push(false)
          error.length="The bed length accepts only numbers and decimal values."
      }
     }
     if(data?.width != "" && data?.width != undefined)
     {
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.width))){
         flag.push(false)
         error.width="The bed width accepts only numbers and decimal values."
     }
    }
   
    for (let value in flag) {
  
      if (flag[value] === false) {
        final_flag = false;
        break;
      }
  
    }
    return final_flag === true ? true : error;
  }
  export default validateBedAdd
  
  