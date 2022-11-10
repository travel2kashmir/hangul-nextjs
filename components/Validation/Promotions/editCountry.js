const validateCountry = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
   
    if(data?.country === undefined && (data?.country_type !== undefined || ""))
     {
         flag.push(false)
         error.country="Please select the countries."
     }
     if(data?.country_type === undefined && (data?.country!== undefined || ""))
     {
         flag.push(false)
         error.country_type="Please select the country type."
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
 export default  validateCountry
 
 