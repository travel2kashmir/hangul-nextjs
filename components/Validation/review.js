const validateReview = (data) =>{
    var error={};
    
    if(data[0].review_link==="")
    {
        error.review_link="The review link is required"
    }
    if(data[0].review_title==="")
    {
        error.review_title="The review title is required"
    }
    if(data[0].review_author==="")
    {
        error.review_author="The review author is required"
    }
    if(data[0].review_rating==="")
    {
        error.review_rating="The review rating is required"
    }
    if(data[0].review_rating!="")
    {
        if(typeof data[0].review_rating != 'number')
        {
            error.review_rating="The review rating must be number"
        }
    }
    if(data[0].review_date==="")
    {
        error.review_date="The review date is required"
    }
    if(data[0].review_content==="")
    {
        error.review_content="The review content is required"
    }
    if(data[0].review_rating<0 ||data[0].review_rating>5)
    {
        error.review_rating="The review rating must be between 0 to 5"
    }
    if(data[0].review_link!='')
    { 
    if(! /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(data[0].review_link))
    {  
        error.review_link="review link is not proper formatted"
    }
    }
    return Object.keys(error).length===0 ? true : error;
    }
export default  validateReview 

