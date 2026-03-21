import Button from "@mui/material/Button";
import { FaAngleRight } from "react-icons/fa6";
import { BsGraphUp } from "react-icons/bs";
import { FaProductHunt } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaNewspaper } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { useContext } from "react";
import { MyContext } from "../../App";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [activeTab, setactiveTab] = useState(0);
  const [isToggleSubmenu, setIsToggleSubmenu] = useState(true);

  const context = useContext(MyContext);

  const isOpenSubmenu = (index) => {
    setactiveTab(index);
    setIsToggleSubmenu(!isToggleSubmenu);
  };
  return (
    <>
      <div className="sidebar">
        <ul>
          <li>
            <Link to="/">
              <Button
                className={`w-100 ${activeTab === 0 && isToggleSubmenu === true ? "active" : ""}`}
                onClick={() => isOpenSubmenu(0)}
              >
                <span className="icon">
                  <BsGraphUp />
                </span>
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Button
              className={`w-100 ${activeTab === 1 && isToggleSubmenu === true ? "active" : ""}`}
              onClick={() => isOpenSubmenu(1)}
            >
              <span className="icon">
                <FaProductHunt />
              </span>
              Products
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 1 && isToggleSubmenu === true ? "colapse" : "colapsed"}`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/product">Product List</Link>
                </li>
                <li>
                  <Link to="/product/upload">Product Upload</Link>
                </li>
                <li>
                  <Link to="/productWeight/add">Add Product Weight</Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <Button
              className={`w-100 ${activeTab === 2 && isToggleSubmenu === true ? "active" : ""}`}
              onClick={() => isOpenSubmenu(2)}
            >
              <span className="icon">
                <BiSolidCategory />
              </span>
              Categories
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 2 && isToggleSubmenu === true ? "colapse" : "colapsed"}`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/category">Category List</Link>
                </li>
                <li>
                  <Link to="/category/add">Add a Category</Link>
                </li>
                <li>
                  <Link to="/subCat">Sub Category List</Link>
                </li>
                <li>
                  <Link to="/subCat/add">Add a Sub Category</Link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <NavLink exact activeClassName="is-active" to="/orders">
              <Button
                className={`w-100 ${activeTab === 3 && isToggleSubmenu === true ? "active" : ""}`}
                onClick={() => isOpenSubmenu(3)}
              >
                <span className="icon">
                  <FaShoppingBasket />
                </span>
                Orders
              </Button>
            </NavLink>
          </li>
          <li>
            <Button
              className={`w-100 ${activeTab === 4 && isToggleSubmenu === true ? "active" : ""}`}
              onClick={() => isOpenSubmenu(4)}
            >
              <span className="icon">
                <FaNewspaper />
              </span>
              Home Slides
              <span className="arrow">
                <FaAngleRight />
              </span>
            </Button>
            <div
              className={`submenuWrapper ${activeTab === 4 && isToggleSubmenu === true ? "colapse" : "colapsed"}`}
            >
              <ul className="submenu">
                <li>
                  <Link to="/homeBannerSlide">Home Banner List</Link>
                </li>
                <li>
                  <Link to="/homeBannerSlide/add">Add Home Banner Slide</Link>
                </li>
              </ul>
            </div>
          </li>
          <li></li>
        </ul>

        <br />

        <div className="logoutWrapper">
          <div className="logoutBox">
            <Button variant="contained">
              <RiLogoutCircleRFill />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
