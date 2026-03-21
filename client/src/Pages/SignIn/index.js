import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import Logo from "../../assets/images/logo.jpg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Signup from "../../assets/images/signup.png";
import { postData } from "../../utils/api";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
    isAdmin: true,
  });

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const signIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formFields.email === "") {
      setIsLoading(false);
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Email is required",
      });
      return;
    }

    if (formFields.password === "") {
      setIsLoading(false);
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Password is required",
      });
      return;
    }

    try {
      const res = await postData("/api/user/signin", formFields);

      if (!res || !res.token) {
        throw new Error(res?.msg || "Login failed");
      }

      const { user, token } = res;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      context.setUser(user);
      context.setIsLogin(true);

      context.setAlertBox({
        open: true,
        error: false,
        msg: "User Login Successful",
      });

      context.setisHeaderFooterShow(true);
      history("/");
    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Wrong email or password",
      });
    } finally {
      setIsLoading(false);
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

  const forgotPassword = async () => {
    if (formFields.email === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please enter your email",
      });
      return;
    }

    try {
      const res = await postData("/api/user/forgot-password/send-otp", {
        email: formFields.email,
      });

      if (res?.success) {
        localStorage.setItem("userEmail", formFields.email);
        sessionStorage.setItem("otpMode", "forgot");
        context.setAlertBox({
          open: true,
          error: false,
          msg: "OTP sent to your email",
        });
        history("/verify-otp"); // now you can go to verify OTP page
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: res.msg,
        });
      }
    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: error?.response?.data?.msg || "Failed to send OTP",
      });
    }
  };

  return (
    <section className="section SignInpage">
      <div className="container">
        <div className=" box card p-3 shadow border">
          <div className="text-center">
            <img src={Logo} style={{ width: "150px" }} />
          </div>

          <form className="mt-3" onSubmit={signIn}>
            <h2 className="mb-4">Sign In</h2>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Email"
                type="email"
                variant="standard"
                className="w-100"
                name="email"
                onChange={onChangeInput}
                required
              />
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Password"
                type="password"
                variant="standard"
                className="w-100"
                name="password"
                onChange={onChangeInput}
                required
              />
            </div>

            <a className="border-effect cursor" onClick={forgotPassword}>
              Forgot Password?
            </a>

            <Button
              type="submit"
              className="btn-blue btn-lg btn-big"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </Button>

            <p className="mt-1">
              Not Registered?{" "}
              <Link to="/signUp" className="border-effect">
                Sign Up
              </Link>
            </p>

            <h5 className="mt-4 text-center font-weight-bold">
              Or continue with social account
            </h5>

            <Button className="googlebutton" onClick={signInWithGoogle}>
              <img src={Signup} className="w-100" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
