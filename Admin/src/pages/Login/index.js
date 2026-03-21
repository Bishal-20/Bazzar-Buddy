import { useEffect, useContext, useState } from "react";
import Logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";
import pattern from "../../assets/images/pattern.webp";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";

import googleIcon from "../../assets/images/googlelogo.png";
import { postData } from "../../utils/api";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputIndex, setInputIndex] = useState(0);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const context = useContext(MyContext);
  const history = useNavigate();
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
    isAdmin: true,
  });

//   useEffect(() => {
//     context.setIsHideSidebarAndHeader(true);

//     return () => {
//       context.setIsHideSidebarAndHeader(false);
//     };
//   }, []);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const signIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formFields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Email is required",
      });
      return false;
    }
    if (formFields.password === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Password is required",
      });
      return false;
    }
    postData("/api/user/signin", formFields).then((res) => {
      if (!res || !res.token) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: res?.msg || "Login failed",
        });
        setIsLoading(false);
        return;
      }

      const { user, token } = res;

      localStorage.setItem("token", token);

      const userObj = {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        isAdmin: user?.isAdmin,
      };

      localStorage.setItem("user", JSON.stringify(userObj));

      context.setUser(userObj);

      context.setIsLogin(true);

      context.setAlertBox({
        open: true,
        error: false,
        msg: "User Login Successful",
      });
      setIsLoading(false);

      history("/dashboard");
    });
  };


    const signInWithGoogle = async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
  
        const user = result.user;
  
        const fields = {
          name: user.displayName,
          email: user.email,
          password: null,
          images: user.photoURL,
          phone: user.phoneNumber,
        };
  
        const res = await postData("/api/user/authWithGoogle", fields);
  
        if (res?.error !== true) {
          localStorage.setItem("token", res.token);
  
          localStorage.setItem("user", JSON.stringify(res.user));
  
          context.setIsLogin(true);
          context.setUser(res.user);
  
          context.setAlertBox({
            open: true,
            error: false,
            msg: res.msg,
          });
  
          history("/");
        }
      } catch (error) {
        console.error("Google login error:", error);
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Google login failed",
        });
      }
    };

  return (
    <>
      <img src={pattern} className="pattern" alt="pattern" />
      <section className="loginSection">
        <div className="loginBox">
          <div className="logo text-center">
            <img src={Logo} width="150px" alt="logo" />
          </div>
          <h5 className="font-weight-bold">Login To Dashify</h5>
          <div className="wrapper mt-3 card border">
            <form onSubmit={signIn}>
              <div
                className={`form-group position-relative ${inputIndex === 0 && "focus"}`}
              >
                <span className="icon">
                  <MdEmail />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email Address"
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                  autoFocus
                  name="email"
                  onChange={onChangeInput}
                />
              </div>
              <div
                className={`form-group position-relative ${inputIndex === 1 && "focus"}`}
              >
                <span className="icon">
                  <RiLockPasswordFill />
                </span>
                <input
                  type={`${isShowPassword === true ? "text" : "password"}`}
                  className="form-control"
                  placeholder="Password"
                  onFocus={() => focusInput(1)}
                  onBlur={() => setInputIndex(null)}
                  name="password"
                  onChange={onChangeInput}
                />
                <span
                  className="toggleShowPassword"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword === true ? <IoEyeOff /> : <IoEye />}
                </span>
              </div>

              <div className="form-group">
                <Button
                  type="submit"
                  className="btn-pink btn-big w-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Sign In"}
                </Button>
              </div>

              <div className="form-group text-center mb-0">
                <Link to={"/forgot-password"} className="link">
                  Forgot Password
                </Link>
                <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                  <span className="line"></span>
                  <span className="txt">or</span>
                  <span className="line"></span>
                </div>
                <Button
                  variant="outlined"
                  color="error"
                  className="w-100 btn-lg btn-big loginwithGoogle"
                  onClick={signInWithGoogle}
                >
                  <img src={googleIcon} width="45px" />
                  &nbsp; Sign In with Google
                </Button>
              </div>
            </form>
          </div>

          <div className="wrapper mt-3 card border footer p-3">
            <span className="text-center">
              Don't have an account?
              <Link to={"/signUp"} className="link color ml-2">
                Register
              </Link>{" "}
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
