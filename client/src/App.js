import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Listing from "./Pages/Listing";
import Header from "./components/Headers";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Footer from "./components/Footer";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import MyWhislist from "./Pages/Whislist";
import Checkout from "./Pages/Checkout";
import VerifyOTP from "./Pages/VerifyOtp";
import Order from "./Pages/Orders";
import SearchPage from "./Pages/SearchPage";
import MyAccount from "./Pages/MyAccount";
import ProductModel from "./components/ProductModel";
import { fetchDataFromApi, postData } from "./utils/api";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { setProgressHandler } from "./utils/axiosInstance";
import LoadingBar from "react-top-loading-bar";
import ChangePassword from "./Pages/ChangePassword";

export const MyContext = createContext();

function App() {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState("");
  const [isOpenProductModel, setisOpenProductModel] = useState({
    id: "",
    open: false,
  });
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [productData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [mergedCategories, setMergedCategories] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [activeCat, setActiveCat] = useState("");
  const [addingInCart, setAddingInCart] = useState(false);
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
  });

  useEffect(() => {
    setProgressHandler(setProgress);
    getCountry("https://api.countrystatecity.in/v1/countries/IN/states", {
      headers: {
        "X-CSCAPI-KEY": process.env.REACT_APP_CSC_API_KEY,
      },
    });

    const token = localStorage.getItem("token");

    if (token) {
      fetchDataFromApi("/api/cart").then((res) => {
        setCartData(res?.cart || []);
      });
    }
  }, []);

  const getCartData = async () => {
    try {
      const res = await fetchDataFromApi("/api/cart");
      setCartData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    isOpenProductModel.open === true &&
      fetchDataFromApi(`/api/product/${isOpenProductModel.id}`).then((res) => {
        setProductData(res);
      });
  }, [isOpenProductModel]);

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      setCategoryData(res?.categoryList || []);
    });
  }, []);

  useEffect(() => {
    fetchDataFromApi("/api/subCat?perPage=200").then((res) => {
      setSubCategoryData(res?.subCategoryList || []);
    });
  }, []);

  useEffect(() => {
    if (!categoryData.length || !subCategoryData.length) return;

    const merged = categoryData.map((cat) => ({
      ...cat,
      subCategories: subCategoryData
        .filter((sub) => sub.category?._id === cat._id)
        .map((sub) => ({
          _id: sub._id,
          name: sub.subCat,
        })),
    }));

    setMergedCategories(merged);
  }, [categoryData, subCategoryData]);

  const addToCart = async (data) => {
    setAddingInCart(true);
    await postData("/api/cart/add", data)
      .then(async (res) => {
        setAlertBox({
          msg: "Product added to cart successfully",
          error: false,
          open: true,
        });
        setTimeout(() => {
          setAddingInCart(false);
        }, 1000);
        await getCartData();
      })
      .catch((error) => {
        const message = error?.response?.data?.msg || "Something went wrong";

        setAlertBox({
          msg: message,
          error: true,
          open: true,
        });
        setTimeout(() => {
          setAddingInCart(false);
        }, 1000);
      });
  };

  const getCountry = async (url, options) => {
    try {
      const res = await axios.get(url, options);
      setCountryList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  useEffect(() => {
    const location = localStorage.getItem("location");
    if (location) {
      setselectedCountry(location);
    }
  }, []);

  const values = {
    countryList,
    setselectedCountry,
    selectedCountry,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isOpenProductModel,
    setisOpenProductModel,
    setProgress,
    alertBox,
    setAlertBox,
    setIsLogin,
    isLogin,
    categoryData,
    activeCat,
    setActiveCat,
    subCategoryData,
    navCategories: mergedCategories,
    setUser,
    user,
    addToCart,
    addingInCart,
    setAddingInCart,
    setCartData,
    cartData,
    getCartData,
    setSearchData,
    searchData,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsLogin(true);
      setUser(JSON.parse(user));
    } else {
      setIsLogin(false);
      setUser(null);
    }
  }, []);

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        <LoadingBar
          color="#ff5b5b"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          height={6}
        />
        <Snackbar
          open={alertBox.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={alertBox.error === false ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>
        {isHeaderFooterShow === true && <Header />}
        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/cat/:id" exact={true} element={<Listing />} />
          <Route
            path="/product/:id"
            exact={true}
            element={<ProductDetails />}
          />
          <Route path="/cart" exact={true} element={<Cart />} />
          <Route path="/signIn" exact={true} element={<SignIn />} />
          <Route path="/signUp" exact={true} element={<SignUp />} />
          <Route path="/whislist" exact={true} element={<MyWhislist />} />
          <Route path="/checkout" exact={true} element={<Checkout />} />
          <Route path="/orders" exact={true} element={<Order />} />
          <Route path="/search" exact={true} element={<SearchPage />} />
          <Route path="/my-account" exact={true} element={<MyAccount />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </Routes>
        {isHeaderFooterShow === true && <Footer />}

        {isOpenProductModel.open === true && (
          <ProductModel data={productData} />
        )}
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
