const validateRateConditions = (data) =>{
    var error={};
    var country=data[0].country
    var device=data[0].device
    var program =data[0].program
    var language = data[0].language
    var additional = data[0].additional
    var flag=[]
    var final_flag=true;
   
if(additional?.description === ""){
    flag.push(false)
    error.description='This field is required'
    } 
    if(additional?.description === undefined){
        flag.push(true)
       }    
if (country.checkCountry && country.finalCountry.length!==0)
{
    flag.push(true)
    
}
if (!country.checkCountry && country.finalCountry.length===0)
{
    flag.push(true)
}
if (country.checkCountry===false && country.finalCountry.length!== 0)
{
    flag.push(false)
    error.country='Please, check the country checkbox first'
}
if (country.checkCountry===true && country.finalCountry.length===0)
{
    flag.push(false)
    error.country='Please, select the country values first.'
}
//Devices
if (device.checkDevice && device.finalDevice.length!==0)
{
    flag.push(true)
}
if (!device.checkDevice && device.finalDevice.length===0)
{
    flag.push(true)
}
if (device.checkDevice===false && device.finalDevice.length!==0)
{
    flag.push(false)
    error.device='Please, check the device checkbox first'
}
if (device.checkDevice===true && device.finalDevice.length===0)
{
    flag.push(false)
    error.device='Please, select the device values first.'
}
//Programs
if (program.checkProgram && program.finalProgram.length!==0)
{
    flag.push(true)
}
if (!program.checkProgram && program.finalProgram.length===0)
{
    flag.push(true)
}
if (program.checkProgram===false && program.finalProgram.length!== 0)
{
    flag.push(false)
    error.program='Please, check the program checkbox first'
}
if (program.checkProgram === true && program.finalProgram.length === 0)
{
    flag.push(false)
    error.program='Please, select the program values first.'
}
//Languages
if (language.checkLanguage===true && language.finalLang.length!==0)
{
    flag.push(true)
}
if (language.checkLanguage===false && language.finalLang.length===0)
{
    flag.push(true)
}
if (language.checkLanguage===false && language.finalLang.length!==0)
{
    flag.push(false)
    error.language='Please, check the program checkbox first'
}
if (language.checkLanguage===true && language.finalLang.length===0)
{
    flag.push(false)
    error.language='Please, select the language values first.'
}
//Additional
if (additional.checkPercentage===true && (additional.finalMaxUsersPercentage !== "" && additional.finalMaxUsersPercentage !== undefined))
{
    flag.push(true)
}
if (additional.checkPercentage===false && (additional.finalMaxUsersPercentage === "" || additional.finalMaxUsersPercentage === undefined))
{
    flag.push(true)
}

if (additional.checkPercentage===false && (additional.finalMaxUsersPercentage !== "" && additional.finalMaxUsersPercentage !== undefined))
{
    flag.push(false);
    error.maxuserspercent='Please, check the maximum users percentage checkbox first'
}
if (additional.checkPercentage===true && (additional.finalMaxUsersPercentage === "" || additional.finalMaxUsersPercentage === undefined))
{
    flag.push(false);
    error.maxuserspercent='Please, enter maximum user percentage first'
}
if (additional.checkPercentage===true && (additional.finalMaxUsersPercentage !== "" 
&& additional.finalMaxUsersPercentage !== undefined) 
&& !(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(additional.finalMaxUsersPercentage)))
{
    flag.push(false);
    error.maxuserspercent='This field accepts numbers and decimal values, only.'
}
if (additional.domestic===true && additional.signed === true )
{
    flag.push(true);
}
if (additional.domestic===true || additional.signed === true )
{
    flag.push(true);
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
export default  validateRateConditions

