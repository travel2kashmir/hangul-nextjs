const validateEditGallery = (data) =>{
    var error={};
    var flag=[]
    var final_flag=true;
    

    if(data.image_title==="")
    {
        error.image_title="App: The image title is required"
    }

    if(data.image_description==="")
    {
        error.image_description="App: The image description is required."
    }

    

    return Object.keys(error).length===0 ? true : error;
    }
export default  validateEditGallery

