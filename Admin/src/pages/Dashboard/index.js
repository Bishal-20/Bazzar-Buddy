import DashboardBox from "./components/dashboardBox";
import CustomTooltip from "../../components/customTooltip";
import React, { useContext, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { LiaStarSolid } from "react-icons/lia";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import HistoryIcon from "@mui/icons-material/History";
import { HiDotsVertical } from "react-icons/hi";
import { useState } from "react";
import {
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [showBy, setshowBy] = useState("");
  const [catBy, setCatBy] = useState("");
  const [productList, setProductList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    reviews: 0,
    sales: 0,
  });
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const options = ["Last Day", "Last Week", "Last Month", "Last Year"];

  const ITEM_HEIGHT = 48;

  const context = useContext(MyContext);

  useEffect(() => {
    // context.setIsHideSidebarAndHeader(false);

    window.scrollTo(0, 0);
    context.setProgress(40);

    fetchDataFromApi(`/api/product?page=${page}`).then((res) => {
      setProductList(res.productList);
      setTotalPages(res.totalPages);
    });
    fetchDataFromApi("/api/dashboard/stats").then((res) => {
      setStats(res);
    });
    fetchDataFromApi("/api/dashboard/sales-chart").then((res) => {
      setSalesData(res);
      console.log("sales chart data:", res);
      context.setProgress(100);
    });
  }, [page]);
  const lastMonthSales =
    salesData.length > 1 ? salesData[salesData.length - 2]?.value : 0;

  const delteProduct = (id) => {
    context.setProgress(40);

    deleteData(`/api/product/${id}`)
      .then(() => {
        setProductList((prev) => prev.filter((item) => item._id !== id));

        context.setProgress(100);
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Product Deleted",
        });
      })
      .catch((err) => {
        context.setProgress(100);
        console.error(err.response?.data || err.message);
      });
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-8">
            <div className="dashboardBoxWrapper">
              <DashboardBox
                title="Total Users"
                value={stats.users}
                color={["#1da256", "#48d483"]}
                icon={<FaUserCircle />}
                grow={true}
              />

              <DashboardBox
                title="Total Orders"
                value={stats.orders}
                color={["#c012e2", "#eb64fe"]}
                icon={<FaCartPlus />}
              />

              <DashboardBox
                title="Total Products"
                value={stats.products}
                color={["#2c78e5", "#60aff5"]}
                icon={<FaShoppingBag />}
              />

              <DashboardBox
                title="Total Reviews"
                value={stats.reviews}
                color={["#e1950e", "#f3cd29"]}
                icon={<LiaStarSolid />}
                grow={true}
              />
            </div>
          </div>

          <div className="col-md-4 topPart2">
            <div className="box graphBox">
              <div className="d-flex align-items-center w-100 bottomEle">
                <h4 className="text-white mb-0">Total Sales</h4>
                <div className="ml-auto">
                  <Button className="ml-auto toggleIcon" onClick={handleClick}>
                    <HiDotsVertical />
                  </Button>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    slotProps={{
                      paper: {
                        style: {
                          maxHeight: ITEM_HEIGHT * 4.5,
                          width: "20ch",
                        },
                      },
                      list: {
                        "aria-labelledby": "long-button",
                      },
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem
                        key={option}
                        selected={option === "Last Day"}
                        onClick={handleClose}
                      >
                        <HistoryIcon /> &nbsp; {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              </div>

              <h3 className="text-white font-weight-bold">₹ {stats.sales}</h3>
              <p>₹ {lastMonthSales} in last month</p>
              <div className="chartContainer fullChart">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={salesData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="areaFade" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                      </linearGradient>
                    </defs>
                    <Tooltip cursor={false} content={<CustomTooltip />} />

                    <CartesianGrid
                      stroke="rgba(255,255,255,1)"
                      strokeDasharray="2 6"
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      fill="rgba(255,255,255,0.3)"
                      stroke="none"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
                    />
                    <YAxis
                      tickFormatter={() => ""}
                      axisLine={false}
                      tickLine={false}
                      width={0}
                    />

                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="rgba(255,255,255,0.75)"
                      strokeWidth={4}
                      dot={false}
                      activeDot={{ r: 6, fill: "#fff" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">Best Selling Products</h3>
          <div className="row cardfilters">
            <div className="col-md-3">
              <h4>Show By</h4>
              <FormControl
                sx={{ m: 1, minWidth: 120 }}
                size="small"
                className="w-100"
              >
                <Select
                  value={showBy}
                  onChange={(e) => setshowBy(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  className="w-100"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>12</MenuItem>
                  <MenuItem value={20}>24</MenuItem>
                  <MenuItem value={30}>36</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-md-3">
              <h4>Category By</h4>
              <FormControl
                sx={{ m: 1, minWidth: 120 }}
                size="small"
                className="w-100"
              >
                <Select
                  value={catBy}
                  onChange={(e) => setCatBy(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  className="w-100"
                >
                  <MenuItem value="">
                    <em value={null}>None</em>
                  </MenuItem>
                  {context.catData?.categoryList?.length !== 0 &&
                    context.catData.categoryList.map((cat, index) => {
                      return (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-bordered v-align">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>BRAND</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>RATING</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(productList) &&
                  productList.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex productBox align-items-center">
                          <div className="imgWrapper">
                            <img
                              src={
                                item.images?.images?.length > 0
                                  ? item.images.images[0].url
                                  : "/placeholder.png"
                              }
                              alt={item.name}
                              style={{
                                width: 80,
                                height: 60,
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          <div className="info">
                            <h6>{item.name}</h6>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td>{item.category?.name || "—"}</td>
                      <td>{item.brand}</td>
                      <td>
                        <del className="oldPrice">Rs {item.oldPrice}</del>
                        <span className="newPrice text-danger">
                          {" "}
                          Rs {item.price}
                        </span>
                      </td>
                      <td>{item.countInStock}</td>
                      <td>
                        <Rating
                          name="read-only"
                          defaultValue={item.rating}
                          readOnly
                          precision={0.5}
                        />
                      </td>
                      <td>
                        <div className="actions d-flex align-items-center">
                          <Link to={`/product/details/${item._id}`}>
                            <Button className="secondary" color="secondary">
                              <FaEye />
                            </Button>
                          </Link>
                          <Link to={`/product/edit/${item.id}`}>
                            <Button className="success" color="success">
                              <FaPencilAlt />
                            </Button>
                          </Link>
                          <Button
                            className="error"
                            color="error"
                            onClick={() => delteProduct(item._id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="d-flex tableFooter">
                <p>
                  showing <b>{productList.length}</b> results
                </p>
                <Pagination
                  count={totalPages}
                  page={page}
                  color="primary"
                  className="pagination"
                  showFirstButton
                  showLastButton
                  onChange={(e, value) => setPage(value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
