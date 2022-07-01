import english from "./Languages/en"
import french from "./Languages/fr"
import arabic from "./Languages/ar"
var language;


    const firstfun=()=>{
      if (typeof window !== 'undefined'){
       
        var locale = localStorage.getItem("Language");
        
        if (locale === "ar") {
        language = arabic;
        }
        if (locale === "en") {
        language=english;
        }
        if (locale === "fr") {
          language = french;
        } 
       
      } 
    }
    firstfun();
  
export default {

   "Update" :{
        label: language?.update,
         color: "bg-cyan-600 hover:bg-cyan-700 text-white "
         
    },
   "Delete" :{
        label: language?.yesiamsure,
         color: "bg-red-600 hover:bg-red-800 text-white ",
      },
      
     "Cancel" :{
        label: language?.nocancel,
         color: "text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 ",
      },
      "Add" :{
        label:language?.add,
         color: "bg-cyan-600 hover:bg-cyan-700 text-white ",
      }
      
}