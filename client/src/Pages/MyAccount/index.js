import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import UserImg from "../../assets/images/userimg.webp";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { MdCloudUpload } from "react-icons/md";
import Button from "@mui/material/Button";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../App";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const MyAccount = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const [imagePreview, setImagePreview] = useState("/images/user.png");
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const context = useContext(MyContext);

  useEffect(() => {
    if (!token || !userId) {
      navigate("/signin");
      return;
    }

    const fetchUser = async () => {
      try {
        console.log(`${process.env.REACT_APP_API_URL}/api/user/${userId}`);
        const res = await axiosInstance.get(
          `${process.env.REACT_APP_API_URL}/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUser(res.data);

        const profileUrl = res.data.profileImage?.url;

        if (profileUrl && profileUrl.trim() !== "") {
          setImagePreview(profileUrl);
        } else {
          setImagePreview(UserImg);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/signin");
        }
      }
    };

    fetchUser();
  }, [token, userId, navigate]);

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/api/user/${userId}`,
        {
          name: user.name,
          phone: user.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Profile updated",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/api/user/profile-image/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const existingUser = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...existingUser,
        profileImage: response.data.profileImage,
      };

      setUser(updatedUser);
      context.setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setImagePreview(response.data.profileImage?.url || UserImg);
      setSelectedFile(null);

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Profile image updated",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordSave = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      return context.setAlertBox({
        open: true,
        error: true,
        msg: "All fields are required",
      });
    }

    if (passwordData.newPassword.length < 6) {
      return context.setAlertBox({
        open: true,
        error: true,
        msg: "Password must be at least 6 characters",
      });
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return context.setAlertBox({
        open: true,
        error: true,
        msg: "Passwords do not match",
      });
    }

    try {
      await axiosInstance.put(
        `${process.env.REACT_APP_API_URL}/api/user/change-password/${userId}`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Password updated successfully",
      });

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: err.response?.data?.message || "Error updating password",
      });
    }
  };

  return (
    <section className="section myAccountPage">
      <div className="container">
        <h2 className="hd">My Account</h2>

        <Box className="myAccountTabs card border-0 mt-3">
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit"
              variant="fullWidth"
            >
              <Tab label="Edit Profile" />
              <Tab label="Change Password" />
            </Tabs>
          </AppBar>

          <TabPanel value={value} index={0} dir={theme.direction}>
            {user && (
              <div className="row">
                <div className="col-md-4">
                  <div className="userImage">
                    <img src={imagePreview} alt="User" />
                    <div className="overlay d-flex align-items-center justify-content-center">
                      <MdCloudUpload />
                      <input
                        type="file"
                        className="fileInput"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  {selectedFile && (
                    <Button
                      className="btn-blue btn-lg btn-big bg-red"
                      onClick={handleImageUpload}
                      sx={{ mt: 2 }}
                    >
                      Upload Image
                    </Button>
                  )}
                </div>

                <div className="col-md-8">
                  <TextField
                    label="Name"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                    className="w-100 mb-3"
                  />

                  <TextField
                    label="Email"
                    value={user.email}
                    disabled
                    className="w-100 mb-3"
                  />

                  <TextField
                    label="Phone"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    className="w-100 mb-3"
                  />

                  <Button
                    className="btn-blue btn-lg btn-big bg-red"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="row">
              <div className="col-md-6">
                <TextField
                  label="Old Password"
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-100 mb-3"
                />

                <TextField
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-100 mb-3"
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-100 mb-3"
                />

                <Button
                  className="btn-blue btn-lg btn-big bg-red"
                  onClick={handlePasswordSave}
                >
                  Update Password
                </Button>
              </div>
            </div>
          </TabPanel>
        </Box>
      </div>
    </section>
  );
};

export default MyAccount;
