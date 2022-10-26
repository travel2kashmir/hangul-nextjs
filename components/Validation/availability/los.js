const validateLOS = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
     if(data?.min_max_msg==="" || data?.min_max_msg===undefined)
     {
         flag.push(false)
         error.min_max_msg="The min max message is required."
     }
     if(data?.time==="" || data?.time===undefined)
     {
         flag.push(false)
         error.time="The number of days is required."
     }
     if(data?.min_max_msg==="FullPatternLOS" && (data?.fixed_pattern!=="" &&  data?.fixed_pattern!==undefined) )
     {
       if(data?.fixed_pattern.length != data?.time) {
         flag.push(false)
         error.fixed_pattern="The number of y or n is more or less"
     }
    }
     if(data?.min_max_msg==="FullPatternLOS" && (data?.fixed_pattern==="" || data?.fixed_pattern===undefined))
     {
         flag.push(false)
         error.fixed_pattern="The fixed pattern field is required."
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
 export default  validateLOS
 
 