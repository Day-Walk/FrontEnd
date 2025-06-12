import styles from "./Header.module.css";
import Logo from "../../assets/DayWalkLogo.png";
import { useLocation, useNavigate } from "react-router-dom";

import {
  BotMessageSquare,
  CircleUserRound,
  Map,
  Radio,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<number>(0);

  const handleClickHeaderItem = (index: number) => {
    setSelectedItem(index);

    // 페이지 이동
    const routes = ["/", "/search", "/chatbot", "/congestion", "/profile"];
    navigate(routes[index]);
  };

  const pathname = useLocation().pathname;
  useEffect(() => {
    console.log("pathname:", pathname);

    switch (pathname) {
      case "/":
        setSelectedItem(0);
        break;
      case "/search":
        setSelectedItem(1);
        break;
      case "/chatbot":
        setSelectedItem(2);
        break;
      case "/congestion":
        setSelectedItem(3);
        break;
      case "/profile":
        setSelectedItem(4);
        break;
      default:
        setSelectedItem(0);
        break;
    }
  }, [pathname]);

  return (
    <div className={styles.header_wrapper}>
      <img
        onClick={() => handleClickHeaderItem(0)}
        src={Logo}
        alt="Logo"
        className={styles.header_logo}
      />
      <HeaderItems
        handleClick={handleClickHeaderItem}
        selectedItem={selectedItem}
      />
      <CircleUserRound
        size={32}
        color={selectedItem === 4 ? "#00B493" : "#333333"}
        onClick={() => handleClickHeaderItem(4)}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

interface HeaderItemsProps {
  handleClick: (index: number) => void;
  selectedItem: number;
}

const HeaderItems = ({ handleClick, selectedItem }: HeaderItemsProps) => {
  const iconInfo = {
    size: 24,
    color: "#333333",
  };
  // todo : url 추가
  const items = [
    {
      title: "코스보기",
      icon: <Map size={iconInfo.size} color={iconInfo.color} />,
    },
    {
      title: "장소검색",
      icon: <Search size={iconInfo.size} color={iconInfo.color} />,
    },
    {
      title: "챗봇",
      icon: <BotMessageSquare size={iconInfo.size} color={iconInfo.color} />,
    },
    {
      title: "혼잡도",
      icon: <Radio size={iconInfo.size} color={iconInfo.color} />,
    },
  ];
  return (
    <ul className={styles.item_list_wrapper}>
      {items.map((item, index) => (
        <li
          className={styles.item_list}
          key={item.title}
          onClick={() => handleClick(index)}
        >
          {item.icon}
          <span
            className={`${selectedItem === index ? styles.selected_item : ""}`}
          >
            {item.title}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Header;
