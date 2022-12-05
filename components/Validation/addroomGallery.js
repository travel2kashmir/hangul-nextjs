const validateRoomGallery = (all_data) => {
    alert(JSON.stringify(all_data))
    var error = [];
    for (let count = 0; count < all_data.length; count++) {
      error.push({})
    }
  
    var flag = []
    var final_flag = true;
    all_data.map((data, index) => {

      if (data?.image_link === "" || data?.image_link === undefined) {
        flag.push(false)
        error[index].image_link = "The image link is required."
      }

      if (data?.image_title === "" || data?.image_title === undefined) {
        flag.push(false)
        error[index].image_title= "The image title is required."
      }

      if (data?.image_description === "" || data?.image_description === undefined) {
        
        flag.push(false)
        error[index].image_description= "The image description is required."
      }
   
      if (data?.image_link != "" && data?.image_link != undefined) {
      if((!data?.image_link?.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/) )){
        error[index].image_link = "The image link has invalid format."
      } 
    }

    if (data?.image_title !== "" && data?.image_title !== undefined) {
      if(data.image_title.length>50){
      flag.push(false)
      error[index].image_title= "Image title should be upto 50 characters only."
    }
    }

    if (data?.image_description != "" && data?.image_description != undefined) {
      if(data.image_description.length>1000){
      flag.push(false)
      error[index].image_description= "Image description should be upto 1000 characters only."
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
  export default validateRoomGallery
  
  