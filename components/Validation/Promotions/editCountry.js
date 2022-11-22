const validateCountry = (data, props) =>{
  alert(JSON.stringify("Country" +data));
  alert(JSON.stringify("Type"+props))
    var error={};
     var flag=[]
     var final_flag=true;
    
     if(data !=="" && data !== undefined)
     {
      if(props === "" || props===undefined)
      {
         flag.push(false)
         error.country_type="The country type is required."
     }
     }
     if(props !=="" && props!==undefined)
     {
      if(data ==="" || data===undefined)
      {
         flag.push(false)
         error.country="The country  is required."
         
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
 export default  validateCountry
 
 