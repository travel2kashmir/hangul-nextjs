const validateDates = (data,days_of_week) =>{
    var flag=[]
     var final_flag=true;
     var error = [];
    
     if(data?.start_date==="" || data?.start_date===undefined)
     {
         flag.push(false)
         error.start_date="The start date is required."
     }
     if(data?.end_date==="" || data?.end_date===undefined)
     {
         flag.push(false)
         error.end_date="The end date is required."
     }
     if(days_of_week==="" || days_of_week===undefined)
     {
         flag.push(false)
         error.days_of_week="The available days is required."
     }
     if(data?.start_date != "" && data?.end_date != ""){
     if(data?.start_date >= data?.end_date)
     {
         flag.push(false)
         error.start_date="The start date should be less than the end date."
         error.end_date="The end date should be greater than the end date."
     }}
      
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
 export default  validateDates
 
 