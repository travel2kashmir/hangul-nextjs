const validateRestriction = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
     if(data?.restriction_status==="" || data?.restriction_status===undefined)
     {
         flag.push(false)
         error.restriction_status="The restriction status is required."
     }
     if(data?.restriction_type==="" || data?.restriction_type===undefined)
     {
         flag.push(false)
         error.restriction_type="The restriction type is required."
     }
     if(data?.min_advance_booking==="" || data?.min_advance_booking===undefined)
     {
         flag.push(false)
         error.min_advance_booking="The minimum advance booking is required."
     }
     if(data?.max_advance_booking==="" || data?.max_advance_booking===undefined)
     {
         flag.push(false)
         error.max_advance_booking="The maximum advance booking is required."
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
 export default  validateRestriction
 
 