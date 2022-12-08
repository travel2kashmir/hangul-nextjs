const validateAdditionalServices = (data,props) =>{
    var error={};
     var flag=[]
     var final_flag=true;

    if(data.add_service_name==="" || data.add_service_name===undefined)
    {
        flag.push(false)
        error.add_service_name="App: The service name is required"
    }

  
   
    if(data.add_service_comment==="" || data.add_service_comment===undefined)
    {
        flag.push(false)
        error.add_service_comment="App: The service description is required."
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
export default  validateAdditionalServices

