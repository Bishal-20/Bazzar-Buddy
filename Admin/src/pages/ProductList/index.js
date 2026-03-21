import DashboardBox from "../Dashboard/components/dashboardBox";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { FaEye, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import Rating from "@mui/material/Rating";
import Pagination from "@mui/material/Pagination";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { deleteData, fetchDataFromApi } from "../../utils/api";

const ProductList = () => {
  const [showBy, setshowBy] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
  });
  const [catBy, setCatBy] = useState("");
  const [productList, setProductList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const context = useContext(MyContext);

  const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
      ...theme.applyStyles("dark", {
        backgroundColor: emphasize(theme.palette.grey[800], 0.06),
      }),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[100], 0.12),
      ...theme.applyStyles("dark", {
        backgroundColor: emphasize(theme.palette.grey[800], 0.12),
      }),
    },
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  }));

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(40);

    fetchDataFromApi(`/api/product?page=${page}`).then((res) => {
      setProductList(res.productList);
      setTotalPages(res.totalPages);
      context.setProgress(100);
    });
    context.setProgress(70);
    fetchDataFromApi("/api/dashboard/stats").then((res) => {
      setDashboardStats(res);
    });
  }, [page]);

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
    <div className="productContent w-100">
      <div className="card shadow border-0 w-100 p-4 res-col">
        <h4>Product List</h4>
        <div className="ml-auto d-flex align-items-center presentation breadcrumbs">
          <Breadcrumbs aria-label="breadcrumb">
            <StyledBreadcrumb
              component={Link}
              to="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb component={Link} to="/product" label="Product" />
          </Breadcrumbs>
          <Link to="/product/upload">
            <Button className="btn-pink ml-3 pl-3 pr-3">ADD PRODUCT</Button>
          </Link>
        </div>
      </div>

      <div className="dashboardBoxWrapperproduct">
        <DashboardBox
          color={["#1da256", "#48d483"]}
          icon={<FaUserCircle />}
          grow={true}
          title="Total Users"
          value={dashboardStats.users}
        />

        <DashboardBox
          color={["#c012e2", "#eb64fe"]}
          icon={<FaCartPlus />}
          title="Total Orders"
          value={dashboardStats.orders}
        />

        <DashboardBox
          color={["#2c78e5", "#60aff5"]}
          icon={<FaShoppingBag />}
          title="Total Products"
          value={dashboardStats.products}
        />
      </div>

      <div className="card shadow border-0 p-3 mt-4">
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
                <MenuItem value={10}>9</MenuItem>
                <MenuItem value={20}>18</MenuItem>
                <MenuItem value={30}>27</MenuItem>
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
                <th>PRODUCT WEIGHT</th>
                <th>CATEGORY</th>
                <th>SUB CAT</th>
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
                    <td>
                      {Array.isArray(item.productWeight) &&
                      item.productWeight.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {item.productWeight.map((w) => (
                            <span
                              key={w._id}
                              className="badge badge-primary mr-2 mt-2"
                            >
                              {w.productWeight}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{item.category?.name || "—"}</td>
                    <td>{item.subCat?.subCat || "—"}</td>
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

                        <Link to={`/product/edit/${item._id}`}>
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
  );
};

export default ProductList;
