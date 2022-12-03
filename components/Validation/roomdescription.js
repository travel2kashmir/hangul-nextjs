const validateRoom = (data,props) =>{
    var error={};
     var flag=[]
     var final_flag=true;
    if(props==="" || data?.props===undefined)
     {
         flag.push(false)
         error.view="The views are required."
     }
   if(data?.room_name==="" || data?.room_name===undefined)
   {
       flag.push(false)
       error.room_name="The room name is required."
   }
    
     if(data?.room_description==="" || data?.room_description===undefined)
     {
         flag.push(false)
         error.room_description="The room description is required."
     }
     if(data?.room_capacity==="" || data?.room_capacity===undefined)
     {
         flag.push(false)
         error.room_capacity="The room description is required."
     }
     if(data?.maximum_number_of_occupants==="" || data?.maximum_number_of_occupants===undefined)
     {
         flag.push(false)
         error.maximum_number_of_occupants="The maximum number of occupants is required."
     }
     if(data?.minimum_number_of_occupants==="" || data?.minimum_number_of_occupants===undefined)
     {
         flag.push(false)
         error.minimum_number_of_occupants="The minimum number of occupants is required."
     }
     if(data?.minimum_age_of_occupants==="" || data?.minimum_age_of_occupants===undefined)
     {
         flag.push(false)
         error.minimum_age_of_occupants="The minimum age of occupants is required."
     }
     if(data?.room_length == "" || data?.room_length == undefined)
     {
         flag.push(false)
         error.room_length="The room length is required."
     }
     if(data?.room_width == "" || data?.room_width == undefined)
     {
         flag.push(false)
         error.room_width="The room width is required."
     }
     if(data?.room_height==="" || data?.room_height===undefined)
     {
         flag.push(false)
         error.room_height="The room height is required."
     }
   

     if(data?.room_capacity!=="" && data?.room_capacity!==undefined)
     {
        if(!(/^([1-9]+[0-9]*)$/.test(data.length_of_stay_max)))
        {
         flag.push(false)
         error.room_capacity="The room capacity accepts only numbers."
     }
    }
     if(data?.maximum_number_of_occupants!=="" && data?.maximum_number_of_occupants!==undefined)
     {
        if(!(/^([1-9]+[0-9]*)$/.test(data.maximum_number_of_occupants)))
        {
         flag.push(false)
         error.maximum_number_of_occupants="The maximum number of occupants accepts only numbers."
     }
     else if(data?.maximum_number_of_occupants <= data?.minimum_number_of_occupants )
     {
        flag.push(false)
        error.maximum_number_of_occupants="The maximum number of occupants must be greater than minimum number of occupants."
     }
    }
     if(data?.minimum_number_of_occupants!=="" && data?.minimum_number_of_occupants!==undefined)
     {
        if(!(/^([1-9]+[0-9]*)$/.test(data.minimum_number_of_occupants)))
        {
         flag.push(false)
         error.minimum_number_of_occupants="The minimum number of occupants accepts only numbers."
     }
     else if(data?.minimum_number_of_occupants >= data?.maximum_number_of_occupants ){
        flag.push(false)
        error.minimum_number_of_occupants="The minimum number of occupants must be less than maximum number of occupants."
     }
     }
     if(data?.minimum_age_of_occupants!=="" && data?.minimum_age_of_occupants!==undefined)
     {
        if(!(/^([1-9]+[0-9]*)$/.test(data.minimum_age_of_occupants)))
        {
         flag.push(false)
         error.minimum_age_of_occupants="The minimum age of occupants accepts only numbers."
     }
    }
     if(data?.room_length != "" && data?.room_length != undefined)
     {
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.room_length))){
           
         flag.push(false)
         error.room_length="The room length accepts only numbers and decimal values."
     }
    }
     if(data?.room_width != "" && data?.room_width != undefined){
     if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.room_width)))
       
     {
         flag.push(false)
         error.room_width="The room width accepts only numbers and decimal values. "
     }
    }
     if(data?.room_height != "" && data?.room_height != undefined)
     {
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.room_height))){
            {
         flag.push(false)
         error.room_height="The room height accepts only numbers and decimal values."
     }
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
 export default  validateRoom