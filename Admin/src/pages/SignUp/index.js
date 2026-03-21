import { useEffect, useContext, useState } from "react";
import Logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";
import pattern from "../../assets/images/pattern.webp";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";

import googleIcon from "../../assets/images/googlelogo.png";
import { postData } from "../../utils/api";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const [inputIndex, setInputIndex] = useState(0);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const history = useNavigate();
  const context = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isAdmin: true,
  });



  const focusInput = (index) => {
    setInputIndex(index);
  };

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };
  const signUp = (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      if (formFields.name === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Name is required",
        });
        return false;
      }
      if (formFields.email === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Email is required",
        });
        return false;
      }
      if (formFields.phone === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Phone is required",
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
      if (formFields.confirmPassword === "") {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Confirm Password is required",
        });
        return false;
      }
      if (formFields.password !== formFields.confirmPassword) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Password does not match",
        });
        return false;
      }

      postData("/api/user/signup", formFields).then((res) => {
        if (res.status) {
          context.setAlertBox({
            open: true,
            error: false,
            msg: "Registration Successful. Please Login to Continue...",
          });
          setTimeout(() => {
            history("/login");
          }, 2000);
        } else {
          setIsLoading(false);
          context.setAlertBox({
            open: true,
            error: true,
            msg: res.msg,
          });
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
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
      <section className="loginSection signupSection">
        <div className="row">
          <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
            <h1>
              BEST UI/UX FASHION{" "}
              <span style={{ color: "#fc0c65" }}>ECOMMERCE DASHBOARD</span> AND
              ADMIN PANEL
            </h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="w-100 mt-4 res-btn">
              <Link to={"/"}>
                <Button className="btn-pink btn-lg btn-big">
                  <IoMdHome /> &nbsp;Go To Home
                </Button>
              </Link>
            </div>
          </div>
          <div className="col-md-4 pr-0">
            <div className="loginBox">
              <div className="logo text-center">
                <img src={Logo} width="150px" alt="logo" />
              </div>
              <h5 className="font-weight-bold head">Register a New account</h5>
              <div className="wrapper mt-3 card border">
                <form onSubmit={signUp}>
                  <div
                    className={`form-group position-relative ${inputIndex === 0 && "focus"}`}
                  >
                    <span className="icon">
                      <FaUserCircle />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Name"
                      onFocus={() => focusInput(0)}
                      onBlur={() => setInputIndex(null)}
                      autoFocus
                      name="name"
                      onChange={onChangeInput}
                    />
                  </div>
                  <div
                    className={`form-group position-relative ${inputIndex === 1 && "focus"}`}
                  >
                    <span className="icon">
                      <MdEmail />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email Address"
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                      name="email"
                      onChange={onChangeInput}
                    />
                  </div>
                  <div
                    className={`form-group position-relative ${inputIndex === 2 && "focus"}`}
                  >
                    <span className="icon">
                      <FaPhoneAlt />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Phone Number"
                      onFocus={() => focusInput(2)}
                      onBlur={() => setInputIndex(null)}
                      name="phone"
                      onChange={onChangeInput}
                    />
                  </div>
                  <div
                    className={`form-group position-relative ${inputIndex === 3 && "focus"}`}
                  >
                    <span className="icon">
                      <RiLockPasswordFill />
                    </span>
                    <input
                      type={`${isShowPassword === true ? "text" : "password"}`}
                      className="form-control"
                      placeholder="Enter Your Password"
                      onFocus={() => focusInput(3)}
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
                  <div
                    className={`form-group position-relative ${inputIndex === 4 && "focus"}`}
                  >
                    <span className="icon">
                      <IoShieldCheckmark />
                    </span>
                    <input
                      type={`${isShowConfirmPassword === true ? "text" : "password"}`}
                      className="form-control"
                      placeholder="Confirm Your Password"
                      onFocus={() => focusInput(4)}
                      onBlur={() => setInputIndex(null)}
                      name="confirmPassword"
                      onChange={onChangeInput}
                    />
                    <span
                      className="toggleShowPassword"
                      onClick={() =>
                        setIsShowConfirmPassword(!isShowConfirmPassword)
                      }
                    >
                      {isShowConfirmPassword === true ? (
                        <IoEyeOff />
                      ) : (
                        <IoEye />
                      )}
                    </span>
                  </div>

                  <FormControlLabel
                    control={<Checkbox />}
                    label="I agree to all the Terms and Conditions"
                  />

                  <div className="form-group">
                    <Button
                      type="submit"
                      className="btn-pink btn-big w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing up..." : "Sign Up"}
                    </Button>
                  </div>

                  <div className="form-group text-center mb-0">
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

                  <div className="wrapper mt-3 card border footer p-3">
                    <span className="text-center">
                      Already have an account?
                      <Link to={"/login"} className="link color ml-2">
                        Login
                      </Link>{" "}
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
