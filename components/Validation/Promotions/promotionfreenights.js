const validateFreeNights = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
    alert(JSON.stringify(data))
     if(data?.stay_nights==="" || data?.stay_nights===undefined)
     {
         flag.push(false)
         error.stay_nights="The stay nights is required."
     }
     if(data?.discount_nights==="" || data?.discount_nights===undefined)
     {
         flag.push(false)
         error.discount_nights="The discount nights is required."
     }
     if(data?.discount_percentage==="" || data?.discount_percentage===undefined)
     {
         flag.push(false)
         error.discount_percentage="The discount percentage is required."
     }
     if(data?.night_selection==="" || data?.night_selection===undefined)
     {
         flag.push(false)
         error.night_selection="The night selection is required."
     }
     if(data?.repeat==="" || data?.repeat===undefined)
     {
         flag.push(false)
         error.repeat="The free nights repeat is required."
     }
     if(data?.stay_nights != undefined && data?.stay_nights != "" && !(/^[0-9]*$/.test(data.stay_nights)))
     {
         error.stay_nights="The stay nights accepts only numbers." 
     }
     if(data?.discount_nights != undefined && data?.discount_nights != "" && !(/^[0-9]*$/.test(data.discount_nights)))
     {
         error.discount_nights="The discount nights accepts only numbers." 
     }
     if(data?.discount_percentage != undefined && data?.discount_percentage != "" && !(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data.discount_percentage)))
     {
         error.discount_percentage="The discount nights accepts only numbers." 
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
 export default  validateFreeNights
 
 