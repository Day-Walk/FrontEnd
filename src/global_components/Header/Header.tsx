import styles from "./Header.module.css";
import Logo from "../../assets/DayWalkLogo.webp";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BotMessageSquare,
  CircleUserRound,
  Map,
  Radio,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

const items = [
  { title: "코스보기", url: "/" },
  { title: "장소검색", url: "/search" },
  { title: "챗봇", url: "/chatbot" },
  { title: "혼잡도", url: "/congestion" },
  { title: "마이페이지", url: "/profile" },
];

const Header = () => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleClickHeaderItem = (url: string) => {
    setSelectedItem(url);
    navigate(url);
  };

  useEffect(() => {
    setSelectedItem(pathname);
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
        selectedItem={selectedItem}
        handleClick={handleClickHeaderItem}
      />
      <div style={{ width: "90px" }}></div>
    </div>
  );
};

interface HeaderItemsProps {
  handleClick: (url: string) => void;
  selectedItem: string | null;
  items: { title: string; url: string }[];
}

const HeaderItems = ({
  handleClick,
  selectedItem,
  items,
}: HeaderItemsProps) => {
  const getIcon = (title: string, selected: boolean) => {
    switch (title) {
      case "코스보기":
        return <Map size={20} className={styles.icon} />;
      case "장소검색":
        return <Search size={20} className={styles.icon} />;
      case "챗봇":
        return <BotMessageSquare size={20} className={styles.icon} />;
      case "혼잡도":
        return <Radio size={20} className={styles.icon} />;
      case "마이페이지":
        return <CircleUserRound size={20} className={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <ul className={styles.item_list_wrapper}>
      {items.map((item) => {
        const isSelected = selectedItem === item.url;
        return (
          <li
            className={`${styles.item_list} ${isSelected ? styles.selected_item : ""}`}
            key={item.title}
            onClick={() => handleClick(item.url)}
          >
            {getIcon(item.title, isSelected)}
            <span>{item.title}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default Header;
