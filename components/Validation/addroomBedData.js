const validateBedData = (all_data) => {
    var error = [];
    for (let count = 0; count < all_data.length; count++) {
      error.push({})
    }
  
    var flag = []
    var final_flag = true;
    all_data.map((data, index) => {
      if (data?.length === "" || data?.length === undefined) {
        flag.push(false)
        error[index].length = "The bed length is required."
      }
      if (data?.width === "" || data?.width === undefined) {
        flag.push(false)
        error[index].width= "The bed width is required."
      }
      if(data?.length != "" && data?.length != undefined)
      {
         if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.length))){
          flag.push(false)
          error[index].length="The bed length accepts only numbers and decimal values."
      }
     }
     if(data?.width != "" && data?.width != undefined)
     {
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.width))){
         flag.push(false)
         error[index].width="The bed width accepts only numbers and decimal values."
     }
    }
     
    })
  
    for (let value in flag) {
  
      if (flag[value] === false) {
        final_flag = false;
        break;
      }
  
    }
    return final_flag === true ? true : error;
  }
  export default validateBedData
  
  