
const DarkModeToggle = (args) => {
   
    return(  
        <div className="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 box border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 mr-10">
        <div className={args?.Primary === false ? `mx-2  text-slate-600` : `mx-2  text-slate-200 `}
        >Dark Mode</div>
        <div className="flex">
          <div className="form-check mt-1 mr-1 form-check-inline">
            <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
              <input type="checkbox"
                value={args?.Primary} checked={args?.Primary === true}
                onChange={() => { args?.Sec(!args?.Primary);  args.edit(!args?.Primary);  }}
                id="default-toggle" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                                 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                                 peer-checked:after:translate-x-full 
                                 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    )
 
}  


export default DarkModeToggle;
