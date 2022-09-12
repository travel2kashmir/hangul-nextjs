const Button = (args) => {
  
        return(  
            <button  onClick={args?.onClick} className={` bg-gradient-to-r ${args?.Primary?.color} sm:inline-flex  
            focus:ring-4 focus:ring-cyan-200 font-semibold 
             rounded-lg text-sm px-5 py-2 text-center 
             items-center  mb-1 ease-linear transition-all duration-150`}>
                {args?.Primary?.icon}
                {args?.Primary?.label}
            </button>
        )
     
    }  
    

export default Button;
