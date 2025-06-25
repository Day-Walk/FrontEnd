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

const items = [
  { title: "코스보기", url: "/" },
  { title: "장소검색", url: "/search" },
  { title: "챗봇", url: "/chatbot" },
  { title: "혼잡도", url: "/congestion" },
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
      <CircleUserRound
        size={32}
        color={selectedItem === "/profile" ? "#00b493" : "#888"}
        onClick={() => handleClickHeaderItem("/profile")}
        style={{ cursor: "pointer" }}
        strokeWidth={1.5}
      />
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
    const color = selected ? "#333" : "#888";
    switch (title) {
      case "코스보기":
        return <Map size={20} color={color} />;
      case "장소검색":
        return <Search size={20} color={color} />;
      case "챗봇":
        return <BotMessageSquare size={20} color={color} />;
      case "혼잡도":
        return <Radio size={20} color={color} />;
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
            className={styles.item_list}
            key={item.title}
            onClick={() => handleClick(item.url)}
          >
            {getIcon(item.title, isSelected)}
            <span className={isSelected ? styles.selected_item : ""}>
              {item.title}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default Header;
