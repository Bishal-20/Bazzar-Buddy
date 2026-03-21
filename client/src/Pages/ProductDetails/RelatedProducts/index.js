import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import ProductItem from '../../../components/ProductItem';


const RelatedProducts=(props)=>{
    return (
       <>
        <div className='d-flex align-items-center'>
            <div className='info'>
                <h3 className='mb-0 hd'>{props.title}</h3>
            </div>
        </div>

            <div className='product_row w-100 mt-1'>
            <Swiper
            slidesPerView={4}
            spaceBetween={20}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
            >
                {
                    props?.data?.length > 0 && props?.data?.map((item , index)=>{
                        return(
                            <SwiperSlide key={index}> 
                                <ProductItem item={item} itemView={props.itemView}/>
                            </SwiperSlide>
                        )
                    })
                }                
            </Swiper>
        </div>
       </>
    )
}

export default RelatedProducts;