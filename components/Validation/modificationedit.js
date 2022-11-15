const validateModificationsEdit= (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
     console.log(data)
    alert(JSON.stringify(data))
     if(data?.modification_name==="" || data?.modification_name===undefined)
     {
         flag.push(false)
         error.modification_name="The modification name is required."
     }
   
     
     if(data?.packages?.length === 0 || data?.packages === undefined )
     {
         flag.push(false)
         error.packages="The packages is required."
     }
     if(data?.amount_before_discount==="" || data?.amount_before_discount===undefined)
     {
         flag.push(false)
         error.min_amount_before_discount="The min amount before discount is required."
     }
    
     //Accepts only possitive and decimal values
     if(data?.amount_before_discount !="" || data?.amount_before_discount != undefined)
      if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.amount_before_discount))){
     {
         flag.push(false)
         error.min_amount_before_discount="The min amount before discount accepts numbers and decimal values."
     }
    }
    
    //Mandatory
    if(data?.length_of_stay_min !== "" && data?.length_of_stay_min !== undefined ){
           if(data?.length_of_stay_max === "" || data?.length_of_stay_max === undefined) {
            flag.push(false);
            error.length_of_stay_max="The length of stay maximum is required."
           }
       }

       if(data?.length_of_stay_max !== "" && data?.length_of_stay_max !== undefined ){
       if (data?.length_of_stay_min === "" || data?.length_of_stay_min ===undefined){
       
        flag.push(false);
        error.length_of_stay_min="The length of stay minimum is required."
       }    
   }
     
    if((data?.length_of_stay_min !== "" && data?.length_of_stay_min !== undefined )&& (data?.length_of_stay_max !== "" && data?.length_of_stay_max !== undefined))
    {
    if((/^([1-9]+[0-9]*)$/.test(data.length_of_stay_min)) && (/^([1-9]+[0-9]*)$/.test(data.length_of_stay_max)))
     {
         if(data?.length_of_stay_min >= data?.length_of_stay_max)
     {
         flag.push(false);
         error.length_of_stay_min="The length of stay min should be less than the length of stay max."
         error.length_of_stay_max="The length of stay max should be greater than the length of stay min."
     }
    }
    else{
        if(!(/^([1-9]+[0-9]*)$/.test(data.length_of_stay_min)))
        {
           flag.push(false);
           error.length_of_stay_min="The length of stay min accepts only numbers." 
        }
        if(!(/^([1-9]+[0-9]*)$/.test(data.length_of_stay_max)))
        {
                   flag.push(false);
                     error.length_of_stay_max="The length of stay maximum accepts only numbers."
                    }
    }
    }
   
    // Booking Window
     //Mandatory
     if(data?.booking_window_min !== "" && data?.booking_window_min !== undefined ){
        if(data?.booking_window_max === "" || data?.booking_window_max === undefined) {
         flag.push(false);
         error.booking_window_max="The booking window maximum is required."
        }
    }
    if(data?.booking_window_max !== "" && data?.booking_window_max !== undefined ){
    if (data?.booking_window_min === "" || data?.booking_window_min ===undefined){
    
     flag.push(false);
     error.booking_window_min="The booking window minimum is required."
    }    
}
 //  Greater or Less and only numbers
 if((data?.booking_window_min !== "" && data?.booking_window_min !== undefined )&& (data?.booking_window_max !== "" && data?.booking_window_max !== undefined)){
 if((/^([1-9]+[0-9]*)$/.test(data.booking_window_min)) && (/^([1-9]+[0-9]*)$/.test(data.booking_window_max)))
 {
    if(data?.booking_window_min >= data?.booking_window_max)
  {
      flag.push(false);
      error.booking_window_min="The booking window min should be less than the booking window max."
      error.booking_window_max="The booking window max should be greater than the booking window min."
  }
    }
    else{
        if(!(/^([1-9]+[0-9]*)$/.test(data.booking_window_min))){
            flag.push(false);
            error.booking_window_min="The booking window min accepts only numbers."
           } 
           if(!(/^([1-9]+[0-9]*)$/.test(data.booking_window_max))){
            flag.push(false);
            error.booking_window_max="The booking window maximum accepts only numbers."
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
 export default  validateModificationsEdit
 
 