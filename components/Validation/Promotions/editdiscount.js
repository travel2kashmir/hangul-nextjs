const validateDiscount = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
    
     
     if(data?.discount_type==="" || data?.discount_type===undefined)
     {
         flag.push(false)
         error.discount_type="The discount type is required."
     }
     if(data?.discount==="" || data?.discount===undefined)
     {
         flag.push(false)
         error.discount="The discount is required."
     }
     if(data?.applied_nights==="" || data?.applied_nights===undefined)
     {
         flag.push(false)
         error.applied_nights="The applied nights is required."
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
 export default  validateDiscount
 
 