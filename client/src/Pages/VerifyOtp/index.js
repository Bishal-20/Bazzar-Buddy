import { useState, useContext } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const signupData = JSON.parse(sessionStorage.getItem("signupData"));
  const email = signupData?.email || localStorage.getItem("userEmail") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      } else {
        let newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerifyOTP = async () => {
    console.log("OTP array:", otp);
    console.log("OTP value:", otp.join(""));
    const otpValue = otp.join("");
    if (!otpValue) {
      context.setAlertBox({ open: true, error: true, msg: "Please enter OTP" });
      return;
    }

    const mode = sessionStorage.getItem("otpMode");

    setIsLoading(true);

    try {
      if (mode === "signup") {
        const signupData = JSON.parse(sessionStorage.getItem("signupData"));

        const res = await postData("/api/user/signup", {
          name: signupData.name,
          phone: signupData.phone,
          email: signupData.email,
          password: signupData.password,
          otp: otpValue,
        });

        if (res.success) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));

          context.setIsLogin(true);
          context.setUser(res.user);

          context.setAlertBox({
            open: true,
            error: false,
            msg: "Account created successfully",
          });

          navigate("/");
        } else {
          context.setAlertBox({ open: true, error: true, msg: res.msg });
        }
      } else if (mode === "forgot") {
        const email = localStorage.getItem("userEmail");

        const res = await postData("/api/user/forgot-password/verify-otp", {
          email,
          otp: otpValue,
          checkOnly: true,
        });

        if (res.success) {
          localStorage.setItem("otpVerifiedEmail", email);
          localStorage.setItem("otpVerifiedValue", otpValue);

          context.setAlertBox({
            open: true,
            error: false,
            msg: "OTP verified!",
          });

          navigate("/changepassword");
        } else {
          context.setAlertBox({ open: true, error: true, msg: res.msg });
        }
      }
    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: error?.response?.data?.msg || "OTP verification failed",
      });
    }

    setIsLoading(false);
  };

  return (
    <section className="section Otppage">
      <div className="container">
        <div className="box card p-4 shadow">
          <h3 className="text-center mb-4">Verify OTP</h3>
          <p className="text-center text-muted">
            OTP sent to <strong>{email}</strong>
          </p>

          <div className="otp-container mb-3">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-input"
              />
            ))}
          </div>

          <Button
            className="btn-blue btn-lg btn-big mt-2"
            onClick={handleVerifyOTP}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VerifyOTP;
