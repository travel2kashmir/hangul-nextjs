const validateAdditionalServicesEdit = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
    alert(JSON.stringify(data))
    if(data?.name==="" || data?.name===undefined)
    {
        flag.push(false)
        error.name="App: The service name is required"
    }

  
   
    if(data?.type==="" || data?.type===undefined)
    {
        flag.push(false)
        error.type="App: The service description is required."
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
export default  validateAdditionalServicesEdit

