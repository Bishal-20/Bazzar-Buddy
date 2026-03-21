import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { BsArrowsFullscreen } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useContext, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";

const ProductItem = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedtoWhislist, setIsAddedtoWhislist] = useState(false);
  const sliderRef = useRef();
  const context = useContext(MyContext);

  var settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
  };

  const viewProductDetails = (id) => {
    context.setisOpenProductModel({
      id: id,
      open: true,
    });
  };

  const handleMouseEnter = (id) => {
    setIsHovered(true);
    sliderRef.current?.slickPlay();
    // const user = JSON.parse(localStorage.getItem("user"));
    // fetchDataFromApi(`/api/wishlist?productId=${id}&userId=${user?.id}`).then(
    //   (res) => {
    //     setIsAddedtoWhislist(res.length !== 0);
    //   },
    // );
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    sliderRef.current?.slickPause();
  };

  useEffect(() => {
    sliderRef.current?.slickPause();
  }, []);

  const addToWhislist = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user !== undefined && user !== null && user !== "") {
        const data = {
          productTitle: props?.item?.name,
          images: props?.item?.images?.images?.[0]?.url,
          rating: props?.item?.rating,
          price: props?.item?.price,
          productId: id,
          userId: user.id,
        };

        await postData(`/api/wishlist/add/`, data);

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Product added to Wishlist",
        });
        fetchDataFromApi(
          `/api/wishlist?productId=${id}&userId=${user?.id}`,
        ).then((res) => {
          setIsAddedtoWhislist(res.length !== 0);
        });
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

  return (
    <>
      <div
        className={` productItem productCard ${props.itemView}`}
        onMouseEnter={() => handleMouseEnter(props.item?.id)}
        onMouseLeave={handleMouseLeave}
      >
        {/* IMAGE AREA */}
        <div className="cardImgWrapper">
          <Link
            to={`/product/${props?.itemView === "recentlyView" ? props?.item?.prodId : props?.item?.id}`}
          >
            <Slider {...settings} ref={sliderRef}>
              {props.item?.images?.images?.map((image, index) => (
                <div key={index}>
                  <img src={image.url} alt="product" />
                </div>
              ))}
            </Slider>
          </Link>

          {/* Discount badge */}
          <span className="discountBadge">{props?.item?.discount}%</span>

          {/* Hover actions */}
          <div className="cardActions">
            <Button onClick={() => viewProductDetails(props.item?.id)}>
              <BsArrowsFullscreen />
            </Button>

            <Button
              className={isAddedtoWhislist ? "active" : ""}
              onClick={() => addToWhislist(props.item?.id)}
            >
              {isAddedtoWhislist ? <FaHeart /> : <CiHeart />}
            </Button>
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="cardBody">
          <h4 className="productTitle">
            {props?.item?.name?.substr(0, 45)}...
          </h4>

          <Rating
            value={props?.item?.rating}
            readOnly
            size="small"
            precision={0.5}
          />

          <span className="stockText">In Stock</span>

          {/* PRICE */}
          <div className="priceRow">
            <span className="oldPrice">Rs {props?.item?.oldPrice}</span>

            <span className="newPrice">Rs {props?.item?.price}</span>
          </div>
        </div>
      </div>
      {/* <ProductModel /> */}
    </>
  );
};

export default ProductItem;
