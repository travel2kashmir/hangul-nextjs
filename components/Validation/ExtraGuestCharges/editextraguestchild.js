const validateEditExtraChildGuest = (data) =>{
   
    var flag=[]
     var final_flag=true;
     var error = {};
   
     if(data?.max_age==="" || data?.max_age===undefined)
     {
         flag.push(false)
         error.max_age="The max age is required."
     }
     if(data?.max_age !== "" && data?.max_age !== undefined){
     if(!(/^([1-9]+[0-9]*)$/.test(data.max_age))){
     {
        flag.push(false)
        error.max_age="The max age accepts only numbers." 
     }  
    }
    }
    if(data?.max_age !== "" && data?.max_age !== undefined){
        if((/^([1-9]+[0-9]*)$/.test(data.max_age))){
            if(data?.max_age > 18){
        {
           flag.push(false)
           error.max_age="The max age should be less than 18." 
        }  
    }
}
       }
     if(data?.amount==="" || data?.amount===undefined)
     {
         flag.push(false)
         error.amount="The amount is required."
     }
     if(data?.amount !== "" && data?.amount !== undefined){
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data.amount))){
        {
           flag.push(false)
           error.amount="The charges accepts only numbers and decimal numbers." 
        }  
       }
       }
     if(data?.exclude_from_capacity==="" || data?.exclude_from_capacity===undefined)
     {
         flag.push(false)
         error.exclude_from_capacity="The exclude from capacity is required."
     }
     if(data?.charge_type ==="" || data?.charge_type===undefined)
    {
         flag.push(false)
         error.charge_type="The charge type is required."
     
     }
     
    
    
     for (let value in flag) {
     
         if(flag[value]=== false)
          {
            final_flag = false;
            break;
          }
          
       } 
       console.log(JSON.stringify(error));
       return final_flag===true ? true : error;
     }
 export default  validateEditExtraChildGuest
 