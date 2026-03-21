import { Swiper, SwiperSlide } from "swiper/react";
import React, { useEffect, useState } from "react";
import "swiper/css";
import { Link } from "react-router-dom";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const HomeCat = (props) => {
  return (
    <section className="homeCat">
      <div className="container">
        <h3 className="mb-3 hd">Featured Categories</h3>
        <Swiper
          slidesPerView={10}
          spaceBetween={10}
          navigation={true}
          slidesPerGroup={3}
          modules={[Navigation]}
          className="mySwiper"
        >
          {props.catData?.length !== 0 &&
            props.catData.map((cat) => {
              return (
                <SwiperSlide key={cat._id}>
                  <Link to={`/cat/${cat.id}`} className="nav-link">
                    <div
                      className="item text-center cursor"
                      style={{ background: cat.color }}
                    >
                      <img
                        src={cat.images?.[0]?.images?.[0]?.url}
                        alt={cat.name}
                      />
                      <h6>{cat.name}</h6>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeCat;
