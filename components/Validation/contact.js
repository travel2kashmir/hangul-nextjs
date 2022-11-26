const validateContact = (data,props) =>{
    var error={};
     var flag=[]
     var final_flag=true;

    if(data.contact_data==="" || data.contact_data===undefined)
    {
        flag.push(false)
        error.contact_value="App: The image title is required"
    }


    if(data.contact_value==="" || data.contact_value===undefined)
    {
        flag.push(false)
        error.contact_value="App: The image description is required."
    }

    if(data.contact_data !== "" && data.contact_data !== undefined){
        if(data.contact_data === "email"){  
    if((!props?.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/))){
        flag.push(false)
        error.image_link="App: The image link is invalid."
    }
}
    }

    for (let value in flag) {
     
        if(flag[value]=== false)
         {
           final_flag = false;
           break;
         }
         
      } 
      return final_flag===true ? true : error;
    }
export default  validateContact

