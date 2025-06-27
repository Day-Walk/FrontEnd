import React, { useEffect, useRef, useState } from "react";
import styles from "../Courses.module.css";
import Banner1 from "../../assets/Banner1.png";
import Banner2 from "../../assets/Banner2.png";
import Banner3 from "../../assets/Banner3.png";
import Banner4 from "../../assets/Banner4.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MainBanner = () => {
  const navigate = useNavigate();
  const IMAGES = [
    { src: Banner1, onClick: () => navigate("/chatbot") },
    { src: Banner2, onClick: () => navigate("/congestion") },
    {
      src: Banner3,
      onClick: () => {
        window;
      },
    },
    { src: Banner4, onClick: () => navigate("/search") },
  ];
  const [current, setCurrent] = useState(0);
  const total = IMAGES.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 2000);
    return () => clearInterval(interval);
  }, [total, current]);

  const goToSlide = (idx: number) => setCurrent(idx);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);
  return (
    <div className={styles.bannerWrapper}>
      <div className={styles.banner}>
        <div
          className={styles.slider}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {IMAGES.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              onClick={img.onClick}
              alt={`Banner ${idx + 1}`}
              className={styles.slide}
            />
          ))}
        </div>
        <ChevronLeft
          className={styles.prev}
          color="#fff"
          size={36}
          onClick={prevSlide}
        />
        <ChevronRight
          className={styles.next}
          color="#fff"
          size={36}
          onClick={nextSlide}
        />

        <div className={styles.dots}>
          {IMAGES.map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${idx === current ? styles.activeDot : ""}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      </div>
      <div className={styles.icons}>
        {[1, 2, 3, 4].map((i) => (
          <div style={{ border: "1px solid #ccc" }}>{i}</div>
        ))}
      </div>
    </div>
  );
};

export default MainBanner;
