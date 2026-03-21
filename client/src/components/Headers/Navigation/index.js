import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { TfiAngleDown } from "react-icons/tfi";
import { FaAngleRight } from "react-icons/fa";
import { useContext, useState } from "react";
import { MyContext } from "../../../App";
import { IoHomeOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";

const Navigation = () => {
  const [isopenSidebarVal, setisopenSidebarVal] = useState(false);
  const { navCategories } = useContext(MyContext);
  const location = useLocation();

  const getActiveClass = (catId) => {
    return location.pathname.includes(catId) ? "active" : "";
  };

  return (
    <nav>
      <div className="container">
        <div className="row">
          
          {/* LEFT PART */}
          <div className="col-sm-2 navPart1">
            <div className="cartWrapper">
              <Button
                className="allCatTab align-items-center"
                onClick={() => setisopenSidebarVal(!isopenSidebarVal)}
              >
                <span className="icon1 mr-2"><IoIosMenu /></span>
                <span className="text">ALL CATEGORIES</span>
                <span className="icon2 ml-2"><TfiAngleDown /></span>
              </Button>

              <div className={`sidebarNav ${isopenSidebarVal ? "open" : ""}`}>
                <ul>
                  {navCategories?.map(cat => (
                    <li key={cat._id} className={`list-inline-item ${getActiveClass(cat._id)}`}>
                      <Link to={`/cat/${cat._id}`}>
                        <Button>
                          {cat.name}
                          {cat.subCategories?.length > 0 && (
                            <FaAngleRight className="ml-auto" />
                          )}
                        </Button>
                      </Link>

                      {cat.subCategories?.length > 0 && (
                        <div className="submenu">
                          {cat.subCategories.map(sub => (
                            <Link
                              key={sub._id}
                              to={`/cat/${cat._id}?subCatName=${encodeURIComponent(sub.name)}`}
                            >
                              <Button>{sub.name}</Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT PART */}
          <div className="col-sm-10 navPart2 d-flex align-items-center">
            <ul className="list list-inline ml-auto active">
              <li className="list-inline-item">
              <Link to='/'>
                <Button><IoHomeOutline />&nbsp;Home</Button>
              </Link>
              <div className="submenu">
                <Link to='/cat/:id'><Button>Home 1</Button></Link>
                <Link to='/'><Button>Home 2</Button></Link>
                <Link to='/'><Button>Home 3</Button></Link>
                <Link to='/'><Button>Home 4</Button></Link>
                <Link to='/'><Button>Home 5</Button></Link>
                <Link to='/'><Button>Home 6</Button></Link>
              </div>
            </li>
              {navCategories?.map(cat => (
                <li key={cat._id} className={`list-inline-item nav-item ${getActiveClass(cat._id)}`}>
                  <Link to={`/cat/${cat._id}`} className="nav-link">
                    <Button>
                      <span>{cat.name}</span>
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;
