const validateAvailability = (data,props) =>{
   var error={};
    var flag=[]
    var final_flag=true;
    if(data?.package_id==="" || data?.package_id===undefined)
    {
        flag.push(false)
        error.package="The Package is required."
    }
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
    if(data?.start_date >= data?.end_date)
    {
        flag.push(false)
        error.start_date="The start date should be less than the end date."
        error.end_date="The end date should be greater than the end date."
    }
    if(props==="" || props===undefined)
    {
        flag.push(false)
        error.days="The days is required."
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
export default  validateAvailability

