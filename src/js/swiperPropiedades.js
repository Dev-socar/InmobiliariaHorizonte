import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
(function () {
    if (document.querySelector(".destacados")) {
      const opciones = {
        slidesPerView: 1,
        spaceBetween: 20,
        freeMode: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          }
        },
      };
      Swiper.use(Navigation);
      new Swiper(".slider", opciones);
    }
})();
