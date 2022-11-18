const validateExtraChildGuest = (dates) =>{
   
    var flag=[]
     var final_flag=true;
     var error = [];
    var len = dates?.length;
    // Creates empty objects in error array for single or multiple dates
    for (let i = 0; i < len; i++) {
        error[i] = {};
    }
     dates.map((data,index)=>{ 
     if(data?.max_age==="" || data?.max_age===undefined)
     {
         flag.push(false)
         error[index].max_age="The max age is required."
     }
     if(data?.max_age !== "" && data?.max_age !== undefined){
     if(!(/^([1-9]+[0-9]*)$/.test(data.max_age))){
     {
        flag.push(false)
        error[index].max_age="The max age accepts only numbers." 
     }  
    }
    }
     if(data?.amount==="" || data?.amount===undefined)
     {
         flag.push(false)
         error[index].amount="The amount is required."
     }
     if(data?.amount !== "" && data?.amount !== undefined){
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data.amount))){
        {
           flag.push(false)
           error[index].amount="The charges accepts only numbers and decimal numbers." 
        }  
       }
       }
     if(data?.exclude_from_capacity==="" || data?.exclude_from_capacity===undefined)
     {
         flag.push(false)
         error[index].exclude_from_capacity="The exclude from capacity is required."
     }
     if(data?.charge_type ==="" || data?.charge_type===undefined)
    {
         flag.push(false)
         error[index].charge_type="The charge type is required."
     
     }
     
    
    })   
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
 export default  validateExtraChildGuest
 



  