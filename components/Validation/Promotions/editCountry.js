const validateCountry = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
     alert(JSON.stringify(data))
    if(data === undefined)
     {
         flag.push(false)
         error.country="Please select the countries."
         
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
 
 