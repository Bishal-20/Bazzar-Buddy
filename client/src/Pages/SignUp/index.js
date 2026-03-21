import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import Logo from "../../assets/images/logo.jpg";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Signup from "../../assets/images/signup.png";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });

  const context = useContext(MyContext);
  const history = useNavigate();
  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, []);

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const register = async (e) => {
    e.preventDefault();

    sessionStorage.setItem("signupData", JSON.stringify(formFields));

    if (
      formFields.name === "" ||
      formFields.email === "" ||
      formFields.phone === "" ||
      formFields.password === ""
    ) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "All fields are required",
      });
      return;
    }

    setIsLoading(true);

    const res = await postData("/api/user/send-otp", {
      email: formFields.email,
    });

    setIsLoading(false);

    if (res.success) {
      sessionStorage.setItem("signupData", JSON.stringify(formFields));

      context.setAlertBox({
        open: true,
        error: false,
        msg: "OTP sent successfully",
      });

      history("/verify-otp");
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: res?.msg || "Failed to send OTP",
      });
    }

    setIsLoading(false);

    if (res.success) {
      sessionStorage.setItem("signupData", JSON.stringify(formFields));
      sessionStorage.setItem("otpMode", "signup");
      history("/verify-otp");
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: res.msg,
      });
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
    <section className="section SignInpage SignUppage">
      <div className="container">
        <div className=" box card p-3 shadow border">
          <div className="text-center">
            <img src={Logo} style={{ width: "150px" }} />
          </div>

          <form className="mt-3" onSubmit={register}>
            <h2 className="mb-4">Sign Up</h2>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    id="standard-basic"
                    label="Name"
                    type="text"
                    variant="standard"
                    className="w-100"
                    name="name"
                    onChange={onChangeInput}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    id="standard-basic"
                    label="Contact No."
                    type="text"
                    variant="standard"
                    className="w-100"
                    name="phone"
                    onChange={onChangeInput}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <TextField
                id="standard-basic"
                label="Email"
                type="email"
                variant="standard"
                className="w-100"
                name="email"
                onChange={onChangeInput}
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
              />
            </div>

            <Button
              type="submit"
              className="btn-blue btn-lg btn-big ml-5"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>

            <p className="mt-2">
              Have an account?{" "}
              <Link to="/signIn" className="border-effect">
                Sign In
              </Link>
            </p>

            <h5 className="mt-4 text-center font-weight-bold">
              Or continue with social account
            </h5>

            <Button onClick={signInWithGoogle}>
              <img src={Signup} className="w-100" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
