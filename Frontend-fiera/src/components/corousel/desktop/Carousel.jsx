import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './Carousel.css';

const CarouselD = () => {
    const images = [
        '/images/licra_banner.png',
        '/images/guayos_banner.png'
    ];

    return (
        <div className='carouselD__container'>
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 5500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop={true}
                spaceBetween={50}
                slidesPerView={1}
            >
                {images.map((src, idx) =>(
                <SwiperSlide key={idx}>
                    <div className="slideD_image">
                        <img src={src} alt={`slide-${idx}`} />
                    </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
    );
};

export default CarouselD;