const validatebasicDetails = (data) =>{
    var error={};
    if(data.property_name==="")
    {
        error.property_name="App: The property name is required"
    }
    if(data.property_category==="")
    {
        error.property_category="App: The property category is required"
    }
    if(data.property_brand==="")
    {
        error.property_brand="App: The property brand is required"
    }
    if(data.established_year==="")
    {
        error.established_year=" App: The established date is required"
    }
  
    if(data.star_rating==="")
    {
        error.star_rating="App: The star rating is required"
    }
    
    if(data.star_rating<0 ||data.star_rating>5)
    {
        error.star_rating="App: The star rating must be between 0 to 5"
    }
    
    if(data.description_title==='')
    {
        error.description_title="App: The description title is required"
    }
    if(data.description_body==='')
    {
        error.description_body="App: The description body is required"
    }
    return Object.keys(error).length===0 ? true : error;
    }
export default  validatebasicDetails

