import Rating from "@mui/material/Rating";
import ProductZoom from "../../components/ProductZoom";
import QuantityBox from "../../components/QuantityBox";
import Button from "@mui/material/Button";
import { CiHeart } from "react-icons/ci";
import { MdOutlineCompareArrows } from "react-icons/md";
import { MdLocalGroceryStore } from "react-icons/md";
import { useEffect, useState, useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { MyContext } from "../../App";
import RelatedProducts from "./RelatedProducts";

import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";

const ProductDetails = () => {
  const [activeWeight, setActiveWeight] = useState(null);

  const [activeTabs, setactiveTabs] = useState(0);
  const [productData, setproductData] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
  let [cartFields, setCartFields] = useState({});
  const [productQuantity, setProductQuantity] = useState();
  const [tabError, setTabError] = useState(false);
  const [rating, setRating] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddedtoWhislist, setIsAddedtoWhislist] = useState(false);
  const [reviewsData, setReviewsData] = useState([]);
  const [reviews, setReviews] = useState({
    productId: "",
    customerName: "",
    customerId: "",
    review: "",
    customerRating: "",
  });
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
  const isReviewInvalid = !reviews.review.trim() || rating === 0;

  const { id } = useParams();

  const context = useContext(MyContext);

  const isActive = (index) => {
    setActiveWeight(index);
    setTabError(false);
  };

  const quantity = (val) => {
    setProductQuantity(val);
  };
  const addtoCart = () => {
    if (activeWeight !== null) {
      const user = JSON.parse(localStorage.getItem("user"));
      cartFields.productTitle = productData?.name;
      cartFields.images = productData?.images?.images[0]?.url;
      cartFields.rating = productData?.rating;
      cartFields.price = productData?.price;
      cartFields.quantity = productQuantity;
      cartFields.subTotal =
        parseInt(productData?.price) * parseInt(productQuantity);
      cartFields.productId = productData?.id;
      cartFields.userId = user?.id;

      context.addToCart(cartFields);
    } else {
      setTabError(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveWeight(null);
    fetchDataFromApi(`/api/product/${id}`).then((res) => {
      setproductData(res);
      postData("/api/product/recentlyViewed", { id: res._id }).then(() => {
        fetchDataFromApi(`/api/product/recentlyViewed`).then((response) => {
          setRecentlyViewedProducts(response?.productList);
        });
      });
      fetchDataFromApi(`/api/product?catId=${res?.category?.id}`).then(
        (res) => {
          const relatedProducts = res?.productList?.filter(
            (item) => item.id !== id,
          );
          setRelatedProducts(relatedProducts);
        },
      );

      if (productData?.productWeight === undefined) {
        setActiveWeight(1);
      }

      fetchDataFromApi(`/api/productReview?productId=${id}`).then((res) => {
        setReviewsData(res);
      });
    });
  }, [id]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setReviews((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeRating = (e, newValue) => {
    setRating(newValue);
    setReviews((prev) => ({
      ...prev,
      customerRating: newValue,
    }));
  };

  const addReview = (e) => {
    e.preventDefault();
    if (!reviews.review.trim() || rating === 0) return;
    const user = JSON.parse(localStorage.getItem("user"));

    reviews.customerName = user?.name;
    reviews.customerId = user?.id;
    reviews.productId = id;

    setIsLoading(true);
    postData("/api/productReview/add", reviews).then((res) => {
      setIsLoading(false);
      setReviews({ review: "" });
      setRating(1);
      setReviews({
        review: "",
        customerRating: 1,
      });
      fetchDataFromApi(`/api/productReview?productId=${id}`).then((res) => {
        setReviewsData(res);
      });
    });
  };

  const reviewCount = reviewsData?.length || 0;

  const addToWhislist = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user !== undefined && user !== null && user !== "") {
        const data = {
          productTitle: productData?.name,
          images: productData?.images?.images?.[0]?.url,
          rating: productData?.rating,
          price: productData?.price,
          productId: productData?.id,
          userId: user.id,
        };

        await postData(`/api/wishlist/add/`, data);

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Product added to Wishlist",
        });
        setIsAddedtoWhislist(true);
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Please login to Continue",
        });
      }
    } catch (err) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: err?.response?.data?.msg || "Already in Wishlist",
      });
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetchDataFromApi(`/api/wishlist?productId=${id}&userId=${user?.id}`).then(
      (res) => {
        setIsAddedtoWhislist(res.length !== 0);
      },
    );
  }, [id]);

  const selectedItem = () => {};
  return (
    <>
      <section className="productDetails section">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="product-image-wrapper">
                <ProductZoom
                  data={productData}
                  discount={productData?.discount}
                />
              </div>
            </div>
            <div className="col-md-7 pl-5">
              <h2 className="hd text-capitalize">{productData?.name}</h2>
              <ul className="list list-inline d-flex align-items-center">
                <li className="list-inline-item">
                  <div className="d-flex align-items-center">
                    <span className="text mr-2">Brand:</span>
                    <span className="mr-4">{productData?.brand}</span>
                  </div>
                </li>
                <li className="list-inline-item">
                  <Rating
                    className="mt-2 mb-2"
                    name="read-only"
                    value={Number(productData?.rating || 0)}
                    readOnly
                    size="small"
                    precision={0.5}
                  />

                  <span className="cursor ml-2 text">{reviewsData?.length || 0} review{reviewsData?.length !== 1 ? "s" : ""}</span>
                </li>
              </ul>

              <div className="d-flex info">
                <span className="oldPrice">Rs{productData?.oldPrice}</span>
                <span className="newPrice text-danger ml-2">
                  Rs{productData?.price}
                </span>
              </div>

              <span className="badge badge-success mt-3">IN STOCK</span>

              <p className="mt-3">{productData?.description}</p>

              <div className="productSize d-flex align-items-center">
                <span>Weight:</span>
                <ul
                  className={`list list-inline mb-0 pl-4 ${tabError === true && "error"}`}
                >
                  {productData?.productWeight?.map((item, index) => (
                    <li className="list-inline-item" key={item._id}>
                      <a
                        href="#"
                        className={`tag ${activeWeight === index ? "active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          isActive(index);
                        }}
                      >
                        {item.productWeight}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="d-flex align-items-center mt-3">
                <QuantityBox quantity={quantity} selectedItem={selectedItem} />
                <Button
                  className="btn-blue btn-lg btn-big btn-round ml-3"
                  onClick={() => addtoCart()}
                >
                  <MdLocalGroceryStore /> &nbsp;{" "}
                  {context.addingInCart === true ? "adding..." : "Add to Cart"}
                </Button>
              </div>

              <div className="d-flex align-items-center mt-5 actions">
                <Button
                  className="btn-round btn-sml"
                  variant="outlined"
                  onClick={() => addToWhislist(id)}
                >
                  {isAddedtoWhislist === true ? (
                    <>
                      <FaHeart className="text-danger" /> &nbsp; Added To
                      Wishlist
                    </>
                  ) : (
                    <>
                      <CiHeart /> &nbsp; Add To Wishlist
                    </>
                  )}
                </Button>
                <Button className="btn-round btn-sml ml-3" variant="outlined">
                  {" "}
                  <MdOutlineCompareArrows /> &nbsp; Compare
                </Button>
              </div>
            </div>
          </div>

          <div className="card mt-5 p-5 detailsPageTabs">
            <div className="customTabs">
              <ul className="list list-inline">
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 0 && "active"}`}
                    onClick={() => setactiveTabs(0)}
                  >
                    Description
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 1 && "active"}`}
                    onClick={() => setactiveTabs(1)}
                  >
                    Reviews ({reviewsData?.length || 0})
                  </Button>
                </li>
              </ul>

              <br />
              {activeTabs === 0 && (
                <div className="tabContents">
                  <p>{productData?.description}</p>
                </div>
              )}

              {activeTabs === 1 && (
                <div className="tabContent">
                  <div className="row">
                    <div className="col-md-12">
                      <h3>Rating & Reviews</h3>
                      <br />
                      {reviewsData?.length > 0 &&
                        reviewsData
                          ?.slice(0)
                          ?.reverse()
                          ?.map((item, index) => {
                            return (
                              <div className="card review-card p-4 mb-3">
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

                                <p className="review-text mb-0">
                                  {item?.review}
                                </p>
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <br />

            <form className="reviewForm" onSubmit={addReview}>
              <h4>Add a review</h4> <br />
              <div className="form-group">
                <textarea
                  className="form-control"
                  placeholder="Write a Review"
                  name="review"
                  value={reviews.review}
                  onChange={onChangeInput}
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <Rating
                      name="rating"
                      value={rating}
                      onChange={changeRating}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mr-3">
                <Button
                  type="submit"
                  className="btn-g btn-lg"
                  disabled={isLoading || isReviewInvalid}
                >
                  {isLoading ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </div>
          <br />
          <br />
          {relatedProducts?.length !== 0 && (
            <RelatedProducts title="RELATED PRODUCTS" data={relatedProducts} />
          )}
          <br />
          <br />
          {recentlyViewedProducts?.length > 0 && (
            <RelatedProducts
              title="RECENTLY VIEW PRODUCTS"
              data={recentlyViewedProducts}
              itemView={"recentlyView"}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
