import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./responsive.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import React, { createContext, useEffect, useRef } from "react";
import { useState } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import ProductUpload from "./pages/ProductList/addProduct";
import EditProduct from "./pages/ProductList/editProduct";
import Categorylist from "./pages/Category/categoryList.js";
import CategoryAdd from "./pages/Category/addCategory.js";
import EditCategory from "./pages/Category/editCategory.js";
import SubCatList from "./pages/Category/subCategoryList.js";
import SubCatAdd from "./pages/Category/addSubCat.js";
import EditSubCategory from "./pages/Category/editSubCat.js";
import Orders from "./pages/Orders";
import AddHomeBanner from "./pages/HomeBanner/addHomeSlide.js";
import HomeBannerList from "./pages/HomeBanner/homeSlideList.js";
import EditHomeBanner from "./pages/HomeBanner/editHomeSlide.js";
import ProtectedRoute from "./routes/protectedRoute.js";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LoadingBar from "react-top-loading-bar";
import { fetchDataFromApi } from "./utils/api.js";
import AddProductWeight from "./pages/ProductList/addProductWeight.js";
import { useLocation } from "react-router-dom";

const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [themeMode, setThemeMode] = useState(true);
  const [baseUrl, setBaseUrl] = useState("https://fullstack-ecommerce-server-0gij.onrender.com");
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLogin, setIsLogin] = useState(!!localStorage.getItem("token"));

  const [catData, setCatData] = useState({
    categoryList: [],
    totalPages: 0,
    page: 1,
  });
  const [subCatData, setSubCatData] = useState({
    subCategoryList: [],
    totalPages: 0,
    page: 1,
  });
  const [alertBox, setAlertBox] = useState({
    msg: "",
    error: false,
    open: false,
  });
  const location = useLocation();
  const hideLayoutRoutes = ["/login", "/signUp"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);
  useEffect(() => {
    if (themeMode === true) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("themeMode", "light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("themeMode", "dark");
    }
  }, [themeMode]);

  const loadCategories = async () => {
    try {
      setProgress(30);

      const res = await fetchDataFromApi(`/api/category?page=1&perPage=1000`);

      setProgress(70);

      setCatData({
        categoryList: res.categoryList || [],
        totalPages: res.totalPages || 0,
        page: res.page || 1,
      });

      setProgress(100);
    } catch (error) {
      setProgress(100);
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadSubCategories = async () => {
    try {
      setProgress(30);

      const res = await fetchDataFromApi(`/api/subCat?page=1&perPage=1000`);

      setProgress(70);

      setSubCatData({
        subCategoryList: res.subCategoryList || [],
        totalPages: res.totalPages || 0,
        page: res.page || 1,
      });

      setProgress(100);
    } catch (error) {
      setProgress(100);
      console.error(error);
    }
  };

  useEffect(() => {
    loadSubCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openNav = () => {
    setIsOpenNav(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox({
      open: false,
    });
  };

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    themeMode,
    setThemeMode,
    windowWidth,
    openNav,
    isOpenNav,
    setIsOpenNav,
    alertBox,
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    loadCategories,
    subCatData,
    loadSubCategories,
    setUser,
    user,
    isLogin,
    setIsLogin
  };
  return (
    <MyContext.Provider value={values}>
      <LoadingBar
        color="#fc0c65"
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

      {!shouldHideLayout && <Header />}

      <div className="main d-flex">
        {!shouldHideLayout && (
          <>
            <div
              className={`sidebarOverlay d-none ${isOpenNav === true && "show"}`}
              onClick={() => setIsOpenNav(false)}
            ></div>
            <div
              className={`sidebarWrapper ${isToggleSidebar === true ? "toggle" : ""} ${isOpenNav === true ? "open" : ""}`}
            >
              <Sidebar />
            </div>
          </>
        )}

        <div
          className={`content ${shouldHideLayout && "full"}  ${isToggleSidebar ? "toggle" : ""}`}
        >
          <Routes>
            {/* public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            {/* protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/product" element={<ProductList />} />
              <Route path="/product/details/:id" element={<ProductDetails />} />
              <Route path="/product/upload" element={<ProductUpload />} />
              <Route path="/product/edit/:id" element={<EditProduct />} />
              <Route path="/category" element={<Categorylist />} />
              <Route path="/category/add" element={<CategoryAdd />} />
              <Route path="/category/edit/:id" element={<EditCategory />} />
              <Route path="/subCat" element={<SubCatList />} />
              <Route path="/subCat/add" element={<SubCatAdd />} />
              <Route path="/subCat/edit/:id" element={<EditSubCategory />} />
              <Route path="/productWeight/add" element={<AddProductWeight />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/homeBannerSlide/add" element={<AddHomeBanner />} />
              <Route path="/homeBannerSlide" element={<HomeBannerList />} />
              <Route
                path="/homeBannerSlide/edit/:id"
                element={<EditHomeBanner />}
              />
            </Route>
          </Routes>
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default App;

export { MyContext }; // Export the context for use in other components
