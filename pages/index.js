import { useEffect, useState } from "react";
import mode from '../components/darkmode'
import Axios from "axios";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import Button from "../components/Button";
import english from "../components/Languages/en"
import french from "../components/Languages/fr"
import arabic from "../components/Languages/ar"
const logger = require("../services/logger");
var language;
function Signin(args) {
  const [lang, setLang] = useState("");
  const [darkModeSwitcher, setDarkModeSwitcher] = useState(false)
  const [spinner, setSpinner] = useState(0)
  /** Router for Redirection **/
  const router = useRouter();
  const { locale } = router;
  const [current, setCurrent] = useState(false)
  const [error, setError] = useState({})
  /** State for internationalization **/
  useEffect(() => {
    firstfun()
    getCookieData();
  }, [locale])
  const firstfun = () => {
    if (typeof window !== 'undefined') {
      locale = localStorage.getItem("Language");
      /*checks if language is already there in local storage */
      if (locale === null) {
        language = english
        setLang("en")
        localStorage.setItem("Language", "en")
      }
      else {
        if (locale === "ar") {
          language = arabic;
          setLang("ar")
        }
        if (locale === "en") {
          language = english;
          setLang("en")
        }
        if (locale === "fr") {
          language = french;
          setLang("fr")
        }
      }
    }
  }
  //write into cookies
  function setCookieData(checked) {
    if (checked) {
      Cookies.set("email", signinDetails.email, { expires: 30 })
      Cookies.set("password", signinDetails.password, { expires: 30 })
    }
    else {
      Cookies.remove("email");
      Cookies.remove("password")
    }
  }
  //read from cookies
  function getCookieData() {
    var mail = Cookies.get("email");
    var pass = Cookies.get("password")
    setSigninDetails({ "email": mail, "password": pass })
    if (mail != undefined) {
      document.getElementById('email').value = mail;
      document.getElementById('password').value = pass;
    }
  }
  /** Function for Internationalisation **/
  const changelanguage = (item) => {
    const locale = item;
    /** Language selected stored to the localstorage **/
    localStorage.setItem("Language", locale);
    language = locale;
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
    if (validation(signinDetails)) {
      setSpinner(1)
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
            setSpinner(0)
            /** Toast emitter for error wrong email password combination  **/
            toast.error("API: The password that you've entered is incorrect.", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            logger.error("API: The password that you've entered is incorrect.")

          }
        })

        .catch((error) => {
          if (error.message === `Request failed with status code 401`) {
            logger.error("API:The email address you entered isn't connected to an account.");
            setSpinner(0);
            /** Toast emitter fo: Invalid Email error  **/
            toast.error("API: The email address you entered isn't connected to an account.", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          else {
            logger.error('API: Network error');
            setSpinner(0);
            /** Toast emitter for Sign in error  **/
            toast.error("API: Network error!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }

        });
    }
  };
  // Validation Function
  const validation = (signinDetails) => {
    var Result = checkFormData(signinDetails);
    if (Result === true) {
      return true;
    }
    else {
      setError(Result);
      return false;

    }

  }
  //Checking Form Data for Validations
  const checkFormData = (signinDetails) => {
    var error = {};
    if (signinDetails?.email === "" || signinDetails.email === undefined) {
      error.email = "The email field is required."
    }
    if ((!signinDetails?.email?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && (signinDetails?.email != "" && signinDetails.email != undefined))) {
      error.email = "The email field is in invalid format."
    }
    if (signinDetails?.password === "" || signinDetails.password === undefined) {
      error.password = "The password field is required"
    }

    return Object.keys(error).length === 0 ? true : error;

  }
  return (
    <div className={darkModeSwitcher === false ? `${mode.light_mode.greybackground} min-h-screen p-4` : `${mode?.dark_mode?.greybackground} min-h-screen p-4`} >
      <div className="mx-auto  flex flex-col justify-center items-center px-4 pt-8 pt:mt-0">
        <span className={darkModeSwitcher === false ? `${mode.light_mode.text} self-center text-3xl  mb-4 mt-2 tracking-normal font-bold  whitespace-nowrap` : `${mode.dark_mode.text} self-center text-3xl  mb-4 mt-2 tracking-normal font-bold  whitespace-nowrap`}>
          enGage
        </span>

        <div className={darkModeSwitcher === false ? `${mode.light_mode.whitebackground} shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0` : `${mode?.dark_mode?.whitebackground} shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0`} >
          <div className="p-4 sm:p-8 lg:p-16 space-y-8">
            <h2 className={darkModeSwitcher === false ? `${mode.light_mode.text} text-2xl lg:text-3xl capitalize font-bold` : `${mode?.dark_mode?.text} text-2xl lg:text-3xl capitalize font-bold`}  >
              {language?.title}
            </h2>
            {/** Signin Form **/}
            <form className="mt-8 space-y-6" action="#">
              <div>
                <label
                  className={darkModeSwitcher === false ? `${mode.light_mode.text} text-base font-semibold block mb-2` : `${mode?.dark_mode?.text} text-base font-semibold block mb-2`}
                >
                  {language?.email}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={darkModeSwitcher === false ? `${mode.light_mode.whitebackground} border border-gray-300 
                  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                   focus:border-cyan-600 block w-full p-2.5`  : `${mode?.dark_mode?.whitebackground} border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-cyan-600
                    focus:border-cyan-600 block w-full p-2.5`}
                  onChange={(e) => {
                    setSigninDetails({
                      ...signinDetails,
                      email: e.target.value,
                    }),
                    setError({ ...error, email: '' })
                  }
                  }
                  placeholder={language?.enteremail}
                  required
                ></input>
                <p className="text-red-700 font-light">
                  {error?.email}
                </p>
              </div>
              <div>
                <label
                  className={darkModeSwitcher === false ? `${mode.light_mode.text} text-base font-semibold block mb-2` : `${mode?.dark_mode?.text} text-base font-semibold block mb-2`}
                >
                  {language?.password}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => {
                    setSigninDetails({
                      ...signinDetails,
                      password: e.target.value,
                    })
                    setError({ ...error, password: '' })
                  }
                  }
                  placeholder={language?.enterpassword}
                  className={darkModeSwitcher === false ? `${mode.light_mode.whitebackground} border border-gray-300 
                  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                   focus:border-cyan-600 block w-full p-2.5`  : `${mode?.dark_mode?.whitebackground} border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-cyan-600
                    focus:border-cyan-600 block w-full p-2.5`} required
                ></input>
                <p className="text-red-700 font-light">
                  {error?.password}
                </p>
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
                    onClick={() => { setCookieData(!current); setCurrent(!current) }}

                  />
                </div>
                <div className="text-sm ml-3">
                  <label
                    className={darkModeSwitcher === false ? `${mode.light_mode.text} text-sm font-semibold ` : `${mode?.dark_mode?.text} text-sm font-semibold `}
                  >
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
              <div className={spinner === 0 ? 'block' : 'hidden'}>
                <Button Primary={language?.Signin} onClick={(e) => {
                  submitSignIn(e);

                }} />
              </div>
              <div className={spinner === 1 ? 'block' : 'hidden'}>
                <Button Primary={language?.SpinnerSignin} />
              </div>

              <div className={darkModeSwitcher === false ? `${mode.light_mode.text} text-base font-semibold` : `${mode?.dark_mode?.text} text-base font-semibold `}>
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
              className={lang === "en" ? "text-teal-600 text-sm font-bold mx-1 " : "mx-1 text-teal-600 text-sm"}
              onClick={() => {
                setLang("en");
                changelanguage("en");
              }}
            >
              English
            </button>|
            <button
              className={lang === "fr" ? "mx-1 text-teal-600 text-sm font-bold" : "mx-1 text-teal-600 text-sm"}
              onClick={() => {
                setLang("fr");
                changelanguage("fr");
              }}
            >
              Français
            </button>|
            <button
              className={lang === "ar" ? "text-teal-600 text-sm font-bold mx-1" : "mx-1 text-teal-600 text-sm"}
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
      <div className="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 box border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 mr-10">
        <div className={darkModeSwitcher === false ? `mx-2  text-slate-600` : `mx-2  text-slate-200 `}
        >Dark Mode</div>
        <div className="flex">
          <div className="form-check mt-1 mr-1 form-check-inline">
            <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
              <input type="checkbox"
                value={darkModeSwitcher} checked={darkModeSwitcher === true}
                onChange={() => { setDarkModeSwitcher(!darkModeSwitcher) }}
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
