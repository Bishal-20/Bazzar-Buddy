import { useState, useContext, useEffect } from "react";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const navigate = useNavigate();

  const email = localStorage.getItem("otpVerifiedEmail");
  const otp = localStorage.getItem("otpVerifiedValue");

  useEffect(() => {
    if (!email || !otp) {
      navigate("/signin");
    }
  }, [email, otp, navigate]);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all fields",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Passwords do not match",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await postData("/api/user/forgot-password/verify-otp", {
        email,
        otp,
        newPassword,
      });

      if (res.success) {
        localStorage.removeItem("otpVerifiedEmail");
        localStorage.removeItem("otpVerifiedValue");

        context.setAlertBox({
          open: true,
          error: false,
          msg: res.msg || "Password changed successfully",
        });

        navigate("/signin");
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: res.msg || "Failed to change password",
        });
      }
    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: error?.response?.data?.msg || "Server error",
      });
    }

    setIsLoading(false);
  };

  return (
    <section className="section changePasswordPage">
      <div className="container d-flex align-items-center justify-content-center">
        <div className="card shadow p-4 changePassCard">
          <h3 className="text-center mb-2">Reset Your Password</h3>
          <p className="text-center text-muted mb-4">
            Enter a new password for your account
          </p>

          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            className="btn-blue btn-lg btn-big mt-3"
            onClick={handleChangePassword}
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
