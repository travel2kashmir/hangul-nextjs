const validateGallery = (data,props) =>{
    var error={};
     var flag=[]
     var final_flag=true;

    if(data.image_title==="" || data.image_title===undefined)
    {
        flag.push(false)
        error.image_title="App: The image title is required"
    }

    if(props==="" || props===undefined)
    {
        flag.push(false)
        error.image_link="App: The image link is required."
    }

    if(data.image_description==="" || data.image_description===undefined)
    {
        flag.push(false)
        error.image_description="App: The image description is required."
    }

    if(props !== "" && props !== undefined){
    if((!props?.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/))){
        flag.push(false)
        error.image_link="App: The image link is invalid."
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
export default  validateGallery

