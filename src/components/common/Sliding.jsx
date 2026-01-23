import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import bg1 from "../../assets/images/bg1.jpg"
import bg2 from "../../assets/images/bg2.jpg";
import bg3 from "../../assets/images/bg3.jpg";


import React from 'react'

export const Sliding = () => {
    const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    autoplay: true,
    arrows: false,
  };
  return (
    <div className="hidden lg:block w-[500px] h-screen overflow-hidden fixed top-0 left-0">
        <Slider {...settings} className="w-full h-screen">
          <div>
            <img src={bg1} alt="Slide 1" className="object-cover w-full h-full" />
          </div>

            <div>
            <img src={bg2} alt="Slide 2" className="object-cover w-full h-full" />
          </div>

            <div>
            <img src={bg3} alt="Slide 3" className="object-cover w-full h-full" />
          </div>
        </Slider>
    </div>
  )
}
