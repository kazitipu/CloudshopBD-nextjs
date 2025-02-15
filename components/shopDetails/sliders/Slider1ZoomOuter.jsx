"use client";
import Drift from "drift-zoom";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Slider1ZoomOuter({
  currentColor = "Beige",
  product,
  getPicture,
  variation,
}) {
  let images = [];
  if (product && product.id) {
    if (product.pictures.length > 0 && product.pictures2.length > 0) {
      const filteredPictures2 = product.pictures2.filter(
        (pic) => pic !== "/static/media/addProduct.3dff302b.png"
      );
      images = [...product.pictures, ...filteredPictures2];
    } else {
      images = [...product.pictures];
    }
  }

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);
  useEffect(() => {
    const slideIndex = 0;

    swiperRef.current.slideTo(slideIndex);
  }, [currentColor]);
  useEffect(() => {
    // Function to initialize Drift
    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      driftAll.forEach((el) => {
        new Drift(el, {
          zoomFactor: 2,
          paneContainer: pane,
          inlinePane: false,
          handleTouch: false,
          hoverBoundingBox: true,
          containInline: true,
        });
      });
    };
    imageZoom();
    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup event listeners on component unmount
    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []); // Empty dependency array to run only once on mount

  let images2 = images;
  if (
    getPicture &&
    variation &&
    variation.id &&
    variation.pictures &&
    variation.pictures.length > 0
  ) {
    images2 = variation.pictures;
  }
  console.log(variation);
  return (
    <>
      <Swiper
        dir="ltr"
        direction="vertical"
        spaceBetween={10}
        slidesPerView={6}
        className="tf-product-media-thumbs other-image-zoom overflow-for-mobile"
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        breakpoints={{
          0: {
            direction: "horizontal",
          },
          1150: {
            direction: "vertical",
          },
        }}
      >
        {images2.map((slide, index) => (
          <SwiperSlide key={index} className="stagger-item">
            <div className="item">
              <Image
                className="lazyload"
                data-src={slide}
                alt={""}
                src={slide} // Optional fallback for non-lazy loading
                width={300}
                height={400}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Gallery>
        <Swiper
          dir="ltr"
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="tf-product-media-main"
          id="gallery-swiper-started"
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Thumbs, Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {images2.map((slide, index) => (
            <SwiperSlide key={index}>
              <Item original={slide} thumbnail={slide} width={650} height={750}>
                {({ ref, open }) => (
                  <a
                    className="item"
                    data-pswp-width={100}
                    data-pswp-height={200}
                    onClick={open}
                  >
                    <Image
                      className="tf-image-zoom lazyload"
                      data-zoom={slide}
                      data-src={slide}
                      ref={ref}
                      alt="image"
                      width={100}
                      height={200}
                      src={slide} // Optional fallback for non-lazy loading
                    />
                  </a>
                )}
              </Item>
            </SwiperSlide>
          ))}

          {/* Navigation buttons */}
          <div className="swiper-button-next button-style-arrow thumbs-next"></div>
          <div className="swiper-button-prev button-style-arrow thumbs-prev"></div>
        </Swiper>{" "}
      </Gallery>
    </>
  );
}
