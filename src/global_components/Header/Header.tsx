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

const iconInfo = {
  size: 24,
  color: "#333333",
};
const items = [
  {
    title: "코스보기",
    icon: <Map size={iconInfo.size} color={iconInfo.color} />,
    url: "/",
  },
  {
    title: "장소검색",
    icon: <Search size={iconInfo.size} color={iconInfo.color} />,
    url: "/search",
  },
  {
    title: "챗봇",
    icon: <BotMessageSquare size={iconInfo.size} color={iconInfo.color} />,
    url: "/chatbot",
  },
  {
    title: "혼잡도",
    icon: <Radio size={iconInfo.size} color={iconInfo.color} />,
    url: "/congestion",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string | null>("/");

  const handleClickHeaderItem = (url: string) => {
    setSelectedItem(url);
    navigate(url);
  };

  const pathname = useLocation().pathname;
  useEffect(() => {
    console.log("pathname:", pathname);

    if (pathname === selectedItem) return;

    if (pathname === "/") {
      setSelectedItem("/");
    } else if (pathname === "/search") {
      setSelectedItem("/search");
    } else if (pathname === "/chatbot") {
      setSelectedItem("/chatbot");
    } else if (pathname === "/congestion") {
      setSelectedItem("/congestion");
    } else if (pathname === "/profile") {
      setSelectedItem("/profile");
    } else {
      setSelectedItem(null);
    }
  }, [pathname]);

  return (
    <div className={styles.header_wrapper}>
      <img
        onClick={() => handleClickHeaderItem("/")}
        src={Logo}
        alt="Logo"
        className={styles.header_logo}
      />
      <HeaderItems
        items={items}
        handleClick={handleClickHeaderItem}
        selectedItem={selectedItem}
      />
      <CircleUserRound
        size={32}
        color={selectedItem === "/profile" ? "#00B493" : "#333333"}
        onClick={() => handleClickHeaderItem("/profile")}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
};

interface HeaderItemsProps {
  handleClick: (url: string) => void;
  selectedItem: string | null;
  items: { title: string; icon: JSX.Element; url: string }[];
}

const HeaderItems = ({
  handleClick,
  selectedItem,
  items,
}: HeaderItemsProps) => {
  return (
    <ul className={styles.item_list_wrapper}>
      {items.map((item) => (
        <li
          className={styles.item_list}
          key={item.title}
          onClick={() => handleClick(item.url)}
        >
          {item.icon}
          <span
            className={`${selectedItem === item.url ? styles.selected_item : ""}`}
          >
            {item.title}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Header;
