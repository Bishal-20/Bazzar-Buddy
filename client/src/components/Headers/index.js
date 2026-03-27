import Logo from "../../assets/images/logo.jpg";
import { Link } from "react-router-dom";
import CountryDropdown from "./CountryDropdown";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Button from "@mui/material/Button";
import UserImg from "../../assets/images/userimg.webp";
import SearchBar from "./SearchBar";
import Navigation from "./Navigation";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Logout from "@mui/icons-material/Logout";
import React, { useContext, useState, useMemo } from "react";
import { MyContext } from "../../App";

const Header = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    setAnchorEl(null);
    localStorage.clear();
    context.setIsLogin(false);
  };

  const totalPrice = useMemo(() => {
    if (!Array.isArray(context.cartData)) return 0;
    return context.cartData
      .map((item) => parseInt(item.price) * item.quantity)
      .reduce((total, value) => total + value, 0);
  }, [context.cartData]);

  const totalCount = useMemo(() => {
    if (!Array.isArray(context.cartData)) return 0;
    return context.cartData.reduce((acc, item) => acc + item.quantity, 0);
  }, [context.cartData]);

  return (
    <div className="headerWrapper">
      <div className="top-strip bg-purple">
        <div className="container">
          <p className="mb-0 mt-0 text-center">
            Your friendly partner for everyday groceries.
          </p>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <div className="row">
            <div className="logoWrapper col-sm-2 d-flex justify-content-center align-items-center">
              <Link to={"/"}>
                <img src={Logo} alt="logo" className="img-fluid" />
              </Link>
            </div>

            <div className="col-sm-10 d-flex justify-content-between align-items-center part2 w-100">
              {context?.countryList?.length !== 0 && <CountryDropdown />}
              <SearchBar />

              <div className="part3 d-flex align-items-center ml-auto">
                {!context.isLogin ? (
                  <Link to="/signIn">
                    <Button className="btn-blue btn-round">Sign In</Button>
                  </Link>
                ) : (
                  <>
                    <Button
                      className="circle p-0 overflow-hidden"
                      onClick={handleClick}
                    >
                      <img
                        src={context.user?.profileImage?.url || UserImg}
                        alt="User"
                        className="w-100 h-100"
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = UserImg;
                        }}
                      />
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      id="acc-dropdown-menu"
                      open={open}
                      onClose={handleClose}
                      slotProps={{
                        paper: {
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
                            "&::before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <Link to="/my-account">
                        <MenuItem onClick={handleClose}>
                          <Avatar className="mr-2" /> My Account
                        </MenuItem>
                      </Link>
                      <Divider />
                      <Link to="/orders">
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <LocalMallIcon fontSize="small" />
                          </ListItemIcon>
                          My Orders
                        </MenuItem>
                      </Link>
                      <Link to="/whislist">
                        <MenuItem>
                          <ListItemIcon>
                            <FavoriteIcon fontSize="small" />
                          </ListItemIcon>
                          Wishlist
                        </MenuItem>
                      </Link>
                      <MenuItem onClick={logout}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                )}

                <div className="ml-3 cartTab d-flex align-items-center">
                  <span className="price">Rs. {totalPrice}</span>
                  <div className="position-relative ml-2">
                    <Link to="/cart">
                      <Button className="circle2 ml-2">
                        <HiOutlineShoppingBag />
                      </Button>
                    </Link>
                    <span className="count d-flex align-items-center justify-content-center">
                      {totalCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Navigation />
    </div>
  );
};

export default Header;
