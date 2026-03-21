import React from "react";
import { useRef, useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { MdBrandingWatermark } from "react-icons/md";
import { PiDiamondsFourFill } from "react-icons/pi";
import { IoPricetagsSharp } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { PiStarHalfFill } from "react-icons/pi";
import { PiResizeFill } from "react-icons/pi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Rating from "@mui/material/Rating";

import Slider from "react-slick";

const ProductDetails = () => {
  const productSliderBig = useRef(null);
  const productSliderSml = useRef(null);
  const [productData, setproductData] = useState(null);
  const [reviewsData, setReviewsData] = useState([]);

  const { id } = useParams();

  var productsSlider = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  var productssmlSlider = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };

  const goToSlide = (index) => {
    productSliderBig.current.slickGoTo(index);
    productSliderSml.current.slickGoTo(index);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("ID:", id);
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      setproductData(res);
    });
    fetchDataFromApi(`/api/productReview?productId=${id}`).then((res) => {
      setReviewsData(res);
    });
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
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
    };
  });
  return (
    <div className="productContent w-100">
      <div className="card shadow border-0 w-100 p-4 res-col">
        <h4>Product View</h4>
        <nav className="breadcrumbs">
          <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="a"
                href="/"
                label="Dashboard"
                className="breadcrumbs"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb
                component="a"
                href="/product"
                label="Product"
                className="breadcrumbs"
              />
              <StyledBreadcrumb
                component="a"
                href="/product/details"
                label="Product View"
                className="breadcrumbs"
              />
            </Breadcrumbs>
          </div>
        </nav>
      </div>
      <div className="card productDetailsSection">
        <div className="row">
          <div className="col-md-5">
            <div className="slideWrapper pt-3 pb-3 pl-4 pr-4">
              <h6 className="mb-3">Product Gallery</h6>
              <Slider
                {...productsSlider}
                ref={productSliderBig}
                className="sliderBig mb-3"
              >
                {productData?.images?.images?.length !== 0 &&
                  productData?.images?.images?.map((img, index) => {
                    return (
                      <div className="item" key={index}>
                        <img src={img.url} alt="product" className="w-100" />
                      </div>
                    );
                  })}
              </Slider>
              <Slider
                {...productssmlSlider}
                ref={productSliderSml}
                className="sliderSml"
              >
                {productData?.images?.images?.length !== 0 &&
                  productData?.images?.images?.map((img, index) => {
                    return (
                      <div
                        className="item "
                        onClick={() => goToSlide(index)}
                        key={index}
                      >
                        <img src={img.url} alt="product" className="w-100" />
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
          <div className="col-md-7">
            <div className="slideWrapper pt-3 pb-3 pl-4 pr-4">
              <h6 className="mb-3">Product Details</h6>

              <h4>{productData?.name}</h4>
              <div className="productInfo mt-3">
                <div className="row mb-2">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon">
                      <MdBrandingWatermark />
                    </span>
                    <span className="name">Brand</span>
                  </div>
                  <div className="col-sm-9">
                    : <span>{productData?.brand}</span>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon">
                      <PiDiamondsFourFill />
                    </span>
                    <span className="name">Category</span>
                  </div>
                  <div className="col-sm-9">
                    : <span>{productData?.category?.name}</span>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon">
                      <PiDiamondsFourFill />
                    </span>
                    <span className="name">Sub Cat</span>
                  </div>
                  <div className="col-sm-9">
                    : <span>{productData?.subCat?.subCat}</span>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon">
                      <PiResizeFill />
                    </span>
                    <span className="name">Weight</span>
                  </div>
                  <div className="col-sm-9">
                    :{" "}
                    <span>
                      <ul className="list list-inline tags sml">
                        {productData?.productWeight?.map((item, index) => (
                          <li className="list-inline-item" key={item._id}>
                            <span>{item.productWeight}</span>
                          </li>
                        ))}
                      </ul>
                    </span>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon">
                      <IoPricetagsSharp />
                    </span>
                    <span className="name">Price</span>
                  </div>
                  <div className="col-sm-9">
                    :{" "}
                    <span className="newPrice">
                      {" "}
                      &#8377; {productData?.price}
                    </span>
                    <span className="oldPrice text-danger">
                      {" "}
                      &#8377; {productData?.oldPrice}
                    </span>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon">
                      <FaShoppingCart />
                    </span>
                    <span className="name">Stock</span>
                  </div>
                  <div className="col-sm-9">
                    : <span> {productData?.countInStock} </span>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon">
                      <PiStarHalfFill />
                    </span>
                    <span className="name">Review</span>
                  </div>
                  <div className="col-sm-9">
                    : <span> ({reviewsData?.length}) review </span>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon">
                      <IoMdCheckmarkCircle />
                    </span>
                    <span className="name">Published</span>
                  </div>
                  <div className="col-sm-9">
                    : <span> {formatDate(productData?.dateCreated)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h6 className="mt-4 mb-3">Product description</h6>
          <p>{productData?.description}</p>
          <br />
          <h6 className="mt-4 mb-4">Customer_reviews</h6>

          <div className="reviewSection">
            <div className="reviewsRow">
              <div className="row">
                <div className="col-sm-7 d-flex">
                  <div className="d-flex flex-column">
                    {reviewsData?.length > 0 &&
                      reviewsData
                        ?.slice(0)
                        ?.reverse()
                        ?.map((item, index) => {
                          return (
                            <div className="p-4 mb-3">
                              <div className="d-flex align-items-center mb-2">
                                <h6 className="mb-0 fw-semibold">
                                  {item?.customerName}
                                </h6>

                                <div className="ml-auto d-flex align-items-center">
                                  <Rating
                                    value={item?.customerRating}
                                    readOnly
                                    size="small"
                                  />
                                </div>
                              </div>

                              <span className="review-date mb-2">
                                {formatDate(item?.dateCreated)}
                              </span>

                              <p className="review-text mb-0">{item?.review}</p>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
