import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

const HomeBanner = (props) => {
  return (
    <>
      <div className="container-fluid mt-3 p-0">
        <div className="homeBannerSection">
          <Swiper
            slidesPerView={1}
            spaceBetween={15}
            navigation={true}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Navigation, Autoplay]}
            className="mySwiper  homeBannerSwiper"
          >
            {Array.isArray(props?.data) &&
              props.data.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div className="item">
                      <img
                        src={item?.images[0]}
                        alt="homebanner"
                        className="w-100"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default HomeBanner;
