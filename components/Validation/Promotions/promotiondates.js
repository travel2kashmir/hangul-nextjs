const validateDates = (dates) =>{
    var flag=[]
     var final_flag=true;
     var error = [];
    var len = dates?.length;
    // Creates empty objects in error array for single or multiple dates
    for (let i = 0; i < len; i++) {
        error[i] = {};
    }
     dates.map((data,index)=>{ 
     if(data?.start_date==="" || data?.start_date===undefined)
     {
         flag.push(false)
         error[index].start_date="The start date is required."
     }
     if(data?.end_date==="" || data?.end_date===undefined)
     {
         flag.push(false)
         error[index].end_date="The end date is required."
     }
     if(data?.days_of_week==="" || data?.days_of_week===undefined)
     {
         flag.push(false)
         error[index].days_of_week="The available days is required."
     }
     if(data?.start_date != "" && data?.end_date != ""){
     if(data?.start_date >= data?.end_date)
     {
         flag.push(false)
         error[index].start_date="The start date should be less than the end date."
         error[index].end_date="The end date should be greater than the end date."
     }}
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
 export default  validateDates
 
 