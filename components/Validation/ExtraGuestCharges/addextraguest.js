const validateExtraGuest = (data) =>{

    var flag=[]
     var final_flag=true;
     var error = {};
   
    
     if(data?.adult_charges==="" || data?.adult_charges===undefined)
     {
         flag.push(false)
         error.adult_charges="The adult charges is required."
     }
     if(data?.adult_charges !== "" && data?.adult_charges !== undefined){
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data.adult_charges))){
        {
           flag.push(false)
           error.adult_charges="The adult charges accepts only numbers and decimal numbers." 
        }  
       }
       }
     if(data?.package_id==="" || data?.package_id===undefined)
     {
         flag.push(false)
         error.package="The package is required."
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
 export default  validateExtraGuest
 



  