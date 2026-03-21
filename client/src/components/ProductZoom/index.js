import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { useEffect, useRef, useState } from "react";

const ProductZoom = (props) => {
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();

  const goto = (index) => {
    zoomSlider.current?.slickGoTo(index);
    zoomSliderBig.current?.slickGoTo(index);
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     window.dispatchEvent(new Event("resize"));
  //   }, 100);
  // }, []);

  const bigSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const thumbSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="productZoom">
      <div className="productZoomBig position-relative">
        <div className="badge badge-primary">{props?.discount} %</div>

        <Slider {...bigSettings} ref={zoomSliderBig} className="zoomSliderBig">
          {props.data?.images?.images?.map((image, index) => (
            <div key={index} className="zoom-image-wrapper">
              <InnerImageZoom
                key={image.url}
                src={image.url}
                zoomType="hover"
                zoomScale={1.2}
                hideHint={true}
                className="w-100"
              />
            </div>
          ))}
        </Slider>
      </div>

      <Slider {...thumbSettings} ref={zoomSlider} className="zoomSlider mt-3">
        {props.data?.images?.images?.map((image, index) => (
          <div className="item" key={index} onClick={() => goto(index)}>
            <img src={image.url} className="w-100" alt="thumb" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductZoom;
