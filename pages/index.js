import { useEffect, useState } from "react";
import Axios from "axios";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Cookies from 'js-cookie'
import english from "../components/Languages/en"
import french from "../components/Languages/fr"
import arabic from "../components/Languages/ar"
const logger = require("../services/logger");

function Signin() {
  /** Router for Redirection **/
  const router = useRouter();
  const { locale } = router;
  const [current,setCurrent]=useState(false)
  useEffect(() => {
    const setLanguage = async () => {
      localStorage.setItem("Language", "en");
    };
    setLanguage();
    getCookieData();
  }
    , [])

  //write into cookies
  function setCookieData(checked) {
    if(checked)
    {Cookies.set("email",signinDetails.email, { expires: 30 })
    Cookies.set("password",signinDetails.password, { expires: 30 })
  }
  else{
    Cookies.remove("email");
    Cookies.remove("password")
  }
  }


//read from cookies
  function getCookieData(){
    var mail=Cookies.get("email");
    var pass=Cookies.get("password")
    setSigninDetails({"email":mail, "password":pass})
   if(mail != undefined){
    document.getElementById('email').value=mail;
    document.getElementById('password').value=pass;
   } 
  }
  
  
  
    /** State for internationalization **/
  const [lang, setLang] = useState("en");
  var language;
  if (locale === "en") {
    language = english
}
  if (locale === "ar") {
    language = arabic
    console.log(JSON.stringify(language.title))
  }
  if (locale === "fr") {
    language = french
  }

  /** Function for Internationalisation **/
  const changelanguage = (item) => {
    const locale = item;
    /** Language selected stored to the localstorage **/
    localStorage.setItem("Language", locale);
    router.push("/", "/", { locale });
    logger.info("Language fetched: " + locale);
  };

  /** State for Sign In **/
  const [signinDetails, setSigninDetails] = useState({
    email: "",
    password: "",
  });

  /** Storing Sign in data in Local Storage **/
  const LocalSignin = (whoIsLogged) => {
    localStorage.setItem("Signin Details", JSON.stringify(whoIsLogged));
  };

  /** Sign In Submit Function **/
  const submitSignIn = async (e) => {
    e.preventDefault()
    var item = {
      user_email: signinDetails.email,
    };

    /** API POST call to send Sign Details **/
    Axios.post("/api/signin/user", item, {
      headers: { "content-type": "application/json" },
    })
      .then(async (response) => {
        /** Password Decryption **/
       const salt = response.data.salt;
        const EncryptedPass = await bcrypt.hash(signinDetails.password, salt);
        if (EncryptedPass === response.data.password) {
          /** Toast emitter Sign in Successfull **/
          logger.info("Login Successful!");
          const whoIsLogged = {
            id: response.data.id,
            name: response.data.name,
            email: signinDetails?.email,
            password: response.data?.password,
            admin_type: response.data?.admin_type
          };
          {/*To re-direct to required module*/ }
          if (response.data.id.match(/admin00.[0-9]*/g)) {
            LocalSignin(whoIsLogged);
            router.push("./admin/AdminLanding")
          }
          else {
            LocalSignin(whoIsLogged);
            router.push("./property/landing");
          }



        } else {
          /** Toast emitter for error wrong email password combination  **/
          toast.error("Please check your email and password", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          logger.error('Incorrect email and password combination.')

        }
      })

      .catch((error) => {
        logger.error('Sign In error!');

        /** Toast emitter for Sign in error  **/
        toast.error("Sign in Error!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div className="bg-gray-50 p-8">
      <div
        className="mx-auto  flex flex-col justify-center items-center 
  px-4 pt-8 pt:mt-0"
      >
        <span
          className="self-center text-3xl  mb-4 mt-2 tracking-normal font-bold
       text-gray-700 whitespace-nowrap"
        >
          enGage 
        </span>

        <div className="bg-white shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
          <div className="p-4 sm:p-8 lg:p-16 space-y-8">
            <h2 className="text-2xl lg:text-3xl capitalize font-bold text-gray-700">
              {language?.title}
            </h2>

            {/** Signin Form **/}
            <form className="mt-8 space-y-6" action="#">
              <div>
                <label
                  className="text-base font-semibold
                   text-gray-700 
                  block mb-2"
                >
                  {language?.email}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 
                  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                   focus:border-cyan-600 block w-full p-2.5"
                  onChange={(e) =>
                    setSigninDetails({
                      ...signinDetails,
                      email: e.target.value,
                    })
                  }
                  placeholder={language?.enteremail}
                  required
                ></input>
              </div>
              <div>
                <label
                  className="text-base font-semibold
                   text-gray-700 block mb-2"
                >
                  {language?.password}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) =>
                    setSigninDetails({
                      ...signinDetails,
                      password: e.target.value,
                    })
                  }
                  placeholder={language?.enterpassword}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  required
                ></input>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember"
                    type="checkbox"
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    onClick={()=>{setCookieData(!current); setCurrent(!current)}}
                    
                  />
                </div>
                <div className="text-sm ml-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {language?.remember}
                  </label>
                </div>
                <a
                  href=""
                  className="text-sm font-semibold
                   text-teal-500 hover:underline  ml-auto"
                >
                  {language?.lost}
                </a>
              </div>

              <button
                type="submit"
                onClick={(e) => {
                  submitSignIn(e);
                }}
                className="font-semibold text-white bg-cyan-600 
              hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 mt-6
              rounded-lg text-base px-5 py-2 capitalize w-full sm:w-auto text-center"
              >
                {language?.title}
              </button>
              <div className="text-base font-semibold text-gray-500">
                {language?.remember}
                <a href="" className="text-teal-500 hover:underline px-2">
                  {language?.create}
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="mx-64 mt-2 text-teal-600">
        <div>
        <button
                className={lang === "en"?"text-teal-600 text-sm font-bold mx-1 ":"mx-1 text-teal-600 text-sm"}
                onClick={() => {
                  setLang("en");
                  changelanguage("en");
                }}
              >
                English 
              </button>|
              <button
                 className={lang === "fr"?"mx-1 text-teal-600 text-sm font-bold":"mx-1 text-teal-600 text-sm"}
                onClick={() => {
                  setLang("fr");
                  changelanguage("fr");
                }}
              >
                Français 
              </button>|
              <button
                 className={lang === "ar"?"text-teal-600 text-sm font-bold mx-1":"mx-1 text-teal-600 text-sm"}
                onClick={() => {
                  setLang("ar");
                  changelanguage("ar");
                }}
              >
                عربى
              </button>
            </div>
       </div>
      </div>

      {/** Toast Container **/}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
export default Signin;

Signin.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}
