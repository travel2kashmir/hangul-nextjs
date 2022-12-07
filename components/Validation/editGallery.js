const validateEditGallery = (data) =>{
    var error={};
    var flag=[]
    var final_flag=true;
    
   alert(JSON.stringify(data))
    if(data.image_title==="" || data.image_title===undefined )
    {
        error.image_title="App: The image title is required"
    }

    if(data.image_description==="" || data.image_description===undefined )
    {
        error.image_description="App: The image description is required."
    }
    if(data.image_link==="" || data.image_link===undefined)
    {
        error.image_link="App: The image link is required."
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
export default  validateEditGallery

