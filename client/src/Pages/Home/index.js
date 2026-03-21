import React from "react";
import HomeBanner from "../../components/HomeBanner";
import Button from "@mui/material/Button";
import sidebanner1 from "../../assets/images/sidebanner1.jpeg";
import sidebanner2 from "../../assets/images/sidebanner2.jpeg";
import sidebanner3 from "../../assets/images/sidebanner3.jpeg";
import sidebanner4 from "../../assets/images/sidebanner4.jpeg";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { CiMail } from "react-icons/ci";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductItem from "../../components/ProductItem";
import HomeCat from "../../components/HomeCat";
import banner1 from "../../assets/images/banner1.jpeg";
import banner2 from "../../assets/images/banner2.jpeg";
import newsLetter from "../../assets/images/coupon.png";
import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api.js";
import { useContext } from "react";
import { MyContext } from "../../App";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [homeSlides, setHomeSlides] = useState([]);
  const [vegetablesData, setVegetablesData] = useState([]);

  const [value, setValue] = React.useState(0);

  const context = useContext(MyContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    context.setisHeaderFooterShow(true);

    const location = localStorage.getItem("location") || "All";

    context.setselectedCountry(location);

    fetchDataFromApi(`/api/product/featured?location=${location}`).then(
      (res) => {
        setFeaturedProducts(res);
      },
    );

    fetchDataFromApi(`/api/product?perPage=8&location=${location}`).then(
      (res) => {
        setProductsData(res?.productList || []);
      },
    );

    fetchDataFromApi("/api/homeBanner").then((res) => {
      setHomeSlides(res);
    });
    getProductsByCategory("Vegetables", setVegetablesData);
  }, []);

  const getProductsByCategory = (category, setter, perPage = 8) => {
    fetchDataFromApi(
      `/api/product?perPage=${perPage}&catName=${encodeURIComponent(category)}`,
    )
      .then((res) => {
        setter(res?.productList || []);
      })
      .catch((err) => {
        console.error(`Failed to fetch ${category} products`, err);
        setter([]);
      });
  };

  // const vegetableProducts = productsData?.filter(
  //   (p) => p.category?.name === "Vegetables",
  // );

  useEffect(() => {
    if (context.subCategoryData?.length) {
      setValue(0); // select first tab
      context.setActiveCat(context.subCategoryData[0].subCat);
    }
  }, [context.subCategoryData]);

  useEffect(() => {
    if (!context.activeCat || !context.selectedCountry) return;

    fetchDataFromApi(
      `/api/product?subCatName=${context.activeCat}&location=${context.selectedCountry}`,
    ).then((res) => {
      setFilterData(res?.productList || []);
    });
  }, [context.activeCat, context.selectedCountry]);

  return (
    <>
      {homeSlides?.length !== 0 && <HomeBanner data={homeSlides} />}

      {context.categoryData?.length !== 0 && (
        <HomeCat catData={context.categoryData} />
      )}

      <section className="homeProducts">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="sticky">
                <div className="banner">
                  <img
                    src={sidebanner1}
                    alt="offerbanner"
                    className="cursor w-100"
                    style={{ height: "379px", borderRadius: "7px" }}
                  />
                </div>
                <div className="banner mt-4">
                  <img
                    src={sidebanner2}
                    alt="offerbanner"
                    className="cursor w-100"
                    style={{ height: "379px", borderRadius: "7px" }}
                  />
                </div>
                <div className="banner mt-4">
                  <img
                    src={sidebanner3}
                    alt="offerbanner"
                    className="cursor w-100"
                    style={{ height: "379px", borderRadius: "7px" }}
                  />
                </div>
                <div className="banner mt-4">
                  <img
                    src={sidebanner4}
                    alt="offerbanner"
                    className="cursor w-100"
                    style={{ height: "379px", borderRadius: "7px" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-9 productRow">
              <div className="d-flex align-items-center">
                <div className="info">
                  <h3 className="mb-0 hd">POPULAR PRODUCTS</h3>
                  <p className="textinfo mb-0">
                    Do not miss the current offers until the end of July.
                  </p>
                </div>
                <div className="ml-auto" style={{ maxWidth: "75%" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    className="filterTabs"
                  >
                    {context.subCategoryData?.map((item, index) => {
                      return (
                        <Tab
                          className="item"
                          label={item.subCat}
                          key={item.id}
                          onClick={() => {
                            context.setActiveCat(item.subCat);
                          }}
                        />
                      );
                    })}
                  </Tabs>
                </div>
              </div>

              <div className="product_row w-100 mt-4">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={10}
                  navigation={true}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {filterData?.length !== 0 &&
                    filterData?.map((item, index) => {
                      return (
                        <SwiperSlide key={item.id}>
                          <ProductItem item={item} />
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>

              <div className="d-flex align-items-center mt-5">
                <div className="info">
                  <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                  <p className="textinfo mb-0">
                    New products with updated stocks.
                  </p>
                </div>
              </div>

              <div className="product_row productRow2 w-100 mt-4 d-flex">
                {productsData?.length !== 0 &&
                  productsData?.map((item, index) => (
                    <ProductItem key={item._id || index} item={item} />
                  ))}
              </div>

              <div className="d-flex align-items-center mt-5">
                <div className="info">
                  <h3 className="mb-0 hd">FRESH VEGETABLES</h3>
                  <p className="textinfo mb-0">
                    Freshly picked vegetables from local farms.
                  </p>
                </div>
              </div>

              <div className="product_row w-100 mt-4">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={10}
                  navigation={true}
                  modules={[Navigation]}
                  className="mySwiper"
                >
                  {vegetablesData?.length > 0 &&
                    vegetablesData.map((item, index) => {
                      return (
                        <SwiperSlide key={item._id || index}>
                          <ProductItem item={item} />
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>

              <div className="d-flex mt-4 mb-5 bannerSec">
                <div className="banner">
                  <img
                    src={banner1}
                    alt="offerbanner"
                    className="cursor w-100"
                  />
                </div>
                <div className="banner">
                  <img
                    src={banner2}
                    alt="offerbanner"
                    className="cursor w-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="newsletterSec mt-3 mb-3 d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="text-white"> &#8377;100 discount for your first order</p>
              <h3 className="text-white">Join our newsletter and get...</h3>
              <p className="text-light mb-1">
                Join our email subscription now to get updates <br /> on
                promotions and coupons.
              </p>

              <form className="mt-4">
                <CiMail />
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email address"
                />
                <Button> Subscribe</Button>
              </form>
            </div>

            <div className="col-md-6">
              <img src={newsLetter} alt="newsletter" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
