import React, { useEffect, useState } from "react";
import styles from "../Courses.module.css";
import Banner1 from "../../assets/Banner1.webp";
import Banner2 from "../../assets/Banner2.webp";
import Banner3 from "../../assets/Banner3.webp";
import Banner4 from "../../assets/Banner4.webp";
import NoImage from "../../assets/NoImage.webp";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import * as Interfaces from "../interfaces/Interfaces";

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
    }, 3000);
    return () => clearInterval(interval);
  }, [total, current]);

  const goToSlide = (idx: number) => setCurrent(idx);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + total) % total);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % total);

  const [top4Place, setTop4Place] = useState<Interfaces.Top4Place[] | []>([]);

  useEffect(() => {
    const getTop4Place = async () => {
      try {
        const res = await api.get("/click-log/place");
        console.log(res.data);
        setTop4Place(res.data.searchData);
      } catch (error) {
        console.error("Error fetching top 4 places:", error);
      }
    };
    getTop4Place();
  }, []);
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
      <div className={styles.top4Wrapper}>
        <div>
          최근 가장 많이 클릭된 장소&nbsp;
          <span
            style={{
              color: "var(--color-main)",
              fontWeight: "bold",
            }}
          >
            TOP 4!
          </span>
        </div>
        <div className={styles.places}>
          {top4Place?.map((place, i) => (
            <div
              onClick={() => navigate(`/place/${place.placeId}`)}
              key={place.placeId}
              className={styles.bannerPlaces}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div>
                <img src={place.imgUrl ?? NoImage} className={styles.top4Img} />
                <div className={styles.bannerIdx}>{i + 1}</div>
                <div
                  style={{
                    display: "flex",
                    marginLeft: "4px",
                    marginTop: "4px",
                  }}
                >
                  <div className={styles.bannerName}>{place.name}</div>
                  <div className={styles.bannerCategory}>{place.category}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
